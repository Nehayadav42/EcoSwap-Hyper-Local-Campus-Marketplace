import { apiFetch } from './apiClient';
import { getToken } from '../auth/session';

async function listItems() {
  return apiFetch('/api/items');
}

async function getItem(id) {
  const token = getToken();
  return apiFetch(`/api/items/${encodeURIComponent(id)}`, { token });
}

async function listMyItems() {
  const token = getToken();
  return apiFetch('/api/items/mine', { token });
}

async function createItem(body) {
  const token = getToken();
  return apiFetch('/api/items', {
    method: 'POST',
    token,
    body: JSON.stringify(body)
  });
}

export { listItems, listMyItems, createItem, getItem };
