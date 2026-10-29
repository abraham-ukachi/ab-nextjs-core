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
* @name: AbDottedSurface (0.2.3)
* @file: __tests__/dotted-surface-0.2.3.test.tsx
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
import AbDottedSurface from '../ab-dotted-surface'

const root = join(__dirname, '..')
const css = readFileSync(join(root, 'ab-dotted-surface/styles.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // 🧹
const src = readFileSync(join(root, 'ab-dotted-surface/index.tsx'), 'utf8')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

describe('🟤 AbDottedSurface', () => {
  it('renders data-ab-surface="dotted", the tag, extra attrs and the children', () => {
    const html = renderToStaticMarkup(createElement(AbDottedSurface, { as: 'section', 'aria-label': 'Playground' }, 'hi'))
    expect(html).toMatch(/^<section[^>]*data-ab-surface="dotted"/) // 🏷️
    expect(html).toMatch(/aria-label="Playground"/); expect(html).toMatch(/>hi</) // 🧩
  })
  it('offsetTop / dot overrides become CSS variables; nothing set by default (theme wins)', () => {
    const html = renderToStaticMarkup(createElement(AbDottedSurface, { offsetTop: 56, dotGap: '16px' }))
    expect(html).toMatch(/--ab-dot-offset-top:56px/); expect(html).toMatch(/--ab-dot-gap:16px/) // 🎛️
    expect(renderToStaticMarkup(createElement(AbDottedSurface))).not.toMatch(/style=/) // 🫥
  })
  it('is server-compatible (no use client)', () => {
    expect(src).not.toMatch(/^['"]use client['"];?$/m) // 🖥️
  })
  it('CSS: the attribute works without the component, reads --ab-dot-* with v6 fallbacks (light + dark)', () => {
    expect(css).toMatch(/:global\(\[data-ab-surface="dotted"\]\)::before/) // 🌐
    expect(css).toMatch(/radial-gradient\(var\(--ab-dot-color, var\(--ab-dot-fallback\)\) var\(--ab-dot-size, 1\.3px\)/) // 🟤
    expect(css).toMatch(/background-size: var\(--ab-dot-gap, 20px\) var\(--ab-dot-gap, 20px\)/) // 📏
    expect(css).toMatch(/--ab-dot-fallback: rgb\(107 79 53 \/ 0\.16\)/); expect(css).toMatch(/--ab-dot-fallback: rgb\(245 235 225 \/ 0\.1\)/) // 🌞🌙
    expect(css).toMatch(/inset: var\(--ab-dot-offset-top, 0\) 0 0/) // ⬇️ header band
  })
  it('ships: in files and exports', () => {
    expect(pkg.files).toContain('ab-dotted-surface'); expect(pkg.exports['./ab-dotted-surface']).toBe('./ab-dotted-surface/index.tsx') // 📦
  })
})
