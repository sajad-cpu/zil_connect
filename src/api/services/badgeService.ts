import { pb } from '../pocketbaseClient';

export const badgeService = {
  /**
   * Create badge with files
   */
  async create(data: FormData) {
    try {
      const record = await pb.collection('business_badges').create(data);
      return record;
    } catch (error: any) {
      console.error('Error creating badge:', error);
      throw error;
    }
  },

  /**
   * Get badges for a business
   */
  async getByBusiness(businessId: string, verifiedOnly: boolean = false) {
    try {
      const filter = verifiedOnly
        ? `business="${businessId}" && is_verified=true`
        : `business="${businessId}"`;

      const records = await pb.collection('business_badges').getList(1, 50, {
        filter,
        sort: '-is_verified,order,-created',
        expand: 'business'
      });

      return records.items;
    } catch (error: any) {
      console.error('Error fetching badges:', error);
      return [];
    }
  },

  /**
   * Update badge
   */
  async update(id: string, data: FormData) {
    try {
      const record = await pb.collection('business_badges').update(id, data);
      return record;
    } catch (error: any) {
      console.error('Error updating badge:', error);
      throw error;
    }
  },

  /**
   * Delete badge
   */
  async delete(id: string) {
    try {
      await pb.collection('business_badges').delete(id);
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting badge:', error);
      throw error;
    }
  },

  /**
   * Get badge image URL
   */
  getBadgeImageUrl(badge: any): string {
    try {
      if (!badge.badge_image) return '';
      return pb.files.getUrl(badge, badge.badge_image);
    } catch (error: any) {
      console.error('Error getting badge image URL:', error);
      return '';
    }
  },

  /**
   * Get verification document URL (protected)
   */
  getVerificationDocUrl(badge: any): string {
    try {
      if (!badge.verification_document) return '';
      return pb.files.getUrl(badge, badge.verification_document);
    } catch (error: any) {
      console.error('Error getting verification document URL:', error);
      return '';
    }
  },

  /**
   * Check if badge is expired
   */
  isExpired(badge: any): boolean {
    if (badge.does_not_expire) return false;
    if (!badge.expiry_date) return false;

    const expiryDate = new Date(badge.expiry_date);
    const now = new Date();
    return expiryDate < now;
  },

  /**
   * Get active (non-expired, verified) badges
   */
  async getActiveBadges(businessId: string) {
    try {
      const allBadges = await this.getByBusiness(businessId, true);

      // Filter out expired badges
      return allBadges.filter((badge) => !this.isExpired(badge));
    } catch (error: any) {
      console.error('Error fetching active badges:', error);
      return [];
    }
  },

  /**
   * Update order
   */
  async updateOrder(badgeId: string, newOrder: number) {
    try {
      const record = await pb.collection('business_badges').update(badgeId, {
        order: newOrder
      });
      return record;
    } catch (error: any) {
      console.error('Error updating badge order:', error);
      throw error;
    }
  }
};
