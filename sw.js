// AK Checklists offline cache. The app opens from this cache instantly, with or without signal;
// a fresh copy is fetched in the background and used from the next launch.
const V = "ak-checklists-6.0.0";
const SHELL = ["./", "index.html", "config.js", "auth.js", "msal-browser.min.js", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;           // SharePoint and sign-in go straight to the network
  const key = r.mode === "navigate" ? "index.html" : r;
  e.respondWith(caches.open(V).then(c => c.match(key, { ignoreSearch: true }).then(hit => {
    const net = fetch(r).then(res => { if (res && res.ok && res.type === "basic") c.put(key, res.clone()); return res; }).catch(() => hit);
    if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
    return net;
  })));
});
