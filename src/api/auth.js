import client from './client'

export const login = async (username, password) => {
  try {
    const response = await client.post('/auth/login', {
      username,
      password
    })
    return response.data 
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export const getUserFromToken = async (token) => {
  try {
    const response = await client.get('/auth/decode-token', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error decoding token:', error)
    throw error
  }
}
export const updateUsername = async (id, newUsername) => {
  try {
    const response = await client.put('/auth/update-username', { id, new_username: newUsername })
    return response.data
  } catch (error) {
    console.error('Update username error:', error)
    throw error
  }
}

export const register = async (username, password) => {
  try {
    const response = await client.post('/auth/register', { username, password })
    return response.data
  } catch (error) {
    console.error('Register error:', error)
    throw error
  }
}

export const getUsers = async () => {
  try {
    const response = await client.get('/auth/users')
    return response.data
  } catch (error) {
    console.error('Get users error:', error)
    throw error
  }
}

export const deleteUser = async (id) => {
  try {
    const response = await client.delete('/auth/delete-user', { data: { id } })
    return response.data
  } catch (error) {
    console.error('Delete user error:', error)
    throw error
  }
}

export const updatePassword = async (id, newPassword) => {
  try {
    const response = await client.put('/auth/update-password', { id, new_password: newPassword })
    return response.data
  } catch (error) {
    console.error('Update password error:', error)
    throw error
  }
}