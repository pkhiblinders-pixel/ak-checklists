# AK Checklists app: setup

AK Checklists installs on Android phones and iPhones straight from a web link. There is no Play Store or App Store listing and no APK file. Once installed, it opens from the home screen like any other app, works with no signal, and sends everything to the same SharePoint site as the AK Planner web part when a connection is back.

The setup has three parts:

- **Part A:** put this folder on a web address.
- **Part B:** let the app sign in to SharePoint. This is done once, by IT.
- **Part C:** install the app on each engineer's phone.

---

## Part A: host the folder

The app needs an **https** address. GitHub Pages is free and takes about 10 minutes. Any other https web host also works, for example Azure Static Web Apps or your company web server.

1. Go to **github.com** and sign in. If you don't have an account, create one.
2. Click **+** at the top right, then **New repository**.
3. Fill in the form:
   - Name: `ak-checklists`
   - Visibility: **Public**. GitHub Pages is free for public repos. Your data is not in the repo; it stays in SharePoint behind Microsoft 365 sign-in.
4. Click **Create repository**.
5. Click **uploading an existing file**.
6. Drag in **every file in this folder** (`index.html`, `config.js`, `auth.js`, `sw.js`, `manifest.webmanifest`, `msal-browser.min.js`, and the four `.png` icons).
7. Click **Commit changes**.
8. Open the repo's **Settings**, then **Pages**.
9. Under *Branch*, choose **main** and **/ (root)**, then click **Save**.
10. Wait about a minute. The page then shows your address, for example `https://yourname.github.io/ak-checklists/`. Copy it.
11. Open `config.js` in the repo and click the pencil icon to edit it.
12. Paste the address into `appUrl`, then click **Commit changes**.

---

## Part B: Microsoft 365 sign-in (IT admin, once)

You need a Microsoft Entra admin for this part.

1. Go to **entra.microsoft.com**, then **Identity → Applications → App registrations → New registration**.
2. Fill in the form:
   - Name: `AK Checklists`
   - Supported account types: **Accounts in this organizational directory only**
   - Redirect URI: choose the platform **Single-page application (SPA)** and paste the app address from Part A, ending with `/`.
3. Click **Register**.
4. On the overview page, copy the **Application (client) ID** and the **Directory (tenant) ID**.
5. Open **API permissions → Add a permission → SharePoint → Delegated permissions** and tick **AllSites.Write**.
   - If the list **AK Planner Data** doesn't exist yet on the site, tick **AllSites.Manage** instead. The app creates the list on first use.
6. Click **Grant admin consent for <your organisation>**, then **Yes**.
7. Edit `config.js` in the repo (pencil icon) and fill in these values:
   ```js
   clientId: "<Application (client) ID>",
   tenantId: "<Directory (tenant) ID>",
   siteUrl:  "https://<tenant>.sharepoint.com/sites/<your site>",
   ```
   Leave `library`, `root` and `list` as they are, unless you changed them in the AK Planner web part. They must match the web part.
8. Click **Commit changes**.

To test it:

1. Open the app address on a computer.
2. Click the pill at the top right that says **Sign in to sync** and sign in.
3. Open a villa, answer one checklist point and wait for **Synced** to appear.
4. Open the AK Planner page on SharePoint. The same answer should be there.

Each engineer only ever sees what their own SharePoint permissions allow.

---

## Part C: install on each phone

**Android (Chrome)**

1. Open the app address in **Chrome**.
2. Tap **⋮**, then **Install app**. On some phones it says **Add to Home screen**.
3. Open **AK Checklists** from the home screen and sign in once while online.

**iPhone or iPad (Safari)**

1. Open the app address in **Safari**. Other iPhone browsers can't install apps.
2. Tap **Share**, then **Add to Home Screen**, then **Add**.
3. Open **AK Checklists** from the home screen and sign in once while online.

The **Android** and **iPhone** buttons at the top right of the app show these same steps.

---

## How it works on site

- **Saving.** Every answer, photo, defect and debit note is saved on the phone first. With no signal, the pill at the top right shows **Offline · N waiting**.
- **Syncing.** When the phone gets a connection, the app syncs by itself. It also retries every minute and whenever the app is reopened.
  - Work on different activities by different engineers is merged.
  - If two people change the same activity, the later change wins.
- **Photos.**
  - The full-size original stays on the phone.
  - A lighter copy goes to SharePoint for viewing.
  - The full-size original is also backed up to `AK Planner/Files` when online.
  - Originals are removed from the phone after 45 days, and only once they are backed up or exported.
- **Day end.** Downloads one ZIP of the day's work: one JSON file per villa activity and phase, with full-resolution photos, defects and debit notes included. Files are named like this:
  `Villa12-Sub_Structure-Footings-Footing_concrete-Before-2026-11-13.json`
- **Tomorrow** and **Labour** each make one PDF with the company logo to share on WhatsApp. They can also make one PDF per villa activity, for example:
  `Villa12-Sub_Structure-Footings-Footing_concrete-Schedule-2026-11-13.pdf`
  `Villa12-Sub_Structure-Footings-Footing_concrete-Labour-2026-11-13.pdf`

## Updating the app

Upload the new `index.html` to the repo and replace the old one. Phones pick it up automatically the next time the app is opened with signal. Don't overwrite `config.js` when you upload.
