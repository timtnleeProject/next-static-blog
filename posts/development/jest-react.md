最近要開始幫前端專案寫測試並整合到 CI 的步驟，因為過去比較少接觸程式測試的開發，因此用這篇文記錄一下，後續有新發現再持續更新。

這次使用的是 React 專案 (非 Create React App，因此要設定的項目多了一些)，測試的 Test runner 採用 Jest。

## Jest Setup

### Jest 安裝、執行

```bash
npm i -D jest
```

Jest 預設的 [test file pattern](https://jestjs.io/docs/configuration#testregex-string--arraystring) 用 cli 的 `testRegex` 參數設定，可以看到預設是：`(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$`

也就是 Jest 預設會測試任何在 `__tests__` 資料夾下面的 .js, .jsx, .ts, .tsx 檔案，或者任何尾部帶有 `.test` 或 `.spec` 的檔案 (例如 Component.test.js 或 Component.spec.js)

依照這個規則先新增一個 test file 看看

```javascript
// demo.test.js
import { formatNumber } from "@/utils/format";

test("formatNumber", () => {
  expect(formatNumber(100000)).toBe("100,000");
  expect(formatNumber("100000")).toBe("100,000");
});
```

新增 npm script 指令

```javascript
// package.json
{
  test: "jest";
}
```

執行 `npmr run test`，就可以正確執行測試了。

### Jest Config

如果有需要設定 Jest 相關參數，可以參考
https://jestjs.io/docs/configuration

- 建立 `jest.config.js` 或 `jest.config.ts`
- 使用指令 `jest --config <path/to/file.js|ts|cjs|mjs|json>`
- 在 package.json 裡使用 `jest` key 來設定。

### 整合 eslint

因為專案有使用 eslint，在 editor 會出現 eslint 錯誤：`'test' is not defined.`、`'expect' is not defined.`

![eslint 錯誤](https://imgur.com/kh9O2Un.jpg)

因此需要整合 jest + eslint，除了消除這些錯誤，還可以提供 Jest 的一些 best practice，使用 eslint-plugin-jest

https://www.npmjs.com/package/eslint-plugin-jest

照著安裝就可以了，設定的部分需要在 eslinst config plugins 加上

```javascript
{
  plugins: ["jest"],
}
```

如果需要一些 pre-defined 的 jest rules 可以加上 extends
共有 recommended, style 和 all 三種可選

```javascript
{
  "extends": ["plugin:jest/all"]
}
```

使用延伸的 jest eslint rule 可以幫助你使用建議的 jest 寫法和風格。

![jest-eslint-plugin](https://imgur.com/eOhrxnU.jpg)

接著加上以下設定，會告訴 eslint 全域的 jest 變數，例如 `expect`, `test` 等等

```javascript
{
  "env": {
    "jest/globals": true
  }
}
```

不設定 jest global 也是可以的

- 在 test file 內需要用引入的方式
- 上一步如果有加上 jest extends rules 也會聲明 jest global 變數。

```javascript
// demo.test.js
import { expect } from "@jest/globals";
```

### jsdom

測試的如果是 Web, components ，記得將 jest config 的 `testEnvironment` 設為 `jsdom`，就可以使用如 `document`, `localStorage` 等等

```javascript
{
  testEnvironment: "jsdom",
}
```

其他全域變數如果還有缺少，我們可以在 jest config 裡設定 `globals`

```javascript
{
  globals: {
    DEV: "12345";
  }
}
```

## 測試 React Component

React component 測試相關的 library 有滿多的例如

- [Enzyme](https://enzymejs.github.io/enzyme/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

我是先使用 react-dom 內建的 test-utils

https://zh-hant.reactjs.org/docs/test-utils.html

## Jest 問題紀錄

### delay expect

在 jest 測試如果要設置 timer 跑完才執行斷言怎麼辦？
jest 可以處理 async/await

```javascript
// testUtils
export const delay = (ms) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
```

例如這個 component 有一個從 0 開始跳動數字的動畫，我們想測試在動畫結束後數字是正確的

```javascript
import { act } from "react-dom/test-utils";
import JumpNumber from "@/components/common/JumpNumber";
import { render } from "react-dom";
import { delay } from "./testUtils";

describe("component JumpNumber", () => {
  it("should show correct number", () => {
    expect.assertions(1);
    const container = document.createElement("div");
    act(() => {
      render(
        <JumpNumber
          number={600}
          duration={700}
          data-test="jump-number"
        />,
        container,
      );
    });

    const component =
      container.querySelector("*[data-test]");
    // Timer
    await delay(1000);
    expect(component.innerText).toBe("600");
  });
});
```
