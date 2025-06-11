const API_BASE_URL = 'http://localhost:5000/api/v1';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth endpoints
  auth: {
    login: async (credentials) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      return response.json();
    },
    register: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return response.json();
    },
  },

  // Product endpoints
  products: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: getHeaders(),
      });
      return response.json();
    },
    getById: async (id) => {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        headers: getHeaders(),
      });
      return response.json();
    },
    create: async (productData) => {
      const formData = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      return response.json();
    },
    update: async (id, productData) => {
      const formData = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      return response.json();
    },
    delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return response.json();
    },
  },
}; 