# Fintech Marketplace Collections Setup Guide

## Overview
This guide will help you create the required PocketBase collections for the Fintech Marketplace feature.

**PocketBase Admin URL**: http://127.0.0.1:8091/_/

---

## Collection 1: fintech_products

### Basic Info
- **Name**: `fintech_products`
- **Type**: Base collection

### Fields to Create

1. **name** (Text)
   - Type: Text
   - Required: ✓ Yes
   - Min length: 1
   - Max length: 255

2. **description** (Text)
   - Type: Text
   - Required: ✓ Yes
   - Min length: 1
   - Max length: (empty)

3. **category** (Select)
   - Type: Select
   - Required: ✓ Yes
   - Values:
     - Accounting Software
     - Payment Processing
     - Business Banking
     - Tax Software
     - Payroll Services
     - Invoicing Tools
     - Expense Management
     - Business Analytics

4. **provider** (Text)
   - Type: Text
   - Required: No
   - Max length: 255

5. **logo** (File)
   - Type: File
   - Required: No
   - Max select: 1
   - Max size: 5242880 (5MB)
   - Mime types: image/jpeg, image/png, image/svg+xml, image/gif, image/webp
   - Thumb sizes: 200x200

6. **pricing_type** (Select)
   - Type: Select
   - Required: No
   - Values: Free, Freemium, Paid, Subscription

7. **pricing_info** (Text)
   - Type: Text
   - Required: No
   - Max length: 500

8. **enrollment_url** (URL)
   - Type: URL
   - Required: ✓ Yes

9. **affiliate_id** (Text)
   - Type: Text
   - Required: No
   - Max length: 255

10. **commission_type** (Select)
    - Type: Select
    - Required: No
    - Values: Percentage, Fixed Amount, Recurring

11. **commission_value** (Number)
    - Type: Number
    - Required: No
    - Min: 0

12. **is_featured** (Bool)
    - Type: Bool
    - Required: No
    - Default: false

13. **is_active** (Bool)
    - Type: Bool
    - Required: No
    - Default: true

14. **tags** (JSON)
    - Type: JSON
    - Required: No

15. **integration_type** (Select)
    - Type: Select
    - Required: No
    - Values: API, OAuth, Manual, Link

16. **created_by** (Relation)
    - Type: Relation
    - Required: No
    - Collection: users
    - Max select: 1
    - Display fields: username, email

17. **views** (Number)
    - Type: Number
    - Required: No
    - Min: 0
    - Default: 0

18. **enrollments** (Number)
    - Type: Number
    - Required: No
    - Min: 0
    - Default: 0

19. **order** (Number)
    - Type: Number
    - Required: No
    - Min: 0
    - Default: 0

### Indexes
- category
- is_featured
- is_active

### API Rules
```
List rule:      @request.auth.id != ""
View rule:      @request.auth.id != ""
Create rule:    @request.auth.id != ""
Update rule:    @request.auth.id != ""
Delete rule:    @request.auth.id != ""
```

---

## Collection 2: product_enrollments

### Basic Info
- **Name**: `product_enrollments`
- **Type**: Base collection

### Fields to Create

1. **user** (Relation)
   - Type: Relation
   - Required: ✓ Yes
   - Collection: users
   - Max select: 1
   - Cascade delete: Yes
   - Display fields: username, email

2. **business** (Relation)
   - Type: Relation
   - Required: ✓ Yes
   - Collection: businesses
   - Max select: 1
   - Cascade delete: No
   - Display fields: business_name, name

3. **product** (Relation)
   - Type: Relation
   - Required: ✓ Yes
   - Collection: fintech_products
   - Max select: 1
   - Cascade delete: No
   - Display fields: name

4. **enrollment_date** (Date)
   - Type: Date
   - Required: ✓ Yes

5. **status** (Select)
   - Type: Select
   - Required: ✓ Yes
   - Values: Pending, Completed, Active, Cancelled

6. **enrollment_method** (Select)
   - Type: Select
   - Required: No
   - Values: Direct Link, API, OAuth

7. **external_id** (Text)
   - Type: Text
   - Required: No
   - Max length: 255

8. **commission_earned** (Number)
   - Type: Number
   - Required: No
   - Min: 0

9. **commission_status** (Select)
   - Type: Select
   - Required: No
   - Values: Pending, Paid, Cancelled

10. **commission_paid_date** (Date)
    - Type: Date
    - Required: No

11. **notes** (Text)
    - Type: Text
    - Required: No

### Indexes
- user
- business
- product
- status

### API Rules
```
List rule:      user = @request.auth.id || business.owner = @request.auth.id
View rule:      user = @request.auth.id || business.owner = @request.auth.id
Create rule:    user = @request.auth.id
Update rule:    user = @request.auth.id
Delete rule:    user = @request.auth.id
```

---

## Collection 3: commission_transactions

### Basic Info
- **Name**: `commission_transactions`
- **Type**: Base collection

### Fields to Create

1. **enrollment** (Relation)
   - Type: Relation
   - Required: ✓ Yes
   - Collection: product_enrollments
   - Max select: 1
   - Cascade delete: No

2. **product** (Relation)
   - Type: Relation
   - Required: ✓ Yes
   - Collection: fintech_products
   - Max select: 1
   - Cascade delete: No
   - Display fields: name

3. **business** (Relation)
   - Type: Relation
   - Required: ✓ Yes
   - Collection: businesses
   - Max select: 1
   - Cascade delete: No
   - Display fields: business_name, name

4. **user** (Relation)
   - Type: Relation
   - Required: ✓ Yes
   - Collection: users
   - Max select: 1
   - Cascade delete: No
   - Display fields: username, email

5. **amount** (Number)
   - Type: Number
   - Required: ✓ Yes
   - Min: 0

6. **commission_type** (Select)
   - Type: Select
   - Required: ✓ Yes
   - Values: One-time, Recurring, Monthly, Annual

7. **status** (Select)
   - Type: Select
   - Required: ✓ Yes
   - Values: Pending, Approved, Paid, Cancelled

8. **transaction_date** (Date)
   - Type: Date
   - Required: ✓ Yes

9. **paid_date** (Date)
   - Type: Date
   - Required: No

10. **payment_reference** (Text)
    - Type: Text
    - Required: No
    - Max length: 255

11. **notes** (Text)
    - Type: Text
    - Required: No

### Indexes
- enrollment
- product
- user
- status
- transaction_date

### API Rules
```
List rule:      @request.auth.id != ""
View rule:      @request.auth.id != ""
Create rule:    @request.auth.id != ""
Update rule:    @request.auth.id != ""
Delete rule:    @request.auth.id != ""
```

---

## Next Steps

After creating these collections:

1. Run the seed data script to add initial products
2. Test the API services
3. Test the UI components
4. Verify enrollment flow works correctly

