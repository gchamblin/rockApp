# 🪨 Rocky's Rock Collection

An offline rock-collecting app for kids. Add rocks with photos, browse a rock guide, and read fun facts about Florida rocks — no internet needed once it's installed.

## Features
- **My Collection** – add rocks with a photo, name, type, location found, and notes. Saved on the device.
- **Add a Rock** – simple form for kids.
- **Rock Guide** – common rock/mineral types with descriptions and fun facts.
- **Florida Facts** – facts about Florida-specific rocks and fossils (coquina, limestone, agatized coral, megalodon teeth, etc.).
- **Export/Import** – back up the collection to a JSON file or move it to another device.

## Running it locally
1. Install dependencies (only needed once):
   ```powershell
   npm install
   ```
2. Start the local server:
   ```powershell
   npm start
   ```
3. Open the URL it prints (e.g. `http://localhost:8080`) in your browser.

> The app must be opened over `http://` or `https://` (not by double-clicking `index.html`) for the offline install feature (service worker) to work.

## Installing on a kid's device (phone/tablet)
1. Make the app reachable from the device — either:
   - Run `npm start` on a computer on the same Wi-Fi and open `http://<your-computer-ip>:8080` on the device, or
   - Host the folder on any static web host (e.g. GitHub Pages, Netlify) and open that URL.
2. On the device, open the link in the browser:
   - **iPhone/iPad (Safari):** tap the Share icon → **Add to Home Screen**.
   - **Android (Chrome):** tap the menu (⋮) → **Install app** / **Add to Home Screen**.
3. Open the app from the home screen icon. After the first load, it works fully offline — no Wi-Fi or data needed.

## Backing up / moving the collection
- In the **My Collection** tab:
  - **⬇️ Export Collection** downloads a `logans-collection.json` file with all his rocks.
  - **⬆️ Import Collection** loads a previously exported JSON file back in (works on the same or a different device).
- Transfer the exported file however is convenient (email, USB, AirDrop, cloud drive), then use Import on the new device.

## Project structure
```
rockApp/
  index.html        Main app page (tabs: Collection, Add, Guide, Florida Facts)
  css/style.css      Styling
  js/data.js         Built-in Rock Guide + Florida Facts content
  js/app.js          App logic (collection storage, tabs, export/import)
  manifest.json      PWA manifest (app name, icon, install behavior)
  sw.js              Service worker (enables offline use)
  icons/icon.svg     App icon
  package.json       npm scripts for running a local dev server
```

## Notes
- All rock data is stored in the browser's local storage on that device only — nothing is uploaded anywhere automatically. Use Export/Import to move data between devices.
- To add or edit the built-in Rock Guide / Florida Facts content, edit [js/data.js](js/data.js).
