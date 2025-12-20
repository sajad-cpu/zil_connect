# Portfolio & Badges Features Setup Guide

## Overview
The Portfolio and Badges & Certifications features have been successfully implemented! This guide will help you create the required PocketBase collections to make them fully functional.

## What's Been Completed ✅

### Portfolio Feature
- ✅ `/src/api/services/portfolioService.ts` - CRUD operations with file uploads
- ✅ `/src/components/modals/PortfolioModal.tsx` - Add/Edit portfolio items with image upload
- ✅ `/src/components/portfolio/PortfolioTab.tsx` - Display portfolio with image gallery
- ✅ Profile.tsx updated to use PortfolioTab
- ✅ BusinessDetails.tsx updated to use PortfolioTab

### Badges & Certifications Feature
- ✅ `/src/api/services/badgeService.ts` - CRUD operations with file uploads
- ✅ `/src/components/modals/BadgeModal.tsx` - Add/Edit badges with image upload
- ✅ `/src/components/badges/BadgesTab.tsx` - Display badges with filtering
- ✅ Profile.tsx updated to use BadgesTab
- ✅ BusinessDetails.tsx updated to use BadgesTab

### Shared Components
- ✅ `/src/components/ui/file-upload.tsx` - Drag-drop file upload with preview
- ✅ `/src/components/ui/image-gallery.tsx` - Lightbox for viewing images

### Bug Fixes
- ✅ Fixed BusinessDetails contact info display (phone, email, website, location)

## What Needs to Be Done ⚠️

You need to create 2 PocketBase collections in your admin panel.

**PocketBase Admin URL**: http://127.0.0.1:8091/_/

---

## Collection 1: portfolio_items

### Collection Details
**Collection Name**: `portfolio_items`
**Type**: Base collection

### Fields to Create

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
   - Max length: 1000

4. **category** (Text)
   - Type: Text
   - Required: No
   - Max length: 50

5. **client_name** (Text)
   - Type: Text
   - Required: No
   - Max length: 100

6. **project_date** (Date)
   - Type: Date
   - Required: No

7. **duration** (Text)
   - Type: Text
   - Required: No
   - Max length: 50

8. **technologies** (JSON)
   - Type: JSON
   - Required: No

9. **tags** (JSON)
   - Type: JSON
   - Required: No

10. **images** (File)
    - Type: File
    - Required: No
    - Max select: 5
    - Max size: 5242880 (5MB each)
    - Mime types:
      - image/jpeg
      - image/png
      - image/webp
    - Thumb sizes: 300x200, 800x600
    - Protected: No (public access)

11. **thumbnail** (Text)
    - Type: Text
    - Required: No
    - Max length: 255

12. **project_url** (URL)
    - Type: URL
    - Required: No

13. **case_study_url** (URL)
    - Type: URL
    - Required: No

14. **is_featured** (Bool)
    - Type: Bool
    - Required: No
    - Default: false

15. **order** (Number)
    - Type: Number
    - Required: No
    - Default: 0

### API Rules

```
List rule:      @request.auth.id != ""
View rule:      @request.auth.id != ""
Create rule:    @request.auth.id != "" && business.owner = @request.auth.id
Update rule:    business.owner = @request.auth.id
Delete rule:    business.owner = @request.auth.id
```

### Indexes
- `business` - For fast lookups
- `is_featured` - For filtering featured items

---

## Collection 2: business_badges

### Collection Details
**Collection Name**: `business_badges`
**Type**: Base collection

### Fields to Create

1. **business** (Relation)
   - Type: Relation
   - Required: ✓ Yes
   - Collection: businesses
   - Max select: 1
   - Cascade delete: Yes
   - Display fields: business_name

2. **badge_type** (Select)
   - Type: Select
   - Required: ✓ Yes
   - Max select: Single
   - Values (add these exactly):
     - `certification`
     - `award`
     - `membership`
     - `verification`

3. **title** (Text)
   - Type: Text
   - Required: ✓ Yes
   - Min length: 1
   - Max length: 100

4. **issuing_organization** (Text)
   - Type: Text
   - Required: ✓ Yes
   - Min length: 1
   - Max length: 100

5. **description** (Text)
   - Type: Text
   - Required: No
   - Max length: 500

6. **credential_id** (Text)
   - Type: Text
   - Required: No
   - Max length: 100

7. **credential_url** (URL)
   - Type: URL
   - Required: No

8. **issue_date** (Date)
   - Type: Date
   - Required: No

9. **expiry_date** (Date)
   - Type: Date
   - Required: No

10. **does_not_expire** (Bool)
    - Type: Bool
    - Required: No
    - Default: true

11. **badge_image** (File)
    - Type: File
    - Required: No
    - Max select: 1
    - Max size: 2097152 (2MB)
    - Mime types:
      - image/jpeg
      - image/png
      - image/svg+xml
      - image/webp
    - Protected: No (public access)

12. **verification_document** (File)
    - Type: File
    - Required: No
    - Max select: 1
    - Max size: 5242880 (5MB)
    - Mime types:
      - image/jpeg
      - image/png
      - application/pdf
    - Protected: Yes (only admin and owner can access)

