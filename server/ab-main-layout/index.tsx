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
// 📏 0.2.3: publishes --ab-main-bar-h (client island, shared by both twins)
import AbMainBarHeight from '../../ab-main-layout/main-bar-height';
import AbLinearProgress from '../../ab-linear-progress';
import styles from './styles.module.css';
// 🫥 G52: empty-slot helper (strings get a <span>, so the :has() collapse never hides text)
import { toAbSlot } from '../../ab-page-provider/slot';
// 📌 G55 (Joseph): client island that publishes this pane's scroller on useAbPage()
import AbScrollRegistrar from '../../ab-page-provider/scroll-registrar';

export interface AbMainLayoutProps {
  orientation: 'vertical' | 'horizontal';
  className?: string;
  hidden?: boolean;
  pageName?: string;
  screenName?: string;
  /** 🔝 0.1.6 (G52): the main pane's header slot (data-ab-part="main-header"); 0px and not rendered when empty. */
  mainHeader?: ReactNode;
  /** 🔚 0.1.6 (G52): the main pane's bottom bar slot (data-ab-part="main-bar"); 0px and not rendered when empty. */
  mainBar?: ReactNode;
  /** 📌 0.2.3 (God 04:16): 'always' pins the main bar to the bottom of the scroller at every width (sticky, opaque). */
  mainBarPin?: 'never' | 'always';
  /** 🏷️ 0.2.3: the main bar's accessible name (aria-label on the <footer>). */
  mainBarLabel?: string;
  /** @deprecated 0.1.6: use `mainHeader` (kept as an alias for one minor). */
  header?: ReactNode;
  content?: ReactNode;
  /** @deprecated 0.1.6: use `mainBar` (kept as an alias for one minor). */
  footer?: ReactNode;
  children?: ReactNode;
  menus?: ReactNode;
  /** 🆔 0.1.6: element id (e.g. the skip-link target), no inner wrapper needed. */
  id?: string;
  /** @deprecated 0.1.6: `false` drops the legacy backdrop / menus / dialogs / toasts / progress / canvas layers.
   *  Empty header / bar slots are never rendered any more, so this only gates those layers (default `true`). */
  chrome?: boolean;
  /** ⌨️ 0.2.3: accessible name of the main scroller (the focusable `data-ab-part="main-content"` region).
   *  Pass a translated string (default `'Main content'`). */
  scrollerLabel?: string;
  /** ⌨️ 0.2.3: `false` takes the main scroller out of the tab order (default `true`: tabIndex 0). */
  scrollerFocusable?: boolean;
  /** ⚓ 0.2.3 (Joseph, Welcome 0.2.21): content that comes BEFORE the aside when AbAppLayout
   *  `asideBelow="inline-in-main"` pulls the aside into this scroller (< 1180px), e.g. a counter row:
   *  order = main header · `asideAnchor` · aside · children. At ≥ 1180px (or any other asideBelow) it simply
   *  renders first in the scroller, so the reading order is the same everywhere. */
  asideAnchor?: ReactNode;
}

/**
 * Ab Main Layout — Core Server Component (from LYD LydMainLayout).
 */
const AbMainLayout = ({
  orientation,
  className,
  hidden,
  pageName,
  screenName,
  mainHeader,
  mainBar,
  mainBarPin = 'never', // 📌 0.2.3
  mainBarLabel, // 🏷️ 0.2.3
  header, // 🕰️ deprecated alias
  content,
  footer, // 🕰️ deprecated alias
  children,
  menus,
  id, // 🆔
  chrome = true, // 🧰
  scrollerLabel = 'Main content', // ⌨️ 0.2.3: the scroller's accessible name
  scrollerFocusable = true, // ⌨️ 0.2.3: a tab stop by default
  asideAnchor, // ⚓ 0.2.3: what goes before the inline aside
}: AbMainLayoutProps): ReactElement => {
  // 🔝🔚 G52: the new slot names win, the 0.1.5 names still work
  const top = toAbSlot(mainHeader ?? header);
  const bar = toAbSlot(mainBar ?? footer);
  return (
    <main
      id={id} // 🆔 0.1.6
      className={clsx(
        ['AbMainLayout', 'group-mainLayout', styles.abMainLayout, className],
        { 'has-screen-name': !!screenName },
      )}
      style={{ maxHeight: screenName ? 'initial' : undefined }}
      hidden={hidden}
      data-page-name={pageName}
      data-ab-part="main"
      data-screen-name={screenName}
    >
      {top != null && ( // 🫥 not rendered when empty (D37)
        <header className={clsx(['HeaderWrapper', styles.abMainLayout__headerWrapper])} data-ab-part="main-header">
          {top}
        </header>
      )}

      <div
        className={clsx([
          'ContentWrapper',
          styles.abMainLayout__contentWrapper,
          orientation === 'horizontal' && 'md:!flex-row',
        ])}
        tabIndex={scrollerFocusable ? 0 : undefined} // ⌨️ 0.2.3: keyboard users can focus + arrow-scroll it
        role={scrollerFocusable ? 'region' : undefined} // 🗺️ a named region, so screen readers announce the label
        aria-label={scrollerFocusable ? scrollerLabel : undefined} // 🏷️ 0.2.3: its accessible name
        data-ab-part="main-content" // 📜 G51/G55: THE scroller of this pane (useAbScrollSpy root)
        data-orientation={orientation ? orientation.toString() : undefined}
      >
        {/* 📜 sets mainScrollElement (server components can't hold refs) */}
        <AbScrollRegistrar pane="main" />
        {asideAnchor != null && ( // ⚓ 0.2.3: the pre-aside block + the anchor point the CSS orders the aside after
          <div data-ab-part="aside-anchor">{asideAnchor}</div>
        )}
        {content ?? children}
      </div>

      {bar != null && ( // 🫥 not rendered when empty (D37)
        <footer className={clsx(['FooterWrapper', styles.abMainLayout__footerWrapper])} data-ab-part="main-bar" data-main-bar-pin={mainBarPin === 'always' ? 'always' : 'never'} aria-label={mainBarLabel}>
          {bar}
          <AbMainBarHeight />{/* 📏 0.2.3 */}
        </footer>
      )}

      {chrome && ( // 🧰 0.1.6: legacy layers
        <>
        <div className={clsx(['Backdrop', styles.abMainLayout__backdrop])} hidden />
        <div className={clsx(['Menus', styles.abMainLayout__menus])} hidden>
          {menus}
        </div>
        <div className={clsx(['Dialogs', styles.abMainLayout__dialogs])} hidden />
        <div className={clsx(['Toasts', styles.abMainLayout__toasts])} hidden />
  
        <AbLinearProgress
          className="absolute top-0 left-0 right-0 z-50 !w-1/2 place-self-center !my-1 3xl:!my-2 !mx-auto !h-0.5 lg:!h-1 3xl:!h-1.5"
          color="secondary"
          hidden={true}
          isIndeterminate={true}
          progress={25}
        />
  
        <canvas className={clsx(['Canvas', styles.abMainLayout__canvas])} />
        </>
      )}
    </main>
  );
};

export default AbMainLayout;
