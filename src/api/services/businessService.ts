import { pb } from '../pocketbaseClient';

export const businessService = {
  /**
   * List all businesses with sorting
   */
  async list(sortBy: string = '-created') {
    try {
      const records = await pb.collection('businesses').getList(1, 50, {
        sort: sortBy,
        expand: 'owner'
      });
      return records.items;
    } catch (error: any) {
      console.error('Error fetching businesses:', error);
      return [];
    }
  },

  /**
   * Filter businesses by criteria
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

      const records = await pb.collection('businesses').getList(1, limit, {
        sort: sortBy,
        filter: filterString || undefined,
        expand: 'owner'
      });
      return records.items;
    } catch (error: any) {
      console.error('Error filtering businesses:', error);
      return [];
    }
  },

  /**
   * Get single business by ID
   */
  async getById(id: string) {
    try {
      const record = await pb.collection('businesses').getOne(id, {
        expand: 'owner'
      });
      return record;
    } catch (error: any) {
      console.error('Error fetching business:', error);
      throw error;
    }
  },

  /**
   * Create new business
   */
  async create(data: any) {
    try {
      const record = await pb.collection('businesses').create(data);
      return record;
    } catch (error: any) {
      console.error('Error creating business:', error);
      throw error;
    }
  },

  /**
   * Update business
   */
  async update(id: string, data: any) {
    try {
      const record = await pb.collection('businesses').update(id, data);
      return record;
    } catch (error: any) {
      console.error('Error updating business:', error);
      throw error;
    }
  },

  /**
   * Delete business
   */
  async delete(id: string) {
    try {
      await pb.collection('businesses').delete(id);
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting business:', error);
      throw error;
    }
  },

  /**
   * Search businesses by query
   */
  async search(query: string) {
    try {
      const records = await pb.collection('businesses').getList(1, 50, {
        filter: `business_name ~ "${query}" || description ~ "${query}"`,
        sort: '-engagement_score'
      });
      return records.items;
    } catch (error: any) {
      console.error('Error searching businesses:', error);
      return [];
    }
  },

  /**
   * Get current user's business
   */
  async getMyBusiness() {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        console.warn('getMyBusiness: No user ID found');
        return null;
      }

      console.log('Fetching business for user:', userId);

      const records = await pb.collection('businesses').getList(1, 1, {
        filter: `owner="${userId}"`,
        expand: 'owner',
        $autoCancel: false
      });

      console.log('Business records found:', records.items.length);

      if (records.items.length > 0) {
        console.log('Business found:', records.items[0].id);
        return records.items[0];
      }

      console.log('No business found for user');
      return null;
    } catch (error: any) {
      console.error('Error fetching my business:', error);
      return null;
    }
  }
};
