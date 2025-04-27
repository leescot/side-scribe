// Recording utility functions
import { RecordingState } from '../types';

interface RecordingConfig {
  mimeType: string;
  audioBitsPerSecond: number;
  timeslice?: number;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private audioChunks: Blob[] = [];
  private startTime: number = 0;
  private elapsedTime: number = 0;
  private state: RecordingState = RecordingState.INACTIVE;
  
  // Callbacks
  private onDataAvailable: (blob: Blob) => void = () => {};
  private onStateChange: (state: RecordingState) => void = () => {};
  private onError: (error: Error) => void = () => {};
  private onTimeUpdate: (time: number) => void = () => {};
  
  /**
   * Start recording audio
   * @param config Recording configuration
   * @returns Promise that resolves when recording starts
   */
  async startRecording(config: RecordingConfig): Promise<void> {
    try {
      if (this.state === RecordingState.RECORDING) {
        return;
      }
      
      // If paused, resume recording
      if (this.state === RecordingState.PAUSED && this.mediaRecorder) {
        this.mediaRecorder.resume();
        this.state = RecordingState.RECORDING;
        this.startTime = Date.now() - this.elapsedTime;
        this.startTimeUpdate();
        this.onStateChange(this.state);
        return;
      }
      
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Default to webm if the browser doesn't support the requested format
      let mimeType = config.mimeType;
      if (!MediaRecorder.isTypeSupported(config.mimeType)) {
        mimeType = 'audio/webm';
        console.warn(`MIME type ${config.mimeType} not supported, falling back to audio/webm`);
      }
      
      // Create MediaRecorder instance
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
        audioBitsPerSecond: config.audioBitsPerSecond
      });
      
      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          this.onDataAvailable(event.data);
        }
      };
      
      this.mediaRecorder.onerror = (event) => {
        this.onError(new Error('MediaRecorder error: ' + event.error));
      };
      
      // Start recording
      this.mediaRecorder.start(config.timeslice || 1000);
      this.startTime = Date.now();
      this.elapsedTime = 0;
      this.state = RecordingState.RECORDING;
      this.startTimeUpdate();
      this.onStateChange(this.state);
    } catch (error) {
      this.onError(error instanceof Error ? error : new Error(String(error)));
    }
  }
  
  /**
   * Pause recording
   */
  pauseRecording(): void {
    if (this.state !== RecordingState.RECORDING || !this.mediaRecorder) {
      return;
    }
    
    this.mediaRecorder.pause();
    this.elapsedTime = Date.now() - this.startTime;
    this.state = RecordingState.PAUSED;
    this.onStateChange(this.state);
  }
  
  /**
   * Stop recording
   * @returns Blob containing the entire recording
   */
  stopRecording(): Blob | null {
    if (this.state === RecordingState.INACTIVE || !this.mediaRecorder) {
      return null;
    }
    
    // Stop the media recorder
    this.mediaRecorder.stop();
    
    // Stop all tracks in the stream
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    
    // Calculate final elapsed time
    this.elapsedTime = this.state === RecordingState.PAUSED 
      ? this.elapsedTime 
      : Date.now() - this.startTime;
    
    // Reset state
    this.state = RecordingState.INACTIVE;
    this.onStateChange(this.state);
    
    // Create a single blob from all chunks
    const mimeType = this.mediaRecorder.mimeType;
    const recordingBlob = new Blob(this.audioChunks, { type: mimeType });
    
    // Reset chunks
    this.audioChunks = [];
    this.mediaRecorder = null;
    this.stream = null;
    
    return recordingBlob;
  }
  
  /**
   * Get current recording state
   */
  getState(): RecordingState {
    return this.state;
  }
  
  /**
   * Get elapsed recording time in milliseconds
   */
  getElapsedTime(): number {
    if (this.state === RecordingState.RECORDING) {
      return Date.now() - this.startTime;
    }
    return this.elapsedTime;
  }
  
  /**
   * Set event handlers
   */
  setHandlers(handlers: {
    onDataAvailable?: (blob: Blob) => void;
    onStateChange?: (state: RecordingState) => void;
    onError?: (error: Error) => void;
    onTimeUpdate?: (time: number) => void;
  }): void {
    if (handlers.onDataAvailable) {
      this.onDataAvailable = handlers.onDataAvailable;
    }
    if (handlers.onStateChange) {
      this.onStateChange = handlers.onStateChange;
    }
    if (handlers.onError) {
      this.onError = handlers.onError;
    }
    if (handlers.onTimeUpdate) {
      this.onTimeUpdate = handlers.onTimeUpdate;
    }
  }
  
  /**
   * Start sending time updates
   */
  private startTimeUpdate(): void {
    const interval = setInterval(() => {
      if (this.state === RecordingState.RECORDING) {
        const time = Date.now() - this.startTime;
        this.onTimeUpdate(time);
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }
} 