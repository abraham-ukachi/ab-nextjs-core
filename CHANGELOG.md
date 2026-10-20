# Changelog

All notable changes to this project will be documented in this file.

## 0.2.1 (Unreleased)

* 🎨 **Main pane background:** `AbMainLayout` (client + server) paints `--ab-color-pane-main` (theme ≥ 0.3.5) in light and dark, then the old chains (`--color-background` → `--surface` → `#fff`; dark `--color-dark-background` → `--surface` → `#0a0a0a`). The theme never defined `--color-background`, so the pane was white instead of #fff8f5 / #1d150f. The bottom fade uses the same colour.
* 🎨 **Aside pane background (James):** `AbAsideLayout` (client + server) does the same: `--ab-color-pane-main` first in light and dark, for the pane and its fade. It was white too.
* 🪟 **Side panes at 1920 (God 00:41):** the sidebar / rail pane (`:where()`, zero specificity), the ≥ 1180px aside column and `AbAsideLayout` read theme 0.3.6's `--ab-color-pane` first. The theme only sets it at ≥ 1920px in light (#fff, mock 05), so everywhere else, and in dark, the fallbacks keep today's colours: a transparent sidebar and a `--ab-color-pane-main` aside.
* 📟 **`tabletHeader="main"`:** from 768 to 1179px, the main-header slot is now exactly `--ab-header-height` (60px) tall and its child fills it, like the app header row (mock 06 `.mbar`). It used to take the child's own height, which was 48px.
* 🏷️ **Sidebar logo row:** AbSidebar's `logo` row (`data-ab-part="sidebar-logo"`, components ≥ 0.1.15) is shown only where the app header is hidden, which is `tabletHeader="main"` at 768–1179px. Everywhere else in panes it's hidden, because the app bar already carries the brand.
* 🚫 **AbAsideLayout:** no more `transition: all 300ms` (the no-transitions rule; motion comes from ab-nextjs-animations).

## [0.2.0](https://github.com/abraham-ukachi/ab-nextjs-core/compare/v0.1.6...v0.2.0) (2026-10-20)

### ⚠️ BREAKING (`variant="panes"` only; the default variant is unchanged)

* 📐 **Breakpoints moved:** joined panes now start at **1180px** (was 1024) and gapped panes at **1920px** (was 1440). So 1024–1179 now shows the tablet layout (overlay aside), and 1440–1919 shows joined panes.
* 🔎 **`AB_ASIDE_SHEET_QUERY`** changed from `'(max-width: 1023px)'` to `'(max-width: 1179px)'`, so `isAsideSheet` / small-screen checks flip at 1180.
* 🔝 **The header row has a fixed height:** `--ab-header-height` (52px on mobile, 60px from 768, 64px from 1920) plus the safe-area inset. A taller custom header gets clipped, so set `--ab-header-height` to keep it.
* 🗂️ **New pane-width defaults:** tablet sidebar 248 (was 280), overlay aside 320 (was `min(40vw, 360px)`), rail 64 (was 72), joined 260 / 236, gapped 288 / 272.
* 🪟 **Gapped look:** 16px gap (was 12), outer gap on the sides and bottom only, 20px radius (was 16), and a light-only `--ab-pane-shadow`.
* 🧭 **Migrate (keep the 0.1.6 look):** `.AbAppLayout { --ab-sidebar-width: 280px; --ab-aside-width: min(40vw, 360px); --ab-rail-width: 72px; --ab-header-height: 64px; --ab-pane-gap: 12px; --ab-pane-radius: 16px; --ab-pane-shadow: none; }`. The breakpoints themselves can't be overridden (they're media queries; configurable breakpoints are P1).

### Changes

