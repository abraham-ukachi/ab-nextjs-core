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
* @name: AbScrollRegistrar (G55)
* @file: ab-page-provider/scroll-registrar.tsx
* @type: Client component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client';

// ⚛️ React
import { useEffect, useRef, type ReactElement } from 'react';
// 🧠 the page context (no-op setters outside an AbPageProvider)
import { useAbPage } from './index';

/** ⚙️ props */
export interface AbScrollRegistrarProps {
  pane: 'main' | 'aside'; // 📜 which scroller to publish
}

/**
 * 📌 AbScrollRegistrar — a tiny client island for the SERVER `AbMainLayout` / `AbAsideLayout` (G55, Joseph).
 * Server components can't hold a ref, so the server layouts render this as the first child of their content
 * wrapper: it publishes its parent (the `data-ab-part="main-content"` / `"aside-content"` scroller) on
 * `useAbPage()` as `mainScrollElement` / `asideScrollElement`, in an effect, and clears it on unmount.
 * It renders one hidden, empty `<span>` (no layout, no a11y tree).
 */
export function AbScrollRegistrar({ pane }: AbScrollRegistrarProps): ReactElement {
  const { setMainScrollElement, setAsideScrollElement } = useAbPage(); // 🧠
  const ref = useRef<HTMLSpanElement>(null); // 📍
  useEffect(() => {
    const set = pane === 'main' ? setMainScrollElement : setAsideScrollElement; // 🎯
    set(ref.current?.parentElement ?? null); // 📜 the content wrapper = the scroller
    return () => set(null); // 🧹
  }, [pane, setMainScrollElement, setAsideScrollElement]);
  return <span ref={ref} hidden data-ab-part="scroll-registrar" />; // 🫥
}

// 📦 default export
export default AbScrollRegistrar;
