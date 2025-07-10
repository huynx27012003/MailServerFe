import client from './client'

export const login = async (username, password) => {
  try {
    const response = await client.post('/auth/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export const getCurrentUser = async () => {
  try {
    const response = await client.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Lỗi lấy thông tin người dùng:', error);
    throw error;
  }
}

export const getMailList = async () => {
  try {
    const response = await client.get('/mails/');
    return response.data;
  } catch (error) {
    console.error('Get mail list error:', error);
    throw error;
  }
}

export const getMailDetail = async (uid) => {
  try {
    const response = await client.get(`/mails/${uid}`);
    return response.data;
  } catch (error) {
    console.error('Get mail detail error:', error);
    throw error;
  }
}

export const sendMail = async ({ to, subject, body }) => {
  try {
    const response = await client.post('/mails/send-mail-simple', {
      to,
      subject,
      body,
    });
    return response.data;
  } catch (error) {
    console.error('Send mail error:', error);
    throw error;
  }
}

// Gửi mail với file đính kèm
export const sendMailWithAttachments = async ({ to, subject, body, files }) => {
  try {
    const formData = new FormData();
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('body', body);
    
    // Thêm các file đính kèm
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('files', file);
      });
    }
    
    const response = await client.post('/mails/send-mail', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Send mail with attachments error:', error);
    throw error;
  }
}

// Tải file đính kèm
export const downloadAttachment = async (uid, filename) => {
  try {
    const response = await client.get(`/mails/${uid}/attachment/${filename}`, {
      responseType: 'blob',
    });
    
    // Tạo URL để tải file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error('Download attachment error:', error);
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

export const searchMails = async (keyword) => {
  try {
    const response = await client.get('/mails/search', {
      params: { keyword }
    });
    return response.data;
  } catch (error) {
    console.error('Search mails error:', error);
    throw error;
  }
}