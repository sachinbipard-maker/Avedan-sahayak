# आवेदन सहायक (Avedan Sahayak)

Helps visitors to a Bihar block office (प्रखंड कार्यालय) who read/write little to prepare a formal Hindi application.

- **Input:** typed or spoken (voice is optional; Hindi `hi-IN` via the browser's Web Speech API, Chrome/Android work best and need internet).
- **Verification:** every answer is validated, read back aloud and shown in large type ("क्या यह सही है?"); a final review screen lets any answer be changed.
- **Output:** a ready-to-print Hindi application, with print / copy / WhatsApp / read-aloud.
- **Privacy:** runs fully in the browser. No server, no storage, nothing is sent anywhere (except the browser's own speech service when the mic is used).

## Run
```
python3 -m http.server 8000   # then open http://localhost:8000
```
Or enable **GitHub Pages** (Settings → Pages → main / root).

## Departments (scaling horizontally)
Each department is one file in `js/departments/` that calls `registerDepartment({...})` (see `registry.js` for the shape: `id, name, desc, officer, fields[], template(answers)`). To add one:
1. Copy `pension.js` → `ration.js`, change fields and letter template.
2. Add `<script src="js/departments/ration.js"></script>` in `index.html`.
It then appears on the home screen automatically. No change to `app.js`.

## Roadmap
Other languages (Maithili, Bhojpuri, English), per-field voice-confirm by "हाँ/नहीं", PWA/offline, kiosk mode, tests, department-specific document checklists verified with the office.

> The sample pension letter text and field list should be checked with the actual block office before real use.
