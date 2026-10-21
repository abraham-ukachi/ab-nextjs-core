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
* @name: Core 0.2.0 shell - Tests
* @file: __tests__/core-0.2.0.test.tsx
* @type: Vitest
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/



import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import AbAppLayout from '../ab-app-layout'
import ServerAbAppLayout from '../server/ab-app-layout'

const read = (f: string) => readFileSync(join(__dirname, '..', f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // 🧹 no comments

describe.each(['ab-app-layout/styles.module.css', 'server/ab-app-layout/styles.module.css'])('%s 0.2.0 📐', (file) => {
  const css = read(file)
  it('pane widths + header height defaults are zero-specificity (:where) with the spec §3 values', () => {
    expect(css).toMatch(/:where\(\.abAppLayout\[data-variant="panes"\]\) \{\s*--ab-sidebar-width: 248px;\s*--ab-rail-width: 64px;\s*--ab-aside-width: 320px;[^}]*--ab-header-height: 52px;/) // 📱📟
    expect(css).toMatch(/min-width: 768px\) \{\s*:where\(\.abAppLayout\[data-variant="panes"\]\) \{ --ab-header-height: 60px; \}/) // 📟
    expect(css).toMatch(/min-width: 1180px\) \{\s*:where\(\.abAppLayout\[data-variant="panes"\]\) \{ --ab-sidebar-width: 260px; --ab-aside-width: 236px; --ab-header-height: 60px; \}/) // 💻
    expect(css).toMatch(/min-width: 1920px\) \{\s*:where\(\.abAppLayout\[data-variant="panes"\]\) \{ --ab-sidebar-width: 288px; --ab-aside-width: 272px; --ab-header-height: 64px; \}/) // 🖥️
    expect(css).not.toMatch(/^\.abAppLayout\[data-variant="panes"\] \{[^}]*--ab-sidebar-width/m) // 🙅 no specific default left
    expect(css).toMatch(/__headerWrapper \{ height: calc\(var\(--ab-header-height\) \+ env\(safe-area-inset-top, 0px\)\);/) // 🔝
  })
  it('tabletHeader="main": app header 0px at 768–1179, main-header hidden elsewhere', () => {
    expect(css).toMatch(/@media \(min-width: 768px\) and \(max-width: 1179px\) \{\s*\.abAppLayout\[data-variant="panes"\]\[data-tablet-header="main"\] > \.abAppLayout__headerWrapper \{ display: none; \}/)
    // 📐 0.2.1 split: ≥1180 always hidden; ≤767 hidden unless mobileHeader="main" reuses the bar
    expect(css).toMatch(/@media \(min-width: 1180px\) \{\s*\.abAppLayout\[data-variant="panes"\]\[data-tablet-header="main"\] \[data-ab-part="main-header"\] \{ display: none; \}/)
    expect(css).toMatch(/@media \(max-width: 767px\) \{\s*(\/\*[^*]*\*\/\s*)?\.abAppLayout\[data-variant="panes"\]\[data-tablet-header="main"\]:not\(\[data-mobile-header="main"\]\) \[data-ab-part="main-header"\] \{ display: none; \}/)
  })
  it('--ab-pane-shadow is the mock shadow in light, none in dark', () => {
    expect(css).toMatch(/--ab-pane-shadow: 0 1px 2px rgb\(33 26 22 \/ 0\.04\), 0 8px 28px rgb\(92 64 48 \/ 0\.06\);/)
    expect(css).toMatch(/:where\(:global\(\.dark\), \[data-theme="dark"\]\) :where\(\.abAppLayout\[data-variant="panes"\]\)[^{]*\{ --ab-pane-shadow: none; \}/)
    expect(css).toMatch(/box-shadow: var\(--ab-pane-shadow, none\);/)
  })
})

describe('AbAppLayout tabletHeader prop 📟', () => {
  it.each([['client', AbAppLayout], ['server', ServerAbAppLayout]] as const)('%s sets data-tablet-header only for "main"', (_n, L) => {
    expect(renderToStaticMarkup(<L orientation="vertical" variant="panes" tabletHeader="main" header={<b>h</b>} />)).toContain('data-tablet-header="main"')
    expect(renderToStaticMarkup(<L orientation="vertical" variant="panes" header={<b>h</b>} />)).not.toContain('data-tablet-header')
  })
})

// 📸 James's shell shots found: legacy ≥1536 margins/radius leaking into the panes, and the dark shadow ignoring body.dark
describe('0.2.0: panes ignore the legacy ≥1536 chrome; dark ancestors drop the pane shadow 🌙', () => {
  for (const f of ['ab-app-layout/styles.module.css', 'server/ab-app-layout/styles.module.css']) {
    it(f, () => {
      const css = readFileSync(join(__dirname, '..', f), 'utf8')
      expect(css).toMatch(/overscroll-behavior: contain;[\s\S]*?\}/)
      expect(css).toMatch(/max-height: none;[^\n]*\n  margin: 0;[^\n]*\n  border-radius: 0;/) // 🧹
      expect(css).toContain(':where(:global(.dark), [data-theme="dark"]) :where(.abAppLayout[data-variant="panes"]),') // 🌙 body.dark (unhashed: CSS modules would rename a bare .dark)
      expect(css).not.toMatch(/:where\(\.dark/) // 🚫 a bare .dark is hashed by CSS modules and never matches
    })
  }
})
