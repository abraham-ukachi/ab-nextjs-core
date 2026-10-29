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
* @name: server/client layout twin drift guard
* @file: __tests__/server-twin-drift-0.2.3.test.ts
* @type: Vitest
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/
// 🧪 0.2.3 (Joseph 03:41): every server layout CSS twin must equal its client CSS (minus the license header).
import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = join(__dirname, '..') // 📁
const body = (f: string) => readFileSync(join(root, f), 'utf8').replace(/^[\s\S]*?\*\/\s*/, '') // ✂️ header's @file differs

describe('core server ↔ client CSS twins 🧬', () => {
  const twins = readdirSync(join(root, 'server')).filter((d) => existsSync(join(root, 'server', d, 'styles.module.css')) && existsSync(join(root, d, 'styles.module.css'))) // 👯
  it('found all four layouts', () => { expect(twins.sort()).toEqual(['ab-app-layout', 'ab-aside-layout', 'ab-main-layout', 'ab-screen-layout']) })
  for (const d of twins) it(`${d}: no drift`, () => { expect(body(`server/${d}/styles.module.css`)).toBe(body(`${d}/styles.module.css`)) }) // 🛡️
})
