document.addEventListener('DOMContentLoaded', () => {
  const currentDomainEl = document.getElementById('currentDomain');
  const supportDotEl = document.getElementById('supportDot');
  const supportTextEl = document.getElementById('supportText');
  const syncBtn = document.getElementById('syncBtn');
  const messageBox = document.getElementById('messageBox');
  const btnLoader = document.getElementById('btnLoader');
  const btnText = document.getElementById('btnText');

  function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = `message ${type}`;
    setTimeout(() => {
      messageBox.textContent = '';
      messageBox.className = 'message';
    }, 3000);
  }

  function setLoading(isLoading) {
    syncBtn.disabled = isLoading;
    btnLoader.style.display = isLoading ? 'inline-block' : 'none';
    btnText.textContent = isLoading ? '正在同步...' : '一键同步登录态';
  }

  // Initial check
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0 || !tabs[0].url) {
      currentDomainEl.textContent = '无法获取当前页面';
      supportTextEl.textContent = '请打开对应平台的网页';
      return;
    }

    try {
      const urlObj = new URL(tabs[0].url);
      currentDomainEl.textContent = urlObj.hostname;
      
      chrome.runtime.sendMessage({ action: 'CHECK_CURRENT_TAB_SUPPORT' }, (response) => {
        if (response && response.supported) {
          supportDotEl.className = 'dot supported';
          supportTextEl.textContent = '当前平台已支持';
          syncBtn.disabled = false;
        } else {
          supportDotEl.className = 'dot unsupported';
          supportTextEl.textContent = '当前平台未适配或不支持';
          syncBtn.disabled = true;
        }
      });
    } catch (e) {
      currentDomainEl.textContent = '无效的 URL';
    }
  });

  // Sync action
  syncBtn.addEventListener('click', () => {
    setLoading(true);
    
    chrome.runtime.sendMessage({ action: 'SYNC_CURRENT_TAB' }, (response) => {
      setLoading(false);
      
      if (!response) {
        showMessage('与后台服务通信失败', 'error');
        return;
      }
      
      if (response.success) {
        showMessage(`同步成功！已传输 ${response.count} 条凭证给 PubAgent`, 'success');
      } else {
        showMessage(`同步失败: ${response.error || '未知错误'}`, 'error');
      }
    });
  });
});