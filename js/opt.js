"use strict";

// Open and close optons overlay
function openOptions() {
  document.getElementById("opt-overlay").style.display = "block";
}
function closeOptions() {
  document.getElementById("opt-overlay").style.display = "none";
}

function killOldTabRole() {
  let oldTab = document.querySelector("input[role=selectedTab]");
  let oldTabPg = document.querySelector("div[role=currentTab]");

  if (oldTab !== null) {
    let tRole = document.createAttribute("role");
    let pRole = document.createAttribute("role");

    tRole.value = "none";
    pRole.value = "hidden";
    oldTab.setAttributeNode(tRole);
    oldTabPg.setAttributeNode(pRole);
    console.log("The function to kill tab/div roles works, huzzah!~");
  };
};

// inject all our html in hidden divs
function inject() {
  let injectDiv = document.createElement("div");
  injectDiv.id = "opt-overlay";
  injectDiv.innerHTML = `
      <div class="op">
        <div class="op-header">
          DreamWidgets
        </div>
        <div class="tabs">
          <!-- <p><input id="gen" role="selectedTab" type="button" class="tab-button first-tab" value="General"> -->
          <!-- <input type="button" class="tab-button" role="none" id="qs" value="Favourites"><br> -->
          <!-- <input type="button" class="tab-button" role="none" id="icon-browse" value="Icon Browser"> -->
          <!-- <input type="button" class="tab-button" role="none" id="comment-form" value="Comment Form"> -->
          <!-- <input type="button" class="tab-button" role="none" id="op-button" value="Options Button"> -->
          <!-- <input type="button" class="tab-button last-tab" role="none" id="imex" value="Import/Export"><br> -->
        </div>
        <div id="general" role="currentTab">
          <b>General Settings:</b><br>
          <input type="checkbox" id="dark_style">Use Dark Theme for Lynx/Tropo Red<br>
          <input type="checkbox" id="browser">Mobile-friendly icon browser (paid accounts only!)<br>
          <!-- <input type="checkbox" id="qshortcuts">Enable Favourites<br> -->
          <!-- <input type="checkbox" id="cf-nicer">Mobile friendly comment forms<br> -->
          <input type="checkbox" id="thread">Mobile-friendly flat view
        </div>
        <div id="shortcuts" role="hidden">
          <b>Favourites:</b><br>
          <div id="no-faves">
            You don't have any favourties right now, use the options below to add some. Favourites appear in the sidebar on Lynx or when you click the DreamWidgets button on desktop.
          </div>
          <div id="current-faves">
            <!-- faves go here -->
          </div>
          <div id="add-faves">
            <b>Add Favourites:</b>
            <form id="new-faves">
              <div class="add-fav-form" role="first-fave">
                <label>Name:</label> <input type="text" class="fav-name"> | <label>URL:</label> <input type="text" class="fav-url"><br>
                <input class="current-url" type="button">Use Current Page</input>
              </div>
              <div class="add-fav-form" role="opt-fave">
                <label>Name:</label> <input type="text" class="fav-name"> | <label>URL:</label> <input type="text" class="fav-url"> <button class="rm-fave">X</button><br>
                <input class="current-url" type="button">Use Current Page</input>
              </div>
              <button class="rm-fave">+</button>
              <p><input type="submit" value="Save Favourites" class="submit">
            </form>
          </div>
        </div>
        <!-- <div id="iconBrowser" role="hidden">
          <b>Choose Icon Browser Theme:</b><br>
          <input type="radio" id="boxey" name="iconB">Boxey (default) <input type="radio" id="strip" name="iconB">Bottom Strip <input type="radio" id="custom" name="iconB">Use your own CSS
          <p><b>Custom CSS:</b><br>
          <textarea id="your_ibCSS" style="width: 402px; height: 182px;"></textarea><br>
          <input type="submit" id="ibCSS" value="Save CSS">
        </div>
        <div id="ob-options" role="hidden">
          <b>Choose Options Button Look:</b><br>
          <input type="radio" id="ob_default" name="ob">Circle (default) <input type="radio" id="ob_tab" name="ob">Tab <input type="radio" id="ob_custom" name="ob">Use your own CSS<br>
          Set button postion
          <p><b>Custom CSS:</b><br>
          <textarea id="your_obCSS" style="width: 402px; height: 182px;"></textarea><br>
          <input type="submit" id="obCSS" value="Save CSS">
        </div>
        <div id="cf-options" role="hidden">
          <b>Comment Form Style</b><br>
          Chosen option will apply on all comment forms on the site.<br>
          <input type="radio" id="cf-default" name="cf-choice">Use new DW Responsive Form everywhere<br>
          <input type="radio" id="cf-nicer" name="cf-choice">Nicer (good for mobile/desktop)<br>
          <input type="radio" id="cf-custom" name="cf-choice">Make your own
          <p><b>Custom CSS:</b><br>
          <textarea id="yourCF" style="width: 402px; height: 182px;"></textarea><br>
          <input type="submit" id="cfCSS" value="Save CSS">
        </div>
        <div id="importExport" role="hidden">
          <b>Import / Export Your Settings:</b>
          <p><input type="button" id="export" value="Export to file" class="ex">
          <br></br>
          Import from file:<br>
          <input type="file" id="browse" accept=".json" class="im"> <input type="button" id="import" value="Import">
        </div> -->
        <div class="opt-footer">
          <input id="close-opt" type="button" value="Close">
        </div>
      </div>
      `;
  document.body.appendChild(injectDiv);

// sssh, listen! listeners for open/close
  let hbOpt = document.getElementById("opt-hb");
  let buttonOpt = document.getElementById("opt-button");

  if (hbOpt !== null) {
    hbOpt.addEventListener('click', function () {
      openOptions();
    });
  }
  else {
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
  // document.getElementById("gen").addEventListener('click', function() {
  //   let optDiv = document.getElementById("general");
  //   let mkRole = document.createAttribute("role");
  //   let tbRole = document.createAttribute("role");
  //
  //   killOldTabRole();
  //   mkRole.value = "currentTab";
  //   optDiv.setAttributeNode(mkRole);
  //   tbRole.value = "selectedTab";
  //   this.setAttributeNode(tbRole);
  // });
  // document.getElementById("icon-browse").addEventListener('click', function() {
  //   let optDiv = document.getElementById("iconBrowser");
  //   let mkRole = document.createAttribute("role");
  //   let tbRole = document.createAttribute("role");
  //
  //   killOldTabRole();
  //   mkRole.value = "currentTab";
  //   optDiv.setAttributeNode(mkRole);
  //   tbRole.value = "selectedTab";
  //   this.setAttributeNode(tbRole);
  // });
  // document.getElementById("qs").addEventListener('click', function() {
  //   let optDiv = document.getElementById("shortcuts");
  //   let mkRole = document.createAttribute("role");
  //   let tbRole = document.createAttribute("role");
  //
  //   killOldTabRole();
  //   mkRole.value = "currentTab";
  //   optDiv.setAttributeNode(mkRole);
  //   tbRole.value = "selectedTab";
  //   this.setAttributeNode(tbRole);
  // });
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
  // document.getElementById("cf-ncier").addEventListener('change', function() {
  //   let cfCk = document.getElementById("cf-nicer").checked;
  //   if (cfCk == true) {
  //     browser.storage.sync.set({comment_form: 'cf_nicer'});
  //     injectNicer();
  //   }
  // });
}

function injectHB() {
  let header = document.createElement("div");
  let dwContent = document.getElementById("content");
  header.id = "hb";
  header.class = "hb-button";
  header.innerHTML = `<i class="material-icons md-48" id="hb-open" tabindex="0">menu</i>`;
  document.body.insertBefore(header, dwContent);

  let getFooter = document.querySelector("div[role=navigation]");
  getFooter.style.display = "none";

  let injectMenu = document.createElement("div");
  injectMenu.id = "hb-overlay";
  document.body.appendChild(injectMenu);
  injectMenu.innerHTML = `
          <div id="hb-menu">
          <div class="hb-button">
            <i class="material-icons md-48" id="hb-close" tabindex="0">close</i>
          </div>
          <div class="hb-nav">
            <div id="dw-user">
              <!-- insert username span here -->
            </div>
            <hr>
            <div id="dw-links">
              <a href="https://www.dreamwidth.org">Home</a><br>
              <a href="https://www.dreamwidth.org/manage/settings">Manage Account</a><br>
              <a href="https://www.dreamwidth.org/update">New Entry</a><br>
              <a id="reading-pg" href="">Reading Page</a><br>
              <a href="https://www.dreamwidth.org/nav/shop">Shop</a><br>
              <a href="https://www.dreamwidth.org/logout">Logout</a>
            </div>
            <hr>
            <div id="fav-links">
              <div id="fav-header">My Shortcuts:</div>
              <div id="shortcuts">
              <!-- insert user chosen links here -->
              </div>
              <div id="edit-shortcuts"><p>Edit Shortcuts</div>
            </div>
            <hr>
            <div id="dwidgets">
              <button id="opt-hb">DreamWidgets Config</button>
            </div>
            <br></br>
            <div id="hb-footer">
              Powered by <a href="">DreamWidgets</a>
            </div>
          </div>
          </div>`

  let hbOverlay = document.getElementById("hb-overlay");
  let hbMenu = document.getElementById("hb-menu");
  document.getElementById("hb-open").addEventListener('click', function () {
    xmlIconReqs();
    hbOverlay.style.visibility = "visible";
    hbMenu.setAttribute("role", "hb-vis");
  })
  document.getElementById("hb-close").addEventListener('click', function () {
    hbMenu.setAttribute("role", "hb-invis");
    hbOverlay.style.visibility = "hidden";
  })
  window.onclick = function(event) {
    if (event.target == hbOverlay) {
      hbOverlay.style.visibility = "hidden";
    }
  };
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

  if (hasLynx) {
    injectHB();
  } else {
    let addButton = document.createElement("div");
    addButton.id = "opt-button";
    addButton.innerHTML = `DW`;
    document.body.appendChild(addButton);
  }

  newForm();
  window.onload = injectForm();

  inject(); // inject options overlay/event listeners

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
  let newDropdown = document.getElementById("js-icon-select");

  if (oldNewBt) {
    fixNewEntry();
    getIcons();
  };

}
window.onload=function() { begin(); };
