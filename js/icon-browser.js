// replace old brows button
function replaceBrowseBt() {
  let oldBt = document.getElementById("userpics").children[2];
  if (oldBt == null) {
    console.log("No icon browser on this page, no need to inject this code");
  }
  else {
    oldBt.id = "icon-browser-open";
  }
}
 // inject the icon browser html
function injectBrowser() {
  let injectB = document.createElement("div");
  injectB.innerHTML = `
    <div class="modal">
      <div id="header">
          <p>Size: Small | Large <a id="icon-browser-close" href="">X</a>
          <br>Show Keywords: Yes | No
          <hr>
      </div>
      <div id="modal-body">
        <div id="icons">
        <!-- Icons will go here -->
        </div>
      </div>
    </div>
  `;
  injectB.id = "modal-overlay";
  document.body.appendChild(injectB);

  document.getElementById("icon-browser-open").addEventListener('click', function() {
    openModal();
    getIcons();
  })
  document.getElementById("icon-browser-close").addEventListener('click', function() {
    closeModal();
  })
  document.getElementById("icon-browser-close").addEventListener('onkeydown', function(evt) {
    if(evt.key === "Escape") {
      closeModal();
    }
  })
}

// make the icon browser
function openModal() {
  document.getElementById("modal-overlay").style.display = "block";
}
// and make it close
function closeModal() {
  document.getElementById("modal-overlay").style.display = "none";
}

// Get the icons
function iconListen () {
  console.log(this.responseText);
}
function getIcons() {
  let rq = new XMLHttpRequest();
  rq.addEventListener("load", iconListen);
  rq.responseType = 'json';
  rq.open("GET", "https://www.dreamwidth.org/__rpc_userpicselect", true);
  rq.onload = function() {
    let jsonThingy = rq.response;

  }
  rq.send(null);
}

function startUp() {
  replaceBrowseBt();

  injectBrowser();
}

window.onload=function() { startUp(); };
