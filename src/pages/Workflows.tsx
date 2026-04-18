import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, ShieldAlert, FileText, CheckCircle2, History, RotateCcw, AlertTriangle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const mockWorkflowSpec = `### Platform Information
- **Platform ID**: zhihu
- **Base URL**: https://zhihu.com
- **Editor URL**: https://zhuanlan.zhihu.com/write

### Workflow Steps

#### Step 1: Navigate to Editor
- Action: navigate
- URL: https://zhuanlan.zhihu.com/write

#### Step 2: Input Title
- Action: fill
- Selector: textarea.WriteIndex-titleInput
- Fallback: [placeholder="请输入标题"]
- Value: {{article.title}}
- Confidence: 99%

#### Step 3: Input Content
- Action: fill_editor
- Selector: .public-DraftEditor-content
- Value: {{article.content}}
- Confidence: 95%

#### Step 4: Click Publish
- Action: click
- Selector: button.PublishButton
- Confidence: 92%
`;

const mockLogs = [
  { id: 1, time: "2023-10-25 14:30:22", type: "info", message: "开始执行知乎分发任务 #ZH-8821" },
  { id: 2, time: "2023-10-25 14:30:25", type: "warning", message: "⚠️ 警告：无法找到选择器 'button.PublishButton'" },
  { id: 3, time: "2023-10-25 14:30:26", type: "error", message: "❌ 失败：平台 UI 可能发生变更，任务挂起" },
  { id: 4, time: "2023-10-25 14:30:27", type: "ai_fix", message: "🤖 守护者启动：正在分析 DOM 树，尝试寻找新的发布按钮..." },
  { id: 5, time: "2023-10-25 14:30:35", type: "success", message: "✅ 修复成功：找到新选择器 '.WritePanel-publishBtn'，更新工作流规范" },
  { id: 6, time: "2023-10-25 14:30:38", type: "info", message: "任务 #ZH-8821 重新执行并成功发布" },
];

