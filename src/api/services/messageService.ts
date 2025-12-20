import { pb } from '../pocketbaseClient';
import { notificationService } from './notificationService';

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
        connection: data.connection_id,
        sender: userId,
        receiver: data.receiver_id,
        content: data.text,
        read: false
      });

      console.log('Message sent:', message.id);

      try {
        const senderBusiness = await pb.collection('businesses').getList(1, 1, {
          filter: `owner="${userId}"`
        });

        const businessName = senderBusiness.items[0]?.business_name || senderBusiness.items[0]?.name;

        await notificationService.create({
          user: data.receiver_id,
          type: 'new_message',
          message: `${businessName || 'Someone'} sent you a message`,
          related_id: message.id
        });
      } catch (notifError) {
        console.error('Failed to create notification for message:', notifError);
      }

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
        filter: `connection="${connectionId}"`,
        expand: 'sender,receiver'
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
        expand: 'user_from,user_to,business_from,business_to,business_from.owner,business_to.owner'
      });

      // For each connection, get the latest message and manually fetch users and owners
      const conversations = await Promise.all(
        connections.items.map(async (connection) => {
          try {
            // Manually fetch user_from if expand failed
            if (connection.user_from) {
              const userFromId = typeof connection.user_from === 'string' ? connection.user_from : connection.user_from?.id;
              const expandedUserFrom = connection.expand?.user_from;
              if (userFromId && (!expandedUserFrom || typeof expandedUserFrom === 'string' || !expandedUserFrom.id)) {
                try {
                  const user = await pb.collection('users').getOne(userFromId);
                  if (!connection.expand) connection.expand = {};
                  connection.expand.user_from = user;
                } catch (err) {
                  console.error('Failed to fetch user_from:', err);
                }
              }
            }

            // Manually fetch user_to if expand failed
            if (connection.user_to) {
              const userToId = typeof connection.user_to === 'string' ? connection.user_to : connection.user_to?.id;
              const expandedUserTo = connection.expand?.user_to;
              if (userToId && (!expandedUserTo || typeof expandedUserTo === 'string' || !expandedUserTo.id)) {
                try {
                  const user = await pb.collection('users').getOne(userToId);
                  if (!connection.expand) connection.expand = {};
                  connection.expand.user_to = user;
                } catch (err) {
                  console.error('Failed to fetch user_to:', err);
                }
              }
            }

            // Manually fetch and attach owner data for businesses
            if (connection.expand?.business_from) {
              // Ensure expand object exists on business
              if (!connection.expand.business_from.expand) {
                connection.expand.business_from.expand = {};
              }

              // Get owner ID - could be a string ID or an object
              let ownerId = connection.expand.business_from.owner;
              if (typeof ownerId === 'object' && ownerId !== null) {
                ownerId = ownerId.id || ownerId;
              }

              // If owner exists and not already expanded, fetch it
              if (ownerId && typeof ownerId === 'string' && !connection.expand.business_from.expand.owner) {
                try {
                  console.log('Fetching business_from owner with ID:', ownerId);
                  const owner = await pb.collection('users').getOne(ownerId);
                  console.log('Fetched owner record:', {
                    id: owner.id,
                    name: owner.name,
                    username: owner.username,
                    email: owner.email
                  });
                  connection.expand.business_from.expand.owner = owner;
                  console.log('Successfully stored owner in expand. Owner data:', JSON.stringify({
                    name: owner.name,
                    username: owner.username,
                    email: owner.email
                  }));
                } catch (err) {
                  console.error('Failed to fetch business_from owner:', ownerId, err);
                }
              } else if (connection.expand.business_from.expand.owner) {
                console.log('Owner already expanded for business_from');
              }
            }

            if (connection.expand?.business_to) {
              // Ensure expand object exists on business
              if (!connection.expand.business_to.expand) {
                connection.expand.business_to.expand = {};
              }

              // Get owner ID - could be a string ID or an object
              let ownerId = connection.expand.business_to.owner;
              if (typeof ownerId === 'object' && ownerId !== null) {
                ownerId = ownerId.id || ownerId;
              }

              // If owner exists and not already expanded, fetch it
              if (ownerId && typeof ownerId === 'string' && !connection.expand.business_to.expand.owner) {
                try {
                  console.log('Fetching business_to owner with ID:', ownerId);
                  const owner = await pb.collection('users').getOne(ownerId);
                  console.log('Fetched owner record:', {
                    id: owner.id,
                    name: owner.name,
                    username: owner.username,
                    email: owner.email
                  });
                  connection.expand.business_to.expand.owner = owner;
                  console.log('Successfully stored owner in expand. Owner data:', JSON.stringify({
                    name: owner.name,
                    username: owner.username,
                    email: owner.email
                  }));
                } catch (err) {
                  console.error('Failed to fetch business_to owner:', ownerId, err);
                }
              } else if (connection.expand.business_to.expand.owner) {
                console.log('Owner already expanded for business_to');
              }
            }

            const latestMessage = await pb.collection('messages').getList(1, 1, {
              sort: '-created',
              filter: `connection="${connection.id}"`
            });

            // Get unread count
            const unreadCount = await pb.collection('messages').getList(1, 1, {
              filter: `connection="${connection.id}" && receiver="${userId}" && read=false`
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

      if (message.receiver !== userId) {
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
        filter: `connection="${connectionId}" && receiver="${userId}" && read=false`
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
        filter: `receiver="${userId}" && read=false`
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
        filter: `connection="${connectionId}" && receiver="${userId}" && read=false`
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

      if (message.sender !== userId) {
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
        filter: `connection="${connectionId}" && content~"${searchQuery}"`,
        expand: 'sender,receiver'
      });

      return records.items;
    } catch (error: any) {
      console.error('Error searching messages:', error);
      return [];
    }
  }
};
