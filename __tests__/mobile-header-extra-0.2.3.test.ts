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
* @name: Mobile header extra row (0.2.3)
* @file: __tests__/mobile-header-extra-0.2.3.test.ts
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
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// 📁 CSS without comments
const read = (f: string) => readFileSync(join(__dirname, '..', f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // 🧹

// ➕ Joseph (Welcome 0.2.21): AbMobileHeader `row` (a counter row) under the 56px bar must not be clipped
describe('➕ mobileHeader="main" grows for an extra row (Joseph, Welcome 0.2.21)', () => {
  for (const f of ['ab-app-layout/styles.module.css', 'server/ab-app-layout/styles.module.css']) {
    it(`${f}: below 768px, a main header holding [data-ab-header-extra] is auto height with a 56px floor`, () => {
      const css = read(f) // 📄
      const block = css.slice(css.indexOf('@media (max-width: 767px) {\n  .abAppLayout[data-variant="panes"][data-mobile-header="main"]')) // 📱
      expect(block).toMatch(/\[data-mobile-header="main"\] \[data-ab-part="main-header"\]:has\(\[data-ab-header-extra\]\) \{\s*height: auto; min-height: calc\(56px \+ env\(safe-area-inset-top, 0px\)\);/) // 📏
      expect(css).toMatch(/height: calc\(56px \+ env\(safe-area-inset-top, 0px\)\); padding-top/) // 🧱 the plain bar is still 56px
    })
  }
  for (const f of ['ab-app-layout/styles.module.css', 'server/ab-app-layout/styles.module.css']) {
    it(`${f}: a compact header (data-ab-header-size="compact") is 48px, or auto with a 48px floor when it has a row`, () => {
      const css = read(f) // 📄
      expect(css).toMatch(/:has\(\[data-ab-header-size="compact"\]\) \{\s*height: calc\(48px \+ env\(safe-area-inset-top, 0px\)\);/) // 📏
      expect(css).toMatch(/:has\(\[data-ab-header-size="compact"\]\):has\(\[data-ab-header-extra\]\) \{\s*height: auto; min-height: calc\(48px/) // ➕
    })
  }
})
