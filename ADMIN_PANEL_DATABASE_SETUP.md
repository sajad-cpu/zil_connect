# Admin Panel Database Setup

This guide covers the database setup required for the admin panel functionality.

## Prerequisites

- PocketBase admin UI running
- Admin account created
- Core collections already set up (see SETUP_COLLECTIONS_STEP_BY_STEP.md)

## Admin User Setup

### 1. Create Admin User

1. Go to PocketBase Admin → Users
2. Create a new user or use existing user
3. Set user role/type to identify as admin

### 2. Admin Role Configuration

The admin panel requires specific permissions. Ensure the admin user has:

- Access to all collections
- Ability to view, create, update, and delete records
- Access to admin panel routes

## Collections Used by Admin Panel

### 1. users (System Collection)

**Admin Access:**
- View all users
- Edit user details
- Manage user roles
- View user statistics

### 2. businesses

**Admin Operations:**
- View all businesses
- Edit business profiles
- Verify businesses
- Manage business badges
- View business statistics

### 3. opportunities

**Admin Operations:**
- View all opportunities
- Edit opportunities
- Delete opportunities
- View opportunity statistics
- Manage opportunity status

### 4. opportunity_applications

**Admin Operations:**
- View all applications
- Update application status
- View application statistics
- Export application data

### 5. offers

**Admin Operations:**
- View all offers
- Edit offers
- Feature/unfeature offers
- View offer statistics
- Manage offer claims

### 6. offer_claims

**Admin Operations:**
- View all claims
- View claim statistics
- Manage claim status

### 7. connections

**Admin Operations:**
- View all connections
- View connection statistics
- Manage connection status

### 8. messages

**Admin Operations:**
- View all messages (for moderation)
- View message statistics

### 9. notifications

**Admin Operations:**
- View all notifications
- Send system notifications
- View notification statistics

### 10. fintech_products

**Admin Operations:**
- Create products
- Edit products
- Delete products
- Feature products
- Manage product categories

### 11. fintech_enrollments

**Admin Operations:**
- View all enrollments
- View enrollment statistics
- Manage enrollment status

## API Rules for Admin Access

All collections should have admin override rules:

```javascript
// Example API rule with admin check
@request.auth.id != "" && (
  // Regular user rules
  OR
  // Admin check - verify admin role
)
```

## Admin Panel Features Requiring Database Access

1. **Dashboard**
   - Total users count
   - Total businesses count
   - Total opportunities count
   - Total offers count
   - Recent activity

2. **Users Management**
   - List all users
   - View user details
   - Edit user information
   - Manage user roles

3. **Businesses Management**
   - List all businesses
   - Verify businesses
   - Manage business profiles
   - View business statistics

4. **Opportunities Management**
   - List all opportunities
   - View applications
   - Manage opportunity status
   - View statistics

5. **Offers Management**
   - List all offers
   - Feature offers
   - View claim statistics
   - Manage offers

6. **Fintech Products Management**
   - Create/edit products
   - Manage categories
   - View enrollment statistics

7. **Analytics**
   - User growth statistics
   - Business growth statistics
   - Opportunity statistics
   - Offer redemption statistics
   - Enrollment statistics

## Setup Checklist

- [ ] Admin user created
- [ ] Admin role configured
- [ ] All collections accessible to admin
- [ ] API rules allow admin access
- [ ] Admin panel routes protected
- [ ] Admin authentication working
- [ ] All admin features tested

## Security Notes

- Admin routes should be protected
- Admin authentication should be verified
- API rules should prevent unauthorized access
- Admin actions should be logged (if logging is implemented)
- Regular security audits recommended

