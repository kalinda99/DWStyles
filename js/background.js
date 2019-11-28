"use strict";

function firstRun() {
  console.log("Hi, welcome to DreamWidgets!~ This is a test to see if shit works :D");

  // export settings upon getting a message from content script
  browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Message recieved: " + request.command);    
    if (request.command === "getExportURL") {
      browser.storage.sync.get().then(function(list) {
        console.log(list);
        if (list) {
          let settings = new Blob([JSON.stringify(list)], {type: 'application/json;base64'});      
          let exportURL = URL.createObjectURL(settings);
          browser.downloads.download({
            url: exportURL,
            filename: 'dwidgets_export.json'
          })
          sendResponse({response: "SettingsExportOk"});
        } else {
          console.log("No settings saved to local storage, nothing to export"); 
          sendResponse({response: "NoSettings"});   
        }
      })
    }
    return true;
  });

  browser.runtime.onInstalled.addListener(async ({ reason, }) => {
    switch (reason) {
      case "install": {
        const url = browser.runtime.getURL("html/changelog.html");
        await browser.tabs.create({ url, });
      } break;
    }
  });
}

window.onload=function() { firstRun(); };
