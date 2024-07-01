function myFunction() {
  let ss = SpreadsheetApp.openById("1E2bmkmiyiJUqVhyB8N9geVDlIs3fBV5KU6qYp4sxYRs");
  let sheet = getSheetById("1E2bmkmiyiJUqVhyB8N9geVDlIs3fBV5KU6qYp4sxYRs", 423377354);
  const data = sheet.getDataRange().getValues();
  let newData = [];
  for (var i in data) {
  let row = data[i];
  if(!row[0]){continue}
  newData.push(row);
  }
  console.log('rows pushed');
  if(newData.length>0) {
    sheet.clearContents();
    sheet.getRange(1, 1, newData.length, newData[0].length).setValues(newData);
} else{ console.log('Uh oh');}
}
