// AK Checklists — app settings. Your IT team fills these in once (see SETUP-APP.md).
// Nothing here is secret: the Client ID is public by design; access is controlled by Microsoft 365 sign-in.
window.AKCONFIG = {
  appUrl:   "https://pkhiblinders-pixel.github.io/ak-checklists/",                    // where this folder is hosted, e.g. "https://amr-living.github.io/ak-checklists/"
  clientId: "",                    // Entra ID app registration → Application (client) ID
  tenantId: "",                    // Entra ID → Directory (tenant) ID
  siteUrl:  "",                    // SharePoint site, e.g. "https://contoso.sharepoint.com/sites/AMRLivingSpaces"
  library:  "Shared Documents",    // same values as the AK Planner web part
  root:     "AK Planner",
  list:     "AK Planner Data"
};
