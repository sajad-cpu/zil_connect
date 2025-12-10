# Opportunity Application System - Database Structure

## Overview
This document provides complete database structure for the opportunity application system in PocketBase. It includes three collections: one new collection to create, updates to an existing collection, and a notifications collection.

---

## Collections Summary

| Collection Name | Type | Purpose |
|----------------|------|---------|
| `opportunity_applications` | **NEW** | Track all applications submitted by users to opportunities |
| `opportunities` | **UPDATE** | Add user relation and application count fields |
| `notifications` | **NEW** | Handle system notifications for applications |

---

## 1. opportunity_applications Collection (NEW)

### Purpose
Track all applications submitted by users to opportunities with complete application details and status tracking.

### Field Definitions

| Field Name | Type | Required | Unique | Index | Default | Notes |
|------------|------|----------|--------|-------|---------|-------|
| `id` | Text (auto) | ✅ Yes | ✅ Yes | ✅ Yes | Auto-generated | Primary key |
| `opportunity` | Relation (Single) | ✅ Yes | ❌ No | ✅ Yes | - | → `opportunities` collection |
| `applicant` | Relation (Single) | ✅ Yes | ❌ No | ✅ Yes | - | → `users` collection |
| `company_name` | Text | ✅ Yes | ❌ No | ❌ No | - | From application form |
| `contact_person` | Text | ✅ Yes | ❌ No | ❌ No | - | From application form |
| `email` | Email | ✅ Yes | ❌ No | ❌ No | - | From application form |
| `phone` | Text | ✅ Yes | ❌ No | ❌ No | - | From application form |
| `cover_letter` | Text (Long) | ✅ Yes | ❌ No | ❌ No | - | From application form, textarea |
| `portfolio_url` | URL | ❌ No | ❌ No | ❌ No | - | Optional from form |
| `status` | Select | ✅ Yes | ❌ No | ✅ Yes | `"Pending"` | Options: "Pending", "Reviewed", "Accepted", "Rejected" |
| `notes` | Text (Long) | ❌ No | ❌ No | ❌ No | - | Private notes from opportunity owner |
| `created` | DateTime (auto) | ✅ Yes | ❌ No | ✅ Yes | Auto-timestamp | Submission timestamp |
| `updated` | DateTime (auto) | ✅ Yes | ❌ No | ✅ Yes | Auto-timestamp | Last update timestamp |

### Unique Constraints

**Composite Unique Index:**
- Fields: `opportunity` + `applicant`
- Purpose: Prevent duplicate applications from the same user to the same opportunity
- Implementation: Create unique index on `(opportunity, applicant)` pair

### Relationships

```
users (1) -------- (many) opportunity_applications
                              ↓
opportunities (1) ---- (many) opportunity_applications
```

### API Rules

#### List/Search Rule
```javascript
@request.auth.id != "" && (
  // Users can see their own applications
  applicant.id = @request.auth.id ||
  // Opportunity owners can see applications to their opportunities
  opportunity.user.id = @request.auth.id
)
```

#### View Rule
```javascript
@request.auth.id != "" && (
  applicant.id = @request.auth.id ||
  opportunity.user.id = @request.auth.id
)
```

#### Create Rule
```javascript
@request.auth.id != "" &&
@request.auth.id = @request.data.applicant &&
opportunity.status = "Open" &&
opportunity.user.id != @request.auth.id
```
**Enforces:**
- User must be authenticated
- User can only create applications as themselves
- Opportunity must be open
- User cannot apply to their own opportunity

#### Update Rule
```javascript
@request.auth.id != "" &&
opportunity.user.id = @request.auth.id
```
**Enforces:**
- Only opportunity owner can update application (status, notes)

#### Delete Rule
```javascript
@request.auth.id != "" &&
applicant.id = @request.auth.id
```
**Enforces:**
- Only applicant can delete (withdraw) their own application

---

## 2. opportunities Collection (UPDATE EXISTING)

### New Fields to Add

