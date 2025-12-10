# How to Import Mock Data to PocketBase

## Prerequisites

1. ✅ PocketBase server is running at http://127.0.0.1:8090
2. ✅ Admin account created
3. ✅ Collections created (businesses, opportunities, offers)

---

## Step 1: Create Collections in PocketBase Admin UI

Before running the import script, you MUST create the collections first.

Go to **http://127.0.0.1:8090/_/** and create these collections:

### Collection 1: `businesses`

Click "New collection" → Name: `businesses` → Type: Base collection

Add these fields (click "+ New field"):

| Field Name | Type | Required |
|------------|------|----------|
| business_name | Text | ✅ Yes |
| description | Text | ❌ No |
| industry | Text | ❌ No |
| location | Text | ❌ No |
| city | Text | ❌ No |
| state | Text | ❌ No |
| engagement_score | Number | ❌ No |
| trust_score | Number | ❌ No |
| services | JSON | ❌ No |
| verified | Bool | ❌ No |
| badges | JSON | ❌ No |

**IMPORTANT:** Go to "API Rules" tab and set:
- List/Search rule: `` (empty - allows public read)
- View rule: `` (empty)
- Create/Update/Delete: `` (empty for testing)

Click "Save changes"

### Collection 2: `opportunities`

Create with these fields:

| Field Name | Type | Required |
|------------|------|----------|
| title | Text | ✅ Yes |
| description | Text | ❌ No |
| type | Select | ✅ Yes |
| status | Select | ✅ Yes |
| budget | Text | ❌ No |
| deadline | Date | ❌ No |
| location | Text | ❌ No |
| company_name | Text | ❌ No |
| requirements | JSON | ❌ No |
| views | Number | ❌ No |

For **type** field, add these options:
- Project
- Partnership
- Tender
- RFP
- Collaboration
- Investment

For **status** field, add these options:
- Open
- In Progress
- Awarded
- Closed

**API Rules:** Same as businesses (empty for all)

### Collection 3: `offers`

Create with these fields:

| Field Name | Type | Required |
|------------|------|----------|
| title | Text | ✅ Yes |
| description | Text | ❌ No |
| company_name | Text | ❌ No |
| discount_percentage | Number | ❌ No |
| original_price | Text | ❌ No |
| discounted_price | Text | ❌ No |
| valid_until | Date | ❌ No |
| terms | Text | ❌ No |
| is_featured | Bool | ❌ No |
| category | Text | ❌ No |

**API Rules:** Same as above

---

## Step 2: Run the Import Script

Once collections are created, run:

```bash
node scripts/import-data.mjs
```

You should see:
```
🚀 Starting PocketBase data import...

📦 Importing Businesses...
✅ Created business 1/10: TechFlow Solutions
✅ Created business 2/10: HealthFirst Medical
...

📋 Importing Opportunities...
✅ Created opportunity 1/9: Need Logistics Partner
...

🎁 Importing Offers...
✅ Created offer 1/8: 20% Off Cloud Migration
...

✨ Import completed successfully!
```

---

## Step 3: Verify Data

1. Go to http://127.0.0.1:8090/_/
2. Click on each collection
3. You should see all the imported records

---

## Step 4: Test API

Open browser console and run:

```javascript
fetch('http://127.0.0.1:8090/api/collections/businesses/records')
  .then(res => res.json())
  .then(data => console.log(data));
```

You should see your businesses data!

---

## Troubleshooting

### Error: "Collection not found"
- Make sure you created the collections in Step 1
- Check spelling: `businesses`, `opportunities`, `offers` (lowercase, plural)

### Error: "Failed validating data"
- Make sure required fields are marked correctly
- Check that Select fields have their options configured

### Error: "Unauthorized"
- Set API rules to empty (`` ) for testing
- Later you can restrict to authenticated users only

---

## What's Next?

After successful import:
1. ✅ Verify all data is in PocketBase
2. ✅ Start migrating your React components
3. ✅ Update Home.jsx to use PocketBase services
4. ✅ Remove Base44 SDK

Ready to proceed? Let me know!
