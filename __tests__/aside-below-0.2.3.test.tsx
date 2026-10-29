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
    expect(block).toMatch(/max-height: var\(--ab-aside-below-max-height, 60dvh\)/) // 📏
  })
  it('CSS: the laptop rules (≥ 1180px) are untouched: the rule only lives under width < 1180px', () => {
    const before = css.slice(0, css.indexOf('@media (width < 1180px)')) // ✂️
    expect(before).not.toMatch(/data-aside-below/) // 🧱
  })
})
