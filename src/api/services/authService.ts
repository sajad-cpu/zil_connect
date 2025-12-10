import { pb } from '../pocketbaseClient';

export const authService = {
  /**
   * Login with email and password
   */
  async login(email: string, password: string) {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      return {
        success: true,
        user: authData.record,
        token: authData.token
      };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  },

  /**
   * Login with Google OAuth
   */
  async loginWithGoogle() {
    try {
      const authData = await pb.collection('users').authWithOAuth2({
        provider: 'google',
      });
      return {
        success: true,
        user: authData.record,
        token: authData.token
      };
    } catch (error: any) {
      throw new Error(error.message || 'Google login failed');
    }
  },

  /**
   * Register new user
   */
  async register(data: {
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
  }) {
    try {
      const record = await pb.collection('users').create(data);
      // Auto-login after registration
      await this.login(data.email, data.password);
      return {
        success: true,
        user: record
      };
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  /**
   * Logout current user
   */
  logout() {
    pb.authStore.clear();
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser() {
    return pb.authStore.model;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return pb.authStore.isValid;
  },

  /**
   * Get current auth token
   */
  getToken() {
    return pb.authStore.token;
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string) {
    try {
      await pb.collection('users').requestPasswordReset(email);
      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || 'Password reset request failed');
    }
  },

  /**
   * Confirm password reset
   */
  async confirmPasswordReset(token: string, password: string, passwordConfirm: string) {
    try {
      await pb.collection('users').confirmPasswordReset(token, password, passwordConfirm);
      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || 'Password reset failed');
    }
  }
};
