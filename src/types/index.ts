// Type definitions for Side Scribe

// Settings type
export interface AppSettings {
  apiKey: string;
  transcriptionInterval: number; // in seconds
  audioFormat: string;
  audioQuality: number; // bitrate
  summaryPrompt: string;
  panelWidth: string;
  panelPosition: 'left' | 'right';
  theme: 'light' | 'dark';
  summaryLanguage: string;
  summaryLength: 'short' | 'medium' | 'long';
  autoInjectTab: boolean;
}

// Recording state
export enum RecordingState {
  INACTIVE = 'inactive',
  RECORDING = 'recording',
  PAUSED = 'paused'
}

// Transcription type
export interface Transcription {
  text: string;
  timestamp: number;
  confidence?: number;
}

// Summary type
export interface Summary {
  text: string;
  timestamp: number;
  sourceLength: number; // length of the source transcription
}

// API Response types
export interface WhisperResponse {
  text: string;
  language?: string;
  duration?: number;
  segments?: Array<{
    id: number;
    seek: number;
    start: number;
    end: number;
    text: string;
    tokens: number[];
    temperature: number;
    avg_logprob: number;
    compression_ratio: number;
    no_speech_prob: number;
  }>;
}

export interface LlamaResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Message types for communication between content script, background script, and popup
export type MessageType = 
  | { type: 'TEST_API_CONNECTION', apiKey: string }
  | { type: 'SET_SETTINGS', settings: Partial<AppSettings> }
  | { type: 'GET_SETTINGS' }
  | { type: 'START_RECORDING' }
  | { type: 'PAUSE_RECORDING' }
  | { type: 'STOP_RECORDING' }
  | { type: 'UPDATE_TRANSCRIPTION', transcription: Transcription }
  | { type: 'UPDATE_SUMMARY', summary: Summary };

// Response types
export type ResponseType =
  | { success: boolean, error?: string, data?: any }; 