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
      // 🧱 0.1.6: AbAppLayout picks <header> or a <div> (panes, or a child that is already a <header>) via HeaderTag
      expect(src, file).toMatch(file.includes('ab-app-layout') ? /<HeaderTag className=\{clsx\(\['HeaderWrapper'/ : /<header className=\{clsx\(\['HeaderWrapper'/)
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
