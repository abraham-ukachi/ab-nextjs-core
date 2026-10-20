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
