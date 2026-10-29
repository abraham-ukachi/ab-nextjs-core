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
* @name: Main header above the main scroller (0.2.3)
* @file: __tests__/main-header-z-0.2.3.test.ts
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
const zOf = (s: string) => Number(/var\(--ab-main-header-z, (\d+)\)/.exec(s)?.[1] ?? /z-index: (\d+)/.exec(s)?.[1]) // 🔢

// 🥞 Joseph (Welcome 0.2.21): header and scroller were both z 10 siblings → the scroller (later) painted over the
//    no-JS <details> language list dropping out of the header, so it couldn't be clicked
describe('🥞 the main header stays above the main scroller', () => {
  const scrollerZ = zOf(read('ab-main-layout/styles.module.css').match(/\.abMainLayout__contentWrapper \{[^}]*\}/)![0]) // 📜 10
  for (const f of ['ab-app-layout/styles.module.css', 'server/ab-app-layout/styles.module.css']) {
    it(`${f}: mobileHeader="main" bar uses --ab-main-header-z (default 11 > scroller ${scrollerZ}, < scrim 20)`, () => {
      const css = read(f) // 📄
      const bar = css.match(/\[data-mobile-header="main"\] \[data-ab-part="main-header"\] \{[^}]*\}/)![0] // 📱
      expect(bar).toMatch(/position: relative; z-index: var\(--ab-main-header-z, 11\);/) // 🥞
      expect(zOf(bar)).toBeGreaterThan(scrollerZ); expect(zOf(bar)).toBeLessThan(20) // ⬆️ ⬇️
    })
    it(`${f}: mainHeaderAt="all" (≥768px) does the same`, () => {
      const css = read(f) // 📄
      const all = css.match(/\[data-main-header-at="all"\] \[data-ab-part="main-header"\] \{[^}]*\}/)![0] // 📌
      expect(all).toMatch(/position: relative; z-index: var\(--ab-main-header-z, 11\);/) // 🥞
    })
  }
  it('the scroller is still z 10 in both twins', () => {
    for (const f of ['ab-main-layout/styles.module.css', 'server/ab-main-layout/styles.module.css']) expect(zOf(read(f).match(/\.abMainLayout__contentWrapper \{[^}]*\}/)![0])).toBe(10) // 📜
  })
})
