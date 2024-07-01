const apiRoot = 'https://crossplat.bubbleapps.io/version-test/api/1.1/obj/';
const ss = SpreadsheetApp.openById('1LL8IY-_M0oOlss55g42ybDmJnzVZ9AYys0YLlg59DpI');

function getData(sheets = insertTables()) {
  let rows = [];

  for (sheet of sheets) { 
    let table = sheet.getName();
    console.log(table);
    const apiCall = UrlFetchApp.fetch(apiRoot + table);
    const raw = JSON.parse(apiCall.getContentText());
    for (row of raw.response.results) {
      rows.push(Object.values(row));
    }
    sheet.getRange(sheet.getLastRow()+1,1,rows.length,rows[0].length).setValues(rows);
  }
}

function insertTables(schemas = mapSchemas()) {
  let tables = [];
  const sheetNames = ss.getSheets().map(e => e.getName());

  for (i in schemas){
    tables.push(schemas[i].table)
  }

  // check for any missing tables and create a sheet for that table
  for(table of tables) {
    if(sheetNames.indexOf(table) >= 0) {
      continue;
    } else {
      ss.insertSheet(table)
    }
  }

  const sheets = ss.getSheets();

  for (table of schemas){
    let sheet = sheets[sheetNames.indexOf(table.table)];
    let columns = Object.keys(table.columns);
    let rowArray = [];
    rowArray.push(columns);
    sheet.getRange(1, 1, rowArray.length, rowArray[0].length).setValues(rowArray);
  }
  return sheets
}

function mapSchemas() {

  var filteredTables = [];
  let schemas = [];

  const endpoint = 'https://crossplat.bubbleapps.io/version-test/api/1.1/meta/swagger.json';
  const fetch = UrlFetchApp.fetch(endpoint);
  const response = JSON.parse(fetch);
  const tables = response.definitions;

  var keys = Object.keys(tables).filter(key => !key.includes('Body') && !key.includes('GeographicAddress'));

  for (key of keys) {
   filteredTables.push(key);
   schemas.push(
     {
       table: key, 
       columns: tables[key].properties
     }
   )
 }
  return schemas;
}

