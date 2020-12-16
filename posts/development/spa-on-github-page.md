相信大家一定都有用 Github Pages 發布網頁的經驗，那麼如果今天寫的是像 Vue, React 這種 SPA (Single Page Application) 要如何使用 Github Pages 發布，以及需要注意的地方？

## 專案結構

我們要 deploy 的內容是 build 完的靜態檔案，而不是 source code。
因此通常會將 source code 放在 `master`、 `main` 或其他 branch，然後將 GitHub Pages 設定在 `gh-pages` 分支。

![Not found](/images/development/spa-on-ghpage/gh-setting.jpg)

這樣我們只要將 build 好的檔案丟到 `gh-pages` 分支就可以囉。

## gh-pages

你可能會想：
每次發布都要手動 build 加上把檔案搬到 `gh-pages` branch 並且 push 到 github，也太麻煩了吧！

幸好有一個 npm package [gh-pages](https://www.npmjs.com/package/gh-pages#command-line-utility) 可以使用，幫助你進行相關操作。

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

如果沒有特別去設定，上述步驟完成後瀏覽網頁，可能會發生 `js`, `css` 檔案找不到的問題。
因為通常 SPA 打包會預設是 host 在 GitHub Pages 地
