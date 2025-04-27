// Content script for Side Scribe Chrome extension
console.log('Side Scribe content script loaded');

// Create a container for the side panel
let panelContainer: HTMLDivElement | null = null;
let isPanelInjected = false;

// Function to inject the side panel
function injectSidePanel() {
  if (isPanelInjected) return;
  
  // Create container element
  panelContainer = document.createElement('div');
  panelContainer.id = 'side-scribe-panel-container';
  
  // Initially hidden, will be shown when iframe loads
  panelContainer.style.position = 'fixed';
  panelContainer.style.top = '0';
  panelContainer.style.right = '0';
  panelContainer.style.width = '0';
  panelContainer.style.height = '100%';
  panelContainer.style.zIndex = '9999';
  panelContainer.style.transition = 'width 0.3s ease-in-out';
  panelContainer.style.boxShadow = '-2px 0 5px rgba(0, 0, 0, 0.2)';
  panelContainer.style.backgroundColor = '#ffffff';
  
  // Create iframe to load the panel
  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.src = chrome.runtime.getURL('panel.html');
  
  panelContainer.appendChild(iframe);
  document.body.appendChild(panelContainer);
  
  isPanelInjected = true;
}

// Function to toggle the panel visibility
function togglePanelVisibility(isVisible: boolean, width: string = '320px') {
  if (!panelContainer) return;
  
  if (isVisible) {
    panelContainer.style.width = width;
  } else {
    panelContainer.style.width = '0';
  }
}

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'INJECT_PANEL') {
    injectSidePanel();
    sendResponse({ success: true });
  } else if (message.action === 'TOGGLE_PANEL') {
    togglePanelVisibility(message.isVisible, message.width);
    sendResponse({ success: true });
  }
  
  return true;
});

// Inject panel tab (the collapsed version of panel)
function injectPanelTab() {
  const tabElement = document.createElement('div');
  tabElement.id = 'side-scribe-panel-tab';
  tabElement.textContent = '錄音';
  
  // Style the tab
  tabElement.style.position = 'fixed';
  tabElement.style.top = '50%';
  tabElement.style.right = '0';
  tabElement.style.transform = 'translateY(-50%)';
  tabElement.style.backgroundColor = '#2196f3';
  tabElement.style.color = 'white';
  tabElement.style.padding = '10px 5px';
  tabElement.style.borderRadius = '5px 0 0 5px';
  tabElement.style.cursor = 'pointer';
  tabElement.style.zIndex = '9998';
  tabElement.style.writingMode = 'vertical-rl';
  tabElement.style.textOrientation = 'mixed';
  
  // Add click event to toggle panel
  tabElement.addEventListener('click', () => {
    injectSidePanel();
    togglePanelVisibility(true);
  });
  
  document.body.appendChild(tabElement);
}

// Initialize content script
(function init() {
  // Check if we should inject the tab immediately
  chrome.storage.sync.get(['autoInjectTab'], (result) => {
    if (result.autoInjectTab) {
      injectPanelTab();
    }
  });
})();

export {}; 