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
* @name: Aside drawer e2e (real Chromium)
* @file: __e2e__/aside-drawer.e2e.mjs
* @type: E2E script
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🧪 0.2.3 (Joseph 02:55): a REAL browser check of the mobile right drawer (asideDrawerAt="mobile").
//    Run against any app that mounts AbAppLayout asideBelow="inline-in-main" asideDrawerAt="mobile" + an
//    AbAsideDrawerTrigger, WITH ab-nextjs-theme's styles.css (its layout main has z-index 99, the bug we guard):
//      AB_E2E_URL=http://localhost:3217/ pnpm test:e2e      (CHROME=/path/to/chrome to override the browser)
//    Exits 1 on the first failed check, so the old z-index (drawer 30 < main 99) fails at "hit-test drawer centre".

// 🎭 playwright-core drives a system Chrome (no browser download)
import { chromium } from 'playwright-core';

const URL = process.env.AB_E2E_URL ?? 'http://localhost:3217/'; // 🌐
const CHROME = process.env.CHROME ?? '/usr/bin/google-chrome'; // 🧭
const TRIGGER = '[data-ab-part="aside-drawer-trigger"]'; // 🔘
const ASIDE = '[data-ab-part="aside"]'; // 📑
let failed = 0; // ❌
const check = (name, ok, extra = '') => { console.log(`${ok ? '✅' : '❌'} ${name}${extra ? ` (${extra})` : ''}`); if (!ok) failed++; }; // 🧾

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] }); // 🚀
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true }); // 📱 phone
await page.goto(URL, { waitUntil: 'networkidle' });

// 🧰 helpers
const open = async () => { await page.click(TRIGGER); await page.waitForSelector(`${ASIDE}[data-open-on-mobile="true"]`); await page.waitForTimeout(300); }; // 🔓 (+ slide)
const isOpen = () => page.$eval(ASIDE, (a) => a.getAttribute('data-open-on-mobile') === 'true'); // 👀
const box = () => page.$eval(ASIDE, (a) => { const r = a.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }); // 📐
/** 🎯 what a tap at (x, y) really hits: inside the aside? the backdrop? */
const hit = (x, y) => page.evaluate(([x, y]) => { const el = document.elementFromPoint(x, y); return { aside: !!el?.closest('[data-ab-part="aside"]'), backdrop: !!el?.closest('[data-ab-part="aside-backdrop"]'), tag: el?.tagName ?? 'none' }; }, [x, y]);

// 1️⃣ closed: no playground in the page flow
check('closed: aside not rendered in the flow', await page.$eval(ASIDE, (a) => getComputedStyle(a).display === 'none'));

// 2️⃣ open + hit-tests (the z-index regression)
await open();
const b = await box();
const centre = await hit(b.x + b.w / 2, b.y + b.h / 2);
check('hit-test drawer centre lands in the aside', centre.aside, centre.tag);
const left = await hit(Math.max(4, b.x / 2), b.y + b.h / 2);
check('hit-test left of the drawer lands on the backdrop', left.backdrop, left.tag);
check('open drawer is a named modal dialog', await page.$eval(ASIDE, (a) => a.getAttribute('role') === 'dialog' && a.getAttribute('aria-modal') === 'true' && !!(a.getAttribute('aria-label') || a.getAttribute('aria-labelledby'))));
check('drawer is on the right edge', Math.abs(b.x + b.w - 390) < 2, `${b.x}+${b.w}`);

// 3️⃣ Esc closes + focus returns to the trigger
await page.keyboard.press('Escape'); await page.waitForTimeout(100);
check('Esc closes', !(await isOpen()));
check('focus returns to the trigger after Esc', await page.evaluate((s) => document.activeElement?.matches(s) ?? false, TRIGGER));

// 4️⃣ backdrop tap closes
await open(); await page.mouse.click(Math.max(4, (await box()).x / 2), 400); await page.waitForTimeout(100);
check('backdrop tap closes', !(await isOpen()));

// 5️⃣ a 60px+ right swipe closes (pointer events, like a finger)
await open();
const s = await box(); const y = s.y + s.h / 2; const x0 = s.x + 40;
await page.mouse.move(x0, y); await page.mouse.down(); await page.mouse.move(x0 + 40, y + 4); await page.mouse.move(x0 + 80, y + 6); await page.mouse.up();
await page.waitForTimeout(100);
check('80px right swipe closes', !(await isOpen()));
check('focus returns to the trigger after the swipe', await page.evaluate((sel) => document.activeElement?.matches(sel) ?? false, TRIGGER));

await browser.close();
console.log(failed ? `\n❌ ${failed} check(s) failed` : '\n✅ all drawer checks passed');
process.exit(failed ? 1 : 0);
