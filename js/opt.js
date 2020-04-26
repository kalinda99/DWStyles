"use strict";

// Open and close optons overlay
let openOptions = () => { 
  // populate default Bookmark name and url to current page
  let favName = document.getElementById("fav-name");
  let favURL = document.getElementById("fav-url");
  chrome.runtime.sendMessage({msg: "getCurrentTab"}, (message) => {
    console.log(message.response);
    chrome.storage.local.get(['current_tab'], (item) => {
      favURL.value = "";
      let tabTitle = item.current_tab.title;
      let tabURL = item.current_tab.url;
      favName.value = tabTitle;
      favURL.value = tabURL;
    });
  })
  document.getElementById("dw-settings-overlay").style.display = "block"; 
}
let closeOptions = () => { document.getElementById("dw-settings-overlay").style.display = "none"; }

// export settings, which is actually done by background.js, this script doesn't have download permissions :(
let exportSettings = () => {
  chrome.runtime.sendMessage({command: "getExportURL"}, (message) => {
    if (message.response == "NoSettings") {
      alert("Your settings are defaults, there's no need to export aynthing. Maybe add a bookmark or two first?");
    } else {
      console.log("The reply was: " + message.response);
    };
  });
}

// functions to import settings saved as json file
let handleFile = () => {
	let file = document.getElementById("browse").files[0]
	let reader = new FileReader();
	reader.onload = importSettings;
	reader.readAsText(file);
};
function importSettings() {
  let json = JSON.parse(this.result);
  chrome.storage.sync.set(json).then(() => {
    chrome.storage.sync.get().then(function(list) {
      console.log("Settings imported, here they are:");
      console.log(list);      
    })
    // loadSettings();
    getFaves();
  });
	document.getElementById("browse").value = '';
};

// change classes on tabs in options menu so the highlighted tab will change on click
let killOldTab = () => {
  let oldTab = document.querySelector(".selected-tab");
  let oldTabPg = document.querySelector(".current-tab");

  if (oldTab) {
    oldTab.classList.remove("selected-tab");
    oldTabPg.classList.remove("current-tab");
    oldTab.classList.add("none");
    oldTabPg.classList.add("hidden-pg");
  }
};

let optListeners = () => {
  // sssh, listen! listeners for close
  document.getElementById("dw-settings-close").addEventListener('click', () => {
    closeOptions();
  });
  let optOverlay = document.getElementById("dw-settings-overlay");
  let optModal = document.getElementsByClassName("dw-settings");
  optOverlay.onclick = function() {
    closeOptions();
  };
  optModal[0].onclick = (event) => {
    event.stopPropagation();
  }

  //Listeners for tabs
  document.getElementById("dw-settings-tab-gen").addEventListener('click', () => {
    let thisDiv = document.getElementById("dw-settings-tab-gen");
    let optDiv = document.getElementById("dw-settings-general");
    killOldTab();
    thisDiv.classList.add("selected-tab");
    optDiv.classList.add("current-tab");
    thisDiv.classList.remove("none");
    optDiv.classList.remove("hidden-pg");
  });

  document.getElementById("dw-settings-tab-favs").addEventListener('click', () => {
    let thisDiv = document.getElementById("dw-settings-tab-favs");
    let optDiv = document.getElementById("dw-settings-faves");
    killOldTab();
    thisDiv.classList.add("selected-tab");
    optDiv.classList.add("current-tab");
    thisDiv.classList.remove("none");
    optDiv.classList.remove("hidden-pg");
    getFaves();
  });

  // Listeners for options
  // Dark theme
  document.getElementById("dw-dark_style").addEventListener('change', () => {
    let themeCk = document.getElementById("dw-dark_style").checked;
    if (themeCk == true) {
      setDarkTheme();
      chrome.storage.sync.set({dark_theme: true}).then( (msg) => {
        console.log(msg);
      });
    }
    else {
      themeOff();
      chrome.storage.sync.set({dark_theme: false});
    }
  });

  // Icon browser
  document.getElementById("dw-icon-browser").addEventListener('change', () => {
    let iconCk = document.getElementById("dw-icon-browser").checked;
    if (iconCk == true) {
      injectBrowseBt();
      chrome.storage.sync.set({icon_browser: true});
    }
    else {
      browseOff();
      chrome.storage.sync.set({icon_browser: false});
    }
  });

  const iconBrowserLook = document.getElementById("dw-settings-icon-browser-look");
  iconBrowserLook.onchange = (event) => {
    const selected = event.target.value;

    chrome.storage.sync.set({icon_browser_look: ''+selected});
    if (document.getElementById("icons-modal")) {
      document.getElementById("icons-modal").classList = selected;      
    }
  }

  // Better flat view
  document.getElementById("dw-better-thread").addEventListener('change', () => {
    let threadCk = document.getElementById("dw-better-thread").checked;
    if (threadCk == true) {
      chrome.storage.sync.set({better_thread: true});
      betterThreadView();
    }
    else {
      chrome.storage.sync.set({better_thread: false});
      // need to add function to turn off the thread view here
    }
  });
  
  // Faves
  document.getElementById("add-fave").addEventListener('click', (e) => {
    e.preventDefault();
    addFaves();
  });

  // Appearance options
  // tropo/desktop:
  document.getElementById("dw-settings-nav-b").addEventListener('change', () => {
    let radioCk = document.getElementById("dw-settings-nav-b").checked;
    if (radioCk == true) {
      chrome.storage.sync.set({desktop_opt: "navbar"});
      if (ISDESKTOP) {
        injectNavbar();
      }     
    }
  })
  document.getElementById("dw-settings-sticky-b").addEventListener('change', () => {
    let radioCk = document.getElementById("dw-settings-sticky-b").checked;
    if (radioCk == true) {
      chrome.storage.sync.set({desktop_opt: "sticky"});
      if (ISDESKTOP) { 
        injectSticky();
      }
    }
  })

  // lynx/mobile:
  const mobMenuLoc = document.getElementById("dw-settings-mob-menu-loc");
  mobMenuLoc.onchange = (event) => {
    const selected = event.target.value;

    chrome.storage.sync.set({mobile_opt: ''+selected});
    document.getElementById("hb-menu").classList = selected;
  }

  // import/export
  document.getElementById("export").addEventListener('click', () => { 
    exportSettings();
  })
  document.getElementById("import").addEventListener('click', () => {
    handleFile();
  })
}

