  import client from './client'
  import Cookies from 'js-cookie';
  import store from '@/store';
  
  export const login = async (username, password) => {
    try {
      const response = await client.post('/auth/login', { username, password });
      return response.data; // { token: "<JWT_TOKEN>" }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  export const getCurrentUser = async () => {
    try {
      const response = await client.get('/auth/me')
      return response.data 
    } catch (error) {
      console.error('Lỗi lấy thông tin người dùng:', error)
      throw error
    }
  }
  export const getMailList = async () => {
    try {
      const response = await client.get('/mails/');
      return response.data; // [ { uid, subject, from, date }, ... ]
    } catch (error) {
      console.error('Get mail list error:', error);
      throw error;
    }
  }

  export const getMailDetail = async (uid) => {
    try {
      const response = await client.get(`/mails/${uid}`);
      return response.data; // { uid, subject, from, date, body }
    } catch (error) {
      console.error('Get mail detail error:', error);
      throw error;
    }
  }
  export const sendMail = async ({ to, subject, body }) => {
    try {
      const response = await client.post('/mails/send-mail', {
        to,
        subject,
        body,
      });
      return response.data; // { message: "...successfully" }
    } catch (error) {
      console.error('Send mail error:', error);
      throw error;
    }
  }
  export const loginWithLaoID = async (accessToken) => {
    try {
      const response = await client.post('/auth/laoid-login', {
        access_token: accessToken
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi đăng nhập bằng LaoID:', error);
      throw error;
    }
  }
  let socket = null;

  /**
   * Kết nối WebSocket để nhận realtime mail list
   * @param {Function} onMessageCallback - Hàm xử lý khi nhận được dữ liệu mới
   * @param {Function} onCloseCallback - Hàm xử lý khi socket bị đóng
   */
  export const connectMailRealtime = (onMessageCallback, onCloseCallback) => {
    const token = Cookies.get("token");
    const host = store.state.serverAddr.replace(/^http/, "ws"); 
  
    socket = new WebSocket(`${host}/mails/ws/mail`);
  
    socket.onopen = () => {
      console.log("📡 WebSocket connected");
      if (token) socket.send(token); // gửi token để xác thực
    };
  
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessageCallback && onMessageCallback(data);
      } catch (e) {
        console.error("❌ WS parse error:", e);
      }
    };
  
    socket.onclose = () => {
      console.warn("🔌 WebSocket closed");
      onCloseCallback && onCloseCallback();
    };
  
    socket.onerror = (err) => {
      console.error("⚠️ WebSocket error", err);
    };
  };
  
  export const disconnectMailRealtime = () => {
    if (socket) {
      socket.close();
      socket = null;
    }
  };