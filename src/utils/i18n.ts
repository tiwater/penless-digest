export function localize() {
  var i18nElements = document.querySelectorAll('[data-i18n]');
  for (var i = 0; i < i18nElements.length; i++) {
    var element = i18nElements[i];
    var messageKey = element.getAttribute('data-i18n');
    element.textContent = chrome.i18n.getMessage(messageKey || '');
  }
}

export function getLocalString(messageKey: string) {
  let message;
  try {
    message = chrome.i18n.getMessage(messageKey);
  } catch (error) {
    console.log(error);
    message = messageKey; // Fallback to key
  }
  return message;
}
