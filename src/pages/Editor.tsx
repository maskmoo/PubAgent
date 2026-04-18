import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Send, Loader2, Save, FileText, Video, UploadCloud } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from "framer-motion";
import { useSettingsStore } from "@/store/useSettingsStore";

const initialArticlePlatforms = [
  { id: "zhihu", name: "知乎", selected: false, connected: false },
  { id: "juejin", name: "掘金", selected: false, connected: false },
  { id: "csdn", name: "CSDN", selected: false, connected: false },
  { id: "jianshu", name: "简书", selected: false, connected: false },
];

const initialVideoPlatforms = [
  { id: "bilibili", name: "Bilibili", selected: false, connected: false },
  { id: "douyin", name: "抖音", selected: false, connected: false },
  { id: "kuaishou", name: "快手", selected: false, connected: false },
  { id: "xiaohongshu", name: "小红书", selected: false, connected: false },
];

export function Editor() {
  const [activeTab, setActiveTab] = useState("article");
  const { openAiKey, openAiBaseUrl } = useSettingsStore();
  
  const [articlePlatforms, setArticlePlatforms] = useState(initialArticlePlatforms);
  const [videoPlatforms, setVideoPlatforms] = useState(initialVideoPlatforms);

  useEffect(() => {
    const fetchStatuses = async () => {
      const checkPlatform = async (id: string) => {
        try {
          const res = await fetch(`/api/platforms/${id}/status`);
          const data = await res.json();
          return data.status === 'connected';
        } catch {
          return false;
        }
      };

      const articleStatuses = await Promise.all(initialArticlePlatforms.map(p => checkPlatform(p.id)));
      setArticlePlatforms(prev => prev.map((p, i) => ({ 
        ...p, 
        connected: articleStatuses[i], 
        // Auto-select the first connected platform
        selected: articleStatuses[i] && !prev.some(ap => ap.selected && ap.connected) ? true : (articleStatuses[i] ? p.selected : false)
      })));

      const videoStatuses = await Promise.all(initialVideoPlatforms.map(p => checkPlatform(p.id)));
      setVideoPlatforms(prev => prev.map((p, i) => ({ 
        ...p, 
        connected: videoStatuses[i], 
        selected: videoStatuses[i] && !prev.some(vp => vp.selected && vp.connected) ? true : (videoStatuses[i] ? p.selected : false)
      })));
    };
    fetchStatuses();
  }, []);

  const toggleArticlePlatform = (id: string) => {
    setArticlePlatforms(prev => prev.map(p => {
      if (p.id === id) {
        if (!p.connected) return p; // cannot select disconnected
        return { ...p, selected: !p.selected };
      }
      return p;
    }));
  };

  const toggleVideoPlatform = (id: string) => {
    setVideoPlatforms(prev => prev.map(p => {
      if (p.id === id) {
        if (!p.connected) return p; // cannot select disconnected
        return { ...p, selected: !p.selected };
      }
      return p;
    }));
  };

  // Article states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedContent, setOptimizedContent] = useState("");

  // Video states
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);

  // Common publishing states
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setOptimizedContent("");
    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAiKey}`,
          "x-base-url": openAiBaseUrl,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok || !response.body) throw new Error("Optimization failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setOptimizedContent((prev) => prev + chunk);
      }
    } catch (error) {
      console.error(error);
      setOptimizedContent("优化失败，请检查设置页面的 API Key 是否正确填写。");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleGenerateTags = async () => {
    setIsGeneratingTags(true);
    try {
      const response = await fetch("/api/generate-tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAiKey}`,
          "x-base-url": openAiBaseUrl,
        },
        body: JSON.stringify({ title: videoTitle, description: videoDesc }),
      });
      const data = await response.json();
      if (data.tags) {
        setGeneratedTags(data.tags);
      }
    } catch (error) {
      console.error(error);
      setGeneratedTags(["#科技探索", "#AI", "#提效神器", "#自媒体", "#干货分享"]);
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const handlePublish = async () => {
    // Basic validation
    const selectedArticlePlatforms = articlePlatforms.filter(p => p.selected);
    const selectedVideoPlatforms = videoPlatforms.filter(p => p.selected);
    
    if (activeTab === 'article' && (!title && !content || selectedArticlePlatforms.length === 0)) return;
    if (activeTab === 'video' && (!videoFile || selectedVideoPlatforms.length === 0)) return;

    setIsPublishing(true);
    setPublishSuccess(false);

    try {
      const platforms = activeTab === 'article' 
        ? selectedArticlePlatforms.map(p => p.id)
        : selectedVideoPlatforms.map(p => p.id);

      await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: activeTab === 'article' ? title : videoTitle,
          type: activeTab,
          content: activeTab === 'article' ? (optimizedContent || content) : videoDesc,
          platforms
        }),
      });

      setPublishSuccess(true);
      // Reset success state after a while
      setTimeout(() => setPublishSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    const selectedArticlePlatforms = articlePlatforms.filter(p => p.selected);
    const selectedVideoPlatforms = videoPlatforms.filter(p => p.selected);

    if (activeTab === 'article' && !title && !content) return;
    if (activeTab === 'video' && !videoTitle && !videoDesc) return;

    setIsSavingDraft(true);
    try {
      const platforms = activeTab === 'article' 
        ? selectedArticlePlatforms.map(p => p.id)
        : selectedVideoPlatforms.map(p => p.id);

      await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeTab,
          title: activeTab === 'article' ? title : videoTitle,
          content: activeTab === 'article' ? content : videoDesc,
          platforms
        }),
      });

      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const isArticleInvalid = activeTab === 'article' && (!title && !content || articlePlatforms.filter(p => p.selected).length === 0);
  const isVideoInvalid = activeTab === 'video' && (!videoFile || videoPlatforms.filter(p => p.selected).length === 0);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] transition-colors duration-300">创作与发布</h1>
          <p className="text-[var(--text-secondary)] mt-2 text-sm transition-colors duration-300">编写 Markdown 内容，AI 代理将自动为您优化和分发。</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            disabled={isSavingDraft || (activeTab === 'article' && !title && !content) || (activeTab === 'video' && !videoTitle && !videoDesc)}
            className={`gap-2 flex-1 sm:flex-none transition-all duration-300 ${draftSaved ? "border-green-500 text-green-500 bg-green-500/10" : ""}`}
          >
            {isSavingDraft ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {draftSaved ? "已保存" : "保存草稿"}
          </Button>
          {activeTab === "article" && (
            <Button variant="sparkle" onClick={handleOptimize} disabled={isOptimizing} className="gap-2 flex-1 sm:flex-none">
              {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              AI 内容优化
            </Button>
          )}
          <Button 
            onClick={handlePublish}
            disabled={isPublishing || isArticleInvalid || isVideoInvalid}
            className={`gap-2 flex-1 sm:flex-none transition-all duration-300 ${
              publishSuccess 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : "bg-[var(--text-primary)] text-[var(--layout-bg)] hover:opacity-90 shadow-sm"
            }`}
          >
            {isPublishing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : publishSuccess ? (
              "发布成功"
            ) : (
              <>
                <Send className="w-4 h-4" />
                智能发布
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 h-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-6">
          <TabsTrigger value="article" className="gap-2">
            <FileText className="w-4 h-4" />
            图文创作
          </TabsTrigger>
          <TabsTrigger value="video" className="gap-2">
            <Video className="w-4 h-4" />
            视频发布
          </TabsTrigger>
        </TabsList>

        <TabsContent value="article" className="flex-1 flex flex-col gap-6 m-0 border-none p-0 outline-none data-[state=active]:flex">
          <Card className="bg-[var(--card-bg)] border-[var(--layout-border)] p-4 flex items-center gap-4 shadow-sm transition-colors duration-300">
            <Label className="text-[var(--text-secondary)] whitespace-nowrap text-sm font-medium transition-colors duration-300">分发平台:</Label>
            <div className="flex gap-2 flex-wrap">
              {articlePlatforms.map(p => (
                <Badge 
                  key={p.id} 
                  variant={p.selected ? "default" : "secondary"}
                  onClick={() => toggleArticlePlatform(p.id)}
                  className={`cursor-pointer transition-all duration-300 px-3 py-1 ${
                    !p.connected 
                      ? "opacity-50 cursor-not-allowed bg-[var(--layout-bg)] text-[var(--text-secondary)] border border-[var(--layout-border)]"
                      : p.selected 
                        ? "bg-primary text-white shadow-[0_0_10px_rgba(124,58,237,0.3)] hover:bg-primary/90" 
                        : "bg-[var(--layout-bg)] text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)] border border-[var(--layout-border)]"
                  }`}
                  title={!p.connected ? "此平台未连接，请前往设置页连接" : ""}
                >
                  {p.name} {!p.connected && "(未连接)"}
                </Badge>
              ))}
              <Badge variant="outline" className="border-dashed border-[var(--layout-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] cursor-pointer bg-transparent transition-colors">
                + 探索新平台
              </Badge>
            </div>
          </Card>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
            {/* Editor Column */}
            <Card className="flex flex-col bg-[var(--card-bg)] border-[var(--layout-border)] shadow-sm overflow-hidden relative transition-colors duration-300">
              <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
              <CardContent className="flex-1 p-0 flex flex-col relative z-10">
                <Input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="输入文章标题..." 
                  className="text-xl font-bold border-0 border-b border-[var(--layout-border)] rounded-none focus-visible:ring-0 px-6 py-6 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 transition-colors duration-300"
                />
                <Textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="在此使用 Markdown 编写您的内容..." 
                  className="flex-1 border-0 rounded-none focus-visible:ring-0 resize-none px-6 py-4 font-mono text-sm leading-relaxed bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none transition-colors duration-300"
                />
              </CardContent>
            </Card>

            {/* Preview Column */}
            <Card className="flex flex-col bg-[var(--code-bg)] border-[var(--layout-border)] overflow-hidden relative shadow-sm transition-colors duration-300">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-primary via-blue-500 to-primary/50 opacity-70" />
              <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />
              
              <div className="p-4 border-b border-[var(--layout-border)] bg-[var(--card-bg)]/50 flex justify-between items-center z-10 backdrop-blur-sm transition-colors duration-300">
                <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest transition-colors duration-300">多平台自适应预览</span>
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
                      className="editor-prose prose-p:text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)]"
                    >
                      {optimizedContent || content ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {optimizedContent || content}
                        </ReactMarkdown>
                      ) : (
                        <div className="h-full flex items-center justify-center text-[var(--text-secondary)] font-mono text-sm border-2 border-dashed border-[var(--layout-border)] rounded-xl mt-10 p-10 transition-colors duration-300">
                          预览区域
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="video" className="flex-1 flex flex-col gap-6 m-0 border-none p-0 outline-none data-[state=active]:flex">
          <Card className="bg-[var(--card-bg)] border-[var(--layout-border)] p-4 flex items-center gap-4 shadow-sm transition-colors duration-300">
            <Label className="text-[var(--text-secondary)] whitespace-nowrap text-sm font-medium transition-colors duration-300">分发平台:</Label>
            <div className="flex gap-2 flex-wrap">
              {videoPlatforms.map(p => (
                <Badge 
                  key={p.id} 
                  variant={p.selected ? "default" : "secondary"}
                  onClick={() => toggleVideoPlatform(p.id)}
                  className={`cursor-pointer transition-all duration-300 px-3 py-1 ${
                    !p.connected 
                      ? "opacity-50 cursor-not-allowed bg-[var(--layout-bg)] text-[var(--text-secondary)] border border-[var(--layout-border)]"
                      : p.selected 
                        ? "bg-primary text-white shadow-[0_0_10px_rgba(124,58,237,0.3)] hover:bg-primary/90" 
                        : "bg-[var(--layout-bg)] text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)] border border-[var(--layout-border)]"
                  }`}
                  title={!p.connected ? "此平台未连接，请前往设置页连接" : ""}
                >
                  {p.name} {!p.connected && "(未连接)"}
                </Badge>
              ))}
            </div>
          </Card>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
            {/* Upload & Form Column */}
            <div className="flex flex-col gap-6">
              <Card className="bg-[var(--card-bg)] border-[var(--layout-border)] overflow-hidden transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="border-2 border-dashed border-[var(--layout-border)] rounded-xl p-10 flex flex-col items-center justify-center gap-4 hover:bg-[var(--layout-bg)]/50 transition-colors cursor-pointer group">
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={handleFileChange}
                      className="hidden" 
                      id="video-upload" 
                    />
                    <Label htmlFor="video-upload" className="flex flex-col items-center gap-3 cursor-pointer w-full">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <UploadCloud className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="font-medium text-[var(--text-primary)]">
                          {videoFile ? videoFile.name : "点击或拖拽上传视频文件"}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">支持 MP4, WebM 格式，最大 2GB</p>
                      </div>
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1 bg-[var(--card-bg)] border-[var(--layout-border)] overflow-hidden transition-colors duration-300">
                <CardContent className="p-6 flex flex-col gap-5 h-full">
                  <div className="space-y-2">
                    <Label htmlFor="video-title" className="text-[var(--text-secondary)]">视频标题</Label>
                    <Input 
                      id="video-title"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="填写吸引人的视频标题..." 
                      className="bg-[var(--input-bg)] border-[var(--layout-border)] text-[var(--text-primary)] transition-colors duration-300"
                    />
                  </div>
                  
                  <div className="space-y-2 flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="video-desc" className="text-[var(--text-secondary)]">视频描述与标签</Label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleGenerateTags}
                        disabled={isGeneratingTags}
                        className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10"
                      >
                        {isGeneratingTags ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                        AI 智能生成
                      </Button>
                    </div>
                    <Textarea 
                      id="video-desc"
                      value={videoDesc}
                      onChange={(e) => setVideoDesc(e.target.value)}
                      placeholder="在此编写视频描述，或点击右上角 AI 智能生成标签和摘要..." 
                      className="flex-1 resize-none bg-[var(--input-bg)] border-[var(--layout-border)] text-[var(--text-primary)] transition-colors duration-300"
                    />
                    {generatedTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {generatedTags.map(tag => (
                          <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Column for Video */}
            <Card className="flex flex-col bg-[var(--code-bg)] border-[var(--layout-border)] overflow-hidden relative shadow-sm transition-colors duration-300">
              <div className="p-4 border-b border-[var(--layout-border)] bg-[var(--card-bg)]/50 flex justify-between items-center z-10 backdrop-blur-sm transition-colors duration-300">
                <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest">视频信息预览</span>
              </div>
              <CardContent className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                {videoFile ? (
                  <div className="w-full space-y-4">
                    <div className="aspect-video bg-black/10 dark:bg-white/5 rounded-lg border border-[var(--layout-border)] flex items-center justify-center overflow-hidden relative group">
                      <Video className="w-12 h-12 text-[var(--text-secondary)]/50" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" className="gap-2">预览播放</Button>
                      </div>
                    </div>
                    <div className="text-left space-y-2 p-4 bg-[var(--layout-bg)] rounded-lg border border-[var(--layout-border)]">
                      <h3 className="font-bold text-lg text-[var(--text-primary)] truncate">{videoTitle || "未设置标题"}</h3>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-3">{videoDesc || "暂无描述"}</p>
                      <div className="flex gap-2 pt-2">
                        {generatedTags.map(tag => (
                          <span key={tag} className="text-xs text-primary">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-[var(--text-secondary)] space-y-3">
                    <Video className="w-12 h-12 mx-auto opacity-50" />
                    <p>上传视频后在此预览信息</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
