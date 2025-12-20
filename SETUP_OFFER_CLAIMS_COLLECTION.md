# Setup offer_claims Collection in Production

Follow these steps to set up the `offer_claims` collection in your production PocketBase.

## Step 1: Open Production PocketBase Admin

Go to: **https://pocketbase.captain.sebipay.com/_/**

Login with your admin credentials.

---

## Step 2: Create New Collection

1. Click **"New collection"** button
2. Select **"Base collection"**
3. Name: `offer_claims`
4. Click **"Create"**

---

## Step 3: Add Fields

Click on the `offer_claims` collection and add these fields:

### Field 1: offer (Relation)
- **Type**: Relation
- **Required**: ✅ Yes
- **Collection**: offers
- **Max select**: 1
- **Cascade delete**: ✅ Yes
- **Display fields**: title

### Field 2: user (Relation)
- **Type**: Relation
- **Required**: ✅ Yes
- **Collection**: users
- **Max select**: 1
- **Cascade delete**: ✅ Yes
- **Display fields**: username, email

### Field 3: business (Relation)
- **Type**: Relation
- **Required**: ❌ No
- **Collection**: businesses
- **Max select**: 1
- **Cascade delete**: ❌ No
- **Display fields**: name

### Field 4: claim_code (Text)
- **Type**: Text
- **Required**: ✅ Yes
- **Min length**: 6
- **Max length**: 20

### Field 5: status (Select)
- **Type**: Select
- **Required**: ❌ No
- **Max select**: Single
- **Values**: Add these exactly:
  - `claimed`
  - `redeemed`
  - `expired`

### Field 6: redeemed_at (Date)
- **Type**: Date
- **Required**: ❌ No

### Field 7: expires_at (Date)
- **Type**: Date
- **Required**: ❌ No

---

## Step 4: Set API Rules

Click on the **API Rules** tab and set these rules:

```
List rule:      @request.auth.id != ""
View rule:      user = @request.auth.id
Create rule:    user = @request.auth.id
Update rule:    user = @request.auth.id
Delete rule:    user = @request.auth.id
```

**Copy and paste each rule exactly as shown above.**

---

## Step 5: IMPORTANT - Fix offers Collection Update Rule

The offers collection needs to allow anyone to update the `redemptions` count.

1. Go to **Collections** → **offers**
2. Click the **Settings (cog)** icon
3. Go to **API rules** tab
4. Change the **Update rule** to:

```
created_by = @request.auth.id || @request.auth.id != ""
```

This allows:
- The creator to update their own offers
- ANY authenticated user to increment the redemptions count

Click **"Save changes"**

---

## ✅ You're Done!

Now your offer claims system will work properly!

Test it by:
1. Go to `/Offers`
2. Click "Claim Offer" on any offer
3. You should see a success modal with your coupon code
4. Check `/MyClaimedOffers` to see your claimed offers

---

## Fixed Issues

✅ **Opportunity Creation** - Now includes required `business` and `created_by` fields
✅ **Opportunity Status** - Changed from `"Open"` to `"open"` (lowercase)
✅ **Offer Claims** - Collection setup guide provided above

---

## Next Steps

After setting up `offer_claims`:
1. Refresh your app
2. Try claiming an offer
3. Check notifications - they'll work once you have messages and connection requests
4. Test creating opportunities - should work now!
