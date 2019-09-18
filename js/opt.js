"use strict";

// Open and close optons overlay
function openOptions() {
  document.getElementById("opt-overlay").style.display = "block";
}
function closeOptions() {
  document.getElementById("opt-overlay").style.display = "none";
}

function killOldTab() {
  let oldTab = document.querySelector(".selected-tab");
  let oldTabPg = document.querySelector(".current-tab");

  if (oldTab) {
    oldTab.classList.remove("selected-tab");
    oldTabPg.classList.remove("current-tab");
    oldTab.classList.add("none");
    oldTabPg.classList.add("hidden-pg");
  }
};

function optListeners() {
  // sssh, listen! listeners for open/close
  let buttonOpt = document.getElementById("opt-button");
  if (buttonOpt) {
    buttonOpt.addEventListener('click', function() {
      openOptions();
    });
  }
  document.getElementById("close-opt").addEventListener('click', function() {
    closeOptions();
  });
  let optModal = document.getElementById("opt-overlay");
  window.onclick = function(event) {
    if (event.target == optModal) {
      closeOptions();
    }
  };

  //Listeners for tabs
  document.getElementById("gen").addEventListener('click', function() {
    let optDiv = document.getElementById("general");
    killOldTab();
    this.classList.add("selected-tab");
    optDiv.classList.add("current-tab");
    this.classList.remove("none");
    optDiv.classList.remove("hidden-pg");
  });
  document.getElementById("customize").addEventListener('click', function() {
    let optDiv = document.getElementById("custom");
    killOldTab();
    this.classList.add("selected-tab");
    optDiv.classList.add("current-tab");
    this.classList.remove("none");
    optDiv.classList.remove("hidden-pg");
  });
  document.getElementById("qs").addEventListener('click', function() {
    let optDiv = document.getElementById("shortcuts");
    killOldTab();
    this.classList.add("selected-tab");
    optDiv.classList.add("current-tab");
    this.classList.remove("none");
    optDiv.classList.remove("hidden-pg");
    getFaves();
  });
  // document.getElementById("comment-form").addEventListener('click', function() {
  //   let optDiv = document.getElementById("cf-options");
  //   let mkRole = document.createAttribute("role");
  //   let tbRole = document.createAttribute("role");
  //
  //   killOldTabRole();
  //   mkRole.value = "currentTab";
  //   optDiv.setAttributeNode(mkRole);
  //   tbRole.value = "selectedTab";
  //   this.setAttributeNode(tbRole);
  // });
  // document.getElementById("op-button").addEventListener('click', function() {
  //   let optDiv = document.getElementById("ob-options");
  //   let mkRole = document.createAttribute("role");
  //   let tbRole = document.createAttribute("role");
  //
  //   killOldTabRole();
  //   mkRole.value = "currentTab";
  //   optDiv.setAttributeNode(mkRole);
  //   tbRole.value = "selectedTab";
  //   this.setAttributeNode(tbRole);
  // });
  // document.getElementById("imex").addEventListener('click', function() {
  //   let optDiv = document.getElementById("importExport");
  //   let mkRole = document.createAttribute("role");
  //   let tbRole = document.createAttribute("role");
  //
  //   killOldTabRole();
  //   mkRole.value = "currentTab";
  //   optDiv.setAttributeNode(mkRole);
  //   tbRole.value = "selectedTab";
  //   this.setAttributeNode(tbRole);
  // });

  // Listeners for options
  document.getElementById("dark_style").addEventListener('change', function() {
    let themeCk = document.getElementById("dark_style").checked;
    if (themeCk == true) {
      setDarkTheme();
      browser.storage.sync.set({dark_theme: true}).then( function(msg) {
        console.log(msg);
      });
    }
    else {
      themeOff();
      browser.storage.sync.set({dark_theme: false});
    }
  });  
  document.getElementById("browser").addEventListener('change', function() {
    let iconCk = document.getElementById("browser").checked;
    if (iconCk == true) {
      injectBrowseBt();
      browser.storage.sync.set({icon_browser: true});
    }
    else {
      browseOff();
      browser.storage.sync.set({icon_browser: false});
    }
  });
  document.getElementById("thread").addEventListener('change', function() {
    let threadCk = document.getElementById("thread").checked;
    if (threadCk == true) {
      browser.storage.sync.set({better_thread: true});
      betterThreadView();
    }
  });
  
  document.getElementById("add-fave").addEventListener('click', function(e) {
    e.preventDefault();
    addFaves();
  });
}

