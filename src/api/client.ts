import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_API_URL = 'https://v1.tmmbanglapatente.it';
const TOKEN_KEY = '@tmm_patente_auth_token';

class ApiClient {
  private token: string | null = null;

  async init() {
    this.token = await AsyncStorage.getItem(TOKEN_KEY);
  }

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  async clearToken() {
    this.token = null;
    await AsyncStorage.removeItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.token) {
      this.token = await AsyncStorage.getItem(TOKEN_KEY);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const url = endpoint.startsWith('http') ? endpoint : `${BASE_API_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        // Token expired or invalid
        // Optionally trigger logout event
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || `Request failed with status ${response.status}`);
      }

      return data as T;
    } catch (error: any) {
      console.warn(`[API ERROR] ${options.method || 'GET'} ${url}:`, error.message);
      throw error;
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
