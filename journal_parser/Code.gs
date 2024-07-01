function parseJournalEntries() {
  
  let spreadSheet = SpreadsheetApp.openById('1Mb4HOp2yRlAmOs3Icjkb_CRWkKXpqNVVUOYw3l9tI8w');
  let sheet = spreadSheet.getSheetByName('Journal');

  let data = sheet.getDataRange().getValues();

  for (row of data){
    let i = 1;
    if(row == null){
      console.log("row: "+i+" is null")
    } else { console.log( console.log("row: "+i+" is NOT null"))}
    i++
  }

 // console.log(data);
}
