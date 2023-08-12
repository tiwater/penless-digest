import { runtime } from 'webextension-polyfill'

console.log('[content] loaded ');

runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'get_content') {
    const content = document.body.innerText;
    console.log('[content] get_content', content.substring(0, 1024));
    (sendResponse as (response: any) => void)(content);
  }
  return true;
});
