# Offer Claims Collection Setup

This guide covers the setup of the offer_claims collection for tracking offer redemptions.

## Collection: offer_claims

**Collection Type:** Base Collection

## Fields

### 1. offer (Relation)
- **Type:** Relation
- **Collection:** offers
- **Required:** Yes
- **Max Select:** 1
- **Cascade Delete:** Yes
- **Description:** The offer being claimed

### 2. user (Relation)
- **Type:** Relation
- **Collection:** users
- **Required:** Yes
- **Max Select:** 1
- **Cascade Delete:** Yes
- **Description:** User who claimed the offer

### 3. business (Relation)
- **Type:** Relation
- **Collection:** businesses
- **Required:** No
- **Max Select:** 1
- **Cascade Delete:** No
- **Description:** Business associated with the user (optional)

### 4. claim_code (Text)
- **Type:** Text
- **Required:** Yes
- **Unique:** Yes
- **Description:** Unique coupon/claim code generated for this claim

### 5. status (Select)
- **Type:** Select
- **Required:** Yes
- **Default:** "active"
- **Options:**
  - `active` - Claim is active and can be used
  - `redeemed` - Claim has been redeemed/used
  - `expired` - Claim has expired
  - `cancelled` - Claim was cancelled

### 6. claimed_at (Date)
- **Type:** Date
- **Required:** Yes
- **Description:** When the offer was claimed

### 7. expires_at (Date)
- **Type:** Date
- **Required:** Yes
- **Description:** When the claim code expires

### 8. redeemed_at (Date)
- **Type:** Date
- **Required:** No
- **Description:** When the claim was redeemed (if applicable)

### 9. redemption_location (Text)
- **Type:** Text
- **Required:** No
- **Description:** Location where the offer was redeemed (optional)

### 10. notes (Text)
- **Type:** Text
- **Required:** No
- **Description:** Additional notes about the claim (optional)

## Indexes

Create the following indexes:

1. **Unique Claim Code Index**
   - Fields: `claim_code`
   - Type: Unique
   - Purpose: Ensure each claim code is unique

2. **User Claims Index**
   - Fields: `user`
   - Type: Normal
   - Purpose: Fast lookup of user's claims

3. **Offer Claims Index**
   - Fields: `offer`
   - Type: Normal
   - Purpose: Fast lookup of claims for an offer

4. **Status Index**
   - Fields: `status`
   - Type: Normal
   - Purpose: Filter claims by status

5. **Expiration Index**
   - Fields: `expires_at`
   - Type: Normal
   - Purpose: Find expired claims

6. **Composite Index (User + Status)**
   - Fields: `user`, `status`
   - Type: Normal
   - Purpose: Fast lookup of user's active/expired claims

## API Rules

### List Rule
```javascript
user = @request.auth.id || offer.created_by = @request.auth.id
```
Users can view their own claims or claims for offers they created.

### View Rule
```javascript
user = @request.auth.id || offer.created_by = @request.auth.id
```
Users can view their own claims or claims for offers they created.

### Create Rule
```javascript
@request.auth.id != "" && user = @request.auth.id
```
Only authenticated users can create claims, and they can only claim for themselves.

### Update Rule
```javascript
offer.created_by = @request.auth.id
```
Only the offer creator can update claim status (e.g., mark as redeemed).

### Delete Rule
```javascript
offer.created_by = @request.auth.id
```
Only the offer creator can delete claims.

## Setup Steps

1. **Create Collection**
   - Go to PocketBase Admin → Collections → New Collection
   - Name: `offer_claims`
   - Type: Base Collection

2. **Add Fields**
   - Add all fields listed above
   - Set required fields
   - Set default values
   - Set unique constraint on `claim_code`

3. **Create Indexes**
   - Create all indexes listed above
   - Ensure unique index on `claim_code`

4. **Configure API Rules**
   - Set all API rules as specified

5. **Test**
   - Create a test claim
   - Verify API access
   - Test claim code generation
   - Test status updates

## Claim Code Generation

Claim codes should be unique and follow a pattern. Example format:

```
OFFER-{OFFER_ID}-{RANDOM_STRING}
```

Example: `OFFER-abc123-XY9K2M`

### Generation Logic

```javascript
function generateClaimCode(offerId) {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `OFFER-${offerId}-${random}`;
}
```

## Status Flow

1. **active** → User claims offer, code is generated
2. **redeemed** → User uses the code at the business
3. **expired** → Code passes expiration date
4. **cancelled** → Offer creator cancels the claim

## Usage Examples

### Creating a Claim

```javascript
{
  offer: "offer_id",
  user: "user_id",
  business: "business_id", // optional
  claim_code: "OFFER-abc123-XY9K2M",
  status: "active",
  claimed_at: "2024-01-15T10:00:00Z",
  expires_at: "2024-02-15T10:00:00Z"
}
```

### Updating Status to Redeemed

```javascript
{
  status: "redeemed",
  redeemed_at: "2024-01-20T14:30:00Z",
  redemption_location: "Store Location #123"
}
```

## Best Practices

1. **Unique Codes:** Always generate unique claim codes
2. **Expiration:** Set reasonable expiration dates
3. **Validation:** Validate claim codes before redemption
4. **Tracking:** Track redemption location and time
5. **Cleanup:** Periodically clean up expired claims
6. **Rate Limiting:** Limit claims per user per offer
7. **Security:** Don't expose claim codes in public APIs

## Related Collections

- **offers:** The offer being claimed
- **users:** User who claimed the offer
- **businesses:** Business associated with the user (optional)

