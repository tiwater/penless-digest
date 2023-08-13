export function getCurrentTab() {
  return new Promise<chrome.tabs.Tab[]>((resolve, reject) => {
    chrome.tabs.query({ active: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve(tabs);
    });
  });
}
