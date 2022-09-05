/* JavaScript */

function txfr() {
  // window.alert("hello");
  const input = document.getElementById("textinput");
  const output = document.getElementById("showzone");
  output.innerHTML = input.value.replace(/\n\r?/g, "<br />");
}

// from function copy()
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
function copythis() {
  const copyText = document.querySelector("#textinput");
  copyText.select();
  document.execCommand("copy");
}

function clearthis() {
  const input = document.querySelector("#textinput");
  const output = document.querySelector("#showzone");
  input.value = "";
  output.innerHTML = "";
  //   console.log(pasteText.textContent);
}
