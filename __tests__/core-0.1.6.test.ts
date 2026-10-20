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
// ⏱️ pure helper + constants under test
import { AB_ASIDE_DURATION, AB_ASIDE_SHEET_QUERY, getAbAsideDuration } from '../ab-page-provider'

// 📁 package root
const root = join(import.meta.dirname, '..')
const read = (rel: string) => readFileSync(join(root, rel), 'utf8') // 📄
const strip = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '') // 🧹
// 🔎 the body of the LAST @media block that starts with `query` (the 0.1.6 panes come after the legacy rules)
const media = (css: string, query: string) => { const i = css.lastIndexOf(query); expect(i, query).toBeGreaterThan(-1); let d = 0; for (let j = css.indexOf('{', i); j < css.length; j++) { if (css[j] === '{') d++; if (css[j] === '}' && --d === 0) return css.slice(i, j) } return '' }

describe('G17: four-breakpoint panes 🧭', () => {
  for (const file of ['ab-app-layout/styles.module.css', 'server/ab-app-layout/styles.module.css']) {
    const css = strip(read(file))
    it(`${file}: mobile hides the sidebar, shows the bottom bar, aside is a closed sheet`, () => {
      expect(css).toMatch(/\[data-variant="panes"\] \.abAppLayout__contentWrapper > :is\(\[data-ab-part="sidebar"\], \[data-ab-part="rail"\]\) \{\s*display: none/) // 🙈
      expect(css).toMatch(/\[data-ab-part="aside"\]:not\(\[data-open-on-mobile="true"\]\) \{\s*display: none/) // 📄
      expect(css).toMatch(/env\(safe-area-inset-bottom/) // 📱
    })
    it(`${file}: tablet = sidebar or rail + overlay aside, no bottom bar`, () => {
      const t = media(css, '@media (min-width: 768px)')
      expect(t).toMatch(/width: var\(--ab-sidebar-width\)/) // 🗂️
      expect(t).toMatch(/\[data-rail="true"\][^{]*\{\s*width: var\(--ab-rail-width\)/) // 🧷
      expect(t).toMatch(/\[data-ab-part="bottomBar"\] \{\s*display: none/) // 🙈
      expect(t).toMatch(/inset: 0 0 0 auto;\s*width: var\(--ab-aside-width\)/) // ➡️ overlay
    })
    it(`${file}: laptop joined with hairlines, desktop gapped with radii`, () => {
      expect(media(css, '@media (min-width: 1024px)')).toMatch(/border-right: var\(--ab-divider-hairline/) // ➖
      const d = media(css, '@media (min-width: 1440px)')
      expect(d).toMatch(/gap: var\(--ab-pane-gap, 12px\)/) // 🧱
      expect(d).toMatch(/border-radius: var\(--ab-pane-radius, 16px\)/) // 🔲
      expect(d).toMatch(/border: 0/) // 🚫 dividers
    })
    it(`${file}: the rail animates 200ms, snaps under reduced motion, stays expanded without JS`, () => {
      expect(css).toMatch(/--ab-rail-duration: 200ms/) // 🎞️
      expect(media(css, '@media (prefers-reduced-motion: reduce)')).toMatch(/transition: none/) // ♿
      expect(media(css, '@media (scripting: none)')).toMatch(/width: var\(--ab-sidebar-width\)/) // 🚫 JS
    })
  }
  it('client + server AbAppLayout expose variant and railCollapsed as data attributes', () => {
    for (const f of ['ab-app-layout/index.tsx', 'server/ab-app-layout/index.tsx']) {
      const src = read(f)
      expect(src, f).toMatch(/variant\?: 'default' \| 'panes'/) // 🧭
      expect(src, f).toMatch(/data-variant=\{variant\}/)
      expect(src, f).toMatch(/data-rail=\{railCollapsed \? 'true' : 'false'\}/) // 🧷
    }
  })
})

describe('aside: slide-from-right 240ms, instant under reduced motion 🎞️', () => {
  it('the provider defaults to 240ms and drops to 0 under reduced motion', () => {
    expect(AB_ASIDE_DURATION).toBe(240) // ⏱️
    expect(getAbAsideDuration(240, false)).toBe(240)
    expect(getAbAsideDuration(240, true)).toBe(0) // ♿
    expect(getAbAsideDuration(-5, false)).toBe(0) // 🛡️
    expect(AB_ASIDE_SHEET_QUERY).toBe('(max-width: 1023px)') // 📐 mobile + tablet
  })
  it('the aside CSS sets the keyframe to 240ms and kills it under reduced motion', () => {
    const css = strip(read('ab-aside-layout/styles.module.css'))
    expect(css).toMatch(/--slide-from-right-animation-duration: 240ms/) // 🎞️ uses the animations token
    expect(media(css, '@media (prefers-reduced-motion: reduce)')).toMatch(/animation: none !important/) // ♿
  })
  it('the aside has the aria-controls id and stays visible while the sheet is open', () => {
    const src = read('ab-aside-layout/index.tsx')
    expect(src).toMatch(/id=\{id \?\? asideId\}/) // 🆔
    expect(src).toMatch(/'!hidden': !isAsideOpen && !isAsideOpenOnMobile/) // 👀
  })
  it('useAbPage gains toggleAside / toggleAsideOnMobile / asideId and useAbAsideToggle sets aria', () => {
    const src = read('ab-page-provider/index.tsx')
    for (const k of ['toggleAside: () => void', 'toggleAsideOnMobile: () => void', 'asideId: string', 'export function useAbAsideToggle']) expect(src).toContain(k)
    expect(src).toMatch(/'aria-expanded': expanded, 'aria-controls': asideId/) // ♿
    expect(src).toMatch(/e\.key !== 'Escape'/) // ⎋ closes the sheet
  })
})

// 🛠️ 0.1.6 review + integration fixes (James, Joseph)
describe('0.1.6 review fixes 🛠️', () => {
  const provider = read('ab-page-provider/index.tsx') // 📄
  it('one pending aside timer, cleared on every toggle (no races) ⏲️', () => {
    expect(provider).toMatch(/asideTimerRef/) // 💾
    expect(provider).toMatch(/window\.clearTimeout\(asideTimerRef\.current\)/) // 🛑
  })
  it('Escape respects defaultPrevented ⎋', () => {
    expect(provider).toMatch(/e\.defaultPrevented\) return/) // 🙅
  })
  it('the sheet moves focus in and returns it 🎯', () => {
    expect(provider).toMatch(/sheetOpenerRef/) // 💾
    expect(provider).toMatch(/el\.focus\(/) // 🎯
  })
  it('client aside renders a tablet backdrop, server aside sets an id 🌫️🆔', () => {
    expect(read('ab-aside-layout/index.tsx')).toMatch(/data-ab-part="aside-backdrop"/) // 🌫️
    expect(read('server/ab-aside-layout/index.tsx')).toMatch(/id=\{id \?\? 'ab-aside'\}/) // 🆔
  })
  for (const f of ['ab-main-layout/index.tsx', 'server/ab-main-layout/index.tsx', 'ab-aside-layout/index.tsx', 'server/ab-aside-layout/index.tsx']) {
    it(`${f}: accepts id and a chrome opt-out 🧰`, () => {
      const src = read(f)
      expect(src).toMatch(/id\?: string;/) // 🆔
      expect(src).toMatch(/chrome = true/) // 🧰 default unchanged
      expect(src).toMatch(/\{chrome && \(/) // 🧰 legacy layers gated
    })
  }
  it('panes never nest a <header> in the header slot 🧱', () => {
    for (const f of ['ab-app-layout/index.tsx', 'server/ab-app-layout/index.tsx']) expect(read(f)).toMatch(/variant === 'panes'[^\n]*\? 'div' : 'header'/)
  })
})

// 📏 D35 layout rule (G50–G52, G54, G55): the document never scrolls, panes scroll on their own,
//    empty chrome is 0px, no hard-coded bar height
describe('layout rule 📏', () => {
  for (const f of ['ab-app-layout/styles.module.css', 'server/ab-app-layout/styles.module.css']) {
    const css = strip(read(f))
    it(`${f}: a 100dvh box that never scrolls`, () => {
      expect(css).toMatch(/100dvh/) // 📐
      expect(css).toMatch(/minmax\(0, ?1fr\)/) // 📏
      expect(css).not.toMatch(/--ab-app-bar-height/) // 🚫 no 64px offset
      expect(css).not.toMatch(/position: sticky/) // 🚫 no sticky columns
    })
    it(`${f}: locks html/body while mounted (G54)`, () => {
      expect(css).toMatch(/html:has\(\.AbAppLayout\[data-variant="panes"\]\)/) // 🔒
      expect(css).toMatch(/html\[data-ab-layout-lock\]/) // 🔒
      expect(css).toMatch(/overscroll-behavior: none/) // 🚫 rubber band
    })
    it(`${f}: empty chrome collapses, panes are contained (G50/G51)`, () => {
      expect(css).toMatch(/:empty/) // 🫥
      expect(css).toMatch(/:not\(:has\(> \*\)\)/) // 🫥
      expect(css).toMatch(/min-height: 0/) // 📜
      expect(css).toMatch(/overscroll-behavior: contain/) // 📜
      expect(css).toMatch(/scrollbar-gutter: stable/) // 📜
      expect(css).toMatch(/env\(safe-area-inset-/) // 📱
    })
  }
  for (const f of ['ab-app-layout/styles.module.css', 'server/ab-app-layout/styles.module.css']) {
    // 🧪 WebKit e2e: with no header the panes were auto-placed into the `auto` row and measured 0px
    it(`${f}: header / panes / footer are pinned to rows 1 / 2 / 3`, () => {
      const css = strip(read(f))
      expect(css).toMatch(/__headerWrapper \{ grid-row: 1;/) // 🔝
      expect(css).toMatch(/__contentWrapper \{ grid-row: 2; \}/) // 🧱
      expect(css).toMatch(/__footerWrapper \{ grid-row: 3;/) // 🦶
    })
  }
  for (const f of ['ab-main-layout/styles.module.css', 'server/ab-main-layout/styles.module.css', 'ab-aside-layout/styles.module.css', 'server/ab-aside-layout/styles.module.css']) {
    it(`${f}: the content wrapper is the pane's scroller`, () => {
      const css = strip(read(f))
      expect(css).toMatch(/overflow: hidden auto/) // 📜
      expect(css).toMatch(/overscroll-behavior: contain/) // 📜
      expect(css).toMatch(/:empty/) // 🫥
    })
  }
  for (const f of ['ab-main-layout/index.tsx', 'server/ab-main-layout/index.tsx', 'ab-aside-layout/index.tsx', 'server/ab-aside-layout/index.tsx']) {
    it(`${f}: new slots + deprecated aliases (G52)`, () => {
      const src = read(f); const k = f.includes('main') ? 'main' : 'aside'
      expect(src).toMatch(new RegExp(`${k}Header\\?:`)) // 🔝
      expect(src).toMatch(new RegExp(`${k}Bar\\?:`)) // 🔚
      expect(src).toMatch(/@deprecated/) // 🕰️
      expect(src).toMatch(new RegExp(`data-ab-part="${k}-content"`)) // 📜
    })
  }
  it('client panes publish their scrollers on useAbPage (G55)', () => {
    expect(read('ab-main-layout/index.tsx')).toMatch(/setMainScrollElement/) // 📜
    expect(read('ab-aside-layout/index.tsx')).toMatch(/setAsideScrollElement/) // 📜
  })
})

// 🫥 toAbSlot (G52)
import { toAbSlot } from '../ab-page-provider/slot'
describe('toAbSlot 🫥', () => {
  it('empty → null, text → a span, elements as is', () => {
    for (const v of [null, undefined, false, '', []]) expect(toAbSlot(v as never)).toBeNull() // 🙅
    expect((toAbSlot('Docs') as { type: string }).type).toBe('span') // 🔤
  })
})

// 🔢 James nit: counted layout lock
import { acquireAbLayoutLock } from '../ab-app-layout'
describe('acquireAbLayoutLock 🔒', () => {
  it('keeps the lock until the last panes layout unmounts, double release is a no-op', () => {
    const attrs = new Set<string>() // 🎭 a tiny <html>
    const doc = { documentElement: { setAttribute: (n: string) => attrs.add(n), removeAttribute: (n: string) => attrs.delete(n) } } as unknown as Document
    const a = acquireAbLayoutLock(doc), b = acquireAbLayoutLock(doc)
    a(); a() // 🔁 StrictMode-style double cleanup
    expect(attrs.has('data-ab-layout-lock')).toBe(true) // 🔒 b still mounted
    b()
    expect(attrs.has('data-ab-layout-lock')).toBe(false) // 🔓 last one out
  })
})
