# Admin Panel Setup Guide

## Overview

The admin panel provides comprehensive management capabilities for the Business Connection platform, including user management, business verification, content moderation, fintech marketplace management, commission tracking, analytics, and system configuration.

## Prerequisites

- PocketBase instance running
- Admin user account with `role` field set to `"admin"`

## Database Setup

### Step 1: Add Role Field to Users Collection

1. Open PocketBase admin panel: https://pocketbase.captain.sebipay.com/_/
2. Navigate to Collections → `users` (system auth collection)
3. Click "New Field"
4. Configure the field:
   - **Name**: `role`
   - **Type**: Select (single)
   - **Required**: No
   - **Values**: 
     - `user`
     - `admin`
     - `moderator`
   - **Default value**: `user`
5. Click "Save"

### Step 2: Set First Admin User

1. Go to Collections → `users`
2. Find your user account
3. Edit the record
4. Set `role` field to `admin`
5. Save

## Accessing the Admin Panel

1. Log in to the platform with an admin account
2. Navigate to `/Admin` in your browser
3. You'll see the admin dashboard with sidebar navigation

## Admin Panel Features

### Dashboard
- Overview statistics (users, businesses, opportunities, offers, enrollments, commissions)
- Quick actions
- Recent activity feed

### Users Management
- View all users
- Search and filter users by role
- Edit user information
- Change user roles (user/admin/moderator)
- Delete users

### Businesses Management
- View all businesses
- Filter by verification status
- Search businesses
- Verify/unverify businesses
- Edit business details
- Delete businesses

### Content Moderation

#### Opportunities
- List all opportunities
- Approve/reject opportunities
- Edit opportunities
- Delete opportunities

#### Offers
- List all offers
- Approve/reject offers
- Edit offers
- Delete offers

#### Messages
- View all messages
- Delete inappropriate messages

### Fintech Marketplace

#### Products
- List all fintech products
- Add new products
- Edit products
- Delete products
- Set featured products
- Manage categories

#### Enrollments
- View all enrollments
- Filter by status
- Update enrollment status

#### Commissions
- View all commission transactions
- Filter by status (pending, paid, cancelled)
- Update commission status

### Analytics
- Platform statistics
- User growth metrics
- Revenue trends
- Activity metrics

### Settings
- Platform configuration
- Commission rates
- Notification settings
- Feature flags

## User Roles

### Admin
- Full access to all admin features
- Can manage users, businesses, content, products, commissions
- Can configure system settings

### Moderator
- Can moderate content (opportunities, offers, messages)
- Cannot manage users or system settings
- Limited access to admin features

### User
- Standard platform user
- No admin access

## Security

- All admin routes are protected by role verification
- Non-admin users are redirected to home page if they try to access admin routes
- Admin actions require authentication
- Sensitive operations (delete, role changes) require confirmation

## Troubleshooting

### Cannot Access Admin Panel
- Verify your user account has `role` field set to `"admin"`
- Check that you're logged in
- Clear browser cache and try again

### Admin Features Not Working
- Verify PocketBase API rules allow admin access
- Check browser console for errors
- Ensure you're using the correct admin account

### Data Not Loading
- Check PocketBase connection
- Verify collection names match exactly
- Check API rules for the collections

## API Rules for Admin Access

Admin users should have access to all collections. The application checks the user's role before allowing admin operations. Ensure your PocketBase API rules allow authenticated users to read/write as needed, and the application will enforce admin-only operations.

## Support

For issues or questions about the admin panel, check:
1. Browser console for errors
2. PocketBase logs
3. Network tab for API errors

