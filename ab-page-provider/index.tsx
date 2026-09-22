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

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

export interface AbPageContextValue {
  isAsideOpen: boolean;
  isAsideOpenOnMobile: boolean;
  asideDuration: number;
  asideElement: HTMLElement | null;
  setAsideElement: (el: HTMLElement | null) => void;
  isAsideOpening: boolean;
  isAsideClosing: boolean;
  isAsideLoading: boolean;
  setAsideOpen: (open: boolean) => void;
  setAsideOpenOnMobile: (open: boolean) => void;
  setAsideLoading: (loading: boolean) => void;
}

const defaultValue: AbPageContextValue = {
  isAsideOpen: true,
  isAsideOpenOnMobile: false,
  asideDuration: 300,
  asideElement: null,
  setAsideElement: () => {},
  isAsideOpening: false,
  isAsideClosing: false,
  isAsideLoading: false,
  setAsideOpen: () => {},
  setAsideOpenOnMobile: () => {},
  setAsideLoading: () => {},
};

const AbPageContext = createContext<AbPageContextValue>(defaultValue);

export interface AbPageProviderProps {
  children?: ReactNode;
  /** Initial aside open state (default true so shells render visibly). */
  defaultAsideOpen?: boolean;
  asideDuration?: number;
}

/**
 * Minimal page contract for client AbAsideLayout (LYD useLydPage aside slice).
 * Not a port of LydPageProvider — only aside open/loading/element state.
 */
export function AbPageProvider({
  children,
  defaultAsideOpen = true,
  asideDuration = 300,
}: AbPageProviderProps): ReactElement {
  const [isAsideOpen, setAsideOpen] = useState(defaultAsideOpen);
  const [isAsideOpenOnMobile, setAsideOpenOnMobile] = useState(false);
  const [isAsideOpening, setAsideOpening] = useState(false);
  const [isAsideClosing, setAsideClosing] = useState(false);
  const [isAsideLoading, setAsideLoading] = useState(false);
  const [asideElement, setAsideElementState] = useState<HTMLElement | null>(null);

  const setAsideElement = useCallback((el: HTMLElement | null) => {
    setAsideElementState(el);
  }, []);

  const setAsideOpenSafe = useCallback((open: boolean) => {
    if (open) {
      setAsideOpening(true);
      setAsideOpen(true);
      window.setTimeout(() => setAsideOpening(false), asideDuration);
    } else {
      setAsideClosing(true);
      window.setTimeout(() => {
        setAsideOpen(false);
        setAsideClosing(false);
      }, asideDuration);
    }
  }, [asideDuration]);

  const value = useMemo<AbPageContextValue>(
    () => ({
      isAsideOpen,
      isAsideOpenOnMobile,
      asideDuration,
      asideElement,
      setAsideElement,
      isAsideOpening,
      isAsideClosing,
      isAsideLoading,
      setAsideOpen: setAsideOpenSafe,
      setAsideOpenOnMobile,
      setAsideLoading,
    }),
    [
      isAsideOpen,
      isAsideOpenOnMobile,
      asideDuration,
      asideElement,
      setAsideElement,
      isAsideOpening,
      isAsideClosing,
      isAsideLoading,
      setAsideOpenSafe,
    ],
  );

  return <AbPageContext.Provider value={value}>{children}</AbPageContext.Provider>;
}

/**
 * Hook contract used by client AbAsideLayout.
 * Returns safe defaults when used outside AbPageProvider.
 */
export function useAbPage(): AbPageContextValue {
  return useContext(AbPageContext);
}

export default AbPageProvider;
