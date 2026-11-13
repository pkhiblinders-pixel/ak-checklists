// Microsoft 365 sign-in for the installed app; gives the SharePoint connector a token.
(function(){
  var C = window.AKCONFIG || {};
  window.AKAPP = { url: C.appUrl || "" };
  if (!C.clientId || !C.siteUrl || !window.msal) return;
  var site = new URL(C.siteUrl), scope = site.origin + "/.default";
  var here = location.origin + location.pathname.replace(/index\.html$/, "");
  var pca = new msal.PublicClientApplication({
    auth: { clientId: C.clientId, authority: "https://login.microsoftonline.com/" + (C.tenantId || "organizations"), redirectUri: here, navigateToLoginRequestUrl: false },
    cache: { cacheLocation: "localStorage" }
  });
  var ok = false;
  var ready = pca.initialize().then(function(){ ok = true; return pca.handleRedirectPromise(); }).then(function(r){
    if (r && r.account) pca.setActiveAccount(r.account);
    else { var a = pca.getAllAccounts(); if (a.length) pca.setActiveAccount(a[0]); }
  }).catch(function(e){ console.warn("Sign-in:", e); }).then(function(){
    setTimeout(function(){ try { if (window.SY) { SY.err = ""; syPill(); syKick(300); } } catch(e){} }, 800);
  });
  function signinError(t){ var e = new Error(t); e.code = "signin"; return e; }
  AKAPP.needsSignIn = function(){ return ok && !pca.getActiveAccount(); };
  AKAPP.signIn = function(){ ready.then(function(){ pca.loginRedirect({ scopes: [scope], prompt: "select_account" }); }); };
  AKAPP.account = function(){ var a = ok && pca.getActiveAccount(); return a ? (a.name || a.username) : ""; };
  window.AKSP = {
    web: C.siteUrl.replace(/\/$/, ""), webRel: site.pathname.replace(/\/$/, ""),
    lib: C.library || "Shared Documents", root: C.root || "AK Planner", list: C.list || "AK Planner Data",
    token: function(){
      return ready.then(function(){
        var a = pca.getActiveAccount(); if (!a) throw signinError("Sign in to sync");
        return pca.acquireTokenSilent({ scopes: [scope], account: a }).then(function(r){ return r.accessToken; }, function(e){
          if (navigator.onLine && e instanceof msal.InteractionRequiredAuthError) throw signinError("Sign in again to sync");
          throw e;
        });
      });
    }
  };
})();
