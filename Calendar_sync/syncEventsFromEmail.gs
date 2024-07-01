function emailTrigger() {

  var label = GmailApp.getUserLabelByName('New Cal Update');
  var newLabel = GmailApp.getUserLabelByName('Processed Cal Updates');

  if(label != null){
    var threads = label.getThreads();
    for (var i=0; i<threads.length; i++) {
      let message = threads[i].getMessages()[0].getPlainBody().replace( /[\r\n]+/gm, "" );
      console.log(message.replace( /[\r\n]+/gm, "" ));
      console.log(message.charCodeAt(176));
     // console.log(message[175]+message[176]+message[177]+message[178]+message[179]+message[180]+message[181]+message[182]+message[183]+message[184]);
      const messageObj = JSON.parse(message);
      const changeType = messageObj.ChangeType;
      const title = messageObj.Title;
      const startTime = new Date(messageObj.StartTime);
      const endTime = new Date(messageObj.EndTime);
      const timeZone = messageObj.TimeZone;
      const description = messageObj.Description; 
      const recurrence = messageObj.Recurrence;
      const id = messageObj.id;

     
      var options = {
          description: description
        }
      console.log(id);
      console.log(startTime);
      
      if (changeType == 'added'){
        if(recurrence == 'none'){
          createSingleEvent(title, startTime, endTime, options, id);
        } else {
          createEventSeries(title, startTime, endTime, recurrence, options, id);
        }
      } else if (changeType == 'updated') {
        updateEvent(id, title, startTime, endTime, recurrence, description);
      } else if (changeType == 'deleted') {
        console.log('deleted')
      } else {
        console.log('no valid chnge type found');
      }

      //threads[i].removeLabel(label);
      //threads[i].addLabel(newLabel);
      //run whatever else here
    }
  }

}

var calendar = CalendarApp.getOwnedCalendarById('cj@grease.solutions');

function createSingleEvent(title, startTime, endTime, options, tag) {
  calendar.createEvent(title, startTime, endTime, options).setTag('id', tag);
}

function createEventSeries(title, startTime, endTime, recurrence, options, tag) {
  calendar.createEventSeries(title, startTime, endTime, recurrence, options).setTag('id', tag);
}

function updateEvent(eventId, title, startTime, endTime, recurrence, description) {
  let endDate = new Date(); 
  let month = endDate.getMonth();
  let day = endDate.getDate();
  let startDate = new Date();
  startDate.setDate(day - 1);
  endDate.setMonth(month + 12, day);
  console.log(startDate);
  console.log(endDate);

  let events = calendar.getEvents(startDate, endDate);

  for (event of events) {
    let id = event.getTag('id')
    if(id == eventId){
      event.setTime(startTime, endTime);
      event.setTitle(title);
      event.setDescription(description);
    }
  }
}

function deleteEvent() {

}

function getLabels(){
  var labels = GmailApp.getUserLabels();
  for(i=0; i<labels.length; i++){
    Logger.log(labels[i].getName());
  }
}
