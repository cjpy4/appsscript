// The parent function takes two parameters: a PO number and the ID of the log record that will represent this script run in the UI. 
function getPOLineItems(poNumber, logId) {

  // Define a variable to return to the UI.
  let returnStatus;

  // Request an Auth token from Coupa API
  const baseURL = `https://aldridge.coupahost.com`;
  try {
    var response = UrlFetchApp.fetch(`${baseURL}/oauth2/token`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }, method: 'POST', payload: `client_id=&client_secret=&scope=core.purchase_order.read%20core.purchase_order.write%20core.user.read%20core.user.write&grant_type=client_credentials`
  });} catch(err) {
    console.error(err);
    returnStatus = 'Problem with request for access token'
  }
  // Logger.log(JSON.parse(response).access_token);
  // Get token value - will be passed to next API Call as a bearer token. 
  const token = JSON.parse(response).access_token;

  // Request info for user-input PO # which is pass in as a function parameter from the AppSheet Bot. 
  try {
     var result = UrlFetchApp.fetch(`${baseURL}/api/purchase_orders?po-number=${poNumber}`, {
    headers: {
      accept: 'application/json',
      authorization: `bearer ${token}`,
    }, method: 'GET'
  });
  } catch (err) {
    console.error(err)
    returnStatus = 'Problem with request for PO data'
  }

 // Check if the reponse contains any results. Returns a message to the UI indicating the PO might not exist. 
 if (JSON.parse(result).length==0){
  console.log('No PO data returned. PO # number may not exist as entered.')
  returnStatus = 'PO # Not Found';
 } else {
  // Check to see if the given PO has line items.
  if (JSON.parse(result)[0]['requisition-header']['requisition-lines'].length > 0){

    // Drill down to the individual parts atached to the PO.
    let returnValue = JSON.parse(result)[0]['requisition-header']['requisition-lines'];
    
    // Use the 'columns' array to define the schema that will get sent back to AppSheet. Each 'Requisition_Item' entry is truncated to include only the listed fields in the 'columns' array, and then pushed into a new array called 'requisition_items'. 
    let requisition_items = [];
    returnValue.forEach(item => {
      let columns = ['id', 'description', 'quantity','status', 'created-at', 'updated-at', 'source-part-num', 'manufacturer-part-number', 'manufacturer-name'];
      let entryArray = Object.entries(item).filter((column) => columns.includes(column[0]));
      entryArray.push(['coupa_lookup_log_id', logId])
      let newItem = Object.fromEntries(
        entryArray
      );
      requisition_items.push(newItem);
    });

   // Logger.log(requisition_items);

    // Define the payload that will be sent tot he AppSheet API, passing in 'requisition_items' as the 'Rows' property. 
    let payload = {
    "Action": "Add",
    "Properties": {
      "Locale": "en-US",
      "Timezone": "Central Standard Time",
    },
    "Rows": requisition_items
    }

    // Define the POST request that will be sent to the AppSheet API. 
    var options = {
    headers: {
      applicationAccessKey: "V2-eoMFI-brmvF-4MOWQ-sUjPd-CDzft-xvEb0-atp4o-jCu6F"
    },
    'method' : 'post',
    'contentType': 'application/json',
    // Convert the JavaScript object to a JSON string.
    'payload' : JSON.stringify(payload)
  };

  // Attempt to send payload to the AppSheet API. Detination app and table within the app are defined in the URL. These should be passed in as variables using string interpolation to accommodate requests to multiple apps or tables. 
  try { 
    let res = UrlFetchApp.fetch('https://api.appsheet.com/api/v2/apps/32b967a5-a1ef-4d00-ba77-6aef18506e63/tables/coupa_lookup/Action', options);
    console.log('response code: '+res.getResponseCode());
  } catch (err) {
    console.error(err)
    returnStatus = 'Problem sending data to AppSheet API'
  }
  returnStatus = 'Script Run Successful'
    } else {
      // If no line items were returned for the given PO.
      console.log('No line items found for given PO #');
      returnStatus = 'No line items found for given PO #';
    }
}
 // The 'returnStatus' variable should have gotten set to one of a few different values, depending on the result of the various if() statements. This is what will be shown to the user in the AppSheet UI. It should give a rough indication as to the result of their query.
 return returnStatus
}
