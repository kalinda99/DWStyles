"use strict";
// import IconBrowser from './icon-browser';
// let ibf = new IconBrowser();

// Open and close optons overlay
function openOptions() {
  document.getElementById("opt-overlay").style.display = "block";
}
function closeOptions() {
  document.getElementById("opt-overlay").style.display = "none";
}

// load up the settings
function loadSettings() {
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

  window.onload = checkStyle();

  browser.storage.sync.get(['desktop_opt'], function(response) {
    console.log(response.desktop_opt);    
    if (response.desktop_opt == "navbar") {
      document.getElementById("nav-b").checked = true;
    } else {
      document.getElementById("sticky-b").checked = true;
    }
  })
  browser.storage.sync.get(['mobile_opt'], function(response) {
    console.log(response.mobile_opt);    
    if (response.mobile_opt == "hb_right") {
      document.getElementById("hb-right").checked = true;
    } else if (response.mobile_opt == "hb_top") {
      document.getElementById("hb-top").checked = true;
    } else {
      document.getElementById("hb-left").checked = true;
    }
  })
}

// export settings, which is itself done by background.js this script doesn't have download permissions :(
function exportSettings() {
  browser.runtime.sendMessage({command: "getExportURL"}).then(function(message) {
    console.log("The reply was: " + message.response);
    if (response == "NoSettings") {
      alert("Your settings are defaults, there's no need to export aynthing. Maybe add a bookmark or two first?");
    } else {
      console.log("The reply was: " + message.response);
    };
  });
}

// functions to import settings saved as json file
function handleFile() {
	let file = document.getElementById("browse").files[0]
	let reader = new FileReader();
	reader.onload = importSettings;
	reader.readAsText(file);
}
function importSettings()	{
  let json = JSON.parse(this.result);
  browser.storage.sync.set(json).then(function() {
    browser.storage.sync.get().then(function(list) {
      console.log("Settings imported, here they are: " + list);
    })
    loadSettings();
    getFaves();
  });
	document.getElementById("browse").value = '';
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
  // let buttonOpt = document.getElementById("opt-button");
  // if (buttonOpt) {
  //   buttonOpt.addEventListener('click', function() {
  //     openOptions();
  //   });
  // }
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
  // document.getElementById("customize").addEventListener('click', function() {
  //   let optDiv = document.getElementById("custom");
  //   killOldTab();
  //   this.classList.add("selected-tab");
  //   optDiv.classList.add("current-tab");
  //   this.classList.remove("none");
  //   optDiv.classList.remove("hidden-pg");
  // });
  document.getElementById("qs").addEventListener('click', function() {
    let optDiv = document.getElementById("shortcuts");
    killOldTab();
    this.classList.add("selected-tab");
    optDiv.classList.add("current-tab");
    this.classList.remove("none");
    optDiv.classList.remove("hidden-pg");
    getFaves();
  });
  document.getElementById("appearance").addEventListener('click', function() {
    let optDiv = document.getElementById("opt-appear");
    killOldTab();
    this.classList.add("selected-tab");
    optDiv.classList.add("current-tab");
    this.classList.remove("none");
    optDiv.classList.remove("hidden-pg");
  });
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
  document.getElementById("imex").addEventListener('click', function() {
    let optDiv = document.getElementById("importExport");
    killOldTab();
    this.classList.add("selected-tab");
    optDiv.classList.add("current-tab");
    this.classList.remove("none");
    optDiv.classList.remove("hidden-pg");
  });

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
    else {
      browser.storage.sync.set({better_thread: false});
      // need to add function to turn off the thread view here
    }
  });
  
  document.getElementById("add-fave").addEventListener('click', function(e) {
    e.preventDefault();
    addFaves();
  });

  // Appearance options
  // desktop:
  document.getElementById("nav-b").addEventListener('change', function() {
    let radioCk = document.getElementById("nav-b").checked;
    if (radioCk == true) {
      browser.storage.sync.set({desktop_opt: "navbar"});
      if (ISDESKTOP) {
        injectNavbar();
      }     
    }
  })
  document.getElementById("sticky-b").addEventListener('change', function() {
    let radioCk = document.getElementById("sticky-b").checked;
    if (radioCk == true) {
      browser.storage.sync.set({desktop_opt: "sticky"});
      if (ISDESKTOP) { 
        injectSticky();
      }
    }
  })

  // mobile:
  document.getElementById("hb-left").addEventListener('change', function() {
    let radioCk = document.getElementById("hb-left").checked;
    if (radioCk == true) {
      browser.storage.sync.set({mobile_opt: "hb_left"});
      if (HASLYNX) {
        document.getElementById("hb-strip").classList = "";
        document.getElementById("hb-menu").classList.remove("right");
        document.getElementById("hb-menu").classList = "left";
      }
    }
  })
  document.getElementById("hb-right").addEventListener('change', function() {
    let radioCk = document.getElementById("hb-right").checked;
    if (radioCk == true) {
      browser.storage.sync.set({mobile_opt: "hb_right"});
      if (HASLYNX) {
        document.getElementById("hb-strip").classList = "";
        document.getElementById("hb-strip").classList = "align-right";
        document.getElementById("hb-menu").classList.remove("left");
        document.getElementById("hb-menu").classList = "right";
      }
    }
  })
  document.getElementById("hb-top").addEventListener('change', function() {
    let radioCk = document.getElementById("hb-top").checked;
    if (radioCk == true) {
      browser.storage.sync.set({mobile_opt: "hb_top"});
      if (HASLYNX) {
        document.getElementById("hb-strip").classList = "";
        document.getElementById("hb-strip").classList = "align-right";
        document.getElementById("hb-menu").classList.remove("right" + "left");
        document.getElementById("hb-menu").classList.add("hori");
      }
    }
  })

  // import/export
  document.getElementById("export").addEventListener('click', function() {    
    exportSettings();
  })
  document.getElementById("import").addEventListener('click', function() {
    handleFile();
  })  
}

