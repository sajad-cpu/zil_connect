# Admin Panel Testing Guide

## Step 1: Database Setup

### Add Role Field to Users Collection

1. **Open PocketBase Admin Panel**
   - Go to: https://pocketbase.captain.sebipay.com/_/
   - Login with your admin credentials

2. **Navigate to Users Collection**
   - Click on "Collections" in the left sidebar
   - Find and click on `users` (this is a system auth collection)

3. **Add Role Field**
   - Click the "New Field" button (or edit if field exists)
   - Configure:
     - **Name**: `role`
     - **Type**: Select (single)
     - **Required**: No
     - **Values**: 
       - `user`
       - `admin`
       - `moderator`
     - **Default value**: `user`
   - Click "Save"

4. **Set Your User as Admin**
   - In the `users` collection, find your user account
   - Click to edit the record
   - Set the `role` field to `admin`
   - Click "Save"

## Step 2: Access the Admin Panel

1. **Login to the Platform**
   - Go to your application: http://localhost:5173 (or your dev URL)
   - Login with the user account you just set as admin

2. **Navigate to Admin Panel**
   - Option 1: Type `/Admin` in the browser address bar
   - Option 2: Manually navigate to: `http://localhost:5173/Admin`

3. **Verify Access**
   - You should see the admin dashboard with sidebar navigation
   - If you see "Loading..." or get redirected, check:
     - Your user role is set to `admin` in PocketBase
     - You're logged in with the correct account
     - Check browser console for errors

## Step 3: Test Each Admin Feature

### Dashboard
- ✅ Should display statistics cards (Users, Businesses, Opportunities, etc.)
- ✅ Should show overview metrics
- ✅ Check that numbers match your actual data

### Users Management (`/AdminUsers`)
- ✅ View all users in a table
- ✅ Search for users by email/name
- ✅ Filter by role (user/admin/moderator)
- ✅ Click edit icon to change user role
- ✅ Test deleting a user (be careful!)
- ✅ Verify pagination works

### Businesses Management (`/AdminBusinesses`)
- ✅ View all businesses
- ✅ Search businesses
- ✅ Filter by verification status
- ✅ Click verify/unverify button
- ✅ Test deleting a business

### Opportunities (`/AdminOpportunities`)
- ✅ View all opportunities
- ✅ Search opportunities
- ✅ Approve an opportunity (green checkmark)
- ✅ Reject an opportunity (red X)
- ✅ Delete an opportunity

### Offers (`/AdminOffers`)
- ✅ View all offers
- ✅ Search offers
- ✅ Approve/reject offers
- ✅ Delete offers

### Messages (`/AdminMessages`)
- ✅ View all messages
- ✅ Search messages
- ✅ Delete messages

### Fintech Products (`/AdminFintechProducts`)
- ✅ View all fintech products
- ✅ Click "Add Product" button
- ✅ Fill out the form and create a product
- ✅ Edit an existing product
- ✅ Delete a product
- ✅ Search products

### Enrollments (`/AdminEnrollments`)
- ✅ View all enrollments
- ✅ Filter by status
- ✅ Change enrollment status using dropdown

### Commissions (`/AdminCommissions`)
- ✅ View all commission transactions
- ✅ Filter by status (pending/paid/cancelled)
- ✅ Change commission status

### Analytics (`/AdminAnalytics`)
- ✅ View platform statistics
- ✅ Check that numbers are accurate

### Settings (`/AdminSettings`)
- ✅ View settings page
- ✅ Test saving settings (currently shows toast notification)

## Step 4: Test Security

### Test Non-Admin Access
1. **Logout** from admin account
2. **Login** with a regular user account (role = "user")
3. **Try to access** `/Admin` in the browser
4. ✅ Should be redirected to `/Home`
5. ✅ Should NOT see admin sidebar or dashboard

### Test Route Protection
- Try accessing admin routes directly:
  - `/AdminUsers`
  - `/AdminBusinesses`
  - `/AdminSettings`
- ✅ All should redirect non-admin users to `/Home`

## Step 5: Common Issues & Solutions

### Issue: "Cannot access admin panel"
**Solution:**
- Verify `role` field exists in users collection
- Verify your user has `role = "admin"`
- Clear browser cache and cookies
- Check browser console for errors

### Issue: "Data not loading"
**Solution:**
- Check PocketBase connection
- Verify API rules allow authenticated users to read
- Check browser network tab for API errors
- Verify collection names match exactly

### Issue: "Actions not working"
**Solution:**
- Check browser console for errors
- Verify you're logged in
- Check PocketBase API rules allow updates/deletes
- Verify the user has admin role

### Issue: "Sidebar not showing"
**Solution:**
- Check if AdminLayout is wrapping the page
- Verify AdminRouteGuard is working
- Check for JavaScript errors in console

## Step 6: Quick Test Checklist

- [ ] Role field added to users collection
- [ ] User account set to admin
- [ ] Can access `/Admin` route
- [ ] Dashboard shows statistics
- [ ] Can view users list
- [ ] Can change user role
- [ ] Can verify/unverify businesses
- [ ] Can moderate opportunities
- [ ] Can moderate offers
- [ ] Can manage fintech products
- [ ] Can view enrollments
- [ ] Can manage commissions
- [ ] Non-admin users are blocked
- [ ] All routes are protected

## Testing Commands

If you want to test via terminal, you can check the routes:

```bash
# Check if admin routes are registered
grep -r "Admin" src/pages/index.tsx

# Check if admin components exist
ls -la src/pages/Admin/
ls -la src/components/admin/
```

## Next Steps After Testing

1. **Fix any bugs** found during testing
2. **Add more features** if needed
3. **Customize styling** to match your brand
4. **Add more validation** for forms
5. **Add export functionality** for data tables
6. **Add charts** to analytics page

