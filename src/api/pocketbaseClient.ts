import PocketBase from 'pocketbase';

// Initialize PocketBase client
export const pb = new PocketBase('https://pocketbase.captain.sebipay.com');

// Disable auto-cancellation for better UX
pb.autoCancellation(false);

// Auto-sync authentication state with localStorage
pb.authStore.onChange((token, model) => {
  if (model) {
    // User logged in - store auth data
    localStorage.setItem('zil_auth_token', token);
    localStorage.setItem('zil_is_authenticated', 'true');
    localStorage.setItem('zil_user_name', model.name || model.email);
    localStorage.setItem('zil_user_id', model.id);
    localStorage.setItem('zil_user_data', JSON.stringify(model));
  } else {
    // User logged out - clear auth data
    localStorage.removeItem('zil_auth_token');
    localStorage.removeItem('zil_is_authenticated');
    localStorage.removeItem('zil_user_name');
    localStorage.removeItem('zil_user_id');
    localStorage.removeItem('zil_user_data');
  }
});

// Load auth from localStorage on init
const storedToken = localStorage.getItem('zil_auth_token');
const storedUserData = localStorage.getItem('zil_user_data');
if (storedToken && storedUserData) {
  try {
    const userData = JSON.parse(storedUserData);
    pb.authStore.save(storedToken, userData);
  } catch (e) {
    // If parsing fails, clear invalid data
    console.error('Failed to restore auth:', e);
    localStorage.removeItem('zil_auth_token');
    localStorage.removeItem('zil_user_data');
    localStorage.removeItem('zil_is_authenticated');
    localStorage.removeItem('zil_user_name');
    localStorage.removeItem('zil_user_id');
  }
}
