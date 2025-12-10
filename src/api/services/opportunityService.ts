import { pb } from '../pocketbaseClient';

export const opportunityService = {
  /**
   * List all opportunities
   */
  async list(sortBy: string = '-created') {
    try {
      const records = await pb.collection('opportunities').getList(1, 50, {
        sort: sortBy,
        expand: 'business'
      });
      return records.items;
    } catch (error: any) {
      console.error('Error fetching opportunities:', error);
      return [];
    }
  },

  /**
   * Filter opportunities by criteria
   */
  async filter(filters: Record<string, any>, sortBy: string = '-created', limit: number = 50) {
    try {
      const filterString = Object.entries(filters)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' && ');

      const records = await pb.collection('opportunities').getList(1, limit, {
        sort: sortBy,
        filter: filterString || undefined,
        expand: 'business'
      });
      return records.items;
    } catch (error: any) {
      console.error('Error filtering opportunities:', error);
      return [];
    }
  },

  /**
   * Get single opportunity by ID
   */
  async getById(id: string) {
    try {
      const record = await pb.collection('opportunities').getOne(id, {
        expand: 'business'
      });
      return record;
    } catch (error: any) {
      console.error('Error fetching opportunity:', error);
      throw error;
    }
  },

  /**
   * Create new opportunity
   */
  async create(data: any) {
    try {
      const record = await pb.collection('opportunities').create(data);
      return record;
    } catch (error: any) {
      console.error('Error creating opportunity:', error);
      throw error;
    }
  },

  /**
   * Update opportunity
   */
  async update(id: string, data: any) {
    try {
      const record = await pb.collection('opportunities').update(id, data);
      return record;
    } catch (error: any) {
      console.error('Error updating opportunity:', error);
      throw error;
    }
  },

  /**
   * Delete opportunity
   */
  async delete(id: string) {
    try {
      await pb.collection('opportunities').delete(id);
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting opportunity:', error);
      throw error;
    }
  },

  /**
   * Increment view count
   */
  async incrementViews(id: string) {
    try {
      const current = await pb.collection('opportunities').getOne(id);
      await pb.collection('opportunities').update(id, {
        views: (current.views || 0) + 1
      });
    } catch (error: any) {
      console.error('Error incrementing views:', error);
    }
  }
};
