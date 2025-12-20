import { pb } from '../pocketbaseClient';

export const offerClaimService = {
  /**
   * Create a new claim
   */
  async create(data: any) {
    try {
      const record = await pb.collection('offer_claims').create(data);
      return record;
    } catch (error: any) {
      console.error('Error creating claim:', error);
      throw error;
    }
  },

  /**
   * Get user's claims
   */
  async getUserClaims(userId: string) {
    try {
      const records = await pb.collection('offer_claims').getFullList({
        filter: `user = "${userId}"`,
        expand: 'offer,offer.business',
        sort: '-created'
      });
      return records;
    } catch (error: any) {
      console.error('Error fetching claims:', error);
      return [];
    }
  },

  /**
   * Get claims for an offer
   */
  async getOfferClaims(offerId: string) {
    try {
      const records = await pb.collection('offer_claims').getFullList({
        filter: `offer = "${offerId}"`,
        expand: 'user',
        sort: '-created'
      });
      return records;
    } catch (error: any) {
      console.error('Error fetching offer claims:', error);
      return [];
    }
  },

  /**
   * Mark claim as redeemed
   */
  async markRedeemed(claimId: string) {
    try {
      const record = await pb.collection('offer_claims').update(claimId, {
        status: 'redeemed',
        redeemed_at: new Date().toISOString()
      });
      return record;
    } catch (error: any) {
      console.error('Error marking claim as redeemed:', error);
      throw error;
    }
  },

  /**
   * Check if user has already claimed an offer
   */
  async hasUserClaimed(userId: string, offerId: string) {
    try {
      const records = await pb.collection('offer_claims').getList(1, 1, {
        filter: `user = "${userId}" && offer = "${offerId}"`
      });
      return records.items.length > 0;
    } catch (error: any) {
      console.error('Error checking claim:', error);
      return false;
    }
  },

  /**
   * Verify a coupon code
   */
  async verifyCoupon(code: string) {
    try {
      const claims = await pb.collection('offer_claims').getFullList({
        filter: `claim_code = "${code}"`,
        expand: 'offer,user'
      });

      if (claims.length === 0) {
        return { valid: false, message: "Invalid coupon code" };
      }

      const claim = claims[0];

      if (claim.status === 'redeemed') {
        return { valid: false, message: "Coupon already redeemed" };
      }

      if (new Date(claim.expires_at) < new Date()) {
        return { valid: false, message: "Coupon expired" };
      }

      return {
        valid: true,
        claim,
        offer: claim.expand?.offer,
        user: claim.expand?.user
      };
    } catch (error: any) {
      console.error('Error verifying coupon:', error);
      return { valid: false, message: "Error verifying coupon" };
    }
  }
};
