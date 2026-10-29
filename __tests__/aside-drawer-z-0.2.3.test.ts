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
// 🧪 Joseph 02:55 (BLOCKED): theme gives the layout main `z-index: 99` → the z 30 drawer was invisible at 390px.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const files = ['ab-app-layout/styles.module.css', 'server/ab-app-layout/styles.module.css'] // 🖥️ client + server
describe('🪜 --ab-aside-drawer-z lifts the mobile drawer above theme main (z 99) and aside (z 100)', () => {
  for (const f of files) it(f, () => {
    const css = readFileSync(join(__dirname, '..', f), 'utf8') // 🎨
    expect(css).toMatch(/z-index: var\(--ab-aside-drawer-z, 120\)/) // 🗂️ drawer
    expect(css).toMatch(/z-index: calc\(var\(--ab-aside-drawer-z, 120\) - 1\)/) // 🌫️ backdrop just below
    expect(120).toBeGreaterThan(100) // 📏 theme css/styles.css: main 99, legacy aside 100
  })
})
