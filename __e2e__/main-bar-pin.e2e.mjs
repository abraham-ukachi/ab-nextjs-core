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
* @name: main bar pin e2e (0.2.3)
* @file: __e2e__/main-bar-pin.e2e.mjs
* @type: E2E script
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🧪 0.2.3 (God 04:16): a REAL browser check of mainBarPin="always" at 390 / 900 / 1440.
//    Run against an app whose AbMainLayout has a tall content + mainBar with mainBarPin="always"
//    (AbAppLayout asideBelow="inline-in-main" asideDrawerAt="mobile"):  AB_E2E_URL=http://localhost:3217/bar node __e2e__/main-bar-pin.e2e.mjs
import { chromium } from 'playwright-core'; // 🎭

const URL = process.env.AB_E2E_URL ?? 'http://localhost:3217/bar'; // 🌐
const CHROME = process.env.CHROME ?? '/usr/bin/google-chrome'; // 🧭
const BAR = '[data-ab-part="main-bar"]'; // 🔚
let failed = 0; // ❌
const check = (name, ok, extra = '') => { console.log(`${ok ? '✅' : '❌'} ${name}${extra ? ` (${extra})` : ''}`); if (!ok) failed++; }; // 🧾
const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] }); // 🚀

for (const [w, h] of [[390, 844], [900, 1000], [1440, 900]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, hasTouch: w < 768 }); // 📐
  await page.goto(URL, { waitUntil: 'networkidle' }); await page.waitForTimeout(200);
  // 📜 scroll the bar's real scroller to its middle
  const m = await page.evaluate((sel) => {
    const bar = document.querySelector(sel); let s = bar.parentElement
    while (s && !(/(auto|scroll)/.test(getComputedStyle(s).overflowY) && s.scrollHeight > s.clientHeight)) s = s.parentElement // 🔎
    s = s ?? document.scrollingElement
    s.scrollTop = (s.scrollHeight - s.clientHeight) / 2 // 🎯 middle
    const b = bar.getBoundingClientRect(); const r = s.getBoundingClientRect()
    const hit = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2) // 👆
    const root = bar.closest('.AbAppLayout')
    return { part: s.dataset.abPart ?? s.className.split(' ')[0], top: s.scrollTop, max: s.scrollHeight - s.clientHeight, barBottom: b.bottom, scBottom: Math.min(r.bottom, innerHeight), barH: b.height, hitBar: !!hit?.closest(sel), inMain: !!bar.closest('main'), tag: bar.tagName,
      pos: getComputedStyle(bar).position, bg: getComputedStyle(bar).backgroundColor, pad: getComputedStyle(bar).padding, varH: getComputedStyle(root).getPropertyValue('--ab-main-bar-h').trim(), spb: getComputedStyle(s).scrollPaddingBottom, label: bar.getAttribute('aria-label'), pin: bar.dataset.mainBarPin, rootPin: root?.dataset.mainBarPin }
  }, BAR);
  console.log(`== ${w}×${h}`, JSON.stringify(m))
  check(`${w}: scrolled to the middle of a real scroller`, m.top > 0 && m.top < m.max, `${m.part} ${Math.round(m.top)}/${m.max}`)
  check(`${w}: bar flush with the scroller bottom`, Math.abs(m.barBottom - m.scBottom) <= 1, `${m.barBottom} vs ${m.scBottom}`)
  check(`${w}: elementFromPoint over the bar hits the bar`, m.hitBar)
  check(`${w}: <footer> still inside <main>, labelled, pinned on bar + root`, m.tag === 'FOOTER' && m.inMain && m.label === 'Slide controls' && m.pin === 'always' && m.rootPin === 'always')
  check(`${w}: --ab-main-bar-h published = bar height, used as scroll-padding-bottom`, m.varH === `${Math.round(m.barH)}px` && m.spb === m.varH, `${m.varH} / ${m.spb}`)
  check(`${w}: opaque background`, !/rgba\(.*, 0\)$|transparent/.test(m.bg), m.bg)
  if (w < 768) { // 📱 the drawer covers the bar
    await page.click('[data-ab-part="aside-drawer-trigger"]'); await page.waitForSelector('[data-ab-part="aside"][data-open-on-mobile="true"]'); await page.waitForTimeout(300)
    const cov = await page.evaluate((sel) => { const b = document.querySelector(sel).getBoundingClientRect(); return [[b.x + 8, b.y + b.height / 2], [b.right - 8, b.y + b.height / 2]].map(([x, y]) => { const e = document.elementFromPoint(x, y); return { bar: !!e?.closest(sel), aside: !!e?.closest('[data-ab-part="aside"]'), backdrop: !!e?.closest('[data-ab-part="aside-backdrop"]') } }) }, BAR)
    check(`${w}: open drawer covers the bar (scrim left, drawer right)`, cov.every((c) => !c.bar) && cov[0].backdrop && cov[1].aside, JSON.stringify(cov))
  }
  await page.close()
}
await browser.close()
console.log(failed ? `\n❌ ${failed} main-bar check(s) failed` : '\n✅ all main-bar checks passed')
process.exit(failed ? 1 : 0)
