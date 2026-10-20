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
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const layoutFiles = [
  'server/ab-app-layout/index.tsx',
  'server/ab-screen-layout/index.tsx',
  'server/ab-main-layout/index.tsx',
  'server/ab-aside-layout/index.tsx',
  'ab-app-layout/index.tsx',
  'ab-screen-layout/index.tsx',
  'ab-main-layout/index.tsx',
  'ab-aside-layout/index.tsx',
]

describe('ab-nextjs-core package smoke', () => {
  it('targets Next 16.3.4 peers and package metadata', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
    expect(pkg.name).toBe('ab-nextjs-core')
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+$/)
    expect(pkg.peerDependencies.next).toBe('^16.3.4')
    expect(pkg.peerDependencies.react).toBe('^19')
    expect(pkg.peerDependencies['react-dom']).toBe('^19')
    expect(pkg.peerDependencies.clsx).toBe('^2')
  })

  it('exports supportedCore catalog (8 Done)', async () => {
    const mod = await import('../index')
    expect(Array.isArray(mod.supportedCore)).toBe(true)
    expect(mod.supportedCore).toHaveLength(8)
    expect(mod.supportedCore.every((item) => item.status === 'Done')).toBe(true)
    expect(mod.default.supportedCore).toHaveLength(8)
  })

  it('splits catalog into 4 server and 4 client entries', async () => {
    const mod = await import('../index')
    expect(mod.supportedCore.filter((item) => item.kind === 'server')).toHaveLength(4)
    expect(mod.supportedCore.filter((item) => item.kind === 'client')).toHaveLength(4)
  })

  it('ships layout files and exports map entries', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
    for (const file of layoutFiles) {
      expect(existsSync(join(root, file))).toBe(true)
    }
    expect(pkg.exports['./server/ab-main-layout']).toBe('./server/ab-main-layout/index.tsx')
    expect(pkg.exports['./ab-aside-layout']).toBe('./ab-aside-layout/index.tsx')
    expect(pkg.exports['./ab-page-provider']).toBe('./ab-page-provider/index.tsx')
  })
})
