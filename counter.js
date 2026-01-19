fetch("https://api.countapi.xyz/hit/Xen0nkidd/XNCount")
  .then(r => r.json())
  .then(d => {
    document.getElementById("num").textContent = d.value;
  })
  .catch(() => {
    document.getElementById("num").textContent = "blocked";
  });
