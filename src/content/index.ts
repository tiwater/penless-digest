import { getCurrentTab } from '../utils/tabs';

console.log('[content] loaded ');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('[content] onMessage', request);
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

// -------------------------------------------------

export async function extractText() {
  if (window.location.href.includes('.feishu.cn/')) {
    return extractFeishuText();
  }
  return document.body.innerText;
}

// -------------------------------------------------
// tools

export function extractFeishuText() {
  let data = document.body.textContent;
  if (!data) {
    console.log('no data');
    return '';
  }
  console.log('size:', data.length);

  function extractTextFromJson(json: any): string[] {
    let text: string[] = [];
    for (let key in json) {
      if (key === 'text' && json[key]['0']) {
        text.push(json[key]['0']);
      } else if (typeof json[key] === 'object') {
        text = text.concat(extractTextFromJson(json[key]));
      }
    }
    return text;
  }

  function extractPlainText(data: string) {
    let jsonDataStart = data.indexOf('window.DATA = Object.assign({}, window.DATA, { clientVars: Object(');
    if (jsonDataStart !== -1) {
      return data.substring(0, jsonDataStart);
    }
    return data;
  }

  let jsonDataStart = data.indexOf('window.DATA = Object.assign({}, window.DATA, { clientVars: Object(');
  let plainText = extractPlainText(data);

  let text = [plainText];

  if (jsonDataStart !== -1) {
    let jsonDataEnd = data.indexOf('}};', jsonDataStart);
    if (jsonDataEnd !== -1) {
      let jsonStr = data.substring(jsonDataStart + 74, jsonDataEnd + 2);
      try {
        let json = JSON.parse(jsonStr);
        text = text.concat(extractTextFromJson(json));
      } catch (error) {
        console.error('Failed to parse JSON: ' + error);
      }
    }
  }

  return text.join('\n');
}

export {};
