# PocketBase Collections Setup Guide

Complete step-by-step guide to create all required collections for the Business Connection app.

**PocketBase Admin URL**:
- Local: http://127.0.0.1:8091/_/
- Production: https://pocketbase.captain.sebipay.com/_/

---

## Collection 1: businesses

### Basic Info
- **Name**: `businesses`
- **Type**: Base collection

### Fields

#### 1. name (Text)
- Type: **Text**
- Required: **Yes** ✓
- Min length: 1
- Max length: 255

#### 2. description (Text)
- Type: **Text**
- Required: No
- Min length: (empty)
- Max length: (empty)

#### 3. industry (Text)
- Type: **Text**
- Required: No
- Min length: (empty)
- Max length: 255

#### 4. location (Text)
- Type: **Text**
- Required: No
- Min length: (empty)
- Max length: 255

#### 5. website (URL)
- Type: **URL**
- Required: No
- Except domains: (empty)
- Only domains: (empty)

#### 6. logo (File)
- Type: **File**
- Required: No
- Max select: 1
- Max size: 5242880 (5MB)
- Mime types:
  - image/jpeg
  - image/png
  - image/svg+xml
  - image/gif
  - image/webp
- Thumb sizes: 100x100

#### 7. owner (Relation)
- Type: **Relation**
- Required: **Yes** ✓
- Collection: **users** (system auth collection)
- Max select: 1
- Cascade delete: **Yes** ✓
- Display fields: username, email

### API Rules

```
List rule:      @request.auth.id != ""
View rule:      @request.auth.id != ""
Create rule:    @request.auth.id != ""
Update rule:    owner = @request.auth.id
Delete rule:    owner = @request.auth.id
```

---

## Collection 2: connections

### Basic Info
- **Name**: `connections`
- **Type**: Base collection

### Fields

#### 1. user_from (Relation)
- Type: **Relation**
- Required: **Yes** ✓
- Collection: **users**
- Max select: 1
- Cascade delete: **Yes** ✓
- Display fields: username, email

#### 2. user_to (Relation)
- Type: **Relation**
- Required: **Yes** ✓
- Collection: **users**
- Max select: 1
- Cascade delete: **Yes** ✓
- Display fields: username, email

#### 3. business_from (Relation)
- Type: **Relation**
- Required: No
- Collection: **businesses**
- Max select: 1
- Cascade delete: No
- Display fields: name

#### 4. business_to (Relation)
- Type: **Relation**
- Required: No
- Collection: **businesses**
- Max select: 1
- Cascade delete: No
- Display fields: name

#### 5. status (Select)
- Type: **Select**
- Required: **Yes** ✓
- Max select: **Single**
- Values (add these exactly):
  - `pending`
  - `accepted`
  - `rejected`

#### 6. message (Text)
- Type: **Text**
- Required: No
- Min length: (empty)
- Max length: (empty)
- Pattern: (empty)

### API Rules

```
List rule:      @request.auth.id != ""
View rule:      user_from = @request.auth.id || user_to = @request.auth.id
Create rule:    @request.auth.id != ""
Update rule:    user_to = @request.auth.id
Delete rule:    user_from = @request.auth.id || user_to = @request.auth.id
```

---

## Collection 3: messages

### Basic Info
- **Name**: `messages`
- **Type**: Base collection

### Fields

#### 1. sender (Relation)
- Type: **Relation**
- Required: **Yes** ✓
- Collection: **users**
- Max select: 1
- Cascade delete: **Yes** ✓
- Display fields: username, email

#### 2. receiver (Relation)
- Type: **Relation**
- Required: **Yes** ✓
- Collection: **users**
- Max select: 1
- Cascade delete: **Yes** ✓
- Display fields: username, email

#### 3. connection (Relation)
- Type: **Relation**
- Required: **Yes** ✓
- Collection: **connections**
- Max select: 1
- Cascade delete: **Yes** ✓
- Display fields: (empty)

#### 4. content (Text)
- Type: **Text**
- Required: **Yes** ✓
- Min length: 1
- Max length: (empty)
- Pattern: (empty)

#### 5. read (Bool)
- Type: **Bool**
- Required: No

### API Rules

```
List rule:      @request.auth.id != ""
View rule:      sender = @request.auth.id || receiver = @request.auth.id
Create rule:    sender = @request.auth.id
Update rule:    receiver = @request.auth.id
Delete rule:    sender = @request.auth.id
```

---

## Collection 4: opportunities

### Basic Info
- **Name**: `opportunities`
- **Type**: Base collection

### Fields

#### 1. title (Text)
- Type: **Text**
- Required: **Yes** ✓
- Min length: 1
- Max length: 255
- Pattern: (empty)

#### 2. description (Text)
- Type: **Text**
- Required: **Yes** ✓
- Min length: 1
- Max length: (empty)
- Pattern: (empty)

#### 3. business (Relation)
- Type: **Relation**
- Required: **Yes** ✓
- Collection: **businesses**
- Max select: 1
- Cascade delete: **Yes** ✓
- Display fields: name

#### 4. created_by (Relation)
- Type: **Relation**
- Required: **Yes** ✓
- Collection: **users**
- Max select: 1
- Cascade delete: **Yes** ✓
- Display fields: username, email

#### 5. type (Text)
- Type: **Text**
- Required: No
- Min length: (empty)
- Max length: 100
- Pattern: (empty)

