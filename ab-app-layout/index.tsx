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

'use client';

import { isValidElement, useEffect, type ReactElement, type ReactNode } from 'react';
import clsx from 'clsx';
import AbLinearProgress from '../ab-linear-progress';
import styles from './styles.module.css';
// 🫥 G50: empty-slot helper
import { toAbSlot } from '../ab-page-provider/slot';

// 🔢 how many panes layouts are mounted (module scope: one document per bundle)
let abLayoutLocks = 0;

/**
 * 🔒 acquireAbLayoutLock — sets `data-ab-layout-lock` on `<html>` and returns the release function.
 * Counted: the attribute only goes away when the LAST mounted panes layout releases (James nit).
 * Releasing twice is a no-op.
 */
export function acquireAbLayoutLock(doc: Document = document): () => void {
  abLayoutLocks += 1; // ➕
  doc.documentElement.setAttribute('data-ab-layout-lock', ''); // 🔒
  let released = false; // 🛡️ StrictMode double cleanups
  return () => {
    if (released) return;
    released = true;
    abLayoutLocks = Math.max(0, abLayoutLocks - 1); // ➖
    if (abLayoutLocks === 0) doc.documentElement.removeAttribute('data-ab-layout-lock'); // 🔓 last one out
  };
}

export interface AbAppLayoutProps {
  orientation: 'vertical' | 'horizontal';
  className?: string;
  hidden?: boolean;
  pageName?: string;
  header?: ReactNode;
  sideBar?: ReactNode;
  content?: ReactNode;
  navBar?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  menus?: ReactNode;
  /** 🧭 0.1.6 (G17): `'panes'` = the docs shell (4 breakpoints, rail, overlay aside). Default keeps the old layout. */
  variant?: 'default' | 'panes';
  /** 🧷 0.1.6: collapse the sidebar to the icon rail (tablet and up, `variant="panes"`). */
  railCollapsed?: boolean;
  /** 📟 0.2.0 (P2): `'main'` = on tablet (768–1179) hide the app header and show AbMainLayout's `mainHeader` instead (hidden at other widths). Default `'header'`. */
  tabletHeader?: 'header' | 'main';
  /** 📱 0.2.1 (John's drawers v2, God 01:22): `'main'` = below 768px hide the app header and show AbMainLayout's
   *  `mainHeader` as the 56px mobile bar (16px inset, 1px divider). Default `'header'` (unchanged). */
  mobileHeader?: 'header' | 'main';
  /** 🧰 0.1.6: render the legacy #backdrop / #menus / #dialogs / #toasts / progress / canvas layers.
   *  Default: on for `variant="default"`, off for `"panes"` (the shell brings its own menus and dialogs). */
  overlays?: boolean;
}

/** Client markup mirror of server AbAppLayout (slots only). */
const AbAppLayout = ({
  orientation,
  className,
  hidden,
  pageName,
  header,
  sideBar,
  content,
  navBar,
  footer,
  children,
  menus,
  variant = 'default', // 🧭
  railCollapsed = false, // 🧷
  tabletHeader = 'header', // 📟
  mobileHeader = 'header', // 📱 drawers v2
  overlays, // 🧰
}: AbAppLayoutProps): ReactElement => {
  // 🧱 panes: the header slot is a plain grid row (0px when empty). Its child (e.g. AbAppBar) brings its own
  //    <header>, so we never nest one header inside another. Same when the slot child IS a <header>.
  const HeaderTag = variant === 'panes' || (isValidElement(header) && header.type === 'header') ? 'div' : 'header';
  // 🧰 legacy overlay layers (off in panes unless asked for)
  const showOverlays = overlays ?? variant !== 'panes';
  // 🫥 G50 (D37): panes never render an empty header / footer row (0px); the CSS :empty / :has() catch the rest
  const top = toAbSlot(header);
  const showHeader = variant !== 'panes' || top != null;
  const showFooter = variant !== 'panes' || toAbSlot(footer) != null;
  // 🔒 G54: lock the document while a panes layout is mounted (CSS :has() does it too; this covers older engines)
  useEffect(() => {
    if (variant !== 'panes' || typeof document === 'undefined') return;
    return acquireAbLayoutLock(); // 🔒 counted, so unmounting one of two layouts keeps the lock (James)
  }, [variant]);
  return (
    <div
      className={clsx(['AbAppLayout', styles.abAppLayout, className])}
      hidden={hidden}
      data-page-name={pageName}
      data-orientation={orientation ?? ''}
      data-variant={variant} // 🧭 CSS hook for the panes
      data-rail={railCollapsed ? 'true' : 'false'} // 🧷
      data-tablet-header={tabletHeader === 'main' ? 'main' : undefined} // 📟 P2
      data-mobile-header={mobileHeader === 'main' ? 'main' : undefined} // 📱 drawers v2
    >
      {showHeader && (
        <HeaderTag className={clsx(['HeaderWrapper', styles.abAppLayout__headerWrapper])} data-ab-part="header">
          {variant === 'panes' ? top : header}
        </HeaderTag>
      )}
      <div className={clsx(['ContentWrapper', styles.abAppLayout__contentWrapper])}>
        {sideBar}
        {content ?? children}
        {navBar}
      </div>
      {showFooter && (
        <footer className={clsx(['FooterWrapper', styles.abAppLayout__footerWrapper])} data-ab-part="footer">
          {footer}
        </footer>
      )}
      {/* 🧰 legacy layers (ids kept for old apps) */}
      {showOverlays && (
        <>
          <div id="backdrop" className={clsx(['Backdrop', styles.abAppLayout__backdrop])} hidden />
          <div id="menus" className={clsx(['Menus', styles.abAppLayout__menus])} hidden>
            {menus}
          </div>
          <div id="dialogs" className={clsx(['Dialogs', styles.abAppLayout__dialogs])} hidden />
          <div id="toasts" className={clsx(['Toasts', styles.abAppLayout__toasts])} hidden />
          <AbLinearProgress
            className="absolute top-0 left-0 right-0 z-50 !h-0.5 lg:!h-1"
            color="secondary"
            hidden={true}
            isIndeterminate={true}
            progress={25}
          />
          <canvas className={clsx(['Canvas', styles.abAppLayout__canvas])} />
        </>
      )}
      {/* 📋 panes: still render menus when the app passes some */}
      {!showOverlays && menus != null && <div className={clsx(['Menus', styles.abAppLayout__menus])}>{menus}</div>}
    </div>
  );
};

export default AbAppLayout;
