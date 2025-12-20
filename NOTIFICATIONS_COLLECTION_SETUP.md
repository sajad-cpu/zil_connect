# Notifications Collection Setup Guide

## Overview

The `notifications` collection is needed for the full notification system functionality, including:
- Marking notifications as read
- Deleting notifications
- Storing notification history
- Future notification features

**Note:** Currently, the notification dropdown works by pulling from `connections` and `messages` collections directly, but the `notificationService` API requires this collection for full functionality.

---

## Collection Setup

### Basic Info
- **Collection Name**: `notifications`
- **Type**: Base Collection

---

## Fields

### 1. `user` (Relation) - REQUIRED
- **Type**: Relation
- **Collection**: `users` (system auth collection: `_pb_users_auth_`)
- **Max select**: 1
- **Required**: Yes ✓
- **Cascade delete**: Yes ✓
- **Display fields**: username, email
- **Description**: User who receives this notification

### 2. `type` (Select) - REQUIRED
- **Type**: Select (single)
- **Required**: Yes ✓
- **Options** (add these exact values):
  - `connection_request`
  - `connection_accepted`
  - `new_message`
  - `system`
- **Description**: Type of notification

### 3. `message` (Text) - REQUIRED
- **Type**: Text (Plain text)
- **Required**: Yes ✓
- **Min length**: 1
- **Max length**: 500
- **Description**: Notification message text

### 4. `related_id` (Text) - OPTIONAL
- **Type**: Text (Plain text)
- **Required**: No
- **Description**: ID of related record (connection ID, message ID, etc.)
- **Note**: Not a relation field to allow flexibility for different entity types

### 5. `is_read` (Bool) - OPTIONAL
- **Type**: Bool
- **Required**: No
- **Default value**: `false`
- **Description**: Whether notification has been read

---

## Indexes

Create an index for fast unread notification queries:
- **Fields**: `user` + `is_read` + `created`
- **Purpose**: Optimize queries for unread notifications by user

---

## API Rules

### List/Search Rule
```
@request.auth.id != "" && user = @request.auth.id
```
**Meaning**: Users can only see their own notifications

### View Rule
```
@request.auth.id != "" && user = @request.auth.id
```
**Meaning**: Users can only view their own notifications

### Create Rule
```
(Leave empty)
```
**Meaning**: Only backend/server can create notifications (via service functions)

### Update Rule
```
@request.auth.id != "" && user = @request.auth.id
```
**Meaning**: Users can only update their own notifications (for marking as read)

### Delete Rule
```
@request.auth.id != "" && user = @request.auth.id
```
**Meaning**: Users can only delete their own notifications

---

## Step-by-Step Creation

1. **Open PocketBase Admin**
   - Local: http://127.0.0.1:8091/_/
   - Production: Your production PocketBase admin URL

2. **Create Collection**
   - Go to Collections → Click "New Collection"
   - Name: `notifications`
   - Type: Base Collection
   - Click "Create"

3. **Add Fields** (in order):
   - Add `user` field (Relation → users)
   - Add `type` field (Select → add 4 options)
   - Add `message` field (Text)
   - Add `related_id` field (Text)
   - Add `is_read` field (Bool, default: false)

4. **Set Default Value**
   - For `is_read` field: Set default to `false`

5. **Create Index**
   - Go to Indexes tab
   - Add index on: `user`, `is_read`, `created`

6. **Set API Rules**
   - Go to API Rules tab
   - Set all rules as specified above

---

## Verification

After creating the collection, verify:
- [ ] All 5 fields are created correctly
- [ ] `user` field is a relation to `users` collection
- [ ] `type` field has all 4 select options
- [ ] `is_read` has default value `false`
- [ ] Index is created on `user` + `is_read` + `created`
- [ ] API rules are set correctly
- [ ] Create rule is empty (no one can create via API directly)

---

## JSON Schema (for reference)

```json
{
  "id": "notifications_collection",
  "name": "notifications",
  "type": "base",
  "system": false,
  "schema": [
    {
      "id": "user_field",
      "name": "user",
      "type": "relation",
      "system": false,
      "required": true,
      "options": {
        "collectionId": "_pb_users_auth_",
        "cascadeDelete": true,
        "minSelect": null,
        "maxSelect": 1,
        "displayFields": ["username", "email"]
      }
    },
    {
      "id": "type_field",
      "name": "type",
      "type": "select",
      "system": false,
      "required": true,
      "options": {
        "maxSelect": 1,
        "values": [
          "connection_request",
          "connection_accepted",
          "new_message",
          "system"
        ]
      }
    },
    {
      "id": "message_field",
      "name": "message",
      "type": "text",
      "system": false,
      "required": true,
      "options": {
        "min": 1,
        "max": 500
      }
    },
    {
      "id": "related_id_field",
      "name": "related_id",
      "type": "text",
      "system": false,
      "required": false,
      "options": {
        "min": null,
        "max": null
      }
    },
    {
      "id": "is_read_field",
      "name": "is_read",
      "type": "bool",
      "system": false,
      "required": false,
      "options": {}
    }
  ],
  "indexes": [
    {
      "fields": ["user", "is_read", "created"]
    }
  ],
  "listRule": "@request.auth.id != \"\" && user = @request.auth.id",
  "viewRule": "@request.auth.id != \"\" && user = @request.auth.id",
  "createRule": "",
  "updateRule": "@request.auth.id != \"\" && user = @request.auth.id",
  "deleteRule": "@request.auth.id != \"\" && user = @request.auth.id"
}
```

---

## Current Status

### ✅ Works Without Collection
- Notification dropdown shows connection requests
- Notification dropdown shows unread messages
- Badge counts display correctly
- Auto-refresh works

### ⚠️ Needs Collection
- `notificationService.markAsRead()` - Will fail without collection
- `notificationService.markAllAsRead()` - Will fail without collection
- `notificationService.delete()` - Will fail without collection
- `notificationService.getAll()` - Will fail without collection
- "Mark all read" button in dropdown - Currently not functional

---

## Next Steps After Creation

1. **Enable Notification Creation**
   - Uncomment TODO lines in `connectionService.ts` (lines 70-76, 113-119)
   - Uncomment TODO lines in `messageService.ts` (lines 49-55)
   - This will create notifications when connections/messages are created

2. **Implement "Mark All Read"**
   - Update `NotificationsDropdown.tsx` `handleClearAll()` function
   - Call `notificationService.markAllAsRead()`

3. **Test**
   - Send a connection request → Check if notification is created
   - Send a message → Check if notification is created
   - Mark notification as read → Verify it updates

---

## Summary

**YES, you need to create the `notifications` collection** for full notification system functionality. The current UI works by pulling from connections/messages, but the service layer expects this collection to exist for advanced features like marking as read, deleting, and storing notification history.
