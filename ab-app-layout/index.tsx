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

'use client';

import type { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';
import AbLinearProgress from '../ab-linear-progress';
import styles from './styles.module.css';

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
}: AbAppLayoutProps): ReactElement => {
  return (
    <div
      className={clsx(['AbAppLayout', styles.abAppLayout, className])}
      hidden={hidden}
      data-page-name={pageName}
      data-orientation={orientation ?? ''}
    >
      <div className={clsx(['HeaderWrapper', styles.abAppLayout__headerWrapper])}>
        {header}
      </div>
      <div className={clsx(['ContentWrapper', styles.abAppLayout__contentWrapper])}>
        {sideBar}
        {content ?? children}
        {navBar}
      </div>
      <div className={clsx(['FooterWrapper', styles.abAppLayout__footerWrapper])}>
        {footer}
      </div>
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
    </div>
  );
};

export default AbAppLayout;
