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
        <h1 className="text-3xl font-bold tracking-tight">工作流规范与守护者</h1>
        <p className="text-muted-foreground mt-2">查看 AI 自动生成的 Markdown 规范，监控 AI Workflow Guardian 的自我修复日志。</p>
      </div>

      <div className="flex gap-4 border-b border-border/40 pb-4">
        <Button 
          variant={activeTab === 'guardian' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('guardian')}
          className="gap-2"
        >
          <ShieldAlert className="w-4 h-4" />
          AI 工作流守护者
        </Button>
        <Button 
          variant={activeTab === 'spec' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('spec')}
          className="gap-2"
        >
          <FileText className="w-4 h-4" />
          Markdown 工作流规范
        </Button>
      </div>

      <div className="flex-1 min-h-[500px]">
        {activeTab === 'guardian' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <Card className="col-span-1 lg:col-span-2 bg-zinc-950 border-border/40 font-mono text-sm flex flex-col shadow-inner">
              <CardHeader className="bg-black/40 border-b border-border/20 py-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-zinc-400 flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  执行与审计日志 (Audit Log)
                </CardTitle>
                <div className="flex gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="flex h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <span className="flex h-2.5 w-2.5 rounded-full bg-green-500" />
                </div>
              </CardHeader>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {mockLogs.map((log) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={log.id} 
                      className="flex gap-4"
                    >
                      <span className="text-zinc-500 flex-shrink-0">{log.time}</span>
                      <span className={`
                        ${log.type === 'info' ? 'text-blue-400' : ''}
                        ${log.type === 'warning' ? 'text-yellow-400' : ''}
                        ${log.type === 'error' ? 'text-red-400' : ''}
                        ${log.type === 'ai_fix' ? 'text-purple-400 font-bold' : ''}
                        ${log.type === 'success' ? 'text-green-400' : ''}
                      `}>
                        {log.message}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-primary" />
                  守护者状态
                </CardTitle>
                <CardDescription>
                  自动修复平台 UI 变更导致的选择器失效
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">守护进程</p>
                      <p className="text-xs text-muted-foreground">正常运行中</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <History className="w-4 h-4" /> 最近修复记录
                  </h4>
                  <div className="border border-border/40 rounded-lg p-3 space-y-2 bg-background/50">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/10">知乎</Badge>
                      <span className="text-xs text-muted-foreground">2 分钟前</span>
                    </div>
                    <p className="text-sm">修复了发布按钮选择器失效的问题</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono bg-black/20 p-2 rounded mt-2 overflow-hidden">
                      <span className="line-through text-red-400/70 truncate">button.PublishButton</span>
                      <ArrowRight className="w-3 h-3 flex-shrink-0" />
                      <span className="text-green-400/70 truncate">.WritePanel-publishBtn</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="h-full bg-zinc-950 border-border/40 flex flex-col shadow-inner">
            <CardHeader className="bg-black/40 border-b border-border/20 flex flex-row items-center justify-between py-3">
              <CardTitle className="text-sm text-zinc-400 flex items-center gap-2 font-mono">
                <FileText className="w-4 h-4" />
                /docs/workflow/zhihu.md
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-xs text-zinc-400 hover:text-zinc-100">
                  <RotateCcw className="w-3 h-3 mr-2" />
                  回滚版本
                </Button>
                <Button size="sm" className="h-8 text-xs bg-primary/20 text-primary hover:bg-primary/30">
                  自动生成 TS 代码
                </Button>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 p-6">
              <pre className="font-mono text-sm text-zinc-300 leading-relaxed">
                <code>{mockWorkflowSpec}</code>
              </pre>
            </ScrollArea>
          </Card>
        )}
      </div>
    </div>
  );
}
