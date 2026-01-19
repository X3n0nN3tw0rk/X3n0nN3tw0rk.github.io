fetch("https://api.countapi.xyz/hit/Xen0nkidd/XNCount")
  .then(r => r.json())
  .then(d => {
    document.getElementById("num").textContent = d.value;
  })
  setInterval(() => {
  fetch("https://api.countapi.xyz/get/Xen0nkidd/XNCount")
    .then(r => r.json())
    .then(d => {
      document.getElementById("num").textContent = d.value;
    });
}, 5000);

  .catch(() => {
    document.getElementById("num").textContent = "blocked";
  });
