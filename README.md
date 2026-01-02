# Emotion Palette Generator

A tiny, client-side web app that uses your webcam to add soft colour overlays and show curated colour palettes for different moods. Built with plain HTML, CSS and JS — it can optionally use `face-api.js` to suggest moods based on simple expression detection.

---

## What it does

- Shows your webcam feed and applies mood overlays (Happy, Calm, Sad, Angry, etc.)
- Lets you browse curated palettes and click swatches to copy hex values
- Optional: uses `face-api.js` to suggest moods automatically
- Runs entirely in the browser — no server code required

---

## Quick demo

1. Serve the project (see "Run locally").
2. Open `index.html` and allow the camera when the browser asks.
3. Pick a mood or let the app suggest one using expression detection.
4. Click "View Palettes" to browse and copy colours.

---

## Run locally (why a server?)

Browsers block camera and model file access when opening files with `file://`. Use a simple static server instead.

Quick options:

- Live Server (VS Code): click "Go Live".
- Python 3: `python -m http.server 8000` (then open `http://localhost:8000`).
- Node: `npx serve .` (or `npm i -g serve` then `serve .`).

Any static server that serves the project root works fine.

---

## face-api.js models (required)

If you want automatic expression detection, the app needs the pre-trained `face-api.js` model files in a `models/` folder next to `index.html`.

Grab the files with one of these options:

- Clone the repo and copy the weights:
  - `git clone https://github.com/justadudewhohacks/face-api.js.git`
  - Copy the files into your project:
    - macOS / Linux: `cp -r face-api.js/weights/* ./models/`
    - Windows PowerShell: `Copy-Item -Recurse .\face-api.js\weights\* .\models\`

- Download the weights directly from the face-api.js GitHub (the `weights` folder) and drop them into `models/`.

- Alternatively, point the loader to hosted model files if you prefer not to store them locally (change the model load path in `script.js`).

Notes:
- The app expects models to be served from `/models/*`. If you move them, update the model load paths in the code.
- Check DevTools Network for 404s if models fail to load.
- Note: `face-api.js` is a third-party dependency (https://github.com/justadudewhohacks/face-api.js); please confirm its license before redistributing model files — the repo's `models/` folder is gitignored here, so download the weights manually.

---

## Files & structure

- `index.html` — Camera UI and controls
- `palette.html` — Palette viewer
- `script.js` — Camera, mood logic, expression detection, debug helpers
- `palette.js` — Palette rendering and copy/save behaviour
- `styles.css` — Styling and overlay/filter classes
- `models/` — face-api.js model files (optional, required for expression detection)

---

## Debug & troubleshooting

- No camera prompt: check browser permissions and make sure no other app is using the camera.
- Camera is blocked: serve the site over HTTP(S) instead of `file://`.
- face-api.js model errors: confirm `models/` exists and model requests return 200 in the Network tab.
- Clipboard copy fails: some browsers restrict clipboard access — the app still saves the last colour to `localStorage` and shows a message.

---

## Privacy

Everything runs locally in your browser — no video is sent to external servers.

---

## Contributing & license

This is mainly a portfolio project. If you want to suggest something or spot a bug, feel free to open an issue; PRs are welcome but not required.

