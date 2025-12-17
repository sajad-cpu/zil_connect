# Create Collections - Step by Step Guide

## The Problem with Import

The JSON import requires exact collection IDs which we don't have yet. So we'll create collections **manually** - it's simple!

## Step-by-Step Instructions

### Step 1: Access PocketBase Admin

Go to: https://zil-connect.onrender.com/_/

Login with your admin account.

---

### Collection 1: Create "businesses"

1. Click **Collections** in left sidebar
2. Click **New collection** (blue button)
3. Fill in:
   - **Name**: `businesses` (exactly this)
   - **Type**: Leave as "Base collection"
4. Click **New field** and add each field:

#### Field 1: business_name
- Type: **Text**
- Name: `business_name`
- Required: ✅ Check
- Min length: 1
- Max length: 255

#### Field 2: description
- Type: **Text**
- Name: `description`
- Required: ❌ Uncheck

#### Field 3: industry
- Type: **Text**
- Name: `industry`
- Required: ❌ Uncheck

#### Field 4: location
- Type: **Text**
- Name: `location`
- Required: ❌ Uncheck

#### Field 5: website
- Type: **URL**
- Name: `website`
- Required: ❌ Uncheck

#### Field 6: logo
- Type: **File**
- Name: `logo`
- Required: ❌ Uncheck
- Max select: 1
- Max size (bytes): 5242880 (that's 5MB)
- Mime types: Leave empty or add: image/jpeg, image/png, image/webp

#### Field 7: owner (IMPORTANT - Relation field)
- Type: **Relation**
- Name: `owner`
- Required: ✅ Check
- Select collection: **users**
- Max select: 1
- Cascade delete: ✅ Check

5. Click **API Rules** tab:
   - List/Search: `@request.auth.id != ""`
   - View: `@request.auth.id != ""`
   - Create: `@request.auth.id != ""`
   - Update: `owner = @request.auth.id`
   - Delete: `owner = @request.auth.id`

6. Click **Create** button

✅ Done! You created your first collection!

---

### Collection 2: Create "connections"

1. Click **New collection**
2. Name: `connections`
3. Add fields:

#### Field 1: user_from
- Type: **Relation**
- Name: `user_from`
- Required: ✅ Check
- Collection: **users**
- Max select: 1
- Cascade delete: ✅ Check

#### Field 2: user_to
- Type: **Relation**
- Name: `user_to`
- Required: ✅ Check
- Collection: **users**
- Max select: 1
- Cascade delete: ✅ Check

#### Field 3: business_from
- Type: **Relation**
- Name: `business_from`
- Required: ❌ Uncheck
- Collection: **businesses**
- Max select: 1

#### Field 4: business_to
- Type: **Relation**
- Name: `business_to`
- Required: ❌ Uncheck
- Collection: **businesses**
- Max select: 1

#### Field 5: status
- Type: **Text**
- Name: `status`
- Required: ✅ Check
- Max length: 50

#### Field 6: message
- Type: **Text**
- Name: `message`
- Required: ❌ Uncheck

4. **API Rules** tab:
   - List/Search: `@request.auth.id != ""`
   - View: `user_from = @request.auth.id || user_to = @request.auth.id`
   - Create: `@request.auth.id != ""`
   - Update: `user_to = @request.auth.id`
   - Delete: `user_from = @request.auth.id || user_to = @request.auth.id`

5. Click **Create**

✅ Connections collection created!

---

### Collection 3: Create "messages"

1. Click **New collection**
2. Name: `messages`
3. Add fields:

#### Field 1: sender
- Type: **Relation**
- Name: `sender`
- Required: ✅ Check
- Collection: **users**
- Max select: 1
- Cascade delete: ✅ Check

#### Field 2: receiver
- Type: **Relation**
- Name: `receiver`
- Required: ✅ Check
- Collection: **users**
- Max select: 1
- Cascade delete: ✅ Check

#### Field 3: connection
- Type: **Relation**
- Name: `connection`
- Required: ✅ Check
- Collection: **connections**
- Max select: 1
- Cascade delete: ✅ Check

#### Field 4: content
- Type: **Text**
- Name: `content`
- Required: ✅ Check
- Min length: 1

#### Field 5: read
- Type: **Bool**
- Name: `read`
- Required: ❌ Uncheck

4. **API Rules** tab:
   - List/Search: `@request.auth.id != ""`
   - View: `sender = @request.auth.id || receiver = @request.auth.id`
   - Create: `sender = @request.auth.id`
   - Update: `receiver = @request.auth.id`
   - Delete: `sender = @request.auth.id`

5. Click **Create**

✅ Messages collection created!

---

### Collection 4: Create "opportunities"

1. Click **New collection**
2. Name: `opportunities`
3. Add fields:

#### Field 1: title
- Type: **Text**
- Name: `title`
- Required: ✅ Check
- Min length: 1
- Max length: 255

#### Field 2: description
- Type: **Text**
- Name: `description`
- Required: ✅ Check
- Min length: 1

#### Field 3: business
- Type: **Relation**
- Name: `business`
- Required: ✅ Check
- Collection: **businesses**
- Max select: 1
- Cascade delete: ✅ Check

#### Field 4: created_by
- Type: **Relation**
- Name: `created_by`
- Required: ✅ Check
- Collection: **users**
- Max select: 1
- Cascade delete: ✅ Check

#### Field 5: type
- Type: **Text**
- Name: `type`
- Required: ❌ Uncheck
- Max length: 100

#### Field 6: status
- Type: **Text**
- Name: `status`
- Required: ❌ Uncheck
- Max length: 50

#### Field 7: deadline
- Type: **Date**
- Name: `deadline`
- Required: ❌ Uncheck

#### Field 8: requirements
- Type: **Text**
- Name: `requirements`
- Required: ❌ Uncheck

4. **API Rules** tab:
   - List/Search: `@request.auth.id != ""`
   - View: `@request.auth.id != ""`
   - Create: `@request.auth.id != ""`
   - Update: `created_by = @request.auth.id`
   - Delete: `created_by = @request.auth.id`

5. Click **Create**

✅ Opportunities collection created!

---

### Collection 5: Create "opportunity_applications"

1. Click **New collection**
2. Name: `opportunity_applications`
3. Add fields:

#### Field 1: opportunity
- Type: **Relation**
- Name: `opportunity`
- Required: ✅ Check
- Collection: **opportunities**
- Max select: 1
- Cascade delete: ✅ Check

#### Field 2: applicant
- Type: **Relation**
- Name: `applicant`
- Required: ✅ Check
- Collection: **users**
- Max select: 1
- Cascade delete: ✅ Check

#### Field 3: business
- Type: **Relation**
- Name: `business`
- Required: ❌ Uncheck
- Collection: **businesses**
- Max select: 1

#### Field 4: status
- Type: **Text**
- Name: `status`
- Required: ❌ Uncheck
- Max length: 50

#### Field 5: cover_letter
- Type: **Text**
- Name: `cover_letter`
- Required: ❌ Uncheck

#### Field 6: resume
- Type: **File**
- Name: `resume`
- Required: ❌ Uncheck
- Max select: 1
- Max size: 10485760 (10MB)
- Mime types: application/pdf

4. **API Rules** tab:
   - List/Search: `@request.auth.id != ""`
   - View: `applicant = @request.auth.id`
   - Create: `applicant = @request.auth.id`
   - Update: `applicant = @request.auth.id`
   - Delete: `applicant = @request.auth.id`

5. Click **Create**

✅ All collections created!

---

## FINAL STEP: Update Users Collection (VERY IMPORTANT!)

1. Go to **Collections** → click on **users** (the built-in one)
2. Click **API Rules** tab
3. Find these two rules and update them:

   **List/Search rule:**
   - Delete existing rule
   - Enter: `@request.auth.id != ""`

   **View rule:**
   - Delete existing rule
   - Enter: `@request.auth.id != ""`

4. Click **Save changes**

**Why?** This allows authenticated users to view other users' profiles (needed for connections).

---

## Verify Your Setup

You should now have **6 collections total**:

1. ✅ users (built-in)
2. ✅ businesses
3. ✅ connections
4. ✅ messages
5. ✅ opportunities
6. ✅ opportunity_applications

---

## Test It!

Run your local app:
```bash
npm run dev
```

Open http://localhost:5173 and try:
1. Register a new user
2. Create a business profile
3. It should work! 🎉

---

## Tips

- **Take your time** - each collection takes about 2-3 minutes
- **Double-check field names** - spelling matters!
- **Order matters** for relations:
  - Create `businesses` before `connections` (connections references businesses)
  - Create `connections` before `messages` (messages references connections)
  - Create `opportunities` before `opportunity_applications`

---

## Estimated Time

- Collection 1 (businesses): 3 minutes
- Collection 2 (connections): 4 minutes
- Collection 3 (messages): 3 minutes
- Collection 4 (opportunities): 4 minutes
- Collection 5 (opportunity_applications): 3 minutes
- Update users rules: 1 minute

**Total: About 18-20 minutes**

---

## Need Help?

If you get stuck on any step, let me know which collection and which field you're on!
