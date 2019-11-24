"use strict";

// Flat view stuff
function betterThreadView() {
  let getComments = document.getElementById("comments");

  if (getComments !== null) {
    let getMargin = document.getElementsByClassName("dwexpcomment");
    let x = 10; // the new magic number for margin left spacing, make this so the user can change it later :)

    for (var i = 1; i < getMargin.length; i++) {
      let m = parseInt(getMargin[i].style.marginLeft);
      let di = m / 25;
      let mg = di * x;

      getMargin[i].style.marginLeft = mg + "px";
    }
  };
}

// ~~!! COMMENT FORM CSS STUFF STARTS HERE ~~!!
function newForm() {
  let formID = document.getElementById("postform");
  // let dwRPbuttons = document.querySelectorAll(" button");

  if (formID !== null) {
    let getFrom = document.querySelectorAll(".talkform td")[0];
    let getSubject = document.querySelectorAll(".talkform td")[2];
    let getMsg = document.querySelectorAll(".talkform td")[4];
    let getFooter = document.querySelectorAll(".talkform td")[6];

    getFrom.style.display = "none";
    getSubject.style.display = "none";
    getMsg.style.display = "none";
    getFooter.style.display = "none";

    let cols = document.getElementById("commenttext");
    cols.removeAttribute("cols");

    let oldForm = document.querySelectorAll(".talkform td");
    let newF = document.createElement("div");
    newF.id = "new_reply";
    formID.appendChild(newF);

    for (var i = 0; i < oldForm.length; i++) {
      let createD = document.createElement("div");
      newF.appendChild(createD);
      createD.innerHTML = oldForm[i].innerHTML;
    }

    let newFormDivs = document.getElementById("new_reply");
    newFormDivs.removeChild(newFormDivs.children[6]);

    newFormDivs.children[1].id = "from_divs";
    newFormDivs.children[3].id = "subject_divs";
    newFormDivs.children[5].id = "msg_divs";
    newFormDivs.children[6].id = "footer_divs";

    let oldF = document.getElementsByClassName("talkform")[0];
    formID.removeChild(oldF);
  };
}

function injectForm() {
  let qrForm = document.getElementById("qrform");
  let iconSize = document.querySelector("#qrform .qr-icon");
  let oldQR = document.querySelector("#qrform .qr-icon-controls");
  let iconDD = document.getElementById("prop_picture_keyword");
  let qrMeta = document.querySelector("#qrform .qr-meta");
  let dwRPbuttons = document.querySelectorAll(".qr-body button");

  if (qrForm !== null) {
    console.log("Hi, I'm the inject form function, I'm about to run...");
    iconSize.style = "width: 100px; height: 100px;"
    qrMeta.insertBefore(iconDD, oldQR);
    // for (var i = 0; i < dwRPbuttons.length; i++) {
    //   qrMeta.appendChild(dwRPbuttons[i]);
    // }
    console.log("I ran okay!");
  };
}

// function injectNicer() {
//   let divID = document.createAttribute("id");
//   let qrDiv = document.getElementById("qrdiv");
//
//   if (qrForm !== null ) {
//     let tagDiv = document.createElement("div"); // make new div for new form
//     tagDiv.id = "tag-form"; // give new form an id
//     document.getElementById("qrdiv").appendChild(tagDiv); // append our new div into the form's parent div
//     let cloneQr = qrForm.cloneNode(true); // clone old form so we can do whatever to it
//     document.getElementById("tag-form").appendChild(cloneQr); // append newly cloned node and its kids to our new div
//     qrform.style = "display: none"; // hide the old form
//   }
// }

function formOff() {
  let qrForm = document.getElementById("qrformdiv");
  let iconSize = document.querySelector("#qrform .qr-icon");
  let oldQR = document.querySelector("#qrform .qr-icon-controls");
  let iconDD = document.getElementById("prop_picture_keyword");
  let qrMeta = document.querySelector("#qrform .qr-meta");
  let newQrDiv = document.createElement("div");
  let dwRPbuttons = document.querySelectorAll(".qr-body button");

  if (qrForm !== null) {
    console.log("This is TODO");
  }
}
// ~~!! COMMENT FORM CSS STUFF ENDS HERE ~~!!
