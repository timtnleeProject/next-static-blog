分享最近在做一頁可以展開/收合群組的 table，其中優化的過程和發現。

## 先說結論

> Dom nodes/elements 的數量對於渲染的效能有非常大的影響。

應該很多人早就知道過多的 Dom elements 會影響效能，不過這次經驗讓我有更具體的體會。

來看看下面的 gif

**一開始：卡頓、嚴重掉偵數**

![優化前，卡頓](https://imgur.com/fJnFHyf.gif)

**優化後：**

![優化後](https://imgur.com/zdJyXN9.gif)

## 故事

## Codesandbox

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
