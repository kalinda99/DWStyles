"use strict";

let HASLYNX = false;
let HASTROPO = false;
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
  document.head.removeChild(darkTheme);

  let bodyElement = document.getElementsByTagName("body")[0];
  bodyElement.removeAttribute("class");
};
