import { io } from "socket.io-client";

class SocketService {
  constructor() {
    if (!SocketService.instance) {
      // enter your server url
      // http://localhost:3000/
      this.socket = io(import.meta.env.VITE_BASE_URL, {
        autoconnect: false,
      });
    }
    return SocketService.instance;
  }

  connect() {
    if (!this.socket.connected) {
      this.socket.connect();
    }
    console.log("connected");
  }

  disconnect() {
    if (this.socket.connected) {
      console.log("disconnected");
      this.socket.disconnect();
    }
  }

  // Helper to emit events
  emit(event, data) {
    this.socket.emit(event, data);
  }

  // Helper to listen for events
  on(event, callback) {
    this.socket.on(event, callback);
  }

  off(event) {
    this.socket.off(event);
  }
}

// Export a single instance

const instance = new SocketService();
export default instance;
