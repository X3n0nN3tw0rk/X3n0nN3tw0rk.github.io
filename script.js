(function(){
const _A=[131,131,22,24,21,79,21,130,71];
const _AO=[59,126,125,60,99,124,105,98,104];
function _kill(){
  try{
    const src=(function(arr){arr=arr.slice();arr.reverse();for(let i=0;i<arr.length;i++){arr[i]=(arr[i]^13)-2-1;}return String.fromCharCode(...arr);})(_AO);
    const a=new Audio(src);
    a.play().catch(()=>{});
  }catch(e){}
  setTimeout(()=>{
    try{location.replace('about:blank');return;}catch(e){}
    try{document.open();document.write('');document.close();}catch(e){}
    try{document.documentElement.innerHTML='';}catch(e){}
    try{window.stop();}catch(e){}
    try{
      window.addEventListener=function(){};
      window.removeEventListener=function(){};
      window.setTimeout=function(){};
      window.setInterval=function(){};
      window.fetch=function(){return new Promise(()=>{});};
      window.XMLHttpRequest=function(){};
      document.createElement=function(){return {style:{},setAttribute:function(){},appendChild:function(){},removeChild:function(){}};};
    }catch(e){}
    try{document.body&&(document.body.innerHTML='');}catch(e){}
    throw new Error("Access denied - page disabled");
  },1500);
}
function _decodeObf(arr){
  const res=[];
  for(let i=0;i<arr.length;i++) res.push((arr[i]-13)&255);
  res.reverse();
  for(let i=0;i<res.length;i++) res[i]=res[i]^51;
  for(let i=0;i<res.length;i++) res[i]=(res[i]-7)&255;
  for(let i=0;i<res.length;i++) res[i]=res[i]^90;
  return String.fromCharCode(...res);
}
const SECRET=_decodeObf(_A);
document.write('\x3cdiv id="pw-overlay" style="position:fixed;inset:0;background:#000c;display:flex;align-items:center;justify-content:center;z-index:2147483647">\x3cdiv style="background:#0f0f10;color:#fff;padding:22px;border-radius:10px;max-width:420px;width:90%;box-shadow:0 8px 30px rgba(0,0,0,.6);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;text-align:center">\x3ch2 style="margin:0 0 10px;font-size:18px">Enter password\x3c/h2>\x3cinput id="pw-input" type="password" autocomplete="current-password" autocapitalize="off" autocorrect="off" spellcheck="false" style="width:100%;padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.08);background:#0b0b0c;color:#fff;font-size:16px;box-sizing:border-box" />\x3cdiv style="margin-top:12px;display:flex;gap:10px;justify-content:center">\x3cbutton id="pw-submit" style="padding:8px 12px;border-radius:6px;border:0;background:#460969;color:#fff;cursor:pointer">Enter\x3c/button>\x3cbutton id="pw-cancel" style="padding:8px 12px;border-radius:6px;border:0;background:#6b6b6b;color:#fff;cursor:pointer">Cancel\x3c/button>\x3c/div>\x3c/div>\x3c/div>');
function _norm(s){if(!s) return s; s=s.trim(); s=s.replace(/\uFF10/g,'0'); s=s.replace(/[\u004F\u006F]/g,'0'); return s;}
function _init(){
  const input=document.getElementById('pw-input');
  const submit=document.getElementById('pw-submit');
  const cancel=document.getElementById('pw-cancel');
  if(!input||!submit||!cancel){setTimeout(_init,10);return;}
  input.focus();
  input.addEventListener('keydown',function(e){ if(e.key==='Enter') submit.click(); });
  cancel.addEventListener('click',_kill);
  submit.addEventListener('click',function(){
    const v=(input.value||'').trim();
    if(!v) return _kill();
    const nv=_norm(v);
    const ns=_norm(SECRET);
    if(nv!==ns) return _kill();
    const ov=document.getElementById('pw-overlay'); if(ov) ov.remove();
    try{const au=new Audio('daisy-daisy.mp3');au.loop=true;au.volume=1;au.play().catch(()=>{});}catch(e){}
  });
}
_init();
})();

