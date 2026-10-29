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

import type { ReactElement, ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useAbPage } from '../ab-page-provider';
import AbLinearProgress from '../ab-linear-progress';
import styles from './styles.module.css';
// 🫥 G52: empty-slot helper (strings get a <span>, so the :has() collapse never hides text)
import { toAbSlot } from '../ab-page-provider/slot';

export interface AbAsideLayoutProps {
  orientation: 'vertical' | 'horizontal';
  className?: string;
  hidden?: boolean;
  pageName?: string;
  /** 🔝 0.1.6 (G52): the aside pane's header slot (data-ab-part="aside-header"); 0px and not rendered when empty. */
  asideHeader?: ReactNode;
  /** 🔚 0.1.6 (G52): the aside pane's bottom bar slot (data-ab-part="aside-bar"); 0px and not rendered when empty. */
  asideBar?: ReactNode;
  /** @deprecated 0.1.6: use `asideHeader` (kept as an alias for one minor). */
  header?: ReactNode;
  content?: ReactNode;
  /** @deprecated 0.1.6: use `asideBar` (kept as an alias for one minor). */
  footer?: ReactNode;
  children?: ReactNode;
  dividerHidden?: boolean;
  menus?: ReactNode;
  /** 🆔 0.1.6: element id (e.g. the skip-link target), no inner wrapper needed. */
  id?: string;
  /** @deprecated 0.1.6: `false` drops the legacy backdrop / menus / dialogs / toasts / progress / canvas layers.
   *  Empty header / bar slots are never rendered any more, so this only gates those layers (default `true`). */
  chrome?: boolean;
  /** 🏷️ 0.2.3 (Joseph, Welcome 0.2.21): names the <aside> landmark (e.g. "Live Playground"), so screen readers
   *  don't list an anonymous "complementary". Pass a translated string. */
  'aria-label'?: string;
  /** 🏷️ 0.2.3: or point at a visible heading's id (wins over `aria-label` per ARIA). */
  'aria-labelledby'?: string;
}

/**
 * Ab Aside Layout — Core Client Component (from LYD client LydAsideLayout).
 * Uses minimal useAbPage contract (AbPageProvider), not LydPageProvider.
 */
/** 👉 0.2.3: does a pointer move (dx, dy px) close the right drawer? ≥ 60px to the right and mostly horizontal. */
export function shouldCloseAbAsideOnSwipe(dx: number, dy: number, threshold = 60): boolean {
  return dx >= threshold && Math.abs(dy) < dx * 0.6; // ➡️ right, not a vertical scroll
}

