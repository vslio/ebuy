## 👋 e-μπάι - either buy, or μπάιιιι.

##### Project Setup

```sh
bun install
```

##### Run Locally

```sh
bun dev
```

##### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
bun test:unit
```

##### Notes

I pretty much implemented everything on the list:

- For mocking the api server I opted to use [msw](https://mswjs.io/) for the first time. This is fantastic as it allows you to use the native `fetch` or other libraries and `msw` just intercepts the request using a service worker and returns the mock data.

- Using a global state management solution wasn't really necessary for this project, but I decided to throw `Pinia` in the mix in order to hopefully showcase I have previous experience with it.

- I wrote a few (27) tests. I (believe I) wrote exhaustive tests for the API handlers. Due to time constraints, I only wrote tests for a few key Views and for the tiny `Pinia` store.

- The product listing API supports pagination and category filtering.

- I decided against using any css frameworks and instead keep it custom, with just the inclusion of `modern-normalise` for browser reset. In my opinion, it would've been an overkill for this project as it's relatively tiny, and there would've been a significant overhead. I used postcss with scoped stylesheets and just plain classes and nests. The site is responsive and mobile-first.

- I didn't add animations to the cart items, because it couldn't happen in a clean manner. That's due to the (conscious) use of tables for the cart item representation, as it's semantically more appropriate. `tr` and `td` items cannot be properly animated, only their contents.

- I didn't add a dark mode toggle due to time constraints, but I'm more than happy to chat about how I'd implement it. The site responds to the user's system-wide scheme preference, however I didn't enable it because I didn't like the contrast of the product photos against the dark background color. To enable the system-wide scheme preference theme you can uncomment a few lines of code in `src/assets/styles/base.css`:

```
/* Uncomment below to enable system-wide scheme preference */
/* @media (prefers-color-scheme: dark) {
  :root {
    --color-background: var(--vt-c-black);
    --color-heading: var(--vt-c-text-dark-1);
    --color-text: var(--vt-c-text-dark-1);
    --color-button: var(--vt-c-yellow);
    --color-button-text: var(--vt-c-text-light-1);
    --color-stroke: var(--vt-c-yellow);
  }
} */
```

##### Challenges

No big challenges with this project. I hadn't touched a frontend project in 1,5 years because I was working on a React Native product (though, technically, React Native is the closest you can get to frontend in the mobile space), so I needed a little refresher to pick up on `Vue`, `Pinia` and any changes I missed during this time. I also spent a little bit of time on `msw` for the setup and testing, but the documentation was great.

I don't remember the last time I had such a fun time with a challenge. Vue is always a breeze to work with (with its unparalleled DX) and the encouragement to mess about with animations / interactions was appreciated.

Looking forward to any feedback.

Thank you!
