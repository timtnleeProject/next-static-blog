最近有一個新的頁面需求，想說可以來試試看 Css-in-JS，選擇了很常見的 emotion。
https://github.com/emotion-js/emotion

結果意外的覺得好用，所以想簡單介紹一下使用方式和心得。

## emotion 安裝

參考：[emotion 文件](https://emotion.sh/docs/introduction)有詳細安裝步驟說明。

[安裝套件](https://emotion.sh/docs/introduction)
我是使用 React 所以安裝 `@emotion/css` 和 `@emotion/react`

```bash
npm i @emotion/css @emotion/react
```

## emotion 設定

emotion 提供了 `css` props，要使用的話需要一些設定。
目前 babel 遇到 jsx 語法，預設會編譯成 `React.createElement`

```javascript
<img src="avatar">
// To
React.createElement("img", { src: "avatar.png" });
```

我們需要告訴 babel，遇到 jsx 語法，使用 emotion 提供的 `jsx` 方法取代 `React.createElement`，這樣才能透過 emotion 編譯 css props：

```javascript
<img src="avatar">
// To
jsx("img", { src: "avatar.png" });
```

有兩種方法設定：

- Babel Preset
- JSX Pragma

### Babel Preset

在 .babelrc 設定
因應不同情境，詳細參考[文件](https://emotion.sh/docs/css-prop#babel-preset)

```json
{
  "presets": [
    [
      "@babel/preset-react",
      {
        "runtime": "automatic",
        "importSource": "@emotion/react"
      }
    ]
  ]
}
```

### JSX Pragma

第二種，如果你沒辦法設定 babel (例如使用 create-react-app)，可以在 file 定義 JSX pragma

```javascript
/** @jsx jsx */
import { jsx } from "@emotion/react";
```

這段註解告訴 babel 使用定義的 `jsx` 取代預設的 `React.createElement`

## babel plugin、eslint

另外可以安裝以下幫助開發：

- [安裝 @emotion/babel-plugin](https://emotion.sh/docs/@emotion/babel-plugin)：結合 babel，有一些優化功能和多支援的 styled 語法。
- [安裝 @emotion/eslint-plugin](https://emotion.sh/docs/@emotion/eslint-plugin)：整合 eslint。

## VSCode extension

**這個非常重要**，Css in JS 基本上只是一串 string，在編寫開發的時候會很痛苦。
因此要在 vscode 安裝 Css-in-JS 相關的 extension，幫助 syntax hightlight 以及 auto-complete。

我是選擇 [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components)

![Css in JS with syntax hightlight](https://imgur.com/xHmw0eS.jpg)

## 使用心得

emotion 提供了不只一種的 styled api，建議可以去文件看一遍，自己也還不是每種都會使用。

完成設定後，配合 extension，還有 eslint + prettier 設定
個人覺得：使用 Css-in-JS 開發真的非常快速且愉悅！在 JS 裡面寫 Css 意外的非常直覺化。

有些人可能覺得 Css in JS 很醜，不過說真的分開寫 css 又有多少人能寫的乾淨整齊，而且定義 class、 比對 js code 和 css/scss file 也是很痛苦的事。

`@emotion` 用了非常有感，非常推薦一試。
