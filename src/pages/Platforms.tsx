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
        <h1 className="text-3xl font-bold tracking-tight">平台与探索</h1>
        <p className="text-muted-foreground mt-2">管理已有平台，或通过 AI Spec Discovery 自动适配全新平台。</p>
      </div>

      {/* AI Discovery Section */}
      <Card className="bg-gradient-to-r from-primary/10 via-pink-500/10 to-indigo-500/10 border-primary/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-primary">
            <Sparkles className="w-6 h-6" />
            AI 探索新平台 (AI Spec Discovery)
          </CardTitle>
          <CardDescription className="text-foreground/80">
            无需写代码！只需提供发布页面的 URL，AI 将利用视觉技术自动“看懂”结构并生成工作流。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-primary/50 group-focus-within:text-primary transition-colors" />
              </div>
              <Input 
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://v2ex.com/write..." 
                className="pl-10 h-12 bg-background/50 backdrop-blur-sm border-primary/30 focus-visible:ring-primary shadow-inner"
              />
            </div>
            <Button 
              size="lg" 
              variant="sparkle" 
              onClick={handleDiscovery} 
              disabled={isDiscovering || !newUrl}
              className="w-full sm:w-auto min-w-[140px]"
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
              className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-4"
            >
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-green-500">探索成功！</h4>
                <p className="text-sm text-green-600/80 mt-1">
                  AI 已成功识别 {discoveredPlatform} 的输入框、编辑器和发布按钮。
                  <br/>
                  规范文件已自动生成并保存至 `docs/workflow/` 目录。
                </p>
                <div className="mt-3 flex gap-2">
                  <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-500/30">
                    置信度: 98%
                  </Badge>
                  <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-500/30">
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
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-muted-foreground" />
          已适配平台
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {defaultPlatforms.map((platform) => (
            <Card key={platform.id} className="bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/50 transition-colors group cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <platform.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{platform.name}</h4>
                  <p className="text-xs text-muted-foreground font-mono mt-1">{platform.url}</p>
                </div>
                <Badge variant="success" className="px-3">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  账号已连接
                </Badge>
              </CardContent>
            </Card>
          ))}
          
          {/* Add discovered platform dynamically */}
          {discoveredPlatform && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="bg-card/50 backdrop-blur-sm border-primary shadow-[0_0_15px_-3px_rgba(124,58,237,0.3)] group cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-20" />
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">新平台</h4>
                    <p className="text-xs text-muted-foreground font-mono mt-1 truncate max-w-[120px]">{discoveredPlatform}</p>
                  </div>
                  <Badge variant="success" className="px-3 bg-gradient-to-r from-primary to-pink-500 text-white border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
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
