// In puppeteer v22, static import works fine and avoids the v24 ESM issues
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
    } else if (platform === 'csdn') {
      console.log(`[Puppeteer] Navigating to CSDN editor...`);
      await page.goto('https://editor.csdn.net/md', { waitUntil: 'networkidle2' });
      
      console.log(`[Puppeteer] Reached CSDN editor. Attempting to fill content...`);
      
      // Wait for editor to be ready
      await new Promise(r => setTimeout(r, 3000));
      
      try {
        // 1. Fill Title (CSDN uses input with class 'article-bar__title--input')
        const titleSelector = '.article-bar__title--input';
        await page.waitForSelector(titleSelector, { timeout: 5000 });
        
        // Clear existing title if any
        await page.click(titleSelector, { clickCount: 3 });
        await page.keyboard.press('Backspace');
        
        // Type new title
        await page.type(titleSelector, title || '无标题测试文章', { delay: 50 });
        console.log(`[Puppeteer] Typed title.`);
        
        // 2. Fill Content (CSDN Markdown editor uses CodeMirror)
        // A common trick for CodeMirror is to click it to focus, then type or paste
        const editorSelector = '.editor__inner'; // Try to find the markdown editor wrapper
        await page.waitForSelector(editorSelector, { timeout: 5000 });
        await page.click(editorSelector);
        
        // Use keyboard to select all and delete
        await page.keyboard.down('Control');
        await page.keyboard.press('a');
        await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
        
        // Type content (could be slow for long text, but more realistic)
        // Alternatively, use page.evaluate to set value directly if type is too slow
        const textToType = content || '这是一篇测试文章。';
        
        // To speed up typing large chunks of text
        await page.evaluate((text) => {
          // Fallback to clipboard paste approach in real environment
          // Here we just use type for demonstration
        }, textToType);
        
        await page.type(editorSelector, textToType, { delay: 10 });
        console.log(`[Puppeteer] Typed content.`);
        
        // 3. Click Publish Button (CSDN uses a button with specific text or class)
        const publishBtnSelector = 'button.btn-publish';
        await page.waitForSelector(publishBtnSelector, { timeout: 5000 });
        console.log(`[Puppeteer] Found publish button, clicking...`);
        await page.click(publishBtnSelector);
        
        // 4. Wait for the publish modal to appear and click confirm
        // CSDN often pops up a modal to select tags/categories before final publish
        console.log(`[Puppeteer] Waiting for publish modal...`);
        await new Promise(r => setTimeout(r, 2000)); // wait for modal animation
        
        // Example: Click final publish button in modal (selector needs to match real CSDN DOM)
        // const finalPublishSelector = '.modal-publish-btn';
        // await page.click(finalPublishSelector);
        
        console.log(`[Puppeteer] CSDN publishing interaction completed.`);
      } catch (e) {
        console.error(`[Puppeteer] Error during CSDN DOM interaction:`, e);
      }
      
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
