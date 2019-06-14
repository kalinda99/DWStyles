// In this house we're very lazy
function docElID(id) {
  return document.getElementById(id);
}
function docElTag(tag) {
  return document.getElementsByTagName(tag);
}
function docElCl(cl) {
  return document.getElementsByClassName(cl);
}
function docQs(qs) {
  return document.querySelector(qs);
}

function pageLoaded() {
  console.log("Hi! This is just a test to see if stuff works :)")
  
};

window.onload=function() { pageLoaded(); };
