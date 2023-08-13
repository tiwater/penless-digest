import { getCurrentTab } from '../utils/tabs';
import { getCachedDigest } from '../utils/store';

chrome.runtime.onInstalled.addListener(() => {
  console.log('[background] loaded ');
});

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.type === 'digest') {
    console.log('[background] digest', request);
    getCurrentTab()
      .then(foundTabs => {
        if (foundTabs.length === 0 || !foundTabs[0].id || !foundTabs[0].url) {
          console.log('No valid tab found');
          throw { success: false, type: 'digest_result', error: 'error_noActiveTab' };
        }

        if (foundTabs[0].url.startsWith('chrome')) {
          console.log('Ignoring chrome://* tab');
          throw { success: false, type: 'digest_result', error: 'error_chromeTab' };
        }

        const pageCacheKey = `pagecache-${foundTabs[0].url}`;

        return getCachedDigest(pageCacheKey)
          .then(pageCache => ({ success: true, type: 'digest_result', data: pageCache }))
          .catch(() => {
            return chrome.scripting
              .executeScript({
                target: { tabId: foundTabs[0].id as number },
                files: ['./static/js/content.js'],
              })
              .then(() => {
                console.log('get_content message', foundTabs[0].id);
                return chrome.tabs.sendMessage(foundTabs[0].id as number, { type: 'get_content' });
              })
              .then((response: any) => {
                console.log('get_content response', response);
                return fetch('https://demo.penless.ai/api/summarize-page', {
                  method: 'POST',
                  body: JSON.stringify({
                    text: response.data,
                  }),
                  headers: { 'Content-Type': 'application/json' },
                });
              })
              .then(response => response.json())
              .then(digest => {
                console.log('digest result data', digest.summary);
                chrome.storage.local.set({ [pageCacheKey]: digest.summary });
                return { success: true, type: 'digest_result', data: digest.summary };
              });
          });
      })
      .then(result => sendResponse(result))
      .catch(error => sendResponse(error));

    return true; // indicates we want to respond asynchronously
  }
});
