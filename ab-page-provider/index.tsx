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

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

export interface AbPageContextValue {
  /** 📜 0.1.6 (G55): the main pane's scroller (AbMainLayout's content wrapper), e.g. `useAbScrollSpy({ root })`. */
  mainScrollElement: HTMLElement | null;
  /** 📜 0.1.6 (G55): the aside pane's scroller. */
  asideScrollElement: HTMLElement | null;
  /** 🔗 ref callbacks used by AbMainLayout / AbAsideLayout. */
  setMainScrollElement: (el: HTMLElement | null) => void;
  setAsideScrollElement: (el: HTMLElement | null) => void;
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
  /** 🆔 0.1.6: id of the aside element (for `aria-controls` on the TOC / »« buttons). */
  asideId: string;
  /** 🔁 0.1.6: flip the laptop+ aside (»/« toggle). */
  toggleAside: () => void;
  /** 📱 0.1.6: flip the mobile/tablet aside sheet (TOC button). */
  toggleAsideOnMobile: () => void;
}

/** 🎞️ 0.1.6: aside slide duration (brief §4: slide-from-right 240ms). */
export const AB_ASIDE_DURATION = 240;
/** 📐 0.1.6: below this the aside is a sheet driven by `isAsideOpenOnMobile` (mobile + tablet). */
export const AB_ASIDE_SHEET_QUERY = '(max-width: 1023px)';
/** ♿ reduced-motion query (same string as ab-nextjs-hooks' AB_REDUCED_MOTION_QUERY). */
export const AB_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// 🔍 one-shot media check (false on the server / without matchMedia)
const matches = (query: string): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(query).matches;

/**
 * ⏱️ getAbAsideDuration — the duration the open/close timers should use: `0` under reduced motion
 * (instant toggle, brief §1.4), otherwise the provider's duration.
 */
export function getAbAsideDuration(duration: number, reducedMotion: boolean): number {
  return reducedMotion ? 0 : Math.max(0, duration); // ♿ instant, never negative
}

const defaultValue: AbPageContextValue = {
  mainScrollElement: null,
  asideScrollElement: null,
  setMainScrollElement: () => {},
  setAsideScrollElement: () => {},
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
  asideId: 'ab-aside',
  toggleAside: () => {},
  toggleAsideOnMobile: () => {},
};

const AbPageContext = createContext<AbPageContextValue>(defaultValue);

export interface AbPageProviderProps {
  children?: ReactNode;
  /** Initial aside open state (default true so shells render visibly). */
  defaultAsideOpen?: boolean;
  /** 🎞️ slide duration in ms (default 240, 0.1.6; was 300). Reduced motion always makes it instant. */
  asideDuration?: number;
  /** 🆔 aside element id for `aria-controls` (default `'ab-aside'`). */
  asideId?: string;
}

/**
 * Minimal page contract for client AbAsideLayout (LYD useLydPage aside slice).
 * Not a port of LydPageProvider — only aside open/loading/element state.
 */
