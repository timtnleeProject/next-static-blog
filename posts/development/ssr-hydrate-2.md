在上篇介紹了混合式 SSR 後，再來看 SSR 缺點及改進方法、不同的 Hydration 策略、以及從其他角度思考我們是否需要 SSR？

## 缺點

### TTI Delay

雖然頁面一開始就有內容，有了較快的 FCP
但是要等到 JS Bundle 加載完成並 Hydrate 頁面才能互動。

也就是 FCP 和 TTI 的時間拉長，這段時間內，使用者看到畫面，卻無法和頁面互動。

![使用者會有一段時間看的到畫面卻無法互動](https://imgur.com/da9Zvzd.jpg)

### events fire before hydration

有些 dom events 可能會比 JS Code 更早觸發

例如 image onLoad event，因為圖片已經被 render 在 html 上面
碰到類似情形就要用一些 work around 來抓取 events。
https://github.com/facebook/react/issues/15446

## Enhancement

為了有更好的 SSR + CSR 體驗，有以下的改進方式：

### Streaming Server

針對 rendering server，可以使用 streaming server 的形式。
