// Background script for Side Scribe Chrome extension

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Side Scribe extension installed');
  
  // Initialize default settings
  chrome.storage.sync.get(['apiKey', 'transcriptionInterval', 'audioFormat', 'audioQuality', 'summaryPrompt'], (result) => {
    if (!result.apiKey) {
      chrome.storage.sync.set({ apiKey: '' });
    }
    
    if (!result.transcriptionInterval) {
      chrome.storage.sync.set({ transcriptionInterval: 30 }); // Default: 30 seconds
    }
    
    if (!result.audioFormat) {
      chrome.storage.sync.set({ audioFormat: 'audio/webm' }); // Default: webm
    }
    
    if (!result.audioQuality) {
      chrome.storage.sync.set({ audioQuality: 128000 }); // Default: 128kbps
    }
    
    if (!result.summaryPrompt) {
      const defaultPrompt = '請總結以下內容的關鍵點和重要信息，並提供一個清晰簡潔的摘要：';
      chrome.storage.sync.set({ summaryPrompt: defaultPrompt });
    }
  });
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TEST_API_CONNECTION') {
    // Test connection with Groq API
    testApiConnection(message.apiKey)
      .then(result => sendResponse({ success: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Indicates we will send a response asynchronously
  }
});

// Function to test API connection
async function testApiConnection(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API connection failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return Array.isArray(data.data); // Check if we got a valid response with models array
  } catch (error) {
    console.error('API connection test failed:', error);
    throw error;
  }
}

export {}; 