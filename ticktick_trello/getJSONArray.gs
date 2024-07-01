function getJsonArrayFromData(){

  /*
  const ss = e.source;
  const activeRange = ss.getActiveRange();
  const oIndex = {
    row: activeRange.getRowIndex(),
    column: activeRange.getColumnIndex(),
    numRows: activeRange.getValues().length
  };
  const sheetName = ss.getActiveSheet().getName();
  const fullEventRow = ss.getActiveSheet().getRange(oIndex.row, 1, 1, ss.getLastColumn());
  const eventValue = fullEventRow.getValues(); */

  const ss = SpreadsheetApp.openById('1D7Ejx97KlD-2NkfYttzp4fF6f5UlH3GQpWTIzeQABr0');
  const sheet = ss.getSheetByName('TickTick to Trello');
  const sheetName = sheet.getSheetName();

  console.log(sheetName);

  let data = sheet.getDataRange().getValues()
 
  var obj = {};
  var result = [];
  var headers = data[0];
  var cols = headers.length;


  var processedIndex = headers.indexOf('Processed');

  for (var i in data)
  {
  var row = data[i];
  obj = {};

  console.log(row[processedIndex]);
  
   if(row[processedIndex] === 0){
    for (var col = 0; col < cols; col++) 
    {
      // fill object with new values
      obj[headers[col]] = row[col];    
    }
    result.push(obj); 
   }
  }
  console.log(result);
  return result;
}