| Field Name | Type | Required | Unique | Index | Default | Notes |
|------------|------|----------|--------|-------|---------|-------|
| `user` | Relation (Single) | ✅ Yes | ❌ No | ✅ Yes | - | → `users` collection (opportunity creator) |
| `application_count` | Number | ❌ No | ❌ No | ❌ No | `0` | Track total applications (auto-incremented) |

### Updated Relationships

```
users (1) -------- (many) opportunities (as creator)
opportunities (1) -------- (many) opportunity_applications
```

### Updated API Rules

#### List/Search Rule
```javascript
@request.auth.id != ""
```
**Allows:** All authenticated users can browse opportunities

#### View Rule
```javascript
@request.auth.id != ""
```
**Allows:** All authenticated users can view opportunity details

#### Create Rule
```javascript
@request.auth.id != "" &&
@request.auth.id = @request.data.user
```
**Enforces:**
- User must be authenticated
- User can only create opportunities as themselves

#### Update Rule
```javascript
@request.auth.id != "" &&
user.id = @request.auth.id
```
**Enforces:**
- Only opportunity creator can update

#### Delete Rule
```javascript
@request.auth.id != "" &&
user.id = @request.auth.id
```
**Enforces:**
- Only opportunity creator can delete

---

## 3. notifications Collection (NEW)

### Purpose
Handle system notifications for application submissions and status updates.

### Field Definitions

| Field Name | Type | Required | Unique | Index | Default | Notes |
|------------|------|----------|--------|-------|---------|-------|
| `id` | Text (auto) | ✅ Yes | ✅ Yes | ✅ Yes | Auto-generated | Primary key |
| `user` | Relation (Single) | ✅ Yes | ❌ No | ✅ Yes | - | → `users` collection (recipient) |
| `type` | Select | ✅ Yes | ❌ No | ✅ Yes | - | Options: "new_application", "application_status_update" |
| `message` | Text | ✅ Yes | ❌ No | ❌ No | - | Notification message text |
| `related_id` | Text | ❌ No | ❌ No | ❌ No | - | Application ID for reference |
| `is_read` | Boolean | ❌ No | ❌ No | ✅ Yes | `false` | Track read/unread status |
| `created` | DateTime (auto) | ✅ Yes | ❌ No | ✅ Yes | Auto-timestamp | Notification timestamp |

### Relationships

```
users (1) -------- (many) notifications (as recipient)
notifications (many) -------- (1) opportunity_applications (via related_id)
```

### API Rules

#### List/Search Rule
```javascript
@request.auth.id != "" &&
user.id = @request.auth.id
```
**Enforces:** Users can only see their own notifications

#### View Rule
```javascript
@request.auth.id != "" &&
user.id = @request.auth.id
```
**Enforces:** Users can only view their own notifications

#### Create Rule
```javascript
@request.auth.id != ""
```
**Allows:** Any authenticated user can create notifications (for system triggers)

#### Update Rule
```javascript
@request.auth.id != "" &&
user.id = @request.auth.id
```
**Enforces:** Users can only update their own notifications (mark as read)

#### Delete Rule
```javascript
@request.auth.id != "" &&
user.id = @request.auth.id
```
**Enforces:** Users can only delete their own notifications

---

## Complete Relationships Diagram

```
┌──────────┐
│  users   │
└────┬─────┘
     │
     ├─────────────────────────────┐
     │                             │
     │ (creator)                   │ (applicant)
     │                             │
     ↓                             ↓
┌──────────────┐          ┌──────────────────────────┐
│opportunities │          │ opportunity_applications │
│              │←─────────│                          │
│              │          │                          │
└──────────────┘          └────────────┬─────────────┘
     │                                 │
     │ (recipient)                     │ (related_id)
     │                                 │
     ↓                                 ↓
┌──────────────┐                      │
│notifications │←─────────────────────┘
└──────────────┘
```

---

## Setup Instructions

### Step 1: Create opportunity_applications Collection

1. Go to PocketBase Admin → Collections
2. Click "New Collection"
3. Name: `opportunity_applications`
4. Type: Base Collection

