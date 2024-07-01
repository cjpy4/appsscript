

function convertFile() {
  var folder = DriveApp.getFolderById("1TUEd1ILgOPLzJIrWT6QnKmU0OGI6JHZI");
  var files = folder.getFiles();
  
  while (files.hasNext()) {
    var file = files.next();
    var fileName = file.getName();
    var fileId = file.getId();
    var content = file.getBlob().getDataAsString();
    console.log(file);
    console.log(fileName);
    console.log(fileId);
    console.log(content);
    // Perform OCR operation on the file
  var options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'x-goog-api-key': 'AIzaSyBH0sKvBUc0pRTPWAx4Pn7MZh_Ma-Av4xA',
  },
  body: {
      "requests": [
        {
          "image": {
            "source": {
              "imageUri": "https://drive.google.com/file/d/1NuyiVMP2Cqf8mZAV1yuN3q8n0TqLcoSB/view"
            }
           },
           "features": [
             {
               "type": "DOCUMENT_TEXT_DETECTION"
             }
           ]
        }
      ]
    }
}
let response = UrlFetchApp.fetch('https://vision.googleapis.com/v1/images:annotate', options)

console.log(response);
//let parsed = response.json();

//var convertedText = parsed['responses']['textAnotations']['text'];
//console.log(convertedText);

// Assume that `data` is the JSON object returned by the API
//var downloadUrl = data.downloadUrl;
//var fileName = data.fileName;

//var response = UrlFetchApp.fetch(downloadUrl);
//var fileBlob = response.getBlob();

//var folder = DriveApp.getFolderById("folder_id");
//var file = folder.createFile(fileBlob);
//file.setName(fileName);


    // Create new PDF with the OCR converted text as the body
    // Add the new PDF to the Logsed/pages folder
  }
}
