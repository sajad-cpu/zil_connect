import { pb } from '../pocketbaseClient';

export const eventService = {
  /**
   * List all events
   */
  async list(sortBy: string = '-date') {
    try {
      const records = await pb.collection('events').getList(1, 50, {
        sort: sortBy,
        expand: 'business'
      });
      return records.items;
    } catch (error: any) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  /**
   * Filter events by criteria
   */
  async filter(filters: Record<string, any>, sortBy: string = '-date', limit: number = 50) {
    try {
      const filterString = Object.entries(filters)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' && ');

      const records = await pb.collection('events').getList(1, limit, {
        sort: sortBy,
        filter: filterString || undefined,
        expand: 'business'
      });
      return records.items;
    } catch (error: any) {
      console.error('Error filtering events:', error);
      return [];
    }
  },

  /**
   * Get single event by ID
   */
  async getById(id: string) {
    try {
      const record = await pb.collection('events').getOne(id, {
        expand: 'business'
      });
      return record;
    } catch (error: any) {
      console.error('Error fetching event:', error);
      throw error;
    }
  },

  /**
   * Create new event
   */
  async create(data: any) {
    try {
      const record = await pb.collection('events').create(data);
      return record;
    } catch (error: any) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  /**
   * Update event
   */
  async update(id: string, data: any) {
    try {
      const record = await pb.collection('events').update(id, data);
      return record;
    } catch (error: any) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  /**
   * Delete event
   */
  async delete(id: string) {
    try {
      await pb.collection('events').delete(id);
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  /**
   * Register for event
   */
  async register(eventId: string, businessId: string) {
    try {
      const event = await pb.collection('events').getOne(eventId);
      const newCount = (event.registered_count || 0) + 1;

      await pb.collection('events').update(eventId, {
        registered_count: newCount
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error registering for event:', error);
      throw error;
    }
  }
};
