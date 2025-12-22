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
        .map(([key, value]) => {
          // Handle case-insensitive status filter
          if (key === 'status' && typeof value === 'string') {
            return `${key}="${value.toLowerCase()}"`;
          }
          return `${key}="${value}"`;
        })
        .join(' && ');

      console.log('Filtering opportunities with:', filterString);

      const records = await pb.collection('opportunities').getList(1, limit, {
        sort: sortBy,
        filter: filterString || undefined,
        expand: 'business,created_by'
      });

      console.log('Found opportunities:', records.items.length);
      return records.items;
    } catch (error: any) {
      console.error('Error filtering opportunities:', error);
      if (error.response) {
        console.error('Error response:', error.response);
        console.error('Error data:', error.response.data);
      }
      return [];
    }
  },

  /**
   * Get single opportunity by ID
   */
  async getById(id: string) {
    try {
      const record = await pb.collection('opportunities').getOne(id, {
        expand: 'business,created_by'
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

      // Get user's business
      const businesses = await pb.collection('businesses').getList(1, 1, {
        filter: `owner="${userId}"`
      });

      if (!businesses.items.length) {
        throw new Error('You must have a business profile to create opportunities');
      }

      // Prepare data - only include fields that exist in the schema
      const createData: any = {
        title: data.title,
        description: data.description,
        created_by: userId,
        business: businesses.items[0].id
      };

      // Add optional fields only if they have values
      if (data.type) createData.type = data.type;
      if (data.status) createData.status = data.status;
      if (data.budget) createData.budget = data.budget;
      if (data.location) createData.location = data.location;
      if (data.deadline) createData.deadline = data.deadline;
      if (data.requirements) createData.requirements = data.requirements;

      console.log('Creating opportunity with data:', createData);

      const record = await pb.collection('opportunities').create(createData);
      return record;
    } catch (error: any) {
      console.error('Error creating opportunity:', error);
      if (error.response) {
        console.error('Error response:', error.response);
        console.error('Error data:', error.response.data);
      }
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
      const current = await pb.collection('opportunities').getOne(id, {
        fields: 'id,views'
      });
      const currentViews = typeof current.views === 'number' ? current.views : 0;
      await pb.collection('opportunities').update(id, {
        views: currentViews + 1
      });
      console.log('Views incremented for opportunity:', id, 'New count:', currentViews + 1);
    } catch (error: any) {
      // Don't throw error - view tracking is non-critical
      console.error('Error incrementing views:', error);
      if (error.response) {
        console.error('Error response:', error.response);
        console.error('Error data:', error.response.data);
      }
    }
  },

  /**
   * Get opportunities created by current user
   */
  async getMyOpportunities(sortBy: string = '-created') {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        console.log('getMyOpportunities: No user ID found');
        return [];
      }

      console.log('getMyOpportunities: Fetching opportunities for user:', userId);

      // Try multiple filter approaches to ensure we get the data
      let records;
      try {
        // First try: direct filter on created_by relation
        records = await pb.collection('opportunities').getList(1, 50, {
          sort: sortBy,
          filter: `created_by="${userId}"`,
          expand: 'business,created_by',
          fields: '*'
        });
        console.log('getMyOpportunities: Filter approach 1 - Found', records.items.length, 'opportunities');
      } catch (filterError: any) {
        console.warn('getMyOpportunities: Filter approach 1 failed, trying alternative:', filterError);
        // Fallback: Get all and filter client-side (less efficient but more reliable)
        try {
          const allRecords = await pb.collection('opportunities').getList(1, 100, {
            sort: sortBy,
            expand: 'business,created_by',
            fields: '*'
          });
          records = {
            ...allRecords,
            items: allRecords.items.filter((item: any) => {
              const createdById = typeof item.created_by === 'string' ? item.created_by : item.created_by?.id;
              return createdById === userId;
            })
          };
          console.log('getMyOpportunities: Filter approach 2 (client-side) - Found', records.items.length, 'opportunities');
        } catch (fallbackError: any) {
          console.error('getMyOpportunities: Both filter approaches failed:', fallbackError);
          throw fallbackError;
        }
      }

      console.log('getMyOpportunities: Final result -', records.items.length, 'opportunities');
      console.log('getMyOpportunities: Opportunities:', records.items.map((opp: any) => ({
        id: opp.id,
        title: opp.title,
        created_by: opp.created_by,
        created_by_expanded: opp.expand?.created_by
      })));

      return records.items;
    } catch (error: any) {
      console.error('Error fetching my opportunities:', error);
      if (error.response) {
        console.error('Error response:', error.response);
        console.error('Error data:', error.response.data);
      }
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
        filter: `created_by="${userId}"`,
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
