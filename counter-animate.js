const el = document.getElementById("num");
const API = "https://api.countapi.xyz";
const NAMESPACE = "xen0nkidd-live";
const KEY = "opens";

let last = 0;

// +1 on every page open
fetch(`${API}/hit/${NAMESPACE}/${KEY}`)
  .then(r => r.json())
  .then(d => {
    last = d.value;
    el.textContent = d.value;
  });

// live updates
setInterval(() => {
  fetch(`${API}/get/${NAMESPACE}/${KEY}`)
    .then(r => r.json())
    .then(d => {
      if (d.value !== last) {
        el.textContent = d.value;
        last = d.value;
      }
    });
}, 3000);
