function optHTML() {
  let newDiv = document.createElement("div");
  newDiv.id = "opt-overlay";
  newDiv.innerHTML = `
  <div class="op">
  <div class="op-header">
    DreamWidgets
  </div>
  <div class="tabs">
    <p><input id="gen" type="button" class="tab-button selected-tab" value="General">
    <input type="button" class="tab-button none" id="qs" value="Bookmarks">
    <input type="button" class="tab-button none" id="appearance" value="Appearance">
    <!-- <input type="button" class="tab-button none" id="customize" value="Customization"> -->
    <input type="button" class="tab-button none" id="imex" value="Import/Export"><br>
  </div>
  <div id="general" class="current-tab">
    <b>General Settings:</b><br>
    <label class="checkbox"><input type="checkbox" id="dark_style">Use Dark Theme for Lynx/Tropo Red</label><br>
    <label class="checkbox"><input type="checkbox" id="browser">Mobile-friendly icon browser (paid accounts only!)</label><br>
    <label class="checkbox"><input type="checkbox" id="thread">Mobile-friendly flat view</label>
  </div>
  <div id="shortcuts" class="hidden-pg">
    <b>Bookmarks:</b><br>
    <p><div id="current-faves">
      <!-- faves go here -->
    </div>
    <div id="add-faves">
      <p><b>Add Bookmark:</b>
      <form id="new-faves">
        <div class="add-fav-form" role="first-fave">
          <label>Name:</label> <input type="text" id="fav-name"> <label>URL:</label> https://<input type="text" id="fav-url">.dreamwidth.org
        </div>
        <p><input id="add-fave" type="submit" value="Add Bookmark">
      </form>
    </div>
  </div>
  <!-- <div id="custom" class="hidden-pg">
      <p>Here you can customize the look of things with your own CSS.</p>

      <p><b>Custom Journal CSS:</b><br>
      <form id="custom-css">
          Applies to: <input id="journal-url" type="text"> <input id="current-journal" type="button" value="Use Current Journal"></br>
          <p>Your CSS:<br>
          <textarea id="my-journal-css" style="width: 402px; height: 182px;"></textarea><br>
          <input type="submit" id="sub-j-css" value="Save">
      </form>
  </div> -->

  <!-- <div id="ob-options" class="hidden-pg">
    <b>Choose Options Button Look:</b><br>
    <input type="radio" id="ob_default" name="ob">Circle (default) <input type="radio" id="ob_tab" name="ob">Tab <input type="radio" id="ob_custom" name="ob">Use your own CSS<br>
    Set button postion
    <p><b>Custom CSS:</b><br>
    <textarea id="your_obCSS" style="width: 402px; height: 182px;"></textarea><br>
    <input type="submit" id="obCSS" value="Save CSS">
  </div> -->
  <div id="opt-appear" class="hidden-pg">
    <b>Desktop:</b><br>
    Options/Bookmarks button:<br>
    <label class="radio"><input type="radio" id="nav-b"name="opt-desktop">Add to DW navigation bar</label><br>
    <label class="radio"><input type="radio" id="sticky-b" name="opt-desktop">Sticky buttons</label>
    <!-- <label class="radio"><input type="radio" id="browser-b"name="opt-desktop">Browser toolbar button</label> -->
    <p></p>
    <b>Mobile:</b><br>
    NOTE: These options assume the use of DW's Lynx/Light layout, which looks better on mobile.<br>
    Options/Bookmarks Menus:<br>
    <label class="radio"><input type="radio" id="hb-left" name="opt-mobile">Left side-menu</label><br>
    <label class="radio"><input type="radio" id="hb-right" name="opt-mobile">Right side-menu</label><br>
    <label class="radio"><input type="radio" id="hb-top" name="opt-mobile">Top menu</label>
    <!-- <p><b>Custom CSS:</b><br>
    <textarea id="yourCF" style="width: 402px; height: 182px;"></textarea><br>
    <input type="submit" id="cfCSS" value="Save CSS"> -->
  </div>
  <div id="importExport" class="hidden-pg">
    Export Your Settings: <input type="button" id="export" value="Export to file" class="ex">
    <br></br>
    Import from file:<br>
    <input type="file" id="browse" accept=".json" class="im"> <input type="button" id="import" value="Import">
  </div>

  <div class="opt-footer">
    <input id="close-opt" type="button" value="Close">
  </div>
  </div>`;

  document.body.appendChild(newDiv);
}

function hbHTML() {
  let content = document.getElementById("content");

  let newDiv = document.createElement("div");
  newDiv.id = "hb-overlay";
  newDiv.innerHTML = `<div id="hb-menu" class="left">
  <div class="hb-nav">
    <div id="dwidgets">
      <i id="opt-hb" class="material-icons">settings</i>
    </div>
    <div id="dw-user">
      <!-- insert username span here -->
    </div>
    <hr>
    <div id="dw-links">
      <div><a href="https://www.dreamwidth.org">Home</a></div>
      <div><a href="https://www.dreamwidth.org/inbox/">Inbox</a></div>
      <div><a href="https://www.dreamwidth.org/manage/settings">Manage Account</a></div>
      <div><a href="https://www.dreamwidth.org/update">New Entry</a></div>
      <div><a id="reading-pg" href="">Reading Page</a></div>
      <div><a href="https://www.dreamwidth.org/nav/shop">Shop</a></div>
      <div><a href="https://www.dreamwidth.org/logout">Logout</a></div>
    </div>
    <hr>
    <div id="bookmarks-header">
      <b>Bookmarks</b> (<a id="edit-faves" href="javascript:void">edit</a>)<br>
    </div> 
    <div id="fav-links"></div>
    <div id="hb-footer">
      <p>Powered by <a href="https://github.com/kalinda99/dreamwidgets" target="_blank">DreamWidgets</a></p>
    </div>
  </div>
  </div>`;

  content.appendChild(newDiv);
}

function iconBrowserHTML() {
  let content = document.getElementById("content");
  let newDiv = document.createElement("div");
  newDiv.id = "icons-overlay";

  newDiv.innerHTML = `
  <div id="icon-modal" class="mobile">
    <div id="icon-header">
      <!-- <div id="radio-ib"><p>Size: <input type="radio" id="lil-icons" name="size" value="small">Small <input type="radio" id="big-icons" name="size" value="large">Large</div> -->
      <div id="keyword-opts">Size: Normal | Small <div id="keyword-label">Keywords: <div id="keywords"></div> <input type="button" id="selectB" value="Select Icon"></div></div>
      <i class="material-icons md-48" id="icon-browser-close" tabindex="0">close</i>
    </div>
    <div id="modal-body">
      <div id="icons-list" class="normal-size">
      <!-- Icons / keywords go here -->
      </div>
    </div>
  </div>`;

  content.appendChild(newDiv);
}