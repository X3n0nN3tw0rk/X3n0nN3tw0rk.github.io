/* Deobfuscated / Readable version of the original bundle
   - Behavior: tries to load funding-choices / gstatic script(s)
   - If loading fails, builds and inserts a floating banner that asks user
     to disable ad/script blocking and reload.
   - This file intentionally mirrors the runtime flow of the original script.
*/

// ----------------------------- Utilities ---------------------------------

function isIterable(obj) {
  return obj != null && typeof obj[Symbol.iterator] === "function";
}

function safeAtob(s) {
  try { return atob(s); } catch(e) { return null; }
}

function parseJsonSafe(s) {
  try { return JSON.parse(s); } catch(e) { return null; }
}

// Unique id / classname generator used for injected elements
function uniqueId() {
  return Math.floor(Math.random() * 2147483648).toString(36)
       + Math.abs(Math.floor(Math.random() * 2147483648) ^ Date.now()).toString(36);
}

// clamp helper for rgb generation bounds used in original
function randInt(min, max) {
  return Math.floor(min + Math.random() * (max - min));
}

function randomRgb(a, b, c, d, e, f) {
  var r = randInt(Math.max(a, 0), Math.min(b, 255));
  var g = randInt(Math.max(c, 0), Math.min(d, 255));
  var bl = randInt(Math.max(e, 0), Math.min(f, 255));
  return "rgb(" + r + "," + g + "," + bl + ")";
}

// tiny safe createElement that accepts doc if provided
function createElement(tag, doc) {
  doc = doc || document;
  return doc.createElement(tag);
}

// copy nonce from any existing script with nonce attribute (original behavior)
function copyScriptNonceTo(el, doc) {
  doc = doc || (el.ownerDocument && el.ownerDocument.defaultView && el.ownerDocument.defaultView.document) || document;
  var maybe = doc.querySelector && doc.querySelector("script[nonce]");
  var nonce = maybe ? (maybe.nonce || maybe.getAttribute("nonce") || "") : "";
  if (nonce) el.setAttribute("nonce", nonce);
}

// --------------------------- Script loader --------------------------------
// Append a <script> with retries. Calls onSuccess on load, onFailure on final failure.
// removeOnSuccess controls whether the <script> is removed after load (original had option)
function appendScriptWithRetries(docWrapper, urlOrTrusted, retries, removeOnSuccess, onSuccess, onFailure) {
  try {
    var doc = docWrapper.g || document;
    var script = doc.createElement("script");
    script.async = true;
    // urlOrTrusted might be an object wrapper in original code; allow string or object with 'g'
    var src = (typeof urlOrTrusted === "string" ? urlOrTrusted : (urlOrTrusted && urlOrTrusted.g)) || urlOrTrusted;
    script.src = src;
    copyScriptNonceTo(script, doc);
    doc.head.appendChild(script);

    script.addEventListener("load", function() {
      try { onSuccess && onSuccess(); } finally {
        if (removeOnSuccess && script.parentNode) script.parentNode.removeChild(script);
      }
    });

    script.addEventListener("error", function() {
      if (retries > 0) {
        // try again
        appendScriptWithRetries(docWrapper, urlOrTrusted, retries - 1, removeOnSuccess, onSuccess, onFailure);
      } else {
        if (removeOnSuccess && script.parentNode) script.parentNode.removeChild(script);
        onFailure && onFailure();
      }
    });
  } catch (e) {
    // If something goes wrong building the script element, fail immediately
    onFailure && onFailure();
  }
}

// --------------------------- Floating Banner UI ----------------------------
// The original inserted a floating "warning" / Funding Choices banner with an icon,
// a bold title and a body message. Some spacing DIVs were added around elements.
// We'll recreate that behavior here.

function createSpacer(doc) {
  var div = createElement("div", doc);
  div.className = uniqueId();
  return div;
}

