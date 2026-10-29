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
* @name: AbAsideLayout landmark name (0.2.3)
* @file: __tests__/aside-label-0.2.3.test.tsx
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
import { createElement, type ReactElement } from 'react'
import { renderToStaticMarkup as r } from 'react-dom/server'
import { AbPageProvider } from '../ab-page-provider'
import AbAsideLayout from '../ab-aside-layout'
import ServerAbAsideLayout from '../server/ab-aside-layout'

// 🧩 the client twin reads useAbPage(), so wrap it in the provider
const renderToStaticMarkup = (el: ReactElement) => r(createElement(AbPageProvider, null, el))

// 🏷️ Joseph (Welcome 0.2.21): the aside landmark had no accessible name
describe('🏷️ AbAsideLayout aria-label / aria-labelledby', () => {
  for (const [name, C] of [['client', AbAsideLayout], ['server', ServerAbAsideLayout]] as const) {
    it(`${name}: puts aria-label on the <aside>`, () => {
      const el = createElement(C, { orientation: 'vertical', 'aria-label': 'Live Playground' }, 'x') // 🖨️
      const html = renderToStaticMarkup(el)
      expect(html).toMatch(/<aside[^>]*aria-label="Live Playground"/) // ✅
    })
    it(`${name}: puts aria-labelledby on the <aside>, and nothing by default`, () => {
      expect(renderToStaticMarkup(createElement(C, { orientation: 'vertical', 'aria-labelledby': 'pg-title' }))).toMatch(/<aside[^>]*aria-labelledby="pg-title"/) // 🔗
      expect(renderToStaticMarkup(createElement(C, { orientation: 'vertical' }))).not.toMatch(/<aside[^>]*aria-label/) // 🫥
    })
  }
})
