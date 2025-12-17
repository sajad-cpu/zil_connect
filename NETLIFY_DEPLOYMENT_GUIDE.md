# Deploy to Netlify - Complete Guide

## ✅ Build Completed!

Your production build is ready in the `dist` folder!

Build stats:
- ✅ index.html: 0.48 kB
- ✅ CSS: 95.08 kB (15.44 kB gzipped)
- ✅ JavaScript: 1,318.78 kB (365.85 kB gzipped)

---

## Deployment Methods

You have **3 options** to deploy to Netlify:

### Option 1: Netlify Drop (Easiest - No Git Required)

**Perfect for quick deployment!**

1. **Go to Netlify Drop**
   - Open: https://app.netlify.com/drop
   - (You'll need to create a free Netlify account if you don't have one)

2. **Drag and Drop**
   - Find the `dist` folder in your project
   - Drag the entire `dist` folder onto the Netlify drop zone
   - Wait for upload (takes about 30 seconds)

3. **Done!**
   - Netlify will give you a URL like: `https://random-name-123456.netlify.app`
   - You can customize this URL in site settings

4. **Set Environment Variable**
   - In Netlify dashboard, go to your site
   - Click **Site settings** → **Environment variables**
   - Click **Add a variable**
   - Key: `VITE_POCKETBASE_URL`
   - Value: `https://zil-connect.onrender.com`
   - Click **Save**
   - Click **Deploys** → **Trigger deploy** → **Deploy site**

---

### Option 2: Netlify CLI (Recommended)

**Best for repeated deployments!**

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```
   This will open your browser to authorize.

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

4. **Follow prompts:**
   - Create & configure a new site? **Yes**
   - Team: (Choose your team)
   - Site name: `zil-connect` (or any name you want)
   - Publish directory: `dist`

5. **Set Environment Variable**
   ```bash
   netlify env:set VITE_POCKETBASE_URL https://zil-connect.onrender.com
   ```

6. **Redeploy with env vars**
   ```bash
   npm run build
   netlify deploy --prod
   ```

7. **Done!** You'll get a URL like:
   ```
   https://zil-connect.netlify.app
   ```

---

### Option 3: GitHub Integration (Best for Teams)

**Automatic deployments on every git push!**

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push
   ```

2. **Connect to Netlify**
   - Go to: https://app.netlify.com/
   - Click **Add new site** → **Import an existing project**
   - Choose **GitHub**
   - Authorize Netlify
   - Select your `zil-connect` repository

3. **Configure build settings:**
   - Branch to deploy: `main`
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click **Show advanced** → **New variable**
     - Key: `VITE_POCKETBASE_URL`
     - Value: `https://zil-connect.onrender.com`

4. **Deploy site**
   - Click **Deploy site**
   - Wait 2-3 minutes for build

5. **Done!**
   - Every time you push to GitHub, Netlify auto-deploys
   - You'll get a URL like: `https://zil-connect.netlify.app`

---

## Important Files Created

I've created these files to help with deployment:

1. **`netlify.toml`** - Netlify configuration
   - Sets build command
   - Sets publish directory
   - Configures redirects for React Router

2. **`_redirects`** - Backup redirect rules
   - Ensures all routes work with client-side routing

3. **`dist/`** folder - Your production build
   - Ready to deploy!

---

## Environment Variables

**CRITICAL:** You must set this environment variable in Netlify:

```
VITE_POCKETBASE_URL=https://zil-connect.onrender.com
```

### How to set in Netlify Dashboard:

1. Go to your site in Netlify
2. **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Enter key and value
5. Click **Save**
6. **Important:** Redeploy your site after adding env vars!

---

## Custom Domain (Optional)

Want to use your own domain like `myapp.com`?

1. In Netlify dashboard, go to **Domain settings**
2. Click **Add custom domain**
3. Enter your domain
4. Follow DNS instructions to point your domain to Netlify

---

## Testing Your Deployed Site

After deployment:

1. **Open your Netlify URL**
   - Example: `https://zil-connect.netlify.app`

2. **Test these features:**
   - [ ] Homepage loads
   - [ ] User registration works
   - [ ] User login works
   - [ ] Create business profile
   - [ ] Search businesses
   - [ ] Send connection request
   - [ ] View messages

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for any errors
   - Verify PocketBase URL is correct:
     ```javascript
     console.log(import.meta.env.VITE_POCKETBASE_URL)
     ```

---

## Troubleshooting

### Issue: "404 Not Found" on page refresh

**Solution:** The `netlify.toml` and `_redirects` files should fix this. If not:
1. Check that `netlify.toml` is in your project root
2. Check that the `_redirects` file is copied to the `dist` folder during build

### Issue: "Cannot connect to PocketBase"

**Solution:**
1. Check environment variable is set in Netlify
2. Redeploy after setting env vars
3. Check browser console for the actual URL being used
4. Verify PocketBase is running at `https://zil-connect.onrender.com`

### Issue: Build fails on Netlify

**Solution:**
1. Check that `package.json` has all dependencies
2. Make sure Node version is compatible (Netlify uses Node 20 by default)
3. Check build logs in Netlify dashboard for specific errors

### Issue: App loads but shows blank page

**Solution:**
1. Check browser console for errors
2. Verify all routes are defined in your React Router
3. Check that `index.html` is in the `dist` folder

---

## Updating Your Deployed Site

### If using Netlify Drop:
- Run `npm run build` locally
- Drag and drop the new `dist` folder

### If using Netlify CLI:
```bash
npm run build
netlify deploy --prod
```

### If using GitHub integration:
```bash
git add .
git commit -m "Update app"
git push
```
Netlify will auto-deploy!

---

## Cost

**Netlify Free Tier includes:**
- ✅ 100 GB bandwidth/month
- ✅ Unlimited sites
- ✅ HTTPS (SSL) included
- ✅ Custom domain support
- ✅ Continuous deployment from Git

This is more than enough for your app!

---

## Quick Start (Recommended Path)

**For fastest deployment, use Option 1 (Netlify Drop):**

1. Open: https://app.netlify.com/drop
2. Drag the `dist` folder from your project
3. Wait 30 seconds
4. Set environment variable (see guide above)
5. Trigger redeploy
6. Done! ✨

**Your URLs:**
- Frontend: `https://your-site-name.netlify.app`
- Backend: `https://zil-connect.onrender.com`
- PocketBase Admin: `https://zil-connect.onrender.com/_/`

---

## Next Steps After Deployment

1. ✅ Test all features on live site
2. ✅ Share URL with users for feedback
3. ✅ Setup custom domain (optional)
4. ✅ Monitor Netlify analytics
5. ✅ Setup PocketBase collections (if not done yet)

---

## Need Help?

If you run into any issues:
1. Check Netlify deploy logs
2. Check browser console for errors
3. Verify environment variables are set
4. Make sure PocketBase backend is running

Let me know if you need help with any step!
