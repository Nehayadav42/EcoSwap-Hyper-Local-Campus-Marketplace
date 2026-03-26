const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

async function apiFetch(path, { token, ...options } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const error = new Error(payload?.error || `Request failed: ${res.status}`);
    error.status = res.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export { API_BASE_URL, apiFetch };

