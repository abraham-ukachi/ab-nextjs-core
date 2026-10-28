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
* @name: mainHeaderAt="all" (0.2.3)
* @file: __tests__/main-header-at-0.2.3.test.tsx
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
import { renderToStaticMarkup } from 'react-dom/server'
import AbAppLayout from '../ab-app-layout'

// 📁 CSS without comments
const read = (f: string) => readFileSync(join(__dirname, '..', f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // 🧹

// 📌 Joseph (Welcome 0.2.21): with mobileHeader="main" the counter row rendered twice (main header < 768, app header ≥ 768)
describe('📌 mainHeaderAt="all": one main header at every width', () => {
  it('sets data-main-header-at="all" only when asked', () => {
    expect(renderToStaticMarkup(<AbAppLayout orientation="vertical" variant="panes" mobileHeader="main" mainHeaderAt="all" />)).toMatch(/data-main-header-at="all"/) // ✅
    expect(renderToStaticMarkup(<AbAppLayout orientation="vertical" variant="panes" mobileHeader="main" />)).not.toMatch(/data-main-header-at/) // 🫥 default
  })
  it('the server twin has the prop', () => {
    expect(readFileSync(join(__dirname, '..', 'server/ab-app-layout/index.tsx'), 'utf8')).toMatch(/data-main-header-at=\{mainHeaderAt === 'all' \? 'all' : undefined\}/) // 🖥️
  })
  for (const f of ['ab-app-layout/styles.module.css', 'server/ab-app-layout/styles.module.css']) {
    it(`${f}: ≥768px shows the slot with a (0,5,0) rule placed after every hide rule`, () => {
      const css = read(f) // 📄
      const show = css.lastIndexOf('.abAppLayout.abAppLayout[data-variant="panes"][data-main-header-at="all"] [data-ab-part="main-header"]') // 📍
      expect(show).toBeGreaterThan(-1)
      expect(css.slice(show)).toMatch(/^[^{]*\{\s*display: flex; flex-direction: column; flex: none;/) // 👀
      expect(css.lastIndexOf('[data-ab-part="main-header"] { display: none; }')).toBeLessThan(show) // ⬇️ later wins
      expect(css.slice(0, show)).toMatch(/@media \(width >= 768px\) \{\s*$/) // 📐 768px and up
    })
  }
})
