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
      expect(css).toMatch(/\[data-variant="panes"\] \.abAppLayout__contentWrapper > \[data-ab-part="sidebar"\] \{\s*display: none/) // 🙈
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
    expect(src).toMatch(/id=\{asideId\}/) // 🆔
    expect(src).toMatch(/'!hidden': !isAsideOpen && !isAsideOpenOnMobile/) // 👀
  })
  it('useAbPage gains toggleAside / toggleAsideOnMobile / asideId and useAbAsideToggle sets aria', () => {
    const src = read('ab-page-provider/index.tsx')
    for (const k of ['toggleAside: () => void', 'toggleAsideOnMobile: () => void', 'asideId: string', 'export function useAbAsideToggle']) expect(src).toContain(k)
    expect(src).toMatch(/'aria-expanded': expanded, 'aria-controls': asideId/) // ♿
    expect(src).toMatch(/e\.key === 'Escape'/) // ⎋ closes the sheet
  })
})
