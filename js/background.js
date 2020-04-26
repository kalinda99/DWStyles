"use strict";
let FIRSTICON = null;

let getFirstIcon = async() => {
  const response = await fetch("https://www.dreamwidth.org/__rpc_userpicselect")
  const iconJson = await response.json();
  if (iconJson.ids === undefined) {
    console.log("Not logged in");
  } else if (iconJson.ids[0]) {
    let firstID = iconJson.ids[0];
    let firstIcon = iconJson.pics[firstID];
    FIRSTICON = firstIcon.url;
  }
}

let cacheIcons = async() => {
  const response = await fetch("https://www.dreamwidth.org/__rpc_userpicselect");
  const jsonThingy = await response.json();
  let icon_cache = jsonThingy;
  chrome.storage.local.set({icon_cache});
}

let useCurrentPg = async() => {  
  chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
    let current_tab = tabs[0];
    console.log(current_tab.title);
    console.log(current_tab.url);
    chrome.storage.local.set({current_tab});
  });
}

let firstRun = () => {
  console.log("Hi, welcome to DreamWidgets!~ I'm your background script, here doing background things.");

  // Uncomment this and reload extension to clear out local storage on Firefox
  // console.log("Cleaning local storage...");  
  // browser.storage.sync.clear().then( () => {
  //   console.log("Storage cleared");    
  // });

  // save user info to local storage upon getting message from content script :)
  const saveUserInfo = (request, sender, sendResponse) => {
    console.log("Message recieved " + request.msg);
    if (request.msg == "getUserInfo") {
      getFirstIcon().then( async() => { //add return to start of this line for Firefox to use an async response like Mozilla wants
        return await fetch("https://www.dreamwidth.org/__rpc_ctxpopup?mode=getinfo&userpic_url=" + FIRSTICON);
      }).then( async(response) => {
        return await response.json();   
      }).then( async(userJson) => {        
        console.log(userJson);
        if (userJson.noshow == 1) {
          chrome.storage.local.set({user_info: "NoUser"});

          console.log("Sending message to content that we're not logged in!");          
          sendResponse({response: "notLoggedIn"}); // for Chromium because Google hasn't updated their shit yet I guess?
          // return ({response: "notLoggedIn"}); // for Firefox
        } else {
          let user_info = new Array;
          user_info.push({
            dwUserName: userJson.username, 
            iconUrl: userJson.url_userpic, 
            userTag: userJson.ljuser_tag
          })
          console.log("Currently logged in as: " + user_info[0].dwUserName);
        
          chrome.storage.local.set({user_info});
          sendResponse({response: "allDone"}); // for Chromium because Google hasn't updated their shit yet I guess?
          // return ({response: "allDone"}); // for Firefox
        }
      });
      return true;
    }
  }

  chrome.runtime.onMessage.addListener( (request, send, sendResponse) => {
    if (request.msg == "getCurrentTab") {
      useCurrentPg().then( () => {
        sendResponse({response: "tabDone"});
      })
      return true;
    }
  })

  chrome.runtime.onMessage.addListener(saveUserInfo);
  
  chrome.runtime.onMessage.addListener( (request, send, sendResponse) => {
    if (request.iconreq == "cacheIcons") {
      cacheIcons().then( () => {
        sendResponse({response: "iconsDone"});        
      })
      return true;
    }
  })

  // export settings upon getting a message from content script
  chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    console.log("Message recieved: " + request.command);    
    if (request.command == "getExportURL") {
      chrome.storage.sync.get(null, (list) => {
        console.log(list);
        if (list) {
          let settings = new Blob([JSON.stringify(list)], {type: 'application/json;base64'});      
          let exportURL = URL.createObjectURL(settings);
          chrome.downloads.download({
            url: exportURL,
            filename: 'dwidgets_export.json'
          })
          sendResponse({response: "SettingsExportOk"}); // need to fix this, sendResponse is being phased out, gotta do this another way
        } else {
          console.log("No settings saved to local storage, nothing to export"); 
          sendResponse({response: "NoSettings"});   
        }
      })
    }
    return true;
  });

  chrome.runtime.onInstalled.addListener(async ({ reason, }) => {
    switch (reason) {
      case "install": {
        const url = chrome.runtime.getURL("html/changelog.html");
        await chrome.tabs.create({ url, });
      } break;
    }
  });
}

window.onload = () => { firstRun(); };
