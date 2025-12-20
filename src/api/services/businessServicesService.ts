import { pb } from '../pocketbaseClient';

export const businessServicesService = {
  /**
   * Create a new service
   */
  async create(data: {
    business: string;
    title: string;
    description: string;
    category?: string;
    pricing_type?: string;
    price_range?: string;
    delivery_time?: string;
    is_active?: boolean;
    order?: number;
  }) {
    try {
      const record = await pb.collection('business_services').create(data);
      return record;
    } catch (error: any) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  /**
   * Get all services for a business
   */
  async getByBusiness(businessId: string, activeOnly: boolean = false) {
    try {
      const filter = activeOnly
        ? `business="${businessId}" && is_active=true`
        : `business="${businessId}"`;

      const records = await pb.collection('business_services').getList(1, 50, {
        filter,
        sort: 'order,-created',
        expand: 'business'
      });

      return records.items;
    } catch (error: any) {
      console.error('Error fetching services:', error);
      return [];
    }
  },

  /**
   * Update a service
   */
  async update(id: string, data: any) {
    try {
      const record = await pb.collection('business_services').update(id, data);
      return record;
    } catch (error: any) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  /**
   * Delete a service
   */
  async delete(id: string) {
    try {
      await pb.collection('business_services').delete(id);
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting service:', error);
      throw error;
    }
  },

  /**
   * Toggle active status
   */
  async toggleActive(serviceId: string, isActive: boolean) {
    try {
      const record = await pb.collection('business_services').update(serviceId, {
        is_active: isActive
      });
      return record;
    } catch (error: any) {
      console.error('Error toggling service status:', error);
      throw error;
    }
  },

  /**
   * Update service order
   */
  async updateOrder(serviceId: string, newOrder: number) {
    try {
      const record = await pb.collection('business_services').update(serviceId, {
        order: newOrder
      });
      return record;
    } catch (error: any) {
      console.error('Error updating service order:', error);
      throw error;
    }
  }
};