function injectHB() {
  let header = document.createElement("div");
  let dwContent = document.getElementById("content");
  header.id = "hb";
  header.innerHTML = `<div id="hb-button">
      <div></div>
    </div>`;
  document.body.insertBefore(header, dwContent);

  let getFooter = document.querySelector("div[role=navigation]");
  getFooter.style.display = "none";

  let htmlFile = browser.runtime.getURL("html/hb-menu.html");

  let rq = new XMLHttpRequest();
  rq.responseType = 'document';
  rq.open("GET", htmlFile);
  rq.onload = function() {
    let hbHTML = rq.response.body.firstChild;
    document.body.appendChild(hbHTML);

    let hbOverlay = document.getElementById("hb-overlay");
    let hbMenu = document.getElementById("hb-menu");
    document.getElementById("hb-button").addEventListener('click', function () {
      if (document.querySelector(".hb-active") == null) {
        this.classList.toggle("hb-active");
        // document.body.classList.toggle("hb-open");
        xmlIconReqs();
        getFaves();
        hbOverlay.style.visibility = "visible";
        hbMenu.setAttribute("role", "hb-vis");
      } else if (document.querySelector(".hb-active")) {
        this.classList.toggle("hb-active");
        hbMenu.setAttribute("role", "hb-invis");
        hbOverlay.style.visibility = "hidden";      
      }
    })
    window.onclick = function(event) {
      if (event.target == hbOverlay) {
        hbMenu.setAttribute("role", "hb-invis");
        hbOverlay.style.visibility = "hidden";
        document.getElementById("hb-button").classList.toggle("hb-active");
      }
    }
    document.getElementById("opt-hb").addEventListener('click', function() {
      openOptions();
      hbMenu.setAttribute("role", "hb-invis");
      hbOverlay.style.visibility = "hidden";
      document.getElementById("hb-button").classList.toggle("hb-active");
    })
    document.getElementById("edit-faves").addEventListener('click', function() { 
      let optDiv = document.getElementById("shortcuts");
      killOldTab();
      document.getElementById("qs").classList.add("selected-tab");
      optDiv.classList.add("current-tab");
      document.getElementById("qs").classList.remove("none");
      optDiv.classList.remove("hidden-pg");
      getFaves();

      openOptions();
      hbMenu.setAttribute("role", "hb-invis");
      hbOverlay.style.visibility = "hidden";
      document.getElementById("hb-button").classList.toggle("hb-active");
    })
  };
  rq.send();  
}

function begin() {
  // Replace logo with transparent one
  let hasTropo = false;
  let getCSS = document.styleSheets;
  let logo = document.querySelector("#logo img");
  for (let i = 0; i < getCSS.length; i++) {
    if (getCSS[i].href && getCSS[i].href.includes("tropo-red")) {
    hasTropo = true; 
    }
  }
  if (logo && hasTropo) {
    let logoURL = browser.runtime.getURL("img/dw-logo.png");
    logo.src = logoURL;
  }

  // Add the options overlay button to DW pages
  let hasLynx = false;
  for (var i = 0; i < getCSS.length; i++) {
    if (getCSS[i].href && getCSS[i].href.includes("lynx")) {
    hasLynx = true;
    }
  }

  let lynxTweaks = browser.runtime.getURL("css/lynx-tweaks.css");
  if (hasLynx) {
    let lynxLink = document.createElement("LINK");
    lynxLink.id = "lynx-tweaks";
    lynxLink.rel = "stylesheet";
    lynxLink.type = "text/css";
    lynxLink.href = lynxTweaks;
    document.head.appendChild(lynxLink);
    injectHB();
  } else {
      let addButton = document.createElement("div");
      addButton.id = "desktop-buttons";
      let extHTML = `
      <span id="menu-faves"></span>
      <br>
      <span id="faves-button">
        <i class="material-icons">star</i>
      </span>
      <br>
      <span id="opt-button">
        <i class="material-icons">settings</i>
      </span>`;
      let cleanHTML = DOMPurify.sanitize(extHTML);
      addButton.innerHTML = cleanHTML;
      document.body.appendChild(addButton);

      document.getElementById("faves-button").addEventListener('click', function() {
        getFaves();
        let myFaves = document.getElementById("menu-faves");
        myFaves.classList.toggle("active");
        this.classList.toggle("active");
      })
  }

  optListeners();

  newForm();
  window.onload = injectForm();

  browser.storage.sync.get(['dark_theme'], function (response) {
    if (response.dark_theme == true) {
      setDarkTheme();
      document.getElementById("dark_style").checked = true;
    }
    else {
      document.getElementById("dark_style").checked = false;
    }
  });

  browser.storage.sync.get(['icon_browser'], function (response) {
    if (response.icon_browser == true) {
      injectBrowseBt();
      document.getElementById("browser").checked = true;
    }
    else {
      document.getElementById("browser").checked = false;
    }
  });

  browser.storage.sync.get(['better_thread'], function (response) {
    if (response.better_thread == true) {
      document.getElementById("thread").checked = true;
      betterThreadView();
    }
  });

  let oldNewBt = document.getElementById("js-icon-browse");

  if (oldNewBt) {
    fixNewEntry();
    getIcons();
  };
}

function inject() {
  let htmlFile = browser.runtime.getURL("html/options.html");

  let rq = new XMLHttpRequest();
  rq.responseType = 'document';
  rq.open("GET", htmlFile);
  rq.onload = function() {
    let optHTML = rq.response.body.firstChild;
    document.body.appendChild(optHTML);

    begin();
  };
  rq.send();
}

window.onload=function() { inject(); };