* 📐 **Breakpoints (Decision 6, approved by God 2026-10-20):** mobile <768, tablet 768–1179 (the aside is a sheet), joined panes 1180–1919, gapped panes ≥1920. They were 1024 and 1440. `AB_ASIDE_SHEET_QUERY` is now `(max-width: 1179px)`. The 1180 boundary is the same one AbAppBar already uses to move its nav into More.
* 🪟 **Gapped panes follow the desktop mock (05):** a 16px gap, an outer gap on the sides and bottom only (the header sits on top), a 20px radius and a soft `--ab-pane-shadow`. The defaults match `ab-nextjs-theme` 0.3.5.
* 🗂️ **Pane widths + header height (spec §3):** the defaults are now in `:where()` (zero specificity), so an app's `--ab-sidebar-width` / `--ab-aside-width` / `--ab-rail-width` / `--ab-header-height` always win. The values: tablet sidebar 248 · aside 320; joined 260 / 236; gapped 288 / 272; rail 64. The header row is `--ab-header-height`: 52px on mobile, 60px from 768, 64px from 1920.
* 📟 **`tabletHeader="main"` (P2):** from 768 to 1179 the app header row is hidden and AbMainLayout's `mainHeader` becomes the bar. At other widths that slot is hidden.
* 🌗 **`--ab-pane-shadow`** is `none` in dark.

### 0.1.6 (2026-10-16)

* 🧭 **Docs-shell panes (G17):** `AbAppLayout` (client + server) gets `variant="panes"` and `railCollapsed`. Four breakpoints: mobile (bottom bar, aside as a full-screen sheet), tablet 768–1023 (280px sidebar or 72px rail, overlay aside on the right, hidden by default), laptop 1024–1439 (joined panes, hairline dividers), desktop ≥ 1440 (gapped panes with radii). Uses the theme 0.3.4 tokens with fallbacks. The default variant is unchanged
* 🧷 **Rail:** 200ms width transition, instant under reduced motion; stays expanded with JS off (`@media (scripting: none)`)
* 📑 **Aside toggles (useAbPage):** `toggleAside`, `toggleAsideOnMobile`, `asideId` (the aside's `id`), and **`useAbAsideToggle()`**, which picks the sheet or the pane for the viewport and returns `aria-expanded` / `aria-controls` / `onClick`. `Escape` closes the sheet
* 🎞️ **Aside slide:** `slideFromRight` (ab-nextjs-animations) at **240ms** (`asideDuration` default 240, was 300); under reduced motion no slide and instant open/close (`getAbAsideDuration`)
* 📏 **Layout rule (D35, G50–G52, G54):** the page never scrolls. In panes the app is a `100dvh` grid (`auto minmax(0,1fr) auto`, `overflow:hidden`) and `<html>`/`<body>` are locked while it is mounted (`:has()` plus a `data-ab-layout-lock` fallback, counted by `acquireAbLayoutLock()` so unmounting one of two layouts keeps it). Main, aside and sidebar each scroll on their own: `min-height:0`, `overscroll-behavior: contain`, `scrollbar-gutter: stable`, safe-area padding. The 64px `--ab-app-bar-height` offset and the sticky columns are gone
* 🫥 **Empty chrome is 0px (G50):** null header/footer slots are not rendered, and `:empty` / `:has()` collapse the rest; strings are wrapped (`toAbSlot`) so text-only slots never collapse
* 🔝 **New slots (G52):** `AbMainLayout` `mainHeader` / `mainBar`, `AbAsideLayout` `asideHeader` / `asideBar` (`data-ab-part="main-header"` …). `header` / `footer` / `chrome` stay as deprecated aliases
* 📜 **Scrollers on useAbPage (G55):** `mainScrollElement` / `asideScrollElement` (content wrappers are `data-ab-part="main-content"` / `"aside-content"`), for hooks 0.1.7 `useAbScrollSpy({ root })`. The server `AbMainLayout` / `AbAsideLayout` set them too, through a tiny client island (`AbScrollRegistrar`, one hidden `<span>` as the scroller's first child) (Joseph)
* 🧱 **No nested headers:** in panes (or when the slot child is already a `<header>`) the header wrapper is a `<div>`; `overlays` drops the legacy layers (off by default in panes); the pane CSS also targets AbSidebar's `data-ab-part="rail"`
* 🆔 **AbMainLayout / AbAsideLayout:** `id` prop, and `chrome={false}` drops their empty header/footer wrappers and backdrop/menus/dialogs/toasts/progress/canvas (default `true`, unchanged). Server `AbAsideLayout` sets `id` (default `ab-aside`)
* 🌫️ **Sheet (James):** tablet backdrop (click closes), focus moves into the sheet and back to the opener, `Escape` skips events an inner menu already `preventDefault`ed, and one open/close timer so quick toggles never race
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