#### 6. status (Select)
- Type: **Select**
- Required: No
- Max select: **Single**
- Values (add these exactly):
  - `open`
  - `closed`
  - `filled`

#### 7. deadline (Date)
- Type: **Date**
- Required: No
- Min: (empty)
- Max: (empty)

#### 8. requirements (Text)
- Type: **Text**
- Required: No
- Min length: (empty)
- Max length: (empty)
- Pattern: (empty)

### API Rules

```
List rule:      @request.auth.id != ""
View rule:      @request.auth.id != ""
Create rule:    @request.auth.id != ""
Update rule:    created_by = @request.auth.id
Delete rule:    created_by = @request.auth.id
```

---

## Collection 5: opportunity_applications

### Basic Info
- **Name**: `opportunity_applications`
- **Type**: Base collection

### Fields

#### 1. opportunity (Relation)
- Type: **Relation**
- Required: **Yes** ✓
- Collection: **opportunities**
- Max select: 1
- Cascade delete: **Yes** ✓
- Display fields: title

#### 2. applicant (Relation)
- Type: **Relation**
- Required: **Yes** ✓
- Collection: **users**
- Max select: 1
- Cascade delete: **Yes** ✓
- Display fields: username, email

#### 3. business (Relation)
- Type: **Relation**
- Required: No
- Collection: **businesses**
- Max select: 1
- Cascade delete: No
- Display fields: name

#### 4. status (Select)
- Type: **Select**
- Required: No
- Max select: **Single**
- Values (add these exactly):
  - `pending`
  - `reviewing`
  - `accepted`
  - `rejected`

#### 5. cover_letter (Text)
- Type: **Text**
- Required: No
- Min length: (empty)
- Max length: (empty)
- Pattern: (empty)

#### 6. resume (File)
- Type: **File**
- Required: No
- Max select: 1
- Max size: 10485760 (10MB)
- Mime types:
  - application/pdf
  - application/msword
  - application/vnd.openxmlformats-officedocument.wordprocessingml.document
- Thumb sizes: (empty)

### API Rules

```
List rule:      @request.auth.id != ""
View rule:      applicant = @request.auth.id
Create rule:    applicant = @request.auth.id
Update rule:    applicant = @request.auth.id
Delete rule:    applicant = @request.auth.id
```

---

## Quick Setup Checklist

### For Local PocketBase (http://127.0.0.1:8091/_/)

1. ✅ Start PocketBase: `./pocketbase serve --http="127.0.0.1:8091"`
2. ✅ Open admin panel: http://127.0.0.1:8091/_/
3. ✅ Create admin account (first time only)
4. ✅ Create collection: **businesses** (7 fields)
5. ✅ Create collection: **connections** (6 fields)
6. ✅ Create collection: **messages** (5 fields)
7. ✅ Create collection: **opportunities** (8 fields)
8. ✅ Create collection: **opportunity_applications** (6 fields)

### For Production PocketBase (https://pocketbase.captain.sebipay.com/_/)

Follow the same steps in your production PocketBase instance.

---

## Important Notes

### Field Order Matters for Relations
**IMPORTANT**: When creating relations, you must create collections in this order:
1. Create **businesses** first (depends on users only)
2. Create **connections** second (depends on users and businesses)
3. Create **messages** third (depends on users and connections)
4. Create **opportunities** fourth (depends on users and businesses)
5. Create **opportunity_applications** last (depends on all above)

### Understanding API Rules

- `@request.auth.id` - The currently logged-in user's ID
- `@request.auth.id != ""` - Any authenticated user
- `owner = @request.auth.id` - Only the owner can perform this action
- `||` - OR operator
- `&&` - AND operator

### Common Field Types

- **Text**: Simple text input
- **Select**: Dropdown with predefined options (recommended for status fields)
- **URL**: Validates URL format
- **Date**: Date picker
- **Bool**: True/false checkbox
- **File**: File upload with size/type restrictions
- **Relation**: Link to another collection

### How to Add Select Field Values

When creating a **Select** field in PocketBase:
1. Choose **Select** as the field type
2. Set **Max select** to "Single" (for single choice)
3. In the **Values** section, click **+ Add value**
4. Enter each value exactly as shown (e.g., `pending`, `accepted`, `rejected`)
5. The order matters - first value will be the default

### Testing After Setup

1. Create a test user account in your app
2. Create a test business
3. Try creating a connection request
4. Send a test message
5. Create a test opportunity
6. Verify all data appears correctly

---

## Troubleshooting

### "Collection not found" error
- Make sure you created the collection with the exact name (lowercase)
- Check that you're logged into PocketBase admin

### "Relation collection doesn't exist" error
- Create collections in the order listed above
- Make sure the related collection exists before creating the relation field

### "Cascade delete" option
- **Yes**: When the parent record is deleted, this record is also deleted
- **No**: When the parent is deleted, this field becomes null

### File upload not working
- Check max file size (in bytes)
- Verify mime types are correct
- Make sure file storage is configured in Settings > Files storage

---

## Need Help?

- **PocketBase Docs**: https://pocketbase.io/docs/
- **Collection Schema**: Check `POCKETBASE_COLLECTIONS_SCHEMA.json` for full schema
- **Local PocketBase**: http://127.0.0.1:8091/_/
- **Production PocketBase**: https://pocketbase.captain.sebipay.com/_/
