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
* @name: mainBarPin (God 04:16)
* @file: __tests__/main-bar-pin-0.2.3.test.tsx
* @type: Vitest
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/
// 🧪 0.2.3 (God 04:16): mainBarPin — client + server, props → data-*, CSS tokens, sticky in the one scroller.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import ClientMain from '../ab-main-layout'
import ServerMain from '../server/ab-main-layout'
import ClientApp from '../ab-app-layout'
import ServerApp from '../server/ab-app-layout'

const read = (f: string) => readFileSync(join(__dirname, '..', f), 'utf8') // 📄

describe('AbMainLayout mainBarPin / mainBarLabel 📌', () => {
  for (const [name, M] of [['client', ClientMain], ['server', ServerMain]] as const) {
    it(`${name}: default never, 'always' + label on the <footer> inside <main>, height island`, () => {
      const def = renderToStaticMarkup(createElement(M as any, { orientation: 'vertical', mainBar: 'bar' }))
      expect(def).toContain('data-main-bar-pin="never"')
      const on = renderToStaticMarkup(createElement(M as any, { orientation: 'vertical', mainBar: 'bar', mainBarPin: 'always', mainBarLabel: 'Slide controls' }))
      expect(on).toMatch(/<main[^>]*>[\s\S]*<footer[^>]*data-ab-part="main-bar"[^>]*data-main-bar-pin="always"[^>]*aria-label="Slide controls"[\s\S]*<\/footer>[\s\S]*<\/main>/) // 🔚
      expect(on).toContain('data-ab-part="main-bar-height"') // 📏
    })
  }
  for (const [name, A] of [['client', ClientApp], ['server', ServerApp]] as const) it(`${name} AbAppLayout mirrors data-main-bar-pin on the root`, () => {
    expect(renderToStaticMarkup(createElement(A as any, { orientation: 'vertical', mainBarPin: 'always' }))).toMatch(/class="AbAppLayout[^"]*"[^>]*data-main-bar-pin="always"|data-main-bar-pin="always"[^>]*class="AbAppLayout/)
    expect(renderToStaticMarkup(createElement(A as any, { orientation: 'vertical' }))).not.toContain('data-main-bar-pin')
  })
})

describe('main bar CSS 🎨', () => {
  for (const f of ['ab-main-layout/styles.module.css', 'server/ab-main-layout/styles.module.css']) it(f, () => {
    const css = read(f)
    for (const t of ['position: sticky; bottom: 0;', 'z-index: var(--ab-main-bar-z, 20)', 'var(--ab-main-bar-bg, var(--ab-color-pane-main', 'var(--ab-main-bar-divider,', 'var(--ab-main-bar-shadow, none)',
      'calc(var(--ab-main-bar-padding-block, 12px) + env(safe-area-inset-bottom, 0px))', 'var(--ab-main-bar-padding-inline, 16px)', 'padding-inline: var(--ab-main-bar-padding-inline, 32px)', 'var(--ab-main-bar-max-width, none)',
      ':global(.AbAppLayout[data-main-bar-pin="always"]) .abMainLayout__footerWrapper', 'scroll-padding-bottom: var(--ab-main-bar-h, 0px)']) expect(css).toContain(t)
  })
  for (const f of ['ab-app-layout/styles.module.css', 'server/ab-app-layout/styles.module.css']) it(`${f}: order 5 kept + scroll-padding on the one scroller`, () => {
    const css = read(f)
    expect(css).toContain('[data-ab-part="main"] > [data-ab-part="main-bar"] { order: 5; }')
    expect(css).toMatch(/:has\(\[data-ab-part="main-bar"\]\[data-main-bar-pin="always"\]\)\) :is\(\.abAppLayout__contentWrapper, \[data-ab-part="main-content"\]\) \{\s*scroll-padding-bottom: var\(--ab-main-bar-h, 0px\)/)
  })
  it('bar z (20) stays under the drawer z (120)', () => { expect(read('ab-app-layout/styles.module.css')).toContain('var(--ab-aside-drawer-z, 120)') })
})
