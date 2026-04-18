import express from 'express';
import cors from 'cors';
import { streamText, generateObject, generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;

// Helper to create an AI provider instance based on request headers
const getProvider = (req: express.Request) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '') || '';
  const baseUrl = (req.headers['x-base-url'] as string) || 'https://api.openai.com/v1';
  
  return createOpenAI({
    apiKey,
    baseURL: baseUrl,
  });
};

app.post('/api/optimize', async (req, res) => {
  try {
    const { title, content } = req.body;
    const openai = getProvider(req);
    
    const result = streamText({
      // We use gpt-4o-mini as a default fast/cheap model if available
      model: openai('gpt-4o-mini'),
      system: '你是一位精通多平台排版与SEO的资深技术编辑。你的任务是优化用户提供的Markdown文章内容（适用于知乎、掘金、CSDN等平台）。请在文章开头加上引人注目的“AI 摘要”，在结尾总结“核心要点”，并适当美化排版与结构。',
      prompt: `原标题: ${title}\n\n原内容:\n${content}`,
    });

    result.pipeDataStreamToResponse(res);
  } catch (error) {
    console.error('Optimize error:', error);
    res.status(500).json({ error: 'Failed to optimize content' });
  }
});

app.post('/api/generate-tags', async (req, res) => {
  try {
    const { title, description } = req.body;
    const openai = getProvider(req);

    // If no key is provided, just return mock
    if (!req.headers.authorization || req.headers.authorization === 'Bearer sk-************************************' || req.headers.authorization === 'Bearer ') {
       return res.json({ tags: ["#科技探索", "#AI", "#提效神器", "#自媒体", "#干货分享"] });
    }

    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        tags: z.array(z.string().describe('单个带#号的标签，例如 #科技')),
      }),
      prompt: `请根据以下视频的标题和描述，生成5个最容易在B站、抖音等平台获得高推荐量的标签（带#号）：\n标题: ${title}\n描述: ${description}`,
    });

    res.json({ tags: object.tags });
  } catch (error) {
    console.error('Tags generation error:', error);
    // Fallback if AI fails
    res.json({ tags: ["#科技探索", "#AI", "#提效神器", "#自媒体", "#干货分享"] });
  }
});

app.post('/api/publish', async (req, res) => {
  // Mock publish endpoint
  const { type, content, platforms } = req.body;
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  res.json({ success: true, message: `Successfully published ${type} to ${platforms?.length || 1} platforms.` });
});

app.post('/api/discover-platform', async (req, res) => {
  const { url } = req.body;
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const domain = urlObj.hostname.replace('www.', '');
    res.json({ success: true, platform: domain });
  } catch (e) {
    res.json({ success: true, platform: url });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
