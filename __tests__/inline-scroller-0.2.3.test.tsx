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
// 🧪 Joseph 02:55: inline-in-main uses the app content wrapper as the ONE scroller → expose it
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import * as provider from '../ab-page-provider'

describe('📜 useAbInlineScroller + useAbPage().appScrollElement', () => {
  it('exports the hook', () => { expect(typeof provider.useAbInlineScroller).toBe('function') }) // 🪝
  it('provider exposes appScrollElement and the client AbAppLayout wires it', () => {
    const src = readFileSync(join(__dirname, '../ab-page-provider/index.tsx'), 'utf8') // 📄
    expect(src).toMatch(/appScrollElement: HTMLElement \| null/); expect(src).toMatch(/setAppScrollElement/) // 🧩
    const lay = readFileSync(join(__dirname, '../ab-app-layout/index.tsx'), 'utf8') // 🏗️
    expect(lay).toMatch(/ref=\{setAppScrollElement\}/) // 🔗
  })
})
