/**
 * Removes duplicate rows from the "Actions" sheet and copies them to the "Actions Archive" sheet.
 */

function removeDuplicates() {

  // Get Actions workbook, Actions sheet, and archive sheet using their IDs
  let ss = SpreadsheetApp.openById("1E2bmkmiyiJUqVhyB8N9geVDlIs3fBV5KU6qYp4sxYRs");
  let sheet = getSheetById("1E2bmkmiyiJUqVhyB8N9geVDlIs3fBV5KU6qYp4sxYRs", 423377354);
  let dupeSheet = getSheetById("1YSr0OjhmHKHYz8O7YCFAA51-QUPVtrjXJvKxLfrOBAM",249264600);
console.log('Name of selected Archive sheet: ' + dupeSheet.getName());
  // Turn Actions sheet into an array of its rows, create arrays to sepearate duplicates form non-duplicates.  
  const data = sheet.getDataRange().getValues();
  //console.log(data);
  let newData = [];
  let dupes =[];
  // let trimmedData = [];
  //tempData.push(data);
  /*
  for (var i in data){
   let trimmedRow = [data[i][3].toString(), data[i][12], data[i][13]];
   trimmedData.push(trimmedRow)
  }
  console.log(trimmedData[2]);
  console.log(trimmedData[3]);
  console.log(trimmedData[4]);
  console.log(trimmedData[5]);

    for (var i in data){
    let trim = [data[i][3].toString(), data[i][12], data[i][13]];
    console.log(trim);
    if(trimmedData.includes(trim)){
      dupes.push(data[i]);
    } else {
      newData.push(data[i]);
    }
  }
  */

  // Loop through each row in the Actions sheet array (data), add row to newData array if it is not already present. If it is present, mark as duplicate and add to "dupes" array. 
  for (var i in data) {
    let row = data[i];
    if (!row[0]) {continue} 
    let duplicate = false;
    for (var j in newData) {
      if (row[3].toString() !== newData[j][3].toString() || row[12] !== newData[j][12] || row[13] !== newData[j][13] || row[19] == "One-Time" || newData[j][19] == "One-Time") {
        continue 
      } else {duplicate = true;}
    }
    if (duplicate) {
      dupes.push(row);
    }
    else {newData.push(row)
    }
  }
   

  // Check if duplicates exist 
 if (dupes.length > 0) {
   Logger.log('Found '+dupes.length+' duplicates in set.')

  // Copy each duplicate row to "Actions Archive" sheet ("dupeSheet" in script).
  let dupeSheetLastRowNum = dupeSheet.getLastRow();
  console.log('Attemepting to insert dupes to Dupe Sheet');
  dupeSheet.getRange(dupeSheetLastRowNum + 1, 1, dupes.length, dupes[0].length).setValues(dupes);
  console.log('Dupes inserted into the dupe sheet');

  // SpreadsheetApp.flush();

 /*for (var i in dupes){
  dupeSheet.appendRow(dupes[i]);
 }

  //Check to see if duplicate rows were copied by comparing the last rows of the archive sheet to the last row in the "dupes" array.
  var dupeData = dupeSheet.getDataRange().getValues();
  var dupeLastRowNum = dupes.length - 1;
  var dupeSheetLastRowIndex = dupeSheetLastRowNum - 1; 
  var dupeSheetLastRow = dupeData[dupeSheetLastRowNum];
  var dupeLastRow = dupes[dupeLastRowNum];
  var copied = true;
for (var i=0;i < dupeSheetLastRow.length; i++) {
  if(dupeSheetLastRow[i].toString() != dupeLastRow[i].toString()){
    copied = false;
    Logger.log('Last row mismatch at position '+i);
    Logger.log('Value for archive sheet at column position '+i+': '+dupeSheetLastRow[i]);
    Logger.log('Incoming duplicate value at column position '+i+': '+dupeLastRow[i]);
  } 
}
  */
  // If duplicates were copied succesfully, clear the sheet and replace with newData array (all the old rows minus the duplicates), and then call removeblanks() to clear empty rows.
  if (true){
  sheet.clearContents();
  sheet.getRange(1, 1, newData.length, newData[0].length).setValues(newData);
    Logger.log("Duplicates have been removed and archived.");
  } else {
    Logger.log("There may have been an issue with safely copying the duplicate rows to the archive sheet. Duplicate rows have not been deleted to prevent data loss.");
  }
 } else {
   Logger.log("No duplicates found");
 }
  }