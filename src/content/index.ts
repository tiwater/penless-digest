console.log('[content] loaded ');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'get_content') {
    const content = document.body.innerText;
    console.log('[content] get_content', content.substring(0, 1024));
    sendResponse({success: true, data: content});
  }
  return true;
});

export {};