export function Workflows() {
  const [activeTab, setActiveTab] = useState<'spec' | 'guardian'>('guardian');

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] transition-colors duration-300">工作流规范与守护者</h1>
        <p className="text-[var(--text-secondary)] mt-2 text-sm transition-colors duration-300">查看 AI 自动生成的 Markdown 规范，监控 AI Workflow Guardian 的自我修复日志。</p>
      </div>

      <div className="flex gap-4 border-b border-[var(--layout-border)] pb-4 transition-colors duration-300">
        <Button 
          variant={activeTab === 'guardian' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('guardian')}
          className={`gap-2 transition-all duration-300 ${activeTab === 'guardian' ? 'bg-[var(--text-primary)] text-[var(--layout-bg)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <ShieldAlert className="w-4 h-4" />
          AI 工作流守护者
        </Button>
        <Button 
          variant={activeTab === 'spec' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('spec')}
          className={`gap-2 transition-all duration-300 ${activeTab === 'spec' ? 'bg-[var(--text-primary)] text-[var(--layout-bg)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <FileText className="w-4 h-4" />
          Markdown 工作流规范
        </Button>
      </div>

      <div className="flex-1 min-h-[500px]">
        {activeTab === 'guardian' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <Card className="col-span-1 lg:col-span-2 bg-[var(--code-bg)] border-[var(--layout-border)] font-mono text-sm flex flex-col shadow-inner relative overflow-hidden transition-colors duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
              <CardHeader className="bg-[var(--layout-bg)] border-b border-[var(--layout-border)] py-3 flex flex-row items-center justify-between z-10 backdrop-blur-sm transition-colors duration-300">
                <CardTitle className="text-xs text-[var(--text-secondary)] flex items-center gap-2 tracking-widest uppercase transition-colors duration-300">
                  <Terminal className="w-4 h-4" />
                  执行与审计日志 (Audit Log)
                </CardTitle>
                <div className="flex gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  <span className="flex h-2.5 w-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                  <span className="flex h-2.5 w-2.5 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                </div>
              </CardHeader>
              <ScrollArea className="flex-1 p-6 z-10">
                <div className="space-y-4">
                  {mockLogs.map((log) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={log.id} 
                      className="flex gap-4 group"
                    >
                      <span className="text-[var(--text-secondary)]/50 flex-shrink-0 text-xs mt-0.5 transition-colors duration-300">{log.time}</span>
                      <span className={`
                        text-sm leading-relaxed transition-colors duration-300
                        ${log.type === 'info' ? 'text-blue-600 dark:text-blue-400/90' : ''}
                        ${log.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400/90' : ''}
                        ${log.type === 'error' ? 'text-red-600 dark:text-red-400/90' : ''}
                        ${log.type === 'ai_fix' ? 'text-primary font-medium tracking-wide shadow-primary/20 drop-shadow-sm dark:drop-shadow-md' : ''}
                        ${log.type === 'success' ? 'text-green-600 dark:text-green-400/90' : ''}
                      `}>
                        {log.message}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            <Card className="bg-[var(--card-bg)] border-[var(--layout-border)] relative overflow-hidden shadow-sm transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 text-[var(--text-primary)] transition-colors duration-300">
                  <ShieldAlert className="w-5 h-5 text-primary" />
                  守护者状态
                </CardTitle>
                <CardDescription className="text-xs text-[var(--text-secondary)] transition-colors duration-300">
                  自动修复平台 UI 变更导致的选择器失效
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="flex items-center justify-between p-3 bg-[var(--layout-bg)] border border-[var(--layout-border)] rounded-xl backdrop-blur-md transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-full shadow-sm dark:shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 transition-colors duration-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)] transition-colors duration-300">守护进程</p>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 transition-colors duration-300">正常运行中</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 shadow-sm dark:shadow-[0_0_10px_rgba(34,197,94,0.1)] uppercase text-[10px] tracking-wider transition-colors duration-300">Active</Badge>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-medium flex items-center gap-2 text-[var(--text-secondary)] uppercase tracking-wider transition-colors duration-300">
                    <History className="w-3.5 h-3.5" /> 最近修复记录
                  </h4>
                  <div className="border border-[var(--layout-border)] rounded-xl p-4 space-y-3 bg-[var(--layout-bg)] transition-colors duration-300">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 shadow-sm dark:shadow-[0_0_10px_rgba(124,58,237,0.1)]">知乎</Badge>
                      <span className="text-[11px] text-[var(--text-secondary)] font-mono transition-colors duration-300">2 分钟前</span>
                    </div>
                    <p className="text-sm text-[var(--text-primary)] transition-colors duration-300">修复了发布按钮选择器失效的问题</p>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-mono bg-[var(--sidebar-hover)] border border-[var(--layout-border)] p-2.5 rounded-lg overflow-hidden transition-colors duration-300">
                      <span className="line-through text-red-600/70 dark:text-red-400/70 truncate transition-colors duration-300">button.PublishButton</span>
                      <ArrowRight className="w-3 h-3 flex-shrink-0 text-[var(--text-secondary)]/50 transition-colors duration-300" />
                      <span className="text-green-600/90 dark:text-green-400/90 truncate transition-colors duration-300">.WritePanel-publishBtn</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="h-full bg-[var(--code-bg)] border-[var(--layout-border)] flex flex-col shadow-inner relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="bg-[var(--layout-bg)] border-b border-[var(--layout-border)] flex flex-row items-center justify-between py-3 backdrop-blur-sm z-10 transition-colors duration-300">
              <CardTitle className="text-xs text-[var(--text-secondary)] flex items-center gap-2 font-mono transition-colors duration-300">
                <FileText className="w-4 h-4" />
                /docs/workflow/zhihu.md
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--sidebar-hover)] transition-colors duration-300">
                  <RotateCcw className="w-3 h-3 mr-2" />
                  回滚版本
                </Button>
                <Button size="sm" className="h-8 text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 shadow-sm dark:shadow-[0_0_15px_rgba(124,58,237,0.15)]">
                  自动生成 TS 代码
                </Button>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 p-8 z-10">
              <pre className="font-mono text-[13px] text-[var(--text-primary)]/80 leading-loose transition-colors duration-300">
                <code>{mockWorkflowSpec}</code>
              </pre>
            </ScrollArea>
          </Card>
        )}
      </div>
    </div>
  );
}
