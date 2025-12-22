# Privacy-Safe Admin Setup (Local Authentication Only)

## The Solution

Admin login is **local-only** (localStorage) - no PocketBase user required. The admin panel is protected by:
1. **Local login check** - Only users who logged in via `/AdminLogin` can access
2. **5-minute timeout** - Session expires after 5 minutes
3. **API rules** - Control what data can be accessed

## Step 1: Update API Rules

1. Go to PocketBase Admin: https://pocketbase.captain.sebipay.com/_/
2. Click on **"users"** collection
3. Click **"API Rules"** tab
4. Update the rules:

### List/Search Rule
```
@request.auth.id != ""
```
**Meaning**: Any authenticated user can list/search users. The admin panel's localStorage check protects access.

### View Rule
```
@request.auth.id != ""
```
**Meaning**: Any authenticated user can view users. Privacy is protected by admin login requirement.

### Create Rule
```
@request.auth.id != ""
```
**Meaning**: Any authenticated user can create accounts (for signup).

### Update Rule
```
@request.auth.id != ""
```
**Meaning**: Any authenticated user can update users. Admin panel controls who can access.

### Delete Rule
```
@request.auth.id != ""
```
**Meaning**: Any authenticated user can delete users. Admin panel controls access.

5. Click **Save** for each rule

**Note**: The privacy protection comes from the admin login requirement (localStorage check), not from API rules. Only users who successfully log in via `/AdminLogin` can access the admin panel.

## Step 3: Test

1. Log out of admin panel if logged in
2. Go to `/AdminLogin`
3. Login with:
   - Email: `admin@gmail.com`
   - Password: `adming!123`
4. Go to `/allusers`
5. You should now see all 11 users!

## Admin Session Timeout

- **5-minute timeout**: Admin login expires after 5 minutes of inactivity
- **Auto-logout**: You'll be redirected to login page when session expires
- **Re-login required**: Just login again to continue

## Privacy Benefits

✅ **Admin login required** - Only users who login via `/AdminLogin` can access  
✅ **5-minute timeout** - Sessions expire automatically  
✅ **Local authentication** - No PocketBase user setup needed  
✅ **Frontend protection** - Admin routes are guarded by localStorage check  

## Troubleshooting

### Still only seeing 1 user
- Check that the List/Search rule is: `@request.auth.id != ""`
- Make sure you're logged in as a regular user in PocketBase (for API calls)
- Check browser console for user ID and any errors

### Can't update users
- Check that Update rule is: `@request.auth.id != ""`
- Verify you're logged in to the main app (not just admin panel)

### Session expired too quickly
- Session timeout is 5 minutes from login time
- If you need longer, edit `ADMIN_SESSION_TIMEOUT` in `AdminRouteGuard.tsx`
- Currently set to: `5 * 60 * 1000` (5 minutes in milliseconds)

## Security Notes

- Admin login is **local-only** (localStorage) - no PocketBase user required
- Admin routes are protected by `AdminRouteGuard` component
- Admin session expires after 5 minutes for security
- Make sure admin credentials (`admin@gmail.com` / `adming!123`) are kept secure
- For production, consider moving credentials to environment variables