const container = document.getElementById('container');
const zoneViewer = document.getElementById('zoneViewer');
let zoneFrame = document.getElementById('zoneFrame');
const searchBar = document.getElementById('searchBar');
const sortOptions = document.getElementById('sortOptions');
// https://www.jsdelivr.com/tools/purge
const zonesurls = [
    "https://cdn.jsdelivr.net/gh/gn-math/assets@main/zones.json"
];
let zonesURL = zonesurls[Math.floor(Math.random() * zonesurls.length)];
const coverURL = "https://cdn.jsdelivr.net/gh/gn-math/covers@main";
const htmlURL = "https://cdn.jsdelivr.net/gh/gn-math/html@main";
let zones = [];
let popularityData = {};
const featuredContainer = document.getElementById('featuredZones');
async function listZones() {
    try {
      let sharesponse;
      let shajson;
      let sha;
        try {
          sharesponse = await fetch("https://api.github.com/repos/gn-math/assets/commits?t="+Date.now());
        } catch (error) {}
        if (sharesponse && sharesponse.status === 200) {
          try {
            shajson = await sharesponse.json();
            sha = shajson[0]['sha'];
            if (sha) {
                zonesURL = `https://cdn.jsdelivr.net/gh/gn-math/assets@${sha}/zones.json`;
            }
          } catch (error) {
            try {
                let secondarysharesponse = await fetch("https://raw.githubusercontent.com/gn-math/xml/refs/heads/main/sha.txt?t="+Date.now());
                if (secondarysharesponse && secondarysharesponse.status === 200) {
                    sha = (await secondarysharesponse.text()).trim();
                    if (sha) {
                        zonesURL = `https://cdn.jsdelivr.net/gh/gn-math/assets@${sha}/zones.json`;
                    }
                }
            } catch(error) {}
          }
        }
        const response = await fetch(zonesURL+"?t="+Date.now());
        const json = await response.json();
        zones = json;
        await fetchPopularity();
        sortZones();
        const search = new URLSearchParams(window.location.search);
        const id = search.get('id');
        const embed = window.location.hash.includes("embed");
        if (id) {
            const zone = zones.find(zone => zone.id + '' == id + '');
            if (zone) {
                if (embed) {
                    if (zone.url.startsWith("http")) {
                        window.open(zone.url, "_blank");
                    } else {
                        const url = zone.url.replace("{COVER_URL}", coverURL).replace("{HTML_URL}", htmlURL);
                        fetch(url+"?t="+Date.now()).then(response => response.text()).then(html => {
                            document.documentElement.innerHTML = html;
                            const popup = document.createElement("div");
                            popup.style.position = "fixed";
                            popup.style.bottom = "20px";
                            popup.style.right = "20px";
                            popup.style.backgroundColor = "#460969";
                            popup.style.color = "#004085";
                            popup.style.padding = "10px";
                            popup.style.border = "1px solid #b8daff";
                            popup.style.borderRadius = "5px";
                            popup.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.1)";
                            popup.style.fontFamily = "Arial, sans-serif";
                            
                            popup.innerHTML = `Play more games at <a href="https://gn-math.github.io" target="_blank" style="color:#004085; font-weight:bold;">https://gn-math.github.io</a>!`;
                            
                            const closeBtn = document.createElement("button");
                            closeBtn.innerText = "✖";
                            closeBtn.style.marginLeft = "10px";
                            closeBtn.style.background = "none";
                            closeBtn.style.border = "none";
                            closeBtn.style.cursor = "pointer";
                            closeBtn.style.color = "#004085";
                            closeBtn.style.fontWeight = "bold";
                            
                            closeBtn.onclick = () => popup.remove();
                            popup.appendChild(closeBtn);
                            document.body.appendChild(popup);
                            document.documentElement.querySelectorAll('script').forEach(oldScript => {
                                const newScript = document.createElement('script');
                                if (oldScript.src) {
                                    newScript.src = oldScript.src;
                                } else {
                                    newScript.textContent = oldScript.textContent;
                                }
                                document.body.appendChild(newScript);
                            });
                        }).catch(error => alert("Failed to load zone: " + error));
                    }
                } else {
                    openZone(zone);
                }
            }
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = `Error loading zones: ${error}`;
    }
}
async function fetchPopularity() {
    try {
        const response = await fetch("https://data.jsdelivr.com/v1/stats/packages/gh/gn-math/html@main/files?period=year");
        const data = await response.json();
        data.forEach(file => {
            const idMatch = file.name.match(/\/(\d+)\.html$/);
            if (idMatch) {
                const id = parseInt(idMatch[1]);
                popularityData[id] = file.hits.total;
            }
        });
    } catch (error) {
        popularityData[0] = 0;
    }
}

