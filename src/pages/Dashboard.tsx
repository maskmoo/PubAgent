import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle2, XCircle, Clock, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "今日发布任务", value: "12", icon: Activity, color: "text-blue-500" },
  { label: "成功发布", value: "10", icon: CheckCircle2, color: "text-green-500" },
  { label: "待执行", value: "2", icon: Clock, color: "text-yellow-500" },
  { label: "AI修复失败", value: "0", icon: XCircle, color: "text-red-500" },
];

const recentTasks = [
  { id: 1, title: "Next.js 15 全新特性解析", platform: "知乎", status: "success", time: "10 分钟前", aiFixed: false },
  { id: 2, title: "React 19 Server Components 指南", platform: "掘金", status: "success", time: "1 小时前", aiFixed: true },
  { id: 3, title: "如何用 AI 探索新平台发布", platform: "CSDN", status: "pending", time: "排期: 18:00", aiFixed: false },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">控制台</h1>
        <p className="text-muted-foreground mt-2">欢迎回来，创作者。AI 代理正在为您处理分发任务。</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/40 overflow-hidden relative group">
              <div className={`absolute inset-0 bg-gradient-to-br from-background to-${stat.color.split('-')[1]}-500/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-card/50 backdrop-blur-sm border-border/40">
          <CardHeader>
            <CardTitle>近期分发任务</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center">
                  <div className="flex flex-col space-y-1 w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{task.title}</span>
                      <span className="text-xs text-muted-foreground">{task.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-md">
                          {task.platform}
                        </span>
                        {task.aiFixed && (
                          <span className="text-xs font-medium px-2 py-1 bg-primary/20 text-primary flex items-center gap-1 rounded-md">
                            <Zap className="w-3 h-3" />
                            AI修复成功
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        {task.status === 'success' ? (
                          <span className="flex h-2 w-2 rounded-full bg-green-500" />
                        ) : (
                          <span className="flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-purple-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI 黄金时间建议
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <p className="text-sm text-muted-foreground">根据您的粉丝画像和历史数据，AI 代理计算出各平台最佳发布时间：</p>
            <ul className="space-y-3">
              <li className="flex justify-between items-center bg-background/50 p-3 rounded-lg backdrop-blur-md">
                <span className="font-medium text-sm">知乎</span>
                <span className="text-primary font-mono font-bold">18:30 - 20:00</span>
              </li>
              <li className="flex justify-between items-center bg-background/50 p-3 rounded-lg backdrop-blur-md">
                <span className="font-medium text-sm">掘金</span>
                <span className="text-primary font-mono font-bold">09:00 - 10:30</span>
              </li>
              <li className="flex justify-between items-center bg-background/50 p-3 rounded-lg backdrop-blur-md">
                <span className="font-medium text-sm">CSDN</span>
                <span className="text-primary font-mono font-bold">14:00 - 16:00</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
