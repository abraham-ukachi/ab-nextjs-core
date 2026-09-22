<p align="center">
  <!-- Ab - Logo - Light Mode --> 
  <a href="https://abraham-ukachi.vercel.app/#gh-light-mode-only" target="_blank">
    <img src="./.github/ab-logo-light.svg" alt="Ab Logo on Light" width="64" height="64" />
  </a>

  <!-- Ab - Logo - Dark Mode --> 
  <a href="https://abraham-ukachi.vercel.app/#gh-dark-mode-only" target="_blank">
    <img src="./.github/ab-logo-dark.svg" alt="Ab Logo on Dark" width="64" height="64" />
  </a>

  <!-- Next.js - Logo Name - Light Mode -->
  <a href="https://nextjs.org/#gh-light-mode-only" target="_blank">
    <img src="./.github/nextjs-logoname-light.svg" alt="Next.js LogoName on Light" width="192" height="64" />
  </a>

  <!-- Next.js - Logo Name - Dark Mode -->
  <a href="https://nextjs.org/#gh-dark-mode-only" target="_blank">
    <img src="./.github/nextjs-logoname-dark.svg" alt="Next.js LogoName on Dark" width="192" height="64" />
  </a>

</p>


<p align="center">
    <a href="https://ab-elements.vercel.app/docs/core" target="_blank"><b>Checkout abElements &rarr;</b></a>
</p>


# `ab-nextjs-core`

> IMPORTANT: This is a work in progress and subject to major changes until version 1.0.


🌱 A lightweight collection of server & client React components as core abElements (i.e. ab-app-layout, ab-screen-layout, ...) created by [Abraham Ukachi](https://github.com/abraham-ukachi), and optimized for [Next.js](https://nextjs.org/docs) applications 😎. 



## Tooling

This package targets **Next.js 16.3.4** / **React 19** (eslint 9 flat config + vitest).
Layout shells are **Done** (LYD-faithful slot API). Consumers must configure Tailwind so its content covers this package (CSS Modules use `@apply`).


Layout stylesheets are **plain CSS modules** (no Tailwind `@apply`) so Next/Turbopack consumers never hit CssSyntaxError expanding package CSS. Theme colors use CSS variables (`--color-background`, `--color-dark-background`, falling back to `--surface`).

Peer: `clsx`, `next@16.3.4`, `react@^19`, `react-dom@^19`.

Optional: wrap client `AbAsideLayout` with `AbPageProvider` / `useAbPage` for aside open state.

## Getting Started

### Installation

#### npm

```bash
npm i ab-nextjs-core 
```

#### pnpm

```bash
pnpm install ab-nextjs-core 
```

---


## Core Server Components

A list of all the supported **core server components** and their current status:

| No. | Name | File | Status |
|:----|:-----|:-----|:-------|
| 1 | *`AbAppLayout`* | **server/ab-app-layout/index.tsx** | Done |
| 2 | *`AbScreenLayout`* | **server/ab-screen-layout/index.tsx** | Done |
| 3 | *`AbMainLayout`* | **server/ab-main-layout/index.tsx** | Done |
| 4 | *`AbAsideLayout`* | **server/ab-aside-layout/index.tsx** | Done |



## Core Client Components

A list of all the supported **core client components** and their current status:

| No. | Name | File | Status |
|:----|:-----|:-----|:-------|
| 1 | *`AbAppLayout`* | **ab-app-layout/index.tsx** | Done |
| 2 | *`AbScreenLayout`* | **ab-screen-layout/index.tsx** | Done |
| 3 | *`AbMainLayout`* | **ab-main-layout/index.tsx** | Done |
| 4 | *`AbAsideLayout`* | **ab-aside-layout/index.tsx** | Done |




> NOTE:






## Imports

```ts
// catalog
import { supportedCore } from 'ab-nextjs-core'

// server layouts
import AbAppLayout from 'ab-nextjs-core/server/ab-app-layout'
import AbScreenLayout from 'ab-nextjs-core/server/ab-screen-layout'
import AbMainLayout from 'ab-nextjs-core/server/ab-main-layout'
import AbAsideLayout from 'ab-nextjs-core/server/ab-aside-layout'

// client layouts
import AbAppLayout from 'ab-nextjs-core/ab-app-layout'
import AbScreenLayout from 'ab-nextjs-core/ab-screen-layout'
import AbMainLayout from 'ab-nextjs-core/ab-main-layout'
import AbAsideLayout from 'ab-nextjs-core/ab-aside-layout'
import { AbPageProvider, useAbPage } from 'ab-nextjs-core/ab-page-provider'
```

> NOTE: `AbAppLayout` does **not** bake in sidebar/navbar/i18n — pass `sideBar` / `navBar` slots from the consumer. Content rule: `content ?? children`.

## Learn More abElements

To learn more about **`abElements`**, take a look at the following resources:

- [abElements Documentation](https://ab-elements.vercel.app/docs) - learn about `abElements` features and API.
- [abElements Animations](https://ab-elements.vercel.app/docs/animations) - learn about **animations** in `abElements`.
- [abElements Core](https://ab-elements.vercel.app/docs/core) - learn about **core** in `abElements`.
- [abElements Theme](https://ab-elements.vercel.app/docs/theme) - learn about **theme** in `abElements`.
- [abElements Icons](https://ab-elements.vercel.app/docs/icons) - learn about **icons** in `abElements`.
- [abElements Components](https://ab-elements.vercel.app/docs/components) - learn about **components** in `abElements`. 
- [abElements Fonts](https://ab-elements.vercel.app/docs/fonts) - learn about **fonts** in `abElements`. 
- [abElements Hooks](https://ab-elements.vercel.app/docs/hooks) - learn about **hooks** in `abElements`. 

You can check out [the abElements GitHub repository](https://github.com/abraham-ukachi/ab-elements-app) for more details.


## License

This **`ab-nextjs-core`** project is [MIT Licensed](./LICENSE) ;)



