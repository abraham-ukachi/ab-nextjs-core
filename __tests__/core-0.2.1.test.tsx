/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-core
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the 'Software'), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions: 
*  
* The above copyright notice and this permission notice shall be included in all 
* copies or substantial portions of the Software. 
*
* THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* @project: ab-nextjs-core
* @name: Core 0.2.1 Home fixes - Tests
* @file: __tests__/core-0.2.1.test.tsx
* @type: Vitest
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


// 🧪 vitest
import { describe, expect, it } from 'vitest'
// 📄 fs
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import AbAppLayout from '../ab-app-layout'
import ServerAbAppLayout from '../server/ab-app-layout'

// 📁 CSS without comments
const read = (f: string) => readFileSync(join(__dirname, '..', f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // 🧹

describe('main pane background 🎨 (God 00:08)', () => {
  for (const f of ['ab-main-layout/styles.module.css', 'server/ab-main-layout/styles.module.css']) {
    it(`${f} reads --ab-color-pane-main first, then the old chain`, () => {
      const css = read(f) // 📄
      expect(css).toMatch(/\.abMainLayout \{[^}]*background-color: var\(--ab-color-pane-main, var\(--color-background, var\(--surface, #ffffff\)\)\);/) // 🎨
      expect(css).not.toMatch(/(?<!pane-main, )var\(--color-background/) // 🚫 no bare --color-background left (fade gradient too)
      expect(css).toMatch(/:global\(\.dark\) \.abMainLayout,\s*:global\(\[data-theme="dark"\]\) \.abMainLayout \{\s*background-color: var\(--ab-color-pane-main, var\(--color-dark-background, var\(--surface, #0a0a0a\)\)\);/) // 🌙 dark too (#1d150f)
      expect(css).not.toMatch(/(?<!pane-main, )var\(--color-dark-background/) // 🚫
    })
  }
})

describe('tabletHeader="main" bar + sidebar logo row 📟', () => {
  for (const f of ['ab-app-layout/styles.module.css', 'server/ab-app-layout/styles.module.css']) {
    it(`${f}: the tablet main-header is --ab-header-height (60px) tall and its child fills it`, () => {
      const css = read(f) // 📄
      expect(css).toMatch(/@media \(min-width: 768px\) and \(max-width: 1179px\) \{\s*\.abAppLayout\[data-variant="panes"\]\[data-tablet-header="main"\] \[data-ab-part="main-header"\] \{ height: var\(--ab-header-height\);/) // 📏
      expect(css).toMatch(/\[data-tablet-header="main"\] \[data-ab-part="main-header"\] > \* \{ flex: 1 1 auto; min-height: 0; \}/) // 🧱
      expect(css).toMatch(/:where\(\.abAppLayout\[data-variant="panes"\]\) \{ --ab-header-height: 60px; \}/) // 🔢 60 at tablet
    })
    it(`${f}: the sidebar logo row shows only for tabletHeader="main" at 768–1179`, () => {
      const css = read(f) // 📄
      expect(css).toMatch(/\.abAppLayout\[data-variant="panes"\]:not\(\[data-tablet-header="main"\]\) \[data-ab-part="sidebar-logo"\] \{ display: none; \}/) // 🙈
      expect(css).toMatch(/@media \(max-width: 767px\), \(min-width: 1180px\) \{\s*\.abAppLayout\[data-variant="panes"\]\[data-tablet-header="main"\] \[data-ab-part="sidebar-logo"\] \{ display: none; \}/) // 🙈
    })
  }
})

describe('aside pane background 🎨 (James 00:22)', () => {
  for (const f of ['ab-aside-layout/styles.module.css', 'server/ab-aside-layout/styles.module.css']) {
    it(`${f} reads --ab-color-pane-main first in light and dark (pane + fade)`, () => {
      const css = read(f) // 📄
      expect(css.match(/var\(--ab-color-pane, var\(--ab-color-pane-main, var\(--color-background, var\(--surface, #ffffff\)\)\)\)/g)).toHaveLength(2) // 🌞 pane + fade (0.2.1: --ab-color-pane first)
      expect(css.match(/var\(--ab-color-pane, var\(--ab-color-pane-main, var\(--color-dark-background, var\(--surface, #0a0a0a\)\)\)\)/g)).toHaveLength(2) // 🌙 pane + fade
      expect(css).not.toMatch(/(?<!pane-main, )var\(--color-(dark-)?background/) // 🚫 no bare chain left
    })
  }
})

describe('side panes read --ab-color-pane 🪟 (God 00:41)', () => {
  for (const f of ['ab-app-layout/styles.module.css', 'server/ab-app-layout/styles.module.css']) {
    it(`${f}: sidebar / rail = var(--ab-color-pane, transparent) at zero specificity`, () => {
      expect(read(f)).toMatch(/:where\(\.abAppLayout\[data-variant="panes"\] \.abAppLayout__contentWrapper > :is\(\[data-ab-part="sidebar"\], \[data-ab-part="rail"\]\)\) \{\s*background-color: var\(--ab-color-pane, transparent\);\s*\}/) // 🪟
    })
  }
})

describe('aside column reads --ab-color-pane at ≥ 1180 🪟', () => {
  for (const f of ['ab-app-layout/styles.module.css', 'server/ab-app-layout/styles.module.css']) {
    it(`${f}: background: var(--ab-color-pane, none) (unset = the old transparent column)`, () => {
      const css = read(f) // 📄
      expect(css).toMatch(/> \[data-ab-part="aside"\] \{[^}]*z-index: auto;\s*background: var\(--ab-color-pane, none\);/) // 🪟
      expect(css).not.toMatch(/> \[data-ab-part="aside"\] \{[^}]*background: none;/) // 🚫
    })
  }
})

// 🚫 James P2 (round 3): AbAsideLayout has no CSS transition (no-transitions rule; motion comes from ab-nextjs-animations)
describe('AbAsideLayout: no transition', () => {
  for (const f of ['ab-aside-layout/styles.module.css', 'server/ab-aside-layout/styles.module.css']) {
    it(`${f}: no transition-property / transition-duration`, () => {
      const css = read(f) // 📄
      expect(css).not.toMatch(/transition-property:/) // 🚫 all
      expect(css).not.toMatch(/transition-duration:/) // 🚫 300ms
    })
  }
})

// 📱 drawers v2 (God 01:22): mobileHeader="main" = the mainHeader is the 56px mobile bar, the app header is hidden < 768
describe('AbAppLayout mobileHeader', () => {
  for (const [name, C] of [['client', AbAppLayout], ['server', ServerAbAppLayout]] as const) {
    it(`${name}: data-mobile-header="main" only when asked`, () => {
      const on = renderToStaticMarkup(<C orientation="vertical" variant="panes" mobileHeader="main" header={<i>bar</i>} />)
      expect(on).toContain('data-mobile-header="main"') // 📱
      const off = renderToStaticMarkup(<C orientation="vertical" variant="panes" header={<i>bar</i>} />)
      expect(off).not.toContain('data-mobile-header') // 🧹 default unchanged
    })
  }
  for (const f of ['ab-app-layout/styles.module.css', 'server/ab-app-layout/styles.module.css']) {
    it(`${f}: < 768 hides the header row and makes main-header 56px with a divider; ≥ 768 hides it`, () => {
      const css = read(f).replace(/\/\*[\s\S]*?\*\//g, '') // 🧹
      const m = /@media \((?:max-width: 767px|width <= 767px)\) \{\s*\.abAppLayout\[data-variant="panes"\]\[data-mobile-header="main"\] > \.abAppLayout__headerWrapper \{ display: none; \}([\s\S]*?)\n\}/.exec(css)
      expect(m, 'mobile block').not.toBeNull()
      expect(m![1]).toMatch(/height: calc\(56px \+ env\(safe-area-inset-top, 0px\)\)/) // 📏
      expect(m![1]).toMatch(/border-bottom: 1px solid var\(--ab-color-border/) // ➖
      expect(css).toMatch(/\[data-mobile-header="main"\]:not\(\[data-tablet-header="main"\]\) \[data-ab-part="main-header"\] \{ display: none; \}/) // 🙈 ≥ 768
      expect(css).toMatch(/\[data-tablet-header="main"\]:not\(\[data-mobile-header="main"\]\) \[data-ab-part="main-header"\] \{ display: none; \}/) // 📟 tablet-only stays tablet-only
    })
  }
})
