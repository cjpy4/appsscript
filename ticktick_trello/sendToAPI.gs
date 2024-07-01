function sendTaskData() {
  // Make a POST request with a JSON payload.
  var tasks = getJsonArrayFromData();
  var data = {};
  for (var i in tasks){
    data = tasks[i];
    var options = {
      'method' : 'post',
      'contentType': 'application/json',
      // Convert the JavaScript object to a JSON string.
      'payload' : JSON.stringify(data)
    };
    console.log(data);
    console.log(options.payload);
    UrlFetchApp.fetch('http://e1e3-99-70-229-122.ngrok.io', options);
  }
}
