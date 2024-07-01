function copyToTana(e) {

  let today = new Date();
  let filteredCalendars = [];
  let eventsList = []
  let exclusionList = ["landanq@gmail.com", "Todoist", "Focus Accelerator"];
  let calendars = CalendarApp.getAllCalendars();
  
  console.log(e)

  let payload = {
    "targetNodeId": "INBOX",
    "nodes": [
]
  }
  
 // payload.nodes[0].name = "cattywompus";
  // console.log("Payload tests: "+payload.nodes[0].children[0].name);

  for (i in calendars) {
    let name = calendars[i].getName();
    if (exclusionList.includes(name)){
      console.log("found value in exclusion list, excluding calendar called: "+name)
    } else {
      filteredCalendars.push(calendars[i]);
    }
  }

  for (i in filteredCalendars) {
    let cal = filteredCalendars[i];
    console.log("Calendar Name: "+cal.getName())
    let events = cal.getEventsForDay(today);
    for (j in events) {
      let event = events[j];
      let eventObj = {
      "name": event.getTitle(),
      "supertags": [
        {
          "id": "X9PS413TSJzl"
        }
      ],
      "children": [
        {
          "type": "field",
          "attributeId": "RRLSgIKPyEqR",
          "children": [
            {
              "name": event.getStartTime().toLocaleString('en-US')
            }
          ]
        },
        {
          "type": "field",
          "attributeId": "x2MSsNP6Zcep",
          "children": [
            {
              "name": event.getEndTime().toLocaleString('en-US')
            }
          ]
        }
      ]
      }
      
      /*{
        "name": event.getTitle()+" || "+event.getStartTime()+" - "+event.getEndTime(),
        "supertags": [
        {
          "id": "X9PS413TSJzl"
        }
      ],
      "children": [
        {
          "type": "field",
          "attributeId": "PdR-v8HrXVHZ",
          "children": [
            {
              "dataType": "date",
              "name": ""
            }
          ]
        },
        {
          "type": "field",
          "attributeId": "RRLSgIKPyEqR",
          "children": [
            {
              "name": +event.getStartTime()
            }
          ]
        },
        {
          "type": "field",
          "attributeId": "x2MSsNP6Zcep",
          "children": [
            {
              "name": event.getEndTime()
            }
          ]
        },
      ]
      }; */
      console.log("Event Name: "+event.getTitle());
      console.log("Object name: "+eventObj);
      payload.nodes.push(eventObj);
    }
  }
  console.log(payload.nodes[0].children);

    // Make a POST request with a JSON payload.
  var options = {
    'headers': {
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmaWxlSWQiOiI4OVI4WUxUNUdXQUkiLCJjcmVhdGVkIjoxNzA0NjA2ODEwNTA5LCJ0b2tlbklkIjoidlBES0E0OS11d0JxIn0.qC54Y6A2qAS18rFmOphFyrcOmZUbTuu0ZjiSKRVEno4',
    },
    'method': 'post',
    'contentType': 'application/json',
    // Convert the JavaScript object to a JSON string.
    'payload' : JSON.stringify(payload)
  };
  let response = UrlFetchApp.fetch('https://europe-west1-tagr-prod.cloudfunctions.net/addToNodeV2', options);
  console.log(response.getContentText());
 // console.log("# of Events for today: "+events.length);

  //if (events.length > 0){
    //for (i in events) {
    // var calEvent = events[i];
      //console.log("Event title: "+"Start Time: "+calEvent.getStartTime()+"End Time: "+calEvent.getEndTime());
    //} 
 // } else {
   // console.log("No Events today!")
  //}
}

