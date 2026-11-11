const rawUrl = import.meta.env.VITE_API_BASE_URL;
let apiUrl = '';

if (rawUrl) {
  apiUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
    ? rawUrl.replace(/\/+$/, '')
    : `https://${rawUrl.replace(/\/+$/, '')}`;
} else {
  apiUrl = import.meta.env.DEV ? 'http://localhost:5000' : '';
}

export const API_BASE_URL = apiUrl;
