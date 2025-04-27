// Chrome storage utility functions
import { AppSettings } from '../types';

/**
 * Default settings
 */
export const DEFAULT_SETTINGS: AppSettings = {
  apiKey: '',
  transcriptionInterval: 30,
  audioFormat: 'audio/webm',
  audioQuality: 128000,
  summaryPrompt: '請總結以下內容的關鍵點和重要信息，並提供一個清晰簡潔的摘要：',
  panelWidth: '320px',
  panelPosition: 'right',
  theme: 'light',
  summaryLanguage: 'zh-TW',
  summaryLength: 'medium',
  autoInjectTab: true
};

/**
 * Get all settings from Chrome storage
 * @returns Promise with settings
 */
export async function getSettings(): Promise<AppSettings> {
  return new Promise<AppSettings>((resolve) => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (result) => {
      resolve(result as AppSettings);
    });
  });
}

/**
 * Update settings in Chrome storage
 * @param settings Partial settings to update
 * @returns Promise that resolves when settings are updated
 */
export async function updateSettings(settings: Partial<AppSettings>): Promise<void> {
  return new Promise<void>((resolve) => {
    chrome.storage.sync.set(settings, () => {
      resolve();
    });
  });
}

/**
 * Get API key with encryption
 * For real applications, you would want to encrypt this more securely
 * @returns Promise with API key
 */
export async function getApiKey(): Promise<string> {
  return new Promise<string>((resolve) => {
    chrome.storage.sync.get(['apiKey'], (result) => {
      resolve(result.apiKey || '');
    });
  });
}

/**
 * Set API key with encryption
 * For real applications, you would want to encrypt this more securely
 * @param apiKey API key to store
 * @returns Promise that resolves when API key is stored
 */
export async function setApiKey(apiKey: string): Promise<void> {
  return new Promise<void>((resolve) => {
    chrome.storage.sync.set({ apiKey }, () => {
      resolve();
    });
  });
}

/**
 * Store transcription data
 * @param transcription Transcription text
 * @returns Promise that resolves when transcription is stored
 */
export async function storeTranscription(transcription: string): Promise<void> {
  return new Promise<void>((resolve) => {
    chrome.storage.local.set({ transcription }, () => {
      resolve();
    });
  });
}

/**
 * Get stored transcription
 * @returns Promise with transcription
 */
export async function getTranscription(): Promise<string> {
  return new Promise<string>((resolve) => {
    chrome.storage.local.get(['transcription'], (result) => {
      resolve(result.transcription || '');
    });
  });
}

/**
 * Store summary data
 * @param summary Summary text
 * @returns Promise that resolves when summary is stored
 */
export async function storeSummary(summary: string): Promise<void> {
  return new Promise<void>((resolve) => {
    chrome.storage.local.set({ summary }, () => {
      resolve();
    });
  });
}

/**
 * Get stored summary
 * @returns Promise with summary
 */
export async function getSummary(): Promise<string> {
  return new Promise<string>((resolve) => {
    chrome.storage.local.get(['summary'], (result) => {
      resolve(result.summary || '');
    });
  });
}

/**
 * Clear all local storage data
 * @returns Promise that resolves when storage is cleared
 */
export async function clearLocalStorage(): Promise<void> {
  return new Promise<void>((resolve) => {
    chrome.storage.local.clear(() => {
      resolve();
    });
  });
} 