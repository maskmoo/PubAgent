import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Loader2, Save } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from "framer-motion";

const platforms = [
  { id: "zhihu", name: "知乎", selected: true },
  { id: "juejin", name: "掘金", selected: false },
  { id: "csdn", name: "CSDN", selected: false },
  { id: "jianshu", name: "简书", selected: false },
];

export function Editor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedContent, setOptimizedContent] = useState("");

  const handleOptimize = async () => {
    setIsOptimizing(true);
    // Simulate AI processing
    setTimeout(() => {
      setOptimizedContent(
        `# ${title || "这里是 AI 优化的标题"}\n\n> 🤖 **AI 摘要**：本文将探讨最新技术在全平台的应用，为您带来深入的见解与实战指南。\n\n${content}\n\n## 核心要点\n- 🚀 性能优化\n- 💡 架构升级\n\n---\n*本文由 PubAgent 辅助排版与优化*`
      );
      setIsOptimizing(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">创作与发布</h1>
          <p className="text-muted-foreground mt-2 text-sm">编写 Markdown 内容，AI 代理将自动为您优化和分发。</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
            <Save className="w-4 h-4" />
            保存草稿
          </Button>
          <Button variant="sparkle" onClick={handleOptimize} disabled={isOptimizing} className="gap-2 flex-1 sm:flex-none">
            {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            AI 内容优化
          </Button>
          <Button className="gap-2 bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex-1 sm:flex-none">
            <Send className="w-4 h-4" />
            智能发布
          </Button>
        </div>
      </div>

      <Card className="bg-white/[0.01] border-white/[0.05] p-4 flex items-center gap-4">
        <Label className="text-muted-foreground whitespace-nowrap text-sm font-medium">分发平台:</Label>
        <div className="flex gap-2 flex-wrap">
          {platforms.map(p => (
            <Badge 
              key={p.id} 
              variant={p.selected ? "default" : "secondary"}
              className={`cursor-pointer transition-all duration-300 px-3 py-1 ${
                p.selected 
                  ? "bg-primary text-white shadow-[0_0_10px_rgba(124,58,237,0.3)] hover:bg-primary/90" 
                  : "bg-white/[0.05] text-white/70 hover:bg-white/[0.1] hover:text-white"
              }`}
            >
              {p.name}
            </Badge>
          ))}
          <Badge variant="outline" className="border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/50 cursor-pointer bg-transparent transition-colors">
            + 探索新平台
          </Badge>
        </div>
      </Card>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
        {/* Editor Column */}
        <Card className="flex flex-col bg-white/[0.01] border-white/[0.05] shadow-inner overflow-hidden relative">
          <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          <CardContent className="flex-1 p-0 flex flex-col relative z-10">
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入文章标题..." 
              className="text-xl font-bold border-0 border-b border-white/[0.05] rounded-none focus-visible:ring-0 px-6 py-6 bg-transparent text-white placeholder:text-white/20"
            />
            <Textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="在此使用 Markdown 编写您的内容..." 
              className="flex-1 border-0 rounded-none focus-visible:ring-0 resize-none px-6 py-4 font-mono text-sm leading-relaxed bg-transparent text-white/80 placeholder:text-white/20 focus:outline-none"
            />
          </CardContent>
        </Card>

        {/* Preview Column */}
        <Card className="flex flex-col bg-[#050505] border-white/[0.05] overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-primary via-blue-500 to-primary/50 opacity-70" />
          <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="p-4 border-b border-white/[0.05] bg-white/[0.02] flex justify-between items-center z-10 backdrop-blur-sm">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">多平台自适应预览</span>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_rgba(124,58,237,0.1)]">
              <Sparkles className="w-3 h-3 mr-1.5" /> AI 优化版
            </Badge>
          </div>
          <CardContent className="flex-1 overflow-y-auto p-6 z-10">
            <AnimatePresence mode="wait">
              {isOptimizing ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-primary space-y-4"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <Loader2 className="w-8 h-8 animate-spin relative z-10" />
                  </div>
                  <p className="text-sm text-primary/80 animate-pulse font-mono">正在生成优化方案...</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="editor-prose prose-invert prose-p:text-white/70 prose-headings:text-white"
                >
                  {optimizedContent || content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {optimizedContent || content}
                    </ReactMarkdown>
                  ) : (
                    <div className="h-full flex items-center justify-center text-white/20 font-mono text-sm border-2 border-dashed border-white/[0.05] rounded-xl mt-10 p-10">
                      预览区域
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
