"use strict";

// Global variable (in CAPS) for caching icons from the getIcons function so they aren't reloaded every damn time
let ICONCACHE = null;
let DICACHE = null;

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
    document.body.removeChild(browseBt); // this is not working for some reason, fix later
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

// Get the icons
function getIcons() {
  // if ICONCACHE returns null/0/nothing then icons haven't been loaded, so load them
  if (!ICONCACHE) {
    let rq = new XMLHttpRequest();
    rq.responseType = 'json';
    rq.open("GET", "https://www.dreamwidth.org/__rpc_userpicselect", true);
    rq.onload = function() {
      let imgSrc = "";
      let iconsDiv = document.getElementById("icons-list");
      let jsonThingy = rq.response;
      for (let i = 0; i < jsonThingy.ids.length; i++) {
        let id = jsonThingy.ids[i];
        let icons = jsonThingy.pics[id];
        imgSrc += '<div class="usericon" tabindex=0 id="' + icons.keywords + '"><img src="' + icons.url + '"></div>';
      }
      let cleanImgSrc = DOMPurify.sanitize(imgSrc);
      ICONCACHE = cleanImgSrc; // assign the icons to our cache for next time
      iconsDiv.innerHTML = ICONCACHE;
      addListeners(); // add listeners to each icon
      };
    rq.send();
  }
}

function xmlIconReqs() {
  if (!DICACHE) {
    let rq = new XMLHttpRequest();
    rq.responseType = 'json';
    rq.open("GET", "https://www.dreamwidth.org/__rpc_userpicselect", true);
    rq.onload = function() {
      let newEntryPg = document.getElementById("js-icon-select");
      let opt = "";
      let jsonThingy = rq.response;
      if (newEntryPg) {
        for (let i = 0; i < jsonThingy.ids.length; i++) {
          let idAll = jsonThingy.ids[i];
          let iconsAll = jsonThingy.pics[idAll];
          opt += '<option value="' + iconsAll.keywords + '" url="' + iconsAll.url + '">' + iconsAll.keywords + '</option>';          
        }
        let cleanOpt = DOMPurify.sanitize(opt);
        newEntryPg.innerHTML = cleanOpt;        
      }
      let firstID = jsonThingy.ids[0];
      let firstIcon = jsonThingy.pics[firstID];
      let dIconURL = firstIcon.url;

      let rqNew = new XMLHttpRequest();
      rqNew.responseType = 'json';
      rqNew.open("GET", "https://www.dreamwidth.org/__rpc_ctxpopup?mode=getinfo&userpic_url=" + dIconURL, true);
      rqNew.onload = function() {
        let userDiv = document.getElementById("dw-user");
        let iconPrev = document.getElementById("icon-preview");
        let iconSrc = "";
        let ir = rqNew.response;
        let icon = ir.url_userpic;
        let username = ir.ljuser_tag;
        if (userDiv) {
          iconSrc += '<a href="https://www.dreamwidth.org/manage/icons"><img src="' + icon + '"></a><br>' + username;
          let cleanIconSrc = DOMPurify.sanitize(iconSrc)
          DICACHE = cleanIconSrc;
          userDiv.innerHTML = DICACHE;
        } else if (iconPrev) {
          let iconImg = document.createElement("IMG");
          let iconDd = document.getElementById("icon-dd");
          iconImg.id = "icon-img"
          iconImg.src = icon;
          iconPrev.appendChild(iconImg);
          let option = document.createElement("option");
          option.text = "(default)";
          option.value = "(default)";
          option.url = icon;
          iconDd.add(option, iconDd[0]);          
        }
      }
      rqNew.send();
    }
    rq.send();
  };
}

function fixNewEntry() {
  let getKids = document.getElementById("collapse-target-icons");
  let getCol = getKids.getElementsByClassName("columns");

  let oldBorwser = document.getElementById("js-icon-browser");
  getKids.removeChild(oldBorwser);

  getCol[0].id = "icon-preview";
  let iconPrev = document.getElementById("icon-preview");
  iconPrev.innerHTML = "";
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

  xmlIconReqs();
  injectBrowser();
}

// inject icon browser
function injectBrowser() {
  let htmlFile = browser.runtime.getURL("html/icon-browser.html");

  let rq = new XMLHttpRequest();
  rq.responseType = 'document';
  rq.open("GET", htmlFile);
  rq.onload = function() {
    let iconBrowserDiv = rq.response.body.firstChild;
    document.body.appendChild(iconBrowserDiv);

    getIcons();
  
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
  };
  rq.send();
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
      let entryIcon = document.getElementById("icon-img");
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
