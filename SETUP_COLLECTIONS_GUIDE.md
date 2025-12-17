# How to Setup Collections in Hosted PocketBase

## Two Methods Available

### Method 1: Import Schema (Fastest - Recommended)

This creates all 5 collections at once.

#### Step-by-Step:

1. **Access PocketBase Admin**
   ```
   https://zil-connect.onrender.com/_/
   ```
   - Login with your admin account
   - (If first time, create admin account)

2. **Go to Settings**
   - Click the **Settings** gear icon in the left sidebar

3. **Open Sync Tab**
   - Click the **Sync** tab at the top

4. **Import Collections**
   - Click the **Import collections** button
   - A text box will appear

5. **Copy Schema**
   - Open the file: `POCKETBASE_COLLECTIONS_SCHEMA.json` in your project
   - Copy **ALL** the content (it's a JSON array)

6. **Paste and Confirm**
   - Paste the JSON into the import box
   - Click **Review**
   - You should see 5 collections being created:
     - ✅ businesses
     - ✅ connections
     - ✅ messages
     - ✅ opportunities
     - ✅ opportunity_applications
   - Click **Confirm**

7. **Done!** All collections are created with correct:
   - Fields
   - Field types
   - Relations
   - API rules

---

### Method 2: Manual Creation (If Import Doesn't Work)

Create each collection one by one:

#### Collection 1: businesses

1. Click **Collections** → **New collection**
2. Name: `businesses`
3. Type: **Base collection**
4. Add these fields (click **New field** for each):

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| name | Text | ✅ Yes | Max: 255 |
| description | Text | ❌ No | - |
| industry | Text | ❌ No | Max: 255 |
| location | Text | ❌ No | Max: 255 |
| website | URL | ❌ No | - |
| logo | File | ❌ No | Max size: 5MB, Images only, Single file |
| owner | Relation | ✅ Yes | Collection: users, Single |

5. **API Rules** tab:
   - List: `@request.auth.id != ""`
   - View: `@request.auth.id != ""`
   - Create: `@request.auth.id != ""`
   - Update: `owner = @request.auth.id`
   - Delete: `owner = @request.auth.id`

6. Click **Create**

#### Collection 2: connections

1. **New collection** → Name: `connections`
2. Add fields:

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| user_from | Relation | ✅ Yes | Collection: users, Single |
| user_to | Relation | ✅ Yes | Collection: users, Single |
| business_from | Relation | ❌ No | Collection: businesses, Single |
| business_to | Relation | ❌ No | Collection: businesses, Single |
| status | Text | ✅ Yes | Max: 50 |
| message | Text | ❌ No | - |

3. **API Rules**:
   - List: `@request.auth.id != ""`
   - View: `user_from = @request.auth.id || user_to = @request.auth.id`
   - Create: `@request.auth.id != ""`
   - Update: `user_to = @request.auth.id`
   - Delete: `user_from = @request.auth.id || user_to = @request.auth.id`

4. **Create**

#### Collection 3: messages

1. **New collection** → Name: `messages`
2. Add fields:

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| sender | Relation | ✅ Yes | Collection: users, Single |
| receiver | Relation | ✅ Yes | Collection: users, Single |
| connection | Relation | ✅ Yes | Collection: connections, Single |
| content | Text | ✅ Yes | Min: 1 |
| read | Bool | ❌ No | Default: false |

3. **API Rules**:
   - List: `@request.auth.id != ""`
   - View: `sender = @request.auth.id || receiver = @request.auth.id`
   - Create: `sender = @request.auth.id`
   - Update: `receiver = @request.auth.id`
   - Delete: `sender = @request.auth.id`

4. **Create**

#### Collection 4: opportunities

1. **New collection** → Name: `opportunities`
2. Add fields:

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| title | Text | ✅ Yes | Min: 1, Max: 255 |
| description | Text | ✅ Yes | Min: 1 |
| business | Relation | ✅ Yes | Collection: businesses, Single |
| created_by | Relation | ✅ Yes | Collection: users, Single |
| type | Text | ❌ No | Max: 100 |
| status | Text | ❌ No | Max: 50 |
| deadline | Date | ❌ No | - |
| requirements | Text | ❌ No | - |

3. **API Rules**:
   - List: `@request.auth.id != ""`
   - View: `@request.auth.id != ""`
   - Create: `@request.auth.id != ""`
   - Update: `created_by = @request.auth.id`
   - Delete: `created_by = @request.auth.id`

4. **Create**

#### Collection 5: opportunity_applications

1. **New collection** → Name: `opportunity_applications`
2. Add fields:

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| opportunity | Relation | ✅ Yes | Collection: opportunities, Single |
| applicant | Relation | ✅ Yes | Collection: users, Single |
| business | Relation | ❌ No | Collection: businesses, Single |
| status | Text | ❌ No | Max: 50 |
| cover_letter | Text | ❌ No | - |
| resume | File | ❌ No | Max: 10MB, PDFs/Word docs, Single |

3. **API Rules**:
   - List: `@request.auth.id != ""`
   - View: `applicant = @request.auth.id`
   - Create: `applicant = @request.auth.id`
   - Update: `applicant = @request.auth.id`
   - Delete: `applicant = @request.auth.id`

4. **Create**

---

## IMPORTANT: Update Users Collection

After creating all collections, you MUST update the users collection:

1. Go to **Collections** → **users** (built-in collection)
2. Click **API Rules** tab
3. Update these two rules:
   - **List/Search rule**: Change to `@request.auth.id != ""`
   - **View rule**: Change to `@request.auth.id != ""`
4. Click **Save changes**

**Why?** This allows authenticated users to see other users' profiles (needed for connections and messaging).

---

## Verify Collections

After setup, you should see **6 total collections**:

1. ✅ **users** (built-in, with updated rules)
2. ✅ **businesses**
3. ✅ **connections**
4. ✅ **messages**
5. ✅ **opportunities**
6. ✅ **opportunity_applications**

---

## Test the API

### Test 1: Collections Endpoint

Open in browser:
```
https://zil-connect.onrender.com/api/collections
```

You should see JSON with all your collections.

### Test 2: Health Check

```
https://zil-connect.onrender.com/api/health
```

Should return: `{"code":200,...}`

### Test 3: Register a User

Run your local app:
```bash
npm run dev
```

Open http://localhost:5173 and try to register!

---

## Troubleshooting

### Import Failed?
- Make sure you copied the **entire** JSON from `POCKETBASE_COLLECTIONS_SCHEMA.json`
- The JSON must start with `[` and end with `]`
- Try the manual method instead

### Can't Create Relations?
- Make sure the related collection exists first
- Example: Create `businesses` before `connections` (which references businesses)
- Order: users (built-in) → businesses → connections → messages → opportunities → opportunity_applications

### API Returns 404?
- Check that collections were created
- Check that API rules are set
- Make sure users collection rules are updated

---

## Next Steps

After collections are setup:

1. ✅ Collections created
2. ✅ Users API rules updated
3. 🧪 Test registration on local app
4. 🧪 Test creating business profile
5. 🧪 Test connections
6. 🧪 Test messaging
