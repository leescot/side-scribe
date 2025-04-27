// Groq API integration
import { WhisperResponse, LlamaResponse } from '../types';

/**
 * Transcribe audio using Whisper API
 * @param audioBlob Audio blob to transcribe
 * @param apiKey Groq API key
 * @returns Promise with transcription response
 */
export async function transcribeAudio(
  audioBlob: Blob, 
  apiKey: string
): Promise<WhisperResponse> {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'whisper-large-v3');
    formData.append('language', 'zh');
    
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}

/**
 * Generate summary using Llama model
 * @param transcription Transcription text to summarize
 * @param prompt Custom prompt for summary generation
 * @param apiKey Groq API key
 * @returns Promise with summary response
 */
export async function generateSummary(
  transcription: string,
  prompt: string,
  apiKey: string
): Promise<LlamaResponse> {
  try {
    const systemPrompt = prompt || '請總結以下內容的關鍵點和重要信息，並提供一個清晰簡潔的摘要：';
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: transcription
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Summary generation failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Summary generation error:', error);
    throw error;
  }
}

/**
 * Test connection to Groq API
 * @param apiKey Groq API key to test
 * @returns Promise with boolean indicating success
 */
export async function testApiConnection(apiKey: string): Promise<boolean> {
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