# Seed Fintech Products Script

This script loads example fintech products into your PocketBase database.

## Products Included

### Accounting Software (4 products)
- QuickBooks
- Xero
- NetSuite
- Sage

### Payroll Services (4 products)
- Gusto
- ADP
- Paychex
- Rippling

### Business Banking (3 products)
- Mercury
- Relay
- Novo

### Tax Software (2 products)
- Avalara
- TaxJar

### Operations (3 products)
- DocuSign
- Shippo
- Twilio

**Total: 16 products**

## Prerequisites

1. PocketBase collections must be created:
   - `fintech_products` collection must exist
   - See `FINTECH_MARKETPLACE_SETUP.md` for setup instructions

2. Admin authentication required

## Usage

### Option 1: Using Environment Variables (Recommended)

Set your PocketBase admin credentials as environment variables:

```bash
export PB_ADMIN_EMAIL="your-admin@email.com"
export PB_ADMIN_PASSWORD="your-admin-password"
npm run seed:fintech
```

### Option 2: Manual Authentication

1. Open PocketBase admin panel: https://pocketbase.captain.sebipay.com/_/
2. Login as admin
3. Keep the browser session active
4. Run the script:

```bash
npm run seed:fintech
```

### Option 3: Direct Node Execution

```bash
node scripts/seed-fintech-products-example.mjs
```

## What the Script Does

1. Authenticates as PocketBase admin
2. Checks if products already exist (by name)
3. Creates new products or updates existing ones
4. Provides summary of created/updated/skipped products

## Product Data Structure

Each product includes:
- Name and description
- Category (Accounting Software, Payroll Services, etc.)
- Provider/company name
- Pricing information
- Enrollment URL
- Affiliate ID (for commission tracking)
- Commission type and value
- Tags for searchability
- Integration type (Link, API, etc.)

## Notes

- Products marked as `is_featured: true` will appear in the featured section
- All products are set as `is_active: true` by default
- Commission values are set for tracking (you can adjust these)
- Affiliate IDs are placeholder values - update with your actual affiliate IDs

## Troubleshooting

**Error: Admin authentication failed**
- Set environment variables: `PB_ADMIN_EMAIL` and `PB_ADMIN_PASSWORD`
- Or authenticate manually in PocketBase admin first

**Error: Collection not found**
- Make sure you've created the `fintech_products` collection
- Follow the setup guide in `FINTECH_MARKETPLACE_SETUP.md`

**Products not appearing in UI**
- Check that products have `is_active: true`
- Verify collection API rules allow read access
- Check browser console for errors

## Updating Products

The script will update existing products if they have the same name. To add new products, simply add them to the `products` array in the script.

