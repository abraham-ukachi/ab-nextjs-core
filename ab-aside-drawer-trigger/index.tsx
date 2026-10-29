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
* @name: AbAsideDrawerTrigger
* @file: ab-aside-drawer-trigger/index.tsx
* @type: Component (client)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ react
import type { ReactElement, ReactNode } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 📱 the drawer state (AbPageProvider)
import { useAbAsideDrawer } from '../ab-page-provider';

// ⚙️ props
export interface AbAsideDrawerTriggerProps {
  /** 🏷️ the visible label, e.g. "Show playground" (translate it). */
  children: ReactNode;
  /** 📐 `'mobile'` (default) = only shown below 768px, where `asideDrawerAt="mobile"` makes the aside a drawer;
   *  `'always'` = never hidden by the layout CSS. */
  at?: 'mobile' | 'always';
  className?: string;
}

/**
 * 🔘 AbAsideDrawerTrigger (0.2.3, God 02:45) — a button that opens the aside as the mobile right drawer.
 * Put one on every slide; the aside itself renders ONCE (AbAsideLayout). Usable from Server Components
 * (a tiny client island). Style it as a link with `className`.
 */
export function AbAsideDrawerTrigger({ children, at = 'mobile', className }: AbAsideDrawerTriggerProps): ReactElement {
  const drawer = useAbAsideDrawer(); // 📱
  return (
    <button type="button" className={clsx('AbAsideDrawerTrigger', className)} data-ab-part="aside-drawer-trigger" data-at={at} {...drawer.props}>
      {children}
    </button>
  );
}

export default AbAsideDrawerTrigger;
