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

export interface AbScreenLayoutProps {
  orientation: 'vertical' | 'horizontal';
  className?: string;
  hidden?: boolean;
  screenName?: string;
  header?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  menus?: ReactNode;
}

/** Client markup mirror of server AbScreenLayout. */
const AbScreenLayout = ({
  orientation,
  className,
  hidden,
  screenName,
  header,
  content,
  footer,
  children,
  menus,
}: AbScreenLayoutProps): ReactElement => {
  return (
    <div
      className={clsx(['AbScreenLayout', styles.abScreenLayout, className])}
      hidden={hidden}
      data-screen-name={screenName}
      data-orientation={orientation ?? ''}
    >
      <div className={clsx(['HeaderWrapper', styles.abScreenLayout__headerWrapper])}>
        {header}
      </div>
      <div className={clsx(['ContentWrapper', styles.abScreenLayout__contentWrapper])}>
        {content ?? children}
      </div>
      <div className={clsx(['FooterWrapper', styles.abScreenLayout__footerWrapper])}>
        {footer}
      </div>
      <div id="backdrop" className={clsx(['Backdrop', styles.abScreenLayout__backdrop])} hidden />
      <div id="menus" className={clsx(['Menus', styles.abScreenLayout__menus])} hidden>
        {menus}
      </div>
      <div id="dialogs" className={clsx(['Dialogs', styles.abScreenLayout__dialogs])} hidden />
      <div id="toasts" className={clsx(['Toasts', styles.abScreenLayout__toasts])} hidden />
      <AbLinearProgress
        className="absolute top-0 left-0 right-0 z-50 !h-0.5 lg:!h-1"
        color="secondary"
        hidden={true}
        isIndeterminate={true}
        progress={25}
      />
      <canvas className={clsx(['Canvas', styles.abScreenLayout__canvas])} />
    </div>
  );
};

export default AbScreenLayout;
