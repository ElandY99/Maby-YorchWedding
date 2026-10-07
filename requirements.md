# Requirements.md — Wedding Invitation Web Page

## 1. Overview

**Status: ✅ Resolved**

Single-page static website, with vertical scrolling, designed to invite guests to a wedding. It conveys a romantic, elegant, and dynamic aesthetic, with subtle wedding-themed animations (floating hearts, petals, or other similar elements).

The page does not include photographs of the bride and groom, only decorative visual resources such as illustrations, icons, textures, shapes, and animations.

The original Google Forms-based attendance confirmation system has been replaced by a **Google Apps Script Web App connected to a Google Sheet**, allowing the page to identify each invitation through a unique invitation code and register attendance directly in the spreadsheet.

---

## 2. Functional Scope

**Status: ✅ Resolved**

The page contains the following sections, in this order:

### 2.1 Hero

**Status: ✅ Resolved**

* Opening section (the first visible block when the page loads).
* Presents the event in a visually appealing way, with background animation using hearts, petals, or another decorative resource appropriate to the theme.
* Does not include photographs of the bride and groom.
* Uses only decorative visual resources.

### 2.2 Message / Short Text

**Status: ✅ Resolved**

* Contains a short and emotional message addressed to the guests.
* The message is purely textual and may be accompanied by decorative resources.
* The event date is displayed within this section.

### 2.3 Locations

**Status: ✅ Resolved**

The page includes two location blocks, in the following order:

1. Ceremony location (wedding).
2. Reception venue.

Each location block includes:

* Name/address of the venue.
* A button that opens the location directly in Google Maps in a new tab.
* An embedded Google Maps iframe corresponding to that location.

### 2.4 Confirm My Attendance

**Status: ✅ Resolved — Modified**

The original Google Forms implementation has been removed.

Attendance confirmation is now handled through a **Google Apps Script Web App connected to a Google Sheet**.

The system must:

* Receive a unique invitation code through the page URL.
* Query the Apps Script to retrieve the invitation information.
* Display the invited person's name.
* Display the number of guests allowed for that invitation.
* Display the current confirmation status.
* Allow the guest to enter the number of attendees.
* Allow the guest to enter an optional note.
* Submit the confirmation directly to the Apps Script.
* Store the confirmation data in the connected Google Sheet.
* Prevent the guest from confirming more people than the invitation quota allows.
* Display an appropriate success or error message based on the response returned by the Apps Script.

The invitation is identified through a URL parameter using the following structure:

```text
https://example.com/?code=INVITATION_CODE
```

The page reads the `code` parameter and uses it to query the Apps Script.

### 2.5 Background Music

**Status: ✅ Resolved**

* The page plays a background audio file provided by the user.
* The audio file is neither generated nor searched for.
* A visible button/control is permanently available to enable or disable the music.
* Due to browser autoplay policies, if autoplay is blocked, the music starts when the user first interacts with the page through a click, scroll, or another valid interaction.
* The mute/unmute control remains available at all times.

---

## 3. User Stories

**Status: ✅ Resolved**

* **As a guest**, I want to see an attractive and emotional page when I enter, so that I can feel the excitement of the event from the very beginning.

* **As a guest**, I want to read a short message from the bride and groom, so that I can feel like a special part of the celebration.

* **As a guest**, I want to clearly see where the ceremony and reception will take place, with direct access to Google Maps, so that I can get there without confusion.

* **As a guest**, I want to confirm my attendance directly from the invitation page, so that I do not have to use an external Google Form.

* **As a guest**, I want my invitation information to be automatically recognized through my invitation code, so that I only interact with the information assigned to my invitation.

* **As a guest**, I want to indicate how many people will attend, within the number of places assigned to my invitation.

* **As a guest**, I want to be able to add an optional note to my attendance confirmation.

* **As a guest**, I want to be able to listen to or mute the background music according to my preference.

* **As the bride/groom**, I want the page to avoid displaying photographs of us, in order to maintain our privacy and keep the focus on the event information.

* **As the bride/groom**, I want attendance confirmations to be stored automatically in a Google Sheet, so that I can manage the guest list without requiring a separate backend system.

---

## 4. Non-Functional Requirements / Design

**Status: ✅ Resolved**

### Structure

