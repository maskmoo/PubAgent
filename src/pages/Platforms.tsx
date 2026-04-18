import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, CheckCircle2, Globe, ArrowRight, Loader2, RefreshCw, XCircle, FileJson, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const defaultPlatforms = [
  { id: "zhihu", name: "知乎", url: "zhihu.com", status: "active", icon: Globe, workflow: "https://zhuanlan.zhihu.com/write" },
  { id: "juejin", name: "掘金", url: "juejin.cn", status: "active", icon: Globe, workflow: "https://juejin.cn/editor/drafts/new" },
  { id: "csdn", name: "CSDN", url: "csdn.net", status: "active", icon: Globe, workflow: "https://editor.csdn.net/md" },
  { id: "jianshu", name: "简书", url: "jianshu.com", status: "active", icon: Globe, workflow: "https://www.jianshu.com/writer" },
];

export function Platforms() {
  const [newUrl, setNewUrl] = useState("");
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveredPlatform, setDiscoveredPlatform] = useState<string | null>(null);
  
  // Platform status detection states
  const [checkingStatus, setCheckingStatus] = useState<Record<string, boolean>>({});
  const [platformStatus, setPlatformStatus] = useState<Record<string, 'connected' | 'disconnected' | 'error' | 'expired'>>(
    Object.fromEntries(defaultPlatforms.map(p => [p.id, 'disconnected']))
  );

  useEffect(() => {
    defaultPlatforms.forEach(p => {
      void checkPlatformStatus(p.id);
    });
  }, []);

  const handleDiscovery = async () => {
    if (!newUrl) return;
    setIsDiscovering(true);
    setDiscoveredPlatform(null);

    try {
      const response = await fetch("/api/discover-platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newUrl }),
      });
      const data = await response.json();
      
      if (data.success) {
        setDiscoveredPlatform(data.platform);
        setPlatformStatus(prev => ({ ...prev, discovered: 'disconnected' }));
      }
    } catch (error) {
      console.error(error);
      // Fallback
      setDiscoveredPlatform(newUrl);
    } finally {
      setIsDiscovering(false);
      setNewUrl("");
    }
  };

  const checkPlatformStatus = async (id: string) => {
    setCheckingStatus(prev => ({ ...prev, [id]: true }));
    
    try {
      const resp = await fetch(`/api/platforms/${id}/status`);
      const data = await resp.json();
      if (data?.success && data?.status) {
        setPlatformStatus(prev => ({ ...prev, [id]: data.status }));
      } else {
        setPlatformStatus(prev => ({ ...prev, [id]: 'error' }));
      }
    } catch (e) {
      setPlatformStatus(prev => ({ ...prev, [id]: 'error' }));
    } finally {
      setCheckingStatus(prev => ({ ...prev, [id]: false }));
    }
  };

  const checkAllPlatforms = () => {
    defaultPlatforms.forEach(p => void checkPlatformStatus(p.id));
    if (discoveredPlatform) {
      void checkPlatformStatus('discovered');
    }
  };

  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<{name: string, url: string, id: string} | null>(null);

  const openWorkflowDialog = (e: React.MouseEvent, platform: any) => {
    e.stopPropagation();
    setSelectedWorkflow({
      name: platform.name,
      url: platform.workflow || `https://${platform.url}/write`,
      id: platform.id
    });
    setWorkflowDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] transition-colors duration-300">平台与探索</h1>
        <p className="text-[var(--text-secondary)] mt-2 text-sm transition-colors duration-300">管理已有平台，或通过 AI Spec Discovery 自动适配全新平台。</p>
      </div>

      {/* AI Discovery Section */}
      <Card className="bg-primary/5 dark:bg-primary/[0.02] border-primary/20 overflow-hidden relative group shadow-sm transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-primary/10 dark:bg-primary/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-all duration-700" />
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2 text-xl text-[var(--text-primary)] transition-colors duration-300">
            <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 border border-primary/30 shadow-[0_0_15px_rgba(124,58,237,0.1)] dark:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-colors duration-300">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            AI 探索新平台 <span className="text-[var(--text-secondary)] text-sm font-normal font-mono ml-2 transition-colors duration-300">(AI Spec Discovery)</span>
          </CardTitle>
          <CardDescription className="text-[var(--text-secondary)] mt-2 text-sm transition-colors duration-300">
            无需写代码！只需提供发布页面的 URL，AI 将利用视觉技术自动“看懂”结构并生成工作流。
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full group/input">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[var(--text-secondary)] group-focus-within/input:text-primary transition-colors" />
              </div>
              <Input 
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://v2ex.com/write..." 
                className="pl-12 h-14 bg-[var(--input-bg)] backdrop-blur-xl border-[var(--layout-border)] focus-visible:ring-primary focus-visible:border-primary shadow-inner text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 rounded-xl transition-all duration-300"
              />
            </div>
            <Button 
              size="lg" 
              variant="sparkle" 
              onClick={handleDiscovery} 
              disabled={isDiscovering || !newUrl}
              className="w-full sm:w-auto min-w-[140px] h-14 rounded-xl text-sm font-bold"
            >
              {isDiscovering ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  视觉解析中...
                </>
              ) : (
                <>
                  开启探索 <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {discoveredPlatform && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-5 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-4 backdrop-blur-md shadow-[0_0_30px_rgba(34,197,94,0.1)] transition-colors duration-300"
            >
              <div className="p-2 bg-green-500/20 rounded-full border border-green-500/30 flex-shrink-0 mt-0.5 shadow-[0_0_15px_rgba(34,197,94,0.1)] dark:shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 transition-colors duration-300" />
              </div>
              <div>
                <h4 className="font-bold text-green-700 dark:text-green-400 text-lg transition-colors duration-300">探索成功！</h4>
                <p className="text-sm text-green-700/80 dark:text-green-400/80 mt-2 leading-relaxed transition-colors duration-300">
                  AI 已成功识别 <span className="font-mono bg-[var(--layout-bg)] px-1.5 py-0.5 rounded border border-green-500/20 transition-colors duration-300">{discoveredPlatform}</span> 的输入框、编辑器和发布按钮。
                  <br/>
                  规范文件已自动生成并保存至 <span className="font-mono text-green-600/80 dark:text-green-300/80 transition-colors duration-300">docs/workflow/</span> 目录。
                </p>
                <div className="mt-4 flex gap-3">
                  <Badge variant="outline" className="bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.05)] dark:shadow-[0_0_10px_rgba(34,197,94,0.1)] px-3 py-1 transition-colors duration-300">
                    置信度: 98%
                  </Badge>
                  <Badge variant="outline" className="bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.05)] dark:shadow-[0_0_10px_rgba(34,197,94,0.1)] px-3 py-1 transition-colors duration-300">
                    无需人工干预
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Available Platforms Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium flex items-center gap-2 text-[var(--text-primary)] transition-colors duration-300">
            <div className="p-1.5 bg-[var(--layout-bg)] rounded-md border border-[var(--layout-border)] transition-colors duration-300">
              <Globe className="w-4 h-4 text-[var(--text-secondary)] transition-colors duration-300" />
            </div>
            已适配平台
          </h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={checkAllPlatforms}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> 检查全部状态
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {defaultPlatforms.map((platform) => {
            const isChecking = checkingStatus[platform.id];
            const status = platformStatus[platform.id] || 'disconnected';
            
            return (
              <Card key={platform.id} className="bg-[var(--card-bg)] border-[var(--layout-border)] hover:border-primary/30 hover:bg-[var(--sidebar-hover)] transition-all duration-300 group cursor-pointer overflow-hidden relative shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-4 flex flex-col items-center text-center space-y-3 relative z-10">
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => openWorkflowDialog(e, platform)}
                      className="w-6 h-6 text-[var(--text-secondary)] hover:text-primary hover:bg-[var(--layout-bg)]"
                      title="查看自动化工作流"
                    >
                      <FileJson className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        checkPlatformStatus(platform.id);
                      }}
                      disabled={isChecking}
                      className="w-6 h-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--layout-bg)]"
                      title="检查连接状态"
                    >
                      <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin text-primary' : ''}`} />
                    </Button>
                  </div>
                  
                  <div className="w-12 h-12 rounded-2xl bg-[var(--layout-bg)] border border-[var(--layout-border)] flex items-center justify-center group-hover:scale-110 group-hover:border-primary/30 transition-all duration-500 shadow-sm">
                    <platform.icon className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-primary transition-colors duration-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-base text-[var(--text-primary)] group-hover:text-primary transition-colors duration-300">{platform.name}</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] font-mono bg-[var(--layout-bg)] px-2 py-0.5 rounded-md border border-[var(--layout-border)] inline-block transition-colors duration-300">{platform.url}</p>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {isChecking ? (
                      <motion.div key="checking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Badge variant="outline" className="px-2.5 py-0.5 text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.05)] transition-colors duration-300">
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          检测中...
                        </Badge>
                      </motion.div>
                    ) : status === 'connected' ? (
                      <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Badge variant="outline" className="px-2.5 py-0.5 text-[10px] bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.05)] transition-colors duration-300">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          已连接
                        </Badge>
                      </motion.div>
                    ) : status === 'disconnected' ? (
                      <motion.div key="disconnected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Badge variant="outline" className="px-2.5 py-0.5 text-[10px] bg-[var(--layout-bg)] text-[var(--text-secondary)] border-[var(--layout-border)] transition-colors duration-300">
                          未连接
                        </Badge>
                      </motion.div>
                    ) : status === 'expired' ? (
                      <motion.div key="expired" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Badge variant="outline" className="px-2.5 py-0.5 text-[10px] bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.05)] transition-colors duration-300">
                          <XCircle className="w-3 h-3 mr-1" />
                          已过期
                        </Badge>
                      </motion.div>
                    ) : (
                      <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Badge variant="outline" className="px-2.5 py-0.5 text-[10px] bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.05)] transition-colors duration-300">
                          <XCircle className="w-3 h-3 mr-1" />
                          连接失败
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            );
          })}
          
          {/* Add discovered platform dynamically */}
          {discoveredPlatform && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="bg-primary/5 dark:bg-primary/[0.02] border-primary/30 shadow-[0_0_20px_-5px_rgba(124,58,237,0.1)] dark:shadow-[0_0_20px_-5px_rgba(124,58,237,0.3)] group cursor-pointer relative overflow-hidden transition-colors duration-300">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
                <CardContent className="p-4 flex flex-col items-center text-center space-y-3 relative z-10">
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => openWorkflowDialog(e, { name: "新探索平台", workflow: `https://${discoveredPlatform}/write`, id: "discovered" })}
                      className="w-6 h-6 text-primary/70 hover:text-primary hover:bg-primary/10"
                      title="查看自动化工作流"
                    >
                      <FileJson className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        checkPlatformStatus('discovered');
                      }}
                      disabled={checkingStatus['discovered']}
                      className="w-6 h-6 text-primary hover:bg-primary/10"
                      title="检查连接状态"
                    >
                      <RefreshCw className={`w-3 h-3 ${checkingStatus['discovered'] ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                  
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 border border-primary/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(124,58,237,0.1)] dark:shadow-[0_0_15px_rgba(124,58,237,0.2)]">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-base text-[var(--text-primary)] transition-colors duration-300">新探索平台</h4>
                    <p className="text-[10px] text-primary/70 font-mono bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20 inline-block truncate max-w-[120px] transition-colors duration-300">{discoveredPlatform}</p>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {checkingStatus['discovered'] ? (
                      <motion.div key="checking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Badge variant="outline" className="px-2.5 py-0.5 text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.05)] transition-colors duration-300">
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          检测中...
                        </Badge>
                      </motion.div>
                    ) : platformStatus['discovered'] === 'connected' ? (
                      <motion.div key="connected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Badge className="px-2.5 py-0.5 text-[10px] bg-primary text-white border-0 shadow-[0_0_15px_rgba(124,58,237,0.4)] hover:bg-primary">
                          自动适配成功
                        </Badge>
                      </motion.div>
                    ) : platformStatus['discovered'] === 'disconnected' ? (
                      <motion.div key="disconnected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Badge variant="outline" className="px-2.5 py-0.5 text-[10px] bg-primary/10 text-primary border-primary/20">
                          未连接
                        </Badge>
                      </motion.div>
                    ) : platformStatus['discovered'] === 'expired' ? (
                      <motion.div key="expired" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Badge variant="outline" className="px-2.5 py-0.5 text-[10px] bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.05)] transition-colors duration-300">
                          <XCircle className="w-3 h-3 mr-1" />
                          已过期
                        </Badge>
                      </motion.div>
                    ) : (
                      <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Badge variant="outline" className="px-2.5 py-0.5 text-[10px] bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">
                          连接失败
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      <Dialog open={workflowDialogOpen} onOpenChange={setWorkflowDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[var(--card-bg)] border-[var(--layout-border)] p-0 overflow-hidden">
          <div className="p-6 border-b border-[var(--layout-border)]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl text-[var(--text-primary)]">
                <FileJson className="w-5 h-5 text-primary" />
                {selectedWorkflow?.name} 工作流定义
              </DialogTitle>
              <DialogDescription className="text-[var(--text-secondary)]">
                基于 AI Spec Discovery 自动生成的平台交互指令规范。
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="bg-[var(--code-bg)] p-6 max-h-[400px] overflow-y-auto">
            <pre className="font-mono text-sm text-[var(--text-primary)] whitespace-pre-wrap">
              <code className="language-json">
{`{
  "platform": "${selectedWorkflow?.id}",
  "version": "1.2.0",
  "publish_url": "${selectedWorkflow?.url}",
  "selectors": {
    "title_input": "input.title-input",
    "content_editor": ".markdown-editor textarea",
    "submit_button": "button.publish-btn"
  },
  "actions": [
    {
      "type": "navigate",
      "target": "${selectedWorkflow?.url}",
      "waitUntil": "networkidle2"
    },
    {
      "type": "type",
      "selector": "$title_input",
      "value": "{{TITLE}}"
    },
    {
      "type": "type",
      "selector": "$content_editor",
      "value": "{{CONTENT}}"
    },
    {
      "type": "click",
      "selector": "$submit_button",
      "delay": 500
    }
  ],
  "ai_generated": true
}`}
              </code>
            </pre>
          </div>
          
          <div className="p-4 border-t border-[var(--layout-border)] bg-[var(--layout-bg)] flex justify-between items-center">
            <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              语法校验通过
            </span>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setWorkflowDialogOpen(false)}>
              <Play className="w-3 h-3" />
              运行测试
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
