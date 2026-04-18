import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, CheckCircle2, Globe, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const defaultPlatforms = [
  { id: "zhihu", name: "知乎", url: "zhihu.com", status: "active", icon: Globe },
  { id: "juejin", name: "掘金", url: "juejin.cn", status: "active", icon: Globe },
  { id: "csdn", name: "CSDN", url: "csdn.net", status: "active", icon: Globe },
  { id: "jianshu", name: "简书", url: "jianshu.com", status: "active", icon: Globe },
];

export function Platforms() {
  const [newUrl, setNewUrl] = useState("");
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveredPlatform, setDiscoveredPlatform] = useState<string | null>(null);

  const handleDiscovery = () => {
    if (!newUrl) return;
    setIsDiscovering(true);
    setDiscoveredPlatform(null);

    // Simulate AI Vision Discovery
    setTimeout(() => {
      setIsDiscovering(false);
      setDiscoveredPlatform(newUrl);
      setNewUrl("");
    }, 3000);
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
        <h3 className="text-lg font-medium mb-6 flex items-center gap-2 text-[var(--text-primary)] transition-colors duration-300">
          <div className="p-1.5 bg-[var(--layout-bg)] rounded-md border border-[var(--layout-border)] transition-colors duration-300">
            <Globe className="w-4 h-4 text-[var(--text-secondary)] transition-colors duration-300" />
          </div>
          已适配平台
        </h3>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {defaultPlatforms.map((platform) => (
            <Card key={platform.id} className="bg-[var(--card-bg)] border-[var(--layout-border)] hover:border-primary/30 hover:bg-[var(--sidebar-hover)] transition-all duration-300 group cursor-pointer overflow-hidden relative shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 flex flex-col items-center text-center space-y-5 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-[var(--layout-bg)] border border-[var(--layout-border)] flex items-center justify-center group-hover:scale-110 group-hover:border-primary/30 transition-all duration-500 shadow-sm">
                  <platform.icon className="w-7 h-7 text-[var(--text-secondary)] group-hover:text-primary transition-colors duration-500" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-primary transition-colors duration-300">{platform.name}</h4>
                  <p className="text-xs text-[var(--text-secondary)] font-mono mt-1.5 bg-[var(--layout-bg)] px-2 py-0.5 rounded-md border border-[var(--layout-border)] inline-block transition-colors duration-300">{platform.url}</p>
                </div>
                <Badge variant="outline" className="px-3 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.05)] transition-colors duration-300">
                  <CheckCircle2 className="w-3 h-3 mr-1.5" />
                  账号已连接
                </Badge>
              </CardContent>
            </Card>
          ))}
          
          {/* Add discovered platform dynamically */}
          {discoveredPlatform && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="bg-primary/5 dark:bg-primary/[0.02] border-primary/30 shadow-[0_0_20px_-5px_rgba(124,58,237,0.1)] dark:shadow-[0_0_20px_-5px_rgba(124,58,237,0.3)] group cursor-pointer relative overflow-hidden transition-colors duration-300">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
                <CardContent className="p-6 flex flex-col items-center text-center space-y-5 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 border border-primary/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(124,58,237,0.1)] dark:shadow-[0_0_15px_rgba(124,58,237,0.2)]">
                    <Sparkles className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[var(--text-primary)] transition-colors duration-300">新平台</h4>
                    <p className="text-xs text-primary/70 font-mono mt-1.5 bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20 inline-block truncate max-w-[120px] transition-colors duration-300">{discoveredPlatform}</p>
                  </div>
                  <Badge className="px-3 bg-primary text-white border-0 shadow-[0_0_15px_rgba(124,58,237,0.4)] hover:bg-primary">
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    AI 自动适配
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
