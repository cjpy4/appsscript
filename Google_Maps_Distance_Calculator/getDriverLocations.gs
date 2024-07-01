// getDriverLocations() first calls getDriverIdList() to ensue that the 'Drivers' Google Sheet is up to date and contains all active drivers as listed in Motive. Then getFilteredListDriving() to fetch a filtered list of driver (Motive user) IDs which are then passed into a separate GET request the calls the '/driver_locations' endpoint. Each user ID retireved from Motive is then matched to its corresponding row in the 'Key' column of the 'Drivers' sheet, and the 'LatLong' column is updated with the 'Lat' and 'Lon' values returned from the '/driver_locations' endpoint. Only rows that contained drivers that have a 'duty_status' of 'on_duty' or 'driving' are modified with new Lat-Long values. 
function getDriverLocations() {
   // Define API Key and headers for GET request. Will be passed to URLFetchApp.fetch() as the 'options' parameter.
  const options = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'X-Api-Key': '24e439bc-4d5f-4eae-9ebf-13e8eddb3951'
  }
};
  // Get list of all active drivers for comparison to Drivers Sheet. 
  var driverIdList = getDriverIdList();
  // Open the Spreadsheet object and get the 'Drivers' sheet object. Also retrieve the values from the 'Key' column to check if any Driver IDs are missing. 
  var ss = SpreadsheetApp.openById("1Js40ZgWpp9Usl2S1dKMRsYSzPEQIzJt-80ySaBHf8HI");
  var driverSheet = ss.getSheetByName("Drivers");
  var headerRow = driverSheet.getRange(1,1,1,driverSheet.getLastColumn()).getValues();
  var driverIdCol = driverSheet.getSheetValues(2,1,driverSheet.getLastRow(),1);
  // Define a variable that will determine if the 'Drivers' sheet needs to be updated. Set to false by defualt. 
  var update = false;
  // Call getFilteredListDriving() twice to get all drivers whose 'duty_status' is either 'on_duty' or 'driving' then combine both arrays into one array called 'driverIds.' This list consitutes all drivers whose location will be updated. 
  var array1 = getFilteredListDriving("on_duty");
  var array2 = getFilteredListDriving("driving");
  var driverIds = array1.concat(array2);
  // Define a variable for the url to be called so we can append the list of driver IDs to it when we call '/driver_locations'
  var url = "https://api.keeptruckin.com/v1/driver_locations?"
  // Define a variable to represent the current page number in the query params. 
  var i = 1;
  
  // Check to see if each ID value in 'driverIdList' is already in the 'Drivers' Google Sheet. If the ID is not in the sheet, set 'update' to true and call getDriverList() to update the Drivers Sheet from the Motive DB.   
  for (id of driverIdList) {
    var sync = true;
    for (driverId of driverIdCol) {
      if (id==driverId) {
        sync = false;
      } 
    }
      if (sync==true) {
        update = true;
        break;
      }   
  }

if (update==true) {
  getDriverList()
}

//  Append each of the Id values from 'driverIds' to the url as query params. Location info will only be returned for users whose ID is passed in here. 
for (id of driverIds) {
  url += `driver_ids[]=${id}&`
}
// Append final part of the Motive URL, with i being conatenated when the request is actually sent, since we will need to update it to read additional response pages. 
url += `per_page=100&page_no=`
// Make initial get request to '/driver_locations endpoint with all driver IDs appended. Variable 'i' is being conatenated when the request is actually sent, since we will need to update it to read additional response pages. Then parse the JSON response and define 'users' as the actual array of user objects that we can iterate over.
var responseData = UrlFetchApp.fetch(url+i, options)
var responseObj = JSON.parse(responseData.getContentText());
var users = Object.entries(responseObj["users"]);
// The Motive API responses are paginated, and allow a maximum of 100 results per page. To handle for this, we calculate the number of pages needed to cover the entire result set. In the 'pagination' object, the 'total' property dentoes the total number of results that meet    the filter requirements we passed in the query params. We take the total number of results and divide it by the max results per page (which we have set to the maximum value of 100), and round up to the nearest whole number to get how many total pages are needed.
var totalResultNum = responseObj["pagination"]["total"]
var numberOfPages = Math.ceil(totalResultNum / 100);

