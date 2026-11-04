const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function pickToken(endpoint) {
  if (typeof window === 'undefined') return null;
  if (endpoint.includes('/admin')) return localStorage.getItem('admin_token');
  if (endpoint.startsWith('/assessor/')) return localStorage.getItem('assessor_token');
  return localStorage.getItem('admin_token') || localStorage.getItem('assessor_token');
}

async function apiRequest(endpoint, options = {}) {
  const token = pickToken(endpoint);
  const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    ...(isForm ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong.');
  }
  return data;
}

export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  postForm: (endpoint, formData) => apiRequest(endpoint, { method: 'POST', body: formData }),
  put: (endpoint, body) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  putForm: (endpoint, formData) => apiRequest(endpoint, { method: 'PUT', body: formData }),
  patch: (endpoint, body) => apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  del: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
};