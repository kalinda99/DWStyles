"use strict";

// Open and close optons overlay
function openOptions() {
  document.getElementById("opt-overlay").style.display = "block";
}
function closeOptions() {
  document.getElementById("opt-overlay").style.display = "none";
}

function injectSticky() {
  let addButton = document.createElement("div");
  addButton.id = "desktop-buttons";
  addButton.innerHTML = `
  <span id="menu-faves"></span>
  <br>
  <span id="faves-button" class="dwidgets-buttons">
    <i class="material-icons">star</i>
  </span>
  <br>
  <span id="opt-button" class="dwidgets-buttons">
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
  let navbar = document.querySelector(".left");
  let faveNav = navbar.firstChild.cloneNode(true);
  let optNav = navbar.firstChild.cloneNode(true);

  optNav.id = "opt_topnav";
  optNav.innerHTML = `<a id="opt-open-nav" href="javascript:void">DreamWidgets</a>`
  faveNav.id = "fave_topnav";
  faveNav.innerHTML = `<a id="faves-navbar" href="javascript:void">Faves</a>`;

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
  } else if (HASTROPO) {
    browser.storage.sync.get(['desktop_opt'], function(response) {
      console.log(response.desktop_opt);
      if (response.desktop_opt == "navbar") {
        injectNavbar();
      } else {
        injectSticky();
      }
    })
  }
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
      if (HASTROPO) {
        injectNavbar();
        let desktopButtons = document.getElementById("desktop-buttons");
        if (desktopButtons) {
          document.removeChild(desktopButtons);
        }
      }      
    }
  })
  document.getElementById("sticky-b").addEventListener('change', function() {
    let radioCk = document.getElementById("sticky-b").checked;
    if (radioCk == true) {
      browser.storage.sync.set({desktop_opt: "sticky"});
      if (HASTROPO) {       
        injectSticky();
        let optNav = document.getElementById("opt_topnav");
        let faveNav = document.getElementById("fave_topnav");
        if (faveNav && faveNav) {
          document.removeChild(optNav);
          document.removeChild(faveNav);
        }
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
        document.getElementById("dwidgets").classList = "";
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
        document.getElementById("dwidgets").classList = "right";
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
        document.getElementById("hb-menu").classList.remove("right, left");
        document.getElementById("hb-menu").classList.add("hori");
        document.getElementById("dwidgets").classList = "";
      }
    }
  })
}

function injectHB() {
  let header = document.createElement("div");
  let dwContent = document.getElementById("content");
  header.id = "hb-strip";
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
        xmlIconReqs();
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
        hbMenu.classList = "hori"
      }
    });
  };
  rq.send();  
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

  checkStyle();

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
    if (response.desktop_opt == "hb_right") {
      document.getElementById("hb-right").checked = true;
    } else if (response.desktop_opt == "hb_top") {
      document.getElementById("hb-top").checked = true;
    } else {
      document.getElementById("hb-left").checked = true;
    }
  })

  let oldNewBt = document.getElementById("js-icon-browse");

  if (oldNewBt) {
    fixNewEntry();
    getIcons();
  };
}

function inject() {
  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].href && document.styleSheets[i].href.includes("lynx")) {
    HASLYNX = true;
    }
  }
  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].href && document.styleSheets[i].href.includes("tropo-base")) {
    HASTROPO = true;
    }
  }
  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].href && document.styleSheets[i].href.includes("tropo-red")) {
    HASTROPORED = true;
    }
  }

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
