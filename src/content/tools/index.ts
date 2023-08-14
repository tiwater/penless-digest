import { getCurrentTab } from '../../utils/tabs';
import { extractFeishuText } from './feishu';

export async function extractText() {
  const tab = (await getCurrentTab())[0];
  if (tab.url?.includes('.feishu.cn/')) {
    return extractFeishuText(tab);
  }
  return document.body.innerText;
}
