# Fix Connection Issues

## Issue 1: Duplicate Connection Requests

**Problem:** Users can send multiple connection requests to the same company after refreshing.

**Root Cause:** No unique constraint in the database to prevent duplicate requests.

**Solution:** Add a unique index in PocketBase:

1. Go to PocketBase Admin → Collections → `connections`
2. Click on "Indexes" tab (or API Rules section)
3. Add a **Unique Index** with the following configuration:
   - **Index name:** `unique_connection`
   - **Fields:** `user_from`, `user_to`
   - **Unique:** ✓ (checked)

This will prevent duplicate connection records at the database level.

**Alternative SQL (if PocketBase supports):**
```sql
CREATE UNIQUE INDEX idx_unique_connection ON connections(user_from, user_to);
```

## Issue 2: Received Connections Not Showing

**Problem:** Received connection requests don't appear in the Invitations page.

**Possible Causes:**
1. **Expand not working** - The `expand` parameter might not be properly configured
2. **API Rules blocking** - The List/View rules might be preventing access
3. **Data not syncing** - Need to check actual database records

**Debugging Steps:**

### Step 1: Check API Rules for `connections` collection

Make sure these rules are set:

**List/Search Rule:**
```
@request.auth.id != "" && (user_from = @request.auth.id || user_to = @request.auth.id)
```

**View Rule:**
```
@request.auth.id != "" && (user_from = @request.auth.id || user_to = @request.auth.id)
```

### Step 2: Check API Rules for `users` collection

The `expand` needs to access the `users` collection. Make sure users collection has:

**List/Search Rule:** 
```
@request.auth.id != ""
```

**View Rule:**
```
@request.auth.id != ""
```

### Step 3: Check API Rules for `businesses` collection

The `expand` needs to access the `businesses` collection. Make sure businesses collection has:

**List/Search Rule:**
```
@request.auth.id != ""
```

**View Rule:**
```
@request.auth.id != ""
```

### Step 4: Test in PocketBase Admin

1. Go to Collections → `connections`
2. Check if there are any records with `status = "pending"`
3. Verify the `user_from`, `user_to`, `business_from`, `business_to` fields are populated
4. Try manually expanding: Click on a record and check if related records load

### Step 5: Check Browser Console

Open browser DevTools → Console tab and look for:
- API errors (red text)
- Failed requests to `/api/collections/connections/records`
- Any 403 (Forbidden) or 404 (Not Found) errors

## Quick Test

Run this in browser console on the Invitations page:
```javascript
// This will show you the actual API response
fetch('http://127.0.0.1:8090/api/collections/connections/records?filter=user_to="YOUR_USER_ID"&expand=user_from,business_from', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('pocketbase_auth')
  }
})
.then(r => r.json())
.then(data => console.log('Connections:', data))
```

Replace `YOUR_USER_ID` with your actual user ID.

---

## Expected Database State

After sending a connection request, you should have:

**In `connections` table:**
```
id: abc123
user_from: <sender_user_id>
user_to: <receiver_user_id>
business_from: <sender_business_id>
business_to: <receiver_business_id>
status: "pending"
message: "Optional message"
created: <timestamp>
```

**Sender's view (Sent tab):**
- Query: `user_from = <sender_user_id> && status = "pending"`
- Should expand: `user_to`, `business_to`

**Receiver's view (Received tab):**
- Query: `user_to = <receiver_user_id> && status = "pending"`
- Should expand: `user_from`, `business_from`
