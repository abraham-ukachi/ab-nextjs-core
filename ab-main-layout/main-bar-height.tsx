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
* @name: AbMainBarHeight (0.2.3)
* @file: ab-main-layout/main-bar-height.tsx
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

/**
 * 📏 AbMainBarHeight — a tiny client island rendered inside the main bar by BOTH AbMainLayout twins (0.2.3, God 04:16).
 * It measures its parent (`data-ab-part="main-bar"`) with a ResizeObserver and publishes the height as
 * `--ab-main-bar-h` on the main pane AND the closest `.AbAppLayout` root, so the scrollers' `scroll-padding-bottom`
 * keeps focused / anchored content clear of a pinned bar. Renders one hidden, empty `<span>`.
 */
export function AbMainBarHeight(): ReactElement {
  const ref = useRef<HTMLSpanElement>(null); // 📍
  useEffect(() => {
    const bar = ref.current?.parentElement; // 🔚 the main bar
    if (!bar || typeof ResizeObserver === 'undefined') return undefined; // 🛡️ SSR / old engines: CSS fallback 0px
    const targets = [bar.closest('main'), bar.closest('.AbAppLayout')].filter((t): t is HTMLElement => !!t) // 🎯
    const publish = () => { const h = `${Math.round(bar.getBoundingClientRect().height)}px`; for (const t of targets) t.style.setProperty('--ab-main-bar-h', h) } // 📣
    publish()
    const ro = new ResizeObserver(publish); ro.observe(bar) // 👀
    return () => { ro.disconnect(); for (const t of targets) t.style.removeProperty('--ab-main-bar-h') } // 🧹
  }, [])
  return <span ref={ref} hidden data-ab-part="main-bar-height" />; // 🫥
}

// 📦 default export
export default AbMainBarHeight;
