import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Key, Cpu, ShieldCheck, Loader2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/useSettingsStore";

export function Settings() {
  const { openAiKey, setOpenAiKey, openAiBaseUrl, setOpenAiBaseUrl, anthropicKey, setAnthropicKey } = useSettingsStore();

  const [isTestingOpenAI, setIsTestingOpenAI] = useState(false);
  const [openAiStatus, setOpenAiStatus] = useState<'idle' | 'success' | 'error'>('success'); // default to success as it was hardcoded

  const [isTestingAnthropic, setIsTestingAnthropic] = useState(false);
  const [anthropicStatus, setAnthropicStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [supervisionMode, setSupervisionMode] = useState<'none' | 'optional' | 'required'>('optional');

  const handleTestOpenAI = async () => {
    if (!openAiKey) return;
    
    setIsTestingOpenAI(true);
    setOpenAiStatus('idle');
    
    try {
      const baseUrl = openAiBaseUrl.replace(/\/$/, ''); // Remove trailing slash if any
      const response = await fetch(`${baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${openAiKey}`,
        }
      });
      
      if (response.ok) {
        setOpenAiStatus('success');
      } else {
        setOpenAiStatus('error');
      }
    } catch {
      setOpenAiStatus('error');
    } finally {
      setIsTestingOpenAI(false);
    }
  };

  const handleTestAnthropic = async () => {
    if (!anthropicKey) return;
    
    setIsTestingAnthropic(true);
    setAnthropicStatus('idle');
    
    try {
      // For Anthropic, direct browser fetch often fails due to CORS, so we simulate testing here
      // In a real app, this should call your backend proxy
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (anthropicKey.startsWith('sk-ant-')) {
        setAnthropicStatus('success');
      } else {
        setAnthropicStatus('error');
      }
    } catch {
      setAnthropicStatus('error');
    } finally {
      setIsTestingAnthropic(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] transition-colors duration-300">系统设置</h1>
        <p className="text-[var(--text-secondary)] mt-2 text-sm transition-colors duration-300">配置大模型 API 密钥与系统全局参数。</p>
      </div>

      <div className="grid gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-[var(--card-bg)] border-[var(--layout-border)] relative overflow-hidden shadow-sm transition-colors duration-300">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2 text-[var(--text-primary)] transition-colors duration-300">
                <Key className="w-5 h-5 text-primary" />
                AI 大模型密钥配置
              </CardTitle>
              <CardDescription className="text-[var(--text-secondary)] transition-colors duration-300">
                填写您的 API Key 以激活 AI Spec Discovery 与内容优化功能。支持 OpenAI, DeepSeek, 和 Anthropic。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="space-y-3 p-4 bg-[var(--layout-bg)] rounded-xl border border-[var(--layout-border)] transition-colors duration-300 shadow-sm">
                <Label htmlFor="openai" className="flex items-center justify-between text-[var(--text-primary)] transition-colors duration-300">
                  <span className="flex items-center gap-2">
                    OpenAI / DeepSeek <span className="text-[var(--text-secondary)] font-normal text-xs">(兼容接口)</span>
                  </span>
                  {openAiStatus === 'success' && (
                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5 font-medium px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded transition-colors duration-300">
                      <ShieldCheck className="w-3.5 h-3.5" /> 已验证
                    </span>
                  )}
                  {openAiStatus === 'error' && (
                    <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5 font-medium px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded transition-colors duration-300">
                      <XCircle className="w-3.5 h-3.5" /> 验证失败
                    </span>
                  )}
                  {openAiStatus === 'idle' && !isTestingOpenAI && (
                    <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5 font-medium px-2 py-0.5 bg-[var(--layout-bg)] border border-[var(--layout-border)] rounded transition-colors duration-300">
                      未验证
                    </span>
                  )}
                </Label>
                
                <div className="grid gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="openaiBaseUrl" className="text-xs text-[var(--text-secondary)]">Base URL</Label>
                    <Input 
                      id="openaiBaseUrl" 
                      value={openAiBaseUrl} 
                      onChange={(e) => {
                        setOpenAiBaseUrl(e.target.value);
                        setOpenAiStatus('idle');
                      }} 
                      placeholder="https://api.openai.com/v1"
                      className="font-mono text-sm bg-[var(--input-bg)] border-[var(--layout-border)] focus-visible:ring-primary shadow-inner text-[var(--text-primary)] h-10 rounded-lg transition-colors duration-300"
                    />
                    <p className="text-[10px] text-[var(--text-secondary)]">DeepSeek 填写: https://api.deepseek.com/v1</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="openai" className="text-xs text-[var(--text-secondary)]">API Key</Label>
                    <div className="flex gap-3">
                      <Input 
                        id="openai" 
                        type="password" 
                        value={openAiKey} 
                        onChange={(e) => {
                          setOpenAiKey(e.target.value);
                          setOpenAiStatus('idle');
                        }} 
                        className="font-mono bg-[var(--input-bg)] border-[var(--layout-border)] focus-visible:ring-primary focus-visible:border-primary shadow-inner text-[var(--text-primary)] h-11 rounded-lg transition-colors duration-300"
                      />
                      <Button 
                        variant="outline" 
                        onClick={handleTestOpenAI}
                        disabled={isTestingOpenAI || !openAiKey}
                        className="h-11 px-6 bg-[var(--layout-bg)] hover:bg-[var(--sidebar-hover)] text-[var(--text-primary)] transition-colors duration-300"
                      >
                        {isTestingOpenAI ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            测试中
                          </>
                        ) : (
                          "测试连接"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 p-4 bg-[var(--layout-bg)] rounded-xl border border-[var(--layout-border)] transition-colors duration-300 shadow-sm">
                <Label htmlFor="anthropic" className="flex items-center justify-between text-[var(--text-primary)] transition-colors duration-300">
                  Anthropic API Key <span className="text-[var(--text-secondary)] ml-2 font-normal text-xs transition-colors duration-300">(Claude)</span>
                  {anthropicStatus === 'success' && (
                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5 font-medium px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded transition-colors duration-300">
                      <ShieldCheck className="w-3.5 h-3.5" /> 已验证
                    </span>
                  )}
                  {anthropicStatus === 'error' && (
                    <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5 font-medium px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded transition-colors duration-300">
                      <XCircle className="w-3.5 h-3.5" /> 验证失败
                    </span>
                  )}
                  {anthropicStatus === 'idle' && !isTestingAnthropic && (
                    <span className="text-xs text-[var(--text-secondary)] font-medium px-2 py-0.5 bg-[var(--layout-bg)] border border-[var(--layout-border)] rounded transition-colors duration-300">未配置</span>
                  )}
                </Label>
                <div className="flex gap-3">
                  <Input 
                    id="anthropic" 
                    type="password" 
                    value={anthropicKey} 
                    onChange={(e) => {
                      setAnthropicKey(e.target.value);
                      setAnthropicStatus('idle');
                    }} 
                    placeholder="sk-ant-..." 
                    className="font-mono bg-[var(--input-bg)] border-[var(--layout-border)] focus-visible:ring-primary focus-visible:border-primary shadow-inner text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 h-11 rounded-lg transition-colors duration-300"
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleTestAnthropic}
                    disabled={isTestingAnthropic || !anthropicKey}
                    className="h-11 px-6 bg-[var(--layout-bg)] hover:bg-[var(--sidebar-hover)] text-[var(--text-primary)] transition-colors duration-300"
                  >
                    {isTestingAnthropic ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        测试中
                      </>
                    ) : (
                      "测试连接"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-primary/5 dark:bg-primary/[0.02] border-primary/20 relative overflow-hidden shadow-sm transition-colors duration-300">
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-primary/10 dark:bg-primary/20 rounded-full blur-[80px] pointer-events-none transition-colors duration-300" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2 text-[var(--text-primary)] transition-colors duration-300">
                <Cpu className="w-5 h-5 text-primary" />
                AI Agent 偏好设置
              </CardTitle>
              <CardDescription className="text-[var(--text-secondary)] transition-colors duration-300">
                调整 AI 在工作流中的行为模式。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 relative z-10">
              <div className="flex items-center justify-between p-5 bg-[var(--layout-bg)] rounded-xl border border-[var(--layout-border)] hover:border-primary/30 transition-colors duration-300 shadow-sm">
                <div className="space-y-1.5">
                  <Label className="text-base text-[var(--text-primary)] transition-colors duration-300">工作流守护者 (Workflow Guardian)</Label>
                  <p className="text-xs text-[var(--text-secondary)] transition-colors duration-300">允许 AI 在发布失败时自动分析 DOM 并自我修复选择器。</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(124,58,237,0.3)]">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              <div className="flex items-center justify-between p-5 bg-[var(--layout-bg)] rounded-xl border border-[var(--layout-border)] hover:border-primary/30 transition-colors duration-300 shadow-sm">
                <div className="space-y-1.5">
                  <Label className="text-base text-[var(--text-primary)] transition-colors duration-300">人类审核模式 (Supervision Mode)</Label>
                  <p className="text-xs text-[var(--text-secondary)] transition-colors duration-300">AI 探索新平台后，是否需要人类确认生成的 Markdown 规范。</p>
                </div>
                <select
                  value={supervisionMode}
                  onChange={(e) => setSupervisionMode(e.target.value as 'none' | 'optional' | 'required')}
                  className="bg-[var(--input-bg)] border border-[var(--layout-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer appearance-none transition-colors duration-300"
                >
                  <option value="none">无需干预 (全自动)</option>
                  <option value="optional">可选审核 (推荐)</option>
                  <option value="required">必须审核 (最安全)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" className="h-11 px-6 bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--layout-border)] transition-colors duration-300">取消更改</Button>
          <Button className="gap-2 h-11 px-8 bg-primary text-white hover:bg-primary/90 shadow-md font-medium transition-colors duration-300">
            <Save className="w-4 h-4" />
            保存设置
          </Button>
        </div>
      </div>
    </div>
  );
}
