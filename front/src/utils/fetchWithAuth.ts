export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('access_token');
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  
    return fetch(url, { ...options, headers });
  }