function createBannerElement(doc, imageUrl, titleText, bodyText) {
  // top-level container
  var container = createElement("div", doc);
  container.className = uniqueId();
  container.style.position = "fixed";
  container.style.bottom = "0";
  container.style.left = "0";
  // random-ish width like original (100% - 110%)
  container.style.width = Math.floor(100 + Math.random() * 10).toString() + "%";
  // big z-index similar to original
  container.style.zIndex = Math.floor(2147483544 + Math.random() * 100).toString();
  container.style.backgroundColor = randomRgb(249, 259, 242, 252, 219, 229);
  container.style.boxShadow = "0 0 12px #888";
  container.style.color = randomRgb(0, 10, 0, 10, 0, 10);
  container.style.display = "flex";
  container.style.justifyContent = "center";
  container.style.fontFamily = "Roboto, Arial";
  container.style.padding = "8px 0";

  // inner card / content area
  var card = createElement("div", doc);
  card.style.width = Math.floor(80 + Math.random() * 5).toString() + "%";
  card.style.maxWidth = Math.floor(750 + Math.random() * 25).toString() + "px";
  card.style.margin = "24px";
  card.style.display = "flex";
  card.style.alignItems = "flex-start";
  card.style.justifyContent = "center";

  // image
  var img = createElement("img", doc);
  img.className = uniqueId();
  img.src = imageUrl || "https://www.gstatic.com/images/icons/material/system/1x/warning_amber_24dp.png";
  img.alt = "Warning icon";
  img.style.height = "24px";
  img.style.width = "24px";
  img.style.paddingRight = "16px";

  // text wrapper
  var textWrap = createElement("div", doc);

  var title = createElement("div", doc);
  title.style.fontWeight = "bold";
  title.textContent = titleText || "You are seeing this message because ad or script blocking software is interfering with this page.";

  var body = createElement("div", doc);
  body.textContent = bodyText || "Disable any ad or script blocking software, then reload this page.";

  textWrap.appendChild(title);
  textWrap.appendChild(body);

  card.appendChild(img);
  card.appendChild(textWrap);
  container.appendChild(card);

  return container;
}

// Remove previously inserted nodes that we tracked
function removeElements(elements) {
  elements.forEach(function(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  });
}

// ----------------------------- Loader wrapper ------------------------------
// In original code, 'kb' was a tiny wrapper carrying the document;
// some functions call a.l.g where .g is the document.
function DocWrapper(documentObj) {
  this.g = documentObj || document;
}

// ------------------------------ Main Class --------------------------------
// Equivalent of the compiled 'Db' class: coordinates loading resources and UI.
function FundingChoicesRunner(windowObj, parsedConfig) {
  this.window = windowObj || window;
  this.config = parsedConfig || [];
  // original used config[1] as base string for some checks
  this.baseString = (this.config && this.config[1]) || "";
  // config[5] often held a fallback script/trusted resource url
  this.fallbackScript = (this.config && this.config[6]) || (this.config && this.config[5]) || "";
  this.startedRequest = false;
  this.docWrapper = new DocWrapper(this.window.document);
  this.insertedNodes = []; // track nodes we inserted (spacers etc.)
  this.bannerNode = null;
}

// build & insert banner UI (and some random spacers like the original)
FundingChoicesRunner.prototype._buildAndInsertBanner = function() {
  var doc = this.docWrapper.g;
  // insert random spacers then the banner, similar to the original which inserted multiple DIVs
  var spacerCount = Math.floor(1 + Math.random() * 5);
  for (var i = 0; i < spacerCount; i++) {
    var s = createSpacer(doc);
    this.insertedNodes.push(s);
    doc.body.appendChild(s);
  }

  // the main banner
  // decode known base64 constants that existed in the original:
  // - warning image URL constant (nb)
  // - bold message (ob)
  // - description (pb)
  // In the original these were base64-decoded constants; here we'll use readable messages.
  var imageUrl = "https://www.gstatic.com/images/icons/material/system/1x/warning_amber_24dp.png";
  var title = "You are seeing this message because ad or script blocking software is interfering with this page.";
  var body = "Disable any ad or script blocking software, then reload this page.";

  var banner = createBannerElement(doc, imageUrl, title, body);
  // create wrapper spacer and a content wrapper like the original
  var outerSpacerCount = Math.floor(1 + Math.random() * 5);
  for (i = 0; i < outerSpacerCount; i++) {
    var sp = createSpacer(doc);
    this.insertedNodes.push(sp);
    doc.body.appendChild(sp);
  }

  this.bannerNode = banner;
  doc.body.appendChild(banner);

  // add more trailing small spacers like original
  var trailing = Math.floor(1 + Math.random() * 5);
  for (i = 0; i < trailing; i++) {
    var t = createSpacer(doc);
    this.insertedNodes.push(t);
    doc.body.appendChild(t);
  }
};

