# Changelog

All notable changes to this project will be documented in this file.

### 0.1.6 (2026-10-16)

* 🧭 **Docs-shell panes (G17):** `AbAppLayout` (client + server) gets `variant="panes"` and `railCollapsed`. Four breakpoints: mobile (bottom bar, aside as a full-screen sheet), tablet 768–1023 (280px sidebar or 72px rail, overlay aside on the right, hidden by default), laptop 1024–1439 (joined panes, hairline dividers), desktop ≥ 1440 (gapped panes with radii). Uses the theme 0.3.4 tokens with fallbacks. The default variant is unchanged
* 🧷 **Rail:** 200ms width transition, instant under reduced motion; stays expanded with JS off (`@media (scripting: none)`)
* 📑 **Aside toggles (useAbPage):** `toggleAside`, `toggleAsideOnMobile`, `asideId` (the aside's `id`), and **`useAbAsideToggle()`**, which picks the sheet or the pane for the viewport and returns `aria-expanded` / `aria-controls` / `onClick`. `Escape` closes the sheet
* 🎞️ **Aside slide:** `slideFromRight` (ab-nextjs-animations) at **240ms** (`asideDuration` default 240, was 300); under reduced motion no slide and instant open/close (`getAbAsideDuration`)
* 🔧 `typecheck` script; 📝 house `@authors` email in the code file headers
* Tests: per-breakpoint CSS, rail + reduced motion + JS off, aside 240ms / reduced motion, toggles and aria. Checked in WebKit at 390 / 768 / 1280 / 1600px

### 0.1.5 (2026-10-05)

* **Landmarks:** header / footer wrappers set `data-ab-part="header"` / `data-ab-part="footer"`

### 0.1.4 (2026-10-05)

* **Semantics:** layout wrappers use landmark tags — `<header>` / `<footer>` (was `<div>`); `<main>` and `<aside>` unchanged; sidebar / bottom bar stay the consumer's `<nav>` (`AbSidebar` / `AbNavbar` in components)
* **Aside targeting:** `AbAsideLayout` sets `data-ab-part="aside"` (and keeps `class="AbAsideLayout"`) so `useAbDialog` / `useAbMenu` / `useAbToast` can find the real aside, never a sidebar
* **Main:** `AbMainLayout` sets `data-ab-part="main"`
* **Animation:** client `AbAsideLayout` uses the real `.slideFromRight` class from `ab-nextjs-animations` (was undefined `animate-slide-from-right`)

### 0.1.3 (2026-10-03)

* Publish to npm with Trusted Publishing (OIDC); `next` peer `^16.3.4`
