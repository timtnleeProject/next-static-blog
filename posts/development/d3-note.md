![404](/images/d3_note/ex.jpg)

之後開發有個需求是在靜態地圖上標座標，點擊顯示該區域相關資訊，因此要先 survey 一下這個靜態地圖座標的功能。後來我決定使用 D3，順便複習一下。

## D3

之前有寫過一點點 D3 但沒有好好整理，現在回頭看已全部忘記...

其中我覺得最重要的基本觀念應該是 D3 selection，參考[這篇][d3 ref]務必要釐清觀念。

原文解釋詳盡，如果忘記可以回去看，這邊稍微整理一下

## D3 Basic

### Grouping Elements

你可能以為 D3 的 selections 是一組 Dom Elements ，但實際上 selections 是 Aarray 的 subclass，提供例如 `attr` 和 `style` 對元素操作的方法，同時也繼承了 Array 的方法像是 `array.forEach`。

另外，selections 是 _arrays of arrays_ ，一個 selection 包含一組 group，一組 group 裡面有一組/多組 elements。

```javascript
d3.select("body");
```

![404](/images/d3_note/s1.jpg)

`d3.selectAll` 則是一組 group 裡面包含多個 elements

```javascript
d3.selectAll('h2)
```

![404](/images/d3_note/s2.jpg)

那什麼情況下 selections 會才有多組 group ? 只有呼叫 `selection.selectAll` 時才會。

```javascript
d3.selectAll("tr").selectAll("td");
```

![404](/images/d3_note/s3.jpg)

當對 selection 呼叫 selectAll，每個在原先 group 裡的 element 變成新的 selection 的 group ([原文][d3 ref]有動畫)。

### Non-Grouping Operations

只有 selectAll 才有以 grouping 為主的特殊操作。

select 因為只有一個元素，且會將 parent 的資料傳遞給 child，但 selectAll 不會 (因此需要 data-join)

### Null Elements

如果沒有匹配的元素則會用 null 填充並且被大部分操作忽略。

![404](/images/d3_note/null.jpg)

### Bound to Data

D3 將綁定的 data 存在 Dom 元素的 `__data__` 屬性

```javascript
//綁定資料
d3.select("body").datum(42);
```

```javascript
//前面提到 select 會自動 propagate data, 因此 div 也綁定 42
d3.select("body").append("div");
```

### What is Data

預設 elements 與 data 對應是使用 index

![404](/images/d3_note/d1.jpg)

也可以在綁定時傳入 key function 來改變映射的方式，每個 group 都是獨立的，只需要注意同個 group 裡的 key 不要重複。

![404](/images/d3_note/d2.jpg)

以上的範例假設 elements 和 data 完全符合，如果不是的話？因此我們需要下面幾種操作。

### Enter, Update and Exit

- Update - There was a matching element for a given datum.
- Enter - There was no matching element for a given datum.
- Exit - There was no matching datum for a given element.

Update, exit**都是 selections**， enter 則是 selections 的 subclass

![404](/images/d3_note/data.jpg)

```javascript
const div = d3.selectAll("div").data(vowels, name);
```

`selection.data()` 返回的就是 Update

![404](/images/d3_note/update.jpg)

```javascript
div.exit();
```

![404](/images/d3_note/exit.jpg)

```javascript
div.enter();
```

![404](/images/d3_note/enter.jpg)

### Merging Enter & Update

更新的流程中，我們需要移除 exiting element，新增 entering element，並可能更改 updating elements 的一些屬性。

為了簡化這個流程，`enter.append` 有一個方便的特性，他會將 update selection 的 null elements 替換為新的 element，讓你一次操作所有現在符合資料的 elements。

```javascript
selection.data(data).enter().append();
```

### Pie chart 範例

![404](/images/d3_note/pie.jpg)