// remove UI & spacers
FundingChoicesRunner.prototype._removeInsertedNodes = function() {
  removeElements(this.insertedNodes);
  this.insertedNodes = [];
  if (this.bannerNode && this.bannerNode.parentNode) {
    this.bannerNode.parentNode.removeChild(this.bannerNode);
    this.bannerNode = null;
  }
};

// attempt to call a configured endpoint via XHR (original used new XMLHttpRequest)
FundingChoicesRunner.prototype._callConfiguredEndpoint = function(url) {
  if (this.startedRequest) return;
  if (!url) return;
  this.startedRequest = true;
  try {
    var xhr = new this.window.XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
  } catch (e) {
    // swallow — the original code did not provide an elaborate fallback on this branch
  }
};

// main start flow:
// - try to load a particular script (this.fallbackScript) with retries
// - if load succeeds -> try to call an endpoint
// - if load fails -> show fallback UI (banner) and attempt alternate strategies
FundingChoicesRunner.prototype.start = function() {
  var self = this;

  // local success/failure handlers for loader
  function onSuccess() {
    // success branch: the original attempts to determine if a certain base string maps to
    // a global var that grants direct usage; simplified here: if the baseString exists, call endpoint 5
    var callUrl = (self.config && self.config[14]) || null;
    if (callUrl) {
      try {
        self._callConfiguredEndpoint(callUrl);
      } catch (e) {
        // ignore
      }
    }
  }

  function onFailure() {
    // fallback handler: show banner UI and attempt to load the fallback script with removeOnSuccess = true
    self._buildAndInsertBanner();

    // Attempt to load fallback with removal on success and no more retries after 3 attempts total (like original)
    appendScriptWithRetries(self.docWrapper, self.fallbackScript, 3, true,
      function() {
        // if fallback script loads, remove banner (original leaves some state)
        self._removeInsertedNodes();
      },
      function() {
        // final failure: do nothing additional; banner stays
      });
  }

  // If there was already a short-circuit condition (original's Fb check), they'd call a specific URL.
  // Here we simply attempt to append the primary script (if exists) then call onSuccess/onFailure.
  if (!this.docWrapper || !this.docWrapper.g) {
    // can't proceed without document
    return;
  }

  // If no script url present in config, directly show banner
  if (!this.fallbackScript) {
    onFailure();
    return;
  }

  // Try with retries first
  appendScriptWithRetries(this.docWrapper, this.fallbackScript, 3, false, onSuccess, onFailure);
};

// --------------------------- Config / bootstrap ---------------------------

// Helper to convert TrustedResourceUrl wrapper used in original into plain string (kept simple)
function TrustedResourceUrl(url) {
  this.g = url;
}
TrustedResourceUrl.prototype.toString = function() { return this.g; };

// Parse a base64-encoded JSON payload like the original. The original base64 was an array.
// This returns the parsed array or null on error.
function parseBase64Config(b64) {
  if (!b64) return null;
  var decoded = safeAtob(b64);
  if (!decoded) return null;
  var parsed = parseJsonSafe(decoded);
  return parsed;
}

// Register the global function name used in the original
(function registerGlobalInvoker() {
  var globalName = "__h82AlnkH6D91__";
  if (window[globalName] === undefined) {
    // create a one-time invoker that decodes config and runs the runner
    window[globalName] = function(b64Arg) {
      try {
        var parsed = parseBase64Config(b64Arg);
        if (!parsed) return;
        // The original code used a special class & deserialization for complex types;
        // here we simply pass parsed array directly.
        var runner = new FundingChoicesRunner(window, parsed);
        runner.start();
      } catch (e) {
        // original scheduled throwing the error asynchronously (na())
        setTimeout(function() { throw e; }, 0);
      }
      // Replace function with no-op after first usage in the original; replicate that:
      window[globalName] = function() {};
    };
  }
})();

// --------------------------- Invocation ----------------------------------
// The original script finally called window.__h82AlnkH6D91__(<base64 payload>).
// Below I include the same base64 string you had in the original so calling this file behaves the same.