* Single page.
* Vertical scrolling.
* No route navigation.
* No page reloads during normal interaction.

### Visual Style

* Dynamic and animated.
* Decorative wedding motifs such as hearts, petals, or other floral/celebratory elements.
* Animations move subtly through floating, falling, fading, or similar effects.
* Animations must not interfere with readability or interaction.

### Color Palette

The visual design uses tones within:

* `#7F00FF` — violet/purple.
* `#2a2a2a` — dark gray/almost black.
* `#80ff00` — green/lime.
* `#EDE8D0` — white/beige.

Tonal variations within these ranges may be used for hierarchy, backgrounds, contrast, and accents.

### Responsive Design

* Mobile first.
* Correctly adapts to mobile devices, tablets, and desktop screens.

### Visual Resources

* Decorative elements only.
* Illustrations, icons, shapes, patterns, textures, and animations are allowed.
* Photographs of the bride and groom are prohibited.

### Performance

* Animations must not significantly affect scrolling smoothness.
* Initial loading must remain lightweight.
* External resources must be used only when justified.
* Google Apps Script requests must not block the initial rendering of the page unnecessarily.

---

## 5. Technical Requirements

**Status: ✅ Resolved — Modified**

### 5.1 Frontend

Development uses:

* HTML5.
* CSS3.
* Vanilla JavaScript.
* No frontend frameworks.

External libraries may be used when necessary for:

* Animations.
* Visual effects.
* Icons.
* Typography.
* Google Maps integration.

Examples include:

* AOS.
* GSAP.
* Lucide Icons.
* Google Fonts.

Only simple and performant solutions should be preferred.

### 5.2 Background Music

The audio file is provided by the user.

The application must:

* Load the provided audio file.
* Attempt autoplay according to browser restrictions.
* Start playback after the first valid user interaction when autoplay is blocked.
* Provide a permanently visible mute/unmute control.

### 5.3 Google Maps

The ceremony and reception locations are integrated using Google Maps embedded through an iframe.

Each location also provides a direct Google Maps link opened in a new browser tab.

### 5.4 Attendance Management

**Google Forms is no longer used.**

Attendance management is implemented using:

* Google Apps Script Web App.
* Google Sheets as the data store.
* HTTP `GET` requests for invitation lookup.
* HTTP `POST` requests for attendance confirmation.

Apps Script Web App:

```text
https://script.google.com/macros/s/AKfycbxtTEWsDoI0nelF9RLHX0486ih0gArIEfBGfJRZnAV2amWukpXWZH0V4_7Ol0z9aXDuxw/exec
```

The frontend communicates with the Web App using the invitation `code`.

### 5.5 Invitation Lookup Flow

When the page loads:

1. JavaScript reads the `code` parameter from the current URL.
2. The frontend sends a `GET` request to the Apps Script:

```text
GET <APPS_SCRIPT_URL>?code=INVITATION_CODE
```

3. Apps Script searches the `Lista de Invitados` sheet for the invitation code.
4. If the code is valid, the API returns the invitation data.
5. The frontend displays the corresponding invitation information.
6. If the code is invalid, the frontend displays an appropriate invalid-invitation message.

Expected successful response:

```json
{
  "ok": true,
  "nombre": "Nombre del invitado",
  "cupo": 2,
  "confirmado": "SI",
  "cantidad": 2,
  "nota": "Nota del invitado"
}
```

Expected invalid-code response:

```json
{
  "ok": false,
  "error": "codigo_invalido"
}
```

### 5.6 Attendance Confirmation Flow

When the guest submits the attendance form:

1. The frontend obtains the invitation code.
2. The frontend validates the number of attendees.
3. The frontend sends a `POST` request to the Apps Script.
4. Apps Script validates the invitation code.
5. Apps Script validates that the requested attendance quantity is an integer between `0` and the invitation quota.
6. Apps Script stores the confirmation in the `Lista de Invitados` sheet.
7. The frontend processes the returned JSON.
8. A success or error message is displayed to the guest.

Example request:

```json
{
  "code": "INV001",
  "cantidad": 2,
  "nota": "Sin restricciones alimentarias"
}
```

Expected successful response:

```json
{
  "ok": true,
  "cantidad": 2
}
```

Possible error responses:

```json
{
  "ok": false,
  "error": "codigo_invalido"
}
```