13. **is_verified** (Bool)
    - Type: Bool
    - Required: No
    - Default: false

14. **verification_status** (Select)
    - Type: Select
    - Required: No
    - Max select: Single
    - Default: pending
    - Values (add these exactly):
      - `pending`
      - `verified`
      - `rejected`

15. **order** (Number)
    - Type: Number
    - Required: No
    - Default: 0

### API Rules

```
List rule:      @request.auth.id != ""
View rule:      @request.auth.id != ""
Create rule:    @request.auth.id != "" && business.owner = @request.auth.id
Update rule:    business.owner = @request.auth.id || @request.auth.id = "ADMIN_USER_ID"
Delete rule:    business.owner = @request.auth.id
```

**Note**: For the Update rule, if you want admins to be able to verify badges, replace `"ADMIN_USER_ID"` with your actual admin user ID, or use a role-based check if you have that set up.

### Indexes
- `business` - For fast lookups
- `badge_type` - For filtering by type
- `verification_status` - For admin review queue

---

## Feature Functionality

### Portfolio Feature

#### For Business Owners (Profile Page):
- ✅ Add portfolio projects with up to 5 images
- ✅ Edit existing portfolio items
- ✅ Delete portfolio items
- ✅ Mark projects as featured
- ✅ Add project details (client, date, duration, technologies)
- ✅ Add links to live project and case studies
- ✅ View images in lightbox gallery

#### For Visitors (BusinessDetails Page):
- ✅ Browse portfolio in grid layout
- ✅ View project images in lightbox
- ✅ See project details and technologies
- ✅ Click links to view live projects

### Badges & Certifications Feature

#### For Business Owners (Profile Page):
- ✅ Add badges/certifications with images
- ✅ Upload verification documents
- ✅ Edit existing badges
- ✅ Delete badges
- ✅ Filter badges by type
- ✅ See verification status (pending/verified/expired)
- ✅ Add credential IDs and verification URLs

#### For Visitors (BusinessDetails Page):
- ✅ View all verified badges
- ✅ Filter by badge type
- ✅ See badge details and issuing organization
- ✅ Click verification links
- ✅ See expiry status

## Testing the Features

### After Creating Collections:

1. **Test Portfolio Feature**:
   - Navigate to Profile page
   - Click "Portfolio" tab
   - Click "Add Project" button
   - Upload 1-5 images
   - Fill in project details
   - Submit and verify it appears
   - Click on project to view in lightbox
   - Test edit and delete functionality
   - View on BusinessDetails page

2. **Test Badges Feature**:
   - Navigate to Profile page
   - Click "Badges & Certifications" tab
   - Click "Add Certification" button
   - Upload badge image
   - Fill in badge details
   - Optionally upload verification document
   - Submit and verify it appears with "Pending Review" status
   - Test filter by type
   - Test edit and delete functionality
   - View on BusinessDetails page

## Common Issues & Solutions

### Issue: "Collection not found" error
**Solution**: Make sure you've created both `portfolio_items` and `business_badges` collections exactly as specified.

### Issue: Image upload fails
**Solution**:
- Check file size limits (5MB for portfolio, 2MB for badge images)
- Verify MIME types are configured correctly
- Ensure "Protected" is set to "No" for public images

### Issue: Can't create portfolio/badge
**Solution**:
- Verify you're logged in and have a business profile
- Check the Create rule includes `business.owner = @request.auth.id`

### Issue: Images don't display
**Solution**:
- Make sure "Protected" is set to "No" for badge_image and images fields
- Check that your PocketBase server is running

## Files Reference

### Portfolio Files
- `/src/api/services/portfolioService.ts` - Service layer
- `/src/components/modals/PortfolioModal.tsx` - Add/Edit modal
- `/src/components/portfolio/PortfolioTab.tsx` - Display component
- `/src/pages/Profile.tsx` (line 528) - Profile integration
- `/src/pages/BusinessDetails.tsx` (line 323) - Details integration

### Badges Files
- `/src/api/services/badgeService.ts` - Service layer
- `/src/components/modals/BadgeModal.tsx` - Add/Edit modal
- `/src/components/badges/BadgesTab.tsx` - Display component
- `/src/pages/Profile.tsx` (line 549) - Profile integration
- `/src/pages/BusinessDetails.tsx` (line 338) - Details integration

## Success Criteria

You'll know everything is working when:
- ✅ You can add portfolio projects with images
- ✅ Images display in grid and open in lightbox
- ✅ You can add badges with images and verification docs
- ✅ Badges show correct verification status
- ✅ Filter by badge type works
- ✅ Expired badges are marked as expired
- ✅ All features work on both Profile and BusinessDetails pages
- ✅ File uploads complete successfully
- ✅ Empty states display when no items exist

---

**Note**: The Services feature from earlier also requires its `business_services` collection. See [SERVICES_FEATURE_SETUP.md](SERVICES_FEATURE_SETUP.md) for details.

## Development Server

The dev server should be running without errors on http://localhost:5173/

If you need to restart it:
```bash
npm run dev
```
