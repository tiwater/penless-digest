import { runtime, tabs } from 'webextension-polyfill';

declare var chrome: any;

runtime.onInstalled.addListener(() => {
  console.log('[background] loaded ');
});

runtime.onMessage.addListener(async (request, _, sendResponse) => {
  if (request.type === 'digest') {
    console.log('[background] digest', request);
    const foundTabs = await tabs.query({ active: true, currentWindow: true });
    if (foundTabs.length === 0 || !foundTabs[0].id) {
      console.error('No active tab found');
      return false;
    }

    tabs
      .executeScript(foundTabs[0].id, { file: 'content.js' })
      .then(() => {
        tabs
          .sendMessage(foundTabs[0].id as number, { type: 'get_content' })
          .then(response => {
            fetch('https://demo.penless.ai/api/summarize-page', {
              method: 'POST',
              body: JSON.stringify({
                text: response,
              }),
              headers: { 'Content-Type': 'application/json' },
            })
              .then(response => response.json())
              .then(digest => {
                console.log('digest result data', digest.summary);
                runtime.sendMessage({ type: 'digest_result', result: digest.summary });
              })
              .catch(error => console.error(error));
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));

    return true; // Will respond asynchronously
  }
});