一個畫圓餅圖的範例 (使用 d3 的 [ESModules](https://github.com/d3/d3))
大多數的 d3 圖都是這個順序：
選定元素 => (新增圖層) => 綁資料 => 輔以 d3 function 幫助運算 path 或座標 => append 和繪製

`pie`, `arc` 幫忙算出角度和產生 path

```javascript
import { pie, arc, select, scaleLinear } from "d3";

const data = [1, 3, 7, 15];
const width = document.querySelector(".pie-chart-wrap").clientWidth;
const r = width * 0.4;

/* 使用 scaleLinear 定義顏色
   color(0); -> "rgb(165, 42, 42)"
*/
const colors = scaleLinear().domain([0, 3]).range(["brown", "steelblue"]);

const p = pie();
const a = arc().innerRadius(0).outerRadius(r);

const angles = p(data);

select("#pie-chart")
  .attr("width", width)
  .attr("height", width)
  .append("g")
  // v 這個很重要 有時候圖出不來是圖層跑掉
  .attr("transform", `translate(${width / 2}, ${width / 2})`)
  .selectAll("path")
  .data(angles)
  .enter()
  .append("path")
  .attr("d", a)
  .attr("stroke", "black")
  .attr("fill", function (_d, i) {
    return colors(i);
  });
```

## 雜項整理

### 垂直 text

svg text 垂直可設置 attribute `writing-mode`: `tb` (top-bottom)，中文可達成完全垂直，
或是單純用 transform 轉方向

## 靜態地圖

因為是靜態地圖，不是像 Google map 那樣是動態的，感覺是簡單許多。

可以下載一張地圖，然後把座標圖示根據經緯標示就好了。但是這種方式必須要知道下載的地圖圖片經緯度詳細的範圍才能準確標點。

之前看過 D3 有處理地理位置的範例，因此想使用 D3 來時做一個簡單的範例。

參考資料：

- [如何用 D3.js 繪製地圖][l1]
- [d3+vue][l2]

### d3-geo

使用 [d3-geo][geo] 來繪製地圖。

### GeoJSON

包含地理資訊的 Json 檔案，可使用如 shapefile 或 topojson 等套件，將 SHP (Shapefile) 檔並輸出成 GeoJSON 格式。

### projection

投影，決定你的地理資訊以何種投影方式呈現

```javascript
const projection = d3.geoMercator().center([122, 24]).scale(6000);
```

### path

傳入 GeoJSON ，會回傳 svg 繪製路徑

呼叫 d3.geoPath 會回傳 path

```javascript
//Creates a new geographic path with specific projection
const path = d3.geoPath(projection);
```

### 繪製地圖

```javascript
d3.json("./taiwan.json", function (err, json) {
  d3.select("svg")
    .selectAll("g")
    .data(json.features) //這個例子的 GeoJSON 地理資訊存在 features 屬性
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke", "black");
});
```

### 標示出準確經緯度位置

給定經緯度 `[121.5648,25.0346]` (台北)，如何在剛剛地圖上標示出準確位置?

可以利用 projection, 文件說明：

> projection(point) <>
>
> Returns a new array [x, y] (typically in pixels) representing the projected point of the given point. The point must be specified as a two-element array [longitude, latitude] in degrees. May return null if the specified point has no defined projected position, such as when the point is outside the clipping bounds of the projection.

利用我們已經創建的 projection 便可在地圖上標示位置

```javascript
const point = [[long, lat]];
d3.select(".map")
  .selectAll()
  .data(point)
  .enter()
  .append("img")
  .attr("class", "marker")
  .attr("src", "mark.png")
  .style("left", function (d) {
    return projection(d)[0] / 6 + "%";
  })
  .style("top", function (d) {
    return projection(d)[1] / 6 + "%";
  });
```

上面除以 6 是因為 svg viewbox 是 600x600，換算成實際元素的 position %

```css
.map {
  position: relative;
  width: 100%;
  max-width: 900px;
  border: 1px dotted lightgray;
}
.marker {
  position: absolute;
  display: block;
  width: 5%;
  height: 5%;
  max-width: 30px;
  max-height: 30px;
  transform: translate(-50%, -100%);
}
```

另外 svg scaling 可以看[這篇](https://css-tricks.com/scale-svg/)

![404](/images/d3_note/ex.jpg)

完整[範例](https://timtnleeproject.github.io/static-demo/d3-geomap-2.0.0/index.html)，和[程式碼](https://github.com/timtnleeProject/static-demo/tree/master/d3-geomap-2.0.0)

[d3 ref]: https://bost.ocks.org/mike/selection/
[l1]: http://blog.maxkit.com.tw/2016/06/d3js.html
[l2]: https://ithelp.ithome.com.tw/articles/10197467
[geo]: https://github.com/d3/d3-geo#d3-geo
