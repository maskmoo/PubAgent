# PubAgent Sync 浏览器扩展

PubAgent Sync 是一个为 **PubAgent (个人 AI 创作自动化助手)** 配套开发的 Chrome / Edge 浏览器扩展。

基于**方案A（浏览器插件接管模式）**实现，它的核心作用是：**让你用自己的真实浏览器登录各大平台，然后一键将登录态（Cookies）安全地同步给本地的 PubAgent 后端服务。** 

这能最大程度降低账号被国内大平台（知乎、掘金、B站等）风控的风险。

---

## 快速安装与使用指南

### 1. 加载扩展程序 (安装)
目前插件还未上架应用商店，请使用“开发者模式”本地加载：

1. 打开 Chrome 浏览器，地址栏输入并前往 `chrome://extensions/` （Edge 用户输入 `edge://extensions/`）
2. 在右上角打开 **“开发者模式”** (Developer mode) 的开关。
3. 点击左上角的 **“加载已解压的扩展程序”** (Load unpacked) 按钮。
4. 在弹出的文件选择窗口中，选中本项目根目录下的 `extension` 文件夹，点击确认。
5. 安装成功！你会在浏览器右上角的扩展图标列表里看到一个带有渐变刷新图标的 **PubAgent Sync**。

### 2. 同步账号 (使用)
1. 确保你的 PubAgent 后端服务（Node.js 服务器）已经在本地 `http://localhost:3001` 启动。
2. 在浏览器中正常打开你要同步的平台，例如 [知乎 (zhihu.com)](https://www.zhihu.com) 或 [掘金 (juejin.cn)](https://juejin.cn)，并登录你的账号。
3. 登录成功后，点击浏览器右上角的 **PubAgent Sync 插件图标**。
4. 插件会自动识别当前所在的域名是否在支持列表中。如果支持，点击 **“一键同步登录态”**。
5. 提示“同步成功！”后，你的登录态就已经安全落盘到 PubAgent 的本地 SQLite 数据库中了。

现在，你可以回到 PubAgent 的「平台管理」页面刷新状态，你会发现对应平台已经变成了绿色的**已连接**状态！

---

## 技术架构说明
- **Manifest V3**: 符合最新谷歌扩展规范标准。
- **权限安全**: 仅声明了 `cookies`, `activeTab` 权限，抓取的数据直接通过 HTTP POST 到本地后端的 `/api/platforms/:id/session` 接口，**不会经过任何第三方中转服务器，绝对保证您的账号隐私安全**。
- **Background Worker**: `scripts/background.js` 负责拦截通信和执行跨域的 `chrome.cookies.getAll` 操作。