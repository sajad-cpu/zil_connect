# Notifications Collection Setup

This guide covers the setup of the notifications collection for the notification system.

## Collection: notifications

**Collection Type:** Base Collection

## Fields

### 1. user (Relation)
- **Type:** Relation
- **Collection:** users
- **Required:** Yes
- **Max Select:** 1
- **Cascade Delete:** Yes
- **Description:** User who will receive the notification

### 2. type (Select)
- **Type:** Select
- **Required:** Yes
- **Options:**
  - `connection_request` - New connection request
  - `connection_accepted` - Connection request accepted
  - `message` - New message received
  - `opportunity` - New opportunity posted
  - `opportunity_application` - Application status update
  - `offer` - New offer available
  - `offer_claimed` - Offer claimed successfully
  - `system` - System notification
  - `admin` - Admin notification

### 3. message (Text)
- **Type:** Text
- **Required:** Yes
- **Description:** Notification message content

### 4. related_id (Text)
- **Type:** Text
- **Required:** No
- **Description:** ID of the related record (connection, message, opportunity, etc.)

### 5. is_read (Bool)
- **Type:** Bool
- **Required:** No
- **Default:** false
- **Description:** Whether the notification has been read

### 6. created (Date)
- **Type:** Date
- **System Field:** Yes
- **Description:** When the notification was created

## Indexes

Create the following indexes:

1. **User Index**
   - Fields: `user`
   - Type: Normal
   - Purpose: Fast lookup of notifications by user

2. **Read Status Index**
   - Fields: `user`, `is_read`
   - Type: Normal
   - Purpose: Fast lookup of unread notifications

3. **Type Index**
   - Fields: `type`
   - Type: Normal
   - Purpose: Filter notifications by type

## API Rules

### List Rule
```javascript
user = @request.auth.id
```
Users can only view their own notifications.

### View Rule
```javascript
user = @request.auth.id
```
Users can only view their own notifications.

### Create Rule
```javascript
@request.auth.id != ""
```
Only authenticated users can create notifications (typically system/admin creates).

### Update Rule
```javascript
user = @request.auth.id
```
Users can only update their own notifications (typically to mark as read).

### Delete Rule
```javascript
user = @request.auth.id
```
Users can only delete their own notifications.

## Setup Steps

1. **Create Collection**
   - Go to PocketBase Admin → Collections → New Collection
   - Name: `notifications`
   - Type: Base Collection

2. **Add Fields**
   - Add all fields listed above
   - Set required fields
   - Set default values

3. **Create Indexes**
   - Create all indexes listed above

4. **Configure API Rules**
   - Set all API rules as specified

5. **Test**
   - Create a test notification
   - Verify API access
   - Test read/unread functionality

## Usage Examples

### Creating a Notification

```javascript
// Connection request notification
{
  user: "user_id",
  type: "connection_request",
  message: "John Doe sent you a connection request",
  related_id: "connection_id",
  is_read: false
}

// Message notification
{
  user: "user_id",
  type: "message",
  message: "You have a new message from Jane Smith",
  related_id: "message_id",
  is_read: false
}

// Opportunity application update
{
  user: "user_id",
  type: "opportunity_application",
  message: "Your application for 'Web Development Project' has been accepted",
  related_id: "application_id",
  is_read: false
}
```

## Notification Types Reference

- **connection_request:** User receives a connection request
- **connection_accepted:** User's connection request was accepted
- **message:** User receives a new message
- **opportunity:** New opportunity posted (if user has preferences)
- **opportunity_application:** Application status changed
- **offer:** New offer available (if user has preferences)
- **offer_claimed:** User successfully claimed an offer
- **system:** General system notification
- **admin:** Admin notification

## Best Practices

1. **Batch Notifications:** Group similar notifications when possible
2. **Clear Messages:** Use clear, actionable notification messages
3. **Cleanup:** Implement cleanup for old read notifications
4. **Rate Limiting:** Implement rate limiting for notification creation
5. **User Preferences:** Allow users to configure notification preferences

