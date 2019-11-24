"use strict";

let HASLYNX = false;
let ISDESKTOP = false;
let HASTROPORED = false;

// Appply dark style for Tropo if not on original themed journal page
function setDarkTheme() {
  let darkLink = document.createElement("LINK");
  darkLink.id = "theme-style";
  darkLink.rel = "stylesheet";
  darkLink.type = "text/css";
  document.head.appendChild(darkLink);

  let tropoCSS = browser.runtime.getURL("css/tropored-dark.css");
  let lynxCSS = browser.runtime.getURL("css/lynx-dark.css");
  let darkTheme = document.getElementById("theme-style");

  let getCSS = document.styleSheets;
  for (var i = 0; i < getCSS.length; i++) {
    let hasLynx = false;
    let hasTropo = false;
    for (var i = 0; i < getCSS.length; i++) {
      if (getCSS[i].href && getCSS[i].href.includes("lynx")) {
        hasLynx = true;
      } else if (getCSS[i].href && getCSS[i].href.includes("tropo-red")) {
        hasTropo = true;
      }
    }

    if (hasLynx) { // if lynx is being used, apply lynx css
      darkTheme.href = lynxCSS;
      document.head.appendChild(darkLink);
    } else if (hasTropo) { // ditto but for tropo
      darkTheme.href = tropoCSS;
      document.head.appendChild(darkLink);
    }
  }

  let bodyElement = document.getElementsByTagName("body")[0];
  bodyElement.className = "dark";
}

// turn off dark theme
function themeOff() {
  let darkTheme = document.getElementById("theme-style");
  darkTheme.remove();

  let bodyElement = document.getElementsByTagName("body")[0];
  bodyElement.removeAttribute("class");
};

function injectSticky() {
  let optNav = document.getElementById("opt_topnav");
  let faveNav = document.getElementById("fave_topnav");
  if (optNav && faveNav) {
    optNav.remove();
    faveNav.remove();
  }

  let addButton = document.createElement("div");
  addButton.id = "desktop-buttons";
  addButton.innerHTML = `
  <span id="menu-faves"></span>
  <br>
  <span id="faves-button" class="dwidgets-buttons">
    <i class="material-icons">star</i>
  </span>
  <br>
  <span id="opt-button" class="dwidgets-buttons faves_list">
    <i class="material-icons">settings</i>
  </span>`;
  document.body.appendChild(addButton);

  document.getElementById("faves-button").addEventListener('click', function() {
    getFaves();
    let myFaves = document.getElementById("menu-faves");
    myFaves.classList.toggle("active");
    this.classList.toggle("active");
  })

  document.getElementById("opt-button").addEventListener('click', function() {
    openOptions();
  })
}

function injectCS() {
  // add options to control strip
  let controlStrip = document.getElementById("lj_controlstrip");
  if (controlStrip) {
    let actionStrip = document.getElementById("lj_controlstrip_actionlinks");
    let dwDiv = document.createElement("div");
    dwDiv.id = "dwidgets_controlstrip";
    dwDiv.innerHTML = `<span id="dwidgets-title">
        <b>DreamWidgets</b>
      </span><br>
      <a id="opt-button-cs" class="controlstrip-links">Options</a> &nbsp;&nbsp; <a id="faves-button-cs" class="controlstrip-links">Faves</a>`;
    controlStrip.insertBefore(dwDiv, actionStrip);

    // add hidden Faves menu
    let journalCanvas = document.getElementById("canvas");
    let mkCSFaves = document.createElement("div");

    mkCSFaves.id = "faves-container";
    mkCSFaves.innerHTML = `<div id="faves-cs-body">
      <div id="faves-header-cs">
        <i class="material-icons" id="edit-faves-cs">edit</i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp <i class="material-icons" id="close-faves-cs">cancel</i>
      </div>
      <div id="cs-faves"></div>
    </div>`
    document.body.insertBefore(mkCSFaves, journalCanvas);
    
    document.getElementById("opt-button-cs").addEventListener('click', function() {
      openOptions();
    })
    document.getElementById("faves-button-cs").addEventListener('click', function() {
      let csFaves = document.getElementById("faves-container");

      getFaves();
      csFaves.classList.add("open");
    })
    document.getElementById("edit-faves-cs").addEventListener('click', function() { 
      let optDiv = document.getElementById("shortcuts");
      killOldTab();
      document.getElementById("qs").classList.add("selected-tab");
      optDiv.classList.add("current-tab");
      document.getElementById("qs").classList.remove("none");
      optDiv.classList.remove("hidden-pg");
      getFaves();
      
      openOptions();
    })
    document.getElementById("close-faves-cs").addEventListener('click', function() {
      let csFaves = document.getElementById("faves-container");
      csFaves.classList.remove("open");
    })
  }
}

function injectNavbar() {
  let stickyButtons = document.getElementById("desktop-buttons");
  if (stickyButtons) {
    stickyButtons.remove();
  }

  let navbar = document.querySelector(".left");
  let faveNav = navbar.firstChild.cloneNode(true);
  let optNav = navbar.firstChild.cloneNode(true);

  optNav.id = "opt_topnav";
  optNav.innerHTML = `<a id="opt-open-nav" href="javascript:void(0)">DreamWidgets</a>`
  faveNav.id = "fave_topnav";
  faveNav.class = "faves_list";
  faveNav.innerHTML = `<a id="faves-navbar" href="javascript:void(1)">Faves</a>`;

  navbar.appendChild(optNav);
  navbar.appendChild(faveNav);

  let faveDropdown = document.createElement("UL");
  faveDropdown.id = "fave_subnav";
  faveDropdown.classList = "subnav_container dropdown";
  faveNav.appendChild(faveDropdown);
  getFaves();

  document.getElementById("opt_topnav").addEventListener('mouseover', function() {
    optNav.classList.toggle("hover", true);
  })
  document.getElementById("opt_topnav").addEventListener('mouseout', function() {
    optNav.classList.toggle("hover", false);
  })
  document.getElementById("fave_topnav").addEventListener('mouseover', function() {
    faveNav.classList.toggle("hover", true);
  })
  document.getElementById("fave_topnav").addEventListener('mouseout', function() {
    faveNav.classList.toggle("hover", false);
  })

  document.getElementById("opt-open-nav").addEventListener('click', function() {
    openOptions();
  })
  document.getElementById("faves-navbar").addEventListener('click', function() { 
    let optDiv = document.getElementById("shortcuts");
    killOldTab();
    document.getElementById("qs").classList.add("selected-tab");
    optDiv.classList.add("current-tab");
    document.getElementById("qs").classList.remove("none");
    optDiv.classList.remove("hidden-pg");
    getFaves();
    
    openOptions();
  })
}

function checkStyle() {
  if (HASLYNX) {
    injectHB();
  } else if (ISDESKTOP) {
    browser.storage.sync.get(['desktop_opt'], function(response) {
      if (response.desktop_opt == "navbar") {
        injectNavbar();
      } else {
        injectSticky();
      }
    })
  }
}
