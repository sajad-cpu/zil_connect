import { pb } from '../pocketbaseClient';

export const notificationService = {
  /**
   * Create a new notification
   */
  async create(data: {
    user: string;
    type: 'connection_request' | 'connection_accepted' | 'new_message' | 'system';
    message: string;
    related_id?: string;
  }) {
    try {
      const notification = await pb.collection('notifications').create({
        user: data.user,
        type: data.type,
        message: data.message,
        related_id: data.related_id || '',
        is_read: false
      });

      console.log('Notification created:', notification.id);

      return notification;
    } catch (error: any) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  /**
   * Get all notifications for current user
   */
  async getAll(page: number = 1, perPage: number = 50) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return [];

      const records = await pb.collection('notifications').getList(page, perPage, {
        sort: '-created',
        filter: `user="${userId}"`
      });

      return records.items;
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  /**
   * Get unread notifications
   */
  async getUnread() {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return [];

      const records = await pb.collection('notifications').getList(1, 50, {
        sort: '-created',
        filter: `user="${userId}" && is_read=false`
      });

      return records.items;
    } catch (error: any) {
      console.error('Error fetching unread notifications:', error);
      return [];
    }
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount() {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return 0;

      const records = await pb.collection('notifications').getList(1, 1, {
        filter: `user="${userId}" && is_read=false`
      });

      return records.totalItems;
    } catch (error: any) {
      console.error('Error fetching unread notification count:', error);
      return 0;
    }
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in');
      }

      // Get notification and verify it belongs to current user
      const notification = await pb.collection('notifications').getOne(notificationId);

      if (notification.user !== userId) {
        throw new Error('You can only mark your own notifications as read');
      }

      if (notification.is_read) {
        return notification; // Already read
      }

      // Update notification
      const updated = await pb.collection('notifications').update(notificationId, {
        is_read: true
      });

      console.log('Notification marked as read:', notificationId);

      return updated;
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in');
      }

      // Get all unread notifications
      const unreadNotifications = await pb.collection('notifications').getList(1, 100, {
        filter: `user="${userId}" && is_read=false`
      });

      // Mark each as read
      const updatePromises = unreadNotifications.items.map((notification) =>
        pb.collection('notifications').update(notification.id, { is_read: true })
      );

      await Promise.all(updatePromises);

      console.log(`Marked ${unreadNotifications.items.length} notifications as read`);

      return { count: unreadNotifications.items.length };
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Delete a notification
   */
  async delete(notificationId: string) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in');
      }

      // Get notification and verify it belongs to current user
      const notification = await pb.collection('notifications').getOne(notificationId);

      if (notification.user !== userId) {
        throw new Error('You can only delete your own notifications');
      }

      await pb.collection('notifications').delete(notificationId);

      console.log('Notification deleted:', notificationId);

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  /**
   * Delete all read notifications
   */
  async deleteAllRead() {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in');
      }

      // Get all read notifications
      const readNotifications = await pb.collection('notifications').getList(1, 100, {
        filter: `user="${userId}" && is_read=true`
      });

      // Delete each
      const deletePromises = readNotifications.items.map((notification) =>
        pb.collection('notifications').delete(notification.id)
      );

      await Promise.all(deletePromises);

      console.log(`Deleted ${readNotifications.items.length} read notifications`);

      return { count: readNotifications.items.length };
    } catch (error: any) {
      console.error('Error deleting read notifications:', error);
      throw error;
    }
  },

  /**
   * Get notifications by type
   */
  async getByType(type: 'connection_request' | 'connection_accepted' | 'new_message' | 'system') {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return [];

      const records = await pb.collection('notifications').getList(1, 50, {
        sort: '-created',
        filter: `user="${userId}" && type="${type}"`
      });

      return records.items;
    } catch (error: any) {
      console.error('Error fetching notifications by type:', error);
      return [];
    }
  }
};
