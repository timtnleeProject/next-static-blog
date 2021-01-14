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

為了解決純 CSR 的問題，出現了 SSR + CSR 的技術
可以稱做混合式 SSR、Universal SSR, Rehydration。

**先 SSR 產生 HTML 內容，到瀏覽器（前端）再注入（_Hydrate_）Javascript Code，由 CSR 掌控後續頁面的渲染。**

好處是一開始就有頁面內容，後續也可以交由 CSR 產生豐富的互動性。

## SSR + CSR 架構

這段來簡單看一下 SSR + CSR 這種架構會是什麼樣子。

假設，我們有一個 React 的 SPA 專案，並且有使用前端 router
想要實作混合式 SSR
我們需要一個負責 Server-Side Rendering 的 server：

- 稱作 **rendering server**。
- 根據不同的 path，伺服器端讀取 SPA 的架構, 將 React components 渲染成 string 然後產生 html。
- 因為要讀取前端 Code 轉 string，所以通常也是 Js runtime => 使用 NodeJS。

### rendering server minimal sample

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

### Universal Application

以上只是是一個很簡易的範例，實作上會遇到許多問題，例如：

- 如果 css 是靠 js 加載，例如使用 webpack style-loader 塞在 style tag，那直到 JS 載入之前，頁面會是沒有 Css 的狀態
- 整合處理前端 Routing。
- 整合 Redux 等 state 管理。
- 處理資料：有些頁面資料並不是靜態，而是要透過 API 或 DB Query 等取得資料之後才能渲染出頁面內容，Hydrate 的時候 Component 也要能拿到資料。
- ...

如果有興趣自己實作看看，有找到這篇算很詳細的教學：
https://medium.com/%E6%89%8B%E5%AF%AB%E7%AD%86%E8%A8%98/server-side-rendering-ssr-in-reactjs-part1-d2a11890abfc

總而言之，要時做 rendering server + 現有 SPA 還是非常麻煩且有難度的

## Multi Page Application (MPA), Server Side Rendering (SSR)

在前端框架還未流行前，這時候的 Web 開發模式，就先統稱作 MPA 吧
通常都是走 MVC 等等的架構
MAP 使用 SSR: server 根據不同請求(path)，使用所謂的 template 來組合不同的資料，渲染出不同的 _View_ 回傳給使用者

例如 PHP, ASP, JSP, nodejs express 等等......

這種模式的特色：有很快的 FCP(First Contentful Paint)，邏輯多在後端處理，少了許多 js code size, 因此 Time to Interactive (TTI) 也短

但是有比較長的 Time to First Byte (TTFB)，因為要在 server 處理比較多邏輯和 render 頁面

![](https://i.imgur.com/ZQjsUf7.png)

---

## SPA

隨著前端的技術和需求越來越複雜
為了更好的開發者體驗和前端使用者體驗，SPA 也變得廣泛
SPA 的優點我想大家應該多少知道，這邊就先不詳細講囉

在 SPA 架構裡是前後端分離的,採用的是完全的 CSR (Client side rendering)

不管使用者請求甚麼跟網頁有關的 path，都會回傳 frontend 打包好的檔案
瀏覽器再執行 JS 根據不同 path 渲染出頁面
如果需要後端資料透過 ajax 向後端 API 請求。
因此現在後端就沒有處理 View 的部分了而是純粹的 API。
控制資料和視圖的部分全部變成在前端處理

---

## Universal Rendering, SSR, SSR with rehydration

SPA 最大的問題在於 FCP 時間較長 (這個部分後面 performance 會說到)
還有就是 SEO 方面的問題, 因為一開始取得的 html 頁面只定義了需要的檔案和一些 meta 屬性，要等 JS 載入運行才會有內容，因此會有爬蟲爬到空白頁的問題。

所以後來又出現一種解決方法
他是**混合**式的，時同結合了 **SSR + CSR**。

Server 會根據不同路徑產生不同的頁面送往 client 端，在 client 端加載完 JS 之後，後續就是交給 CSR 了。
這樣的好處是一開始拿到的頁面就有內容，而後續操作上又能接續 CSR/SPA 的體驗

有很多名稱稱呼這種混合式的 rendering: 像是 Universal Rendering, SSR with rehydration...等等 有很多名字
感覺現在其實沒有一個很統一，有共識的名字來稱呼這種模式，所以在網路上還是很多人會直接講 SSR，但這樣比較容易跟前面講到的純 SSR 搞混

所以我們要知道這種混合式 SSR 的重點在於: 他是

- 結合了 SSR + CSR
- 是為了解決 SPA/純 CSR 的一些 Drawback

---

## SSR

---

## Progressive Hydrate

https://addyosmani.com/blog/rehydration/
https://github.com/GoogleChromeLabs/progressive-rendering-frameworks-samples

---

Render it as an HTML string on the server
Send the rendered HTML string to your users as source code
Send your React code as JavaScript to your users
And then finally “hydrate” your HTML using your React code

這種 SSR 如何實現：
server render HTML string 並回傳，使用者在第一時間就能看到內容而不是空殼。
等到 React, 或是其他 CSR code 載入並執行後，"hydrate" html ，JS take control，變成 Client side rendeing APP，

Hydrate:

所謂的 hydrate 是甚麼意思呢，
我們知道普通 react dom 的 render function，接收一個 dom element, 和要 render 的 component
React 會找到這個 element (id=root) 然後將 render element 塞進去

如果用在 SSR 的話，即使一開始 root 裡面已經有 element，render 還是會全部砍掉重新塞 (重新 re-render)，這樣很不 efficiency(尤其是 Dom 很複雜的時候)。
因此後來有所謂的 hydrate。
hydrate 就是告訴 react，render DOM node (id=root) 的結構和之後 React 將要 render 出來的結構是一樣的，所以請你不要全部 re-render。
react 會去檢查結構是否相符，然後加上對應的 event listener 後，網頁才變成 interactive.

Hey React, here’s some HTML that matches exactly what you would render if I told you to render in an empty DOM node, please do not re-render everything, instead, please just use the HTML as if you had rendered it and carry on with your day
React will answer
Ok, I just looked at you HTML and it seems to match exactly what I would have rendered. It’s cool. I’ll just attach some event handlers to your DOM and your page now acts as a single page application like I did it all myself in the first place.

---

- Css (如果 css 是靠 js 加載，例如 style-loader 塞在 style tag，會有些問題)
- Route: 要處理 Route
- Redux: 怎麼整合 Redux
- Init Page Data： 有些頁面資料並不是一開始就寫死了，而是要透過 API 取得之後才呈現，例如文章列表。在 rendering server 就要先準備好資料並 render
  ...

一般的 Hydration 都是從一個 root 下去整個 Hydrate
Partial Hydrate 不一樣的地方在於
一開始整個頁面一樣 SSR Render 出來
但之後他只去 Hydrate 需要互動的 component
