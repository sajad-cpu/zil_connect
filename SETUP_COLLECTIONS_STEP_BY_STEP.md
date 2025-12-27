# PocketBase Collections Setup Guide

This guide provides step-by-step instructions for setting up all required collections in PocketBase.

## Prerequisites

- PocketBase admin UI running (usually at `http://127.0.0.1:8090/_/`)
- Logged in as admin
- Basic understanding of PocketBase collections and fields

## Core Collections

### 1. businesses

**Collection Type:** Base Collection

**Fields:**
- `name` (Text, Required, Min: 1, Max: 255)
- `business_name` (Text, Required)
- `description` (Text, Optional)
- `tagline` (Text, Optional)
- `industry` (Text, Optional)
- `location` (JSON, Optional) - Contains `city` and `state`
- `contact_info` (JSON, Optional) - Contains `email`, `phone`, `website`
- `owner` (Relation → users, Required, Cascade Delete)
- `trust_score` (Number, Default: 0)
- `profile_views` (Number, Default: 0)
- `engagement_score` (Number, Default: 0)
- `is_verified` (Bool, Default: false)
- `verified_badges` (JSON, Optional) - Array of badge strings
- `logo` (File, Optional) - Image file

**API Rules:**
- List: Public read, authenticated write
- View: Public read, owner write
- Create: Authenticated users only
- Update: Owner only
- Delete: Owner only

### 2. opportunities

**Collection Type:** Base Collection

**Fields:**
- `title` (Text, Required, Min: 1, Max: 255)
- `description` (Text, Required)
- `business` (Relation → businesses, Required, Cascade Delete)
- `created_by` (Relation → users, Required, Cascade Delete)
- `type` (Text, Optional) - Project, Partnership, Tender, RFP, Collaboration, Investment
- `status` (Text, Optional) - Open, In Progress, Awarded, Closed
- `deadline` (Date, Optional)
- `budget` (Text, Optional)
- `location` (Text, Optional)
- `company_name` (Text, Optional)
- `views` (Number, Default: 0)
- `application_count` (Number, Default: 0)

**API Rules:**
- List: Public read, authenticated write
- View: Public read, owner write
- Create: Authenticated users only
- Update: Owner only
- Delete: Owner only

### 3. opportunity_applications

**Collection Type:** Base Collection

**Fields:**
- `opportunity` (Relation → opportunities, Required, Cascade Delete)
- `applicant` (Relation → users, Required, Cascade Delete)
- `business` (Relation → businesses, Optional)
- `status` (Text, Optional) - Pending, Reviewed, Accepted, Rejected
- `cover_letter` (Text, Optional)
- `resume` (File, Optional)
- `portfolio_url` (URL, Optional)
- `company_name` (Text, Optional)
- `contact_person` (Text, Optional)
- `email` (Email, Optional)
- `phone` (Text, Optional)

**API Rules:**
- List: Owner of opportunity can view all, applicant can view own
- View: Owner or applicant can view
- Create: Authenticated users only
- Update: Owner of opportunity or applicant can update
- Delete: Owner of opportunity or applicant can delete

### 4. offers

**Collection Type:** Base Collection

**Fields:**
- `title` (Text, Required)
- `description` (Text, Required)
- `discount_percentage` (Number, Required)
- `business_name` (Text, Required)
- `created_by` (Relation → users, Required, Cascade Delete)
- `valid_until` (Date, Optional)
- `is_featured` (Bool, Default: false)
- `redemptions` (Number, Default: 0)
- `terms_and_conditions` (Text, Optional)

**API Rules:**
- List: Public read, authenticated write
- View: Public read, owner write
- Create: Authenticated users only
- Update: Owner only
- Delete: Owner only

### 5. offer_claims

**Collection Type:** Base Collection

**Fields:**
- `offer` (Relation → offers, Required, Cascade Delete)
- `user` (Relation → users, Required, Cascade Delete)
- `claim_code` (Text, Required, Unique)
- `status` (Text, Default: "active") - active, redeemed, expired
- `claimed_at` (Date, Required)
- `expires_at` (Date, Required)
- `redeemed_at` (Date, Optional)

