function getSheetById(ssId, id) {
  return SpreadsheetApp.openById(ssId).getSheets().filter(
    function(s) {return s.getSheetId() === id;}
  )[0];

}

