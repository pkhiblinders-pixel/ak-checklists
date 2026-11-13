// AK Checklists — app settings. Your IT team fills these in once (see SETUP-APP.md).
// Nothing here is secret: the Client ID is public by design; access is controlled by Microsoft 365 sign-in.
window.AKCONFIG = {
  appUrl:   "https://pkhiblinders-pixel.github.io/ak-checklists/",                    // where this folder is hosted, e.g. "https://amr-living.github.io/ak-checklists/"
  clientId: "5afd1ee8-309b-40cc-a953-b0af41797c5e",                    // Entra ID app registration → Application (client) ID
  tenantId: "1e8ff736-d0ed-4090-b33e-b9c1bec360d4",                    // Entra ID → Directory (tenant) ID
  siteUrl:  "https://bhaaje.sharepoint.com/sites/AKPlanner",                    // SharePoint site, e.g. "https://contoso.sharepoint.com/sites/AMRLivingSpaces"
  library:  "Shared Documents",    // same values as the AK Planner web part
  root:     "AK Planner",
  list:     "AK Planner Data"
};
