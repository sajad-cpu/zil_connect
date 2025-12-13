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
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in to create an opportunity');
      }

      const record = await pb.collection('opportunities').create({
        ...data,
        user: userId,
        views: 0,
        application_count: 0
      });
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
  },

  /**
   * Get opportunities created by current user
   */
  async getMyOpportunities(sortBy: string = '-created') {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return [];

      const records = await pb.collection('opportunities').getList(1, 50, {
        sort: sortBy,
        filter: `user="${userId}"`,
        expand: 'user',
        fields: '*' // Explicitly request all fields including application_count and views
      });
      return records.items;
    } catch (error: any) {
      console.error('Error fetching my opportunities:', error);
      return [];
    }
  },

  /**
   * Recalculate application count for an opportunity
   */
  async recalculateApplicationCount(opportunityId: string) {
    try {
      // Count all applications for this opportunity
      const applications = await pb.collection('opportunity_applications').getList(1, 1, {
        filter: `opportunity="${opportunityId}"`,
        $autoCancel: false
      });

      const count = applications.totalItems;

      // Update the opportunity with correct count
      await pb.collection('opportunities').update(opportunityId, {
        application_count: count
      });

      return count;
    } catch (error: any) {
      console.error('Error recalculating application count:', error);
      throw error;
    }
  },

  /**
   * Recalculate counts for all user's opportunities
   */
  async recalculateAllCounts() {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return;

      const opportunities = await pb.collection('opportunities').getList(1, 50, {
        filter: `user="${userId}"`,
        fields: 'id'
      });

      for (const opp of opportunities.items) {
        await this.recalculateApplicationCount(opp.id);
      }
    } catch (error: any) {
      console.error('Error recalculating all counts:', error);
      throw error;
    }
  }
};
