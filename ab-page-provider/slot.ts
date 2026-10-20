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

// 🫥 0.1.6 (G52, D37): server-safe (no 'use client'), shared by the client and server layouts

import { createElement, type ReactNode } from 'react';

/**
 * 🫥 toAbSlot — normalise a slot for rendering:
 * · `null` / `undefined` / `false` / `''` / `[]` → `null`, so the wrapper is NOT rendered (0px)
 * · a bare string / number → wrapped in a `<span>`, so the CSS `:not(:has(> *))` collapse never hides text
 * · anything else (elements, fragments, arrays with content) → returned as is
 */
export function toAbSlot(node: ReactNode): ReactNode {
  if (node == null || node === false || node === true || node === '') return null; // 🙅 empty
  if (Array.isArray(node) && node.every((n) => n == null || n === false || n === true || n === '')) return null; // 🙅 empty list
  if (typeof node === 'string' || typeof node === 'number') return createElement('span', { 'data-ab-part': 'slot-text' }, node); // 🔤
  return node; // ✅
}
