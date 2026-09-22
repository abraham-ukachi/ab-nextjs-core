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
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
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
}: AbAsideLayoutProps): ReactElement => {
  return (
    <aside
      className={clsx(['AbAsideLayout', styles.abAsideLayout, className])}
      hidden={hidden}
      data-page-name={pageName}
    >
      <div className={clsx(['HeaderWrapper', styles.abAsideLayout__headerWrapper])}>
        {header}
      </div>

      <div
        className={clsx([
          'ContentWrapper',
          styles.abAsideLayout__contentWrapper,
          orientation === 'horizontal' && '!flex-row',
        ])}
      >
        {content ?? children}
      </div>

      <div className={clsx(['FooterWrapper', styles.abAsideLayout__footerWrapper])}>
        {footer}
      </div>

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
    </aside>
  );
};

export default AbAsideLayout;
