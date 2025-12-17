# 🚀 Quick Deploy to Netlify

## ✅ Build is Ready!

Your `dist` folder is ready to deploy!

---

## Fastest Method (2 minutes)

### 1. Go to Netlify Drop
👉 **https://app.netlify.com/drop**

### 2. Drag & Drop
- Drag the **`dist`** folder from your project
- Drop it on the website
- Wait 30 seconds ⏳

### 3. Set Environment Variable
- Click **Site settings** → **Environment variables**
- Add variable:
  - **Key**: `VITE_POCKETBASE_URL`
  - **Value**: `https://zil-connect.onrender.com`
- Save

### 4. Redeploy
- Go to **Deploys** tab
- Click **Trigger deploy** → **Deploy site**
- Wait 1 minute ⏳

### 5. Done! 🎉
You'll get a URL like:
```
https://random-name-123456.netlify.app
```

---

## Your URLs After Deployment

| Service | URL |
|---------|-----|
| **Frontend (Netlify)** | `https://your-site.netlify.app` |
| **Backend (Render)** | `https://zil-connect.onrender.com` |
| **PocketBase Admin** | `https://zil-connect.onrender.com/_/` |

---

## Test Checklist

After deployment, test:
- [ ] Homepage loads
- [ ] User registration
- [ ] User login
- [ ] Create business profile
- [ ] Search businesses
- [ ] Connection requests
- [ ] Messaging

---

## Files Created

- ✅ **`dist/`** - Production build (ready to deploy)
- ✅ **`netlify.toml`** - Netlify config
- ✅ **`_redirects`** - Redirect rules (copied to dist/)
- ✅ **`NETLIFY_DEPLOYMENT_GUIDE.md`** - Full guide with all options

---

## Need Help?

See the full guide: **NETLIFY_DEPLOYMENT_GUIDE.md**

Or just drag the `dist` folder to https://app.netlify.com/drop! 🚀
