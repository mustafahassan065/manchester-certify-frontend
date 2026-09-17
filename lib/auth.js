export function saveAdminSession(token, user) {
  localStorage.setItem('admin_token', token);
  localStorage.setItem('admin_user', JSON.stringify(user));
}

export function getAdminUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('admin_user');
  return raw ? JSON.parse(raw) : null;
}

export function clearAdminSession() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
}

export function saveAssessorSession(token, user) {
  localStorage.setItem('assessor_token', token);
  localStorage.setItem('assessor_user', JSON.stringify(user));
}

export function getAssessorUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('assessor_user');
  return raw ? JSON.parse(raw) : null;
}

export function clearAssessorSession() {
  localStorage.removeItem('assessor_token');
  localStorage.removeItem('assessor_user');
}