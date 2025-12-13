import { pb } from '../pocketbaseClient';

export const messageService = {
  /**
   * Send a message to a connected user
   */
  async sendMessage(data: {
    connection_id: string;
    receiver_id: string;
    text: string;
    attachment_url?: string;
  }) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in to send messages');
      }

      // Verify connection exists and is accepted
      const connection = await pb.collection('connections').getOne(data.connection_id);

      if (connection.status !== 'accepted') {
        throw new Error('You can only message accepted connections');
      }

      // Verify user is part of this connection
      if (connection.user_from !== userId && connection.user_to !== userId) {
        throw new Error('You are not part of this connection');
      }

      // Verify receiver is the other person in the connection
      const expectedReceiver = connection.user_from === userId ? connection.user_to : connection.user_from;
      if (data.receiver_id !== expectedReceiver) {
        throw new Error('Invalid receiver for this connection');
      }

      // Create message
      const message = await pb.collection('messages').create({
        connection_id: data.connection_id,
        sender_id: userId,
        receiver_id: data.receiver_id,
        text: data.text,
        read: false,
        attachment_url: data.attachment_url || ''
      });

      console.log('Message sent:', message.id);

      // TODO: Create notification for receiver
      // await notificationService.create({
      //   user: data.receiver_id,
      //   type: 'new_message',
      //   message: 'You have a new message',
      //   related_id: message.id
      // });

      return message;
    } catch (error: any) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  /**
   * Get all messages for a specific connection
   */
  async getMessages(connectionId: string, page: number = 1, perPage: number = 50) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return [];

      // Verify user is part of this connection
      const connection = await pb.collection('connections').getOne(connectionId);

      if (connection.user_from !== userId && connection.user_to !== userId) {
        throw new Error('You do not have access to these messages');
      }

      const records = await pb.collection('messages').getList(page, perPage, {
        sort: 'created',
        filter: `connection_id="${connectionId}"`,
        expand: 'sender_id,receiver_id'
      });

      return records.items;
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  /**
   * Get all conversations (grouped by connection)
   */
  async getConversations() {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return [];

      // Get all accepted connections
      const connections = await pb.collection('connections').getList(1, 100, {
        sort: '-updated',
        filter: `(user_from="${userId}" || user_to="${userId}") && status="accepted"`,
        expand: 'user_from,user_to,business_from,business_to'
      });

      // For each connection, get the latest message
      const conversations = await Promise.all(
        connections.items.map(async (connection) => {
          try {
            const latestMessage = await pb.collection('messages').getList(1, 1, {
              sort: '-created',
              filter: `connection_id="${connection.id}"`
            });

            // Get unread count
            const unreadCount = await pb.collection('messages').getList(1, 1, {
              filter: `connection_id="${connection.id}" && receiver_id="${userId}" && read=false`
            });

            return {
              connection,
              latestMessage: latestMessage.items[0] || null,
              unreadCount: unreadCount.totalItems
            };
          } catch (error) {
            console.error('Error fetching conversation data:', error);
            return {
              connection,
              latestMessage: null,
              unreadCount: 0
            };
          }
        })
      );

      // Sort by latest message time
      conversations.sort((a, b) => {
        const timeA = a.latestMessage?.created || a.connection.created;
        const timeB = b.latestMessage?.created || b.connection.created;
        return new Date(timeB).getTime() - new Date(timeA).getTime();
      });

      return conversations;
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  },

  /**
   * Mark a message as read
   */
  async markAsRead(messageId: string) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in');
      }

      // Get message and verify receiver is current user
      const message = await pb.collection('messages').getOne(messageId);

      if (message.receiver_id !== userId) {
        throw new Error('You can only mark your own messages as read');
      }

      if (message.read) {
        return message; // Already read
      }

      // Update message
      const updated = await pb.collection('messages').update(messageId, {
        read: true
      });

      console.log('Message marked as read:', messageId);

      return updated;
    } catch (error: any) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  },

  /**
   * Mark all messages in a connection as read
   */
  async markAllAsRead(connectionId: string) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in');
      }

      // Get all unread messages where current user is receiver
      const unreadMessages = await pb.collection('messages').getList(1, 100, {
        filter: `connection_id="${connectionId}" && receiver_id="${userId}" && read=false`
      });

      // Mark each as read
      const updatePromises = unreadMessages.items.map((message) =>
        pb.collection('messages').update(message.id, { read: true })
      );

      await Promise.all(updatePromises);

      console.log(`Marked ${unreadMessages.items.length} messages as read`);

      return { count: unreadMessages.items.length };
    } catch (error: any) {
      console.error('Error marking all messages as read:', error);
      throw error;
    }
  },

  /**
   * Get unread message count for current user
   */
  async getUnreadCount() {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return 0;

      const records = await pb.collection('messages').getList(1, 1, {
        filter: `receiver_id="${userId}" && read=false`
      });

      return records.totalItems;
    } catch (error: any) {
      console.error('Error fetching unread message count:', error);
      return 0;
    }
  },

  /**
   * Get unread message count for a specific connection
   */
  async getUnreadCountForConnection(connectionId: string) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return 0;

      const records = await pb.collection('messages').getList(1, 1, {
        filter: `connection_id="${connectionId}" && receiver_id="${userId}" && read=false`
      });

      return records.totalItems;
    } catch (error: any) {
      console.error('Error fetching unread count for connection:', error);
      return 0;
    }
  },

  /**
   * Delete a message (only sender can delete)
   */
  async deleteMessage(messageId: string) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in');
      }

      // Get message and verify sender is current user
      const message = await pb.collection('messages').getOne(messageId);

      if (message.sender_id !== userId) {
        throw new Error('You can only delete your own messages');
      }

      await pb.collection('messages').delete(messageId);

      console.log('Message deleted:', messageId);

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  /**
   * Search messages in a connection
   */
  async searchMessages(connectionId: string, searchQuery: string) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return [];

      // Verify user is part of this connection
      const connection = await pb.collection('connections').getOne(connectionId);

      if (connection.user_from !== userId && connection.user_to !== userId) {
        throw new Error('You do not have access to these messages');
      }

      const records = await pb.collection('messages').getList(1, 50, {
        sort: '-created',
        filter: `connection_id="${connectionId}" && text~"${searchQuery}"`,
        expand: 'sender_id,receiver_id'
      });

      return records.items;
    } catch (error: any) {
      console.error('Error searching messages:', error);
      return [];
    }
  }
};
