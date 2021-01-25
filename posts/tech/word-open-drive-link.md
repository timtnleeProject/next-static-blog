最近發現在 Windows 10 系統使用 Word 以 **ctrl + 左鍵的方式**開啟 **Google Drive** 共享超連結 (如下圖)
![Word 以 **ctrl + 左鍵的方式**開啟 **Google Drive** 共享超連結](https://imgur.com/CJRnB4H.jpg)

不會進到 Google Drive 的檔案，而是顯示 "Update your browser to use Google Drive" 這個畫面：
![Update your browser to use Google Drive](https://imgur.com/1GXvj9V.jpg)

直接把網址貼在瀏覽器可以，但是透過 Word 開啟超連結就不行！

目前實測 Word 2016, Word 2019 都有這個問題，推測應該是跟 Windows 系統有關？

上網找到同樣的問題以及解決方法：
https://support.microsoft.com/en-us/office/when-you-click-a-link-to-a-google-drive-folder-from-within-word-your-web-browser-returns-an-update-your-browser-message-1369e478-1ca9-478a-a186-e0b0aede972d

**1. 關閉其他正在運行的程式**

**2. 打開 regedit 頁面**

- Win + R 打開「執行」
- 輸入 regedit 並確認

![open regedit](https://imgur.com/iIwxlRr.jpg)

**3. create subkey**

根據不同系統要創建對應的 Key：

**For a 32 Bit version of Office on 64 bit version of Windows**
HKLM\SOFTWARE\Wow6432Node\Microsoft\Office\9.0\Common\Internet\

**For a 32 Bit version of Office on 32 bit version of Windows**
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Office\9.0\Common\Internet

**For a 64 Bit version of Office on 64 bit version of Windows**
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Office\9.0\Common\Internet

以我的系統是 64 Bit version of Office / 64 bit version of Windows 為例
Key 的路徑為 HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Office\9.0\Common\Internet
(**實際操作要照你的系統找上面對應的 KEY**)
在 regedit 視窗左側目錄依序往下展開，可以看到我的 Key 只到 Office 這層

![regedit edit](https://imgur.com/A1SvMPU.jpg)

因此還要自己依序新增 9.0\Common\Internet
在 Key 上按右鍵、新增

![新增 KEY](https://imgur.com/mcpbAgH.jpg)
![新增 KEY](https://imgur.com/KSMqhlO.jpg)

依序新增 9.0\Common\Internet 三層 Key
![依序新增 9.0\Common\Internet 三層 Key](https://imgur.com/qhqW0YD.jpg)

**4.create DWORD**

在剛剛創建的最後一個 key 上點右鍵 > 新增 > DWORD value

並取名為 **ForceShellExecute**

![Add DWORD](https://imgur.com/r6OEoix.jpg)
![ForceShellExecute](https://imgur.com/PyJkwSu.jpg)

**5. set DWORD value**

雙擊 **ForceShellExecute** > 將其值設為 1 > OK

![設定ForceShellExecute值為1](https://imgur.com/0k7PMas.jpg)

**6. 離開 regedit 、 重啟電腦**

從 Word 可以打開 Google Drive 超連結了 😀😀😀。
![Google Drive Folder](https://imgur.com/ZhFqNCP.jpg)
