function parseAssyParts() {
  
  const ss = SpreadsheetApp.openById('1-AqtGh3bxOvikr1hqNVKnUtsHMCs1y_U54uPWr0DBGQ');

  const assySheet = ss.getSheetByName('Copy of Item List');
    
  let assySheetValues = assySheet.getDataRange().getValues();


  let headerRow = assySheetValues[0];
  let descriptionIndex = headerRow.indexOf('Description / Notes');
  let partIdIndex = headerRow.indexOf('ID / Zip ID');
  let partIds = [];
  let newRows = [];

  for  (row of assySheetValues) {
    let partId = row[partIdIndex];
    console.log(row)
    partIds.push(partId);
  }

  console.log(partIds);
}
