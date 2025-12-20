# Update Opportunities Collection - Add Missing Fields

This guide will help you add the missing fields (`views`, `application_count`, `budget`, `location`) to the `opportunities` collection in your PocketBase database.

## Step 1: Open PocketBase Admin

Go to your PocketBase admin panel:
**https://pocketbase.captain.sebipay.com/_/**

Login with your admin credentials.

---

## Step 2: Navigate to Opportunities Collection

1. Click on **"Collections"** in the left sidebar
2. Find and click on the **"opportunities"** collection

---

## Step 3: Add Missing Fields

You need to add the following fields. Add them one by one:

### Field 1: views
1. Click the **"New field"** button
2. Configure:
   - **Name**: `views`
   - **Type**: **Number**
   - **Required**: ❌ No
   - **Min**: `0` (optional)
   - **Max**: Leave empty
   - **Default value**: `0`
3. Click **"Save"**

### Field 2: application_count
1. Click the **"New field"** button again
2. Configure:
   - **Name**: `application_count`
   - **Type**: **Number**
   - **Required**: ❌ No
   - **Min**: `0` (optional)
   - **Max**: Leave empty
   - **Default value**: `0`
3. Click **"Save"**

### Field 3: budget
1. Click the **"New field"** button again
2. Configure:
   - **Name**: `budget`
   - **Type**: **Text**
   - **Required**: ❌ No
   - **Min length**: Leave empty
   - **Max length**: `255` (optional)
3. Click **"Save"**

### Field 4: location
1. Click the **"New field"** button again
2. Configure:
   - **Name**: `location`
   - **Type**: **Text**
   - **Required**: ❌ No
   - **Min length**: Leave empty
   - **Max length**: `255` (optional)
3. Click **"Save"**

---

## Step 4: Update Existing Records (Optional)

If you have existing opportunities, you may want to set default values for the new fields:

1. Go to the **"Records"** tab in the opportunities collection
2. You can manually update each record, or use the API to bulk update

### Bulk Update via API (Optional):

You can use this script to set default values for all existing opportunities:

```javascript
// Run this in your browser console on the PocketBase admin page
// Or use the PocketBase JS SDK

const updateAllOpportunities = async () => {
  const opportunities = await pb.collection('opportunities').getFullList();
  
  for (const opp of opportunities) {
    await pb.collection('opportunities').update(opp.id, {
      views: opp.views || 0,
      application_count: opp.application_count || 0
    });
  }
  
  console.log('Updated all opportunities');
};
```

---

## Step 5: Verify the Fields

1. Go to the **"Records"** tab
2. Open any opportunity record
3. You should see all the new fields:
   - `views` - Number field with default value `0`
   - `application_count` - Number field with default value `0`
   - `budget` - Text field (optional)
   - `location` - Text field (optional)
4. Verify the field types are correct

---

## Step 6: Update API Rules (If Needed)

The current update rule is:
```
Update rule: created_by = @request.auth.id
```

This means only the creator can update the opportunity. However, for view tracking to work, we need to allow anyone to update the `views` field.

### Option 1: Use Server-Side Hook (Recommended)
Create a server-side hook in PocketBase that allows anyone to update only the `views` field:

1. Go to **Settings** → **Hooks** in PocketBase admin
2. Create a new hook for `opportunities` collection
3. Set trigger: **Before update**
4. Add this JavaScript code:

```javascript
// Allow anyone to update views field, but only creator can update other fields
if (request.auth.id) {
  const current = $app.dao().findRecordById("opportunities", request.data.id);
  const isCreator = current.get("created_by") === request.auth.id;
  
  // If not creator, only allow updating views field
  if (!isCreator) {
    const allowedFields = ["views"];
    const requestFields = Object.keys(request.data);
    
    for (const field of requestFields) {
      if (!allowedFields.includes(field)) {
        delete request.data[field];
      }
    }
  }
}
```

### Option 2: Update Rule (Less Secure)
Change the update rule to allow authenticated users to update:
```
Update rule: @request.auth.id != ""
```

**Note**: This allows any authenticated user to update any field. Use Option 1 for better security.

---

## Step 7: Test the Implementation

1. Navigate to the Opportunities page in your app
2. Click on an opportunity card
3. Check the browser console for any errors
4. Verify that the views count increments when viewing an opportunity
5. Refresh the page and check if the views count persists

---

## Troubleshooting

### Views not incrementing?
- Check browser console for errors
- Verify the `views` field exists in the collection
- Check API rules allow updates
- Ensure the `incrementViews` function is being called

### Permission errors?
- Check the Update rule in API Rules
- Ensure the user is authenticated
- Verify the field name is exactly `views` (lowercase)

### Views resetting?
- Check if there's any code that resets the views field
- Verify the default value is set correctly
- Check for any database migrations or resets

---

## Additional Notes

- The views field will automatically increment when:
  - A user clicks on an opportunity card in the Opportunities list
  - A user views the Opportunity Details page
  
- Views are tracked per view, not per user (same user viewing multiple times will increment)
- If you want to track unique views per user, you would need a separate `opportunity_views` collection

---

## Field Summary

| Field Name | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| `views` | Number | No | 0 | Total number of times the opportunity has been viewed |
| `application_count` | Number | No | 0 | Total number of applications received |
| `budget` | Text | No | - | Budget range or amount (e.g., "$50,000 - $75,000") |
| `location` | Text | No | - | Location of the opportunity (e.g., "New York, NY" or "Remote") |

---

## Next Steps

After adding the field:
1. Test view tracking on a few opportunities
2. Monitor the views count in the database
3. Consider adding analytics to track which opportunities are most viewed
4. Optionally add sorting by views in the Opportunities page

