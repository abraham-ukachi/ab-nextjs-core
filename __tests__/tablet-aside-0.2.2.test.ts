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
* @name: Tablet aside = right drawer only (0.2.2)
* @file: __tests__/tablet-aside-0.2.2.test.ts
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

// 🧮 a tiny cascade: the last `display` that applies to the aside pane at width `w` (source order wins; the
//    aside rules all share one specificity shape, so order is what decides here)
type Attrs = Record<string, string | undefined> // 🏷️ the aside's data-* flags
const mq = (q: string, w: number) => q.split(',').some((part) => [...part.matchAll(/\((min|max)-width:\s*(\d+)px\)/g)].every(([, k, n]) => (k === 'min' ? w >= Number(n) : w <= Number(n)))) // 📐
const flagsOk = (sel: string, a: Attrs) => { // 🎯 [x="v"] and :not([x="v"]) on the aside compound
  const comp = sel.slice(sel.indexOf('[data-ab-part="aside"]')).split(/[\s>]/)[0] // ✂️ just the aside compound
  for (const [, neg, k, v] of comp.matchAll(/(:not\()?\[(data-[\w-]+)="([^"]*)"\]/g)) { if (k === 'data-ab-part') continue; const hit = a[k] === v; if (neg ? hit : !hit) return false } // 🚦
  return /\.abAppLayout\[data-variant="panes"\] \.abAppLayout__contentWrapper > \[data-ab-part="aside"\]/.test(sel) // ✅ the pane itself, not a descendant
}
function asideDisplay(css: string, w: number, a: Attrs): string | undefined {
  let out: string | undefined // 👀
  const walk = (src: string, on: boolean) => { // 🚶 rules + nested @media
    let i = 0
    while (i < src.length) {
      const o = src.indexOf('{', i); if (o < 0) break // 🔚
      const head = src.slice(i, o).trim(); let d = 0, j = o
      for (; j < src.length; j++) { if (src[j] === '{') d++; else if (src[j] === '}' && --d === 0) break } // 🔁 matching brace
      const body = src.slice(o + 1, j)
      if (head.startsWith('@media')) walk(body, on && mq(head.slice(6), w)) // 📐
      else if (on && head.split(/,(?![^(]*\))/).some((s) => flagsOk(s.trim(), a))) { const m = [...body.matchAll(/display:\s*([\w-]+)/g)].pop(); if (m) out = m[1] } // 🎨
      i = j + 1
    }
  }
  walk(css, true)
  return out
}
const closed: Attrs = { 'data-opened': 'true' } // 🚪 default: isAsideOpen, but no small-screen sheet
const sheet: Attrs = { 'data-opened': 'true', 'data-open-on-mobile': 'true' } // 📄 the legacy overlay flag

describe('📟 tablet + mobile: the aside is hidden (the right drawer replaces it) (God 02:47)', () => {
  for (const f of FILES) {
    const css = read(f) // 📄
    for (const w of [390, 767, 768, 1024, 1179]) it(`${f}: hidden at ${w}px`, () => expect(asideDisplay(css, w, closed)).toBe('none')) // 🙈
    for (const w of [1180, 1440, 1920]) it(`${f}: a column at ${w}px`, () => expect(asideDisplay(css, w, closed)).toBe('flex')) // 👀
    it(`${f}: closed with the »/« toggle at 1180`, () => expect(asideDisplay(css, 1180, {})).toBe('none')) // 🚪
    it(`${f}: the legacy sheet flag still overlays at 1024 (opt-in only)`, () => expect(asideDisplay(css, 1024, sheet)).not.toBe('none')) // 📄
  }
})
