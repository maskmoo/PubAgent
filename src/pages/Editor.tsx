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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">创作与发布</h1>
          <p className="text-muted-foreground mt-2">编写 Markdown 内容，AI 代理将自动为您优化和分发。</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Save className="w-4 h-4" />
            保存草稿
          </Button>
          <Button variant="sparkle" onClick={handleOptimize} disabled={isOptimizing} className="gap-2">
            {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            AI 内容优化
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
            <Send className="w-4 h-4" />
            智能发布
          </Button>
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/40 p-4">
        <div className="flex items-center gap-4">
          <Label className="text-muted-foreground whitespace-nowrap">分发平台:</Label>
          <div className="flex gap-2 flex-wrap">
            {platforms.map(p => (
              <Badge 
                key={p.id} 
                variant={p.selected ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary/80 px-3 py-1"
              >
                {p.name}
              </Badge>
            ))}
            <Badge variant="outline" className="border-dashed border-primary text-primary cursor-pointer">
              + 探索新平台
            </Badge>
          </div>
        </div>
      </Card>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
        {/* Editor Column */}
        <Card className="flex flex-col bg-card/50 backdrop-blur-sm border-border/40 shadow-inner">
          <CardContent className="flex-1 p-0 flex flex-col">
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入文章标题..." 
              className="text-xl font-bold border-0 border-b rounded-none focus-visible:ring-0 px-6 py-6 bg-transparent"
            />
            <Textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="在此使用 Markdown 编写您的内容..." 
              className="flex-1 border-0 rounded-none focus-visible:ring-0 resize-none px-6 py-4 font-mono text-sm leading-relaxed bg-transparent"
            />
          </CardContent>
        </Card>

        {/* Preview Column */}
        <Card className="flex flex-col bg-zinc-950/50 backdrop-blur-sm border-border/40 overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <div className="p-4 border-b border-border/40 bg-black/20 flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">多平台自适应预览</span>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" /> AI 优化版
            </Badge>
          </div>
          <CardContent className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {isOptimizing ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-primary space-y-4"
                >
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="text-sm animate-pulse">AI 正在根据各平台调性优化文风与提取 SEO 关键词...</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="editor-prose"
                >
                  {optimizedContent || content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {optimizedContent || content}
                    </ReactMarkdown>
                  ) : (
                    <div className="text-center text-muted-foreground mt-20">
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
