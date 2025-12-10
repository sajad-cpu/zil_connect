import { pb } from '../pocketbaseClient';

export const offerService = {
  /**
   * List all offers
   */
  async list(sortBy: string = '-created') {
    try {
      const records = await pb.collection('offers').getList(1, 50, {
        sort: sortBy,
        expand: 'business'
      });
      return records.items;
    } catch (error: any) {
      console.error('Error fetching offers:', error);
      return [];
    }
  },

  /**
   * Filter offers by criteria
   */
  async filter(filters: Record<string, any>, sortBy: string = '-created', limit: number = 50) {
    try {
      const filterString = Object.entries(filters)
        .map(([key, value]) => {
          if (typeof value === 'boolean') {
            return `${key}=${value}`;
          }
          return `${key}="${value}"`;
        })
        .join(' && ');

      const records = await pb.collection('offers').getList(1, limit, {
        sort: sortBy,
        filter: filterString || undefined,
        expand: 'business'
      });
      return records.items;
    } catch (error: any) {
      console.error('Error filtering offers:', error);
      return [];
    }
  },

  /**
   * Get single offer by ID
   */
  async getById(id: string) {
    try {
      const record = await pb.collection('offers').getOne(id, {
        expand: 'business'
      });
      return record;
    } catch (error: any) {
      console.error('Error fetching offer:', error);
      throw error;
    }
  },

  /**
   * Create new offer
   */
  async create(data: any) {
    try {
      const record = await pb.collection('offers').create(data);
      return record;
    } catch (error: any) {
      console.error('Error creating offer:', error);
      throw error;
    }
  },

  /**
   * Update offer
   */
  async update(id: string, data: any) {
    try {
      const record = await pb.collection('offers').update(id, data);
      return record;
    } catch (error: any) {
      console.error('Error updating offer:', error);
      throw error;
    }
  },

  /**
   * Delete offer
   */
  async delete(id: string) {
    try {
      await pb.collection('offers').delete(id);
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting offer:', error);
      throw error;
    }
  }
};
