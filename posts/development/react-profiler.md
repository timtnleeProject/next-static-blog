這是一個非常簡單的例子，不過還是想要紀錄一下使用 React-Profiler 找到問題的過程。

今天發現某一頁的 Panel 打開和收合的時候有明顯的卡頓

![點擊後卡頓一下才打開/收合](https://imgur.com/Sr42M2f.gif)

直接看 Code 一時不知道問題在哪
所以需要 React Profiler 幫助觀察 component render 狀況。

## React Profiler

React 官網的介紹：

> collect timing information about each component that’s rendered in order to identify performance bottlenecks in React applications

簡單來說就是蒐集和呈現組件渲染的時間等資訊

可以參考官網的文件
https://zh-hant.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html

但是 profiler 工具[更新的很快](https://stackoverflow.com/questions/61120759/why-react-dev-tools-profiler-dont-show-me-component-props)，現在介面有些功能和文件描述的並不一致。


## Rreact Profiler 查看可能的 component render 問題

### 使用 Profiler

在瀏覽器打開開發工具的 Profiler 分頁，按下錄製按以開始/結束錄製。

![使用 Profiler](https://imgur.com/w1oCdyj.jpg)

只錄製我們要觀察的行為就好，避免不必要的雜訊；
例如我錄製了打開/收合 Panel 兩個動作的這一小段時間。

![React Profiler](https://imgur.com/GPl6nSK.jpg)

Profiler 主要分為三個部分：

#### Commit

右上角的 bars ，代表 commit phase： React 實際對 Dom 進行的改變

![Commit](https://imgur.com/bBPOJp6.jpg)

#### fiamegraph

中間區域的圖表，代表各個 components render 的時間，
灰色代表 component 在當個 commit phase 並沒有 render。
點擊 component 可以縮放 flamegraph 並且在右邊查看 detail。

![flamegraph](https://imgur.com/LqBiGMy.jpg)

#### detail

在最右邊，當點擊某個 commit 或 component 會在這裡顯示一些資訊。

### 設定

另外 Profiler 還有一些有趣的設定：
像是可以隱藏 render 時間小於多少 ms 的 component。

或者像是 **Record why each component rendered while profiling.**，可以告訴你 component 為何 render (Props Changed, Hooks changed...)，這項建議勾起來。

![Profiler setting](https://imgur.com/JNkehOX.jpg)

## 找到問題

可以看到 Commit phrases 有兩個特別耗時的區域，應該就是代表 Panel 打開/收合的延遲了：

![Commit](https://imgur.com/bBPOJp6.jpg)

這頁的結構大概長這樣

```jsx
const TableAccountList = (props) => {
  const { isOpen, open, close } = usePanel();
  const [accountId, setAccountId] = useState("");

  const handleOpen = (account) => {
    open();
    setAccountId(account.globalId);
  };
  return (
    <>
      <SelectableTable
        onOpen={handleOpen}
      />
     <PanelEdit accountId={accountId} isOpen={isOpen} />
    </>
  );
};
```

從第一個耗時的 commit 開始看，會發現打開 panel 時， `SelectableTable` 進行了不必要的 render，耗時 210 ms。
點擊 component 可以看到原因：
* Hooks changed
* Props changed: (onOpen)

![SelectableTable render](https://imgur.com/PkjOHjQ.jpg)

找到原因後進行修正：
* 將 `SelectableTable` 使用 `React.memo` 避免 re-render
* `handleOpen` 使用 `useCallback` 來 memoize

```jsx
const SelectableTable = React.memo((props) => {
  // ...
})

const TableAccountList = (props) => {
  const { isOpen, open, close } = usePanel();
  const [accountId, setAccountId] = useState("");

  const handleOpen = useCallback((account) => {
    open(); // this is already memoized (wrap with useCallback)
    setAccountId(account.globalId);
  }, [open]);
  return (
    <>
      <SelectableTable
        onOpen={handleOpen}
      />
     <PanelEdit accountId={accountId} isOpen={isOpen} />
    </>
  );
};
```
可以看到現在 `SelectableTable` 不會 re-render 了：

![現在 SelectableTable 不會 re-render 了](https://imgur.com/g566uqG.jpg)

使用體驗也順暢許多！

![打開/收合不會再卡頓](https://imgur.com/CrmqlDp.gif)

其實要解決 React 效能並不難，只是如果平常開發沒有注意，當專案開發到一定程度，組件結構變得複雜，再來查找這種效能問題就會很難從程式碼找出來。
這時候不妨使用看看 React Profiler 吧。