let injectHB = async() => {
  let header = document.createElement("div");
  let dwContent = document.getElementById("content");
  header.id = "hb-strip";
  header.innerHTML = `<div id="hb-button">
      <div></div>
    </div>`;

  dwContent.prepend(header);

  let getFooter = document.querySelector("div[role=navigation]");
  getFooter.style.display = "none";

  let htmlFile = chrome.runtime.getURL("html/hb-menu.html");
  let parser = new DOMParser();

  const response = await fetch(htmlFile);
  const rq = await response.text();
  let pHTML = parser.parseFromString(rq, "text/html");

  let hbHTML = pHTML.body.firstChild;
  document.body.appendChild(hbHTML);

  let hbOverlay = document.getElementById("hb-overlay");
  let hbMenu = document.getElementById("hb-menu");
  let readingPg = document.getElementById("reading-pg");
  getUser().then( (userData) => {
    if (userData.userName === "NotLoggedIn") {
      document.getElementById("dw-links").style.display = "none";

      let iconSrc = '<img style="width: 95px; height: 95px;" src="https://www.dreamwidth.org/img/nouserpic.png"></a><br><small><a href="https://www.dreamwidth.org/login">Login</a> - <a href="https://www.dreamwidth.org/create">Create Account</a></small>'
      document.getElementById("dw-user").innerHTML = iconSrc;
    } else {
      document.getElementById("dw-links-nouser").style.display = "none";
      console.log(userData);   
      let userName = userData.userName;
      let dIcon = userData.dIcon;
      let userTag = userData.userTag;

  
      let iconSrc = '<a href="https://www.dreamwidth.org/manage/icons"><img style="width: 95px; height: 95px;" src="' + dIcon + '"></a><br><small>' + userTag + '</small>';
      document.getElementById("dw-user").innerHTML = iconSrc;
  
      readingPg.href = "https://" + userName + ".dreamwidth.org/read";
    }
  })
  getFaves(); // see custom.js
  document.getElementById("opt-hb").addEventListener('click', () => {
    openOptions();
    hbOverlay.style.visibility = "hidden";
  })
  document.getElementById("edit-faves").addEventListener('click', () => { 
    let optDiv = document.getElementById("dw-settings-faves");
    killOldTab();
    document.getElementById("dw-settings-tab-favs").classList.add("selected-tab");
    optDiv.classList.add("current-tab");
    document.getElementById("dw-settings-tab-favs").classList.remove("none");
    optDiv.classList.remove("hidden-pg");

    openOptions();
    hbMenu.classList.remove("visible");
    hbOverlay.style.visibility = "hidden";
  })
  
  chrome.storage.sync.get(['mobile_opt'], (response) => {
    if (response.mobile_opt == "hb-top-menu") {
      hbMenu.classList = "hb-top-menu";
    }
  })
}

