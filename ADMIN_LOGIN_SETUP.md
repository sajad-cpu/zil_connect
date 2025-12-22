# Admin Panel Login Setup

## Overview

The admin panel now uses a dedicated login system with hardcoded credentials. No database setup required!

## Admin Credentials

- **Email**: `admin@gmail.com`
- **Password**: `adming!123`

## How to Access Admin Panel

### Step 1: Navigate to Admin Login
- Go to: `http://localhost:5173/AdminLogin`
- Or type `/AdminLogin` in your browser

### Step 2: Enter Credentials
- Email: `admin@gmail.com`
- Password: `adming!123`
- Click "Login to Admin Panel"

### Step 3: Access Admin Dashboard
- After successful login, you'll be redirected to `/Admin`
- You'll see the admin dashboard with full access

## Features

- ✅ **No Database Setup Required** - No need to add role fields
- ✅ **Dedicated Login Page** - Separate from regular user login
- ✅ **Secure Session** - Admin session stored in localStorage
- ✅ **Auto Redirect** - Unauthenticated users redirected to login

## Security Notes

- Admin credentials are hardcoded in the application
- For production, consider:
  - Moving credentials to environment variables
  - Adding rate limiting
  - Adding 2FA
  - Using a more secure authentication method

## Logout

- Click on your name in the admin header
- Select "Logout"
- You'll be redirected to the admin login page

## Troubleshooting

### Can't Access Admin Panel
- Make sure you're using the correct credentials
- Check that you're going to `/AdminLogin` first
- Clear browser localStorage if needed

### Login Not Working
- Verify credentials: `admin@gmail.com` / `adming!123`
- Check browser console for errors
- Try clearing browser cache

### Session Expired
- If you get redirected to login, just login again
- Session is stored in localStorage

## Changing Credentials

To change the admin credentials, edit:
- File: `src/pages/Admin/AdminLogin.tsx`
- Update the `ADMIN_CREDENTIALS` constant:
  ```typescript
  const ADMIN_CREDENTIALS = {
    email: "your-new-email@example.com",
    password: "your-new-password",
  };
  ```

