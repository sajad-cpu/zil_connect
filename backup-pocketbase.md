# PocketBase Migration Guide

## Collections to Migrate

You need to recreate these collections on your hosted PocketBase:

### 1. **users** (Built-in Auth Collection)
- Already exists, just need to update API rules

### 2. **businesses**
Fields:
- `business_name` (text, required)
- `owner` (relation to users, required)
- `industry` (text)
- `description` (text)
- `city` (text)
- `state` (text)
- `location` (text)
- `logo_url` (text)
- `services` (json/text)
- `badges` (json/text)
- `trust_score` (number, default: 0)
- `engagement_score` (number, default: 0)
- `verified` (bool, default: false)

### 3. **connections**
Fields:
- `user_from` (relation to users, required)
- `user_to` (relation to users, required)
- `business_from` (relation to businesses, required)
- `business_to` (relation to businesses, required)
- `status` (select: pending, accepted, rejected, blocked)
- `message` (text)

### 4. **messages**
Fields:
- `connection_id` (relation to connections, required)
- `sender_id` (relation to users, required)
- `receiver_id` (relation to users, required)
- `text` (text, required)
- `read` (bool, default: false)
- `attachment_url` (text)

### 5. **opportunities**
Fields:
- `title` (text, required)
- `user` (relation to users, required)
- `description` (text)
- `type` (text)
- `budget` (text)
- `timeline` (text)
- `status` (select: Open, Closed, In Progress)
- `application_count` (number, default: 0)
- `location` (text)
- `industry` (text)

### 6. **opportunity_applications**
Fields:
- `opportunity` (relation to opportunities, required)
- `applicant` (relation to users, required)
- `proposal` (text)
- `status` (select: Pending, Accepted, Rejected)
- `submitted_documents` (json/text)

## API Rules to Update

### users Collection
**List/Search rule:**
```
@request.auth.id != ""
```

**View rule:**
```
@request.auth.id != ""
```

### businesses Collection
**List/Search rule:**
```
@request.auth.id != ""
```

**Create rule:**
```
@request.auth.id != ""
```

**Update rule:**
```
@request.auth.id = owner
```

### connections Collection
**List/Search rule:**
```
@request.auth.id != ""
```

**Create rule:**
```
@request.auth.id = user_from
```

**Update rule:**
```
@request.auth.id = user_to || @request.auth.id = user_from
```

### messages Collection
**List/Search rule:**
```
@request.auth.id = sender_id || @request.auth.id = receiver_id
```

**Create rule:**
```
@request.auth.id = sender_id
```

### opportunities Collection
**List/Search rule:**
```
@request.auth.id != ""
```

**Create rule:**
```
@request.auth.id != ""
```

**Update rule:**
```
@request.auth.id = user
```

### opportunity_applications Collection
**List/Search rule:**
```
@request.auth.id != ""
```

**Create rule:**
```
@request.auth.id = applicant
```

## Quick Migration Steps

1. Access your hosted PocketBase admin: https://pocketbase.captain.sebipay.com/_/
2. Create all collections listed above with the exact field names
3. Update API rules for each collection
4. Test by creating a new user account
5. Verify all features work (register, create business, send connection, etc.)

## Testing Checklist

After migration:
- [ ] User registration works
- [ ] User login works
- [ ] Create business profile works
- [ ] Search businesses works
- [ ] Send connection request works
- [ ] Accept connection request works
- [ ] Send messages works
- [ ] Create opportunity works
- [ ] Apply to opportunity works
