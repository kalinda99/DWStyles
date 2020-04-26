"use strict";

// "Global" variables (in CAPS)
let ICONCACHE = null; // for icons

const sendMessagePromise = (messageObj) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(messageObj, (message) => {
      if (message.response == "allDone" || (message.response == "notLoggedIn") || message.response == "iconsDone") {
        resolve(message);        
      } else {
        reject(message);
      }
    })
  })
}

const getUser = async() => {
  // message the background script to tell it to grab user info and stick it into local storage
  let messageToSend = {msg: "getUserInfo"};
  let localStorageToGet = null; // here we access the ALL THE STORAGE! for DWidgets
  return sendMessagePromise(messageToSend)
    .then((message) => {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(localStorageToGet, resolve)
      })
    })
    .then((dataFromStorage) => {
      const user_info = dataFromStorage.user_info; // and then here we pick which object we want to look at
      console.log("User info:");
      console.log(user_info);
      if (user_info == "NoUser") {
        console.log("Not logged in");        

        return new Promise((resolve, reject) => {  
          resolve({
            userName: "NotLoggedIn",
          });
        })
      } else {
        console.log("getUser: Currently logged in as: " + user_info[0].dwUserName);

        return new Promise((resolve, reject) => {
          resolve({
            userName: user_info[0].dwUserName,
            dIcon: user_info[0].iconUrl,
            userTag: user_info[0].userTag
          });
        })
      }
    })
    .catch((message) => {
      console.log("It broke! :( The error is:");
      console.log(message);
    })
}

// ~~!! ICON BROWSER STUFF STARTS HERE !!~~
// inject icon Browse button on pages with icon browsers
let injectBrowseBt = async() => {
  let oldBt = document.getElementById("lj_userpicselect");
  let mommyDiv = document.getElementsByClassName("qr-icon-controls")[0];
  let daddyDiv = document.getElementsByClassName("userpics")[0] || document.getElementById("userpics");
  if (mommyDiv) {
    oldBt.style = "display: none";
    let newKid = document.createElement("input");
    newKid.id = "icon-browser-open";
    newKid.type = "button";
    newKid.value = "Browse";
    mommyDiv.insertBefore(newKid, mommyDiv.childNodes[0]);
    injectBrowser();
  }
  else if (daddyDiv) {
    oldBt.style = "display: none";
    let newKid = document.createElement("input");
    newKid.id = "icon-browser-open";
    newKid.type = "button";
    newKid.value = "Browse";
    daddyDiv.insertBefore(newKid, document.getElementById("randomicon"));
    injectBrowser();
  }
}

// remove the button
let browseOff = () => {
  let oldBt = document.getElementById("lj_userpicselect");
  let browseBt = document.getElementById("icon-browser-open");
  if (browseBt !== null) {
    browseBt.remove();
    oldBt.removeAttribute("style");
    chrome.storage.sync.set({icon_browser: false})
  }
}

// make the icon browser open
let openModal = () => {
  document.getElementById("icons-overlay").style.display = "block";
}
// and make it close
let closeModal = () => {
  document.getElementById("icons-overlay").style.display = "none";
}

// Populate icons
let getIcons = () => {
  if (!ICONCACHE) {
    chrome.runtime.sendMessage({iconreq: "cacheIcons"}, (message) => {
      console.log(message.response);
      chrome.storage.local.get(['icon_cache'], (item) => {
        let jsonThingy = item.icon_cache;
        let iconsDiv = document.getElementById("icons-list"); // div for icons in browser
        let newEntryPg = document.getElementById("js-icon-select"); // icon select button on new entry pg
        if (iconsDiv) {
          let imgSrc = "";
          for (let i = 0; i < jsonThingy.ids.length; i++) {
            let id = jsonThingy.ids[i];
            let icons = jsonThingy.pics[id];
            imgSrc += '<div class="usericon" tabindex=0 id="' + icons.keywords + '"><img src="' + icons.url + '"></div>';
          }
          let cleanImgSrc = DOMPurify.sanitize(imgSrc);
          ICONCACHE = cleanImgSrc; // assign the icons to our cache for next time
          iconsDiv.innerHTML = ICONCACHE;
          addListeners(); // add listeners to each icon

          let iconsList = document.getElementsByClassName("usericon");
          if (newEntryPg) {
            for (let i = 0; i < iconsList.length; i++) {
              iconsList[i].classList.add("new-entry");
            }
          }
        }
        if (newEntryPg) {
          getUser().then( (userData) => {
            const dIcon = userData.dIcon;
            
            console.log("New Entry page:");             
            console.log(dIcon);
            
            let opt = "";            
            for (let i = 0; i < jsonThingy.ids.length; i++) {
              let idAll = jsonThingy.ids[i];
              let iconsAll = jsonThingy.pics[idAll];
              opt += '<option value="' + iconsAll.keywords + '" id="' + iconsAll.url + '">' + iconsAll.keywords + '</option>';
            }
            let cleanOpt = DOMPurify.sanitize(opt);
            newEntryPg.innerHTML = cleanOpt;
  
            let iconPrev = document.querySelector("#icon-preview img");
            iconPrev.src = dIcon; // thhis does not work, dIcon is undefined, suspect it is related to it being the second parameter since userName still works       
  
            let entryPgIcon = document.getElementById("js-icon-select");
            entryPgIcon.addEventListener('change', function(e) {
              e.preventDefault();
              let iconNum = this.selectedIndex;
              let selectedIcon = this.children[iconNum].id;              
              iconPrev.src = selectedIcon;              
            })
          })
        }
      })
    })
  }
}

