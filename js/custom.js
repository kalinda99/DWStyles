"use strict";
// all user customizations go here

// fetch faves from local storage
function getFaves() {    
  browser.storage.sync.get().then(function(item) {
    if (!item.user_faves) {
      console.log("No user faves found");
    } else if (item.user_faves) {   
      console.log("Current user is " + USER);
      
      let favDiv = document.getElementById("current-faves");
      let hbFaveDiv = document.getElementById("fav-links");
      let desktopFaveDiv = document.getElementById("menu-faves");
      let controlStripFaves = document.getElementById("cs-faves");
      let faveNav = document.getElementById("fave_subnav");
      favDiv.innerHTML = "";

      let globalList = item.user_faves.filter(function (g) {
        return g.user == false;
      })
      let userList = item.user_faves.filter(function (u) {
        return u.user == USER;
      })
      let favesList = globalList.concat(userList);
      console.log("Faves are:\n", favesList);

      for (let i = 0; i < favesList.length; i++) {       
        let name = favesList[i].name;
        let url = favesList[i].url;
        let user = favesList[i].user;

        let addFav = document.createElement("div");
        addFav.classList = "shortcut";
        addFav.id = url;
        addFav.innerHTML = 'Name: <input type="text" class="favname" value="' + name + '"> URL: <input type="text" class="favurl" value="' + url + '"> <label class="checkbox"><input type="checkbox" id="g-' + url + '" class="edit-global">G</label><div class="rmfav" id="rm-' + url + '"><i class="material-icons" tabindex="0">clear</i></div>';    
        favDiv.appendChild(addFav);
        
        // let globals = document.getElementsByClassName("edit-global");
        // if (user == null) {

        // }

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
  let isGlobal = document.getElementById("global-fave").checked;

  browser.storage.sync.get().then(function(item) {
    if (!item.user_faves) {
      user_faves = new Array;
      browser.storage.sync.set({user_faves});
    }
  })

  if (favName.value && favURL.value) {
    let addFav = document.createElement("div");
    addFav.classList = "shortcut";
    addFav.id = favURL.value;
    let favHTML = 'Name: <input type="text" class="favname" value="' + favName.value + '"> URL: <input type="text" class="favurl" value="https://' + favURL.value + '.dreamwith.org"> <label class="checkbox"><input type="checkbox" id="g-' + favURL.value + '" class="e-global">G</label><div class="rmfav" id="rm-' + favURL.value + '"><i class="material-icons" tabindex="0">clear</i></div>';
    let cleanFaves = DOMPurify.sanitize(favHTML);
    addFav.innerHTML = cleanFaves;        

    favDiv.appendChild(addFav);

    let globalID = favDiv.lastChild.lastElementChild.previousElementSibling.children[0].id;
    if (isGlobal == true) {
      document.getElementById(globalID).checked = true;
    }

    let rmFave = favDiv.lastChild.lastElementChild.id;
    document.getElementById(rmFave).addEventListener('click', function() {        
      let fName = document.getElementById(favDiv.lastChild.id);
      favDiv.removeChild(fName);
      modifyFaves();
    })

    document.getElementById(globalID).addEventListener('click', function() {    
      if (document.getElementById(globalID).checked = true) {
        modifyFaves();
      }
    })

    browser.storage.sync.get().then(function(item) {
      if (isGlobal == true) {
        let user_faves = item.user_faves;
        user_faves.push({
          name: favName.value,
          url: "https://" + favURL.value + ".dreamwidth.org",
          user: false,
        });
        browser.storage.sync.set({user_faves})
        favName.value = "";
        favURL.value = "";
      } else {
          let user_faves = item.user_faves;
          user_faves.push({
            name: favName.value,
            url: "https://" + favURL.value + ".dreamwidth.org",
            user: USER,
          });
          browser.storage.sync.set({user_faves})
          favName.value = "";
          favURL.value = "";
        }
    })
  } else {
    alert("Hey! Please fill in both Name and URL, come on now...");
  }
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
