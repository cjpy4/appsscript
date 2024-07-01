// This file contains 3 functions. getDriverList(), getDriverIdList(), and getFilteredListDriving(). Explainations for each are given inline. 


/* 
getDriverList() calls the '/users' endpoint of the Motive API and filters the data set by role = 'driver' and status = 'active' : Then the Motive user ID, Name, Phone, and Email for each user is pushed into a 2-dimensional array and written to the 'Drivers' Google Sheet. 
The result is all active Motive users with a role of 'driver' being written to the Drivers sheet. This overwrites the previous info in the sheet each time, and only alters values through the Email column. Columns E and greater are unaffected. As written, changing the name or order of the columns in the 'Drivers' sheet will cause data to be written to the wrong fields. 
*/
function getDriverList() {
  // Define API Key and headers for GET request. Will be passed to URLFetchApp.fetch() as the 'options' parameter.
  const options = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'X-Api-Key': ''
  }
};
// Make initial GET request and parse JSON response. Define 'users' as the actual array of user objects that we can iterate over. 
  var response = UrlFetchApp.fetch('https://api.keeptruckin.com/v1/users?role=driver&status=active&per_page=100&page_no=1', options);
  var responseText = response.getContentText();
  var responseObj = JSON.parse(responseText);
  var users = Object.entries(responseObj["users"]);
  // The Motive API responses are paginated, and allow a maximum of 100 results per page. To handle for this, we calculate the number of pages needed to cover the entire result set. In the 'pagination' object, the 'total' property dentoes the total number of results that meet    the filter requirements we passed in the query params. We take the total number of results and divide it by the max results per page (which we have set to the maximum value of 100), and round up to the nearest whole number to get how many total pages are needed.  
  var totalResultNum = responseObj["pagination"]["total"]
  // the 'totalResultNum' must be divided by whatever the maxmimum results per page is set to. In this case it's 100.
  var numberOfPages = Math.ceil(totalResultNum / 100);
  // Define the array we will fill with our data and eventually push to the sheet. 
  var newRows = [];
  // Open the Spreadsheet object and get the 'Drivers' sheet object. 
  var ss = SpreadsheetApp.openById("1Js40ZgWpp9Usl2S1dKMRsYSzPEQIzJt-80ySaBHf8HI");
  var driverSheet = ss.getSheetByName("Drivers");
  
  // Push user data form the first page of responses into an array, which later gets pushed into 'newRows' to form a 2-D array (represents rows and columns for Sheets).
  for (user of users) {
    var tempArray = []
    var name = user[1]["user"]["first_name"]+" "+user[1]["user"]["last_name"]
    tempArray.push(user[1]["user"]["id"]);
    tempArray.push(name);
    tempArray.push(user[1]["user"]["phone"]);
    tempArray.push(user[1]["user"]["email"]);
    newRows.push(tempArray);
}   
// If the number of results exceeds the max per page, we will define a new variable at start it at a value of 2. Inside of a loop we will call the same endpoint, but this time interpolating the variable 'i' for the 'page_no' query param. This call will repeat, incrementing the page number (by incrementing 'i') by 1 each time until the total number of pages has been reached. The data from each page is appended to 'tempArray.' Once all pages have been parsed, 'tempArray' is pushed into 'newRows' and 'newRows' is written to the 'Drivers' sheet using the 'setValues()' method. 
if (numberOfPages>1) {
  var i = 2
    while (i<=numberOfPages) {
        response = UrlFetchApp.fetch(`https://api.keeptruckin.com/v1/users?role=driver&status=active&per_page=100&page_no=${i}`, options);
        responseText = response.getContentText();
        responseObj = JSON.parse(responseText);
        users = Object.entries(responseObj["users"])

        for (user of users) {
          var tempArray = []
          var name = user[1]["user"]["first_name"]+" "+user[1]["user"]["last_name"]
          tempArray.push(user[1]["user"]["id"]);
          tempArray.push(name);
          tempArray.push(user[1]["user"]["phone"]);
          tempArray.push(user[1]["user"]["email"]);
          newRows.push(tempArray);
      }
    i++;
    }
  }       
driverSheet.getRange(2,1,newRows.length,newRows[0].length).setValues(newRows)
}

