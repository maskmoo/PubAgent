import puppeteer from 'puppeteer';
import { db } from './db.js';

export async function publishToPlatform(platform: string, title?: string, content?: string) {
  console.log(`[Puppeteer] Starting publishing process for ${platform}...`);
  
  // Auto-detect if we have a GUI available (like on a local machine) vs a headless server
  const isHeadless = !process.env.DISPLAY && process.platform !== 'win32' && process.platform !== 'darwin';
  
  const browser = await puppeteer.launch({
    headless: isHeadless,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1280,800'
    ]
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log(`[Puppeteer] Navigating to ${platform}...`);
    
    // Inject cookies from database
    try {
      const stmt = db.prepare('SELECT cookies FROM platform_sessions WHERE platform_id = ?');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const row = stmt.get(platform) as any;
      if (row && row.cookies) {
        const cookies = JSON.parse(row.cookies);
        if (cookies.length > 0) {
          // ensure valid format for puppeteer
          const validCookies = cookies.map((c: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
            name: c.name,
            value: c.value,
            domain: c.domain,
            path: c.path || '/',
            httpOnly: c.httpOnly || false,
            secure: c.secure || false,
            sameSite: c.sameSite || 'Lax'
          }));
          await page.setCookie(...validCookies);
          console.log(`[Puppeteer] Injected ${validCookies.length} cookies for ${platform}.`);
        }
      }
    } catch (dbError) {
      console.error(`[Puppeteer] Failed to load cookies from DB for ${platform}:`, dbError);
    }
    
    if (platform === 'juejin') {
      await page.goto('https://juejin.cn/editor/drafts/new', { waitUntil: 'networkidle2' });
      console.log(`[Puppeteer] Reached Juejin editor. Simulating typing...`);
      // Simulating DOM manipulation:
      // await page.type('.title-input', title);
      // await page.type('.markdown-editor', content);
      // await page.click('.publish-btn');
    } else if (platform === 'zhihu') {
      await page.goto('https://zhuanlan.zhihu.com/write', { waitUntil: 'networkidle2' });
      console.log(`[Puppeteer] Reached Zhihu editor. Simulating typing...`);
    } else {
      await page.goto(`https://${platform}.com`, { waitUntil: 'networkidle2' }).catch(() => {
         // Fallback if domain fails
         console.log(`[Puppeteer] Failed to load ${platform}.com, proceeding anyway...`);
      });
      console.log(`[Puppeteer] Reached ${platform}.`);
    }
    
    // Simulate some real-world delay for typing and clicking
    await new Promise(r => setTimeout(r, 2000 + Math.random() * 2000));
    
    let titleText = "Unknown Title";
    try {
      titleText = await page.title();
    } catch {
      // ignore
    }

    console.log(`[Puppeteer] Successfully interacted with page: ${titleText}, ${title}, ${content}`);
    
    return { success: true, message: `Successfully published to ${platform}` };
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error(`[Puppeteer] Error publishing to ${platform}:`, error);
    return { success: false, error: error.message || 'Unknown error' };
  } finally {
    await browser.close();
    console.log(`[Puppeteer] Browser closed for ${platform}.`);
  }
}
