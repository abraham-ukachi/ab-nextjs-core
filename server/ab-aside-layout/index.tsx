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

import type { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';
import AbLinearProgress from '../../ab-linear-progress';
import styles from './styles.module.css';
// 🫥 G52: empty-slot helper (strings get a <span>, so the :has() collapse never hides text)
import { toAbSlot } from '../../ab-page-provider/slot';
// 📌 G55 (Joseph): client island that publishes this pane's scroller on useAbPage()
import AbScrollRegistrar from '../../ab-page-provider/scroll-registrar';

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
 * Ab Aside Layout — Core Server Component (from LYD LydAsideLayout).
 */
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
  // 🔝🔚 G52: the new slot names win, the 0.1.5 names still work
  const top = toAbSlot(asideHeader ?? header);
  const bar = toAbSlot(asideBar ?? footer);
  return (
    <aside
      id={id ?? 'ab-aside'} // 🆔 0.1.6 (James review): same default as AbPageProvider's asideId, for aria-controls
      className={clsx(['AbAsideLayout', styles.abAsideLayout, className])}
      hidden={hidden}
      data-page-name={pageName}
      data-ab-part="aside"
      aria-label={ariaLabel} // 🏷️ 0.2.3: the landmark's name
      aria-labelledby={ariaLabelledBy} // 🏷️ 0.2.3: or a heading's id
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
      >
        {/* 📜 sets asideScrollElement (server components can't hold refs) */}
        <AbScrollRegistrar pane="aside" />
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
          hidden={true}
          isIndeterminate={true}
          progress={25}
        />
  
        <canvas className={clsx(['Canvas', styles.abAsideLayout__canvas])} />
        </>
      )}
    </aside>
  );
};

export default AbAsideLayout;
