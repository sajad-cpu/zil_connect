import { pb } from "../pocketbaseClient";

export const adminService = {
  async getAllUsers(page: number = 1, perPage: number = 50, filters: Record<string, any> = {}) {
    try {
      const filterParts: string[] = [];

      if (filters.search) {
        filterParts.push(`email~"${filters.search}" || name~"${filters.search}" || username~"${filters.search}"`);
      }

      const filterString = filterParts.length > 0 ? filterParts.join(" && ") : undefined;

      console.log("=== FETCHING ALL USERS ===");
      console.log("Page:", page, "PerPage:", perPage, "Filter:", filterString || "NONE");
      console.log("Auth token exists:", !!pb.authStore.token);
      console.log("Current user ID:", pb.authStore.model?.id);

      try {
        const records = await pb.collection("users").getList(page, perPage, {
          sort: "-created",
          filter: filterString,
        });

        console.log("=== API RESPONSE ===");
        console.log("Total items in database:", records.totalItems);
        console.log("Items returned:", records.items.length);
        console.log("Page info:", { page: records.page, perPage: records.perPage, totalPages: records.totalPages });
        console.log("All users:", records.items.map(u => ({
          id: u.id,
          email: u.email,
          name: u.name || u.username,
          verified: u.verified
        })));

        if (records.totalItems > records.items.length) {
          console.warn(`⚠️ WARNING: Database has ${records.totalItems} users but only ${records.items.length} returned!`);
          console.warn("This is likely due to PocketBase API rules restricting access.");
        }

        if (records.totalItems === 1 && records.items.length === 1) {
          console.warn("⚠️ Only 1 user found. This might be correct if you only have 1 user, OR API rules are blocking others.");
        }

        return records;
      } catch (apiError: any) {
        console.error("=== API ERROR ===");
        console.error("Error message:", apiError.message);
        console.error("Error status:", apiError.status);
        console.error("Error response:", apiError.response);
        if (apiError.response?.data) {
          console.error("Error data:", apiError.response.data);
        }
        throw apiError;
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      console.error("Error details:", error.response || error.message);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
      throw error;
    }
  },

  async updateUser(userId: string, data: Record<string, any>) {
    try {
      const record = await pb.collection("users").update(userId, data);
      return record;
    } catch (error: any) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  async deleteUser(userId: string) {
    try {
      await pb.collection("users").delete(userId);
      return true;
    } catch (error: any) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  async getAllBusinesses(page: number = 1, perPage: number = 50, filters: Record<string, any> = {}) {
    try {
      const filterString = Object.entries(filters)
        .map(([key, value]) => {
          if (value === null || value === undefined || value === "") return null;
          if (typeof value === "boolean") {
            return `${key}=${value}`;
          }
          if (key === "search") {
            return `name~"${value}" || description~"${value}"`;
          }
          return `${key}="${value}"`;
        })
        .filter(Boolean)
        .join(" && ");

      const records = await pb.collection("businesses").getList(page, perPage, {
        sort: "-created",
        filter: filterString || undefined,
        expand: "owner",
      });
      return records;
    } catch (error: any) {
      console.error("Error fetching businesses:", error);
      throw error;
    }
  },

  async verifyBusiness(businessId: string, verified: boolean = true) {
    try {
      const record = await pb.collection("businesses").update(businessId, { verified });
      return record;
    } catch (error: any) {
      console.error("Error verifying business:", error);
      throw error;
    }
  },

  async updateBusiness(businessId: string, data: Record<string, any>) {
    try {
      const record = await pb.collection("businesses").update(businessId, data);
      return record;
    } catch (error: any) {
      console.error("Error updating business:", error);
      throw error;
    }
  },

  async deleteBusiness(businessId: string) {
    try {
      await pb.collection("businesses").delete(businessId);
      return true;
    } catch (error: any) {
      console.error("Error deleting business:", error);
      throw error;
    }
  },

  async getAllOpportunities(page: number = 1, perPage: number = 50, filters: Record<string, any> = {}) {
    try {
      const filterString = Object.entries(filters)
        .map(([key, value]) => {
          if (value === null || value === undefined || value === "") return null;
          if (typeof value === "boolean") {
            return `${key}=${value}`;
          }
          if (key === "search") {
            return `title~"${value}" || description~"${value}"`;
          }
          return `${key}="${value}"`;
        })
        .filter(Boolean)
        .join(" && ");

      const records = await pb.collection("opportunities").getList(page, perPage, {
        sort: "-created",
        filter: filterString || undefined,
        expand: "created_by,business",
      });
      return records;
    } catch (error: any) {
      console.error("Error fetching opportunities:", error);
      throw error;
    }
  },

  async moderateOpportunity(opportunityId: string, action: "approve" | "reject" | "delete") {
    try {
      if (action === "delete") {
        await pb.collection("opportunities").delete(opportunityId);
        return true;
      }
      const status = action === "approve" ? "active" : "rejected";
      const record = await pb.collection("opportunities").update(opportunityId, { status });
      return record;
    } catch (error: any) {
      console.error("Error moderating opportunity:", error);
      throw error;
    }
  },

  async getAllOffers(page: number = 1, perPage: number = 50, filters: Record<string, any> = {}) {
    try {
      const filterString = Object.entries(filters)
        .map(([key, value]) => {
          if (value === null || value === undefined || value === "") return null;
          if (typeof value === "boolean") {
            return `${key}=${value}`;
          }
          if (key === "search") {
            return `title~"${value}" || description~"${value}"`;
          }
          return `${key}="${value}"`;
        })
        .filter(Boolean)
        .join(" && ");

      const records = await pb.collection("offers").getList(page, perPage, {
        sort: "-created",
        filter: filterString || undefined,
        expand: "created_by,business",
      });
      return records;
    } catch (error: any) {
      console.error("Error fetching offers:", error);
      throw error;
    }
  },

  async moderateOffer(offerId: string, action: "approve" | "reject" | "delete") {
    try {
      if (action === "delete") {
        await pb.collection("offers").delete(offerId);
        return true;
      }
      const status = action === "approve" ? "active" : "rejected";
      const record = await pb.collection("offers").update(offerId, { status });
      return record;
    } catch (error: any) {
      console.error("Error moderating offer:", error);
      throw error;
    }
  },

  async getAllMessages(page: number = 1, perPage: number = 50, filters: Record<string, any> = {}) {
    try {
      const filterString = Object.entries(filters)
        .map(([key, value]) => {
          if (value === null || value === undefined || value === "") return null;
          if (typeof value === "boolean") {
            return `${key}=${value}`;
          }
          if (key === "search") {
            return `content~"${value}"`;
          }
          return `${key}="${value}"`;
        })
        .filter(Boolean)
        .join(" && ");

      const records = await pb.collection("messages").getList(page, perPage, {
        sort: "-created",
        filter: filterString || undefined,
        expand: "from,to,connection",
      });
      return records;
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  async deleteMessage(messageId: string) {
    try {
      await pb.collection("messages").delete(messageId);
      return true;
    } catch (error: any) {
      console.error("Error deleting message:", error);
      throw error;
    }
  },

  async getAllFintechProducts(page: number = 1, perPage: number = 50, filters: Record<string, any> = {}) {
    try {
      const filterString = Object.entries(filters)
        .map(([key, value]) => {
          if (value === null || value === undefined || value === "") return null;
          if (typeof value === "boolean") {
            return `${key}=${value}`;
          }
          if (key === "search") {
            return `name~"${value}" || description~"${value}"`;
          }
          return `${key}="${value}"`;
        })
        .filter(Boolean)
        .join(" && ");

      const records = await pb.collection("fintech_products").getList(page, perPage, {
        sort: "-created",
        filter: filterString || undefined,
      });
      return records;
    } catch (error: any) {
      console.error("Error fetching fintech products:", error);
      throw error;
    }
  },

  async createFintechProduct(data: Record<string, any>) {
    try {
      const record = await pb.collection("fintech_products").create(data);
      return record;
    } catch (error: any) {
      console.error("Error creating fintech product:", error);
      throw error;
    }
  },

  async updateFintechProduct(productId: string, data: Record<string, any>) {
    try {
      const record = await pb.collection("fintech_products").update(productId, data);
      return record;
    } catch (error: any) {
      console.error("Error updating fintech product:", error);
      throw error;
    }
  },

  async deleteFintechProduct(productId: string) {
    try {
      await pb.collection("fintech_products").delete(productId);
      return true;
    } catch (error: any) {
      console.error("Error deleting fintech product:", error);
      throw error;
    }
  },

  async getAllEnrollments(page: number = 1, perPage: number = 50, filters: Record<string, any> = {}) {
    try {
      const filterString = Object.entries(filters)
        .map(([key, value]) => {
          if (value === null || value === undefined || value === "") return null;
          if (typeof value === "boolean") {
            return `${key}=${value}`;
          }
          if (key === "search") {
            return `status~"${value}"`;
          }
          return `${key}="${value}"`;
        })
        .filter(Boolean)
        .join(" && ");

      const records = await pb.collection("product_enrollments").getList(page, perPage, {
        sort: "-created",
        filter: filterString || undefined,
        expand: "product,user,business",
      });
      return records;
    } catch (error: any) {
      console.error("Error fetching enrollments:", error);
      throw error;
    }
  },

  async updateEnrollment(enrollmentId: string, data: Record<string, any>) {
    try {
      const record = await pb.collection("product_enrollments").update(enrollmentId, data);
      return record;
    } catch (error: any) {
      console.error("Error updating enrollment:", error);
      throw error;
    }
  },

  async getAllCommissions(page: number = 1, perPage: number = 50, filters: Record<string, any> = {}) {
    try {
      const filterString = Object.entries(filters)
        .map(([key, value]) => {
          if (value === null || value === undefined || value === "") return null;
          if (typeof value === "boolean") {
            return `${key}=${value}`;
          }
          if (key === "search") {
            return `status~"${value}"`;
          }
          return `${key}="${value}"`;
        })
        .filter(Boolean)
        .join(" && ");

      const records = await pb.collection("commission_transactions").getList(page, perPage, {
        sort: "-created",
        filter: filterString || undefined,
        expand: "enrollment,user,business",
      });
      return records;
    } catch (error: any) {
      console.error("Error fetching commissions:", error);
      throw error;
    }
  },

  async updateCommission(commissionId: string, data: Record<string, any>) {
    try {
      const record = await pb.collection("commission_transactions").update(commissionId, data);
      return record;
    } catch (error: any) {
      console.error("Error updating commission:", error);
      throw error;
    }
  },

  async getPlatformStats() {
    try {
      const [users, businesses, opportunities, offers, enrollments, commissions] = await Promise.all([
        pb.collection("users").getList(1, 1, { $autoCancel: false }),
        pb.collection("businesses").getList(1, 1, { $autoCancel: false }),
        pb.collection("opportunities").getList(1, 1, { $autoCancel: false }),
        pb.collection("offers").getList(1, 1, { $autoCancel: false }),
        pb.collection("product_enrollments").getList(1, 1, { $autoCancel: false }),
        pb.collection("commission_transactions").getList(1, 1, { $autoCancel: false }),
      ]);

      const totalCommissions = await pb.collection("commission_transactions").getList(1, 1, {
        filter: 'status="paid"',
        $autoCancel: false,
      });

      return {
        totalUsers: users.totalItems,
        totalBusinesses: businesses.totalItems,
        totalOpportunities: opportunities.totalItems,
        totalOffers: offers.totalItems,
        totalEnrollments: enrollments.totalItems,
        totalCommissions: commissions.totalItems,
        paidCommissions: totalCommissions.totalItems,
      };
    } catch (error: any) {
      console.error("Error fetching platform stats:", error);
      throw error;
    }
  },

  async getRecentActivity(limit: number = 10) {
    try {
      const [recentUsers, recentBusinesses, recentOpportunities, recentOffers, recentEnrollments, recentCommissions] = await Promise.all([
        pb.collection("users").getList(1, limit, {
          sort: "-created",
          $autoCancel: false,
        }),
        pb.collection("businesses").getList(1, limit, {
          sort: "-created",
          $autoCancel: false,
        }),
        pb.collection("opportunities").getList(1, limit, {
          sort: "-created",
          expand: "created_by,business",
          $autoCancel: false,
        }),
        pb.collection("offers").getList(1, limit, {
          sort: "-created",
          expand: "created_by,business",
          $autoCancel: false,
        }),
        pb.collection("product_enrollments").getList(1, limit, {
          sort: "-created",
          expand: "user,product",
          $autoCancel: false,
        }),
        pb.collection("commission_transactions").getList(1, limit, {
          sort: "-created",
          expand: "enrollment,enrollment.product",
          $autoCancel: false,
        }),
      ]);

      const activities: Array<{
        type: string;
        title: string;
        description: string;
        timestamp: string;
        icon: string;
      }> = [];

      recentUsers.items.forEach((user: any) => {
        activities.push({
          type: "user",
          title: "New User Registered",
          description: `${user.name || user.email || user.username} joined the platform`,
          timestamp: user.created,
          icon: "Users",
        });
      });

      recentBusinesses.items.forEach((business: any) => {
        activities.push({
          type: "business",
          title: "New Business Created",
          description: `${business.name || "Unnamed Business"} was added`,
          timestamp: business.created,
          icon: "Building2",
        });
      });

      recentOpportunities.items.forEach((opp: any) => {
        const businessName = typeof opp.expand?.business === "object" ? opp.expand.business.name : "Unknown Business";
        activities.push({
          type: "opportunity",
          title: "New Opportunity Posted",
          description: `${opp.title || "Untitled"} by ${businessName}`,
          timestamp: opp.created,
          icon: "Briefcase",
        });
      });

      recentOffers.items.forEach((offer: any) => {
        const businessName = typeof offer.expand?.business === "object" ? offer.expand.business.name : "Unknown Business";
        activities.push({
          type: "offer",
          title: "New Offer Created",
          description: `${offer.title || "Untitled"} by ${businessName}`,
          timestamp: offer.created,
          icon: "Tag",
        });
      });

      recentEnrollments.items.forEach((enrollment: any) => {
        const userName = typeof enrollment.expand?.user === "object" 
          ? (enrollment.expand.user.name || enrollment.expand.user.email)
          : "Unknown User";
        const productName = typeof enrollment.expand?.product === "object"
          ? enrollment.expand.product.name
          : "Unknown Product";
        activities.push({
          type: "enrollment",
          title: "Product Enrollment",
          description: `${userName} enrolled in ${productName}`,
          timestamp: enrollment.created,
          icon: "TrendingUp",
        });
      });

      recentCommissions.items.forEach((commission: any) => {
        const productName = typeof commission.expand?.enrollment?.product === "object"
          ? commission.expand.enrollment.product.name
          : "Unknown Product";
        activities.push({
          type: "commission",
          title: "Commission Transaction",
          description: `$${commission.amount || 0} from ${productName}`,
          timestamp: commission.created,
          icon: "DollarSign",
        });
      });

      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return activities.slice(0, limit);
    } catch (error: any) {
      console.error("Error fetching recent activity:", error);
      throw error;
    }
  },
};

