function myFunction() {
  let ss = SpreadsheetApp.openById("1E2bmkmiyiJUqVhyB8N9geVDlIs3fBV5KU6qYp4sxYRs");
  let sheet = getSheetById("1E2bmkmiyiJUqVhyB8N9geVDlIs3fBV5KU6qYp4sxYRs", 423377354);
  let dupeSheet = getSheetById("1YSr0OjhmHKHYz8O7YCFAA51-QUPVtrjXJvKxLfrOBAM",249264600);
console.log(dupeSheet.getName());
  // Turn Actions sheet into an array of its rows, create arrays to sepearate duplicates form non-duplicates.  
  const data = sheet.getDataRange().getValues();
  let newData = [];
  let dupes =[];
  newData.push(data);
  console.log(data[2]);
 // console.log(newData[0][0]);
}
