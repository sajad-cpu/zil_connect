import { pb } from '../pocketbaseClient';

export const connectionService = {
  /**
   * Send a connection request to another user/business
   */
  async sendRequest(data: {
    user_to: string;
    business_to: string;
    message?: string;
  }) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in to send connection requests');
      }

      // Prevent self-connection
      if (data.user_to === userId) {
        throw new Error('Cannot send connection request to yourself');
      }

      // Get current user's business
      const businesses = await pb.collection('businesses').getList(1, 1, {
        filter: `owner="${userId}"`
      });

      if (!businesses.items.length) {
        throw new Error('You must have a business profile to send connection requests');
      }

      const userBusiness = businesses.items[0];

      // Check if connection already exists (in any status)
      console.log('Checking for existing connections between:', userId, 'and', data.user_to);

      const existingConnections = await pb.collection('connections').getList(1, 1, {
        filter: `(user_from="${userId}" && user_to="${data.user_to}") || (user_from="${data.user_to}" && user_to="${userId}")`
      });

      console.log('Existing connections found:', existingConnections.items.length, existingConnections.items);

      if (existingConnections.items.length > 0) {
        const existing = existingConnections.items[0];
        console.log('Existing connection status:', existing.status);

        if (existing.status === 'pending') {
          throw new Error('Connection request already pending');
        } else if (existing.status === 'accepted') {
          throw new Error('You are already connected with this user');
        } else if (existing.status === 'blocked') {
          throw new Error('Cannot send connection request to this user');
        } else if (existing.status === 'rejected') {
          throw new Error('Your previous connection request was rejected');
        }
      }

      // Create connection request
      const connection = await pb.collection('connections').create({
        user_from: userId,
        user_to: data.user_to,
        business_from: userBusiness.id,
        business_to: data.business_to,
        status: 'pending',
        message: data.message || ''
      });

      console.log('Connection request sent:', connection.id);

      // TODO: Create notification for the recipient
      // await notificationService.create({
      //   user: data.user_to,
      //   type: 'connection_request',
      //   message: `${userBusiness.business_name} sent you a connection request`,
      //   related_id: connection.id
      // });

      return connection;
    } catch (error: any) {
      console.error('Error sending connection request:', error);
      throw error;
    }
  },

  /**
   * Accept a connection request
   */
  async acceptRequest(connectionId: string) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in');
      }

      // Get connection and verify user_to is current user
      const connection = await pb.collection('connections').getOne(connectionId);

      if (connection.user_to !== userId) {
        throw new Error('You can only accept requests sent to you');
      }

      if (connection.status !== 'pending') {
        throw new Error('This connection request is no longer pending');
      }

      // Update status to accepted
      const updated = await pb.collection('connections').update(connectionId, {
        status: 'accepted'
      });

      console.log('Connection request accepted:', connectionId);

      // TODO: Create notification for the sender
      // await notificationService.create({
      //   user: connection.user_from,
      //   type: 'connection_accepted',
      //   message: 'Your connection request was accepted',
      //   related_id: connectionId
      // });

      return updated;
    } catch (error: any) {
      console.error('Error accepting connection request:', error);
      throw error;
    }
  },

  /**
   * Reject a connection request
   */
  async rejectRequest(connectionId: string) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in');
      }

      // Get connection and verify user_to is current user
      const connection = await pb.collection('connections').getOne(connectionId);

      if (connection.user_to !== userId) {
        throw new Error('You can only reject requests sent to you');
      }

      if (connection.status !== 'pending') {
        throw new Error('This connection request is no longer pending');
      }

      // Update status to rejected
      const updated = await pb.collection('connections').update(connectionId, {
        status: 'rejected'
      });

      console.log('Connection request rejected:', connectionId);

      return updated;
    } catch (error: any) {
      console.error('Error rejecting connection request:', error);
      throw error;
    }
  },

  /**
   * Block a user (reject and prevent future requests)
   */
  async blockUser(connectionId: string) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in');
      }

      // Get connection and verify user_to is current user
      const connection = await pb.collection('connections').getOne(connectionId);

      if (connection.user_to !== userId) {
        throw new Error('You can only block users who sent you requests');
      }

      // Update status to blocked
      const updated = await pb.collection('connections').update(connectionId, {
        status: 'blocked'
      });

      console.log('User blocked:', connectionId);

      return updated;
    } catch (error: any) {
      console.error('Error blocking user:', error);
      throw error;
    }
  },

  /**
   * Remove/Delete a connection (withdraw request or disconnect)
   */
  async removeConnection(connectionId: string) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in');
      }

      // Get connection and verify user is involved
      const connection = await pb.collection('connections').getOne(connectionId);

      if (connection.user_from !== userId && connection.user_to !== userId) {
        throw new Error('You can only remove your own connections');
      }

      // Delete the connection
      await pb.collection('connections').delete(connectionId);

      console.log('Connection removed:', connectionId);

      return { success: true };
    } catch (error: any) {
      console.error('Error removing connection:', error);
      throw error;
    }
  },

  /**
   * Get pending connection requests (received)
   */
  async getPendingRequests() {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        console.log('getPendingRequests: No user ID found');
        return [];
      }

      console.log('Fetching pending requests for user:', userId);

      const records = await pb.collection('connections').getList(1, 50, {
        sort: '-created',
        filter: `user_to="${userId}" && status="pending"`,
        expand: 'user_from,user_to,business_from,business_to'
      });

      console.log('Pending requests found:', records.items.length, records.items);

      return records.items;
    } catch (error: any) {
      console.error('Error fetching pending requests:', error);
      console.error('Error details:', error.response || error);
      return [];
    }
  },

  /**
   * Get sent connection requests (pending)
   */
  async getSentRequests() {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return [];

      const records = await pb.collection('connections').getList(1, 50, {
        sort: '-created',
        filter: `user_from="${userId}" && status="pending"`,
        expand: 'user_from,user_to,business_from,business_to'
      });

      return records.items;
    } catch (error: any) {
      console.error('Error fetching sent requests:', error);
      return [];
    }
  },

  /**
   * Get all accepted connections
   */
  async getConnections() {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return [];

      const records = await pb.collection('connections').getList(1, 100, {
        sort: '-created',
        filter: `(user_from="${userId}" || user_to="${userId}") && status="accepted"`,
        expand: 'user_from,user_to,business_from,business_to'
      });

      return records.items;
    } catch (error: any) {
      console.error('Error fetching connections:', error);
      return [];
    }
  },

  /**
   * Check connection status with a specific user
   */
  async getConnectionStatus(targetUserId: string) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return null;

      const records = await pb.collection('connections').getList(1, 1, {
        filter: `(user_from="${userId}" && user_to="${targetUserId}") || (user_from="${targetUserId}" && user_to="${userId}")`
      });

      if (records.items.length === 0) {
        return { status: 'none', connection: null };
      }

      const connection = records.items[0];
      return {
        status: connection.status,
        connection: connection,
        isSender: connection.user_from === userId
      };
    } catch (error: any) {
      console.error('Error checking connection status:', error);
      return null;
    }
  },

  /**
   * Get connection count (total accepted connections)
   */
  async getConnectionCount() {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return 0;

      const records = await pb.collection('connections').getList(1, 1, {
        filter: `(user_from="${userId}" || user_to="${userId}") && status="accepted"`
      });

      return records.totalItems;
    } catch (error: any) {
      console.error('Error fetching connection count:', error);
      return 0;
    }
  }
};
