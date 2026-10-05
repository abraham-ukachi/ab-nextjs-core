import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const read = (rel: string) => readFileSync(join(root, rel), 'utf8')

describe('layout HTML landmarks (God constraint)', () => {
  it('uses <header>/<footer> wrappers and data-ab-part on main/aside', () => {
    for (const file of [
      'ab-main-layout/index.tsx',
      'server/ab-main-layout/index.tsx',
      'ab-aside-layout/index.tsx',
      'server/ab-aside-layout/index.tsx',
      'ab-app-layout/index.tsx',
      'server/ab-app-layout/index.tsx',
      'ab-screen-layout/index.tsx',
      'server/ab-screen-layout/index.tsx',
    ]) {
      const src = read(file)
      expect(src, file).toMatch(/<header className=\{clsx\(\['HeaderWrapper'/)
      expect(src, file).toMatch(/<footer className=\{clsx\(\['FooterWrapper'/)
      expect(src, file).not.toMatch(/<div className=\{clsx\(\['HeaderWrapper'/)
      expect(src, file).not.toMatch(/<div className=\{clsx\(\['FooterWrapper'/)
    }
    expect(read('ab-main-layout/index.tsx')).toMatch(/data-ab-part="main"/)
    expect(read('server/ab-main-layout/index.tsx')).toMatch(/data-ab-part="main"/)
    expect(read('ab-aside-layout/index.tsx')).toMatch(/data-ab-part="aside"/)
    expect(read('server/ab-aside-layout/index.tsx')).toMatch(/data-ab-part="aside"/)
    expect(read('ab-aside-layout/index.tsx')).toMatch(/<aside\b/)
    expect(read('ab-main-layout/index.tsx')).toMatch(/<main\b/)
  })

  it('client AbAsideLayout uses .slideFromRight (not animate-slide-from-right)', () => {
    const src = read('ab-aside-layout/index.tsx')
    expect(src).toMatch(/slideFromRight/)
    expect(src).not.toMatch(/animate-slide-from-right/)
  })

  it('header and footer wrappers set data-ab-part="header" / "footer"', () => {
    for (const file of [
      'ab-main-layout/index.tsx',
      'server/ab-main-layout/index.tsx',
      'ab-aside-layout/index.tsx',
      'server/ab-aside-layout/index.tsx',
      'ab-app-layout/index.tsx',
      'server/ab-app-layout/index.tsx',
      'ab-screen-layout/index.tsx',
      'server/ab-screen-layout/index.tsx',
    ]) {
      const src = read(file)
      expect(src, file).toMatch(/data-ab-part="header"/)
      expect(src, file).toMatch(/data-ab-part="footer"/)
    }
  })

})