// getDriverIdList() is nearly indential to this first function, but only extracts the ID values for each user, and does not write anything to Google Sheets. Instead it simply returns an array called 'driverIds' that can be used to iterate over. 
function  getDriverIdList() {
   // Define API Key and headers for GET request. Will be passed to URLFetchApp.fetch() as the 'options' parameter.
  const options = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'X-Api-Key': '24e439bc-4d5f-4eae-9ebf-13e8eddb3951'
  }
};
// Make initial GET request and parse JSON response. Define 'users' as the actual array of user objects that we can iterate over.
  var response = UrlFetchApp.fetch('https://api.keeptruckin.com/v1/users?role=driver&status=active&per_page=100&page_no=1', options);
  var responseText = response.getContentText();
  var responseObj = JSON.parse(responseText);
  var users = Object.entries(responseObj["users"]);
  // The Motive API responses are paginated, and allow a maximum of 100 results per page. To handle for this, we calculate the number of pages needed to cover the entire result set. In the 'pagination' object, the 'total' property dentoes the total number of results that meet    the filter requirements we passed in the query params. We take the total number of results and divide it by the max results per page (which we have set to the maximum value of 100), and round up to the nearest whole number to get how many total pages are needed.
  var totalResultNum = responseObj["pagination"]["total"]
  // the 'totalResultNum' must be divided by whatever the maxmimum results per page is set to. In this case it's 100.
  var numberOfPages = Math.ceil(totalResultNum / 100);
  // Define the array we will fill with our data and have the function return. 
  var driverIds = [];
  
// Extract user IDs and push to 'driverIds' array. 
  for (user of users) {
    driverIds.push(user[1]["user"]["id"]);
}   
// If the number of results exceeds the max per page, we will define a new variable at start it at a value of 2. Inside of a loop we will call the same endpoint, but this time interpolating the variable 'i' for the 'page_no' query param. This call will repeat, incrementing the page number (by incrementing 'i') by 1 each time until the total number of pages has been reached.
if (numberOfPages>1) {
  var i = 2
    while (i<=numberOfPages) {
        response = UrlFetchApp.fetch(`https://api.keeptruckin.com/v1/users?role=driver&status=active&per_page=100&page_no=${i}`, options);
        responseText = response.getContentText();
        responseObj = JSON.parse(responseText);
        users = Object.entries(responseObj["users"])

        for (user of users) {
          driverIds.push(user[1]["user"]["id"]);
      }
    i++;
    }
  }       

  return driverIds
}

// getFilteredList() impliements the same methods as the previous functions but implements additional filters in the query parameters. This function filters the results by 'duty_status' as well as by 'status' and 'role.' This function takes in a parameter to represent what 'duty_status' should be equal to. The value that is passed in will be interpolated into the GET request as a query param.  
function getFilteredListDriving(dutyStatus) {
  // Define API Key and headers for GET request. Will be passed to URLFetchApp.fetch() as the 'options' parameter.
  const options = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'X-Api-Key': '24e439bc-4d5f-4eae-9ebf-13e8eddb3951'
  }
};
// Make initial GET request and parse JSON response. Define 'users' as the actual array of user objects that we can iterate over.
  var response = UrlFetchApp.fetch(`https://api.keeptruckin.com/v1/users?role=driver&duty_status=${dutyStatus}&status=active&per_page=100&page_no=1`, options);
  var responseText = response.getContentText();
  var responseObj = JSON.parse(responseText);
  var users = Object.entries(responseObj["users"]);
  // The Motive API responses are paginated, and allow a maximum of 100 results per page. To handle for this, we calculate the number of pages needed to cover the entire result set. In the 'pagination' object, the 'total' property dentoes the total number of results that meet    the filter requirements we passed in the query params. We take the total number of results and divide it by the max results per page (which we have set to the maximum value of 100), and round up to the nearest whole number to get how many total pages are needed.
  var totalResultNum = responseObj["pagination"]["total"];
  var numberOfPages = Math.ceil(totalResultNum / 100);
  // Define the array we will fill with our data and have the function return.
  var driverIds = [];
// Extract user IDs and push to 'driverIds' array. 
  for (user of users) {
    driverIds.push(user[1]["user"]["id"]);
}   
// If the number of results exceeds the max per page, we will define a new variable at start it at a value of 2. Inside of a loop we will call the same endpoint, but this time interpolating the variable 'i' for the 'page_no' query param. This call will repeat, incrementing the page number (by incrementing 'i') by 1 each time until the total number of pages has been reached.
if (numberOfPages>1) {
  var i = 2
    while (i<=numberOfPages) {
        response = UrlFetchApp.fetch(`https://api.keeptruckin.com/v1/users?role=driver&duty_status=${dutyStatus}&status=active&per_page=100&page_no=${i}}`, options);
        responseText = response.getContentText();
        responseObj = JSON.parse(responseText);
        users = Object.entries(responseObj["users"])

        for (user of users) {
          driverIds.push(user[1]["user"]["id"]);
      }
    i++;
    }
  }       
  return driverIds
}


















         