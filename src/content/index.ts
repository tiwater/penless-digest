import { extractText } from './tools';

console.log('[content] loaded ');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'get_content') {
    extractText()
      .then(content => {
        console.log('[content] get_content', content.substring(0, 1024));
        sendResponse({ success: true, data: content });
      })
      .catch(e => {
        console.error(e);
      });
  }
  return true;
});

export {};
