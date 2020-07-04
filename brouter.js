// ==UserScript==
// @name         Load Custom Brouter Profile
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://brouter.de/brouter-web/
// @grant        none
// ==/UserScript==

(async function() {
  'use strict';
  function getCodeMirror() {
      return new Promise(res => {
          const el = document.querySelector(".CodeMirror");
          if (el) {
              res(el.CodeMirror);
          } else {
              CodeMirror.defineInitHook(res);
          }
      });
  }

  function skipChanges(cm, count) {
      return new Promise(res => {
          let i = 0;
          cm.on("change", function changeCb(inst, co){
              i++;
              if (i >= count) {
                  cm.off("change", changeCb);
                  res();
              }
          });
      })
  }

  function applyProfile() {
      document.querySelector("#upload").click();
  }

  function fetchProfile() {
      return fetch("https://raw.githubusercontent.com/Zonarius/brouter/master/brouter.brf").then(r => r.text());
  }

  const prof$ = fetchProfile();
  const profileEditor = await getCodeMirror();
  // Waits until brouter makes its own changes before changing it ourselves
  await skipChanges(profileEditor, 1);
  profileEditor.setValue(await prof$);
  applyProfile();
  console.log("set profile!");
})();