**API Rules:**
- List: User can view own claims, offer owner can view all claims for their offers
- View: User or offer owner can view
- Create: Authenticated users only
- Update: Offer owner can update status
- Delete: Offer owner can delete

### 6. connections

**Collection Type:** Base Collection

**Fields:**
- `user_from` (Relation → users, Required)
- `user_to` (Relation → users, Required)
- `business_from` (Relation → businesses, Required)
- `business_to` (Relation → businesses, Required)
- `status` (Select, Required, Default: "pending") - pending, accepted, rejected
- `message` (Text, Optional)

**Indexes:**
- Unique index on `user_from` + `user_to`

**API Rules:**
- List: Users can view connections where they are user_from or user_to
- View: Users can view if they are user_from or user_to
- Create: Authenticated users only
- Update: user_to can update status
- Delete: user_from or user_to can delete

### 7. messages

**Collection Type:** Base Collection

**Fields:**
- `connection_id` (Relation → connections, Required, Cascade Delete)
- `sender` (Relation → users, Required)
- `receiver` (Relation → users, Required)
- `text` (Text, Required)
- `read` (Bool, Default: false)
- `attachment_url` (URL, Optional)

**API Rules:**
- List: Users can view messages where they are sender or receiver
- View: Users can view if they are sender or receiver
- Create: Authenticated users only (sender must be current user)
- Update: Sender can update, receiver can mark as read
- Delete: Sender can delete

### 8. notifications

**Collection Type:** Base Collection

**Fields:**
- `user` (Relation → users, Required, Cascade Delete)
- `type` (Select, Required) - connection_request, message, opportunity, offer, etc.
- `message` (Text, Required)
- `related_id` (Text, Optional) - ID of related record
- `is_read` (Bool, Default: false)

**API Rules:**
- List: Users can view own notifications
- View: Users can view own notifications
- Create: System/admin only
- Update: User can update is_read
- Delete: User can delete own notifications

### 9. fintech_products

**Collection Type:** Base Collection

**Fields:**
- `name` (Text, Required, Min: 1, Max: 255)
- `description` (Text, Required)
- `category` (Select, Required) - Accounting Software, Payment Processing, Business Banking, Tax Software, Payroll Services, Invoicing Tools, Expense Management, Business Analytics
- `provider` (Text, Optional)
- `logo` (File, Optional) - Image file
- `pricing_type` (Select, Optional) - free, paid, freemium
- `pricing_amount` (Number, Optional)
- `website_url` (URL, Optional)
- `is_featured` (Bool, Default: false)
- `is_active` (Bool, Default: true)

**API Rules:**
- List: Public read, admin write
- View: Public read, admin write
- Create: Admin only
- Update: Admin only
- Delete: Admin only

### 10. fintech_enrollments

**Collection Type:** Base Collection

**Fields:**
- `product` (Relation → fintech_products, Required, Cascade Delete)
- `user` (Relation → users, Required, Cascade Delete)
- `business` (Relation → businesses, Optional)
- `enrolled_at` (Date, Required)
- `status` (Select, Default: "active") - active, cancelled, completed

**API Rules:**
- List: Users can view own enrollments
- View: Users can view own enrollments
- Create: Authenticated users only
- Update: User can update own enrollment
- Delete: User can delete own enrollment

## Setup Steps

1. **Access PocketBase Admin UI**
   - Navigate to `http://127.0.0.1:8090/_/`
   - Login as admin

2. **Create Collections**
   - Go to Collections → New Collection
   - For each collection listed above:
     - Set collection name
     - Set type (Base Collection)
     - Add all fields with correct types and options
     - Set required fields
     - Configure API rules
     - Add indexes where specified

3. **Configure API Rules**
   - For each collection, set appropriate API rules
   - Test rules using the API playground

4. **Verify Setup**
   - Check all collections exist
   - Verify all fields are created correctly
   - Test API access with different user roles

## Notes

- All relation fields should have cascade delete enabled where appropriate
- Unique indexes should be created for fields marked as unique
- Default values should be set for fields with defaults
- API rules should be tested after setup

