export function getCachedDigest(key: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    chrome.storage.local.get([key], function(result) {
      if (chrome.runtime.lastError) {
        console.log('getCachedDigest failed', chrome.runtime.lastError);
        reject(new Error(chrome.runtime.lastError.message));
      } else if (!result || !result[key]) {
        console.log('getCachedDigest not found', result, key);
        reject('Page cache not found');
      } else {
        console.log('getCachedDigest', result, key, result[key]);
        resolve(result[key]);
      }
    });
  });
}

export function cleanCachedDigest(key: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    chrome.storage.local.remove([key], function() {
      if (chrome.runtime.lastError) {
        // Handle any errors
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}