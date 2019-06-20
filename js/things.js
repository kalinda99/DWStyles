// Global variable (in CAPS) for caching icons from the getIcons function so they aren't reloaded every damn time
let ICONCACHE = null;

// Open and close optons overlay
function openOptions() {
  document.getElementById("opt-overlay").style.display = "block";
}
function closeOptions() {
  document.getElementById("opt-overlay").style.display = "none";
}

// Appply dark style if not on original themed journal page
function setDarkTheme() {
  // browser.contentScripts.register({
  //     matches: ["*://*.dreamwidth.org/*"],
  //     excludeMatches: ["*://.*\.dreamwidth\.org.*"],
  //     css: [{file: "css/dark.css"}],
  //     allFrames: true,
  //     runAt: "document_start"
  //   });
  let darkStyle = document.createElement("div");
  darkStyle.id = "dark-theme";
  darkStyle.style = "display: none;";
  darkStyle.innerHTML = `
                <style text="text/css">
                body, #canvas, #shim-alpha {
                    background-color: #2d2d2d !important;
                    color: #d6d1d1 !important;
                }
                #masthead {
                    background-color: #2d2d2d;
                    border-top: .5em solid #5f5e5e !important;
                    border-bottom: .5em solid #a35359 !important;
                }
                #shim-alpha {
                    border-top: .5em solid #5f5e5e;
                    border-bottom: none !important;
                }
                a, a:link, link, .link, *|*:link {
                    color: #ee5056;
                }
                a:visited {
                    color: #ff7e82;
                }
                h1, h2, h3, h4, h5, h6 {
                    color: #d6d1d1 !important;
                }
                /* Main Page (not logged in) */
                div#intro-box-main {
                    background-color: #624040;
                }
                div#intro-border-main-left, div#intro-border-main-bottomleft, div#intro-border-main-topleft {
                    background-image: none;
                }
                div#intro-box-main p {
                    color: #ded9d9;
                }
                /* Entry poage */
                .alert-box.secondary, .panel, #htmltools, #draftstatus, #options, #submitbar, #compose-entry ul li a {
                    background-color: #2d2d2d !important;
                    color: #ded9d9 !important;
                }
                /* Navigation */
                nav, .main-nav:not(.expanded) {
                    background: #624040;
                    border-radius: 10px;
                }
                nav ul li.topnav a {
                    color: #fff;
                }
                nav ul li.hover a {
                    background: #624040 url(/img/tropo-red/icon_menu_swirl_dropdown.png) .833333em .916667em no-repeat;
                }
                .section-nav {
                    background-color: #442a2a;
                }
                .section-nav li.on {
                    background-color: #3c3b3b;
                }
                .highlight-box /* Upload box */{
                    border:1px solid #000;
                    background:#3E3E3E;
                    color:#ded9d9;
                }
                /* Comments */
                .comment-depth-odd > .dwexpcomment .header {
                    background-color:#424242;
                }
                .comment-depth-even > .dwexpcomment .header {
                    background-color:#424242;
                }
                .action-box .inner, .comment-page-list {
                    background-color: #703e43;
                    color:#ded9d9;
                }
                /* Inbox */
                .header {
                    background: #624040;
                }
                .folders a.selected , .folders a:hover {
                    background: #554c4c;
                    border-color: #bbb;
                }
                .folders a {
                    border: 1px solid #787878;
                }
                /* Profile page */
                .section, .actions li {
                    background: #414141;
                }
                /* Edit Profile Page + Profile Page */
                .section_head, div.username {
                    background: #523e3e;
                    color: #ded9d9;
                }
                .field_name, .section_subhead {
                    background: #4b3d3d;
                    color: #ded9d9;
                }
                .field_block .field_name {
                    background: #4b3d3d;
                    color: #ded9d9;
                }
                .helper, .detail, .section_body_title, .profile th {
                    color: #eee;
                }
                /* Account Settings page */
                .tablist .tab a {
                    color: #d4d4d4;
                    background: #4d4d4d;
                    border-color: #888;
                }
                .tablist .tab a:hover, .tablist .tab a.active {
                    background: #7c5c5c;
                }
                .tab-header {
                    background: #474747;
                    border-top-color: #825f5f;
                    border-left: 1px solid #2f2f2f;
                    border-right: 1px solid #2f2f2f;
                }
                /* Tables */
                .odd, tr.odd th, tr.odd td {
                    background-color: #333;
                }
                .even, tr.even th, tr.even td, thead th, tfoot td {
                    background-color: #454545;
                }
                .action-bar {
                    background-color: #343434;
                }
                /* New Login Form */
                .reveal-modal, dialog {
                    background-color: #624040
                }
                /* Form elements */
                .panel .button.secondary, .panel .secondary.submit, .panel button.secondary {
                    background-color: #38383d;
                    border-color: #424242;
                    color: #e2e2e2;
                    box-shadow: 0 0 2px 2px #973434;
                }
                #panel-quickupdate .contents label, .panel h3, label {
                    color: #c4c4c4;
                }
                input.text, textarea.text, .autocomplete-container, select.select, .autocomplete_container, .nav-search input, .nav-search select, input[type="text"], input[type="password"], input[type="date"], input[type="datetime"], input[type="datetime-local"], input[type="month"], input[type="week"], input[type="email"], input[type="number"], input[type="search"], input[type="tel"], input[type="time"], input[type="url"], input[type="color"], textarea {
                    background: #38383d !important;
                    color: #e2e2e2 !important;
                }
                .toolbar input, .submit input, .select, .component button, button {
                    background-color: #38383d;
                    border: 1px solid #c9c7c7;
                    box-shadow: none;
                    color: #e2e2e2;
                    text-shadow: none;
                }
                #body, #commenttext, #subject, #event, #secruity, #prop_picture_keyword, input {
                    background: #38383d;
                    border: 1px solid #c9c7c7;
                    box-shadow: none;
                    color: #e2e2e2;
                    text-shadow: none;
                }
                /* Icon picker */
                .ui-widget-content {
                    border: 1px solid #aaa;
                    background: #2e2e2e;
                    color: #c5c5c5;
                }
                .ui-widget-content a {
                    color: #6296db;
                }
                .selected .ui-widget-content a {
                    color: #2f4766;
                }
                .ui-widget-header {
                    border: 1px solid #aaa;
                    background: #574646;
                    color: #e1e1e1;
                }
                #iconselector_icons_list li {
                    border-color: #949494;
                    background-color: #5c4b4b;
                }
                .kwmenu .selected, #iconselector_icons_list .iconselector_selected {
                    border-color: #bfbfbf;
                    background-color: #403f3f;
                }
                footer {
                    background: #373737;
                }</style>
                `
  document.body.appendChild(darkStyle);
  browser.storage.local.set({theme: true});
  let ljStrip = document.querySelector("#lj_controlstrip");
    if (ljStrip !== null) {
      darkStyle.style = "display: block;";
    }
}
// turn off dark theme
function themeOff() {
  let darkStyle = document.getElementById("dark-theme");
  document.body.removeChild(darkStyle);
  browser.storage.local.set({theme: false});
}

