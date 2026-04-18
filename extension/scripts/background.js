// Mapping from platform domains to their backend ID
const PLATFORM_DOMAINS = {
  'zhihu.com': 'zhihu',
  'juejin.cn': 'juejin',
  'csdn.net': 'csdn',
  'jianshu.com': 'jianshu',
  'bilibili.com': 'bilibili',
  'douyin.com': 'douyin',
  'kuaishou.com': 'kuaishou',
  'xiaohongshu.com': 'xiaohongshu'
};

const PUBAGENT_API = 'http://localhost:3001/api/platforms';

// Helper to extract the root domain
function getRootDomain(url) {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.hostname.split('.');
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }
    return urlObj.hostname;
  } catch (e) {
    return null;
  }
}

// Extract cookies for a given domain and send to local PubAgent server
async function syncCookiesToAgent(domain, platformId) {
  try {
    // Get all cookies matching the root domain
    const cookies = await chrome.cookies.getAll({ domain });
    
    if (!cookies || cookies.length === 0) {
      return { success: false, error: '未找到该网站的登录凭证' };
    }

    // Send to local server
    const response = await fetch(`${PUBAGENT_API}/${platformId}/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cookies })
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    return { success: true, count: cookies.length };
  } catch (error) {
    console.error(`Failed to sync cookies for ${platformId}:`, error);
    return { success: false, error: error.message };
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'SYNC_CURRENT_TAB') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs.length === 0 || !tabs[0].url) {
        sendResponse({ success: false, error: '无法获取当前标签页信息' });
        return;
      }

      const currentUrl = tabs[0].url;
      const rootDomain = getRootDomain(currentUrl);
      
      let platformId = null;
      let matchedDomain = null;
      
      for (const [domain, id] of Object.entries(PLATFORM_DOMAINS)) {
        if (rootDomain && (rootDomain === domain || rootDomain.endsWith(`.${domain}`))) {
          platformId = id;
          matchedDomain = domain;
          break;
        }
      }

      if (!platformId) {
        sendResponse({ success: false, error: '当前网站不在支持的平台列表中' });
        return;
      }

      const result = await syncCookiesToAgent(matchedDomain, platformId);
      sendResponse({ ...result, platformId, platformName: platformId });
    });
    return true; // Indicates asynchronous response
  }
  
  if (request.action === 'CHECK_CURRENT_TAB_SUPPORT') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0 || !tabs[0].url) {
        sendResponse({ supported: false });
        return;
      }
      const rootDomain = getRootDomain(tabs[0].url);
      const isSupported = Object.keys(PLATFORM_DOMAINS).some(domain => 
        rootDomain && (rootDomain === domain || rootDomain.endsWith(`.${domain}`))
      );
      sendResponse({ supported: isSupported });
    });
    return true;
  }
});