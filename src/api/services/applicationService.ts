import { pb } from '../pocketbaseClient';

export const applicationService = {
  /**
   * Check if user already applied to an opportunity
   */
  async hasApplied(opportunityId: string): Promise<boolean> {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return false;

      const records = await pb.collection('opportunity_applications').getList(1, 1, {
        filter: `opportunity="${opportunityId}" && applicant="${userId}"`
      });

      return records.items.length > 0;
    } catch (error: any) {
      console.error('Error checking application status:', error);
      return false;
    }
  },

  /**
   * Submit new application
   */
  async apply(data: any) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('You must be logged in to apply');
      }

      console.log('Applying to opportunity:', data.opportunity);

      // Check if already applied
      const hasApplied = await this.hasApplied(data.opportunity);
      if (hasApplied) {
        throw new Error('You have already applied to this opportunity');
      }

      // Get opportunity to validate
      let opportunity;
      try {
        opportunity = await pb.collection('opportunities').getOne(data.opportunity);
        console.log('Opportunity found:', opportunity.id, opportunity.title);
      } catch (error: any) {
        console.error('Failed to fetch opportunity:', error);
        throw new Error('Opportunity not found. It may have been deleted.');
      }

      // Prevent self-application
      if (opportunity.user === userId) {
        throw new Error('Cannot apply to your own opportunity');
      }

      // Check if opportunity is open
      if (opportunity.status !== 'Open') {
        throw new Error('This opportunity is no longer accepting applications');
      }

      // Create application
      const application = await pb.collection('opportunity_applications').create({
        ...data,
        applicant: userId,
        status: 'Pending'
      });

      console.log('Application created:', application.id);

      // Increment application count - with error handling
      try {
        await pb.collection('opportunities').update(opportunity.id, {
          application_count: (opportunity.application_count || 0) + 1
        });
        console.log('Application count incremented for opportunity:', opportunity.id);
      } catch (updateError: any) {
        console.error('Failed to update application count:', updateError);
        // Don't throw error here - application was already created successfully
      }

      return application;
    } catch (error: any) {
      console.error('Error submitting application:', error);
      throw error;
    }
  },

  /**
   * Get user's own applications
   */
  async getMyApplications(sortBy: string = '-created') {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return [];

      const records = await pb.collection('opportunity_applications').getList(1, 50, {
        sort: sortBy,
        filter: `applicant="${userId}"`,
        expand: 'opportunity,opportunity.user'
      });

      return records.items;
    } catch (error: any) {
      console.error('Error fetching my applications:', error);
      return [];
    }
  },

  /**
   * Get applications to user's opportunities
   */
  async getApplicationsToMyOpportunities(opportunityId?: string) {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return [];

      let filter = `opportunity.user="${userId}"`;
      if (opportunityId) {
        filter = `opportunity="${opportunityId}" && ${filter}`;
      }

      const records = await pb.collection('opportunity_applications').getList(1, 100, {
        sort: '-created',
        filter: filter,
        expand: 'opportunity,applicant'
      });

      return records.items;
    } catch (error: any) {
      console.error('Error fetching applications to my opportunities:', error);
      return [];
    }
  },

  /**
   * Update application status (for opportunity owners)
   */
  async updateStatus(applicationId: string, status: string, notes?: string) {
    try {
      const updateData: any = { status };
      if (notes !== undefined) {
        updateData.notes = notes;
      }

      const record = await pb.collection('opportunity_applications').update(applicationId, updateData);
      return record;
    } catch (error: any) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  /**
   * Delete application (withdraw)
   */
  async withdraw(applicationId: string) {
    try {
      await pb.collection('opportunity_applications').delete(applicationId);
      return { success: true };
    } catch (error: any) {
      console.error('Error withdrawing application:', error);
      throw error;
    }
  },

  /**
   * Get single application details
   */
  async getById(applicationId: string) {
    try {
      const record = await pb.collection('opportunity_applications').getOne(applicationId, {
        expand: 'opportunity,applicant,opportunity.user'
      });
      return record;
    } catch (error: any) {
      console.error('Error fetching application:', error);
      throw error;
    }
  }
};
