# Offers Feature Setup Guide

Complete guide to set up and use the offers/coupon code feature in your business connection app.

---

## Overview

The offers feature allows businesses to:
- ✅ Create discount offers with coupon codes
- ✅ Set discount percentages and expiration dates
- ✅ Feature offers in a carousel
- ✅ Track how many users claimed/viewed the offer
- ✅ Generate unique coupon codes when users claim offers
- ✅ See analytics on offer redemptions

---

## Database Collections Setup

You need **2 collections** for the offers feature:

### 1. `offers` Collection
Stores the offers created by businesses.

### 2. `offer_claims` Collection
Tracks when users claim offers and their unique coupon codes.

**See [SETUP_COLLECTIONS_STEP_BY_STEP.md](SETUP_COLLECTIONS_STEP_BY_STEP.md) for detailed field setup.**

---

## How the Offers Feature Works

### For Business Owners (Creating Offers)

1. **Create an Offer Page** (needs to be built):
   - Form to create new offers
   - Fields: title, description, discount_percentage, valid_until, terms
   - Option to mark as "featured"
   - Linked to the business owner's business

### For Users (Claiming Offers)

1. **Browse Offers** - Already implemented in [src/pages/Offers.tsx](src/pages/Offers.tsx)
   - Featured offers appear in carousel
   - All offers shown in grid layout
   - Shows discount percentage, business name, expiration date

2. **Claim Offer** - Implemented in [src/components/OfferClaimModal.tsx](src/components/OfferClaimModal.tsx)
   - User clicks "Claim Offer"
   - Modal shows success animation
   - Generates unique coupon code (e.g., ZIL8X2K9)
   - User can copy the code
   - Code expires in 30 days

3. **Track Claims** (needs to be implemented):
   - Save claim to `offer_claims` collection
   - Increment `redemptions` count in offers
   - Store claim_code, expires_at, user, offer

---

## Implementation Steps

### Step 1: Create Missing Pages/Components

You need to create these pages:

#### A. **Create Offer Page** (`src/pages/CreateOffer.tsx`)

Allow business owners to create new offers:

```typescript
import { pb } from '@/api/pocketbaseClient';

const handleCreateOffer = async (formData) => {
  try {
    // Get user's business
    const businesses = await pb.collection('businesses').getFullList({
      filter: `owner = "${pb.authStore.model.id}"`
    });

    if (businesses.length === 0) {
      alert("You need to create a business first!");
      return;
    }

    const business = businesses[0];

    // Create the offer
    const offer = await pb.collection('offers').create({
      title: formData.title,
      description: formData.description,
      business: business.id,
      business_name: business.business_name, // or business.name
      discount_percentage: formData.discount_percentage,
      valid_until: formData.valid_until,
      is_featured: formData.is_featured || false,
      terms: formData.terms,
      redemptions: 0,
      created_by: pb.authStore.model.id
    });

    console.log("Offer created!", offer);
  } catch (error) {
    console.error("Error creating offer:", error);
  }
};
```

#### B. **My Offers Page** (`src/pages/MyOffers.tsx`)

Show business owner's offers with analytics:

```typescript
import { offerService } from '@/api/services/offerService';
import { pb } from '@/api/pocketbaseClient';
import { useQuery } from '@tanstack/react-query';

const MyOffers = () => {
  // Get current user's offers
  const { data: myOffers = [] } = useQuery({
    queryKey: ['my-offers'],
    queryFn: async () => {
      const userId = pb.authStore.model?.id;
      return await offerService.filter({ created_by: userId });
    }
  });

  // For each offer, show:
  // - Title, description, discount
  // - Views count (redemptions field)
  // - Claims count (count from offer_claims)
  // - Active/Expired status
  // - Edit/Delete buttons

  return (
    <div>
      {myOffers.map(offer => (
        <div key={offer.id}>
          <h3>{offer.title}</h3>
          <p>{offer.discount_percentage}% OFF</p>
          <p>Claimed: {offer.redemptions} times</p>
          {/* Add more analytics */}
        </div>
      ))}
    </div>
  );
};
```

#### C. **My Claimed Offers Page** (`src/pages/MyClaimedOffers.tsx`)

Show user's claimed offers with their coupon codes:

```typescript
import { pb } from '@/api/pocketbaseClient';
import { useQuery } from '@tanstack/react-query';

const MyClaimedOffers = () => {
  const { data: claimedOffers = [] } = useQuery({
    queryKey: ['my-claimed-offers'],
    queryFn: async () => {
      const userId = pb.authStore.model?.id;
      return await pb.collection('offer_claims').getFullList({
        filter: `user = "${userId}"`,
        expand: 'offer,offer.business',
        sort: '-created'
      });
    }
  });

  return (
    <div>
      {claimedOffers.map(claim => (
        <div key={claim.id}>
          <h3>{claim.expand?.offer?.title}</h3>
          <p>Coupon Code: {claim.claim_code}</p>
          <p>Expires: {new Date(claim.expires_at).toLocaleDateString()}</p>
          <p>Status: {claim.status}</p>
          <button onClick={() => copyCode(claim.claim_code)}>Copy Code</button>
        </div>
      ))}
    </div>
  );
};
```

