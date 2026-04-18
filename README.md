# PubAgent 🤖

**PubAgent** 是一款由 AI 驱动的内容多平台智能分发系统，帮助创作者实现一键多平台发布。本系统通过集成大型语言模型（如 OpenAI/Claude）与计算机视觉技术（Vision AI），彻底解决了传统爬虫脆弱易失效的问题。

## 🌟 核心特性 (Features)

- **🤖 AI Spec Discovery**: 自动探索未知目标平台的网页结构，生成发布流程，彻底免除手写爬虫脚本的烦恼。
- **🔌 PubAgent Sync**: 独创浏览器扩展接管模式，用户使用日常浏览器登录，一键安全同步真实凭证（Cookies）至本地服务器，**最大程度降低风控风险**。
- **✨ AI 内容优化**: 针对不同平台的调性（知乎、掘金、CSDN等），自动提取 SEO 关键词并重写标题和文风。
- **🛡️ AI Workflow Guardian**: 持续监控工作流，在平台 UI 变更导致失败时，自动分析 DOM 并自我修复。
- **⏱️ 智能排期**: 根据各平台数据分析，自动计算互动率最高的“黄金时间”进行排期发布。
- **🎨 现代化 UI**: 采用 Next.js (App Router 概念设计) / Vite + React 18，配合 Tailwind CSS、shadcn/ui 与 Framer Motion 打造极致科技感暗黑主题界面。

## 📂 目录结构 (Architecture)

```text
├── src/            # 前端 React 源代码
├── server/         # 本地 Node.js / SQLite 后端服务
├── extension/      # Chrome/Edge 浏览器同步扩展 (PubAgent Sync)
├── docs/           # 文档目录
│   └── workflow/   # AI 探索生成的各平台 Markdown 工作流规范
├── package.json    # 项目依赖
└── tailwind.config.js # Tailwind 配置
```

## 🚀 快速开始 (Getting Started)

### 前置要求 (Prerequisites)
- Node.js 18+
- pnpm (推荐) 或 npm / yarn

### 安装依赖 (Install)
```bash
# 安装依赖
pnpm install
```

### 开发环境 (Development)
```bash
# 启动本地开发服务器
pnpm run dev
```
启动后访问：[http://localhost:5173/](http://localhost:5173/)

### 构建生产环境 (Production)
```bash
# 构建静态产物
pnpm run build

# 预览生产构建结果
pnpm run preview
```

## 🧩 安装浏览器同步插件 (Extension)

要使用本系统的一键分发功能，您需要将登录凭证安全地同步到本地数据库。

1. 打开 Chrome / Edge 浏览器，前往 `chrome://extensions/`（或 `edge://extensions/`）。
2. 在右上角开启 **“开发者模式” (Developer mode)**。
3. 点击 **“加载已解压的扩展程序” (Load unpacked)**。
4. 选中本项目根目录下的 `extension` 文件夹并确认。
5. 在日常浏览器中登录知乎、掘金等平台，点击浏览器右上角的 **PubAgent Sync** 图标进行“一键同步”。
> 详细说明请参考：[PubAgent Sync 插件使用指南](./extension/README.md)

## 🛠️ 技术栈 (Tech Stack)

- **框架**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) + TypeScript
- **路由**: [React Router v7](https://reactrouter.com/)
- **样式**: [Tailwind CSS v3](https://tailwindcss.com/)
- **组件库**: [shadcn/ui](https://ui.shadcn.com/) (无头组件设计)
- **图标**: [Lucide React](https://lucide.dev/)
- **动画**: [Framer Motion](https://www.framer.com/motion/)
- **AI 赋能**: [Vercel AI SDK](https://sdk.vercel.ai/docs)
- **状态管理**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Markdown**: `react-markdown` + `remark-gfm`

## 🤝 贡献指南 (Contributing)

欢迎提交 Issue 和 PR！在提交 PR 前，请确保代码通过了 ESLint 检查 (`pnpm run lint`) 并符合 TypeScript 类型规范 (`pnpm tsc`)。

## 📄 开源协议 (License)

本项目基于 [MIT License](LICENSE) 开源。
