// trafficFeature.js

// Import necessary libraries (you may need to adjust these based on your setup)
import { RealtimeClient } from './lib/realtime-api-beta/index.js';
import { WavRecorder, WavStreamPlayer } from './lib/wavtools/index.js';

export class TrafficFeature {
  constructor() {
    this.client = new RealtimeClient({
      apiKey: 'YOUR_API_KEY_HERE',
      dangerouslyAllowAPIKeyInBrowser: true,
    });
    this.wavRecorder = new WavRecorder({ sampleRate: 24000 });
    this.wavStreamPlayer = new WavStreamPlayer({ sampleRate: 24000 });
    this.isConnected = false;
    this.realtimeEvents = [];
  }

  async init() {
    await this.setupVoiceInteraction();
    this.setupEventListeners();
  }

  async setupVoiceInteraction() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await this.wavRecorder.begin();
      await this.wavStreamPlayer.connect();
      await this.client.connect();
    } catch (error) {
      console.error('Error setting up voice interaction:', error);
      throw new Error('Failed to initialize media stream. Please check your microphone permissions.');
    }
  }

  setupEventListeners() {
    document.getElementById('startButton').addEventListener('click', () => this.startConversation());
    document.getElementById('stopButton').addEventListener('click', () => this.stopConversation());
  }

  async startConversation() {
    if (this.isConnected) return;
    this.isConnected = true;
    this.realtimeEvents = [];

    this.client.sendUserMessageContent([
      {
        type: 'input_text',
        text: 'Hello! I need traffic information.',
      },
    ]);

    await this.wavRecorder.record((data) => this.client.appendInputAudio(data.mono));
    this.client.on('realtime.event', (event) => this.handleRealtimeEvent(event));
  }

  stopConversation() {
    if (!this.isConnected) return;
    this.isConnected = false;
    this.wavRecorder.stop();
    this.client.disconnect();
  }

  handleRealtimeEvent(event) {
    this.realtimeEvents.push(event);
    if (event.event.type === 'assistant_message') {
      this.processAssistantMessage(event.event.content);
    }
    if (event.event.type === 'server.response.audio.delta') {
      const audioData = new Int16Array(event.event.content.audio);
      this.wavStreamPlayer.write(audioData);
    }
  }

  processAssistantMessage(content) {
    const trafficInfo = this.extractTrafficInfo(content);
    this.displayTrafficInfo(trafficInfo);
  }

  extractTrafficInfo(content) {
    // This is a simple implementation and should be enhanced with more sophisticated parsing
    const routeMatch = content.match(/route: (.*?)(?=\.|$)/i);
    const congestionMatch = content.match(/congestion: (.*?)(?=\.|$)/i);
    const timeMatch = content.match(/travel time: (.*?)(?=\.|$)/i);

    return {
      route: routeMatch ? routeMatch[1].trim() : 'Not specified',
      congestion: congestionMatch ? congestionMatch[1].trim() : 'Unknown',
      travelTime: timeMatch ? timeMatch[1].trim() : 'Not available',
    };
  }

  displayTrafficInfo(trafficInfo) {
    const trafficDisplay = document.getElementById('trafficDisplay');
    trafficDisplay.innerHTML = `
      <h2>Traffic Information</h2>
      <p>Route: ${trafficInfo.route}</p>
      <p>Congestion: ${trafficInfo.congestion}</p>
      <p>Estimated Travel Time: ${trafficInfo.travelTime}</p>
    `;
  }
}

// Initialize the TrafficFeature
const trafficFeature = new TrafficFeature();
trafficFeature.init();
