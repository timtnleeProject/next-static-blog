## 下載安裝 NodeJS

下載途徑有很多種，我參考 [NodeSource Node.js Binary Distributions](https://github.com/nodesource/distributions)

## 建立 Web Server

新增一個簡單的 nodeJS http server 監聽 port 3000

_index.js_

```javascript
const http = require("http");

http
  .createServer((req, res) => {
    res.end("Hi");
  })
  .listen(3000, () => {
    console.log("server start");
  });
```

設定防火牆 (也可用 iptable) 允許 port 3000 進入連線

```bash
sudo ufw in 3000
```

查看 ufw status，可看到 port 3000 已開啟

![404](/images/nodeapponlinode/ufwstatus.jpg)

此時運行 node app `node index.js`，打開瀏覽器打上 `http://<HOST_PRIVATE_IP>:3000`，便可造訪頁面。

接下來我們換成使用 nginx 和設定 dns，並用 pm2 啟動專案

先將防火牆剛剛開的 port 3000 規則刪除

查看編號 (NUM)

```bash
sudo ufw status numbered
```

刪除規則

```bash
sudo ufw delete RULE|NUM
```

也可直接刪除

```bash
sudo ufw delete allow 3000
```

## Pm2

安裝 Pm2

```bash
npm install pm2 -g
```

後續... 用 pm2 把應用啟動吧

```bash
pm2 start index.js
```

## 安裝 nginx

安裝步驟參考[教學][nginx-tut]

config file 路徑： `/etc/nginx/sites-enabled/defaut`

開啟 http (80 port)

```bash
sudo ufw allow http
```

![404](/images/nodeapponlinode/open80.jpg)

修改 nginx config:

![404](/images/nodeapponlinode/nginxconfig.jpg)

將請求轉到 `<HOST_PRIVATE_IP>:3000` 的應用並將網址路徑帶入。

其實 config 怎麼修改不是太清楚，我是直接查的@@，有空可能會去看一下 nginx 的文件(但長的非常不親人...)。

也可以參考 G.T.Wang 的[Ubuntu Linux 安裝與設定 LEMP 網頁伺服器步驟教學][gtwang-nginx]

修改完後可以下這個指令測試檢查 nginx config 有無參數錯誤或 syntax error。

```bash
sudo nginx -t # 檢查 nginx config
sudo nginx -t -c /etc/nginx/nginx.conf # 檢查特定 config file
```

重啟 nginx 服務

```bash
service nginx restart
```

瀏覽器打上 `http://<HOST_PRIVATE_IP>` 就可看到頁面了。

## DNS

我使用 [no-ip](https://www.noip.com/login?ref_url=%2Fmembers%2Fdns%2F%3Ftype%3Dcname%26domain%3Dhopto.org%26msg%3DHost%2Btimtnlee.hopto.org%2Bupdated.%2BUpdate%2Bwill%2Bbe%2Bapplied%2Bin%2Bapproximately%2B1%2Bminute.) 申請一組免費 DNS 網域 (沒錢 QQ)

因為是免費的屬於 Dynamic DNS，30 天就會過期，剩七天內記得手動上去 confirm 延長時間。

設定 DNS 指向你的 Private IP

![404](/images/nodeapponlinode/configdns.jpg)

等更新後打上網址就可導到我們的主機了

![404](/images/nodeapponlinode/result.jpg)

## 參考資料

- [Linode-How to Install NodeJS](https://www.linode.com/docs/development/nodejs/how-to-install-nodejs/)
- [Linode-Install Nginx][nginx-tut]
- [Digital Ocean-How To Set Up a Node.js Application for Production on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-14-04)

[nginx-tut]: https://www.linode.com/docs/web-servers/nginx/install-nginx-ubuntu/
[gtwang-nginx]: https://blog.gtwang.org/linux/ubuntu-linux-setup-lemp-server/