```json
{
  "ok": false,
  "error": "cantidad_invalida",
  "cupo": 2
}
```

```json
{
  "ok": false,
  "error": "error_servidor"
}
```

### 5.7 Google Sheet Structure

The Apps Script uses the sheet:

```text
Lista de Invitados
```

The relevant columns are interpreted as follows:

| Column | Data                          |
| ------ | ----------------------------- |
| A      | Invitation code               |
| B      | Guest name                    |
| C      | Guest quota                   |
| D      | Confirmation status           |
| E      | Confirmed attendance quantity |
| F      | Guest note                    |
| G      | Confirmation date/time        |

The Apps Script updates columns D through G when a confirmation is submitted.

### 5.8 Apps Script Implementation

The current Apps Script implementation is:

```javascript
const HOJA = 'Lista de Invitados';

// ---------- Consultar una invitación ----------
function doGet(e) {
  const code = String((e.parameter && e.parameter.code) || '').trim();
  const r = buscar_(code);

  if (!r) {
    return json_({
      ok: false,
      error: 'codigo_invalido'
    });
  }

  return json_({
    ok: true,
    nombre: r.nombre,
    cupo: r.cupo,
    confirmado: r.confirmado,
    cantidad: r.cantidad,
    nota: r.nota
  });
}

// ---------- Guardar la confirmación ----------
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    const d = JSON.parse(e.postData.contents);
    const code = String(d.code || '').trim();
    const r = buscar_(code);

    if (!r) {
      return json_({
        ok: false,
        error: 'codigo_invalido'
      });
    }

    const cantidad = Number(d.cantidad);

    if (
      !Number.isInteger(cantidad) ||
      cantidad < 0 ||
      cantidad > r.cupo
    ) {
      return json_({
        ok: false,
        error: 'cantidad_invalida',
        cupo: r.cupo
      });
    }

    let nota = String(d.nota || '').slice(0, 300);

    if (/^[=+\-@]/.test(nota)) {
      nota = "'" + nota;
    }

    const hoja = SpreadsheetApp
      .getActive()
      .getSheetByName(HOJA);

    hoja
      .getRange(r.fila, 4, 1, 4)
      .setValues([
        ['SI', cantidad, nota, new Date()]
      ]);

    return json_({
      ok: true,
      cantidad: cantidad
    });

  } catch (err) {
    return json_({
      ok: false,
      error: 'error_servidor'
    });

  } finally {
    lock.releaseLock();
  }
}

// ---------- Auxiliares ----------
function buscar_(code) {
  if (!code) return null;

  const hoja = SpreadsheetApp
    .getActive()
    .getSheetByName(HOJA);

  const datos = hoja.getDataRange().getValues();

  for (let i = 1; i < datos.length; i++) {

    if (String(datos[i][0]).trim() === code) {

      return {
        fila: i + 1,
        nombre: datos[i][1],
        cupo: Number(datos[i][2]),
        confirmado: datos[i][3],
        cantidad: datos[i][4],
        nota: datos[i][5]
      };

    }
  }

  return null;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 5.9 Client-Side Integration Requirements

The frontend JavaScript must:

* Read the invitation code from `window.location.search`.
* Validate that a code exists.
* Query the Apps Script endpoint.
* Handle loading, success, and error states.
* Populate the guest information dynamically.
* Restrict the attendance selector/input according to the received `cupo`.
* Submit the confirmation using `fetch()`.
* Handle JSON responses from the Apps Script.
* Avoid exposing or hardcoding invitation-specific information in the HTML.
* Preserve the invitation code throughout the page session.
* Provide clear visual feedback for invalid invitations, network errors, successful confirmations, and invalid attendance quantities.

---

## 6. Out of Scope

**Status: ✅ Resolved**

The following are out of scope:

* Custom backend server.
* Custom database.
* User authentication system.
* Photographs of the bride and groom.
* Multi-page structure.
* Routing system.
* Generation or search of the audio file.
* Google Forms.
* Separate administration panel.
* User account creation or login.
* Payment processing.

The Google Apps Script and Google Sheet are considered the external data-management layer required for invitation and attendance management.

---

## 7. SDD — Software Design Description

**Status: ✅ Implemented**

### 7.1 Architecture

The application follows a lightweight client/server architecture:

```text
┌───────────────────────────────┐
│       Wedding Website         │
│                               │
│ HTML + CSS + Vanilla JS       │
│                               │
│ - Invitation UI               │
│ - Guest information           │
│ - Attendance form             │
│ - Music controls              │
│ - Maps                        │
└───────────────┬───────────────┘
                │
                │ HTTP GET / POST
                ▼
