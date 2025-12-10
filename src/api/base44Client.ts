import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "6909f06b820871b3e3d04169",
  requiresAuth: false // Use custom auth instead of Base44 auth
});

