https://blog.timtnlee.me/post/development/ssr-hydrate-1
在上篇介紹了混合式 SSR 後，再來看 SSR 缺點及改進方法、不同的 Hydration 策略、以及從其他角度思考我們是否需要 SSR？

## 缺點

### TTI Delay

雖然頁面一開始就有內容，有了較快的 FCP
但是要等到 JS Bundle 加載完成並 Hydrate 頁面才能互動。

也就是 FCP 和 TTI 的時間拉長，這段時間內，**使用者已經看到畫面，卻無法和頁面互動**。

![使用者會有一段時間看的到畫面卻無法互動](https://imgur.com/da9Zvzd.jpg)

### events fire before hydration

有些 dom events 可能會比 JS Code 更早觸發

例如 image onLoad event，因為圖片已經被 render 在 html 上面
碰到類似情形就要用一些 work around 來抓取 events。
https://github.com/facebook/react/issues/15446

## Enhancement

為了有更好的 SSR + CSR 體驗，有以下的改進方式：

### Streaming Server

針對 **rendering server**，可以採用 Streaming server 進行優化。

用 chunks 的方式送 html，讓瀏覽器可以漸進的去接收
不用等整份 html render 完成，會有比較快的 FP, FCP

以 React 為例，提供的 streaming server 方法為的 `renderToNodeStream()`
和 `renderTostring` 不同之處在於前者是非同步。

```javascript
http
  .createServer((request, response) => {
    const html = ReactDOMServer.renderToNodeStream(<App />);
    response.pipe(html);
  })
  .listen(3000);
```

### Web Performance

另一種是基本的前端 web performance 優化項目，旨在縮短 JS 加載的時間：

- **減少 JS Bundle Size**:
  - 移除不必要的 code, dependencies
  - 使用 tree shaking
- **Code Splitting**：按需來分次加載 Code
- 使用 **CDN** 部署
- 使用 **encoding** 來降低傳輸內容的大小，Ex: gzip。
- 最後還可以考慮 **PWA**，使用 service worker 來做 cache 的策略。

以上細節就不詳述囉～

## Different Hydration Strategies

另外還可使用不同的 Hydration 策略，像是

- Partial Hydration
- Progressive Hydration

以下是我有找到的一些介紹：

### Partial Hydration

Partial Hydration 就是**只 hydrate 需要互動的 components**，其他靜態的部分就沒有必要去 hydrate。

這篇有詳細的例子：
https://medium.com/@luke_schmuke/how-we-achieved-the-best-web-performance-with-partial-hydration-20fab9c808d5

### Progressive Hydration

Progressive Hydration 則是 **需要的時候才 hydrate**，例如在 onClick, onFocus 或者元件出現在 viewport 之內。

範例 repo：
https://github.com/GoogleChromeLabs/progressive-rendering-frameworks-samples

可以看到 [source code](https://github.com/GoogleChromeLabs/progressive-rendering-frameworks-samples/blob/82ccd045264753c11966c59bb63dcba76b8b9f5c/react-progressive-hydration/app/components/hydrator.js#L22) 使用了 `IntersectionObserver`，當 component 出現在 viewport 之內才會 hydrate 成 React Component。

普通的 Hydrate 是從整個 App root 下去 Hydrate 整個 Component，
而使用不同的 Hydration 方法：

- 只 Hydrate 部分 components
- 漸進式、需要的時候才進行 Hydrate

可以減少 JS Code size、和一開始 JS 加載時 Hydrate 的負擔。

## SEO

為何最後要講到 SEO
因為很多人使用 SSR + CSR 都是為了 SEO 考量，因此從 SEO 角度來看我們是否需要真的需要使用 SSR。

### CSR 不利於 SEO？

很多人的認知是純 CSR/SPA 因為頁面一開始空白，因此爬蟲爬不到內容。
但事實上現在很多搜尋引擎爬蟲，例如 Google，可以**運行 JS**，在頁面渲染之後再建立 index。

### Meta tags

在不同頁面加上適當的 mata tags, title tag, OG tag 都可以幫助爬蟲索引你的網站，而這些 SPA 也做得到 (例如使用 [react-helmet](https://github.com/nfl/react-helmet))。

### Dynamic rendering

![Dynamic rendering](https://imgur.com/V2NTrAZ.jpg)

還可以使用 dynamic rendering
假設我們可以用 user-agent 等資訊判斷出請求是使用者還是爬蟲
就可以根據如果是戶用就用 SSR + CSR
如果是爬蟲 直接回傳 SSR 靜態的頁面就可以了。

## 總結

SSR + CSR 的架構解決了純 CSR 的一些缺點，
但也有自己的議題要解決。

非常建議可以去看這支影片：
https://www.youtube.com/watch?reload=9&v=k-A2VfuUROg&ab_channel=GoogleChromeDevelopers
裡面提到 web rendering 像是一個光譜，你必需在 SSR 和 CSR 之間找到一個平衡。

## Reference

- https://developers.google.com/web/updates/2019/02/rendering-on-the-web
- https://medium.com/%E6%89%8B%E5%AF%AB%E7%AD%86%E8%A8%98/server-side-rendering-ssr-in-reactjs-part3-7f2097963754
- https://medium.com/@luke_schmuke/how-we-achieved-the-best-web-performance-with-partial-hydration-20fab9c808d5
- https://addyosmani.com/blog/rehydration/
- https://www.youtube.com/watch?reload=9&v=k-A2VfuUROg&ab_channel=GoogleChromeDevelopers
- https://github.com/GoogleChromeLabs/progressive-rendering-frameworks-samples
