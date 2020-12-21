相信大家一定都有用 Github Pages 發布網頁的經驗，那麼如果今天寫的是像 Vue, React 這種 SPA (Single Page Application) 要如何使用 Github Pages 發布，以及需要注意的地方？

## 專案結構

我們要 deploy 的內容是 build 完的靜態檔案，而不是 source code。
因此通常會將 source code 放在 `master`、 `main` 或其他 branch，然後將 GitHub Pages 設定在 `gh-pages` 分支。

![Github Pages Setting](https://i.imgur.com/JZX0VE3.jpg)

這樣我們只要將 build 好的檔案丟到 `gh-pages` 分支就可以囉。

## gh-pages

你可能會想：
每次發布都要手動 build 加上把檔案搬到 `gh-pages` branch 並且 push 到 github，也太麻煩了吧！

幸好有一個 npm package gh-pages 可以使用，幫助你進行相關操作。
https://www.npmjs.com/package/gh-pages#command-line-utility

依照文件說明，你可以使用 npm script，例如：

```javascript
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

運行 `npm run deploy` 就可以在 build 完之後，將打包的資料夾(上例為 `/dist`) checkin 到 `gh-pages` branch 並且上傳 (git push)。

也可以結合 build 一起使用

```javascript
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

不過這樣每次要發布時都需要下一次指令，
再更進階一點的話，可以搭配 CI/CD 工具來達到每次 push 某個 branch 就自動幫你執行 deploy 的指令！
但是這塊我就沒有研究囉。

## 靜態檔案路徑

如果沒有特別去設定，上述步驟完成後瀏覽 Github PAges 網頁，可能會發生 `js`, `css` 檔案找不到的問題。
因為通常 SPA 打包通常預設 host 在網站根目錄，假設打包出的檔案長這樣：

```tree
dist_folder/
|-- index.html
|-- index.js
|-- index.css
```

`index.html` 會去引用 `/index.js` 、 `/index.css`。

但是在 GitHub Pages host 的網址會是 `https://<user>.github.io/<repo_name>/`
`/index.js` 會索引到 `https://<user>.github.io/index.js` => 404 NOT FOUND。
正確的網址要加上 sub path 才對： `https://<user>.github.io/<repo_name>/index.js`。

所以我們需要設定打包檔案引用的路徑為 `/<repo_name>/`，或者使用完整的網址 `https://<user>.github.io/<repo_name>/` 也可以。

每個框架/工具設定方式不同，這邊舉幾個例子：

### Vue Cli

用 **vue-cli** 創建的 **Vue2** 專案可以在 `vue.config.js` 裡面設定 `publicPath`

```javascript
// vue.config.js
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/<repo_name>" : "/",
};
```

### Create-React-App

可以參考 [官方文件](https://create-react-app.dev/docs/deployment/#github-pages)，在 `package.json` 設定 `homepage`。

### HtmlWebpackPlugin

如果是自己用 webpack 打包，使用 **HtmlWebpackPlugin**，可以設定 `option.publicPath` ([文件](https://github.com/jantimon/html-webpack-plugin#options))：

## 前端 Router Basename

和上面的問題發生原因一樣是路徑問題，前端 routing 的 path 無法正確處理。

這裡用 `react-router-dom` [官網的說明](https://reactrouter.com/web/api/BrowserRouter/basename-string)來看就很清楚了
需要設定 basename

> The base URL for all locations. If your app is served from a sub-directory on your server, you’ll want to set this to the sub-directory. A properly formatted basename should have a leading slash, but no trailing slash.

```jsx
<BrowserRouter basename="/calendar">
    <Link to="/today"/> // renders <a href="/calendar/today">
    <Link to="/tomorrow"/> // renders <a href="/calendar/tomorrow">
    ...
</BrowserRouter>
```

今天部署到 GitHub Pages 上是在 sub-directory: `/<repo_name>`，因此需要正確設定。

可以加上環境變數來區分本地開發和 production 版本

**Create-React-App + react-router-dom**

```jsx
const basename = process.env.REACT_APP_BASENAME; // 可以設定在 .env 相關檔案

ReactDOM.render(
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>,
  document.getElementById("root"),
);
```

**vue-router**

```javascript
export default new Router({
  mode: "history",
  base: process.env.BASE_URL, // 見 註1
  // ...
});
```

_註 1: Vue 的官網說明 環境變數_

> BASE_URL - 会和 vue.config.js 中的 publicPath 选项相符，即你的应用会部署到的基础路径。

## Fallback to index.html

(假設你的 SPA 有兩個 route `/`, `/about`，而且你的前端 routing 是使用 **history mode**)

到了這一步，你打開網頁，已經可以正常運作了，點擊連結也可以藉由前端 routing 渲染訪問 `/about`。

但是如果你直接訪問 `/about` 或是在非首頁重新整理，那麼頁面又會 404 NOT FOUND 了
因為 `https://<user>.github.io/<repo_name>/` 會返回 index.html
但是 `https://<user>.github.io/<repo_name>/about` 並沒有 about.html 這個檔案。

這是為什麼 SPA 部署都需要做 **fallback**
也就是所有找不到資源的路徑，都要回傳 index.html，然後再交由前端 router 來決定要渲染甚麼內容。

通常部署使用 nginx/Apache 等 web server 就是在上面設定 (可以參考 [create-react-app 文件](https://create-react-app.dev/docs/deployment/#serving-apps-with-client-side-routing))

那 GitHub Pages 要怎麼做 fallback 就比較 tricky，

### spa-github-pages

詳細方法在這個 repository

https://github.com/rafgraph/spa-github-pages

簡單來說

1. 當 Github Pages 找不到資源，會返回 `404.html`。
2. 你可以使用自己的 `404.html`，導轉到 `index.html` 並帶上一些參數 (訪問的路徑、 query string 等等)
3. `index.html` 使用這些參數來替換正確的網址，渲染前端頁面。

以上完成後，就解決 SPA 在 GitHub Pages 上的問題了！

## 總結

雖然是用 GitHub Pages 來示範，但其實以上的大方向都是 SPA Deploy 要注意、解決的問題，只是細節上實作不同而已。
主要就是

- 靜態檔案引用的相對路徑
- 前端 Router 的 Basename
- web server 要做 fallback

不過最近發現了更厲害可以用來放前端專案的服務，那就是 **Vercel**，之後有空會再介紹。

https://vercel.com/home