let begin = async() => { // second function, calls most other functions, loads settings from browser storage

  // Insert our fonts because Chrome won't do it from the injected css file -__-
  let iconsLink = document.createElement("LINK");
  iconsLink.rel = "stylesheet";
  iconsLink.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
  document.head.appendChild(iconsLink);

  // Replace logo with transparent one on tropo red
  let logo = document.querySelector("#logo img");
  if (logo && HASTROPORED) {
    let logoURL = chrome.runtime.getURL("img/dw-logo.png");
    logo.src = logoURL;
  }

  // adds lynx tweaks CSS if lynx is being used
  let lynxTweaks = chrome.runtime.getURL("css/lynx-tweaks.css");
  if (HASLYNX) {
    let lynxLink = document.createElement("LINK");
    lynxLink.id = "lynx-tweaks";
    lynxLink.rel = "stylesheet";
    lynxLink.type = "text/css";
    lynxLink.href = lynxTweaks;
    document.head.appendChild(lynxLink);

    // fix the subject line on the reply forms so it doesn't stretch off the page on mobile    
    let replyForm = document.querySelector("#previewform input[name=subject]");
    if (replyForm) {
      replyForm.removeAttribute("size");
      replyForm.removeAttribute("maxLength");
      replyForm.style.width = "95%";
    }

    let legacyReplyForm = document.querySelector(".talkform #subject");
    if (legacyReplyForm) {
      console.log(legacyReplyForm);      
      legacyReplyForm.removeAttribute("size");
      legacyReplyForm.removeAttribute("maxLength");
      legacyReplyForm.style.width = "50%";
    }
  }

  injectCS(); // adds DreamWidgets options to colorstrips on journals, in themes.js

  optListeners(); // adds event listeners for options menu

  // newForm(); // tweaks.js for these two
  // injectForm();

  // load the settings
  chrome.storage.sync.get(['dark_theme'], (response) => {
    if (response.dark_theme == true) {
      setDarkTheme(); //themes.js
      document.getElementById("dw-dark_style").checked = true;
    } else {
      document.getElementById("dw-dark_style").checked = false;
    }
  });
  chrome.storage.sync.get(['icon_browser'], (response) => {
    if (response.icon_browser == true) {
      injectBrowseBt();
      document.getElementById("dw-icon-browser").checked = true;
      chrome.storage.sync.get(['icon_browser_look'], (response) => {
        const selected = response.icon_browser_look
        document.getElementById("dw-settings-icon-browser-look").value = selected || 'icons-mobile';
        document.getElementById("icons-modal").classList = selected || 'icons-mobile';
      });
    } else {
      document.getElementById("dw-icon-browser").checked = false;
    }
  });
  chrome.storage.sync.get(['better_thread'], (response) => {
    if (response.better_thread == true) {
      document.getElementById("dw-better-thread").checked = true;
      betterThreadView();
    }
  });
  if (HASLYNX) { // inject HB menu and add listeners for it if using lynx, if not then inject other options based on local storage
    injectHB().then( () => {
      let hbOverlay = document.getElementById("hb-overlay");
      let hbMenu = document.getElementById("hb-menu");
      document.getElementById("hb-button").onclick = () => { 
        hbOverlay.style.visibility = "visible";
      }
      hbOverlay.onclick = () => {
        hbOverlay.style.visibility = "hidden";
      }
      hbMenu.onclick = (event) => {
        event.stopPropagation();
      }
    });
    
  } else if (ISDESKTOP) {
    chrome.storage.sync.get(['desktop_opt'], (response) => {
      if (response.desktop_opt == "navbar") {
        injectNavbar(); //see themes.js for these two
      } else {
        injectSticky();
      }
    })
  }
  chrome.storage.sync.get(['desktop_opt'], (response) => {
    console.log(response.desktop_opt);    
    if (response.desktop_opt == "navbar") {
      document.getElementById("dw-settings-nav-b").checked = true;
    } else {
      document.getElementById("dw-settings-sticky-b").checked = true;
    }
  })

  chrome.storage.sync.get(['mobile_opt'], (response) => {
    const selected = response.mobile_opt
    // console.log(selected);
    document.getElementById('dw-settings-mob-menu-loc').value = selected || 'hb-left-menu';

    document.getElementById("hb-menu").classList = selected;
  })

  // inject new browse button if on beta new entry page
  let oldNewBt = document.getElementById("js-icon-browse");
  if (oldNewBt) {
    fixNewEntry(); //see icon-browser.js
  };
};

let inject = async() => { // first function to run
  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].href && document.styleSheets[i].href.includes("lynx")) {
    HASLYNX = true;
    }
  }
  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].href && document.styleSheets[i].href.includes("tropo-base")) {
      ISDESKTOP = true;
    } else if (document.styleSheets[i].href && document.styleSheets[i].href.includes("gradation")) {
      ISDESKTOP = true;
    }
  }
  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].href && document.styleSheets[i].href.includes("tropo-red")) {
    HASTROPORED = true;
    }
  }

  let htmlFile = chrome.runtime.getURL("html/options.html");
  let parser = new DOMParser();

  const response = await fetch(htmlFile);
  const rq = await response.text();
  let pHTML = parser.parseFromString(rq, "text/html");

  let optHTML = pHTML.body.firstChild;
  let favesContextHTML = pHTML.body.children[1];
  document.body.appendChild(optHTML);
  document.body.appendChild(favesContextHTML);

  console.log("inject function has finished, yay!");  
}

// runs inject, then begin afterwards
window.onload = () => { 
  inject().then( () => {
    begin();
  }
)};
