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
* @name: Pane dividers = the header hairline (0.2.2)
* @file: __tests__/panes-dividers-0.2.2.test.ts
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
// 📐 the body of one @media block
const media = (css: string, q: string) => { const i = css.lastIndexOf(q); if (i < 0) return ''; let d = 0, j = css.indexOf('{', i); const s = j; for (; j < css.length; j++) { if (css[j] === '{') d++; else if (css[j] === '}' && --d === 0) break } return css.slice(s, j) } // ✂️
const FILES = ['ab-app-layout/styles.module.css', 'server/ab-app-layout/styles.module.css'] // 🖥️ client + server twins

describe('➖ pane dividers (God 02:44)', () => {
  for (const f of FILES) {
    it(`${f}: --ab-pane-divider is the compact header's border (1px · --ab-color-div)`, () => {
      const css = read(f) // 📄
      expect(css).toMatch(/--ab-pane-divider: 1px solid var\(--ab-color-div, rgb\(92 64 48 \/ 0\.11\)\);/) // 🎨 same as AbAppBar compact
    })
    it(`${f}: the sidebar's right and the aside's left border both use it`, () => {
      const css = read(f) // 📄
      expect(css).toMatch(/border-left: var\(--ab-pane-divider\);/) // ⬅️ aside
      expect(media(css, '@media (min-width: 1180px)')).toMatch(/border-right: var\(--ab-pane-divider\);/) // ➡️ sidebar
      expect(css).not.toMatch(/--ab-divider-hairline, 1px solid rgb\(0 0 0/) // 🚫 the old dark 12% hairline
    })
  }
})

describe('📟 tablet sidebar divider (mock 06)', () => {
  for (const f of FILES) it(`${f}: 768–1179 sidebar has the same right hairline`, () => {
    expect(read(f)).toMatch(/transition: width var\(--ab-rail-duration\) ease;\s*border-right: var\(--ab-pane-divider\);/) // ➖
  })
})
