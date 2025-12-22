import { pb } from '../pocketbaseClient';

export const commissionService = {
  async calculateCommission(productId: string, product?: any) {
    try {
      if (!product) {
        product = await pb.collection('fintech_products').getOne(productId);
      }

      if (!product.commission_type || !product.commission_value) {
        return 0;
      }

      if (product.commission_type === 'Percentage') {
        return product.commission_value;
      } else if (product.commission_type === 'Fixed Amount') {
        return product.commission_value;
      } else if (product.commission_type === 'Recurring') {
        return product.commission_value;
      }

      return 0;
    } catch (error: any) {
      console.error('Error calculating commission:', error);
      return 0;
    }
  },

  async createTransaction(data: {
    enrollmentId: string;
    productId: string;
    businessId: string;
    userId: string;
    amount: number;
    commissionType: string;
    notes?: string;
  }) {
    try {
      const transactionDate = new Date().toISOString().split('T')[0];

      const mapCommissionType = (type: string): string => {
        const typeMap: Record<string, string> = {
          'Percentage': 'One-time',
          'Fixed Amount': 'One-time',
          'Recurring': 'Recurring',
          'One-time': 'One-time',
          'Monthly': 'Monthly',
          'Annual': 'Annual'
        };
        return typeMap[type] || 'One-time';
      };

      const validCommissionType = mapCommissionType(data.commissionType);

      const transactionData = {
        enrollment: data.enrollmentId,
        product: data.productId,
        business: data.businessId,
        user: data.userId,
        amount: data.amount,
        commission_type: validCommissionType,
        status: 'Pending',
        transaction_date: transactionDate,
        notes: data.notes || ''
      };

      console.log('Creating commission transaction with data:', transactionData);

      const transaction = await pb.collection('commission_transactions').create(transactionData);

      return transaction;
    } catch (error: any) {
      console.error('Error creating commission transaction:', error);
      console.error('Error details:', error.response || error.message);
      throw error;
    }
  },

  async getCommissions(filters?: {
    userId?: string;
    businessId?: string;
    productId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    try {
      const filterParts: string[] = [];

      if (filters?.userId) {
        filterParts.push(`user="${filters.userId}"`);
      }
      if (filters?.businessId) {
        filterParts.push(`business="${filters.businessId}"`);
      }
      if (filters?.productId) {
        filterParts.push(`product="${filters.productId}"`);
      }
      if (filters?.status) {
        filterParts.push(`status="${filters.status}"`);
      }
      if (filters?.startDate) {
        filterParts.push(`transaction_date >= "${filters.startDate}"`);
      }
      if (filters?.endDate) {
        filterParts.push(`transaction_date <= "${filters.endDate}"`);
      }

      const filterString = filterParts.length > 0 ? filterParts.join(' && ') : undefined;

      const records = await pb.collection('commission_transactions').getList(1, 100, {
        sort: '-transaction_date',
        filter: filterString,
        expand: 'product,business,user,enrollment'
      });

      return records.items;
    } catch (error: any) {
      console.error('Error fetching commissions:', error);
      return [];
    }
  },

  async getTotalEarnings(filters?: {
    userId?: string;
    businessId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    try {
      const commissions = await this.getCommissions(filters);

      const total = commissions.reduce((sum, commission) => {
        if (commission.status === 'Paid' || commission.status === 'Approved') {
          return sum + (commission.amount || 0);
        }
        return sum;
      }, 0);

      const pending = commissions.reduce((sum, commission) => {
        if (commission.status === 'Pending') {
          return sum + (commission.amount || 0);
        }
        return sum;
      }, 0);

      return {
        total,
        pending,
        count: commissions.length
      };
    } catch (error: any) {
      console.error('Error calculating total earnings:', error);
      return {
        total: 0,
        pending: 0,
        count: 0
      };
    }
  },

  async updateCommissionStatus(transactionId: string, status: string, paymentReference?: string) {
    try {
      const updateData: any = { status };

      if (status === 'Paid') {
        updateData.paid_date = new Date().toISOString().split('T')[0];
        if (paymentReference) {
          updateData.payment_reference = paymentReference;
        }
      }

      const record = await pb.collection('commission_transactions').update(transactionId, updateData);
      return record;
    } catch (error: any) {
      console.error('Error updating commission status:', error);
      throw error;
    }
  },

  async getCommissionsByProduct(productId: string) {
    try {
      const commissions = await this.getCommissions({ productId });

      const total = commissions.reduce((sum, c) => {
        if (c.status === 'Paid' || c.status === 'Approved') {
          return sum + (c.amount || 0);
        }
        return sum;
      }, 0);

      return {
        commissions,
        total,
        count: commissions.length
      };
    } catch (error: any) {
      console.error('Error fetching commissions by product:', error);
      return {
        commissions: [],
        total: 0,
        count: 0
      };
    }
  },

  async getCommissionsByBusiness(businessId: string) {
    try {
      const commissions = await this.getCommissions({ businessId });

      const total = commissions.reduce((sum, c) => {
        if (c.status === 'Paid' || c.status === 'Approved') {
          return sum + (c.amount || 0);
        }
        return sum;
      }, 0);

      return {
        commissions,
        total,
        count: commissions.length
      };
    } catch (error: any) {
      console.error('Error fetching commissions by business:', error);
      return {
        commissions: [],
        total: 0,
        count: 0
      };
    }
  }
};

