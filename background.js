let isActive = false;
let currentTabId = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleAutoClick") {
    isActive = !isActive;
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      currentTabId = tabs[0].id;
      chrome.scripting.executeScript({
        target: {tabId: currentTabId},
        files: ['content.js']
      }, () => {
        chrome.tabs.sendMessage(currentTabId, {action: "setAutoClick", isActive: isActive});
      });
    });
    sendResponse({status: isActive ? "activated" : "deactivated"});
  } else if (request.action === "checkStatus") {
    sendResponse({status: isActive ? "activated" : "deactivated"});
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (isActive && tabId === currentTabId && changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: {tabId: currentTabId},
      files: ['content.js']
    }, () => {
      chrome.tabs.sendMessage(currentTabId, {action: "setAutoClick", isActive: isActive});
    });
  }
});
