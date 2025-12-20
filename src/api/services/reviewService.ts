import { pb } from '../pocketbaseClient';

export const reviewService = {
  /**
   * Create a review
   */
  async create(data: {
    business: string;
    rating: number;
    review_text: string;
    title?: string;
    collaboration_type?: string;
    project_duration?: string;
    would_recommend?: boolean;
  }) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in to write a review');
      }

      // Check if user already reviewed this business
      const existingReviews = await pb.collection('business_reviews').getList(1, 1, {
        filter: `business="${data.business}" && reviewer="${userId}"`
      });

      if (existingReviews.items.length > 0) {
        throw new Error('You have already reviewed this business');
      }

      const record = await pb.collection('business_reviews').create({
        ...data,
        reviewer: userId,
        status: 'active'
      });

      return record;
    } catch (error: any) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  /**
   * Get reviews for a business
   */
  async getByBusiness(businessId: string, status: string = 'active') {
    try {
      const records = await pb.collection('business_reviews').getList(1, 100, {
        filter: `business="${businessId}" && status="${status}"`,
        sort: '-is_featured,-created',
        expand: 'reviewer,reviewer_business'
      });

      return records.items;
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  /**
   * Get current user's reviews
   */
  async getMyReviews() {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        return [];
      }

      const records = await pb.collection('business_reviews').getList(1, 100, {
        filter: `reviewer="${userId}"`,
        sort: '-created',
        expand: 'business'
      });

      return records.items;
    } catch (error: any) {
      console.error('Error fetching my reviews:', error);
      return [];
    }
  },

  /**
   * Update review (within 24 hours)
   */
  async update(reviewId: string, data: any) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in');
      }

      // Get the review to check ownership and creation time
      const review = await pb.collection('business_reviews').getOne(reviewId);

      if (review.reviewer !== userId) {
        throw new Error('You can only edit your own reviews');
      }

      // Check if within 24 hours
      const createdAt = new Date(review.created);
      const now = new Date();
      const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        throw new Error('Reviews can only be edited within 24 hours of creation');
      }

      const record = await pb.collection('business_reviews').update(reviewId, data);
      return record;
    } catch (error: any) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  /**
   * Delete review
   */
  async delete(reviewId: string) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in');
      }

      // Verify ownership
      const review = await pb.collection('business_reviews').getOne(reviewId);
      if (review.reviewer !== userId) {
        throw new Error('You can only delete your own reviews');
      }

      await pb.collection('business_reviews').delete(reviewId);
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  /**
   * Add business owner response
   */
  async addResponse(reviewId: string, response: string) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in');
      }

      // Get the review to check if user owns the business
      const review = await pb.collection('business_reviews').getOne(reviewId, {
        expand: 'business'
      });

      const business = review.expand?.business;
      if (!business || business.owner !== userId) {
        throw new Error('Only the business owner can respond to reviews');
      }

      const record = await pb.collection('business_reviews').update(reviewId, {
        response,
        response_date: new Date().toISOString()
      });

      return record;
    } catch (error: any) {
      console.error('Error adding response:', error);
      throw error;
    }
  },

  /**
   * Get average rating for a business
   */
  async getAverageRating(businessId: string): Promise<number> {
    try {
      const records = await pb.collection('business_reviews').getList(1, 500, {
        filter: `business="${businessId}" && status="active"`,
        fields: 'rating'
      });

      if (records.items.length === 0) {
        return 0;
      }

      const sum = records.items.reduce((acc, item) => acc + item.rating, 0);
      return Math.round((sum / records.items.length) * 10) / 10; // Round to 1 decimal
    } catch (error: any) {
      console.error('Error calculating average rating:', error);
      return 0;
    }
  },

  /**
   * Get rating breakdown
   */
  async getRatingBreakdown(businessId: string): Promise<Record<number, number>> {
    try {
      const records = await pb.collection('business_reviews').getList(1, 500, {
        filter: `business="${businessId}" && status="active"`,
        fields: 'rating'
      });

      const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      records.items.forEach((item) => {
        breakdown[item.rating as keyof typeof breakdown]++;
      });

      return breakdown;
    } catch (error: any) {
      console.error('Error getting rating breakdown:', error);
      return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    }
  },

  /**
   * Check if user can review a business
   */
  async canUserReview(businessId: string): Promise<{ canReview: boolean; reason?: string }> {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        return { canReview: false, reason: 'You must be logged in to write a review' };
      }

      // Check if user owns the business
      const business = await pb.collection('businesses').getOne(businessId);
      if (business.owner === userId) {
        return { canReview: false, reason: 'You cannot review your own business' };
      }

      // Check if already reviewed
      const existingReviews = await pb.collection('business_reviews').getList(1, 1, {
        filter: `business="${businessId}" && reviewer="${userId}"`
      });

      if (existingReviews.items.length > 0) {
        return { canReview: false, reason: 'You have already reviewed this business' };
      }

      return { canReview: true };
    } catch (error: any) {
      console.error('Error checking review permission:', error);
      return { canReview: false, reason: 'Unable to verify review permission' };
    }
  }
};
