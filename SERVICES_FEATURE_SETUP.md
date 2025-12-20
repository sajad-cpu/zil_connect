# Services Feature Setup Guide

## Overview
The Services feature has been successfully implemented in the codebase. This guide will help you create the required PocketBase collection to make it fully functional.

## What's Been Completed ✅

### 1. Service Layer
- ✅ `/src/api/services/businessServicesService.ts` - CRUD operations for services

### 2. UI Components
- ✅ `/src/components/ui/star-rating.tsx` - Reusable star rating component
- ✅ `/src/components/ui/file-upload.tsx` - File upload component with preview
- ✅ `/src/components/ui/image-gallery.tsx` - Lightbox image gallery

### 3. Modal Components
- ✅ `/src/components/modals/ServiceModal.tsx` - Add/Edit service modal

### 4. Tab Components
- ✅ `/src/components/profile/ServicesTab.tsx` - Services display and management

### 5. Page Integrations
- ✅ Profile.tsx updated to use ServicesTab
- ✅ BusinessDetails.tsx updated to use ServicesTab

### 6. Additional Services Ready for Future Phases
- ✅ `/src/api/services/portfolioService.ts` - Portfolio CRUD operations
- ✅ `/src/api/services/reviewService.ts` - Reviews CRUD operations
- ✅ `/src/api/services/badgeService.ts` - Badges CRUD operations

## What Needs to Be Done ⚠️

### Step 1: Create PocketBase Collection

You need to create the `business_services` collection in your PocketBase admin panel.

**PocketBase Admin URL**: http://127.0.0.1:8091/_/

#### Collection Details:

**Collection Name**: `business_services`
**Type**: Base collection

#### Fields to Create:

1. **business** (Relation)
   - Type: Relation
   - Required: ✓ Yes
   - Collection: businesses
   - Max select: 1
   - Cascade delete: Yes
   - Display fields: business_name

2. **title** (Text)
   - Type: Text
   - Required: ✓ Yes
   - Min length: 1
   - Max length: 100

3. **description** (Text)
   - Type: Text
   - Required: ✓ Yes
   - Min length: 1
   - Max length: 500

4. **category** (Text)
   - Type: Text
   - Required: No
   - Max length: 50

5. **pricing_type** (Text)
   - Type: Text
   - Required: No
   - Max length: 50
   - Options: hourly, project, retainer, custom

6. **price_range** (Text)
   - Type: Text
   - Required: No
   - Max length: 50

7. **delivery_time** (Text)
   - Type: Text
   - Required: No
   - Max length: 50

8. **is_active** (Bool)
   - Type: Bool
   - Required: No
   - Default: true

9. **order** (Number)
   - Type: Number
   - Required: No
   - Default: 0

#### API Rules:

```
List rule:      @request.auth.id != ""
View rule:      @request.auth.id != ""
Create rule:    @request.auth.id != "" && business.owner = @request.auth.id
Update rule:    business.owner = @request.auth.id
Delete rule:    business.owner = @request.auth.id
```

#### Indexes to Create:

1. **business** - For fast lookups by business
2. **is_active** - For filtering active services

### Step 2: Test the Feature

After creating the collection:

1. Start your dev server: `npm run dev`
2. Navigate to your Profile page: http://localhost:5175/profile
3. Click on the "Services" tab
4. Click "Add Service" button
5. Fill in the form and submit
6. Verify the service appears in the list
7. Test Edit and Delete functionality
8. Toggle the Active/Inactive status
9. View the service on BusinessDetails page

## Feature Functionality

### For Business Owners (Profile Page):
- ✅ Add new services
- ✅ Edit existing services
- ✅ Delete services
- ✅ Toggle active/inactive status
- ✅ View all services (active and inactive)
- ✅ Empty state with CTA when no services exist

### For Visitors (BusinessDetails Page):
- ✅ View all active services
- ✅ See service details (title, description, category, pricing, delivery time)
- ✅ Empty state message when no services listed

## Next Steps (Future Phases)

The following features are ready to be implemented once you're ready:

### Phase 4: Portfolio Feature
- Collections: `portfolio_items`
- Features: Image uploads, project showcase, featured items

### Phase 5: Badges & Certifications
- Collections: `business_badges`
- Features: Badge images, verification status, expiry dates

### Phase 6: Reviews & Ratings
- Collections: `business_reviews`
- Features: Star ratings, testimonials, owner responses, rating breakdowns

Each phase follows the same pattern and has service layers already created!

## Troubleshooting

### Issue: "Collection not found" error
**Solution**: Make sure you've created the `business_services` collection in PocketBase admin panel.

### Issue: "Permission denied" error
**Solution**: Check that the API rules are set correctly, especially the Create rule which should verify that the authenticated user owns the business.

### Issue: Services not appearing
**Solution**:
1. Check browser console for errors
2. Verify the collection name is exactly `business_services`
3. Ensure all required fields are created
4. Check that you're logged in and have a business profile

## Files Reference

### Service Layer
- `/src/api/services/businessServicesService.ts`

### Components
- `/src/components/modals/ServiceModal.tsx`
- `/src/components/profile/ServicesTab.tsx`
- `/src/components/ui/star-rating.tsx`
- `/src/components/ui/file-upload.tsx`
- `/src/components/ui/image-gallery.tsx`

### Pages
- `/src/pages/Profile.tsx` (lines 36, 520-522)
- `/src/pages/BusinessDetails.tsx` (lines 31, 299-301)

## Success Criteria

You'll know the feature is working when:
- ✅ You can add a new service from the Profile page
- ✅ The service appears in the Services tab
- ✅ You can edit and delete services
- ✅ You can toggle active/inactive status
- ✅ Services appear on the BusinessDetails page for other users
- ✅ Empty states display correctly when no services exist

## Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Verify PocketBase admin panel shows the collection
3. Test the API endpoints directly in PocketBase
4. Ensure you're using the correct PocketBase URL

---

**Note**: This is Phase 3 of the implementation plan. Phases 4, 5, and 6 (Portfolio, Badges, Reviews) have their service layers ready but require their respective PocketBase collections to be created before implementation.
