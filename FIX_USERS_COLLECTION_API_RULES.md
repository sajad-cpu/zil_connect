# Fix Users Collection API Rules

## Problem
Only 1 user is showing in the admin panel because the `users` collection API rules are restricting access.

## Solution

### Step 1: Update Users Collection API Rules

1. **Open PocketBase Admin Panel**
   - Go to: https://pocketbase.captain.sebipay.com/_/
   - Login as admin

2. **Navigate to Users Collection**
   - Click "Collections" in left sidebar
   - Find and click on `users` (system auth collection)

3. **Go to API Rules Tab**
   - Click on "API Rules" tab

4. **Update List Rule**
   - Find "List/Search rule"
   - Change it to: `@request.auth.id != ""`
   - This allows any authenticated user to list all users
   - Click "Save"

5. **Update View Rule** (optional, for viewing individual users)
   - Find "View rule"
   - Change it to: `@request.auth.id != ""`
   - Click "Save"

### Step 2: Verify the Fix

1. **Refresh Admin Panel**
   - Go back to your app
   - Navigate to `/AdminUsers`
   - Refresh the page

2. **Check Browser Console**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for logs:
     - "Fetching users - page: 1 perPage: 20"
     - "Users fetched - totalItems: X items count: Y"
   - Check Network tab to see the API response

3. **Expected Result**
   - Should see all users in the table
   - Total count should match number of users in database
   - Pagination should work if there are more than 20 users

## Alternative: More Restrictive Rules (Recommended for Production)

If you want more security, you can create a custom field or use a different approach:

### Option A: Create Admin Users Collection
- Create a separate collection for admin users
- Store admin email/password there
- Use that for admin authentication

### Option B: Use PocketBase Admin API
- Authenticate as PocketBase admin in the backend
- Use admin API to fetch users
- More secure but requires backend changes

## Current API Rules (What to Set)

```
List/Search rule:    @request.auth.id != ""
View rule:           @request.auth.id != ""
Create rule:         (leave as is - system handles this)
Update rule:         id = @request.auth.id || @request.auth.id != ""
Delete rule:         (leave as is - usually restricted)
```

## Debugging

If still only showing 1 user after updating rules:

1. **Check Console Logs**
   - Look for "Users fetched - totalItems: X"
   - If totalItems is 1, the API is only returning 1 user
   - If totalItems is more but items.length is 1, check pagination

2. **Check Network Tab**
   - Open DevTools → Network tab
   - Filter by "users"
   - Click on the API request
   - Check Response tab
   - See how many users are actually returned

3. **Check PocketBase Logs**
   - In PocketBase admin, check logs
   - Look for any errors or warnings

4. **Verify Collection Has Multiple Users**
   - Go to PocketBase admin → Collections → users
   - Check how many records exist
   - If only 1 user exists, that's why only 1 is showing!

## Quick Test

Run this in browser console while on Admin Users page:

```javascript
// Check what the API is returning
fetch('https://pocketbase.captain.sebipay.com/api/collections/users/records?page=1&perPage=20&sort=-created', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('zil_auth_token')
  }
})
.then(r => r.json())
.then(data => {
  console.log('Total users:', data.totalItems);
  console.log('Users returned:', data.items.length);
  console.log('Users:', data.items.map(u => u.email));
});
```

This will show you exactly what the API is returning.

