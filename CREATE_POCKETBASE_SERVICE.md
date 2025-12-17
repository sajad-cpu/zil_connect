# How to Create PocketBase Service on Render

## Problem
You only deployed the frontend (`zil-connect-frontend`), but PocketBase backend doesn't exist yet.

## Solution: Create PocketBase Service Manually

### Step-by-Step Instructions:

#### 1. Go to Render Dashboard
Open: https://dashboard.render.com/

#### 2. Click "New +" Button
- Look for the blue **New +** button in the top right
- Click it

#### 3. Select "Web Service"
- From the dropdown, choose **Web Service**

#### 4. Connect Your Repository
- If you see your `zil-connect` repo, click **Connect**
- If you don't see it:
  - Click **Configure account**
  - Give Render permission to access your GitHub repo
  - Come back and click **Connect** on `zil-connect`

#### 5. Configure the Service

Fill in these settings **EXACTLY**:

**Basic Information:**
```
Name: zil-connect-pocketbase
Region: (Choose any, preferably same as frontend)
Branch: main
```

**Build & Deploy:**
```
Runtime: Docker
Dockerfile Path: ./Dockerfile.pocketbase
```

**Instance Type:**
```
Instance Type: Free
```

**Auto-Deploy:**
```
Auto-Deploy: Yes
```

#### 6. Add Environment Variable (IMPORTANT)

Scroll down to **Environment Variables** section:
- Click **Add Environment Variable**
- Key: `PORT`
- Value: `8090`
- Click anywhere outside to save

#### 7. Add Persistent Disk (VERY IMPORTANT - Don't Skip!)

Scroll down to **Disks** section:
- Click **Add Disk**
- Fill in:
  ```
  Name: pocketbase-data
  Mount Path: /pb/pb_data
  Size: 1
  ```
- Click **Add Disk** button

**Why this is important:** Without the disk, your database will be deleted every time the service restarts!

#### 8. Create the Service
- Scroll to the bottom
- Click **Create Web Service** button

#### 9. Wait for Deployment
- You'll see a log screen showing the build process
- Wait 5-10 minutes for deployment to complete
- Look for messages like:
  ```
  ==> Downloading PocketBase...
  ==> Starting service...
  Server started at http://0.0.0.0:8090
  ```

#### 10. Verify It's Working

Once you see "Live" status:

**Test 1: Base URL**
```
https://zil-connect-pocketbase.onrender.com/
```
Should show: `{"code":404,"message":"Not Found.","data":{}}`

**Test 2: Health Check**
```
https://zil-connect-pocketbase.onrender.com/api/health
```
Should show: `{"code":200,"message":"","data":{...}}`

**Test 3: Admin Panel**
```
https://zil-connect-pocketbase.onrender.com/_/
```
Should show: PocketBase login page

## Visual Checklist

Before clicking "Create Web Service", verify:

- [ ] Name is `zil-connect-pocketbase` (exact spelling)
- [ ] Runtime is **Docker** (not Node)
- [ ] Dockerfile Path is `./Dockerfile.pocketbase`
- [ ] Instance Type is **Free**
- [ ] Environment Variable `PORT=8090` is added
- [ ] Disk is added:
  - [ ] Name: `pocketbase-data`
  - [ ] Mount Path: `/pb/pb_data`
  - [ ] Size: 1 GB
- [ ] Auto-Deploy is **Yes**

## After Service is Created

Once it shows "Live" status:

1. Go to: https://zil-connect-pocketbase.onrender.com/_/
2. Create admin account (first time only)
3. Import collections from `backup-pocketbase.md`
4. Test your frontend: https://zil-connect.onrender.com/

## Troubleshooting

### Build Fails
- Check logs for errors
- Make sure `Dockerfile.pocketbase` exists in your repo
- Make sure you pushed latest code to GitHub

### Service Starts But Admin Not Found
- Wait 2-3 minutes after "Live" status
- Try refreshing the page
- Check if base URL returns JSON

### Disk Not Attached
- Go to service settings
- Click **Disks** tab
- Verify disk is listed and mounted to `/pb/pb_data`

## Important Notes

- **Free tier sleeps after 15 minutes** of no activity
- First request after sleep takes 30-60 seconds to wake up
- You'll see "Service Unavailable" during wake-up - this is normal
- Persistent disk keeps your data even when service sleeps

## Need Help?

If you get stuck:
1. Share a screenshot of the Render service creation page
2. Share any error messages from the logs
3. Tell me what step you're stuck on
