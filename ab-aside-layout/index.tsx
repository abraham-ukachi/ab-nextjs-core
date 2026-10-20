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

export interface AbAsideLayoutProps {
  orientation: 'vertical' | 'horizontal';
  className?: string;
  hidden?: boolean;
  pageName?: string;
  header?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  dividerHidden?: boolean;
  menus?: ReactNode;
  /** 🆔 0.1.6: element id (e.g. the skip-link target), no inner wrapper needed. */
  id?: string;
  /** 🧰 0.1.6: legacy chrome opt-out for docs-shell panes. `false` drops the empty header/footer wrappers
   *  and the backdrop / menus / dialogs / toasts / progress / canvas layers (the shell brings its own).
   *  Default `true` (unchanged markup for older apps). A header/footer you pass is always rendered. */
  chrome?: boolean;
}

/**
 * Ab Aside Layout — Core Client Component (from LYD client LydAsideLayout).
 * Uses minimal useAbPage contract (AbPageProvider), not LydPageProvider.
 */
const AbAsideLayout = ({
  orientation,
  className,
  hidden,
  pageName,
  header,
  content,
  footer,
  children,
  dividerHidden,
  menus,
  id, // 🆔
  chrome = true, // 🧰
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
      data-opened={isAsideOpen}
      data-open-on-mobile={isAsideOpenOnMobile}
    >
      {(chrome || header != null) && ( // 🧰 0.1.6
        <header className={clsx(['HeaderWrapper', styles.abAsideLayout__headerWrapper])} data-ab-part="header">
          {header}
        </header>
      )}

      <div
        className={clsx([
          'ContentWrapper',
          styles.abAsideLayout__contentWrapper,
          orientation === 'horizontal' && '!flex-row',
        ])}
      >
        {content ?? children}
      </div>

      {(chrome || footer != null) && ( // 🧰 0.1.6
        <footer className={clsx(['FooterWrapper', styles.abAsideLayout__footerWrapper])} data-ab-part="footer">
          {footer}
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
