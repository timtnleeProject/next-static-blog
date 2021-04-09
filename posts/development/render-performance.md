分享在 prototyping 一頁可以展開/收合群組的 table，其中優化的過程和發現。

## 先說結論

> Dom nodes/elements 的數量對於渲染的效能有非常大的影響。

應該很多人早就知道過多的 Dom elements 會影響效能，不過這次經驗讓我有更具體的體會。

來看看下面的 gif

**一開始：卡頓、嚴重掉偵數**

![優化前，卡頓](https://imgur.com/fJnFHyf.gif)

**優化後：**

![優化後](https://imgur.com/zdJyXN9.gif)

## 故事

最近試做一個能收合的群組 table。

在做完初版後，隱約覺得有時候收合的動畫會卡頓。
因此我故意將 table 的資料放大 6 倍，也就是原本 `N` 筆資料變成 `6N` 筆資料：
在收合的時候很明顯感受到卡頓。

使用 Chrome dev tool > Rendering > Frame Redering Stats 的功能來觀察，可以看到嚴重的掉偵情況：

![掉偵](https://imgur.com/SC1GG7f.jpg)

### Css rendering performance

首先想到可以改進的地方是 Css rendering，
不清楚的話可以參考：
https://developers.google.com/web/fundamentals/performance/rendering

因為收合 (Collapse) 的功能是透過改變元素的高度 height 來達成，涉及到 layout 的改變，不難想像其造成的效能負擔是很大的，尤其是在元素非常多的時候：
其中一行 Collapse 的高度改變，所有的元素都需要 re-layout。

可是...要實現這種 Collapse 的效果又似乎只能透過改變容器的高度來達成。
我觀察了其他一些開源的 Collapse component，大方向也是透過改變高度來達成這個效果。

因此 Collapse 方面的實作應該沒有甚麼問題。

### Element 數量

造成這種效能瓶頸很大部分和 Dom 元素數量過多有關係，
這也是為什麼會需要 [react-virtualized](https://github.com/bvaughn/react-virtualized), [react-window](https://github.com/bvaughn/react-window) 這種 windowing 的功能，簡單來說：
創造一個列表容器，根據使用者 scroll 的位置來算出列表哪幾項需要轉成實際的元素，如下圖 (react-window 範例)：在很長的列表中，只會實際產生十個 Dom 元素

![windowing](https://imgur.com/SjOVT3a.jpg)

不過我想試試簡單的方法來改善，而非直接使用 library。

我發現，把每一行內的元素清空，改成一個僅有高度的空元素，僅此而已，Collapse 的動畫就順暢許多。
因此我使用 `IntersectionObserver`，每一行在靠近 viewport 或顯示時才渲染內容，否則清空。

![靠近 viewport 或顯示時才渲染內容](https://imgur.com/IIC0MNJ.jpg)

實測減少元素後，動畫偵數提升許多
![優化結果](https://imgur.com/OoVCeko.jpg)

## Codesandbox

提供兩個 codesandbox 實際範例，有興趣可以玩玩看：

### 範例一：卡頓

<iframe src="https://codesandbox.io/embed/rbac-table-v2-laggy-hv8gj?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="rbac table v2 laggy"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### 範例一：優化後

<iframe src="https://codesandbox.io/embed/rbac-table-v2-optimized-ckch6?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="rbac table v2 optimized"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

從這個例子可以展示：Dom 元素數量對渲染效能影響不能輕忽，當然我只是用很粗劣簡單的方法：只減少 row 裡面的元素，並沒有實際減少 row 的數量，如果今天資料量成長到 `12N`、`20N`...這個方法是撐不住的，這時候就勢必要用到 windowing 的技術。

這也是為什麼網頁會需要分頁、一頁不適合呈現過多資料，除了考慮到後端回應的負荷和時間，前端頁面的效能也會是問題。
