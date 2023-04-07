export class WebSocketManager {
    private socket!: WebSocket;
    private readonly url: string;
  
    constructor(url: string) {
      this.url = url;
    }
  
    public connect(): void {
      this.socket = new WebSocket(this.url);
  
      this.socket.onopen = (event: Event) => {
        console.log('WebSocket connection opened');
      };
  
      this.socket.onmessage = (event: MessageEvent) => {
        console.log(`Received message: ${event.data}`);
      };
  
      this.socket.onerror = (event: Event) => {
        console.error('WebSocket error:', event);
      };
  
      this.socket.onclose = (event: CloseEvent) => {
        console.log('WebSocket connection closed:', event);
      };
    }
  
    public send(data: string): void {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(data);
      } else {
        console.error('WebSocket connection not open:', this.socket.readyState);
      }
    }
  
    public close(): void {
      this.socket.close();
    }
  }