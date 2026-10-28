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
* @name: Focusable main scroller (0.2.3)
* @file: __tests__/main-scroller-focus-0.2.3.test.tsx
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
import AbMainLayout from '../ab-main-layout'

// 📁 CSS without comments
const read = (f: string) => readFileSync(join(__dirname, '..', f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // 🧹
// 🔎 the main scroller's opening tag
const scroller = (html: string) => html.match(/<div[^>]*data-ab-part="main-content"[^>]*>/)?.[0] ?? '' // ✂️

describe('⌨️ the main scroller is keyboard-focusable (Joseph, Welcome 0.2.21)', () => {
  it('is a named tab stop by default (tabIndex 0, role region, aria-label "Main content")', () => {
    const tag = scroller(renderToStaticMarkup(<AbMainLayout orientation="vertical">hi</AbMainLayout>)) // 🖨️
    expect(tag).toMatch(/tabindex="0"/) // ⌨️
    expect(tag).toMatch(/role="region"/) // 🗺️
    expect(tag).toMatch(/aria-label="Main content"/) // 🏷️
  })
  it('takes a translated scrollerLabel', () => {
    const tag = scroller(renderToStaticMarkup(<AbMainLayout orientation="vertical" scrollerLabel="Contenu principal">hi</AbMainLayout>)) // 🇫🇷
    expect(tag).toMatch(/aria-label="Contenu principal"/) // 🏷️
  })
  it('scrollerFocusable={false} drops the tab stop, the role and the label', () => {
    const tag = scroller(renderToStaticMarkup(<AbMainLayout orientation="vertical" scrollerFocusable={false}>hi</AbMainLayout>)) // 🚫
    expect(tag).not.toMatch(/tabindex|role=|aria-label/) // 🙈
  })
  it('the server twin has the same props and attributes', () => {
    const src = readFileSync(join(__dirname, '..', 'server/ab-main-layout/index.tsx'), 'utf8') // 📄
    expect(src).toMatch(/scrollerLabel = 'Main content'/) // 🏷️
    expect(src).toMatch(/tabIndex=\{scrollerFocusable \? 0 : undefined\}/) // ⌨️
  })
  for (const f of ['ab-main-layout/styles.module.css', 'server/ab-main-layout/styles.module.css']) {
    it(`${f}: a :focus-visible ring from the focus tokens, none for mouse focus`, () => {
      const css = read(f) // 📄
      expect(css).toMatch(/\.abMainLayout__contentWrapper:focus \{ outline: none; \}/) // 🖱️
      expect(css).toMatch(/\.abMainLayout__contentWrapper:focus-visible \{\s*outline: var\(--ab-focus-ring-width, 2px\) solid var\(--ab-focus-ring,/) // 💍
    })
  }
})
