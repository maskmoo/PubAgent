import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Key, Cpu, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function Settings() {
  const [openAiKey, setOpenAiKey] = useState("sk-************************************");
  const [anthropicKey, setAnthropicKey] = useState("");

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">系统设置</h1>
        <p className="text-muted-foreground mt-2">配置大模型 API 密钥与系统全局参数。</p>
      </div>

      <div className="grid gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                AI 大模型密钥配置
              </CardTitle>
              <CardDescription>
                填写您的 API Key 以激活 AI Spec Discovery 与内容优化功能。支持 OpenAI 和 Anthropic。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="openai" className="flex items-center justify-between">
                  OpenAI API Key
                  <span className="text-xs text-green-500 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> 已验证
                  </span>
                </Label>
                <div className="flex gap-2">
                  <Input 
                    id="openai" 
                    type="password" 
                    value={openAiKey} 
                    onChange={(e) => setOpenAiKey(e.target.value)} 
                    className="font-mono bg-background/50"
                  />
                  <Button variant="outline">测试连接</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="anthropic" className="flex items-center justify-between">
                  Anthropic API Key (Claude)
                  <span className="text-xs text-muted-foreground">未配置</span>
                </Label>
                <div className="flex gap-2">
                  <Input 
                    id="anthropic" 
                    type="password" 
                    value={anthropicKey} 
                    onChange={(e) => setAnthropicKey(e.target.value)} 
                    placeholder="sk-ant-..." 
                    className="font-mono bg-background/50"
                  />
                  <Button variant="outline">测试连接</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                AI Agent 偏好设置
              </CardTitle>
              <CardDescription>
                调整 AI 在工作流中的行为模式。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/40">
                <div className="space-y-1">
                  <Label className="text-base">工作流守护者 (Workflow Guardian)</Label>
                  <p className="text-sm text-muted-foreground">允许 AI 在发布失败时自动分析 DOM 并自我修复选择器。</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/40">
                <div className="space-y-1">
                  <Label className="text-base">人类审核模式 (Supervision Mode)</Label>
                  <p className="text-sm text-muted-foreground">AI 探索新平台后，是否需要人类确认生成的 Markdown 规范。</p>
                </div>
                <select className="bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="none">无需干预 (全自动)</option>
                  <option value="optional" selected>可选审核 (推荐)</option>
                  <option value="required">必须审核 (最安全)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex justify-end gap-4">
          <Button variant="outline">取消更改</Button>
          <Button className="gap-2 bg-primary">
            <Save className="w-4 h-4" />
            保存设置
          </Button>
        </div>
      </div>
    </div>
  );
}
