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

export interface UsageStats {
  documentsThisMonth: number;
  documentLimit: number;
  apiCallsTotal: number;
  currentTier: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: { documents: number };
}

export interface DocumentType {
  id: string;
  title: string;
  content: string;
  format: string;
  projectId?: string;
  project?: { title: string };
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface GenerateOptions {
  prompt: string;
  documentType?: string;
  subject?: string;
  citationStyle?: string;
  wordCount?: number;
  projectId?: string;
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

  async getProjects(): Promise<Project[]> {
    const response = await fetchWithAuth('/api/projects');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch projects');
    return (data as { data: { projects: Project[] } }).data.projects;
  },

  async getProject(id: string): Promise<Project> {
    const response = await fetchWithAuth(`/api/projects/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch project');
    return (data as { data: Project }).data;
  },

  async createProject(data: { title: string; description?: string; type?: string }): Promise<Project> {
    const response = await fetchWithAuth('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.error || 'Failed to create project');
    return (json as { data: Project }).data;
  },

  async updateProject(id: string, data: { title?: string; description?: string; status?: string }): Promise<Project> {
    const response = await fetchWithAuth(`/api/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.error || 'Failed to update project');
    return (json as { data: Project }).data;
  },

  async deleteProject(id: string): Promise<void> {
    const response = await fetchWithAuth(`/api/projects/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete project');
    }
  },

  async getDocuments(projectId?: string): Promise<DocumentType[]> {
    const url = projectId ? `/api/documents?projectId=${projectId}` : '/api/documents';
    const response = await fetchWithAuth(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch documents');
    return (data as { data: { documents: DocumentType[] } }).data.documents;
  },

  async getDocument(id: string): Promise<DocumentType> {
    const response = await fetchWithAuth(`/api/documents/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch document');
    return (data as { data: DocumentType }).data;
  },

  async createDocument(data: { title: string; content: string; format?: string; projectId?: string }): Promise<DocumentType> {
    const response = await fetchWithAuth('/api/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.error || 'Failed to create document');
    return (json as { data: DocumentType }).data;
  },

  async updateDocument(id: string, data: { title?: string; content?: string }): Promise<DocumentType> {
    const response = await fetchWithAuth(`/api/documents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.error || 'Failed to update document');
    return (json as { data: DocumentType }).data;
  },

  async deleteDocument(id: string): Promise<void> {
    const response = await fetchWithAuth(`/api/documents/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete document');
    }
  },

  async generateContent(options: GenerateOptions): Promise<{ content: string; documentId: string }> {
    const response = await fetchWithAuth('/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        projectId: options.projectId,
        type: options.documentType || 'essay',
        topic: options.prompt,
        instructions: [options.subject, options.citationStyle, `Target: ${options.wordCount} words`].filter(Boolean).join('. '),
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to generate content');
    const payload = data as { data: { documentId: string; content: string; status: string } };
    return { documentId: payload.data.documentId, content: payload.data.content };
  },

  async getUsageStats(): Promise<UsageStats> {
    const response = await fetchWithAuth('/api/usage/me');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch usage stats');
    const payload = data as { data: { tier: string; limits: { monthlyDocuments: number; dailyApiCalls: number }; usage: { monthDocuments: number; monthDocumentsRemaining: number; todayApiCalls: number; dailyRemaining: number } } };
    return {
      documentsThisMonth: payload.data.usage.monthDocuments,
      documentLimit: payload.data.usage.monthDocuments + payload.data.usage.monthDocumentsRemaining,
      apiCallsTotal: payload.data.usage.todayApiCalls,
      currentTier: payload.data.tier,
    };
  },
};
