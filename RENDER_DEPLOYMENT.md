# Render Deployment Checklist

## Pre-Deployment
- [x] Created `Dockerfile.pocketbase`
- [x] Created `render.yaml` blueprint
- [x] Updated `package.json` preview script
- [ ] Push code to GitHub

## Deploy PocketBase
1. [ ] Go to https://dashboard.render.com/
2. [ ] Create New Web Service
3. [ ] Connect GitHub repo
4. [ ] Configure:
   - Name: `business-connection-pocketbase`
   - Runtime: Docker
   - Dockerfile: `Dockerfile.pocketbase`
5. [ ] Add Persistent Disk:
   - Name: `pocketbase-data`
   - Mount Path: `/pb/pb_data`
   - Size: 1GB
6. [ ] Deploy service
7. [ ] Copy the URL (e.g., `https://business-connection-pocketbase.onrender.com`)

## Deploy React App
1. [ ] Update `.env` with PocketBase URL
2. [ ] Push changes to GitHub
3. [ ] Create New Static Site on Render
4. [ ] Configure:
   - Name: `business-connection`
   - Build: `npm install && npm run build`
   - Publish: `dist`
   - Environment Variable:
     - `VITE_POCKETBASE_URL` = Your PocketBase URL
5. [ ] Deploy site
6. [ ] Copy the frontend URL (e.g., `https://business-connection.onrender.com`)

## Post-Deployment
1. [ ] Access PocketBase admin: `https://your-pocketbase-url/_/`
2. [ ] Create admin account
3. [ ] Import collections (use Settings → Sync → Import)
4. [ ] Update API rules for `users` collection:
   - List/Search: `@request.auth.id != ""`
   - View: `@request.auth.id != ""`
5. [ ] Test frontend at your Render URL
6. [ ] Test all features:
   - [ ] User registration
   - [ ] Login
   - [ ] Create business profile
   - [ ] Search businesses
   - [ ] Send connection request
   - [ ] Accept connection
   - [ ] Send messages
   - [ ] Create opportunity
   - [ ] Apply to opportunity

## Troubleshooting
- If PocketBase doesn't start: Check logs in Render dashboard
- If frontend can't connect: Verify `VITE_POCKETBASE_URL` is correct
- If data is lost: Ensure persistent disk is mounted to `/pb/pb_data`
- If build fails: Check Node version (Render uses Node 20 by default)

## Costs
- **Free Tier**: 750 hours/month (enough for 1 service 24/7)
- **Starter**: $7/month per service (recommended for production)
- **Storage**: 1GB free for persistent disk
