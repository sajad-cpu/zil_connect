# ⚠️ PRIVACY WARNING - Use Privacy-Safe Setup Instead

**DO NOT USE** `@request.auth.id != ""` - This allows ANY user to see all users!

**USE INSTEAD:** See `PRIVACY_SAFE_ADMIN_SETUP.md` for the correct privacy-safe setup using `is_admin` field.

## Quick Privacy-Safe Fix

1. Add `is_admin` boolean field to users collection
2. Set `is_admin = true` for `admin@gmail.com`
3. Update API rules:
   - **List/Search**: `is_admin = true` (only admins can list all)
   - **View**: `is_admin = true || id = @request.auth.id` (admins see all, users see themselves)

See `PRIVACY_SAFE_ADMIN_SETUP.md` for complete instructions.