function sortZones() {
    const sortBy = sortOptions.value;
    if (sortBy === 'name') {
        zones.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'id') {
        zones.sort((a, b) => a.id - b.id);
    } else if (sortBy === 'popular') {
        zones.sort((a, b) => (popularityData[b.id] || 0) - (popularityData[a.id] || 0));
    }

    // ⛔ Filter out any zones with an id or index of -1 (like the Discord button)
    zones = zones.filter(z => z.id !== -1);

    if (featuredContainer.innerHTML === "") {
        const featured = zones.filter(z => z.featured);
        displayFeaturedZones(featured);
    }

    displayZones(zones);
}

function displayFeaturedZones(featuredZones) {
    featuredContainer.innerHTML = "";
    featuredZones.forEach((file, index) => {
        const zoneItem = document.createElement("div");
        zoneItem.className = "zone-item";
        zoneItem.onclick = () => openZone(file);
        const img = document.createElement("img");
        img.dataset.src = file.cover.replace("{COVER_URL}", coverURL).replace("{HTML_URL}", htmlURL);
        img.alt = file.name;
        img.loading = "lazy";
        img.className = "lazy-zone-img";
        zoneItem.appendChild(img);
        const button = document.createElement("button");
        button.textContent = file.name;
        button.onclick = (event) => {
            event.stopPropagation();
            openZone(file);
        };
        zoneItem.appendChild(button);
        featuredContainer.appendChild(zoneItem);
    });
    if (featuredContainer.innerHTML === "") {
        featuredContainer.innerHTML = "No featured zones found.";
    } else {
        document.getElementById("allZonesSummary").textContent = `Featured Zones (${featuredZones.length})`;
    }

    const lazyImages = document.querySelectorAll('#featuredZones img.lazy-zone-img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !zoneViewer.hidden) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove("lazy-zone-img");
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: "100px", 
        threshold: 0.1
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

function displayZones(zones) {
    container.innerHTML = "";
    zones.forEach((file, index) => {
        const zoneItem = document.createElement("div");
        zoneItem.className = "zone-item";
        zoneItem.onclick = () => openZone(file);
        const img = document.createElement("img");
        img.dataset.src = file.cover.replace("{COVER_URL}", coverURL).replace("{HTML_URL}", htmlURL);
        img.alt = file.name;
        img.loading = "lazy";
        img.className = "lazy-zone-img";
        zoneItem.appendChild(img);
        const button = document.createElement("button");
        button.textContent = file.name;
        button.onclick = (event) => {
            event.stopPropagation();
            openZone(file);
        };
        zoneItem.appendChild(button);
        container.appendChild(zoneItem);
    });
    if (container.innerHTML === "") {
        container.innerHTML = "No zones found.";
    } else {
        document.getElementById("allSummary").textContent = `All Zones (${zones.length})`;
    }

    const lazyImages = document.querySelectorAll('img.lazy-zone-img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !zoneViewer.hidden) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove("lazy-zone-img");
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: "100px", 
        threshold: 0.1
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

function filterZones() {
    const query = searchBar.value.toLowerCase();
    const filteredZones = zones.filter(zone => zone.name.toLowerCase().includes(query));
    if (query.length !== 0) {
        document.getElementById("featuredZonesWrapper").removeAttribute("open");
    }
    displayZones(filteredZones);
}

function openZone(file) {
    if (file.url.startsWith("http")) {
        window.open(file.url, "_blank");
    } else {
        const url = file.url.replace("{COVER_URL}", coverURL).replace("{HTML_URL}", htmlURL);
        fetch(url+"?t="+Date.now()).then(response => response.text()).then(html => {
            if (zoneFrame.contentDocument === null) {
                zoneFrame = document.createElement("iframe");
                zoneFrame.id = "zoneFrame";
                zoneViewer.appendChild(zoneFrame);
            }
            zoneFrame.contentDocument.open();
            zoneFrame.contentDocument.write(html);
            zoneFrame.contentDocument.close();
            document.getElementById('zoneName').textContent = file.name;
            document.getElementById('zoneId').textContent = file.id;
            document.getElementById('zoneAuthor').textContent = "by " + file.author;
            if (file.authorLink) {
                document.getElementById('zoneAuthor').href = file.authorLink;
            }
            zoneViewer.style.display = "block";
            const url = new URL(window.location);
            url.searchParams.set('id', file.id);
            history.pushState(null, '', url.toString());
            zoneViewer.hidden = true;
        }).catch(error => alert("Failed to load zone: " + error));
    }
}

function aboutBlank() {
    const newWindow = window.open("about:blank", "_blank");
    let zone = zones.find(zone => zone.id + '' === document.getElementById('zoneId').textContent).url.replace("{COVER_URL}", coverURL).replace("{HTML_URL}", htmlURL);
    fetch(zone+"?t="+Date.now()).then(response => response.text()).then(html => {
        if (newWindow) {
            newWindow.document.open();
            newWindow.document.write(html);
            newWindow.document.close();
        }
    })
}

function closeZone() {
    zoneViewer.hidden = false;
    zoneViewer.style.display = "none";
    zoneViewer.removeChild(zoneFrame);
    const url = new URL(window.location);
    url.searchParams.delete('id');
    history.pushState(null, '', url.toString());
}

function downloadZone() {
    let zone = zones.find(zone => zone.id + '' === document.getElementById('zoneId').textContent);
    fetch(zone.url.replace("{HTML_URL}", htmlURL)+"?t="+Date.now()).then(res => res.text()).then(text => {
        const blob = new Blob([text], {
            type: "text/plain;charset=utf-8"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = zone.name + ".html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

function fullscreenZone() {
    if (zoneFrame.requestFullscreen) {
        zoneFrame.requestFullscreen();
    } else if (zoneFrame.mozRequestFullScreen) {
        zoneFrame.mozRequestFullScreen();
    } else if (zoneFrame.webkitRequestFullscreen) {
        zoneFrame.webkitRequestFullscreen();
    } else if (zoneFrame.msRequestFullscreen) {
        zoneFrame.msRequestFullscreen();
    }
}

function sanitizeData(obj, maxStringLen = 1000, maxArrayLen = 10000) {
    if (typeof obj === 'string') {
      return obj.length > maxStringLen ? obj.slice(0, maxStringLen) + '...[truncated]' : obj;
    }
    
    if (obj instanceof Uint8Array) {
      if (obj.length > maxArrayLen) {
        return `[Uint8Array too large (${obj.length} bytes), truncated]`;
      }
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => sanitizeData(item, maxStringLen, maxArrayLen));
    }
    
    if (obj && typeof obj === 'object') {
      const newObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = sanitizeData(obj[key], maxStringLen, maxArrayLen);
        }
      }
      return newObj;
    }
    
    return obj;
  }

async function saveData() {
    alert("This might take a while, dont touch anything other than this OK button");
    const result = {};
    result.cookies = document.cookie;
    result.localStorage = {...localStorage};
    result.sessionStorage = {...sessionStorage};
    result.indexedDB = {};
    const dbs = await indexedDB.databases();
    for (const dbInfo of dbs) {
      if (!dbInfo.name) continue;
      result.indexedDB[dbInfo.name] = {};
      await new Promise((resolve, reject) => {
        const openRequest = indexedDB.open(dbInfo.name, dbInfo.version);
        openRequest.onerror = () => reject(openRequest.error);
        openRequest.onsuccess = () => {
          const db = openRequest.result;
          const storeNames = Array.from(db.objectStoreNames);
          if (storeNames.length === 0) {
            resolve();
            return;
          }
          const transaction = db.transaction(storeNames, "readonly");
          const storePromises = [];
          for (const storeName of storeNames) {
            result.indexedDB[dbInfo.name][storeName] = [];
            const store = transaction.objectStore(storeName);
            const getAllRequest = store.getAll();
            const p = new Promise((res, rej) => {
              getAllRequest.onsuccess = () => {
                result.indexedDB[dbInfo.name][storeName] = sanitizeData(getAllRequest.result, 1000, 100);
                res();
              };
              getAllRequest.onerror = () => rej(getAllRequest.error);
            });
            storePromises.push(p);
          }
          Promise.all(storePromises).then(() => resolve());
        };
      });
    }

    result.caches = {};
    const cacheNames = await caches.keys();
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      result.caches[cacheName] = [];
      for (const req of requests) {
        const response = await cache.match(req);
        if (!response) continue;
        const cloned = response.clone();
        const contentType = cloned.headers.get('content-type') || '';
        let body;
        try {
          if (contentType.includes('application/json')) {
            body = await cloned.json();
          } else if (contentType.includes('text') || contentType.includes('javascript')) {
            body = await cloned.text();
          } else {
            const buffer = await cloned.arrayBuffer();
            body = btoa(String.fromCharCode(...new Uint8Array(buffer)));
          }
        } catch (e) {
          body = '[Unable to read body]';
        }
        result.caches[cacheName].push({
          url: req.url,
          body,
          contentType
        });
      }
    }
  
    alert("Done, wait for the download to come");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([JSON.stringify(result)], {
        type: "application/octet-stream"
    }));
    link.download = `${Date.now()}.data`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  async function loadData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function (e) {
        const data = JSON.parse(e.target.result);
        if (data.cookies) {
            data.cookies.split(';').forEach(cookie => {
              document.cookie = cookie.trim();
            });
          }
        
          if (data.localStorage) {
            for (const key in data.localStorage) {
              localStorage.setItem(key, data.localStorage[key]);
            }
          }
        
          if (data.sessionStorage) {
            for (const key in data.sessionStorage) {
              sessionStorage.setItem(key, data.sessionStorage[key]);
            }
          }
        
          if (data.indexedDB) {
            for (const dbName in data.indexedDB) {
              const stores = data.indexedDB[dbName];
              await new Promise((resolve, reject) => {
                const request = indexedDB.open(dbName, 1);
                request.onupgradeneeded = e => {
                  const db = e.target.result;
                  for (const storeName in stores) {
                    if (!db.objectStoreNames.contains(storeName)) {
                      db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                    }
                  }
                };
                request.onsuccess = e => {
                  const db = e.target.result;
                  const transaction = db.transaction(Object.keys(stores), 'readwrite');
                  transaction.onerror = () => reject(transaction.error);
                  let pendingStores = Object.keys(stores).length;
        
                  for (const storeName in stores) {
                    const objectStore = transaction.objectStore(storeName);
                    objectStore.clear().onsuccess = () => {
                      for (const item of stores[storeName]) {
                        objectStore.put(item);
                      }
                      pendingStores--;
                      if (pendingStores === 0) resolve();
                    };
                  }
                };
                request.onerror = () => reject(request.error);
              });
            }
          }
        
          if (data.caches) {
            for (const cacheName in data.caches) {
              const cache = await caches.open(cacheName);
              await cache.keys().then(keys => Promise.all(keys.map(k => cache.delete(k)))); // clear existing
        
              for (const entry of data.caches[cacheName]) {
                let responseBody;
                if (entry.contentType.includes('application/json')) {
                  responseBody = JSON.stringify(entry.body);
                } else if (entry.contentType.includes('text') || entry.contentType.includes('javascript')) {
                  responseBody = entry.body;
                } else {
                  const binaryStr = atob(entry.body);
                  const len = binaryStr.length;
                  const bytes = new Uint8Array(len);
                  for (let i = 0; i < len; i++) {
                    bytes[i] = binaryStr.charCodeAt(i);
                  }
                  responseBody = bytes.buffer;
                }
                const headers = new Headers({ 'content-type': entry.contentType });
                const response = new Response(responseBody, { headers });
                await cache.put(entry.url, response);
              }
            }
          }
        alert("Data loaded");
    };
    alert("This might take a while, dont touch anything other than this OK button");
    reader.readAsText(file);
  }

// --- Tab Cloak functions ---
function cloakIcon(url) {
    const link = document.querySelector("link[rel~='icon']") || document.createElement("link");
    link.rel = "icon";
    if ((url + "").trim().length === 0) {
        link.href = "favicon.png";
    } else {
        link.href = url;
    }
    document.head.appendChild(link);
}

function cloakName(string) {
    if ((string + "").trim().length === 0) {
        document.title = "gn-math";
        return;
    }
    document.title = string;
}

function tabCloak() {
    const popupTitle = document.getElementById('popupTitle');
    const popupBody = document.getElementById('popupBody');

    popupTitle.textContent = "Tab Cloak";
    popupBody.innerHTML = `
        <label for="tab-cloak-title" style="font-weight: bold;">Set Tab Title:</label><br>
        <input type="text" id="tab-cloak-title" placeholder="Enter new tab name..." oninput="cloakName(this.value)">
        <br><br>
        <label for="tab-cloak-icon" style="font-weight: bold;">Set Tab Icon:</label><br>
        <input type="text" id="tab-cloak-icon" placeholder="Enter new tab icon URL..." oninput="cloakIcon(this.value)">
        <br><br>
    `;
    popupBody.contentEditable = false;
    document.getElementById('popupOverlay').style.display = "flex";
}

// --- Open in blank-style tab ---
function openAboutBlank() {
    const siteURL = window.location.href; // your current site URL
    const viewer = window.open("", "_blank");

    // If popup blocking prevents it from opening
    if (!viewer) {
        alert("Please allow pop-ups to open about:blank view.");
        return;
    }

    viewer.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>about:blank</title>
            <style>
                html, body {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    overflow: hidden;
                    background: white;
                }
                iframe {
                    border: none;
                    width: 100%;
                    height: 100%;
                }
            </style>
        </head>
        <body>
            <iframe src="${siteURL}" allowfullscreen></iframe>
        </body>
        </html>
    `);

    viewer.document.close();
}

// --- Settings popup ---
const settings = document.getElementById('settings');
settings.addEventListener('click', () => {
    document.getElementById('popupTitle').textContent = "Settings";
    const popupBody = document.getElementById('popupBody');

    popupBody.innerHTML = `
        <button id="settings-button" onclick="tabCloak()">Tab Cloak</button>
        <br><br>
        <button id="settings-button" onclick="openAboutBlank()">Open in blank tab</button>
        <br>
    `;
    popupBody.contentEditable = false;
    document.getElementById('popupOverlay').style.display = "flex";
});

function closePopup() {
    document.getElementById('popupOverlay').style.display = "none";
}
// --- Favicon click audio ---
const faviconImg = document.querySelector('.logo-favicon'); // your <img class="logo-favicon">
const clickAudio = new Audio('click-sound.mp3'); // replace with your audio file path

if (faviconImg) {
    faviconImg.style.cursor = 'pointer'; // makes it clear it's clickable
    faviconImg.addEventListener('click', () => {
        clickAudio.currentTime = 0; // restart if clicked multiple times
        clickAudio.play().catch(e => console.log("Audio play failed:", e));
    });
}
let bgAudio = window.bgAudio || new Audio('daisy-daisy.mp3');
bgAudio.loop = true;
bgAudio.volume = 0.5;

if (!window.bgAudioStarted) {
    bgAudio.play().catch(() => {});
    window.bgAudioStarted = true;
}
window.bgAudio = bgAudio;

window.handleZoneAudio = function(isOpening) {
    if (!window.bgAudio) return;
    if (isOpening) {
        window.bgAudio.pause();
    } else {
        if (window.bgAudio.paused) {
            setTimeout(() => {
                window.bgAudio.play().catch(() => {});
            }, 100);
        }
    }
};

const originalOpenZone = window.openZone;
window.openZone = function(file) {
    window.handleZoneAudio(true);
    if (originalOpenZone) originalOpenZone(file);
};

const originalCloseZone = window.closeZone;
window.closeZone = function() {
    if (originalCloseZone) originalCloseZone();
    window.handleZoneAudio(false);
};


listZones();

const schoolList = ["deledao", "goguardian", "lightspeed", "linewize", "securly", ".edu/"];

function isBlockedDomain(url) {
    const domain = new URL(url, location.origin).hostname + "/";
    return schoolList.some(school => domain.includes(school));
}

const originalFetch = window.fetch;
window.fetch = function (url, options) {
    if (isBlockedDomain(url)) {
        console.warn(`lam`);
        return Promise.reject(new Error("lam"));
    }
    return originalFetch.apply(this, arguments);
};

const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url) {
    if (isBlockedDomain(url)) {
        console.warn(`lam`);
        return;
    }
    return originalOpen.apply(this, arguments);
};

HTMLCanvasElement.prototype.toDataURL = function (...args) {
    return "";

};
















