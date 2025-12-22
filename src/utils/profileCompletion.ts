import { pb } from "@/api/pocketbaseClient";

export interface ProfileCompletionData {
  user: any;
  business: any;
  portfolioCount?: number;
  badgesCount?: number;
  servicesCount?: number;
}

export function calculateProfileCompletion(data: ProfileCompletionData): {
  percentage: number;
  completed: number;
  total: number;
  missingFields: string[];
} {
  const { user, business, portfolioCount = 0, badgesCount = 0, servicesCount = 0 } = data;
  
  let completed = 0;
  const total = 20;
  const missingFields: string[] = [];

  if (!user && !business) {
    return { percentage: 0, completed: 0, total, missingFields: ["User profile", "Business profile"] };
  }

  if (user) {
    if (user.name || user.username) {
      completed += 1;
    } else {
      missingFields.push("Name");
    }

    if (user.email) {
      completed += 1;
    } else {
      missingFields.push("Email");
    }

    if (user.avatar) {
      completed += 1;
    } else {
      missingFields.push("Profile Photo");
    }
  } else {
    missingFields.push("User profile");
  }

  if (business) {
    if (business.business_name || business.name) {
      completed += 1;
    } else {
      missingFields.push("Business Name");
    }

    if (business.description) {
      completed += 1;
    } else {
      missingFields.push("Business Description");
    }

    if (business.logo) {
      completed += 1;
    } else {
      missingFields.push("Business Logo");
    }

    if (business.website || business.contact_info?.website) {
      completed += 1;
    } else {
      missingFields.push("Website");
    }

    if (business.location || business.contact_info?.location || business.city || business.state) {
      completed += 1;
    } else {
      missingFields.push("Location");
    }

    if (business.contact_info?.phone || business.phone) {
      completed += 1;
    } else {
      missingFields.push("Phone Number");
    }

    if (business.contact_info?.email || business.email) {
      completed += 1;
    } else {
      missingFields.push("Business Email");
    }

    if (business.industry) {
      completed += 1;
    } else {
      missingFields.push("Industry");
    }

    if (business.tagline) {
      completed += 1;
    } else {
      missingFields.push("Tagline");
    }

    if (portfolioCount > 0) {
      completed += 1;
    } else {
      missingFields.push("Portfolio Items");
    }

    if (badgesCount > 0) {
      completed += 1;
    } else {
      missingFields.push("Badges/Certifications");
    }

    if (servicesCount > 0) {
      completed += 1;
    } else {
      missingFields.push("Services");
    }

    if (business.is_verified) {
      completed += 1;
    } else {
      missingFields.push("Verification");
    }
  } else {
    missingFields.push("Business profile");
    missingFields.push("Business Name");
    missingFields.push("Business Description");
    missingFields.push("Business Logo");
    missingFields.push("Website");
    missingFields.push("Location");
    missingFields.push("Phone Number");
    missingFields.push("Business Email");
    missingFields.push("Industry");
    missingFields.push("Tagline");
    missingFields.push("Portfolio Items");
    missingFields.push("Badges/Certifications");
    missingFields.push("Services");
    missingFields.push("Verification");
  }

  const percentage = Math.round((completed / total) * 100);

  return {
    percentage,
    completed,
    total,
    missingFields: missingFields.slice(0, 5)
  };
}

export async function getProfileCompletionData(): Promise<ProfileCompletionData> {
  try {
    const user = pb.authStore.model;
    
    let business = null;
    let portfolioCount = 0;
    let badgesCount = 0;
    let servicesCount = 0;

    try {
      const { businessService } = await import("@/api/services/businessService");
      business = await businessService.getMyBusiness();
      
      if (business && business.id) {
        try {
          const { portfolioService } = await import("@/api/services/portfolioService");
          const portfolios = await portfolioService.getByBusiness(business.id);
          portfolioCount = Array.isArray(portfolios) ? portfolios.length : 0;
        } catch (e) {
          console.log("Portfolio service not available");
        }

        try {
          const { badgeService } = await import("@/api/services/badgeService");
          const badges = await badgeService.getByBusiness(business.id);
          badgesCount = Array.isArray(badges) ? badges.length : 0;
        } catch (e) {
          console.log("Badge service not available");
        }

        try {
          const { businessServicesService } = await import("@/api/services/businessServicesService");
          const services = await businessServicesService.getByBusiness(business.id);
          servicesCount = Array.isArray(services) ? services.length : 0;
        } catch (e) {
          console.log("Business services service not available");
        }
      }
    } catch (e) {
      console.log("Business service not available");
    }

    return {
      user,
      business,
      portfolioCount,
      badgesCount,
      servicesCount
    };
  } catch (error) {
    console.error("Error fetching profile completion data:", error);
    return {
      user: pb.authStore.model,
      business: null,
      portfolioCount: 0,
      badgesCount: 0,
      servicesCount: 0
    };
  }
}