async function injectHB() {
  let header = document.createElement("div");
  let dwContent = document.getElementById("content");
  header.id = "hb-strip";
  header.innerHTML = `<div id="hb-button">
      <div></div>
    </div>`;  
  document.body.insertBefore(header, dwContent);

  let getFooter = document.querySelector("div[role=navigation]");
  getFooter.style.display = "none";

  // hbHTML();

  let htmlFile = browser.runtime.getURL("html/hb-menu.html");
  let parser = new DOMParser();

  const response = await fetch(htmlFile);
  const rq = await response.text();
  let pHTML = parser.parseFromString(rq, "text/html");

  let hbHTML = pHTML.body.firstChild;
  document.body.appendChild(hbHTML);

  let hbOverlay = document.getElementById("hb-overlay");
  let hbMenu = document.getElementById("hb-menu");
  let readingPg = document.getElementById("reading-pg");
  document.getElementById("hb-button").addEventListener('click', function () {
    if (document.querySelector(".hb-active") == null) {
      this.classList.toggle("hb-active");
      if (!USER) {
        let iconSrc = '<img src="https://www.dreamwidth.org/img/nouserpic.png"></a><br><a href="https://www.dreamwidth.org/login">Login</a> - <a href="https://www.dreamwidth.org/create">Create Account</a>'
        document.getElementById("dw-user").innerHTML = iconSrc;

        readingPg.href = "https://" + USER + ".dreamdwidth.org/read";
      } else {
        let iconSrc = '<a href="https://www.dreamwidth.org/manage/icons"><img src="' + DICONURL + '"></a><br>' + USERTAG;
        document.getElementById("dw-user").innerHTML = iconSrc;
      }
      getFaves();
      hbOverlay.style.visibility = "visible";
      hbMenu.classList.add("visible");
    } else if (document.querySelector(".hb-active")) {
      this.classList.toggle("hb-active");
      hbMenu.classList.remove("visible");
      hbOverlay.style.visibility = "hidden";
    }
  })
  window.onclick = function(event) {
    if (event.target == hbOverlay) {
      hbOverlay.style.visibility = "hidden";
      hbMenu.classList.remove("visible");
      document.getElementById("hb-button").classList.toggle("hb-active");
    }
  }
  document.getElementById("opt-hb").addEventListener('click', function() {
    openOptions();
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
    hbMenu.classList.remove("visible");
    hbOverlay.style.visibility = "hidden";
    document.getElementById("hb-button").classList.toggle("hb-active");
  })
  
  browser.storage.sync.get(['mobile_opt'], function(response) {
    if (response.mobile_opt == "hb_right") {
      header.classList = "align-right";
      hbMenu.classList.remove("left");
      hbMenu.classList = "right";
      document.getElementById("dwidgets").classList = "right";
    } else if (response.mobile_opt == "hb_top") {
      header.classList = "align-right";
      hbMenu.classList.remove("left");
      hbMenu.classList = "hori";
    }
  })

  // let htmlFile = browser.runtime.getURL("html/hb-menu.html");
  // let parser = new DOMParser();

  // const response = await fetch(htmlFile);
  // const rq = await response.text();
  // let pHTML = parser.parseFromString(rq, "text/html");
  // let hbHTML = pHTML.response.body.firstChild;
  // document.body.appendChild(hbHTML);
}


function begin() {
  // Replace logo with transparent one
  let logo = document.querySelector("#logo img");
  if (logo && HASTROPORED) {
    let logoURL = browser.runtime.getURL("img/dw-logo.png");
    logo.src = logoURL;
  }

  let lynxTweaks = browser.runtime.getURL("css/lynx-tweaks.css");
  if (HASLYNX) {
    let lynxLink = document.createElement("LINK");
    lynxLink.id = "lynx-tweaks";
    lynxLink.rel = "stylesheet";
    lynxLink.type = "text/css";
    lynxLink.href = lynxTweaks;
    document.head.appendChild(lynxLink);
  }

  injectCS();

  optListeners();

  newForm();
  window.onload = injectForm();

  loadSettings();

  // console.log("Your global vars are - current user: " + USER + " Default icon URL: " + DICONURL);

  let oldNewBt = document.getElementById("js-icon-browse");
  if (oldNewBt) {
    fixNewEntry();
  };
}

async function inject() {  
  getFirstIcon().then(async function() {  
    const response = await fetch("https://www.dreamwidth.org/__rpc_ctxpopup?mode=getinfo&userpic_url=" + FIRSTICON);
    const userJson = await response.json(); 
    USER = userJson.username;
    DICONURL = userJson.url_userpic;
    USERTAG = userJson.ljuser_tag;
  })

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

  // optHTML();

  let htmlFile = browser.runtime.getURL("html/options.html");
  let parser = new DOMParser();

  const response = await fetch(htmlFile);
  const rq = await response.text();
  let pHTML = parser.parseFromString(rq, "text/html");

  let optHTML = pHTML.body.firstChild;
  document.body.appendChild(optHTML);
}

window.onload=function() { inject().then(function() {
  begin();}); };