**Add Fields:**

1. **opportunity** (Relation)
   - Type: Relation
   - Collection: opportunities
   - Single/Multiple: Single
   - Required: ✅ Yes

2. **applicant** (Relation)
   - Type: Relation
   - Collection: users
   - Single/Multiple: Single
   - Required: ✅ Yes

3. **company_name** (Text)
   - Type: Plain Text
   - Required: ✅ Yes
   - Max: 255

4. **contact_person** (Text)
   - Type: Plain Text
   - Required: ✅ Yes
   - Max: 255

5. **email** (Email)
   - Type: Email
   - Required: ✅ Yes

6. **phone** (Text)
   - Type: Plain Text
   - Required: ✅ Yes
   - Max: 50

7. **cover_letter** (Text)
   - Type: Editor (Long Text)
   - Required: ✅ Yes

8. **portfolio_url** (URL)
   - Type: URL
   - Required: ❌ No

9. **status** (Select)
   - Type: Select
   - Required: ✅ Yes
   - Options: Pending, Reviewed, Accepted, Rejected
   - Default: Pending

10. **notes** (Text)
    - Type: Editor (Long Text)
    - Required: ❌ No

**Create Unique Index:**
- Go to "Indexes" tab
- Create new unique index
- Fields: `opportunity`, `applicant`
- Unique: ✅ Yes

**Set API Rules:**
- Copy the API rules from section "1. opportunity_applications Collection (NEW)" above
- Paste into respective rule fields

---

### Step 2: Update opportunities Collection

1. Go to PocketBase Admin → Collections
2. Find and edit `opportunities` collection

**Add New Fields:**

1. **user** (Relation)
   - Type: Relation
   - Collection: users
   - Single/Multiple: Single
   - Required: ✅ Yes
   - Display Fields: name, email

2. **application_count** (Number)
   - Type: Number
   - Required: ❌ No
   - Default: 0
   - Min: 0

**Update API Rules:**
- Update the API rules to match section "2. opportunities Collection (UPDATE EXISTING)" above

---

### Step 3: Create notifications Collection

1. Go to PocketBase Admin → Collections
2. Click "New Collection"
3. Name: `notifications`
4. Type: Base Collection

**Add Fields:**

1. **user** (Relation)
   - Type: Relation
   - Collection: users
   - Single/Multiple: Single
   - Required: ✅ Yes

2. **type** (Select)
   - Type: Select
   - Required: ✅ Yes
   - Options: new_application, application_status_update

3. **message** (Text)
   - Type: Plain Text
   - Required: ✅ Yes
   - Max: 500

4. **related_id** (Text)
   - Type: Plain Text
   - Required: ❌ No
   - Max: 15

5. **is_read** (Boolean)
   - Type: Boolean
   - Required: ❌ No
   - Default: false

**Set API Rules:**
- Copy the API rules from section "3. notifications Collection (NEW)" above

---

## Security Considerations

### 1. Prevent Duplicate Applications
- **Database Level**: Unique constraint on `(opportunity, applicant)`
- **API Level**: Create rule checks authenticated user
- **Frontend Level**: Check before submission with `hasApplied()`

### 2. Prevent Self-Application
- **API Level**: Create rule blocks if `opportunity.user.id = @request.auth.id`
- **Frontend Level**: Hide "Apply" button for own opportunities

### 3. Privacy Protection
- **Applications**: Only applicant and opportunity owner can view
- **Notifications**: Only recipient can view
- **Notes**: Only opportunity owner can see/edit

### 4. Authorization
- **Create**: Only authenticated users
- **Update**: Only resource owners
- **Delete**: Only resource owners

### 5. Data Validation
- **Email**: Validated by PocketBase email field type
- **URL**: Validated by PocketBase URL field type
- **Required Fields**: Enforced at database level
- **Status Options**: Limited to predefined values

---

## Data Flow

