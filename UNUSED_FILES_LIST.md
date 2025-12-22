# Unused JSX/TSX Files in the Application

This document lists all unused component and page files that are not currently imported or used anywhere in the application.

## Unused Component Files

### 1. `src/components/ScrollProgressIndicator.tsx`
- **Status**: ❌ Not imported anywhere
- **Description**: A scroll progress indicator component with circular and linear progress bars
- **Action**: Can be safely removed or integrated into Layout/Home if needed

### 2. `src/components/ui/star-rating.tsx`
- **Status**: ❌ Not imported anywhere
- **Description**: A reusable star rating component
- **Action**: Can be safely removed unless you plan to use it for reviews/ratings

## Files That ARE Used (Keep These)

### Components in Use:
- ✅ `src/components/MilestoneMarker.tsx` - Used in Home.tsx
- ✅ `src/components/OfferClaimModal.tsx` - Used in Home.tsx and Offers.tsx
- ✅ `src/components/OnboardingModal.tsx` - Used in Home.tsx
- ✅ `src/components/ParallaxSection.tsx` - Used in Home.tsx
- ✅ `src/components/ScrollReveal.tsx` - Used in Home.tsx
- ✅ `src/components/LoadingScreen.tsx` - Used in index.tsx
- ✅ `src/components/NotificationsDropdown.tsx` - Used in Layout.tsx
- ✅ `src/components/ui/image-gallery.tsx` - Used in PortfolioTab.tsx
- ✅ `src/components/ui/file-upload.tsx` - Used in PortfolioModal.tsx
- ✅ `src/components/badges/BadgesTab.tsx` - Used in BusinessDetails.tsx and Profile.tsx
- ✅ `src/components/portfolio/PortfolioTab.tsx` - Used in BusinessDetails.tsx and Profile.tsx
- ✅ `src/components/profile/ServicesTab.tsx` - Used in BusinessDetails.tsx and Profile.tsx
- ✅ `src/components/modals/BadgeModal.tsx` - Used in BadgesTab.tsx
- ✅ `src/components/modals/PortfolioModal.tsx` - Used in PortfolioTab.tsx
- ✅ `src/components/modals/ServiceModal.tsx` - Used in ServicesTab.tsx

### Pages in Use:
All pages listed in `src/pages/index.tsx` are used and have routes defined:
- ✅ Home, Marketplace, Opportunities, Search, Offers, Events, Community, Knowledge, Analytics, Profile, Settings, Invitations, Connected, BusinessDetails, OpportunityApply, CourseDetails, ModuleLessons, OpportunityDetails, AppliedOpportunities, CreateOpportunity, MyOpportunities, CreateOffer, MyOffers, MyClaimedOffers, SignIn, SignUp

## Summary

**Total Unused Files: 2**
1. `src/components/ScrollProgressIndicator.tsx`
2. `src/components/ui/star-rating.tsx`

## Recommendations

### Option 1: Delete Unused Files
If you're certain these components won't be needed:
```bash
rm src/components/ScrollProgressIndicator.tsx
rm src/components/ui/star-rating.tsx
```

### Option 2: Keep for Future Use
If you plan to use these components later:
- Keep them but add a comment indicating they're not currently in use
- Consider moving them to a `components/unused/` or `components/archive/` folder

### Option 3: Integrate ScrollProgressIndicator
If you want to use the scroll progress indicator:
- Add it to `Layout.tsx` or `Home.tsx`
- Import: `import ScrollProgressIndicator from "@/components/ScrollProgressIndicator";`
- Add component: `<ScrollProgressIndicator />`

## Notes

- All UI component files in `src/components/ui/` are part of a component library (shadcn/ui) and may be used indirectly
- Some `.jsx` files in `src/components/ui/` are duplicates of `.tsx` files (e.g., `calendar.jsx` and `calendar.tsx`) - these can be consolidated
- The `Marketplace` page is imported but the navigation tab is commented out in Layout.tsx - the page itself is still accessible via direct URL
