function syncCalendars() {
  /**
 * Retrieve and log events from the given calendar that have been modified
 * since the last sync. If the sync token is missing or invalid, log all
 * events from up to a month ago (a full sync).
 *
 * @param {string} calendarId The ID of the calender to retrieve events from.
 * @param {boolean} fullSync If true, throw out any existing sync token and
 *        perform a full sync; if false, use the existing sync token if possible.
 */
function logSyncedEvents(calendarId, fullSync) {
  const properties = PropertiesService.getUserProperties();
  const options = {
    maxResults: 100
  };
  const syncToken = properties.getProperty('syncToken');
  if (syncToken && !fullSync) {
    options.syncToken = syncToken;
  } else {
    // Sync events up to thirty days in the past.
    options.timeMin = getRelativeDate(-30, 0).toISOString();
  }
  // Retrieve events one page at a time.
  let events;
  let pageToken;
  do {
    try {
      options.pageToken = pageToken;
      events = Calendar.Events.list(calendarId, options);
    } catch (e) {
      // Check to see if the sync token was invalidated by the server;
      // if so, perform a full sync instead.
      if (e.message === 'Sync token is no longer valid, a full sync is required.') {
        properties.deleteProperty('syncToken');
        logSyncedEvents(calendarId, true);
        return;
      }
      throw new Error(e.message);
    }
    if (events.items && events.items.length === 0) {
      console.log('No events found.');
      return;
    }
    for (const event of events.items) {
      if (event.status === 'cancelled') {
        console.log('Event id %s was cancelled.', event.id);
        return;
      }
      if (event.start.date) {
        const start = new Date(event.start.date);
        console.log('%s (%s)', event.summary, start.toLocaleDateString());
        return;
      }
      // Events that don't last all day; they have defined start times.
      const start = new Date(event.start.dateTime);
      console.log('%s (%s)', event.summary, start.toLocaleString());
    }
    pageToken = events.nextPageToken;
  } while (pageToken);
  properties.setProperty('syncToken', events.nextSyncToken);
}
}