// inject all our html in hidden divs
function inject() {
  let injectDiv = document.createElement("div");
  injectDiv.id = "opt-overlay";
  injectDiv.innerHTML = `
    <div class="op">
      <center><h3>DreamWidgets</h3></center>
      <hr>
      <form id="opt">
      <input type="checkbox" id="theme">Dark style for Lynx/Tropo Red<br>
      <input type="checkbox" id="drafts">Auto-save tag/comment drafts<br>
      <p></p>
      <p></p>
      <p><b>UI Tweaks</b></p>
      <input type="checkbox" id="browser">Mobile-friendly icon browser (paid accounts only!)<br>
      <input type="checkbox" id="shortcuts">Quick shortcuts<br>
      <input type="checkbox" id="rcomments">Mobile-friendly comment forms<br>
      <input type="checkbox" id="flat">Mobile-friendly flat view<br>
      <p></p>
      <p></p>
      <p><b>Import / Export Settings:</b></p>
      <p><input type="button" id="export" value="Export to file" class="ex"></p>
      <p>Import from file:</p>
      <p><input type="file" id="browse" accept=".json" class="im"> <input type="button" id="import" value="Import">
      </form>
      <hr>
      <center><input id="close-opt" type="button" value="Close"></center>
    </div>
  `;
  document.body.appendChild(injectDiv);

// sssh, listen! listeners for open/close
  document.getElementById("opt-button").addEventListener('click', function() {
    openOptions();
  })
  document.getElementById("close-opt").addEventListener('click', function() {
    closeOptions();
  })
  document.getElementById("close-opt").addEventListener('onkeydown', function(evt) {
    if(evt.key == "Escape") {
      closeOptions();
    }
  })
  // Listeners for options
  document.getElementById("theme").addEventListener('change', function () {
    let themeCk = document.getElementById("theme").checked;
    if (themeCk == true) {
      setDarkTheme();
    }
    else {
      themeOff();
    }
  })
  document.getElementById("browser").addEventListener('change', function () {
    let iconCk = document.getElementById("browser").checked;
    if (iconCk == true) {
      injectBrowseBt();
    }
    else {
      browseOff();
    }
  })
}

