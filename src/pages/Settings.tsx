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
        <h1 className="text-3xl font-bold tracking-tight text-white">系统设置</h1>
        <p className="text-muted-foreground mt-2 text-sm">配置大模型 API 密钥与系统全局参数。</p>
      </div>

      <div className="grid gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-white/[0.01] border-white/[0.05] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2 text-white">
                <Key className="w-5 h-5 text-primary" />
                AI 大模型密钥配置
              </CardTitle>
              <CardDescription className="text-white/60">
                填写您的 API Key 以激活 AI Spec Discovery 与内容优化功能。支持 OpenAI 和 Anthropic。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="space-y-3">
                <Label htmlFor="openai" className="flex items-center justify-between text-white/80">
                  OpenAI API Key
                  <span className="text-xs text-green-400 flex items-center gap-1.5 font-medium px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded">
                    <ShieldCheck className="w-3.5 h-3.5" /> 已验证
                  </span>
                </Label>
                <div className="flex gap-3">
                  <Input 
                    id="openai" 
                    type="password" 
                    value={openAiKey} 
                    onChange={(e) => setOpenAiKey(e.target.value)} 
                    className="font-mono bg-black/40 border-white/[0.1] focus-visible:ring-primary focus-visible:border-primary shadow-inner text-white h-11 rounded-lg"
                  />
                  <Button variant="outline" className="h-11 px-6 bg-white/[0.02] hover:bg-white/[0.05] text-white">测试连接</Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="anthropic" className="flex items-center justify-between text-white/80">
                  Anthropic API Key <span className="text-muted-foreground ml-2 font-normal text-xs">(Claude)</span>
                  <span className="text-xs text-white/40 font-medium px-2 py-0.5 bg-white/[0.05] border border-white/[0.05] rounded">未配置</span>
                </Label>
                <div className="flex gap-3">
                  <Input 
                    id="anthropic" 
                    type="password" 
                    value={anthropicKey} 
                    onChange={(e) => setAnthropicKey(e.target.value)} 
                    placeholder="sk-ant-..." 
                    className="font-mono bg-black/40 border-white/[0.1] focus-visible:ring-primary focus-visible:border-primary shadow-inner text-white placeholder:text-white/20 h-11 rounded-lg"
                  />
                  <Button variant="outline" className="h-11 px-6 bg-white/[0.02] hover:bg-white/[0.05] text-white">测试连接</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-primary/[0.02] border-primary/20 relative overflow-hidden">
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2 text-white">
                <Cpu className="w-5 h-5 text-primary" />
                AI Agent 偏好设置
              </CardTitle>
              <CardDescription className="text-white/60">
                调整 AI 在工作流中的行为模式。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 relative z-10">
              <div className="flex items-center justify-between p-5 bg-white/[0.02] rounded-xl border border-white/[0.05] hover:border-white/[0.1] transition-colors">
                <div className="space-y-1.5">
                  <Label className="text-base text-white">工作流守护者 (Workflow Guardian)</Label>
                  <p className="text-xs text-white/50">允许 AI 在发布失败时自动分析 DOM 并自我修复选择器。</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(124,58,237,0.3)]">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              <div className="flex items-center justify-between p-5 bg-white/[0.02] rounded-xl border border-white/[0.05] hover:border-white/[0.1] transition-colors">
                <div className="space-y-1.5">
                  <Label className="text-base text-white">人类审核模式 (Supervision Mode)</Label>
                  <p className="text-xs text-white/50">AI 探索新平台后，是否需要人类确认生成的 Markdown 规范。</p>
                </div>
                <select className="bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer appearance-none">
                  <option value="none">无需干预 (全自动)</option>
                  <option value="optional" selected>可选审核 (推荐)</option>
                  <option value="required">必须审核 (最安全)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" className="h-11 px-6 bg-transparent text-white/70 hover:text-white border-white/[0.1]">取消更改</Button>
          <Button className="gap-2 h-11 px-8 bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)] font-medium">
            <Save className="w-4 h-4" />
            保存设置
          </Button>
        </div>
      </div>
    </div>
  );
}