### Application Submission Flow
```
1. User fills application form
   ↓
2. Frontend checks: hasApplied(opportunityId)
   ↓
3. If not applied → Submit to PocketBase
   ↓
4. PocketBase validates:
   - User is authenticated
   - Not a duplicate (unique constraint)
   - Not self-application
   - Opportunity is open
   ↓
5. Create record in opportunity_applications
   ↓
6. Increment opportunity.application_count
   ↓
7. Create notification for opportunity owner
   ↓
8. Return success to frontend
```

### View Applications Flow
```
1. User requests applications
   ↓
2. PocketBase API rule checks:
   - If requesting own applications → applicant.id = @request.auth.id
   - If requesting received applications → opportunity.user.id = @request.auth.id
   ↓
3. Return filtered applications with expanded relations
   ↓
4. Frontend displays applications
```

### Status Update Flow
```
1. Opportunity owner updates application status
   ↓
2. PocketBase validates: opportunity.user.id = @request.auth.id
   ↓
3. Update application record
   ↓
4. Create notification for applicant
   ↓
5. Return updated record
```

---

## Testing Checklist

### Database Setup
- [ ] opportunity_applications collection created
- [ ] All fields added with correct types
- [ ] Unique constraint on (opportunity, applicant) created
- [ ] API rules configured correctly
- [ ] opportunities collection updated with user and application_count fields
- [ ] notifications collection created
- [ ] All API rules tested with PocketBase API preview

### Security Testing
- [ ] Cannot create duplicate application (database level)
- [ ] Cannot apply to own opportunity (API rule)
- [ ] Cannot view other users' applications (API rule)
- [ ] Cannot update other users' applications (API rule)
- [ ] Only opportunity owner can update application status
- [ ] Only applicant can withdraw application

### Data Integrity
- [ ] Required fields enforce validation
- [ ] Email field validates email format
- [ ] URL field validates URL format
- [ ] Status field limited to valid options
- [ ] Timestamps auto-populate correctly
- [ ] Relations resolve correctly with expand

---

## Migration Notes

### If Existing Data Exists

**For opportunities collection:**
```sql
-- If opportunities exist without user field, you need to:
1. Export existing opportunities data
2. Add user field (mark as optional temporarily)
3. Manually assign existing opportunities to users
4. Make user field required after assignment
```

**For application_count:**
```sql
-- If applications exist, recalculate counts:
1. For each opportunity:
   - Count related applications
   - Update application_count field
```

### Backup Before Migration
```bash
# Always backup PocketBase data before schema changes
cp -r pb_data pb_data_backup_$(date +%Y%m%d)
```

---

## Support and Maintenance

### Regular Tasks
1. Monitor application_count accuracy (should match actual application records)
2. Archive old notifications (is_read = true AND created < 30 days ago)
3. Review application status distribution for analytics
4. Monitor for spam applications (multiple applications from same user)

### Performance Optimization
1. Ensure indexes are created on frequently queried fields
2. Consider pagination for large application lists
3. Archive old applications periodically
4. Monitor query performance in PocketBase logs

---

## Appendix: Example Records

### Example opportunity_applications Record
```json
{
  "id": "abc123xyz",
  "opportunity": "opp456def",
  "applicant": "user789ghi",
  "company_name": "Tech Innovations Ltd",
  "contact_person": "John Doe",
  "email": "john@techinnovations.com",
  "phone": "+1-555-0123",
  "cover_letter": "I am writing to express my interest in this opportunity...",
  "portfolio_url": "https://portfolio.example.com",
  "status": "Pending",
  "notes": "",
  "created": "2025-12-10 10:30:00.000Z",
  "updated": "2025-12-10 10:30:00.000Z"
}
```

### Example notification Record
```json
{
  "id": "notif123",
  "user": "user456",
  "type": "new_application",
  "message": "John Doe applied to 'Senior Developer Position'",
  "related_id": "abc123xyz",
  "is_read": false,
  "created": "2025-12-10 10:30:05.000Z"
}
```

---

**Document Version:** 1.0
**Last Updated:** 2025-12-10
**Status:** Ready for Implementation
