const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'Network error');
  }
}

// Authentication API
export const authApi = {
  login: (credentials: { username?: string; email?: string; password: string }) =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getProfile: () => apiRequest('/api/auth/profile'),

  createAdmin: (userData: { username: string; email: string; password: string; role: string }) =>
    apiRequest('/api/auth/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getUsers: () => apiRequest('/api/auth/users'),

  deleteUser: (userId: string) =>
    apiRequest(`/api/auth/users/${userId}`, {
      method: 'DELETE',
    }),
};

// Cars API
export const carsApi = {
  getAll: () => apiRequest('/api/cars'),

  getById: (id: string) => apiRequest(`/api/cars/${id}`),

  create: (carData: any) =>
    apiRequest('/api/cars', {
      method: 'POST',
      body: JSON.stringify(carData),
    }),

  update: (id: string, carData: any) =>
    apiRequest(`/api/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(carData),
    }),

  delete: (id: string) =>
    apiRequest(`/api/cars/${id}`, {
      method: 'DELETE',
    }),
};

// Orders API
export const ordersApi = {
  getAll: (params?: { status?: string; limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const query = queryParams.toString();
    return apiRequest(`/api/orders${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => apiRequest(`/api/orders/${id}`),

  create: (orderData: any) =>
    apiRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  update: (id: string, orderData: any) =>
    apiRequest(`/api/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    }),

  delete: (id: string) =>
    apiRequest(`/api/orders/${id}`, {
      method: 'DELETE',
    }),

  getStats: () => apiRequest('/api/orders/stats/summary'),
};

// Transactions API
export const transactionsApi = {
  getAll: (params?: { status?: string; type?: string; limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const query = queryParams.toString();
    return apiRequest(`/api/transactions${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => apiRequest(`/api/transactions/${id}`),

  create: (transactionData: any) =>
    apiRequest('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    }),

  update: (id: string, transactionData: any) =>
    apiRequest(`/api/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    }),

  delete: (id: string) =>
    apiRequest(`/api/transactions/${id}`, {
      method: 'DELETE',
    }),

  getStats: () => apiRequest('/api/transactions/stats/summary'),
};

export { ApiError };