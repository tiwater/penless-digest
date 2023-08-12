declare var chrome: any;

export function localize() {
  var i18nElements = document.querySelectorAll('[data-i18n]');
  for (var i = 0; i < i18nElements.length; i++) {
    var element = i18nElements[i];
    var messageKey = element.getAttribute('data-i18n');
    element.textContent = chrome.i18n.getMessage(messageKey);
  }
}

export function getLocalString(messageKey: string) {
  return chrome.i18n.getMessage(messageKey);
}
