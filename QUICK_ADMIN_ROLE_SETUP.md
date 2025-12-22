# Quick Guide: Setting Up Admin Role

## Step 1: Add Role Field to Users Collection

1. **In PocketBase Admin Panel** (where you are now):
   - Click on **"Collections"** in the left sidebar (not the user record)
   - Find and click on **`users`** collection (it's a system auth collection)

2. **Add the Role Field:**
   - Click **"New Field"** button (or edit if field already exists)
   - Configure:
     - **Name**: `role`
     - **Type**: Select (single)
     - **Required**: No
     - **Values**: 
       - `user`
       - `admin`
       - `moderator`
     - **Default value**: `user`
   - Click **"Save"**

## Step 2: Set Your User as Admin

1. **Go back to Users:**
   - Click on **"Collections"** → **`users`**
   - Find your user account (athul@gmail.com)
   - Click to **edit** the record

2. **Set Role to Admin:**
   - You should now see a **`role`** field in the form
   - Select **`admin`** from the dropdown
   - Click **"Save changes"**

## Visual Guide

```
PocketBase Admin Panel
├── Collections (left sidebar)
│   └── users (click here first to add field)
│       └── New Field → role (Select type)
│
└── Collections → users → [Your User]
    └── Edit → role field → Select "admin" → Save
```

## Quick Steps Summary

1. ✅ Collections → `users` → Add `role` field (Select type)
2. ✅ Edit your user → Set `role` = `admin` → Save
3. ✅ Logout and login again
4. ✅ Navigate to `/Admin` in your app

## Verify It Worked

After setting the role:
1. Logout from your app
2. Login again with the same account
3. Go to: `http://localhost:5173/Admin`
4. You should see the admin dashboard!

## Troubleshooting

**If you don't see the `role` field:**
- Make sure you added it to the `users` collection first
- Refresh the page
- Check that the field type is "Select" not "Text"

**If admin panel doesn't work:**
- Verify `role` field value is exactly `admin` (lowercase)
- Clear browser cache
- Check browser console for errors

