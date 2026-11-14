// Microsoft 365 sign-in for AK Checklists. Nothing in the app opens until the person has signed in.
(function(){
  var C = window.AKCONFIG || {};
  var A = window.AKAPP = { url: C.appUrl || "", config: C };
  var missing = [];
  if (!C.clientId) missing.push("clientId");
  if (!C.tenantId) missing.push("tenantId");
  if (!C.siteUrl) missing.push("siteUrl");
  if (!window.msal) missing.push("msal-browser.min.js (file missing next to index.html)");
  A.missing = missing;
  A.state = function(){ return missing.length ? "setup" : (!ok ? "loading" : (pca.getActiveAccount() ? "ok" : "signin")); };
  if (missing.length) { A.ready = Promise.resolve(); return; }
  var site;
  try { site = new URL(C.siteUrl); } catch (e) { missing.push("siteUrl (not a valid web address)"); A.ready = Promise.resolve(); return; }
  var scope = site.origin + "/.default";
  var here = location.origin + location.pathname.replace(/index\.html$/, "");
  var pca = new msal.PublicClientApplication({
    auth: { clientId: C.clientId, authority: "https://login.microsoftonline.com/" + C.tenantId, redirectUri: here, postLogoutRedirectUri: here, navigateToLoginRequestUrl: false },
    cache: { cacheLocation: "localStorage" }
  });
  var ok = false;
  A.lastError = "";
  A.ready = pca.initialize().then(function(){ ok = true; return pca.handleRedirectPromise(); }).then(function(r){
    if (r && r.account) pca.setActiveAccount(r.account);
    else { var a = pca.getAllAccounts(); if (a.length) pca.setActiveAccount(a[0]); }
  }).catch(function(e){ ok = true; A.lastError = (e && (e.errorMessage || e.message)) || String(e); console.warn("Sign-in:", e); });
  function signinError(t){ var e = new Error(t); e.code = "signin"; return e; }
  A.needsSignIn = function(){ return ok && !pca.getActiveAccount(); };
  A.signIn = function(){ A.ready.then(function(){ pca.loginRedirect({ scopes: [scope], prompt: "select_account" }); }); };
  A.signOut = function(){ A.ready.then(function(){ var a = pca.getActiveAccount(); pca.logoutRedirect({ account: a || undefined }); }); };
  A.email = function(){ var a = ok && pca.getActiveAccount(); return a ? String(a.username || "").toLowerCase() : ""; };
  A.account = function(){ var a = ok && pca.getActiveAccount(); return a ? (a.name || a.username) : ""; };
  A.token = function(){
    return A.ready.then(function(){
      var a = pca.getActiveAccount(); if (!a) throw signinError("Sign in to sync");
      return pca.acquireTokenSilent({ scopes: [scope], account: a }).then(function(r){ return r.accessToken; }, function(e){
        A.lastError = (e && (e.errorMessage || e.message)) || String(e);
        if (navigator.onLine && e instanceof msal.InteractionRequiredAuthError) {
          // consent or a new sign-in is needed: send the person to Microsoft once, then come back
          if (!sessionStorage.getItem("ak-reauth")) { sessionStorage.setItem("ak-reauth", "1"); pca.acquireTokenRedirect({ scopes: [scope], account: a }); }
          throw signinError("Sign in again to sync");
        }
        throw e;
      });
    });
  };
  window.AKSP = {
    web: C.siteUrl.replace(/\/$/, ""), webRel: site.pathname.replace(/\/$/, ""),
    lib: C.library || "Shared Documents", root: C.root || "AK Planner", list: C.list || "AK Planner Data",
    token: A.token
  };
})();
