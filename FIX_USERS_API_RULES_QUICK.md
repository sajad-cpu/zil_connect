# Quick Fix: Show All Users in Admin Panel

## The Problem
Only showing 1 user (or only admin users) because PocketBase API rules are restricting access to the `users` collection.

## The Solution (2 Steps)

### Step 1: Update PocketBase API Rules

1. **Go to PocketBase Admin**
   - URL: https://pocketbase.captain.sebipay.com/_/
   - Login

2. **Open Users Collection**
   - Click "Collections" (left sidebar)
   - Click on `users` collection

3. **Go to API Rules Tab**
   - Click "API Rules" tab at the top

4. **Update List/Search Rule**
   - Find "List/Search rule" field
   - **Current (restrictive):** Might be `id = @request.auth.id` or `role="admin"`
   - **Change to:** `@request.auth.id != ""`
   - This allows ANY authenticated user to list ALL users
   - Click the checkmark or "Save" button

5. **Update View Rule** (optional)
   - Find "View rule" field  
   - **Change to:** `@request.auth.id != ""`
   - Click "Save"

### Step 2: Refresh Admin Panel

1. Go back to your app
2. Navigate to `/AdminUsers`
3. **Hard refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
4. Check the page - should now show ALL users

## Verify It's Working

1. **Check Browser Console** (F12)
   - Look for: "Users fetched - totalItems: X"
   - Should show the actual total number of users in your database

2. **Check the Blue Info Box**
   - On the Users page, you'll see: "Total Users: X | Showing: Y"
   - This shows how many users exist vs how many are displayed

## If Still Not Working

### Check API Rules Again
- Make sure the rule is exactly: `@request.auth.id != ""`
- No extra spaces or quotes
- Click Save after changing

### Check Browser Console
- Open DevTools (F12) → Console tab
- Look for error messages
- Check the "Users fetched" log to see what the API returned

### Test API Directly
Run this in browser console while on Admin Users page:

```javascript
// Get auth token
const token = localStorage.getItem('zil_auth_token');

// Fetch users
fetch('https://pocketbase.captain.sebipay.com/api/collections/users/records?page=1&perPage=50&sort=-created', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
.then(r => r.json())
.then(data => {
  console.log('✅ Total users in database:', data.totalItems);
  console.log('✅ Users returned:', data.items.length);
  console.log('✅ User emails:', data.items.map(u => u.email));
})
.catch(err => {
  console.error('❌ Error:', err);
  console.error('This means API rules are blocking access');
});
```

If this shows more users than the admin panel, there's a code issue.
If this also shows only 1 user, it's definitely an API rules issue.

## Expected Result

After fixing API rules:
- ✅ All users should appear in the table
- ✅ Total count should match number of users in PocketBase
- ✅ You can search, paginate, and manage all users
- ✅ No more "only showing admin users" issue