// If the number of results exceeds the max per page, we will define a new variable at start it at a value of 2. Inside of a loop we will call the same endpoint, but this time interpolating the variable 'i' for the 'page_no' query param. This call will repeat, incrementing the page number (by incrementing 'i') by 1 each time until the total number of pages has been reached. In each iteration of the loop, the 'users' array will be appended with the data from the new page that is being parsed. 
if (numberOfPages>1) {
  i = 2;
  while (i<=numberOfPages) {
    responseData = UrlFetchApp.fetch(url+i, options);
    responseObj = JSON.parse(responseData.getContentText());
    var tempusers = Object.entries(responseObj["users"]);
    console.log('Temupusers: '+tempusers);
    users = users.concat(tempusers);
    i++
  }
}
// For each driver ID we have in our filtered list, parse the 'Lat' and 'Lon' value and concatenate them into a string, separated by a comma. This single string value is now pushed into a 2-D array called 'newLatLong.' 
for (var id of driverIds) {
  var newLatLong = []
  var latLong = [];
  for (user of users) {
    if (id==user[1]["user"]["id"]) {
      if (user[1]["user"]["current_location"]==null){
        console.log("user "+user[1]["user"]["first_name"]+" "+user[1]["user"]["last_name"]+" with id number "+user[1]["user"]["id"]+" has a current location of null and was skipped");
        continue
      }
      latLong.push(user[1]["user"]["current_location"]["lat"]+", "+user[1]["user"]["current_location"]["lon"])
    }
    
  }
  newLatLong.push(latLong);
  // Match the current driver record with its corresponding row in the Drivers sheet, and update the 'LatLong' column with the fresh values that hav ejust been extracted from the Motive API. No other fields are updated as the exact single-cell range is defined when setValues() is called. 
  for (driverId of driverIdCol) {
    if (id==driverId) {
      var idIndex = driverIdCol.indexOf(driverId)+2;
      driverSheet.getRange(idIndex,headerRow[0].indexOf("LatLong")+1).setValues(newLatLong);
    }
  }
}
//  Repeat same parsing and push to sheet for driver availability times.
var driverTimeURL ="https://api.keeptruckin.com/v1/available_time?"
//  Append each of the Id values from 'driverIds' to the url as query params. Location info will only be returned for users whose ID is passed in here. 
for (id of driverIds) {
  driverTimeURL += `driver_ids[]=${id}&`
}
// Append final part of the Motive URL, with i being conatenated when the request is actually sent, since we will need to update it to read additional response pages. 
driverTimeURL += `per_page=100&page_no=`
// Make initial get request to '/driver_locations endpoint with all driver IDs appended. Variable 'i' is being conatenated when the request is actually sent, since we will need to update it to read additional response pages. Then parse the JSON response and define 'users' as the actual array of user objects that we can iterate over.
var responseData = UrlFetchApp.fetch(driverTimeURL+i, options)
var responseObj = JSON.parse(responseData.getContentText());
var users = Object.entries(responseObj["users"]);
// The Motive API responses are paginated, and allow a maximum of 100 results per page. To handle for this, we calculate the number of pages needed to cover the entire result set. In the 'pagination' object, the 'total' property dentoes the total number of results that meet    the filter requirements we passed in the query params. We take the total number of results and divide it by the max results per page (which we have set to the maximum value of 100), and round up to the nearest whole number to get how many total pages are needed.
var totalResultNum = responseObj["pagination"]["total"]
var numberOfPages = Math.ceil(totalResultNum / 100);

// If the number of results exceeds the max per page, we will define a new variable at start it at a value of 2. Inside of a loop we will call the same endpoint, but this time interpolating the variable 'i' for the 'page_no' query param. This call will repeat, incrementing the page number (by incrementing 'i') by 1 each time until the total number of pages has been reached. In each iteration of the loop, the 'users' array will be appended with the data from the new page that is being parsed. 
if (numberOfPages>1) {
  i = 2;
  while (i<=numberOfPages) {
    responseData = UrlFetchApp.fetch(driverTimeURL+i, options);
    responseObj = JSON.parse(responseData.getContentText());
    var tempusers = Object.entries(responseObj["users"]);
    console.log('Temupusers: '+tempusers);
    users = users.concat(tempusers);
    i++
  }
}
// For each driver ID we have in our filtered list, parse the 'Lat' and 'Lon' value and concatenate them into a string, separated by a comma. This single string value is now pushed into a 2-D array called 'newLatLong.' 
for (var id of driverIds) {
  var newerRows = []
  var newCycle = []
  var cycle;
  var newShift = []
  var shift;
  var newDrive = []
  var drive;
  var newBreak = []
  var breakTime;
  for (user of users) {
    if (id==user[1]["user"]["id"]) {
      if (user[1]["user"]["available_time"]==null){
        console.log("user "+user[1]["user"]["first_name"]+" "+user[1]["user"]["last_name"]+" with id number "+user[1]["user"]["id"]+" has a available time object of null and was skipped");
        continue
      }
      cycle = user[1]["user"]["available_time"]["cycle"]
      shift = user[1]["user"]["available_time"]["shift"]
      drive = user[1]["user"]["available_time"]["drive"]
      breakTime = user[1]["user"]["available_time"]["break"]
    
  }
  newerRows.push(cycle, shift, drive, breakTime);
  // Match the current driver record with its corresponding row in the Drivers sheet, and update the 'LatLong' column with the fresh values that hav ejust been extracted from the Motive API. No other fields are updated as the exact single-cell range is defined when setValues() is called. 
  for (driverId of driverIdCol) {
    if (id==driverId) {
      var idIndex = driverIdCol.indexOf(driverId)+2;
      driverSheet.getRange(idIndex,headerRow[0].indexOf("Cycle")+1,1,4).setValues(newerRows);
    }
  }
}
}
}


