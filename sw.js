/* CIS Maths Practice Hub: offline support.
   Upload this file to the same folder as index.html and RENAME it from sw.js.txt to sw.js.
   It saves every page of the hub (all four languages) on the device the first time the hub is opened,
   so the pages keep working without internet. When the device is online, pages are refreshed from the
   website, so a new upload reaches children automatically. */

var CACHE = "cis-maths-v1";           // change the number only if you ever need to force a full re-download

var TOOLS = [
  "index.html", "column_method.html", "estimating_rounding.html", "fact_families.html", "factors.html",
  "labeling_number_lines.html", "missing_numbers.html", "multiples.html", "multiply_divide_10.html",
  "place_value_practice.html", "primes.html", "rounding_practice.html", "rounding_steps_demo.html",
  "squares.html", "triangular.html"
];
var FILES = ["./", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "place_value_words.html"];
TOOLS.forEach(function (t) { FILES.push(t); });
["sk", "ru", "uk"].forEach(function (lang) {
  FILES.push(lang + "/");
  TOOLS.forEach(function (t) { FILES.push(lang + "/" + t); });
});

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // add files one by one so that a file which is not uploaded (yet) cannot break the rest
      return Promise.all(FILES.map(function (f) {
        return cache.add(new Request(f, { cache: "reload" })).catch(function () {});
      })).then(function () {
        return cache.put(new URL("__ready", self.registration.scope).href, new Response("1"));
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k.indexOf("cis-maths-") === 0 && k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

/* Pages: ask the website first (so updates arrive); if it is slow or offline, use the saved copy. */
function pageRequest(req) {
  return caches.open(CACHE).then(function (cache) {
    var fetched = fetch(req).then(function (res) {
      if (res && res.status === 200) cache.put(req, res.clone());
      return res;
    });
    var wait = new Promise(function (resolve) { setTimeout(function () { resolve(null); }, 3000); });
    return Promise.race([fetched.catch(function () { return null; }), wait]).then(function (res) {
      if (res) return res;
      return cache.match(req, { ignoreSearch: true }).then(function (saved) {
        if (saved) return saved;
        return fetched.catch(function () {
          return req.mode === "navigate" ? cache.match(new URL("index.html", self.registration.scope).href) : Response.error();
        });
      });
    });
  });
}

/* Fonts and other files from elsewhere: use the saved copy if there is one, otherwise fetch and save it. */
function otherRequest(req) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(req).then(function (saved) {
      if (saved) return saved;
      return fetch(req).then(function (res) {
        if (res && (res.status === 200 || res.type === "opaque")) cache.put(req, res.clone());
        return res;
      });
    });
  });
}

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin === self.location.origin) {
    event.respondWith(pageRequest(req));
  } else if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(otherRequest(req));
  }
});
