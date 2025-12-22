# Admin Panel Database Setup

## Step 1: Add Role Field to Users Collection

### PocketBase Admin URL
- Production: https://pocketbase.captain.sebipay.com/_/

### Instructions

1. **Navigate to Collections**
   - Go to PocketBase admin panel
   - Click on "Collections" in the sidebar
   - Find and click on the `users` collection (system auth collection)

2. **Add Role Field**
   - Click "New Field" button
   - Field configuration:
     - **Name**: `role`
     - **Type**: Select (single)
     - **Required**: No (defaults to "user")
     - **Options**:
       - Values: 
         - `user`
         - `admin`
         - `moderator`
       - Default value: `user`
     - Click "Save"

3. **Update API Rules (Optional)**
   - The users collection is a system collection, so API rules are typically managed differently
   - Admin access will be checked in the application code

4. **Set First Admin User**
   - Go to the users collection
   - Find your user account
   - Edit the record
   - Set `role` field to `admin`
   - Save

### Verification

After setup, verify:
- Role field appears in users collection
- You can set role to "admin", "moderator", or "user"
- Your user account has role set to "admin"

