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

## Sign-in

- **Nothing in the app opens until the person signs in** with their company Microsoft 365 account. They also need access to the AMR Living Spaces SharePoint site.
- **If `config.js` isn't filled in**, the app shows "The app isn't connected to Microsoft 365 yet" and nobody can open it.
- **After the first sign-in**, the app keeps working offline on that phone.
- **⋯ › Sign out** signs the person out. Work that hasn't synced stays on the phone and syncs at the next sign-in.
- **The loose `AK_Checklists.html` and `AK_Planner.html` files** only open inside the SharePoint web part or the app. Opening them directly shows a message instead.
- **Your data** (checklists, plans, drawings, photos) is never in the app files. It lives in SharePoint, and SharePoint only hands it to signed-in people with access.
- **GitHub Pages is public**, so the app's code and its built-in site layout can be downloaded by anyone who has the link. To make even that private, host the folder on **Azure Static Web Apps** with Microsoft sign-in turned on instead of GitHub Pages.

## When something doesn't work: ⋯ › Connection check

Run it on the phone or computer that has the problem. It checks each of these and says exactly what to fix:

- the settings in `config.js`
- that the person is signed in
- the SharePoint permission (admin consent)
- the site address
- the data list
- that the person can save to the list
- the person's role and why they have it
- what's waiting to sync

The usual causes:

| What you see | Cause | Fix |
|---|---|---|
| Everyone sees everything, and the pill says "On this device" | `config.js` not filled in, or the old `index.html` is still cached | Fill in `config.js`, upload the new files, then open the app twice (the first open fetches the update) |
| "Permission to use SharePoint" fails | Admin consent missing | Part B, steps 5–6 |
| "SharePoint site" fails | `siteUrl` is wrong | Use the site address only, e.g. `https://company.sharepoint.com/sites/AMR`, without `/SitePages/...` |
| "You can save to the list" fails | Person has read-only access | Give them **Edit** (Contribute) on the site |

## Who can do what

| Role | Sees in the app |
|---|---|
| **Admin** | Everything: Overview, Site map, Planner (edit), Checklists, Defects, Drawings (upload and delete), Quantities, Tomorrow, Labour, Day end, and **⋯ › People and roles** |
| **Project manager** | Same as Admin, except People and roles |
| **Site engineer** | Site map, Checklists, Defects, Drawings (view only), Tomorrow, Labour, Day end |

- **Owners of the SharePoint site** and site collection admins are always **Admin**.
- To make someone else Admin from the start, add their work email to `admins` in `config.js`, e.g. `admins: ["pm@company.com"]`.
- Admins set everyone else in the app under **⋯ › People and roles**. Anyone who signs in and isn't listed is a **Site engineer**.
- The app enforces roles in its screens. Engineers still need **Contribute** access to the SharePoint list `AK Planner Data` and the `AK Planner` folder, because their checklists, photos and reports are saved there.

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

- **Where schedules and labour reports are kept:** every schedule and labour report is stored automatically when it syncs, in `AK Planner/Daily Reports/Work schedules/<date>` and `AK Planner/Daily Reports/Labour reports/<date>`. The per-activity PDFs go in a `Villa N` subfolder. The **Saved schedules** list on each page shows past days and whether each file is already in SharePoint.

## Updating the app

Upload the new `index.html` to the repo and replace the old one. Phones pick it up automatically the next time the app is opened with signal. Don't overwrite `config.js` when you upload.
