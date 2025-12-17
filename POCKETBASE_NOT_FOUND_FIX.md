# PocketBase "Not Found" Error - Troubleshooting

## Problem
Accessing `https://zil-connect-pocketbase.onrender.com/_/` shows "Not Found"

## Possible Causes & Solutions

### Solution 1: Check Render Dashboard (Do this FIRST)

1. Go to https://dashboard.render.com/
2. Find your `zil-connect-pocketbase` service
3. Check the status:
   - **Building**: Wait for it to finish (takes 2-5 minutes)
   - **Deploy failed**: Check the logs for errors
   - **Live**: Service is running but there might be a different issue

4. Click on the service name to see details
5. Look at the **Logs** tab - what do you see?

### Solution 2: Verify the Service Exists

**Check if PocketBase service was created:**

1. In Render Dashboard, look for a service named `zil-connect-pocketbase`
2. If you DON'T see it, you need to create it manually

### Solution 3: Create PocketBase Service Manually

If the service doesn't exist, create it:

1. Go to https://dashboard.render.com/
2. Click **New +** → **Web Service**
3. Connect your GitHub repository `zil-connect`
4. Configure the service:

   **Basic Settings:**
   - Name: `zil-connect-pocketbase`
   - Region: Choose closest to you
   - Branch: `main` (or your default branch)
   - Runtime: **Docker**
   - Dockerfile Path: `./Dockerfile.pocketbase`

   **Important Settings:**
   - Instance Type: **Free** (or Starter if you prefer)
   - Auto-Deploy: **Yes**

5. **Add Persistent Disk** (VERY IMPORTANT):
   - Scroll down to "Disks" section
   - Click **Add Disk**
   - Name: `pocketbase-data`
   - Mount Path: `/pb/pb_data`
   - Size: `1` GB
   - Click **Add**

6. **Add Environment Variable**:
   - Click **Add Environment Variable**
   - Key: `PORT`
   - Value: `8090`

7. Click **Create Web Service**

8. Wait 5-10 minutes for deployment to complete

### Solution 4: Check Dockerfile

Let's verify the Dockerfile is correct:

```dockerfile
FROM alpine:latest

ARG PB_VERSION=0.22.0

RUN apk add --no-cache \
    unzip \
    ca-certificates

# Download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/ && \
    chmod +x /pb/pocketbase

# Create data directory
RUN mkdir -p /pb/pb_data

EXPOSE 8090

# Start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
```

This looks correct in your project.

### Solution 5: Common Deployment Issues

#### Issue A: Wrong URL
- Try accessing just the base URL without `/_/`:
  - https://zil-connect-pocketbase.onrender.com/
- You should see: `{"code":404,"message":"Not Found.","data":{}}`
- This is actually GOOD - it means PocketBase is running!
- Then try: https://zil-connect-pocketbase.onrender.com/_/

#### Issue B: Service Not Deployed
- In Render Dashboard, check if the service shows "Live" status
- If it says "Deploy failed", check the logs
- Common errors:
  - Docker build failed
  - Port already in use
  - Out of memory

#### Issue C: Wrong Port Configuration
- PocketBase needs to listen on the PORT environment variable
- Check that PORT=8090 is set in Render environment variables

### Solution 6: Alternative - Use Render Blueprint

If manual creation didn't work, try using the Blueprint:

1. Go to https://dashboard.render.com/
2. Click **New +** → **Blueprint**
3. Connect your GitHub repository `zil-connect`
4. Render will read `render.yaml` and create both services automatically
5. Review the services and click **Apply**

## Testing Steps

After creating/fixing the PocketBase service:

### Step 1: Check Base URL
```
https://zil-connect-pocketbase.onrender.com/
```
Expected: `{"code":404,"message":"Not Found.","data":{}}`
✅ This means PocketBase is running!

### Step 2: Check API Health
```
https://zil-connect-pocketbase.onrender.com/api/health
```
Expected: `{"code":200,"message":"","data":{"canBackup":true}}`

### Step 3: Access Admin
```
https://zil-connect-pocketbase.onrender.com/_/
```
Expected: PocketBase admin login page

## What to Check in Render Logs

Look for these messages in the logs:

✅ **Good messages:**
```
Server started at http://0.0.0.0:8090
```

❌ **Bad messages:**
```
Error: address already in use
Error: permission denied
Error: cannot download pocketbase
```

## Quick Diagnostic

Run through this checklist:

1. [ ] Render Dashboard shows service exists
2. [ ] Service status is "Live" (green)
3. [ ] Base URL returns JSON (not 404 HTML)
4. [ ] Logs show "Server started at..."
5. [ ] Persistent disk is attached
6. [ ] Environment variable PORT=8090 is set

## Next Steps Based on What You See

### If base URL works but admin doesn't:
- This is unusual - contact Render support

### If nothing works:
- Delete the service and recreate it
- Make sure Dockerfile.pocketbase is committed to GitHub
- Use Blueprint method instead

### If you see deployment errors:
- Share the error message from logs
- We can troubleshoot the specific error

## Important Notes

- **Free tier spins down after 15 minutes of inactivity**
- First request after spin-down takes 30-60 seconds
- If you see "Service Unavailable", wait and refresh
- Persistent disk ensures data survives restarts

## Share With Me

Please tell me:
1. Do you see `zil-connect-pocketbase` in your Render Dashboard?
2. What is its current status? (Building/Live/Failed)
3. What do you see in the Logs tab?
4. What happens when you visit just https://zil-connect-pocketbase.onrender.com/ (without the `/_/`)?
