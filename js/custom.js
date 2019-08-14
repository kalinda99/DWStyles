// all user customizations go here

function customCSS() {
  let journalURL = document.getElementsByClassName("journal-url")[0].value;
  let journalStyle = document.getElementsByClassName("journal-style")[0].value;

  let isURL = journalURL;
  if (window.location.host == journalURL) {
    let customTheme = document.createElement("style");
    customTheme.id = "custom-style";
    customTheme. innerHTML = journalStyle
    document.body.appendChild(customTheme);
  }
}
