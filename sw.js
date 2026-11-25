/* CIS Maths Practice Hub: offline support.
   Upload this file to the same folder as index.html and RENAME it from sw.js.txt to sw.js.
   It saves every page of the hub (all four languages) on the device the first time the hub is opened,
   so the pages keep working without internet. When the device is online, pages are refreshed from the
   website, so a new upload reaches children automatically. */

var CACHE = "cis-maths-v16";           // change the number only if you ever need to force a full re-download

var TOOLS = [
  "index.html", "column_method.html", "estimating_rounding.html", "fact_families.html", "factors.html",
  "labeling_number_lines.html", "missing_numbers.html", "multiples.html", "multiply_divide_10.html", "multiples_of_10.html", "doubling_halving.html", "fractions_slices.html", "fractions_equivalent.html", "fractions_find_equivalent.html", "fractions_wall.html", "fractions_mixed_improper.html", "fractions_add_subtract_same.html", "fractions_add_subtract_diff.html", "fractions_compare_order.html", "fractions_ratio_method.html",
  "place_value_practice.html", "primes.html", "rounding_practice.html", "rounding_steps_demo.html",
  "squares.html", "triangular.html"
];
var FILES = ["./", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "place_value_words.html"];
TOOLS.forEach(function (t) { FILES.push(t); });
var HUB_ASSETS = ["hub/fonts/fredoka-latin-ext.woff2","hub/fonts/fredoka-latin.woff2","hub/fonts/nunito-cyrillic-ext.woff2","hub/fonts/nunito-cyrillic.woff2","hub/logo-white.png","hub/mascot-white.svg","hub/thumbs/column-method.jpg","hub/thumbs/doublehalf.jpg","hub/thumbs/estimating-rounding.jpg","hub/thumbs/fact-families.jpg","hub/thumbs/factors.jpg","hub/thumbs/fractionadddiff.jpg","hub/thumbs/fractionaddsame.jpg","hub/thumbs/fractioncompare.jpg","hub/thumbs/fractionequiv.jpg","hub/thumbs/fractionfind.jpg","hub/thumbs/fractionmixed.jpg","hub/thumbs/fractionratio.jpg","hub/thumbs/fractionslices.jpg","hub/thumbs/fractionwall.jpg","hub/thumbs/missing-numbers.jpg","hub/thumbs/muldiv10.jpg","hub/thumbs/muldivx10.jpg","hub/thumbs/multiples.jpg","hub/thumbs/number-line.jpg","hub/thumbs/number-words.jpg","hub/thumbs/place-value.jpg","hub/thumbs/primes.jpg","hub/thumbs/rounding-steps.jpg","hub/thumbs/rounding.jpg","hub/thumbs/ru/column-method.jpg","hub/thumbs/ru/doublehalf.jpg","hub/thumbs/ru/estimating-rounding.jpg","hub/thumbs/ru/fact-families.jpg","hub/thumbs/ru/factors.jpg","hub/thumbs/ru/fractionadddiff.jpg","hub/thumbs/ru/fractionaddsame.jpg","hub/thumbs/ru/fractioncompare.jpg","hub/thumbs/ru/fractionequiv.jpg","hub/thumbs/ru/fractionfind.jpg","hub/thumbs/ru/fractionmixed.jpg","hub/thumbs/ru/fractionratio.jpg","hub/thumbs/ru/fractionslices.jpg","hub/thumbs/ru/fractionwall.jpg","hub/thumbs/ru/missing-numbers.jpg","hub/thumbs/ru/muldiv10.jpg","hub/thumbs/ru/muldivx10.jpg","hub/thumbs/ru/multiples.jpg","hub/thumbs/ru/number-line.jpg","hub/thumbs/ru/number-words.jpg","hub/thumbs/ru/place-value.jpg","hub/thumbs/ru/primes.jpg","hub/thumbs/ru/rounding-steps.jpg","hub/thumbs/ru/rounding.jpg","hub/thumbs/ru/squares.jpg","hub/thumbs/ru/triangular.jpg","hub/thumbs/sk/column-method.jpg","hub/thumbs/sk/doublehalf.jpg","hub/thumbs/sk/estimating-rounding.jpg","hub/thumbs/sk/fact-families.jpg","hub/thumbs/sk/factors.jpg","hub/thumbs/sk/fractionadddiff.jpg","hub/thumbs/sk/fractionaddsame.jpg","hub/thumbs/sk/fractioncompare.jpg","hub/thumbs/sk/fractionequiv.jpg","hub/thumbs/sk/fractionfind.jpg","hub/thumbs/sk/fractionmixed.jpg","hub/thumbs/sk/fractionratio.jpg","hub/thumbs/sk/fractionslices.jpg","hub/thumbs/sk/fractionwall.jpg","hub/thumbs/sk/missing-numbers.jpg","hub/thumbs/sk/muldiv10.jpg","hub/thumbs/sk/muldivx10.jpg","hub/thumbs/sk/multiples.jpg","hub/thumbs/sk/number-line.jpg","hub/thumbs/sk/number-words.jpg","hub/thumbs/sk/place-value.jpg","hub/thumbs/sk/primes.jpg","hub/thumbs/sk/rounding-steps.jpg","hub/thumbs/sk/rounding.jpg","hub/thumbs/sk/squares.jpg","hub/thumbs/sk/triangular.jpg","hub/thumbs/squares.jpg","hub/thumbs/triangular.jpg","hub/thumbs/uk/column-method.jpg","hub/thumbs/uk/doublehalf.jpg","hub/thumbs/uk/estimating-rounding.jpg","hub/thumbs/uk/fact-families.jpg","hub/thumbs/uk/factors.jpg","hub/thumbs/uk/fractionadddiff.jpg","hub/thumbs/uk/fractionaddsame.jpg","hub/thumbs/uk/fractioncompare.jpg","hub/thumbs/uk/fractionequiv.jpg","hub/thumbs/uk/fractionfind.jpg","hub/thumbs/uk/fractionmixed.jpg","hub/thumbs/uk/fractionratio.jpg","hub/thumbs/uk/fractionslices.jpg","hub/thumbs/uk/fractionwall.jpg","hub/thumbs/uk/missing-numbers.jpg","hub/thumbs/uk/muldiv10.jpg","hub/thumbs/uk/muldivx10.jpg","hub/thumbs/uk/multiples.jpg","hub/thumbs/uk/number-line.jpg","hub/thumbs/uk/number-words.jpg","hub/thumbs/uk/place-value.jpg","hub/thumbs/uk/primes.jpg","hub/thumbs/uk/rounding-steps.jpg","hub/thumbs/uk/rounding.jpg","hub/thumbs/uk/squares.jpg","hub/thumbs/uk/triangular.jpg"];
HUB_ASSETS.forEach(function (a) { FILES.push(a); });
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
