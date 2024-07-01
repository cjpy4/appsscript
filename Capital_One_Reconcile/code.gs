function myFunction(e) {
  
    /* Test for a null sheet interaction */
    if (!e.source.getActiveRange()) {
        console.log("No active sheet for this event", e)
        return;
    }

    /* Get the eact range of the cells that were modified */
    const ss = e.source; // returns Spreadhseet Class
    const activeRange = ss.getActiveRange();
    const oIndex = {
        row: activeRange.getRowIndex(),
        column: activeRange.getColumnIndex(),
        numRows: activeRange.getValues().length
    };

    /* Get Values from Sheet Active Range */
    const sheet = ss.getActiveSheet();
    const allRows = sheet.getDataRange().getValues();
    const sheetName = ss.getActiveSheet().getName();
    const fullEventRow = ss.getActiveSheet().getRange(oIndex.row, 1, 1, ss.getLastColumn());
    const eventValue = fullEventRow.getValues();

    let targetSheet;
    let newRows = [];

  

targetSheet.getRange(targetSheet.getLastRow() + 1, 1, newRows.length, newRows[0].length).setValues(newRows);
    console.log('New rows pushed to sheet');
}
