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
* @name: AbDottedSurface
* @file: ab-dotted-surface/index.tsx
* @type: Server Component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🧱 react (no 'use client': server-compatible, zero JS)
import type { CSSProperties, ElementType, ReactElement, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbDottedSurfaceProps {
  /** 🏷️ the element to render (default `div`). */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** ⬇️ keep a band free of dots at the top, e.g. a 56px header (`offsetTop={56}` or `'3.5rem'`). Default 0. */
  offsetTop?: number | string;
  /** 🟤 per-surface overrides (else theme ≥ 0.3.7 `--ab-dot-*`, else John's v6 values). */
  dotColor?: string;
  dotSize?: string;
  dotGap?: string;
  /** 🧩 anything else (aria-*, id, data-*) goes on the element */
  [key: string]: unknown;
}

/**
 * 🟤 AbDottedSurface — the Welcome v6 dotted canvas (John's `.dots`):
 * `radial-gradient(dot 1.3px, transparent) / 20px`, painted on a ::before layer under the children.
 * Reads theme ≥ 0.3.7 `--ab-dot-color | --ab-dot-size | --ab-dot-gap`, with light + dark fallbacks for older themes.
 * The same look is available with no component: put `data-ab-surface="dotted"` on any element.
 */
const AbDottedSurface = ({
  as: Tag = 'div',
  className,
  style,
  children,
  offsetTop,
  dotColor,
  dotSize,
  dotGap,
  ...rest
}: AbDottedSurfaceProps): ReactElement => {
  // 🎛️ only set what was asked for, so the theme tokens win otherwise
  const vars: Record<string, string> = {};
  if (offsetTop != null) vars['--ab-dot-offset-top'] = typeof offsetTop === 'number' ? `${offsetTop}px` : offsetTop; // ⬇️
  if (dotColor) vars['--ab-dot-color'] = dotColor; // 🟤
  if (dotSize) vars['--ab-dot-size'] = dotSize; // ⚫
  if (dotGap) vars['--ab-dot-gap'] = dotGap; // 📏
  return (
    <Tag
      {...rest}
      className={clsx(['AbDottedSurface', styles.abDottedSurface, className])}
      data-ab-surface="dotted" // 🟤 the shared CSS hook
      style={{ ...vars, ...style }}
    >
      {children}
    </Tag>
  );
};

export default AbDottedSurface;
