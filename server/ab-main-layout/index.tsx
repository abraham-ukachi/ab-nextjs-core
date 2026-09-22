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

export interface AbMainLayoutProps {
  orientation: 'vertical' | 'horizontal';
  className?: string;
  hidden?: boolean;
  pageName?: string;
  screenName?: string;
  header?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  menus?: ReactNode;
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
  header,
  content,
  footer,
  children,
  menus,
}: AbMainLayoutProps): ReactElement => {
  return (
    <main
      className={clsx(
        ['AbMainLayout', 'group-mainLayout', styles.abMainLayout, className],
        { 'has-screen-name': !!screenName },
      )}
      style={{ maxHeight: screenName ? 'initial' : undefined }}
      hidden={hidden}
      data-page-name={pageName}
      data-screen-name={screenName}
    >
      <div className={clsx(['HeaderWrapper', styles.abMainLayout__headerWrapper])}>
        {header}
      </div>

      <div
        className={clsx([
          'ContentWrapper',
          styles.abMainLayout__contentWrapper,
          orientation === 'horizontal' && 'md:!flex-row',
        ])}
        data-orientation={orientation ? orientation.toString() : undefined}
      >
        {content ?? children}
      </div>

      <div className={clsx(['FooterWrapper', styles.abMainLayout__footerWrapper])}>
        {footer}
      </div>

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
    </main>
  );
};

export default AbMainLayout;
