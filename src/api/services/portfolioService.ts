import { pb } from '../pocketbaseClient';

export const portfolioService = {
  /**
   * Create portfolio item with images
   */
  async create(data: FormData) {
    try {
      const record = await pb.collection('portfolio_items').create(data);
      return record;
    } catch (error: any) {
      console.error('Error creating portfolio item:', error);
      throw error;
    }
  },

  /**
   * Get all portfolio items for a business
   */
  async getByBusiness(businessId: string, featuredOnly: boolean = false) {
    try {
      const filter = featuredOnly
        ? `business="${businessId}" && is_featured=true`
        : `business="${businessId}"`;

      const records = await pb.collection('portfolio_items').getList(1, 50, {
        filter,
        sort: '-is_featured,order,-created',
        expand: 'business'
      });

      return records.items;
    } catch (error: any) {
      console.error('Error fetching portfolio items:', error);
      return [];
    }
  },

  /**
   * Get single portfolio item by ID
   */
  async getById(id: string) {
    try {
      const record = await pb.collection('portfolio_items').getOne(id, {
        expand: 'business'
      });
      return record;
    } catch (error: any) {
      console.error('Error fetching portfolio item:', error);
      throw error;
    }
  },

  /**
   * Update portfolio item
   */
  async update(id: string, data: FormData) {
    try {
      const record = await pb.collection('portfolio_items').update(id, data);
      return record;
    } catch (error: any) {
      console.error('Error updating portfolio item:', error);
      throw error;
    }
  },

  /**
   * Delete portfolio item
   */
  async delete(id: string) {
    try {
      await pb.collection('portfolio_items').delete(id);
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting portfolio item:', error);
      throw error;
    }
  },

  /**
   * Set featured status
   */
  async setFeatured(itemId: string, isFeatured: boolean) {
    try {
      const record = await pb.collection('portfolio_items').update(itemId, {
        is_featured: isFeatured
      });
      return record;
    } catch (error: any) {
      console.error('Error setting featured status:', error);
      throw error;
    }
  },

  /**
   * Update order
   */
  async updateOrder(itemId: string, newOrder: number) {
    try {
      const record = await pb.collection('portfolio_items').update(itemId, {
        order: newOrder
      });
      return record;
    } catch (error: any) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  /**
   * Delete specific image from portfolio item
   */
  async deleteImage(itemId: string, imageFilename: string) {
    try {
      const formData = new FormData();
      formData.append('images-', imageFilename); // Note the minus sign
      const record = await pb.collection('portfolio_items').update(itemId, formData);
      return record;
    } catch (error: any) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  /**
   * Get image URL
   */
  getImageUrl(portfolioItem: any, filename: string, thumb?: string): string {
    try {
      if (thumb) {
        return pb.files.getUrl(portfolioItem, filename, { thumb });
      }
      return pb.files.getUrl(portfolioItem, filename);
    } catch (error: any) {
      console.error('Error getting image URL:', error);
      return '';
    }
  }
};
