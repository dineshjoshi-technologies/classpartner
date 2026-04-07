import type { User } from "./auth-store";
import { useAuthStore } from "./auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ApiResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  error?: string;
}

async function handleResponse(response: Response): Promise<ApiResponse> {
  const data: ApiResponse = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const { accessToken, refreshToken, setAuth, logout } = useAuthStore.getState();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  let response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && refreshToken) {
    try {
      const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json() as { accessToken: string; refreshToken: string };
        const { user } = useAuthStore.getState();
        if (user) {
          setAuth(user, data.accessToken, data.refreshToken);
        }

        headers['Authorization'] = `Bearer ${data.accessToken}`;
        response = await fetch(`${API_URL}${url}`, {
          ...options,
          headers,
        });
      } else {
        logout();
      }
    } catch {
      logout();
    }
  }

  return response;
}

export const api = {
  async signup(email: string, password: string, name?: string) {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    return handleResponse(response);
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  async refreshToken(refreshToken: string) {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
    return data as { accessToken: string; refreshToken: string };
  },

  async getMe(): Promise<User> {
    const response = await fetchWithAuth('/api/users/me');
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch user');
    }
    return data as User;
  },

  async updateProfile(updates: { name?: string; email?: string }) {
    const response = await fetchWithAuth('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update profile');
    }
    return data as User;
  },
};
