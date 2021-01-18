之前一直沒去理解像是 NextJS, NuxtJS 等使用的「混合式 SSR」是什麼樣的技術以及原理，這次藉由簡報的機會釐清 SSR 的概念。

## Web rendering

先從網頁的渲染說起，主要參考這篇：

https://developers.google.com/web/updates/2019/02/rendering-on-the-web

以下是一些網頁效能相關的名詞，後續會引用：

- **TTFB**: Time to First Byte - seen as the time between clicking a link and the first bit of content coming in.
- **FP**: First Paint - the first time any pixel gets becomes visible to the user.
- **FCP**: First Contentful Paint - the time when requested content (article body, etc) becomes visible.
- **TTI**: Time To Interactive - the time at which a page becomes interactive (events wired up, etc).

### SSR

首先就是 **SSR: Server-Side Rendering**。

Server 根據請求來渲染不同的頁面內容 (html)，
頁面需要的資料由後端取得
前端通常只有一些簡單的頁面互動，因此 JS bundle size 較小。

SSR 可能需要一段時間來準備資料(較長的 TTFB)
但是有很快的 FCP 以及 TTI

![Server-Side Rendering performance](https://i.imgur.com/2hxkQJX.jpg)

### SSG / pre-rendering

**SSG: Server-Side Generation** 或者有人叫 **pre-rendering**。

在 Build time 的時候產生不同頁面，而非在 request 的時候及時產生頁面。

當頁面資料需要透過 API，DB Query 等操作動態取得要使用 SSR。

當頁面內容為靜態、不常更動、或是更動隨著 Code Change，便可以考慮使用 SSG。

![SSR vs. SSG](https://imgur.com/fD8aqdu.jpg)

### CSR

隨著前端功能和互動越來越複雜，我們需要 **Client-Side Rendering** 和 SPA 的架構來建構富有互動性的網頁：
像是 Angular, React 和 Vue 等等。

Server 只回傳沒有內容的 html，等到 JS 加載完成再根據不同 url 渲染頁面，後續的頁面變化也都是在前端，依賴 JS 來渲染頁面。

CSR 和 SPA 大幅增進了前端開發的體驗，以及頁面的互動性，但是缺點也隨之而出：

- 越來越大的 Javascript Bundle Size
- 一開始的頁面空白，需等 JS 加載執行才有內容，**有可能**不利 SEO

其中肥大的 Javascript Code，造成加載和執行的速度變慢
FCP, TTI 時間變長，意味著使用者有很長時間看到的是空白或者不完整、還無法互動的頁面。

![Client-Side Rendering performance](https://imgur.com/6TStrbe.jpg)

### SSR + CSR

為了解決純 CSR 的問題，出現了 SSR + CSR 的技術（或者 SSG + CSR）
可以稱做混合式 SSR、Universal SSR, Rehydration。

**先 SSR 產生 HTML 內容，到瀏覽器（前端）再注入（_Hydrate_）Javascript Code，由 CSR 掌控後續頁面的渲染。**

好處是一開始就有頁面內容，後續也可以交由 CSR 產生豐富的互動性。

## 關於 SSR + CSR

這段來簡單看一下 SSR + CSR 這種架構會是什麼樣子。

假設，我們有一個 React 的 SPA 專案，並且有使用前端 router，想要實作混合式 SSR
我們還需要一個負責 Server-Side Rendering 的 server：

- 稱作 **rendering server**。
- 根據不同的 path，伺服器端讀取 SPA 的架構, 將 React components 渲染成 string 然後產生 html。
- 因為要讀取前端 Code 轉 string，所以通常也是 Js runtime => 使用 NodeJS。

### rendering server minimal sample

一個簡易的 rendering server：

```javascript
// example with koa
import React from "react";
import Koa from "koa";
import Router from "koa-router";
import path from "path";
import fs from "fs";

// import spa root component
import App from "../client/App";
// import function for SSR
import { StaticRouter } from "react-router-dom";
import { renderToString } from "react-dom/server";

const app = new Koa();

const indexTemplate = fs.readFileSync(
  path.join(__dirname, "../clientBuild/index.html"),
  "utf-8",
);
app.get("(.*)", (ctx) => {
  const result = renderToString(
    <StaticRouter location={ctx.request.url}>
      <App />
    </StaticRouter>,
  );
  // should use index.html template
  const html = indexTemplate.replace(/#{content}/, result);
  ctx.body = html;
});

app.listen(3000);
```

- line 11, 12
  - `StaticRouter`, `renderToString` 分別是 `react-router-dom` 和 `react-dom` 提供的 SSR 方法。
- line 20 ~ 29
  - 可以看到這個 rendering server 根據不同 path 把對應的 component render 成字串，放進原本 html 的 SPA entry element。

以 HTML 來看，原本 SPA 的 HTML 長這樣：

```html
<html>
  <head>
    /* meta */
    <title>SSR Practice</title>
  </head>
  <body>
    <div id="root">/* Inject in here */</div>
    <script src="/bundle.js"></script>
  </body>
</html>
```

Server 呼叫 React `renderToString` 方法產生字串：

```html
<div>
  <h1>Home</h1>
  <ul>
    <li>Page1</li>
    <li>Page2</li>
  </ul>
</div>
```

塞進 HTML 對應的位置並回傳

```html
<html>
  <head>
    /* meta */
    <title>SSR Practice</title>
  </head>
  <body>
    <div id="root">
      <div>
        <h1>Home</h1>
        <ul>
          <li>Page1</li>
          <li>Page2</li>
        </ul>
      </div>
    </div>
    <script src="/bundle.js"></script>
  </body>
</html>
```

Client 會接收到完整內容的 HTML，並且當 CSR Code `/bundle.js` 載入之後再 **Hydrate** 網頁，使之變成可互動的 React Component。

### 什麼是 Hydrate？

所謂的 **Hydrate**, **Hydration** 指的是什麼？
和普通的 render 有什麼差異？

React-dom 提供了兩種將 React Component 注入 Dom 的方法
分別是 `render` 以及 `hydrate`
一個用在純 CSR，一個用於 SSR Rehydration

```javascript
ReactDOM.render(element, container[, callback]);
ReactDOM.hydrate(element, container[, callback]);
```

使用 `render`，任何存在於 container 的 DOM element 都會被替換。

但混合式 SSR 在 contaniner 裡面已經有 pre-render 的 DOM 結構，而且預期和之後 CSR render 的結構一樣，因此可以重複利用 DOM element。

`hydrate` 會去檢查既有的結構是否相符，並將相對應的事件加上，使之成為 CSR Component，而非像 `render` 直接替換掉整個 container 的 DOM element，相對起來更有效率。

這個動作就稱為**Hydrate**。

### Universal Application

以上的 rendering server 只是一個很簡易的範例，實作上會遇到許多問題，例如：

- 如果 css 是靠 js 加載，例如使用 webpack style-loader 塞在 style tag，那直到 JS 載入之前，頁面會是沒有 Css 的狀態
- 整合處理前端 Routing。
- 整合 Redux 等 state 管理。
- 處理資料：有些頁面資料並不是靜態，而是要透過 API 或 DB Query 等取得資料之後才能渲染出頁面內容，Hydrate 的時候 Component 也要能拿到資料。
- ...

如果有興趣自己實作看看，可以看看這篇詳細的教學：
https://medium.com/%E6%89%8B%E5%AF%AB%E7%AD%86%E8%A8%98/server-side-rendering-ssr-in-reactjs-part1-d2a11890abfc

總而言之，要時做 rendering server + 現有 SPA 還是非常麻煩且有難度的
而且 SPA 和 rendering server 高度耦合卻又分別開發，會需要互相妥協和修正。

因此出現了一種可以**同時開發兩者邏輯**的框架，稱作**Universal Application**
也就是我們熟悉的 NextJS (for React), NuxtJS (for Vue) 等。

非常推薦在了解 SSR + CSR 技術後去看看 [NextJS 文件](https://nextjs.org/docs/getting-started)，會對這種 Universal 框架有更深的瞭解。

更多內容以及參考資料請見下篇：
https://blog.timtnlee.me/post/development/ssr-hydrate-2
