# Fix 404 Error - Setup PocketBase Collections

## Current Issue
- Frontend: https://zil-connect.onrender.com/ ✅ Working
- Backend: https://zil-connect-pocketbase.onrender.com ✅ Deployed
- **Error**: `{"code":404,"message":"Not Found.","data":{}}`
- **Cause**: Collections don't exist in deployed PocketBase

## Step 1: Access PocketBase Admin

1. Open your browser and go to:
   ```
   https://zil-connect-pocketbase.onrender.com/_/
   ```

2. You should see the PocketBase admin login page

3. **First time setup**: Create an admin account
   - Email: your-email@example.com
   - Password: (choose a strong password)

## Step 2: Create Collections

You have **TWO OPTIONS**:

### Option A: Import Collections (Recommended - Faster)

1. In PocketBase admin, go to **Settings** (gear icon)
2. Click **Sync** tab
3. Click **Import collections**
4. Copy and paste the schema from `backup-pocketbase.md` file
5. Click **Review** then **Confirm**

### Option B: Manual Creation

If import doesn't work, create each collection manually:

#### 1. Users Collection (Already exists, just update rules)
- Go to Collections → users
- Click **API Rules** tab
- Update these rules:
  - **List/Search rule**: `@request.auth.id != ""`
  - **View rule**: `@request.auth.id != ""`
- Click **Save changes**

#### 2. Businesses Collection
1. Click **New collection**
2. Name: `businesses`
3. Type: Base collection
4. Add fields:
   - `name` (text, required)
   - `description` (text)
   - `industry` (text)
   - `location` (text)
   - `website` (url)
   - `logo` (file, single)
   - `owner` (relation to users, required)
5. API Rules (set all to allow authenticated users):
   - List: `@request.auth.id != ""`
   - View: `@request.auth.id != ""`
   - Create: `@request.auth.id != ""`
   - Update: `owner = @request.auth.id`
   - Delete: `owner = @request.auth.id`

#### 3. Connections Collection
1. Click **New collection**
2. Name: `connections`
3. Add fields:
   - `user_from` (relation to users, required)
   - `user_to` (relation to users, required)
   - `business_from` (relation to businesses)
   - `business_to` (relation to businesses)
   - `status` (text, required) - default: "pending"
   - `message` (text)
4. API Rules:
   - List: `@request.auth.id != ""`
   - View: `user_from = @request.auth.id || user_to = @request.auth.id`
   - Create: `@request.auth.id != ""`
   - Update: `user_to = @request.auth.id`
   - Delete: `user_from = @request.auth.id || user_to = @request.auth.id`

#### 4. Messages Collection
1. Click **New collection**
2. Name: `messages`
3. Add fields:
   - `sender` (relation to users, required)
   - `receiver` (relation to users, required)
   - `connection` (relation to connections, required)
   - `content` (text, required)
   - `read` (bool) - default: false
4. API Rules:
   - List: `@request.auth.id != ""`
   - View: `sender = @request.auth.id || receiver = @request.auth.id`
   - Create: `sender = @request.auth.id`
   - Update: `receiver = @request.auth.id`
   - Delete: `sender = @request.auth.id`

#### 5. Opportunities Collection
1. Click **New collection**
2. Name: `opportunities`
3. Add fields:
   - `title` (text, required)
   - `description` (text, required)
   - `business` (relation to businesses, required)
   - `created_by` (relation to users, required)
   - `type` (text) - e.g., "job", "partnership", "investment"
   - `status` (text) - default: "open"
   - `deadline` (date)
   - `requirements` (text)
4. API Rules:
   - List: `@request.auth.id != ""`
   - View: `@request.auth.id != ""`
   - Create: `@request.auth.id != ""`
   - Update: `created_by = @request.auth.id`
   - Delete: `created_by = @request.auth.id`

#### 6. Opportunity Applications Collection
1. Click **New collection**
2. Name: `opportunity_applications`
3. Add fields:
   - `opportunity` (relation to opportunities, required)
   - `applicant` (relation to users, required)
   - `business` (relation to businesses)
   - `status` (text) - default: "pending"
   - `cover_letter` (text)
   - `resume` (file, single)
4. API Rules:
   - List: `@request.auth.id != ""`
   - View: `applicant = @request.auth.id`
   - Create: `applicant = @request.auth.id`
   - Update: `applicant = @request.auth.id`
   - Delete: `applicant = @request.auth.id`

## Step 3: Test the Application

1. Go to https://zil-connect.onrender.com/
2. Click **Sign Up**
3. Create a test account:
   - Email: test@example.com
   - Password: test123456
   - Username: testuser

4. If registration works, you should see the home page!

## Step 4: Complete Testing

After registration works:

1. **Create a business profile**:
   - Fill in business details
   - Upload a logo (optional)

2. **Test with second account**:
   - Open an incognito window
   - Go to https://zil-connect.onrender.com/
   - Create another test account
   - Create a business profile

3. **Test connections**:
   - Search for businesses
   - Send connection request
   - Switch to other account
   - Accept connection request

4. **Test messaging**:
   - Send messages between connected users

## Troubleshooting

### Still getting 404?
- Make sure you created all 6 collections
- Check that API rules are set correctly
- Clear browser cache and try again

### Can't access PocketBase admin?
- Wait 2-3 minutes for Render to fully deploy
- Check Render dashboard for deployment status
- Look at logs in Render dashboard for errors

### Frontend can't connect to backend?
- Verify `.env` file has: `VITE_POCKETBASE_URL=https://zil-connect-pocketbase.onrender.com`
- Make sure you redeployed frontend after updating .env
- Check browser console for CORS errors

## Quick Checklist

- [ ] Accessed https://zil-connect-pocketbase.onrender.com/_/
- [ ] Created admin account
- [ ] Created/imported all collections
- [ ] Updated users collection API rules
- [ ] Tested registration at https://zil-connect.onrender.com/
- [ ] Created test business profile
- [ ] Tested connection request flow
- [ ] Tested messaging

## Next Steps After Setup

Once everything works:
1. Create your real business profile
2. Invite real users to test
3. Monitor Render logs for any errors
4. Consider upgrading from free tier for production use
