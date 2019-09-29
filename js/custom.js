// all user customizations go here

// fetch faves from local storage
function getFaves() {
  // browser.storage.sync.get().then(function(item) {
  //   console.log(item);    
  // })

  browser.storage.sync.get().then(function(item) {
    if (!item.user_faves) {
      console.log("No user faves found");
      let user_faves = new Array();
      browser.storage.sync.set({user_faves});
    } else if (item.user_faves) {
      let favDiv = document.getElementById("current-faves");
      let hbFaveDiv = document.getElementById("fav-links");
      let desktopFaveDiv = document.getElementById("menu-faves");
      let controlStripFaves = document.getElementById("cs-faves");
      let faveNav = document.getElementById("fave_subnav");

      favDiv.innerHTML = "";
      let favesList = item.user_faves;
      for (let i = 0; i < favesList.length; i++) {
        let name = favesList[i].name;
        let url = favesList[i].url;

        let addFav = document.createElement("div");
        addFav.classList = "shortcut";
        addFav.id = url;
        addFav.innerHTML = 'Name: <input type="text" class="favname" value="' + name + '"> URL: <input type="text" class="favurl" value="' + url + '"> <div class="rmfav" id="rm-' + url + '"><i class="material-icons" tabindex="0">clear</i></div>';
    
        favDiv.appendChild(addFav);

        let rmFave = document.getElementsByClassName("rmfav");
        for (let i = 0; i < rmFave.length; i++) {
          rmFave[i].addEventListener('click', function() {
            let fName = this.parentNode;
            favDiv.removeChild(fName);
            modifyFaves();
          })
        }        
      }
      if (hbFaveDiv) {
        let list = "";
        for (let i = 0; i < favesList.length; i++) {
          let name = favesList[i].name;
          let url = favesList[i].url;
          list += '<div><i class="material-icons">star</i><a id="' + url + '" href="' + url + '">' + name + '</a></div>';
          // list = i !== favesList.length-1 ? list + "<br>" : list;
        }
        let cleanList = DOMPurify.sanitize(list)
        hbFaveDiv.innerHTML = cleanList;
      } else if (desktopFaveDiv) {
          let list = "";
          for (let i = 0; i < favesList.length; i++) {
            let name = favesList[i].name;
            let url = favesList[i].url;
            list += '<div id="' + url + '" class="bookmark"><a href="' + url + '">' + name + '</a></div>';
            list = i !== favesList.length-1 ? list + "<br>" : list;
          }
          let cleanList = DOMPurify.sanitize(list)
          desktopFaveDiv.innerHTML = cleanList;
      } else if (controlStripFaves) {
        let list = "";
        for (let i = 0; i < favesList.length; i++) {
          let name = favesList[i].name;
          let url = favesList[i].url;
          list += '<span><i class="material-icons">star</i><a id="' + url + '" href="' + url + '">' + name + '</a></span>';
          list = i !== favesList.length-1 ? list + "&nbsp;&nbsp;" : list;
        }
        let cleanList = DOMPurify.sanitize(list)
        controlStripFaves.innerHTML = cleanList;
      } else if (faveNav) {
        let list = "";
        for (let i = 0; i < favesList.length; i++) {
          let name = favesList[i].name;
          let url = favesList[i].url;
          list += '<li class="subnav"><a id="' + url + '" href="' + url + '">' + name + '</a></li>';
        }
        let cleanList = DOMPurify.sanitize(list)
        faveNav.innerHTML = cleanList;
      }
    }
  })
}

function addFaves() {
  let favDiv = document.getElementById("current-faves");
  let favName = document.getElementById("fav-name");
  let favURL = document.getElementById("fav-url");

  if (favName && favURL) {
    let addFav = document.createElement("div");
    addFav.classList = "shortcut";
    addFav.id = favURL.value;
    let favHTML = 'Name: <input type="text" class="favname" value="' + favName.value + '"> URL: <input type="text" class="favurl" value="https://' + favURL.value + '.dreamwith.org"> <div class="rmfav" id="rm-' + favURL.value + '"><i class="material-icons" tabindex="0">clear</i></div>';
    let cleanFaves = DOMPurify.sanitize(favHTML);
    addFav.innerHTML = cleanFaves;

    favDiv.appendChild(addFav);    
    
    let rmFave = favDiv.lastChild.lastElementChild.id;
    document.getElementById(rmFave).addEventListener('click', function() {        
      let fName = document.getElementById(favDiv.lastChild.id);
      favDiv.removeChild(fName);
      modifyFaves();
    })

    browser.storage.sync.get(['user_faves'], function (item) {
      console.log(document.getElementById("fav-name").value + document.getElementById("fav-url").value);
      
      let user_faves = item.user_faves;
        user_faves.push({
          name: favName.value,
          url: "https://" + favURL.value + ".dreamwidth.org",
      });
      browser.storage.sync.set({user_faves})
      favName.value = "";
      favURL.value = "";
    });
  } else {
    alert("Hey! Please fill in both Name and URL, come on now...");
  }

  browser.storage.sync.get().then(function (item) {
    console.log(item.user_faves);
  });
}

function modifyFaves() {
  let faveList = document.getElementsByClassName("shortcut");
  let user_faves = new Array();
  for (let i = 0; i < faveList.length; i++) {
    let faveName = faveList[i].children[0];
    let favURL = faveList[i].children[1];

    user_faves.push({
      name: faveName.value,
      url: favURL.value,
    })
  }
  browser.storage.sync.set({user_faves});
}

// function customCSS() {
//   let journalURL = document.getElementsByClassName("journal-url")[0].value;
//   let journalStyle = document.getElementsByClassName("journal-style")[0].value;

//   if (window.location.host == journalURL) {
//     let customTheme = document.createElement("style");
//     customTheme.id = "custom-style";
//     customTheme. innerHTML = journalStyle
//     document.body.appendChild(customTheme);
//   }
// }
