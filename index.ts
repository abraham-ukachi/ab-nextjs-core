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
* @name: Core - Package Catalog
* @file: index.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // import the whole core catalog
*    -|> import abCore from './index'
*    -|>
*    -|> // console.log(abCore.supportedCore)
*    -|>
*
*   2+|> // grab the catalog as a named import & filter it
*    -|> import { supportedCore } from './index'
*    -|>
*    -|> // console.log(supportedCore.filter((item) => item.kind === 'server'))
*    -|>
*/


/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/



// REACT types
// REACT hooks
// REACT components


// NEXT.JS types
// NEXT.JS hooks
// NEXT.JS components


// AB types
import type { CoreCatalogEntry } from './types'
// AB hooks
// AB components


// OTHER types
// OTHER hooks
// OTHER components




// ===== SUPPORTED CORE - PACKAGE CATALOG ===== //


// every core layout this package will ship, as a catalog entry
// (each one has a `name`, `file`, `kind` & `status` — implementations Pending)
const supportedCore: Array<CoreCatalogEntry> = [
  // ------ SERVER components ------
  { name: 'AbAppLayout', file: 'server/ab-app-layout/index.tsx', kind: 'server', status: 'Pending' },
  { name: 'AbScreenLayout', file: 'server/ab-screen-layout/index.tsx', kind: 'server', status: 'Pending' },
  { name: 'AbMainLayout', file: 'server/ab-main-layout/index.tsx', kind: 'server', status: 'Pending' },
  { name: 'AbAsideLayout', file: 'server/ab-aside-layout/index.tsx', kind: 'server', status: 'Pending' },

  // ------ CLIENT components ------
  { name: 'AbAppLayout', file: 'ab-app-layout/index.tsx', kind: 'client', status: 'Pending' },
  { name: 'AbScreenLayout', file: 'ab-screen-layout/index.tsx', kind: 'client', status: 'Pending' },
  { name: 'AbMainLayout', file: 'ab-main-layout/index.tsx', kind: 'client', status: 'Pending' },
  { name: 'AbAsideLayout', file: 'ab-aside-layout/index.tsx', kind: 'client', status: 'Pending' },
]


const abCore = { supportedCore }


// export `supportedCore` catalog as a named export
export { supportedCore }

// export the default catalog bag
export default abCore
