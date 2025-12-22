import { pb } from '../pocketbaseClient';
import { commissionService } from './commissionService';
import { fintechProductService } from './fintechProductService';

export const enrollmentService = {
  async createEnrollment(data: {
    productId: string;
    businessId: string;
    enrollmentMethod?: string;
    externalId?: string;
    notes?: string;
  }) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in to enroll in products');
      }

      const product = await fintechProductService.getById(data.productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const enrollmentDate = new Date().toISOString().split('T')[0];

      const enrollment = await pb.collection('product_enrollments').create({
        user: userId,
        business: data.businessId,
        product: data.productId,
        enrollment_date: enrollmentDate,
        status: 'Pending',
        enrollment_method: data.enrollmentMethod || 'Direct Link',
        external_id: data.externalId || '',
        commission_earned: 0,
        commission_status: 'Pending',
        notes: data.notes || ''
      });

      await fintechProductService.incrementEnrollments(data.productId);

      const commissionAmount = await commissionService.calculateCommission(
        data.productId,
        product
      );

      if (commissionAmount > 0) {
        await pb.collection('product_enrollments').update(enrollment.id, {
          commission_earned: commissionAmount
        });

        try {
          await commissionService.createTransaction({
            enrollmentId: enrollment.id,
            productId: data.productId,
            businessId: data.businessId,
            userId: userId,
            amount: commissionAmount,
            commissionType: product.commission_type || 'One-time'
          });
        } catch (commissionError: any) {
          console.error('Failed to create commission transaction (non-blocking):', commissionError);
          console.error('Enrollment will still be created, but commission tracking may be incomplete.');
        }
      }

      return enrollment;
    } catch (error: any) {
      console.error('Error creating enrollment:', error);
      throw error;
    }
  },

  async getUserEnrollments(userId?: string) {
    try {
      const currentUserId = userId || pb.authStore.model?.id;
      if (!currentUserId) {
        return [];
      }

      const records = await pb.collection('product_enrollments').getList(1, 100, {
        sort: '-enrollment_date',
        filter: `user="${currentUserId}"`,
        expand: 'product,business,product.created_by'
      });
      return records.items;
    } catch (error: any) {
      console.error('Error fetching user enrollments:', error);
      return [];
    }
  },

  async getBusinessEnrollments(businessId: string) {
    try {
      const records = await pb.collection('product_enrollments').getList(1, 100, {
        sort: '-enrollment_date',
        filter: `business="${businessId}"`,
        expand: 'product,user,product.created_by'
      });
      return records.items;
    } catch (error: any) {
      console.error('Error fetching business enrollments:', error);
      return [];
    }
  },

  async getEnrollmentById(enrollmentId: string) {
    try {
      const record = await pb.collection('product_enrollments').getOne(enrollmentId, {
        expand: 'product,business,user,product.created_by'
      });
      return record;
    } catch (error: any) {
      console.error('Error fetching enrollment:', error);
      throw error;
    }
  },

  async updateEnrollmentStatus(enrollmentId: string, status: string, notes?: string) {
    try {
      const updateData: any = { status };
      if (notes) {
        updateData.notes = notes;
      }

      if (status === 'Completed' || status === 'Active') {
        const enrollment = await this.getEnrollmentById(enrollmentId);
        if (enrollment.commission_status === 'Pending' && enrollment.commission_earned > 0) {
          updateData.commission_status = 'Paid';
          updateData.commission_paid_date = new Date().toISOString().split('T')[0];
        }
      }

      const record = await pb.collection('product_enrollments').update(enrollmentId, updateData);
      return record;
    } catch (error: any) {
      console.error('Error updating enrollment status:', error);
      throw error;
    }
  },

  async checkExistingEnrollment(productId: string, businessId: string) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        return null;
      }

      const records = await pb.collection('product_enrollments').getList(1, 1, {
        filter: `user="${userId}" && product="${productId}" && business="${businessId}" && status!="Cancelled"`,
        expand: 'product'
      });

      return records.items.length > 0 ? records.items[0] : null;
    } catch (error: any) {
      console.error('Error checking existing enrollment:', error);
      return null;
    }
  },

  async getEnrollmentUrl(productId: string, businessId: string) {
    try {
      const product = await fintechProductService.getById(productId);
      if (!product || !product.enrollment_url) {
        throw new Error('Product enrollment URL not found');
      }

      let url = product.enrollment_url;

      if (product.affiliate_id) {
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}ref=${product.affiliate_id}`;
      }

      if (product.integration_type === 'Link') {
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}business_id=${businessId}`;
      }

      return url;
    } catch (error: any) {
      console.error('Error getting enrollment URL:', error);
      throw error;
    }
  }
};

