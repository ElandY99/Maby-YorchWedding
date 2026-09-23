# Requirements.md — Wedding Invitation Web Page

## 1. Overview

Single-page static website, with vertical scrolling, designed to invite guests to a wedding. It should convey a romantic, elegant, and dynamic aesthetic, with subtle wedding-themed animations (floating hearts, petals, or other similar elements). It must not include photographs of the bride and groom, only decorative visual resources (illustrations, icons, textures, shapes, etc.).

## 2. Functional Scope

The page must contain the following sections, in this order:

### 2.1 Hero

* Opening section (the first visible block when the page loads).
* It must present the event in a visually appealing way, with background animation (hearts/petals or another decorative resource appropriate to the theme).
* It must not include photos of the bride and groom, only decorative visual resources.

### 2.2 Message / Short Text

* Section containing a short and emotional message ("this is written by the user") addressed to the guests.
* Purely textual, accompanied by decorative resources if desired.
* The event date goes here.

### 2.3 Locations

It must include **two** location blocks, in this order:

1. Ceremony location (wedding).
2. Reception venue.

Each location block must include:

* Name/address of the venue.
* A button that opens the location directly in Google Maps (in a new tab).
* An embedded map (embed) below the button, corresponding to that location.

### 2.4 Confirm My Attendance

* Final section with the title "Confirm My Attendance" (or equivalent).
* It must allow guests to confirm their attendance through a **Google Form**.
* Implementation to be defined during development between two alternatives, prioritizing whichever results in the cleanest visual integration within the page design:

  * Embedded form (iframe) within the section, or
  * Button that opens the form in a new tab.
* The final decision on which alternative to use is subject to visual validation during development.

### 2.5 Background Music

* The page must play a background audio file (the music file is provided by the user; it is neither generated nor searched for).
* There must be a visible button/control at all times (for example, a floating button) to enable/disable the music.
* Due to browser autoplay policies, if autoplay is blocked, the music must start playing as soon as the user first interacts with the page (click/scroll), while keeping the mute/unmute button always available.

## 3. User Stories

* **As a guest**, I want to see an attractive and emotional page when I enter, so that I can feel the excitement of the event from the very beginning.
* **As a guest**, I want to read a short message from the bride and groom, so that I can feel like a special part of the celebration.
* **As a guest**, I want to clearly see where the ceremony and reception will take place, with direct access to Google Maps, so that I can get there without confusion.
* **As a guest**, I want to easily confirm my attendance from the same page, so that I do not have to search for the form through another channel.
* **As a guest**, I want to be able to listen to (or mute) the background music according to my preference, so that I have control over my browsing experience.
* **As the bride/groom**, I want the page to avoid displaying photos of us, in order to maintain our privacy and keep the focus on the event information.

## 4. Non-Functional Requirements / Design

* **Structure:** a single page, vertical scrolling, with no route navigation or page reloads.
* **Visual style:** dynamic and animated, with decorative wedding motifs (hearts, petals, or other floral/celebratory elements) moving subtly (e.g., floating, falling, fading), without interfering with readability.
* **Color palette:** based on tones within the range of `#7F00FF` (violet/purple) and `#2a2a2a` (dark gray/almost black) for the dark theme, and `#80ff00` (green/lime) and `#EDE8D0` (white/beige) for the light theme. Tonal variations within these ranges (lighter/darker) may be used for visual hierarchy, backgrounds, contrasts, and accents.
* **Responsive:** the page must adapt correctly to mobile devices, tablets, and desktop (mobile first).
* **Visual resources:** decorative elements only (illustrations, iconography, shapes, patterns). The use of photographs of the bride and groom is prohibited.
* **Performance:** animations must not significantly affect scrolling smoothness or loading times.

## 5. Technical Requirements

* Development using **HTML, CSS, and vanilla JavaScript** (without frontend frameworks).
* **External libraries** are allowed when necessary for animations (e.g., particles.js, AOS, GSAP, Lucide Icons, Google Fonts, etc.) or embedded maps, prioritizing simple and performant solutions.
* The audio file for the background music will be provided by the user (it is not generated or searched for as part of development).
* Maps will be integrated using a Google Maps embed (iframe).
* Attendance confirmation will be integrated using Google Forms (embedded or linked through a button, according to what is defined in section 2.4).

## 6. Out of Scope

* Backend, database, or authentication.
* Photographs of the bride and groom.
* Multi-page structure or routing system.
* Generation or search of the audio file (it is provided by the user).
