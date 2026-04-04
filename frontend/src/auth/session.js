const TOKEN_KEY = 'ecoswap_token';
const USER_KEY = 'ecoswap_user';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getUserProfile() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setUserProfile(profile) {
  if (!profile) {
    localStorage.removeItem(USER_KEY);
    return;
  }
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
}

export { getToken, setToken, clearToken, TOKEN_KEY, getUserProfile, setUserProfile, USER_KEY };

