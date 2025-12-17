# Fixed: Wrong PocketBase URL

## The Problem ❌

Your `.env` file had the wrong URL:
```bash
VITE_POCKETBASE_URL=https://zil-connect-pocketbase.onrender.com
```

But your actual PocketBase service is at:
```bash
https://zil-connect.onrender.com
```

## The Fix ✅

Updated `.env` to:
```bash
VITE_POCKETBASE_URL=https://zil-connect.onrender.com
```

## What You Need to Do Now

### 1. Restart Your Dev Server

If you have `npm run dev` running, **stop it** (Ctrl+C) and restart:

```bash
npm run dev
```

This will pick up the new URL from `.env`

### 2. Access PocketBase Admin

Open this URL to setup your backend:
```
https://zil-connect.onrender.com/_/
```

You should see the PocketBase admin login page.

**First time:** Create an admin account (email + password)

### 3. Import Collections

Once logged into PocketBase admin:

1. Click **Settings** (gear icon) → **Sync** tab
2. Click **Import collections**
3. Copy the JSON from your `backup-pocketbase.md` file
4. Paste it and click **Review** → **Confirm**

### 4. Update Users Collection API Rules

1. Go to **Collections** → **users**
2. Click **API Rules** tab
3. Set both **List/Search** and **View** to:
   ```
   @request.auth.id != ""
   ```
4. Click **Save changes**

### 5. Test Your App

Now try your app at http://localhost:5173:
- Register a new user
- Create a business profile
- Search for businesses

It should now connect to the hosted PocketBase!

## Correct URLs

**Your PocketBase Backend:**
- Base URL: `https://zil-connect.onrender.com`
- Admin: `https://zil-connect.onrender.com/_/`
- API: `https://zil-connect.onrender.com/api/`

**Your Local Frontend:**
- Development: `http://localhost:5173`

## Quick Test

After restarting dev server, open browser console and check:
```javascript
console.log(import.meta.env.VITE_POCKETBASE_URL)
```

Should show: `https://zil-connect.onrender.com`

## Next Steps

1. ✅ `.env` file updated
2. 🔄 Restart dev server (`npm run dev`)
3. 📝 Setup PocketBase admin at https://zil-connect.onrender.com/_/
4. ✨ Test your app!
