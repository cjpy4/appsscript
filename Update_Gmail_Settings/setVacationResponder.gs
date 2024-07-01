let userEmail = '';
function doGet() {
  userEmail = Session.getActiveUser().getEmail();
  turnOnAutoResponder('Stefan is a Jerry');
}

function turnOnAutoResponder(reason) {
  var currentTime = (new Date()).getTime();
  Gmail.Users.Settings.updateVacation({
    enableAutoReply: true,
    responseSubject: reason,
    responseBodyHtml: "I'm out of the office today; will be back on the next business day.<br><br><i>Created by Attendance Bot!</i>",
    restrictToContacts: true,
    restrictToDomain: true,
    startTime: currentTime,
    endTime: currentTime + 1
  }, 'me');
}

function apiCall(userId) {
  // Make a POST request with a JSON payload.
var data = {
  "responseSubject": "What if God was one of us"
};
var options = {
  'method' : 'PUT',
  'contentType': 'application/json',
  // Convert the JavaScript object to a JSON string.
  'payload' : JSON.stringify(data)
};
UrlFetchApp.fetch(`https://gmail.googleapis.com/gmail/v1/users/${userId}/settings/vacation`, options);
console.log('Call made');
}