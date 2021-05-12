一開始使用 [formatJS](https://formatjs.io/) 來處理多國語系應用開發的流程，到現在也幫忙設定過三、四個專案，都是使用同一套，因此想紀錄一下 formatJS + react 的設定和使用方式，主要是參考官方文件：
https://formatjs.io/docs/getting-started/installation

## i18n 開發流程

### 較不建議的方式

很多人開發多語系，會需要自己編寫一份語言檔，內容是 id 和 message 對應

```javascript
// 此為示意 en.json
{
  "confirm-btn": "Confirm"
}
```

開發時在程式內引用對應 id

```jsx
// 此為示意
const ConfirmBtn = () => (
  <button>{translate("confirm-btn")}</button>
);
```

之前使用這種方式開發，深刻感到冗餘和麻煩，需要自己宣告、維護 id 和 message 並引用，對開發者比較不友善。
幸好後來完整看了 formatJS 的文件，使用了建議的流程後覺得開發上快速許多。

### FormatJS 開發流程

大致上分為

- Message Declaration: 開發者直接在程式內使用支援的 API 來 declare message。
- Message Extraction: 透過 FormatJS CLI `extract` 功能，將程式裡宣告的 message 自動產生成一份 json 檔 (通常為英文 `en.json`)。這份 json 檔可以上傳到 translation vendor 進行翻譯，或交由負責的人翻譯出其他語系檔案： ex： `jp.json`、`fr.json`
- Message distribution: 使用 FormatJS CLI 預先將檔案 compile 成 `react-intl` 支援的格式，在程式內引入。

## Setup

安裝 `react-intl`

```bash
npm i -S react react-intl
```

在外層設定 IntlProvider

```jsx
import { IntlProvider } from "react-intl";

// Translated messages in French with matching IDs to what you declared
const messages = {};

export default function L10N() {
  return (
    <IntlProvider
      messages={messages}
      locale="en"
      defaultLocale="en"
    >
      <App />
    </IntlProvider>
  );
}
```

## Message Declaration

此時我們已經可以在程式內使用 react-intl 來聲明 message，[API 參考](https://formatjs.io/docs/getting-started/message-declaration)

```jsx
import { FormattedMessage } from "react-intl";
const App = () => {
  const intl = useIntl();
  return (
    <div>
      <FormattedMessage defaultMessage="Hello World" />
      {intl.formatMessage({
        defaultMessage: "Another way to declare message.",
      })}
    </div>
  );
};
```

此時運行專案，console 可能會出現錯誤，因為並沒有給定 message id，不過沒關係，因為我們即將使用 FormatJS extract 功能來自動產生 id。

## Message Extraction

https://formatjs.io/docs/tooling/cli/#extraction

### FormatJS CLI extraction

首先要安裝 Formatjs CLI

```bash
npm i -D @formatjs/cli
```

加上 extract 的 npm script：

```javascript
// package.json
{
  "scripts": {
        "lang:extract": "formatjs extract \"src/**/*.{js,jsx}\" --out-file lang/en.json --id-interpolation-pattern [contenthash:5]",
    },
}
```

這個指令試過在 Mac, Windows 都是 OK 的：
extract 所有 `src` 裡面的 `.js`、`.jsx` 檔案內宣告的 message，並且自動產生 id (使用 `contenthash:5` 這個 pattern)

執行之後可以看到檔案 `lang/en.json` 生成：

```json
{
  "b10a8": {
    "defaultMessage": "Hello World"
  },
  "cbdad": {
    "defaultMessage": "Another way to declare message."
  }
}
```

使用自動產生 id 的特性,
會根據 `defaultMessage` 和 `description` 產生不同 id

```jsx
<FormattedMessage defaultMessage="Hello World" />
<FormattedMessage defaultMessage="Hello World" description="This is description" />
```

```json
//en.json
{
  "09407": {
    "defaultMessage": "Hello World",
    "description": "This is description"
  },
  "b10a8": {
    "defaultMessage": "Hello World"
  }
}
```

如果有需要手動加 id 也是可以的

```jsx
<FormattedMessage defaultMessage="Hello World" />
<FormattedMessage defaultMessage="Hello World" id="welcome" />
```

```json
//en.json
{
  "b10a8": {
    "defaultMessage": "Hello World"
  },
  "welcome": {
    "defaultMessage": "Hello World"
  }
}
```

同樣的 message 會合併在一起，減少重複

```jsx
// a.js
<FormattedMessage defaultMessage="Hello World" />
// b.js
<FormattedMessage defaultMessage="Hello World" />
```

```json
//en.json
{
  "b10a8": {
    "defaultMessage": "Hello World"
  }
}
```

### FormatJS babel plugin

使用自動產生 id，需要配合對應的 babel plugin 使用，才能將程式內宣告 message 的部分也轉換成對應的 id。

安裝 `babel-plugin-formatjs`

```bash
npm i -D babel-plugin-formatjs
```

設定 babel config

```javascript
{
  "plugins": [
    [
      "formatjs",
      {
        "idInterpolationPattern": "[contenthash:5]",
        "ast": true
      }
    ]
  ]
}
```

注意這邊 `idInterpolationPattern` 需要和前一步驟 extract 指令的 `--id-interpolation-pattern` 相同。

## Message Distribution

https://formatjs.io/docs/getting-started/message-distribution

加上 compiled 的 npm script：

```javascript
// package.json
{
  "scripts": {
        "lang:compile": "formatjs compile lang/en.json --ast --out-file compiled-lang/en.json",
    },
}
```

執行後會產生 `compiled-lang/en.json`

```json
{
  "b10a8": [
    {
      "type": 0,
      "value": "Hello World"
    }
  ],
  "cbdad": [
    {
      "type": 0,
      "value": "Another way to declare message."
    }
  ]
}
```

根據不同語系載入 compiled 的檔案，傳入 react-intl Provider (此為官方文件範例)

```jsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";

function loadLocaleData(locale: string) {
  switch (locale) {
    case "fr":
      return import("compiled-lang/fr.json");
    default:
      return import("compiled-lang/en.json");
  }
}

function App(props) {
  return (
    <IntlProvider
      locale={props.locale}
      defaultLocale="en"
      messages={props.messages}
    >
      <MainApp />
    </IntlProvider>
  );
}

async function bootstrapApplication(locale, mainDiv) {
  const messages = await loadLocaleData(locale);
  ReactDOM.render(
    <App locale={locale} messages={messages} />,
    mainDiv,
  );
}
```

## 其他

上述 extract, compile 的 npm script 指令，我習慣加在 start 和 build 的步驟之前。(因為 formatjs CLI 似乎沒有 watch 的功能)
然後 compiled-lang 我選擇 .gitignore，因為上板控意義不大而且常有 code change。

```json
// package.json
{
  "scripts": {
    "start": "npm run lang && [your dev script]",
    "build": "npm run lang && [your build script]",
    "lang:extract": "formatjs extract \"src/**/*.{js,jsx}\" --out-file lang/en.json --id-interpolation-pattern [contenthash:5]",
    "lang:compile": "formatjs compile lang/en.json --ast --out-file compiled-lang/en.json",
    "lang": "npm run lang:extract && npm run lang:compile"
  }
}
```

以上就是 formatJS + react 的設定，目前使用上有個小問題就是不知道如何將 extract file 分得更小或是照功能切分，其他開發上都滿順手的。
