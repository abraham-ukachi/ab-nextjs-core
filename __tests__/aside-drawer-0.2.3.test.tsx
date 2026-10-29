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
* @name: Aside drawer tests (0.2.3)
* @file: __tests__/aside-drawer-0.2.3.test.tsx
* @type: Vitest
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🧪 vitest
import { describe, expect, it, vi } from 'vitest'
import { createElement, type ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbAppLayout from '../ab-app-layout'
import ServerAbAppLayout from '../server/ab-app-layout'
import AbAsideLayout, { shouldCloseAbAsideOnSwipe } from '../ab-aside-layout'
import AbAsideDrawerTrigger from '../ab-aside-drawer-trigger'
import { AbPageProvider, useAbAsideDrawer, type AbAsideDrawer } from '../ab-page-provider'

// 🎨 shipped CSS (client + server twin), comments stripped
const read = (f: string) => readFileSync(join(__dirname, '..', f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
const css = read('ab-app-layout/styles.module.css')
const serverCss = read('server/ab-app-layout/styles.module.css')
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'))
const main = createElement('main', { 'data-ab-part': 'main' }, 'docs')

describe('📱 God 02:45: asideDrawerAt="mobile" (right drawer < 768, inline-in-main 768–1179)', () => {
  for (const [name, C] of [['client', AbAppLayout], ['server', ServerAbAppLayout]] as const) {
    it(`${name}: sets data-aside-drawer-at="mobile" next to inline-in-main; none by default`, () => {
      const h = renderToStaticMarkup(createElement(C, { orientation: 'horizontal', variant: 'panes', asideBelow: 'inline-in-main', asideDrawerAt: 'mobile' }, main))
      expect(h).toMatch(/data-aside-below="inline-in-main"/); expect(h).toMatch(/data-aside-drawer-at="mobile"/) // ✅
      expect(renderToStaticMarkup(createElement(C, { orientation: 'horizontal', variant: 'panes' }, main))).not.toMatch(/data-aside-drawer-at/) // 🫥
    })
  }
  for (const [f, c] of [['client', css], ['server', serverCss]] as const) {
    it(`${f} CSS: inline order only from 768px with the drawer; a right drawer + scrim below 768px`, () => {
      expect(c).toMatch(/\[data-aside-below="inline-in-main"\]:not\(\[data-aside-drawer-at="mobile"\]\) \.abAppLayout__contentWrapper \{[^}]*overflow-y: auto;/) // 📜 unchanged without it
      const tablet = c.slice(c.indexOf('@media (width >= 768px) and (width < 1180px) {', c.indexOf('drawer-at'))) // 📟
      expect(tablet).toMatch(/\[data-aside-below="inline-in-main"\]\[data-aside-drawer-at="mobile"\] \.abAppLayout__contentWrapper > \[data-ab-part="aside"\] \{\s*order: 3;/) // 🎠 inline at tablet
      const mobile = c.slice(c.lastIndexOf('@media (width < 768px) {')) // 📱
      expect(mobile).toMatch(/\[data-aside-drawer-at="mobile"\] \.abAppLayout__contentWrapper > \[data-ab-part="aside"\] \{\s*inset: 0 0 0 auto;/) // ➡️ right
      expect(mobile).toMatch(/aside-backdrop"\]\[data-open="true"\] \{\s*display: block;/) // 🌫️
      expect(c).toMatch(/\[data-ab-part="aside-drawer-trigger"\]\[data-at="mobile"\]\) \{ display: none; \}/) // 🙈 trigger hidden ≥ 768
    })
  }
  it('closed on mobile = out of the page flow (the base sheet rule hides it until data-open-on-mobile)', () => {
    expect(css).toMatch(/> \[data-ab-part="aside"\]:not\(\[data-open-on-mobile="true"\]\) \{\s*display: none;/) // 🙈
  })
})

describe('👉 swipe close + ♿ dialog', () => {
  it('shouldCloseAbAsideOnSwipe: ≥ 60px right and mostly horizontal', () => {
    expect(shouldCloseAbAsideOnSwipe(80, 10)).toBe(true) // ✅
    expect(shouldCloseAbAsideOnSwipe(40, 0)).toBe(false); expect(shouldCloseAbAsideOnSwipe(-90, 0)).toBe(false) // 🙅 short / left
    expect(shouldCloseAbAsideOnSwipe(80, 70)).toBe(false) // 🙅 a vertical scroll
  })
  it('the aside is a named landmark while closed (no dialog role until the drawer opens)', () => {
    const h = renderToStaticMarkup(createElement(AbPageProvider, null, createElement(AbAsideLayout as never, { orientation: 'vertical', 'aria-label': 'Live Playground' })))
    expect(h).toMatch(/<aside[^>]*aria-label="Live Playground"/); expect(h).not.toMatch(/role="dialog"/) // 🏷️
    const src = readFileSync(join(__dirname, '..', 'ab-aside-layout/index.tsx'), 'utf8') // 📄
    expect(src).toMatch(/role=\{isAsideOpenOnMobile \? 'dialog' : undefined\}/); expect(src).toMatch(/aria-modal=\{isAsideOpenOnMobile \? true : undefined\}/) // ♿
  })
})

describe('🔘 AbAsideDrawerTrigger + useAbAsideDrawer', () => {
  it('renders a button with aria-haspopup/expanded/controls and data-at="mobile"', () => {
    const h = renderToStaticMarkup(createElement(AbPageProvider, { asideId: 'pg' }, createElement(AbAsideDrawerTrigger, null, 'Show playground')))
    expect(h).toMatch(/<button type="button" class="AbAsideDrawerTrigger" data-ab-part="aside-drawer-trigger" data-at="mobile" aria-haspopup="dialog" aria-expanded="false" aria-controls="pg">Show playground<\/button>/) // ✅
  })
  it('onClick focuses the opener first (focus-return target), then opens', () => {
    let d: AbAsideDrawer | undefined
    const Probe = (): ReactElement => { d = useAbAsideDrawer(); return createElement('i') }
    renderToStaticMarkup(createElement(Probe))
    const focus = vi.fn(); d!.props.onClick({ currentTarget: { focus } }) // 🖱️
    expect(focus).toHaveBeenCalledWith({ preventScroll: true }); expect(d!.isOpen).toBe(false) // 🎯
  })
  it('ships: exports + files', () => {
    expect(pkg.exports['./ab-aside-drawer-trigger']).toBe('./ab-aside-drawer-trigger/index.tsx'); expect(pkg.files).toContain('ab-aside-drawer-trigger') // 📦
  })
})