const AbAsideLayout = ({
  orientation,
  className,
  hidden,
  pageName,
  asideHeader,
  asideBar,
  header, // 🕰️ deprecated alias
  content,
  footer, // 🕰️ deprecated alias
  children,
  dividerHidden,
  menus,
  id, // 🆔
  chrome = true, // 🧰
  'aria-label': ariaLabel, // 🏷️ 0.2.3
  'aria-labelledby': ariaLabelledBy, // 🏷️ 0.2.3
}: AbAsideLayoutProps): ReactElement => {
  const {
    isAsideOpen,
    isAsideOpenOnMobile,
    asideDuration,
    asideElement,
    setAsideElement,
    isAsideOpening,
    isAsideClosing,
    isAsideLoading,
    asideId,
    setAsideOpenOnMobile,
  } = useAbPage();

  const asideRef = useRef<HTMLElement | null>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null); // 👆 0.2.3: swipe-to-close start point

  useEffect(() => {
    const el = asideRef.current;
    if (el) setAsideElement(el);
    return () => setAsideElement(null);
  }, [setAsideElement]);

  useEffect(() => {
    const updateAsideParentElement = (
      parentEl: HTMLElement,
      open: boolean,
      openOnMobile: boolean,
      opening: boolean,
      closing: boolean,
    ) => {
      const parentElWidth = parentEl.clientWidth;
      parentEl.style.setProperty('--current-aside-width', `${parentElWidth}px`);
      parentEl.classList.toggle('is-aside-open', open);
      parentEl.classList.toggle('is-aside-open-on-mobile', openOnMobile);
      parentEl.classList.toggle('is-aside-opening', opening);
      parentEl.classList.toggle('is-aside-closing', closing);
      parentEl.style.setProperty('--aside-duration', `${asideDuration}ms`);
    };

    const parentEl = asideElement?.parentElement as HTMLElement | null | undefined;
    const width =
      typeof window !== 'undefined' ? window.innerWidth : 0;

    if (parentEl && width > 0) {
      updateAsideParentElement(
        parentEl,
        isAsideOpen,
        isAsideOpenOnMobile,
        isAsideOpening,
        isAsideClosing,
      );
    }
  }, [
    isAsideOpen,
    isAsideOpenOnMobile,
    isAsideOpening,
    isAsideClosing,
    asideElement,
    asideDuration,
  ]);

  // 🔝🔚 G52: the new slot names win, the 0.1.5 names still work
  const top = toAbSlot(asideHeader ?? header);
  const bar = toAbSlot(asideBar ?? footer);
  // 📜 G55: publish this pane's scroller (the content wrapper) so scroll spies / TOCs can use it as `root`
  const { setAsideScrollElement } = useAbPage();
  return (
    <>
    {/* 🌫️ 0.1.6 (James review): tablet/mobile sheet backdrop, a sibling so AbAppLayout's pane CSS shows it; click closes */}
    <div
      data-ab-part="aside-backdrop"
      data-open={isAsideOpenOnMobile ? 'true' : 'false'}
      aria-hidden="true"
      onClick={() => setAsideOpenOnMobile(false)}
      hidden={!isAsideOpenOnMobile}
    />
    <aside
      ref={asideRef}
      id={id ?? asideId} // 🆔 0.1.6: target of aria-controls (useAbAsideToggle)
      className={clsx(
        ['AbAsideLayout', 'group/aside-layout', styles.abAsideLayout, className],
        { 'is-open': isAsideOpen },
        { 'slideFromRight': isAsideOpen || isAsideOpenOnMobile }, // 🎞️ ab-nextjs-animations keyframe (240ms here, none under reduced motion)
        { 'is-open-on-mobile': isAsideOpenOnMobile },
        // 🙈 0.1.6: stay mounted-visible while the mobile/tablet sheet is open, even if the laptop pane is closed
        { '!hidden': !isAsideOpen && !isAsideOpenOnMobile && !isAsideOpening && !isAsideClosing },
      )}
      hidden={hidden}
      data-page-name={pageName}
      data-ab-part="aside"
      aria-label={ariaLabel} // 🏷️ 0.2.3: the landmark's name
      aria-labelledby={ariaLabelledBy} // 🏷️ 0.2.3: or a heading's id
      data-opened={isAsideOpen}
      data-open-on-mobile={isAsideOpenOnMobile}
      role={isAsideOpenOnMobile ? 'dialog' : undefined} // 📱 0.2.3: the open drawer / sheet is a modal dialog (named by aria-label)
      aria-modal={isAsideOpenOnMobile ? true : undefined} // 📱 0.2.3
      onPointerDown={(e) => { swipeRef.current = isAsideOpenOnMobile ? { x: e.clientX, y: e.clientY } : null; }} // 👆 0.2.3: swipe start
      onPointerUp={(e) => { // 👉 0.2.3: a mostly-horizontal right swipe ≥ 60px closes the drawer (core has no hooks dependency)
        const s0 = swipeRef.current; swipeRef.current = null;
        if (s0 && shouldCloseAbAsideOnSwipe(e.clientX - s0.x, e.clientY - s0.y)) setAsideOpenOnMobile(false);
      }}
      onPointerCancel={() => { swipeRef.current = null; }} // 🧹
    >
      {top != null && ( // 🫥 not rendered when empty (D37)
        <header className={clsx(['HeaderWrapper', styles.abAsideLayout__headerWrapper])} data-ab-part="aside-header">
          {top}
        </header>
      )}

      <div
        className={clsx([
          'ContentWrapper',
          styles.abAsideLayout__contentWrapper,
          orientation === 'horizontal' && '!flex-row',
        ])}
        data-ab-part="aside-content" // 📜 G51/G55: THE scroller of this pane (useAbScrollSpy root)
        ref={setAsideScrollElement} // 📜 G55: useAbPage().asideScrollElement
      >
        {content ?? children}
      </div>

      {bar != null && ( // 🫥 not rendered when empty (D37)
        <footer className={clsx(['FooterWrapper', styles.abAsideLayout__footerWrapper])} data-ab-part="aside-bar">
          {bar}
        </footer>
      )}

      {chrome && ( // 🧰 0.1.6: legacy layers
        <>
        <div className={clsx(['Backdrop', styles.abAsideLayout__backdrop])} hidden />
        <div className={clsx(['Menus', styles.abAsideLayout__menus])} hidden>
          {menus}
        </div>
        <div className={clsx(['Dialogs', styles.abAsideLayout__dialogs])} hidden />
        <div className={clsx(['Toasts', styles.abAsideLayout__toasts])} hidden />
  
        {!dividerHidden && (
          <span className={clsx(['divider', 'vertical', 'left', styles.abAsideLayout__divider])} />
        )}
  
        <AbLinearProgress
          className="absolute top-0 left-0 right-0 z-50 !h-0.5 lg:!h-1"
          color="secondary"
          hidden={!isAsideLoading}
          isIndeterminate={true}
          progress={25}
        />
  
        <canvas className={clsx(['Canvas', styles.abAsideLayout__canvas])} />
        </>
      )}
    </aside>
    </>
  );
};

export default AbAsideLayout;
