# Setup PocketBase Backend Only

## Current Status ✅

- **Service**: `zilconnect` on Render
- **PocketBase URL**: https://zil-connect.onrender.com
- **Status**: Running successfully!
- **Logs confirm**: Server started at port 8090

## Your Task: Setup PocketBase Backend

You'll host the frontend separately later. For now, let's just setup the backend.

---

## Step 1: Access PocketBase Admin

Open this URL in your browser:

```
https://zil-connect.onrender.com/_/
```

**What you should see:**
- PocketBase Admin login page

**First time setup:**
1. Click "Create admin account" or you'll see a form
2. Enter:
   - **Admin email**: your-email@example.com
   - **Admin password**: (choose a strong password - save it somewhere!)
3. Click **Create**

You'll be logged into the PocketBase admin dashboard.

---

## Step 2: Import Collections

Now you need to create the database structure (collections).

### Method A: Import from Schema (Recommended - Fast)

1. In PocketBase admin, click **Settings** (gear icon in sidebar)
2. Click the **Sync** tab
3. Click **Import collections** button
4. Open your local file: `backup-pocketbase.md`
5. Copy the **entire JSON content** from that file
6. Paste it into the import box
7. Click **Review**
8. Review the changes (should show 5-6 collections being created)
9. Click **Confirm**

### Method B: Create Manually (If Import Doesn't Work)

If import fails, create each collection manually:

#### Collection 1: businesses
1. Click **Collections** in sidebar
2. Click **New collection**
3. Name: `businesses`
4. Type: **Base collection**
5. Add fields:
   - `name` - Text (required)
   - `description` - Text
   - `industry` - Text
   - `location` - Text
   - `website` - URL
   - `logo` - File (single, max 5MB)
   - `owner` - Relation to `users` (required, single)
6. Click **Create**

#### Collection 2: connections
1. Click **New collection**
2. Name: `connections`
3. Type: **Base collection**
4. Add fields:
   - `user_from` - Relation to `users` (required, single)
   - `user_to` - Relation to `users` (required, single)
   - `business_from` - Relation to `businesses` (single)
   - `business_to` - Relation to `businesses` (single)
   - `status` - Text (required, default: "pending")
   - `message` - Text
5. Click **Create**

#### Collection 3: messages
1. Click **New collection**
2. Name: `messages`
3. Type: **Base collection**
4. Add fields:
   - `sender` - Relation to `users` (required, single)
   - `receiver` - Relation to `users` (required, single)
   - `connection` - Relation to `connections` (required, single)
   - `content` - Text (required)
   - `read` - Bool (default: false)
5. Click **Create**

#### Collection 4: opportunities
1. Click **New collection**
2. Name: `opportunities`
3. Type: **Base collection**
4. Add fields:
   - `title` - Text (required)
   - `description` - Text (required)
   - `business` - Relation to `businesses` (required, single)
   - `created_by` - Relation to `users` (required, single)
   - `type` - Text
   - `status` - Text (default: "open")
   - `deadline` - Date
   - `requirements` - Text
5. Click **Create**

#### Collection 5: opportunity_applications
1. Click **New collection**
2. Name: `opportunity_applications`
3. Type: **Base collection**
4. Add fields:
   - `opportunity` - Relation to `opportunities` (required, single)
   - `applicant` - Relation to `users` (required, single)
   - `business` - Relation to `businesses` (single)
   - `status` - Text (default: "pending")
   - `cover_letter` - Text
   - `resume` - File (single, max 10MB)
5. Click **Create**

---

## Step 3: Update API Rules for Users Collection

This is **CRITICAL** - without this, users can't see each other!

1. In PocketBase admin, go to **Collections**
2. Click on **users** collection
3. Click the **API Rules** tab
4. Update these rules:

**List/Search rule:**
```
@request.auth.id != ""
```

**View rule:**
```
@request.auth.id != ""
```

**What this means:** Any authenticated user can view other users' profiles (needed for connections).

5. Click **Save changes**

---

## Step 4: Verify Collections Exist

Go back to **Collections** in the sidebar. You should see:

- ✅ users (built-in)
- ✅ businesses
- ✅ connections
- ✅ messages
- ✅ opportunities
- ✅ opportunity_applications

**Total: 6 collections**

---

## Step 5: Test PocketBase API

Let's verify the API is working:

### Test 1: Health Check
Open in browser:
```
https://zil-connect.onrender.com/api/health
```

Expected response:
```json
{"code":200,"message":"","data":{"canBackup":true}}
```

### Test 2: Collections List
Open in browser:
```
https://zil-connect.onrender.com/api/collections
```

You should see JSON with all your collections listed.

### Test 3: Test Registration (Optional)

You can test user registration using your browser's developer tools or a tool like Postman:

**Endpoint:**
```
POST https://zil-connect.onrender.com/api/collections/users/records
```

**Body (JSON):**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "test123456",
  "passwordConfirm": "test123456"
}
```

If this works, you'll get a user object back!

---

## Step 6: Update Your Local .env

Your local `.env` file should point to the hosted PocketBase:

```bash
VITE_POCKETBASE_URL=https://zil-connect.onrender.com
```

✅ **This is already correct in your file!**

---

## Step 7: Test Locally with Remote Backend

Now you can run your frontend **locally** and it will connect to the **hosted PocketBase**:

1. Make sure `.env` has the URL above
2. Run locally:
   ```bash
   npm run dev
   ```
3. Open: http://localhost:5173
4. Try to register a new user
5. Create a business profile
6. Test all features

**This tests your hosted backend before you deploy the frontend!**

---

## Important Notes

### Free Tier Limitations
- Service sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- You'll see "Service Unavailable" briefly - this is normal
- Persistent disk keeps your data safe

### URLs to Remember

**PocketBase Admin:**
```
https://zil-connect.onrender.com/_/
```

**PocketBase API:**
```
https://zil-connect.onrender.com/api/
```

**Your Admin Login:**
- Email: (whatever you chose)
- Password: (save this somewhere safe!)

---

## Checklist

Complete setup checklist:

- [ ] Accessed https://zil-connect.onrender.com/_/
- [ ] Created admin account
- [ ] Imported/created all 6 collections
- [ ] Updated users collection API rules
- [ ] Tested health endpoint
- [ ] Updated local .env file
- [ ] Tested local frontend with remote backend
- [ ] Can register users successfully
- [ ] Can create business profiles

---

## When You're Ready to Deploy Frontend

When you want to host the frontend separately:

1. Choose your platform (Vercel, Netlify, Render Static Site, etc.)
2. Set environment variable: `VITE_POCKETBASE_URL=https://zil-connect.onrender.com`
3. Deploy!

---

## Need Help?

Tell me:
1. Can you access https://zil-connect.onrender.com/_/ ?
2. Did you create the admin account?
3. Which step are you on?
4. Any error messages?
