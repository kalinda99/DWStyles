// Mmmm cookies... (here for reference, this feature porbaly won't be added, DW doesn't seem to like cookie mods)
// function setCookie() {
//   let getting = browser.cookies.get({
//     url: "*://*.dreamwidth.org/*",
//     name: "BMLschemepref"
//   });
//   getting.then( function() {
//     if (getting !== null) {
//       console.log("Theme cookie found, extending expiration time...")
//       // do this later
//     }
//     else {
//       console.log("No cookie found, adding new one...")
//       browser.cookies.set ({
//         url: "*://*.dreamwidth.org/*",
//         name: "BMLschemepref",
//         domain: ".dreamwidth.org",
//         value: "lynx",
//         path: "/"
//         // expirationDate: add later
//       });
//     };
//   });
//   browser.storage.local.set({cookie: true});
// }

// function delCookie() {
//   browser.cookies.remove({
//     url: "*://*.dreamwidth.org/*",
//     name: "BMLschemepref"
//   });
// }

function pageLoaded() {
  console.log("Hi! This is just a test to see if stuff works :)")

//   browser.runtime.onMessage.addListener(cookieSet);
//   function cookieSet() {
//     console.log("Message recieved! Adding Lynx cookie...")
//     setCookie();
//   }
//
//   browser.runtime.onMessage.addListener(killCookie);
//   function killCookie() {
//     console.log("Message recieved! Deleting Lynx cookie...")
//     delCookie();
//   }
// };

window.onload=function() { pageLoaded(); };
