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
* @name: First-item ≥1536px reset (0.2.3)
* @file: __tests__/first-item-reset-0.2.3.test.ts
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
const FILES = ['ab-app-layout/styles.module.css', 'server/ab-app-layout/styles.module.css'] // 🖥️ client + server twins

// 🎠 Joseph (Welcome 0.2.21): an <AbCarousel> wrapping <main> is the row's first item with no data-ab-part,
// so the legacy ≥1536px `> *:nth-child(1)` margins hit it. The app needed `.app .carousel:first-child`.
describe('🧹 ≥1536px auto-margin reset for ANY first item (Joseph, Welcome 0.2.21)', () => {
  for (const f of FILES) {
    it(`${f}: the panes row resets margin / radius / max-height on :first-child and :nth-child(2)`, () => {
      const css = read(f) // 📄
      const m = css.match(/\.abAppLayout\[data-variant="panes"\] \.abAppLayout__contentWrapper > :is\(:first-child, :nth-child\(2\)\) \{([^}]*)\}/) // 🔎
      expect(m).not.toBeNull() // ✅ the rule exists
      expect(m![1]).toMatch(/margin: 0;/) // 🧹 auto / 1.5rem margins
      expect(m![1]).toMatch(/border-radius: 0;/) // 🧹 radius
      expect(m![1]).toMatch(/max-height: none;/) // 🧹 100vh cap
    })
    it(`${f}: the reset sits before the 1920 gapped rule, so the panes keep their 20px radius there`, () => {
      const css = read(f) // 📄
      const reset = css.indexOf(':is(:first-child, :nth-child(2))') // 📍
      const gapped = css.indexOf('border-radius: var(--ab-pane-radius, 20px)') // 📍
      expect(reset).toBeGreaterThan(-1) // ✅
      expect(gapped).toBeGreaterThan(reset) // ⬇️ same specificity, later wins
    })
  }
})