┌───────────────────────────────┐
│    Google Apps Script Web App │
│                               │
│ - Validate invitation code    │
│ - Validate attendance         │
│ - Read/write spreadsheet      │
│ - Return JSON responses       │
└───────────────┬───────────────┘
                │
                │ SpreadsheetApp
                ▼
┌───────────────────────────────┐
│        Google Sheets          │
│                               │
│      Lista de Invitados       │
│                               │
│ Code | Name | Quota | Status  │
│      |      |       | Qty     │
│      |      |       | Note    │
│      |      |       | Date    │
└───────────────────────────────┘
```

### 7.2 Invitation Identification

Each invitation is uniquely identified through a code.

Example:

```text
https://example.com/?code=INV001
```

The invitation code is the primary identifier used by the frontend and Apps Script.

### 7.3 GET Endpoint

Purpose:

Retrieve invitation information.

Request:

```text
GET /exec?code=INV001
```

Possible responses:

**Valid invitation**

```json
{
  "ok": true,
  "nombre": "Juan Pérez",
  "cupo": 2,
  "confirmado": "",
  "cantidad": "",
  "nota": ""
}
```

**Invalid invitation**

```json
{
  "ok": false,
  "error": "codigo_invalido"
}
```

### 7.4 POST Endpoint

Purpose:

Register or update the attendance confirmation.

Request:

```json
{
  "code": "INV001",
  "cantidad": 2,
  "nota": "Confirmamos asistencia"
}
```

The Apps Script validates:

* Invitation code.
* Attendance quantity.
* Maximum allowed quota.
* Note length.

The note is limited to 300 characters and values beginning with `=`, `+`, `-`, or `@` are escaped to reduce the risk of spreadsheet formula injection.

### 7.5 Concurrency Control

The Apps Script uses:

```javascript
LockService.getScriptLock()
```

to prevent concurrent writes from causing inconsistent spreadsheet data.

The lock waits up to 15 seconds:

```javascript
lock.waitLock(15000);
```

The lock is always released in the `finally` block.

### 7.6 Data Persistence

No custom database is required.

Google Sheets serves as the persistent data store, while Google Apps Script acts as the API layer between the website and the spreadsheet.

### 7.7 Error Handling

The frontend must distinguish at least the following situations:

* `codigo_invalido`
* `cantidad_invalida`
* `error_servidor`
* Network/request failure
* Missing invitation code
* Invalid or incomplete response

Each state must display a clear message to the guest without exposing technical implementation details unnecessarily.

### 7.8 Security and Validation Considerations

The system must not trust user-provided values.

The Apps Script performs the authoritative validation of:

* Invitation code.
* Guest quota.
* Attendance quantity.
* Note length.

Frontend validation is considered a usability feature, not a security mechanism.

Invitation-specific information must be obtained dynamically from the Apps Script rather than being hardcoded in the page.

---

## 8. Final Implementation Status

**Overall Status: ✅ Resolved**

The wedding invitation website requirements have been implemented.

The final solution consists of:

* ✅ Single-page responsive wedding invitation.
* ✅ Hero section.
* ✅ Emotional message and event date.
* ✅ Ceremony location.
* ✅ Reception location.
* ✅ Google Maps links and embedded maps.
* ✅ Decorative wedding animations.
* ✅ Background music with persistent playback control.
* ✅ No photographs of the bride and groom.
* ✅ Vanilla HTML/CSS/JavaScript implementation.
* ✅ Individual invitation codes.
* ✅ Dynamic invitation lookup.
* ✅ Guest quota validation.
* ✅ Attendance confirmation.
* ✅ Optional guest notes.
* ✅ Google Sheets persistence.
* ✅ Google Apps Script API.
* ✅ GET/POST communication between frontend and Apps Script.
* ✅ Error handling and validation.
* ❌ Google Forms removed from the system.
* ❌ Custom backend/database not required.