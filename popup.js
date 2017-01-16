chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    //split the class up according to their containers
    var returnedData = request.source;
    var validPage = returnedData[1];
    var courseEventInfo = returnedData[2];

    // Sort courses by date
    courseEventInfo.sort(function(a, b) {
      return (new Date(a["startDate"]).getDay()) - (new Date(b["startDate"]).getDay());
    });

    // Get output in terms of plain text from scraping
    var containers = returnedData[0].split("END");
    var scheduleTextFromPage = "";
    for(i = 0 ; i < containers.length ; i++){
      scheduleTextFromPage += containers[i] + "\n";
    }
    //pagecodediv.innerText = scheduleTextFromPage;

    /* Info in JSON object array "courseEventInfo"
      "courseTitle": courseTitle,
      "section": sectionCode,
      "classType": classType,
      "location": roomLocation,
      "startDate": classStartDate,
      "endDate": classEndDate */

    // Generate HTML code to append to chrome extension tab
    var prettyOutput = "";
    // Initial HTML
    prettyOutput += "<p>Here is what we found in your schedule. If it looks good to you, go ahead and click the Import button at the bottom of this tab!</p><br/>\n<hr/>";

    for (i = 0; i < courseEventInfo.length; i++) {
      var divHTML = "<div>\n"
      divHTML += courseEventInfo[i]["courseTitle"] + " (" + courseEventInfo[i]["section"] + ") - " + courseEventInfo[i]["classType"] + "<br/>\n";
      divHTML += courseEventInfo[i]["location"] + "<br/>\n";

      startDate = new Date(courseEventInfo[i]["startDate"]);
      endDate = new Date(courseEventInfo[i]["endDate"]);
      divHTML += courseEventInfo[i]["startDate"].split(" ")[0] + " " + startDate.getHours() + ":" + courseEventInfo[i]["startDate"].split(" ")[4].split(":")[1] + " to ";
      divHTML += endDate.getHours() + ":" + courseEventInfo[i]["endDate"].split(" ")[4].split(":")[1] + "<br/>\n";
      divHTML += "</div>";
      divHTML += "<hr/>";

      prettyOutput += divHTML;
    }
    pagecodediv.innerHTML = prettyOutput;


    if (validPage) {    // If page has needed elements
      document.querySelector('#import-button').removeAttribute("hidden");

      // Add event listener for import schedule button
      var importScheduleButton = document.getElementById('import-button');
      importScheduleButton.addEventListener('click', function() {
        // Commented code gets the URL of the current tab open. Not needed but kept in case.
        /* chrome.tabs.getSelected(null, function(tab) {
          d = document;
          console.log(tab.url);
        }); */
        
        console.log("importScheduleButton has been clicked.");
        // TODO Initiate GCal scheduling functionality
        
        // chrome.identity.removeCachedAuthToken(
        //       { 'token': access_token },
        //       getTokenAndXhr);
        
        chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
          // Use the token.
          console.log("TOKEN: " + token);
        });
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
      }, false);
    }
  }
});

function onWindowLoad() {
  // TODO onWindowLoad stuff -- do we need it?
}

document.addEventListener('DOMContentLoaded', function() {
  // get page HTML
  var pagecodediv = document.querySelector('#pagecodediv');
  chrome.tabs.executeScript(null, {
    file: "getPageSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      pagecodediv.innerText = 'Oops! We ran into an error: ' + chrome.runtime.lastError.message;
    }
  });
}, false);