let fixNewEntry = () => {
  let getKids = document.getElementById("collapse-target-icons");
  let getCol = getKids.getElementsByClassName("columns");

  let oldBrowser = document.getElementById("js-icon-browser");
  getKids.removeChild(oldBrowser);

  getCol[0].id = "icon-preview";
  let iconPrev = document.getElementById("icon-preview");
  iconPrev.innerHTML = '<img src="">';
  let iconSel = document.getElementById("icon-select");
  getCol[2].id = "icon-browse";
  let iconBrowse = document.getElementById("icon-browse");
  iconBrowse.innerHTML = "";
  let iconBrowseBt = document.createElement("input");
  iconBrowseBt.id = "icon-browser-open";
  iconBrowseBt.type = "button";
  iconBrowseBt.value = "browse";
  iconBrowseBt.classList = "small secondary button";
  iconBrowse.appendChild(iconBrowseBt);

  injectBrowser();
  getIcons();
}

// inject icon browser
let injectBrowser = async() => {
  let htmlFile = chrome.runtime.getURL("html/icon-browser.html");
  let parser = new DOMParser();

  const response = await fetch(htmlFile);
  const rq = await response.text();
  let pHTML = parser.parseFromString(rq, "text/html");

  let ibHTML = pHTML.body.firstChild;
  document.body.appendChild(ibHTML);

  document.getElementById("icon-browser-open").addEventListener('click', () => {
    openModal();
    getIcons();
  });
  document.getElementById("icon-browser-close").addEventListener('click', () => {
    closeModal();
  });
  // document.getElementById("lil-icons").addEventListener('onchange' function () {
  //
  // })
  let iconOverlay = document.getElementById("icons-overlay");
  let iconModal = document.getElementById("icons-modal");
  iconOverlay.onclick = (event) => {
    iconOverlay.style.display = "none";
  };
  iconModal.onclick = (event) => {
    event.stopPropagation();
  }
}

// Remove any lingering selected roles so only one icon is highlighted
let killOldClass = () => {
  let oldIcon = document.querySelector(".selected_icon");

  if (oldIcon) {
    oldIcon.classList.remove("selected_icon");
  };
}

let addListeners = () => {
  let iconList = document.getElementsByClassName("usericon");

  for (var i = 0; i < iconList.length; i++) {
    let attribute = iconList[i].getAttribute("id");
    let dropDown = document.getElementById("prop_picture_keyword") || document.getElementById("js-icon-select");
    let kwDisplay = document.getElementById("keywords");
    let kwL_Display = document.getElementById("keyword-label");

    iconList[i].addEventListener('click', function() {
      killOldClass();
      this.classList.add("selected_icon");
      kwL_Display.style.display = "inline-flex";
      kwDisplay.innerHTML = attribute; // display the keywords
      kwDisplay.style.display = "inline-flex"; //unhide the keyword element
    })
    iconList[i].addEventListener('dblclick', function() {
      let iconDisp = document.querySelector("#qrform .qr-icon img");
      let entryIcon = document.querySelector("#icon-preview img");
      let iconSrc = document.querySelector(".selected_icon img").src;
      if (iconDisp) {
        iconDisp.src = iconSrc;
      } else if (entryIcon) {
        entryIcon.src = iconSrc;
      }
      dropDown.value = attribute; // change to the selected icon in the dropdown box
      closeModal();
    })
    document.getElementById("selectB").addEventListener('click', () => {
      let iconDisp = document.querySelector("#qrform .qr-icon img");
      let entryIcon = document.querySelector("#icon-preview img");
      let iconSrc = document.querySelector(".selected_icon img").src;
      if (iconDisp) {
        iconDisp.src = iconSrc;
      } else if (entryIcon) {
        entryIcon.src = iconSrc;
      }
      dropDown.value = document.querySelector(".selected_icon").getAttribute("id");
      closeModal();
    })
    // let entryPgIcon = document.getElementById("js-icon-select");
    // if (entryPgIcon) {
    //   entryPgIcon.addEventListener('change', function(e) {
    //     e.preventDefault();
    //     let selectValue = this.value;
    //     let iconSrc = document.getElementById("icon-img");
    //     let isIcon = document.getElementById(selectValue).children[0].src;
    //     iconSrc.src = isIcon;
    //   })
    // }
  };
}
// ~~!! END OF ICON BROWSER STUFF !!~~
