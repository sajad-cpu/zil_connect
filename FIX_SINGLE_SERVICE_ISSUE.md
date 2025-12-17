# Fix: PocketBase and Frontend on Same Service

## Current Situation ✅ Diagnosis Complete

From your logs, I can see:
- **Service name**: `zilconnect`
- **What's running**: PocketBase (backend)
- **URL**: https://zil-connect.onrender.com
- **Status**: PocketBase is working! ✅
- **Problem**: Frontend is not deployed

### Proof PocketBase is Working:
```
Server started at http://0.0.0.0:8090
├─ REST API: http://0.0.0.0:8090/api/
└─ Admin UI: http://0.0.0.0:8090/_/
```

## What You Need

You need **2 separate services**:

1. **Backend Service** (PocketBase) - ✅ You have this!
   - Current name: `zilconnect`
   - URL: https://zil-connect.onrender.com
   - Serves: PocketBase API + Admin

2. **Frontend Service** (React) - ❌ You need to create this!
   - Name: `zil-connect-frontend`
   - URL: Will be something like https://zil-connect-frontend.onrender.com
   - Serves: Your React application

## Step-by-Step Fix

### Option 1: Keep Current Setup (Recommended)

Since PocketBase is already working, let's keep it and just add the frontend:

#### Step 1: Access PocketBase Admin (Do This Now!)

Your PocketBase is live! Access the admin:

```
https://zil-connect.onrender.com/_/
```

1. You should see the PocketBase login page
2. Create an admin account:
   - Email: your-email@example.com
   - Password: (choose a strong password)
3. **Don't close this tab** - we'll use it later

#### Step 2: Create Frontend Service

Now create a **second service** for React:

1. Go to Render Dashboard: https://dashboard.render.com/
2. Click **New +** → **Web Service**
3. Connect your `zil-connect` repository
4. Configure:

```
Name: zil-connect-frontend
Region: (same as your pocketbase service)
Branch: main

Runtime: Node
Build Command: npm install && npm run build
Start Command: npm run preview

Instance Type: Free
Auto-Deploy: Yes
```

5. **Add Environment Variable**:
   - Key: `VITE_POCKETBASE_URL`
   - Value: `https://zil-connect.onrender.com`

6. Click **Create Web Service**

7. Wait 5-10 minutes for deployment

#### Step 3: Update Your Local .env File

Update your local `.env` to match:

```bash
VITE_POCKETBASE_URL=https://zil-connect.onrender.com
```

This is already correct in your file! ✅

#### Step 4: Setup PocketBase Collections

Go back to the PocketBase admin tab (https://zil-connect.onrender.com/_/):

1. Click **Settings** (gear icon) → **Sync** tab
2. Click **Import collections**
3. Copy the content from your `backup-pocketbase.md` file
4. Paste it into the import box
5. Click **Review** → **Confirm**

#### Step 5: Update Users Collection Rules

Still in PocketBase admin:

1. Go to **Collections** → **users**
2. Click **API Rules** tab
3. Update:
   - **List/Search rule**: `@request.auth.id != ""`
   - **View rule**: `@request.auth.id != ""`
4. Click **Save changes**

#### Step 6: Test Everything!

Once the frontend service shows "Live":

**Frontend URL**: https://zil-connect-frontend.onrender.com (or whatever Render gave you)
**Backend URL**: https://zil-connect.onrender.com

1. Open the frontend URL
2. Try to register a new account
3. Create a business profile
4. Search for businesses
5. Test connections

---

### Option 2: Start Fresh (Alternative)

If you want cleaner naming:

1. **Delete** the current `zilconnect` service
2. Use the **Blueprint** method to create both services with correct names:
   - Go to Render Dashboard → **New +** → **Blueprint**
   - Connect your `zil-connect` repo
   - Render will read `render.yaml` and create:
     - `zil-connect-pocketbase` (backend)
     - `zil-connect-frontend` (frontend)

---

## Quick Reference

### Current URLs (After Step 2 Completes):

**PocketBase (Backend):**
- Base: https://zil-connect.onrender.com/
- Admin: https://zil-connect.onrender.com/_/
- API: https://zil-connect.onrender.com/api/

**React (Frontend):**
- App: https://zil-connect-frontend.onrender.com/

### Services in Render Dashboard:

After you're done, you should see:
1. `zilconnect` (or `zil-connect-pocketbase`) - Docker service
2. `zil-connect-frontend` - Node service

---

## What to Do Right Now

1. ✅ **Access PocketBase Admin**: https://zil-connect.onrender.com/_/
   - Create admin account
   - Import collections
   - Update users API rules

2. 🔄 **Create Frontend Service** using Step 2 above

3. ✅ **Test** when both services are live

---

## Verification Checklist

- [ ] Can access PocketBase admin at https://zil-connect.onrender.com/_/
- [ ] Admin account created in PocketBase
- [ ] Collections imported (6 total: businesses, connections, messages, opportunities, opportunity_applications, + users)
- [ ] Users API rules updated
- [ ] Frontend service created and shows "Live"
- [ ] Can access React app at frontend URL
- [ ] Can register a new user
- [ ] Can create business profile

---

## Tell Me:

1. Can you access https://zil-connect.onrender.com/_/ and see the PocketBase login?
2. Do you want to keep the current setup (Option 1) or start fresh (Option 2)?
