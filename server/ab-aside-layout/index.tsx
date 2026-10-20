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
 * Ab Aside Layout — Core Server Component (from LYD LydAsideLayout).
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
  return (
    <aside
      id={id ?? 'ab-aside'} // 🆔 0.1.6 (James review): same default as AbPageProvider's asideId, for aria-controls
      className={clsx(['AbAsideLayout', styles.abAsideLayout, className])}
      hidden={hidden}
      data-page-name={pageName}
      data-ab-part="aside"
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
