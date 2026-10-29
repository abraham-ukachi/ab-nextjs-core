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
* @name: AbAppLayout asideBelow (0.2.3)
* @file: __tests__/aside-below-0.2.3.test.tsx
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
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbAppLayout from '../ab-app-layout'
import ServerAbAppLayout from '../server/ab-app-layout'

// 🎨 the shipped CSS without comments
const css = readFileSync(join(__dirname, '..', 'ab-app-layout/styles.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
// 📑 a panes layout with ONE aside
const aside = createElement('aside', { 'data-ab-part': 'aside', id: 'pg' }, 'Live Playground')
const main = createElement('main', { 'data-ab-part': 'main' }, 'docs')

describe('📑 AbAppLayout asideBelow', () => {
  for (const [name, C] of [['client', AbAppLayout], ['server', ServerAbAppLayout]] as const) {
    it(`${name}: 'inline-before-main' sets data-aside-below and renders the aside ONCE`, () => {
      const html = renderToStaticMarkup(createElement(C, { orientation: 'horizontal', variant: 'panes', asideBelow: 'inline-before-main' }, main, aside))
      expect(html).toMatch(/data-aside-below="inline-before-main"/) // 🏷️
      expect(html.match(/Live Playground/g)).toHaveLength(1) // 1️⃣ no duplicate
    })
    it(`${name}: default 'hidden' leaves no attribute (the right drawer behaviour)`, () => {
      expect(renderToStaticMarkup(createElement(C, { orientation: 'horizontal', variant: 'panes' }, main, aside))).not.toMatch(/data-aside-below/) // 🫥
    })
  }
  it('CSS: below 1180px the aside is in the flow (row 1) above main (row 2), shown even when closed', () => {
    const block = css.slice(css.indexOf('@media (width < 1180px)')) // 🔍
    expect(block).toMatch(/\[data-aside-below="inline-before-main"\][^{]*> \[data-ab-part="aside"\] \{[^}]*display: flex !important;[^}]*position: relative;[^}]*grid-row: 1;/) // ⬆️
    expect(block).toMatch(/> \[data-ab-part="main"\] \{\s*grid-row: 2;/) // 📄
    expect(block).toMatch(/aside-backdrop"\] \{\s*display: none;/) // 🙈
    expect(block).toMatch(/> \[data-ab-part="aside-content"\] \{\s*flex: 0 1 auto;/) // 📏 consumer shot: not a 0px scroller
    expect(block).toMatch(/min-width: 0;/) // ↔️ never wider than the phone (grid min-content)
    expect(block).toMatch(/max-height: var\(--ab-aside-below-max-height, 60dvh\)/) // 📏
  })
  it('CSS: the laptop rules (≥ 1180px) are untouched: the rule only lives under width < 1180px', () => {
    const before = css.slice(0, css.indexOf('@media (width < 1180px)')) // ✂️
    expect(before).not.toMatch(/data-aside-below/) // 🧱
  })
})

// 📜 Joseph 02:35: asideBelow="inline-in-main" + AbMainLayout asideAnchor (v6 phone: header · counter · scene · text · nav)
import AbMainLayout from '../ab-main-layout'
import ServerAbMainLayout from '../server/ab-main-layout'
describe('📜 AbAppLayout asideBelow="inline-in-main" + AbMainLayout asideAnchor', () => {
  const inMain = css.slice(css.lastIndexOf('@media (width < 1180px)')) // 🔍 the inline-in-main block
  const serverCss = readFileSync(join(__dirname, '..', 'server/ab-app-layout/styles.module.css'), 'utf8') // 🖥️
  it('the server twin ships both asideBelow blocks', () => { expect(serverCss).toContain('[data-aside-below="inline-in-main"]'); expect(serverCss).toContain('[data-aside-below="inline-before-main"]') }) // 🪞
  for (const [name, C, M] of [['client', AbAppLayout, AbMainLayout], ['server', ServerAbAppLayout, ServerAbMainLayout]] as const) {
    it(`${name}: sets data-aside-below="inline-in-main" and still renders the aside ONCE`, () => {
      const html = renderToStaticMarkup(createElement(C, { orientation: 'horizontal', variant: 'panes', asideBelow: 'inline-in-main' }, main, aside))
      expect(html).toMatch(/data-aside-below="inline-in-main"/); expect(html.match(/Live Playground/g)).toHaveLength(1) // 1️⃣
    })
    it(`${name}: asideAnchor renders first in the scroller, before the children`, () => {
      const html = renderToStaticMarkup(createElement(M, { mainHeader: 'bar', asideAnchor: '2 / 9' } as never, 'text'))
      expect(html).toMatch(/data-ab-part="main-content"[^>]*>(<span hidden="" data-ab-part="scroll-registrar"><\/span>)?<div data-ab-part="aside-anchor">2 \/ 9<\/div>text</) // ⚓
      expect(renderToStaticMarkup(createElement(M, {} as never, 'text'))).not.toMatch(/aside-anchor/) // 🫥 none by default
    })
  }
  it('CSS: one scroller, main dissolved, order header 1 · anchor 2 · aside 3 · content 4, nothing pinned', () => {
    expect(inMain).toMatch(/\[data-aside-below="inline-in-main"\] \.abAppLayout__contentWrapper \{[^}]*overflow-y: auto;/) // 📜
    expect(inMain).toMatch(/> \[data-ab-part="main-content"\] \{\s*display: contents;/) // 🫥
    expect(inMain).toMatch(/\[data-ab-part="main-header"\] \{ order: 1;/); expect(inMain).toMatch(/\[data-ab-part="aside-anchor"\] \{ order: 2;/) // 🔝 ⚓
    expect(inMain).toMatch(/> \[data-ab-part="aside"\] \{\s*order: 3;[^}]*display: flex !important;[^}]*position: relative;/) // 🎠
    expect(inMain).toMatch(/:not\(\[data-ab-part="aside-anchor"\]\) \{ order: 4; \}/) // 📄
    expect(inMain).not.toMatch(/inline-in-main"\][^{]*aside"\] \{[^}]*position: (sticky|fixed)/) // 🚫 never pinned
  })
  it('the existing values keep working (inline-before-main rules untouched)', () => {
    expect(css).toMatch(/\[data-aside-below="inline-before-main"\][^{]*> \[data-ab-part="aside"\] \{[^}]*grid-row: 1;/) // ✅
  })
})
