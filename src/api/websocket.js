import store from '@/store';
import Cookies from 'js-cookie';

class MailWebSocketClient {
  constructor() {
    this.socket = null;
    this.reconnectTimeout = null;
    this.baseURL = store.state.serverAddr || 'http://192.168.129.128:8000';
  }

  getWebSocketURL() {
    const wsURL = this.baseURL.replace('http://', 'ws://').replace('https://', 'wss://');
    const token = Cookies.get('token');
    return `${wsURL}/mails/ws/${token}`;
  }

  connect(onNewMail) {
    try {
      const token = Cookies.get('token');
      if (!token) {
        console.error('No token found for WebSocket connection');
        return;
      }

      this.socket = new WebSocket(this.getWebSocketURL());

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'new_email') {
            onNewMail && onNewMail();
          }
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };

      this.socket.onclose = () => {
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
        }
        this.reconnectTimeout = setTimeout(() => {
          this.connect(onNewMail);
        }, 5000);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket connection error:', error);
      };

    } catch (error) {
      console.error('WebSocket setup error:', error);
    }
  }

  disconnect() {
    try {
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    } catch (error) {
      console.error('WebSocket disconnect error:', error);
    }
  }
}

export const mailWebSocket = new MailWebSocketClient();

store.watch(
  (state) => state.serverAddr,
  (newAddr) => {
    if (mailWebSocket.socket) {
      mailWebSocket.disconnect();
      mailWebSocket.baseURL = newAddr;
      mailWebSocket.connect();
    }
  }
);

export default mailWebSocket;