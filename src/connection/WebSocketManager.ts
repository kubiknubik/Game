import { GameMediator } from "../game/mediator/Mediator";

export class WebSocketManager {
    private socket!: WebSocket;
    private readonly url: string;
  
    constructor(url: string) {
      this.url = url;
    }
  
    public connect(): void {
      this.socket = new WebSocket(this.url);
  
      this.socket.onopen = (event: Event) => {
        const dataToSend = { userToken:"token"}
         this.sendData("login",dataToSend)
      };
  
      this.socket.onmessage = (event: MessageEvent) => { 
        var msg = JSON.parse(event.data); 
        GameMediator.emit(msg.Command,msg.Data);
      };
  
      this.socket.onerror = (event: Event) => {
        console.error('WebSocket error:', event);
      };
  
      this.socket.onclose = (event: CloseEvent) => {
        console.log('WebSocket connection closed:', event);
      };
    }

    public sendData(cmd:string,dt:object):void{
         const msg = {command:cmd, data:dt};
 
         this.socket.send(JSON.stringify(msg))
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