// ~~!! ICON BROWSER STUFF STARTS HERE !!~~
// inject icon Browse button on pages with icon browsers
function injectBrowseBt() {
  let oldBt = document.getElementById("lj_userpicselect");
  if (oldBt == null) {
    console.log("No icon browser on this page. Or you don't have a paid account.")
  }
  else {
    oldBt.parentNode.removeChild(oldBt);
    let firstKid = document.getElementById("prop_picture_keyword");
    let newKid = document.createElement("input");
    newKid.id = "icon-browser-open";
    newKid.type = "button";
    newKid.value = "Browse";
    firstKid.insertAdjacentElement("afterend", newKid);
    injectBrowser();
    browser.storage.local.set({icon_browser: true});
  }
}

// remove the button
function browseOff() {
  let browseBt = document.getElementById("icon-browser-open");
  if (browseBt == !null) {
    document.body.removeChild(browseBt);
    // add some code here to restore original button
    browser.storage.local.set({icon_browser: false})
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
        let iconArr = [icons.keywords];
        imgSrc += '<div class="icon" id="' + icons.keywords + '"><img src="' + icons.url + '"></div>';
      }
      ICONCACHE = imgSrc; // assign the icons to our cache for next time
      iconsDiv.innerHTML = ICONCACHE;
      addListeners(); // add listenrs to each icon
      };
    rq.send();
  }
}

// inject icon browser
function injectBrowser() {
  let injectB = document.createElement("div");
  injectB.innerHTML = `
    <div class="modal">
      <div id="header">
          <p>Size: Small | Large <a id="icon-browser-close" href="#close">X</a>
          <br>Show Keywords: Yes | No
          <hr>
      </div>
      <div id="modal-body">
        <div id="icons-list">
        <!-- Icons / keywords go here -->
        </div>
      </div>
      <div id="footer">
        <hr>
        <p><input id="select" type="button" value="Select Icon">
      </div>
    </div>
  `;
  injectB.id = "icons-overlay";
  document.body.appendChild(injectB);

  document.getElementById("icon-browser-open").addEventListener('click', function() {
    openModal();
    getIcons();
  });
  document.getElementById("icon-browser-close").addEventListener('click', function() {
    closeModal();
  });
  document.getElementById("select").addEventListener('click', function () {
    let selectIcon = document.querySelector("selected");
    if (selectIcon !== null) {
      closeModal();
    };
  });
}

function addListeners() {
  let iconList = document.getElementsByClassName("icon");

  for (var i = 0; i < iconList.length; i++) {
    let attribute = iconList[i].getAttribute("id");
    let dropDown = document.getElementById("prop_picture_keyword");

    iconList[i].addEventListener('click', function() {
      dropDown.value = attribute;
      attribute.selected = "selected";
    });
    iconList[i].addEventListener('dblclick', function() {
      dropDown.value = attribute;
      closeModal();
    });
  };
}
// ~~!! END OF ICON BROWSER STUFF !!~~

function begin() {
  // Replace logo with transparent one
  let logo = document.querySelector("#logo img");
  if (logo !== null) {
    logo.src = "https://raw.githubusercontent.com/kalinda99/dwstyles/master/img/dw-logo.png";
  }

  // Add the options overlay to DW pages
  let addButton = document.createElement("div");
  addButton.id = "opt-button";
  addButton.innerHTML = `DW`;
  document.body.appendChild(addButton);

  inject();

// retrieve local storage values for options
  browser.storage.local.get(['theme'], function (response) {
    if (response.theme == true) {
      setDarkTheme();
      document.getElementById("theme").checked = true;
    }
  })
  browser.storage.local.get(['icon_browser'], function (response) {
    if (response.icon_browser == true) {
      injectBrowseBt();
      document.getElementById("browser").checked = true;
    }
  })
  browser.storage.local.get(['cookie'], function (response) {
    if (response.cookie == true) {
      document.getElementById("lynx").checked = true;
    }
  })
}

window.onload=function() { begin(); };
