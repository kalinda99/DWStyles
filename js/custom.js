"use strict";
// all user customizations go here

// fetch faves from local storage
const getFaves = () => {
  chrome.storage.sync.get(['user_faves'], (item) => {
    // console.log("getFaves: Current user faves are:")
    // console.log(item.user_faves);
    let noFaves = document.getElementById("empty_faves");
    
    if (item.user_faves == null) {
      console.log("No user faves found");
      noFaves.style.display = "block";
    } else if (item.user_faves) {
      let favDiv = document.getElementById("current-faves");
      let hbFaveDiv = document.getElementById("fav-links");
      let desktopFaveDiv = document.getElementById("menu-faves");
      let controlStripFaves = document.getElementById("cs-faves");
      let faveNav = document.getElementById("fave_subnav");
      noFaves.style.display = "none"; 
      favDiv.innerHTML = "";

      let favesList = item.user_faves;
      // console.log("Faves are:\n", favesList);

      for (let i = 0; i < favesList.length; i++) {       
        let name = favesList[i].name;
        let url = favesList[i].url;

        let addFav = document.createElement("div");
        addFav.classList = "shortcut";
        addFav.id = url;
        addFav.innerHTML = '<span><a class="f_name" href="' + url + '" target="_blank">' + name + '</a></span><span class="b_opts"><i class="material-icons fave-options" tabindex="0">more_vert</i></span>';
        favDiv.appendChild(addFav);

        let contextMenu = document.getElementsByClassName("fave-options");
        let menuState = false;
        for (let i = 0; i < contextMenu.length; i++) {
          contextMenu[i].addEventListener('contextmenu', function(e) {
            e.preventDefault();
            document.getElementById("faves-context").classList.add("context-menu-visible");
            menuState = true;
          })
        }

        

        // let rmFave = document.getElementsByClassName("rmfav");
        // for (let i = 0; i < rmFave.length; i++) {
        //   rmFave[i].addEventListener('click', function() {
        //     let fName = this.parentNode.parentElement;
        //     favDiv.removeChild(fName);
        //     modifyFaves();
        //   })
        // }
      }
      if (hbFaveDiv) {
        let list = "";
        for (let i = 0; i < favesList.length; i++) {
          let name = favesList[i].name;
          let url = favesList[i].url;
          list += '<div><a id="' + url + '" href="' + url + '">' + name + '</a></div>';
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
          list += '<li class="subnav"><a href="' + url + '">' + name + '</a></li>';
        }

        let cleanList = DOMPurify.sanitize(list)
        faveNav.innerHTML = cleanList;
      }
    }
  })
}

let addFaves = () => {
  console.log("This addFaves function has begun...");
  
  let favDiv = document.getElementById("current-faves");
  let favName = document.getElementById("fav-name");
  let favURL = document.getElementById("fav-url");
  let noFaves = document.getElementById("empty_faves");
  // let isGlobal = document.getElementById("global-fave").checked;

  chrome.storage.sync.get(['user_faves'], (item) => {
    if (item.user_faves == null) {
      let user_faves = new Array;
      chrome.storage.sync.set({user_faves});
    }
  })

  if (favName.value && favURL.value) {
    let addFav = document.createElement("div");
    addFav.classList = "shortcut";
    addFav.id = favURL.value;
    let favHTML = '<span><a class="f_name" href="' + favURL.value + '" target="_blank">' + favName.value + '</a></span><span class="b_opts"><i class="material-icons rmfav" id="rm-' + favURL.value + '" tabindex="0">clear</i></span>';
    let cleanFaves = DOMPurify.sanitize(favHTML);
    addFav.innerHTML = cleanFaves;

    favDiv.appendChild(addFav);

    let lastFave = favDiv.lastChild.id;
    document.getElementById("rm-" + lastFave).addEventListener('click', function () {        
      let fName = favDiv.lastChild;
      favDiv.removeChild(fName);
      modifyFaves();
    })

    chrome.storage.sync.get(['user_faves'], (item) => {
      let user_faves = item.user_faves;
      user_faves.push({
        name: favName.value,
        url: favURL.value,
      });
      chrome.storage.sync.set({user_faves})
      favName = "";
      favURL = "";
      })
    } else {
      alert("Hey! Please fill in both Name and URL, come on now...");
  }
}

let modifyFaves = () => {
  let faveList = document.getElementsByClassName("shortcut");
  let user_faves = new Array();
  for (let i = 0; i < faveList.length; i++) {
    let nameURLDiv = faveList[i].children[0];
    let faveName = nameURLDiv.children[0].innerHTML;
    let favURL = nameURLDiv.children[0].href;
    
    user_faves.push({
      name: faveName,
      url: favURL,
    })
  }
  chrome.storage.sync.set({user_faves});
}

// let customCSS = () => {
//   let journalURL = document.getElementsByClassName("journal-url")[0].value;
//   let journalStyle = document.getElementsByClassName("journal-style")[0].value;

//   if (window.location.host == journalURL) {
//     let customTheme = document.createElement("style");
//     customTheme.id = "custom-style";
//     customTheme. innerHTML = journalStyle
//     document.body.appendChild(customTheme);
//   }
// }