### Step 2: Update OfferClaimModal to Save Claims

Update [src/components/OfferClaimModal.tsx](src/components/OfferClaimModal.tsx) to actually save the claim:

```typescript
import { pb } from '@/api/pocketbaseClient';

const handleClaimOffer = async (offer) => {
  try {
    // Generate unique coupon code
    const claimCode = `ZIL${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Set expiration (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create offer claim
    await pb.collection('offer_claims').create({
      offer: offer.id,
      user: pb.authStore.model.id,
      claim_code: claimCode,
      status: 'claimed',
      expires_at: expiresAt.toISOString()
    });

    // Increment redemptions count
    await pb.collection('offers').update(offer.id, {
      redemptions: (offer.redemptions || 0) + 1
    });

    // Show success modal with code
    setClaimModalOpen(true);
    setSelectedOffer({ ...offer, claimCode });

  } catch (error) {
    console.error("Error claiming offer:", error);
    alert("Failed to claim offer. You may have already claimed it.");
  }
};
```

### Step 3: Add Navigation Links

Update your navigation to include:
- "Create Offer" (for business owners)
- "My Offers" (for business owners)
- "My Claimed Offers" (for all users)

---

## Analytics & Tracking

### Track Views
Add a view counter when users open the Offers page:

```typescript
useEffect(() => {
  // Track page view
  const trackView = async () => {
    // Optionally increment a views counter
  };
  trackView();
}, []);
```

### Track Claims
Already handled when user claims an offer - saves to `offer_claims` collection.

### Track Redemptions
When a business owner marks a coupon as "redeemed":

```typescript
const markAsRedeemed = async (claimId) => {
  await pb.collection('offer_claims').update(claimId, {
    status: 'redeemed',
    redeemed_at: new Date().toISOString()
  });
};
```

### Analytics Dashboard

Show business owners:
- Total offers created
- Total claims
- Total redemptions
- Most popular offers
- Conversion rate (claims / views)

---

## API Service

You already have [src/api/services/offerService.ts](src/api/services/offerService.ts) set up. Add a service for claims:

**Create `src/api/services/offerClaimService.ts`:**

```typescript
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
  }
};
```

---

## Security & Business Logic

### Prevent Duplicate Claims

Before allowing a user to claim:

```typescript
const alreadyClaimed = await offerClaimService.hasUserClaimed(
  pb.authStore.model.id,
  offer.id
);

if (alreadyClaimed) {
  alert("You've already claimed this offer!");
  return;
}
```

### Check Expiration

```typescript
const isExpired = (offer) => {
  if (!offer.valid_until) return false;
  return new Date(offer.valid_until) < new Date();
};

if (isExpired(offer)) {
  alert("This offer has expired!");
  return;
}
```

### Verify Coupon Code

When a business owner wants to verify a customer's coupon:

```typescript
const verifyCoupon = async (code) => {
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
    offer: claim.expand.offer,
    user: claim.expand.user
  };
};
```

---

## UI/UX Improvements

### Add to Existing Offers Page

Update [src/pages/Offers.tsx](src/pages/Offers.tsx):

1. **Check if already claimed** - Show "Claimed" badge instead of "Claim" button
2. **Show expiration warning** - Highlight offers expiring soon
3. **Filter by category** - Add dropdown for industry/category
4. **Search functionality** - Search by business name or offer title

### Mobile Optimization

Ensure the coupon code is:
- Easy to copy on mobile
- Large and readable
- Can be screenshot easily

---

## Testing Checklist

- [ ] Business owner can create an offer
- [ ] Offer appears on Offers page
- [ ] Featured offers show in carousel
- [ ] User can claim an offer
- [ ] Unique coupon code is generated
- [ ] User cannot claim same offer twice
- [ ] Redemptions counter increments
- [ ] User can view their claimed offers
- [ ] Business owner can see offer analytics
- [ ] Expired offers are marked/hidden
- [ ] Coupon code can be copied easily

---

## Next Steps

1. **Create the missing pages**:
   - [ ] CreateOffer.tsx
   - [ ] MyOffers.tsx
   - [ ] MyClaimedOffers.tsx

2. **Update existing components**:
   - [ ] Add claim saving to OfferClaimModal
   - [ ] Add "already claimed" check to Offers page

3. **Add navigation links**:
   - [ ] Add to Layout.tsx menu

4. **Test the flow**:
   - [ ] Create test offer
   - [ ] Claim offer as different user
   - [ ] Verify analytics update

Would you like me to create any of these pages for you?