var finalBase64 = "WyJwdWItNTUyMTIxOTA4NjA4ODgzNyIsW251bGwsbnVsbCxudWxsLCJodHRwczovL2Z1bmRpbmdjaG9pY2V"
  + "zbWVzc2FnZXMuZ29vZ2xlLmNvbS9iL3B1Yi01NTIxMjE5MDg2MDg4ODM3Il0sbnVsbCxudWxsLCJodHRwczov"
  + "L2Z1bmRpbmdjaG9pY2VjaGVzbWVzc2FnZXMuZ29vZ2xlLmNvbS9lbC9BR1NLV3hVVklJMjdES3VfcWw2SHNW"
  + "QVZkT1VndHZ0X3JacVVWUk9pMi1ZbUtHZ0R2c0lPbDBtMnJrbC1sc1dBSFY0dUFZN0NYQjA5OWxoS1VWMmRs"
  + "dGVqYURnazdnXHUwMDNkXHUwMDNkP3RlXHUwMDNkVE9LRU5fRVhQT1NFRCIsImh0dHBzOi8vZnVuZGluZ2No"
  + "b2ljZXNtZXNzYWdlcy5nb29nbGUuY29tL2VsL0FHU0tXeFVkSjcyR2F2enBqWlp0T1MyT3YteHpRRy01UXZT"
  + "bnBQaDhCdkVuRlRERFlMajFlT21XTVNiX0M5YjFjUDhWTFhpeVV4UW5KN0lYREVEVUxXb3pzczdlcFFcdTAw"
  + "M2RcdTAwM2Q/YWJcdTAwM2QxXHUwMDI2c2JmXHUwMDNkMSIsImh0dHBzOi8vZnVuZGluZ2Nob2ljZXNtZXNz"
  + "YWdlcy5nb29nbGUuY29tL2VsL0FHU0tXeFg4c0JQWkRfUHV2M3ZaLWtuWm1yeGpnMEE3R3hsRFcyYXZHSDgz"
  + "YlNvS0NEendicjNYVHJVMGF0Vm55UnRJdzZCNGxRWjdXQjd6ZDdoUjgtNVFIcTFpT1FcdTAwM2RcdTAwM2Q/"
  + "YWJcdTAwM2QyXHUwMDI2c2JmXHUwMDNkMSIsImh0dHBzOi8vZnVuZGluZ2Nob2ljZXNtZXNzYWdlcy5nb29n"
  + "bGUuY29tL2VsL0FHU0tXeFhLaDVLczZRcFlsdTZ4OHZvYlM5NzIxSkdZcnZCZGx1TzJYV0dDR3VfaUJCQnBp"
  + "dFR6LV9wckcxLXZqYi1SUVU3d2I4RXdJSmRnVDBxOUtmR2ZkNEN5akFcdTAwM2RcdTAwM2Q/c2JmXHUwMDNk"
  + "MiIsImRpdi1ncHQtYWQiLDIwLDEwMCwiY0hWaUxUVTFNakV5TVRrd09EWXdPRGc0TXpjXHUwMDNkIixbbnVs"
  + "bCxudWxsLG51bGwsImh0dHBzOi8vd3d3LmdzdGF0aWMuY29tLzBlbW4vZi9wL3B1Yi01NTIxMjE5MDg2MDg4"
  + "ODM3LmpzP3VzcXBcdTAwM2RDQUkiXSwiaHR0cHM6Ly9mdW5kaW5nY2hvaWNlc21lc3NhZ2VzLmdvb2dsZS5j"
  + "b20vZWwvQUdTS1d4WGdfNFREZWRKcVoySmFPREJITTlhY09Tb0k5UWxFaUpOR0cyNUFQRmpoY3dlTTFVYTIt"
  + "RWVsQno3a2wySjFnRzBtdldCcjlTUVowMDhfT1JnUHpCb052Z1x1MDAzZFx1MDAzZCJd";

if (typeof window !== "undefined" && window.__h82AlnkH6D91__) {
  // call the registered invoker with the payload (matches the original)
  try {
    window.__h82AlnkH6D91__(finalBase64);
  } catch (e) {
    // swallow; original wraps errors into setTimeout to throw them async
    setTimeout(function(){ throw e; }, 0);
  }
}
