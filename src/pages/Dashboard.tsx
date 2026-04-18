import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle2, XCircle, Clock, Zap, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const defaultStats = [
  { label: "总创建任务", value: "-", icon: Activity, color: "text-blue-400" },
  { label: "成功发布", value: "-", icon: CheckCircle2, color: "text-green-400" },
  { label: "待执行", value: "-", icon: Clock, color: "text-yellow-400" },
  { label: "AI修复失败", value: "-", icon: XCircle, color: "text-red-400" },
];

export function Dashboard() {
  const [stats, setStats] = useState(defaultStats);
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [goldenTimes, setGoldenTimes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        
        if (data.success) {
          // Merge API stats values with our defaultStats to keep the icons/colors
          const newStats = defaultStats.map(s => {
            const apiStat = data.stats.find((as: any) => as.label === s.label);
            return apiStat ? { ...s, value: apiStat.value } : s;
          });
          
          setStats(newStats);
          setRecentTasks(data.recentTasks);
          setGoldenTimes(data.goldenTimes);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] transition-colors duration-300">控制台</h1>
        <p className="text-[var(--text-secondary)] mt-2 text-sm transition-colors duration-300">欢迎回来，创作者。AI 代理正在为您处理分发任务。</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden group border-[var(--layout-border)] bg-[var(--card-bg)] shadow-sm">
              <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
                <CardTitle className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider transition-colors duration-300">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-md bg-[var(--layout-bg)] border border-[var(--layout-border)] ${stat.color} transition-colors duration-300`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-bold text-[var(--text-primary)] tracking-tight transition-colors duration-300">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-[var(--layout-border)] bg-[var(--card-bg)] relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-lg text-[var(--text-primary)] transition-colors duration-300 flex items-center gap-2">
              近期分发任务
              {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center group p-3 rounded-lg hover:bg-[var(--sidebar-hover)] border border-transparent hover:border-[var(--layout-border)] transition-all duration-300">
                  <div className="flex flex-col space-y-1.5 w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-[var(--text-primary)] group-hover:text-primary transition-colors">{task.title}</span>
                      <span className="text-[11px] text-[var(--text-secondary)] font-mono">{task.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-[var(--layout-bg)] text-[var(--text-secondary)] rounded border border-[var(--layout-border)] transition-colors duration-300">
                          {task.platform}
                        </span>
                        {task.aiFixed && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded flex items-center gap-1 shadow-[0_0_10px_rgba(124,58,237,0.1)]">
                            <Zap className="w-3 h-3" />
                            AI修复成功
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        {task.status === 'success' ? (
                          <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        ) : (
                          <span className="flex h-2 w-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)] animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-primary/20 bg-primary/[0.02] relative overflow-hidden group shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/10 dark:bg-primary/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-all duration-700" />
          <div className="absolute bottom-4 right-4 opacity-[0.03] text-primary">
            <Zap className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5" />
              AI 黄金时间建议
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 relative z-10">
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed transition-colors duration-300">根据您的粉丝画像和历史数据，AI 代理计算出各平台最佳发布时间：</p>
            <ul className="space-y-3">
              {goldenTimes.map((platform: any) => (
                <li key={platform.name} className="flex justify-between items-center bg-[var(--layout-bg)] border border-[var(--layout-border)] p-3 rounded-lg backdrop-blur-md transition-colors duration-300">
                  <span className="font-medium text-xs text-[var(--text-primary)] transition-colors duration-300">{platform.name}</span>
                  <span className="text-primary font-mono font-bold text-sm tracking-tight">{platform.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
