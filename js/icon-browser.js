"use strict";
// Global variables (in CAPS)
let ICONCACHE = null; // for icons
let FIRSTICON = null; // for first icon url, needed to get default icon
let DICONURL = null; // for default icon URL

async function getFirstIcon() {
  const response = await fetch("https://www.dreamwidth.org/__rpc_userpicselect");
  const iconJson = await response.json();
  let firstID = iconJson.ids[0];
  let firstIcon = iconJson.pics[firstID];
  FIRSTICON = firstIcon.url;
}

// ~~!! ICON BROWSER STUFF STARTS HERE !!~~
// inject icon Browse button on pages with icon browsers
function injectBrowseBt() {
  let oldBt = document.getElementById("lj_userpicselect");
  if (oldBt !== null) {
    oldBt.style = "display: none";
    let firstKid = document.getElementById("prop_picture_keyword");
    let newKid = document.createElement("input");
    newKid.id = "icon-browser-open";
    newKid.type = "button";
    newKid.value = "Browse";
    firstKid.insertAdjacentElement("afterend", newKid);
    injectBrowser();
  }
}

// remove the button
function browseOff() {
  let oldBt = document.getElementById("lj_userpicselect");
  let browseBt = document.getElementById("icon-browser-open");
  if (browseBt !== null) {
    browseBt.remove(); // this is not working for some reason, fix later
    oldBt.removeAttribute("style");
    browser.storage.sync.set({icon_browser: false})
  }
}

// make the icon browser
function openModal() {
  document.getElementById("icons-overlay").style.display = "block";
}
// and make it close
function closeModal() {
  document.getElementById("icons-overlay").style.display = "none";
}

// Populate icons, fetch first icon URL
async function getIcons() {
  if (!ICONCACHE) {
    const response = await fetch("https://www.dreamwidth.org/__rpc_userpicselect");
    const jsonThingy = await response.json();
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
      let opt = "";
      for (let i = 0; i < jsonThingy.ids.length; i++) {
        let idAll = jsonThingy.ids[i];
        let iconsAll = jsonThingy.pics[idAll];
        opt += '<option value="' + iconsAll.keywords + '" id="' + iconsAll.url + '">' + iconsAll.keywords + '</option>';
      }
      let cleanOpt = DOMPurify.sanitize(opt);
      newEntryPg.innerHTML = cleanOpt;

      let iconPrev = document.querySelector("#icon-preview img");
      iconPrev.src = window.DWT_DICONURL;

      let entryPgIcon = document.getElementById("js-icon-select");
      entryPgIcon.addEventListener('change', function(e) {
        e.preventDefault();
        let iconNum = this.selectedIndex;
        let selectedIcon = this.children[iconNum].id;
        console.log(selectedIcon);
        iconPrev.src = selectedIcon;
        console.log(iconPrev.src);
      })
    }
  }
}

function fixNewEntry() {
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
function injectBrowser() {
  // let htmlFile = browser.runtime.getURL("html/icon-browser.html");

  // let rq = new XMLHttpRequest();
  // rq.responseType = 'document';
  // rq.open("GET", htmlFile);
  // rq.onload = function() {
  // let iconBrowserDiv = rq.response.body.firstChild;
  // document.body.appendChild(iconBrowserDiv);

  iconBrowserHTML();

  document.getElementById("icon-browser-open").addEventListener('click', function() {
    openModal();
    getIcons();
  });
  document.getElementById("icon-browser-close").addEventListener('click', function() {
    closeModal();
  });
  // document.getElementById("lil-icons").addEventListener('onchange' function () {
  //
  // })
  let iconModal = document.getElementById("icons-overlay");
  window.onclick = function(event) {
    if (event.target == iconModal) {
      iconModal.style.display = "none";
    }
  };
}

// Remove any lingering selected roles so only one icon is highlighted
function killOldRole() {
  let oldRole = document.querySelector("div[role=selected]");

  if (oldRole) {
      let role = document.createAttribute("role");
      role.value = "none";
      oldRole.setAttributeNode(role);
  };
}

function addListeners() {
  let iconList = document.getElementsByClassName("usericon");

  for (var i = 0; i < iconList.length; i++) {
    let attribute = iconList[i].getAttribute("id");
    let dropDown = document.getElementById("prop_picture_keyword") || document.getElementById("js-icon-select");
    let kwDisplay = document.getElementById("keywords");
    let kwL_Display = document.getElementById("keyword-label");
    let getRole = document.querySelector("div[role=selected]");
    let role = document.createAttribute("role");

    iconList[i].addEventListener('click', function() {
      killOldRole();
      role.value = "selected";
      this.setAttributeNode(role);
      kwL_Display.style.display = "inline-flex";
      kwDisplay.innerHTML = attribute; // display the keywords
      kwDisplay.style.display = "inline-flex"; //unhide the keyword element

      let iconDisp = document.querySelector("#qrform .qr-icon img");
      let entryIcon = document.querySelector("#icon-preview img");
      let iconSrc = this.getElementsByTagName('img')[0].src;
      if (iconDisp) {
        iconDisp.src = iconSrc;
      } else if (entryIcon) {
        entryIcon.src = iconSrc;
      }
    })
    iconList[i].addEventListener('dblclick', function() {
      dropDown.value = attribute; // change to the selected icon in the dropdown box
      closeModal();
    })
    document.getElementById("selectB").addEventListener('click', function () {
      dropDown.value = attribute;
      closeModal();
    })
    let entryPgIcon = document.getElementById("js-icon-select");
    if (entryPgIcon) {
      entryPgIcon.addEventListener('change', function(e) {
        e.preventDefault();
        let selectValue = this.value;
        let iconSrc = document.getElementById("icon-img");
        let isIcon = document.getElementById(selectValue).children[0].src;
        iconSrc.src = isIcon;
      })
    }
  };
}
// ~~!! END OF ICON BROWSER STUFF !!~~
