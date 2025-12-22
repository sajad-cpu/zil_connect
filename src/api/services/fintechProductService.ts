import { pb } from '../pocketbaseClient';

export const fintechProductService = {
  async list(sortBy: string = '-created') {
    try {
      const records = await pb.collection('fintech_products').getList(1, 100, {
        sort: sortBy,
        filter: 'is_active=true',
        expand: 'created_by'
      });
      return records.items;
    } catch (error: any) {
      console.error('Error fetching fintech products:', error);
      return [];
    }
  },

  async filter(filters: Record<string, any>, sortBy: string = '-created', limit: number = 50) {
    try {
      const filterParts: string[] = ['is_active=true'];

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'boolean') {
            filterParts.push(`${key}=${value}`);
          } else if (Array.isArray(value)) {
            const arrayFilter = value.map(v => `${key}="${v}"`).join(' || ');
            filterParts.push(`(${arrayFilter})`);
          } else {
            filterParts.push(`${key}="${value}"`);
          }
        }
      });

      const filterString = filterParts.join(' && ');

      const records = await pb.collection('fintech_products').getList(1, limit, {
        sort: sortBy,
        filter: filterString,
        expand: 'created_by'
      });
      return records.items;
    } catch (error: any) {
      console.error('Error filtering fintech products:', error);
      return [];
    }
  },

  async getById(id: string) {
    try {
      const record = await pb.collection('fintech_products').getOne(id, {
        expand: 'created_by'
      });
      return record;
    } catch (error: any) {
      console.error('Error fetching fintech product:', error);
      throw error;
    }
  },

  async getByCategory(category: string, sortBy: string = '-created') {
    try {
      const records = await pb.collection('fintech_products').getList(1, 100, {
        sort: sortBy,
        filter: `category="${category}" && is_active=true`,
        expand: 'created_by'
      });
      return records.items;
    } catch (error: any) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },

  async getFeatured(limit: number = 8) {
    try {
      const records = await pb.collection('fintech_products').getList(1, limit, {
        sort: '-order,-enrollments',
        filter: 'is_featured=true && is_active=true',
        expand: 'created_by'
      });
      return records.items;
    } catch (error: any) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  },

  async search(query: string, page: number = 1, perPage: number = 20) {
    try {
      const records = await pb.collection('fintech_products').getList(page, perPage, {
        sort: '-created',
        filter: `(name ~ "${query}" || description ~ "${query}" || provider ~ "${query}") && is_active=true`,
        expand: 'created_by'
      });
      return {
        items: records.items,
        page: records.page,
        perPage: records.perPage,
        totalItems: records.totalItems,
        totalPages: records.totalPages
      };
    } catch (error: any) {
      console.error('Error searching fintech products:', error);
      return {
        items: [],
        page: 1,
        perPage: 20,
        totalItems: 0,
        totalPages: 0
      };
    }
  },

  async incrementViews(productId: string) {
    try {
      const product = await pb.collection('fintech_products').getOne(productId);
      const currentViews = product.views || 0;
      await pb.collection('fintech_products').update(productId, {
        views: currentViews + 1
      });
    } catch (error: any) {
      console.error('Error incrementing views:', error);
    }
  },

  async incrementEnrollments(productId: string) {
    try {
      const product = await pb.collection('fintech_products').getOne(productId);
      const currentEnrollments = product.enrollments || 0;
      await pb.collection('fintech_products').update(productId, {
        enrollments: currentEnrollments + 1
      });
    } catch (error: any) {
      console.error('Error incrementing enrollments:', error);
    }
  },

  async create(data: {
    name: string;
    description: string;
    category: string;
    provider?: string;
    pricing_type?: string;
    pricing_info?: string;
    enrollment_url: string;
    affiliate_id?: string;
    commission_type?: string;
    commission_value?: number;
    is_featured?: boolean;
    is_active?: boolean;
    tags?: string[];
    integration_type?: string;
    order?: number;
  }) {
    try {
      const userId = pb.authStore.model?.id;
      const record = await pb.collection('fintech_products').create({
        ...data,
        created_by: userId,
        views: 0,
        enrollments: 0,
        is_featured: data.is_featured || false,
        is_active: data.is_active !== undefined ? data.is_active : true,
        order: data.order || 0
      });
      return record;
    } catch (error: any) {
      console.error('Error creating fintech product:', error);
      throw error;
    }
  },

  async update(productId: string, data: Partial<{
    name: string;
    description: string;
    category: string;
    provider: string;
    pricing_type: string;
    pricing_info: string;
    enrollment_url: string;
    affiliate_id: string;
    commission_type: string;
    commission_value: number;
    is_featured: boolean;
    is_active: boolean;
    tags: string[];
    integration_type: string;
    order: number;
  }>) {
    try {
      const record = await pb.collection('fintech_products').update(productId, data);
      return record;
    } catch (error: any) {
      console.error('Error updating fintech product:', error);
      throw error;
    }
  },

  async delete(productId: string) {
    try {
      await pb.collection('fintech_products').delete(productId);
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting fintech product:', error);
      throw error;
    }
  }
};

