interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user_id: number;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch('https://backend.doxcert.com/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password
      }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    localStorage.setItem('userId', data.user_id.toString());
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken');
};

export const logout = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
};

export const getCurrentUserId = (): number | null => {
  const userId = localStorage.getItem('userId');
  return userId ? parseInt(userId, 10) : null;
}; 