export function AbPageProvider({
  children,
  defaultAsideOpen = true,
  asideDuration = AB_ASIDE_DURATION,
  asideId = 'ab-aside',
}: AbPageProviderProps): ReactElement {
  const [isAsideOpen, setAsideOpen] = useState(defaultAsideOpen);
  const [isAsideOpenOnMobile, setAsideOpenOnMobile] = useState(false);
  const [isAsideOpening, setAsideOpening] = useState(false);
  const [isAsideClosing, setAsideClosing] = useState(false);
  const [isAsideLoading, setAsideLoading] = useState(false);
  const [asideElement, setAsideElementState] = useState<HTMLElement | null>(null);
  // 📜 G55: the two pane scrollers (state, so consumers re-render once they mount)
  const [mainScrollElement, setMainScrollElement] = useState<HTMLElement | null>(null);
  const [asideScrollElement, setAsideScrollElement] = useState<HTMLElement | null>(null);

  const setAsideElement = useCallback((el: HTMLElement | null) => {
    setAsideElementState(el);
  }, []);

  // ⏲️ 0.1.6 (James review): ONE pending open/close timer, so quick toggles never race
  const asideTimerRef = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(asideTimerRef.current), []); // 🧹 unmount

  const setAsideOpenSafe = useCallback((open: boolean) => {
    // ♿ 0.1.6: instant under reduced motion (no slide, no closing delay)
    const ms = getAbAsideDuration(asideDuration, matches(AB_REDUCED_MOTION_QUERY));
    window.clearTimeout(asideTimerRef.current); // 🛑 cancel the previous transition's timer
    if (open) {
      setAsideClosing(false); // 🔁 a close in flight is cancelled
      setAsideOpening(ms > 0); // 🎞️ only "opening" when it animates
      setAsideOpen(true);
      if (ms > 0) asideTimerRef.current = window.setTimeout(() => setAsideOpening(false), ms);
    } else if (ms === 0) {
      setAsideOpening(false); // 🔁
      setAsideClosing(false); // 🔁
      setAsideOpen(false); // ⚡ instant
    } else {
      setAsideOpening(false); // 🔁 an open in flight is cancelled
      setAsideClosing(true);
      asideTimerRef.current = window.setTimeout(() => {
        setAsideOpen(false);
        setAsideClosing(false);
      }, ms);
    }
  }, [asideDuration]);

  // 🔁 0.1.6: toggles for the »/« button (laptop+) and the TOC button (mobile/tablet sheet)
  const toggleAside = useCallback(() => setAsideOpenSafe(!isAsideOpen), [isAsideOpen, setAsideOpenSafe]);
  const toggleAsideOnMobile = useCallback(() => setAsideOpenOnMobile((v) => !v), []);

  // ⎋ 0.1.6: Escape closes the mobile/tablet sheet, unless an inner menu/dialog already handled it
  useEffect(() => {
    if (!isAsideOpenOnMobile) return; // 💤 only while the sheet is open
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return; // 🙅 an inner menu caught it (James review)
      setAsideOpenOnMobile(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isAsideOpenOnMobile]);

  // 🎯 0.1.6 (James review): move focus INTO the sheet when it opens, and back to the opener when it closes
  const sheetOpenerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isAsideOpenOnMobile) {
      sheetOpenerRef.current = document.activeElement as HTMLElement | null; // 💾 the TOC button
      const el = asideElement;
      if (el) {
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1'); // 🎯 focusable container
        el.focus({ preventScroll: true });
      }
    } else if (sheetOpenerRef.current) {
      sheetOpenerRef.current.focus?.({ preventScroll: true }); // ↩️ return focus
      sheetOpenerRef.current = null;
    }
  }, [isAsideOpenOnMobile, asideElement]);

  const value = useMemo<AbPageContextValue>(
    () => ({
      mainScrollElement,
      asideScrollElement,
      setMainScrollElement,
      setAsideScrollElement,
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
      asideId,
      toggleAside,
      toggleAsideOnMobile,
    }),
    [
      mainScrollElement,
      asideScrollElement,
      isAsideOpen,
      isAsideOpenOnMobile,
      asideDuration,
      asideElement,
      setAsideElement,
      isAsideOpening,
      isAsideClosing,
      isAsideLoading,
      setAsideOpenSafe,
      asideId,
      toggleAside,
      toggleAsideOnMobile,
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

/** 🎛️ What {@link useAbAsideToggle} returns: spread `props` on the button. */
export interface AbAsideToggle {
  /** 📐 true below 1024px (the aside is a sheet, driven by `isAsideOpenOnMobile`). */
  isSheet: boolean;
  /** 👀 is the aside shown for the current viewport? */
  expanded: boolean;
  /** 🔁 flip it for the current viewport. */
  toggle: () => void;
  /** ♿ `aria-expanded` + `aria-controls` + `onClick` for a toggle button. */
  props: { 'aria-expanded': boolean; 'aria-controls': string; onClick: () => void };
}

/**
 * 📑 useAbAsideToggle (0.1.6) — one toggle for the TOC button (mobile/tablet sheet) and the »/« button
 * (laptop+ pane). It picks the right state for the viewport and keeps `aria-expanded` / `aria-controls` right.
 */
export function useAbAsideToggle(): AbAsideToggle {
  const { isAsideOpen, isAsideOpenOnMobile, asideId, toggleAside, toggleAsideOnMobile } = useAbPage();
  // 📐 live viewport class (SSR: laptop+, so the server markup matches the default open pane)
  const [isSheet, setSheet] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(AB_ASIDE_SHEET_QUERY); // 📐
    const update = () => setSheet(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  const expanded = isSheet ? isAsideOpenOnMobile : isAsideOpen; // 👀
  const toggle = isSheet ? toggleAsideOnMobile : toggleAside; // 🔁
  return { isSheet, expanded, toggle, props: { 'aria-expanded': expanded, 'aria-controls': asideId, onClick: toggle } };
}

export default AbPageProvider;
