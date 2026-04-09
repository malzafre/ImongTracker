import { auth } from './firebase';

const BASE_URL = 'http://localhost:5000/api';

// Helper to get fresh token before every request
const getAuthToken = async () => {
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken(true);
  }
  return null;
};

export const apiFetch = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const applicationsApi = {
  getAll: () => apiFetch('/applications'),
  create: (data) => apiFetch('/applications', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/applications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/applications/${id}`, { method: 'DELETE' }),
};

export const contactsApi = {
  getAll: () => apiFetch('/contacts'),
  create: (data) => apiFetch('/contacts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/contacts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/contacts/${id}`, { method: 'DELETE' }),
};
