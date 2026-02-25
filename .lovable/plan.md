

# Fix Pay Link Creation Error + Detailed Error Messages

## Root Cause

The error is **RLS policy violation**: `new row violates row-level security policy for table "pay_links"`. The `pay_links` table has RLS enabled with a policy requiring the `authenticated` role. This means the user's Supabase auth session has either expired or isn't active when the insert is attempted.

The current error toast just says "Failed to create pay link" — useless for diagnosis.

## Changes

### 1. Show detailed error messages in `SalesManagement.tsx`

Replace all generic `toast.error("Failed to ...")` calls with the actual error details from Supabase:

```typescript
// BEFORE
toast.error("Failed to create pay link");

// AFTER  
toast.error(`Failed to create pay link: ${payLinkError.message}`);
```

Apply this pattern to all error toasts in the file:
- Line 209: pay link insert error
- Line 226: pay link items insert error  
- Line 288: delete pay link error
- Line 298: update status error
- Plus any other generic error toasts in the file

### 2. Add auth session check before insert

Before the pay link insert, check if the user has an active session. If not, show a clear message telling them to log in again:

```typescript
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  toast.error("Your session has expired. Please log in again.");
  return;
}
```

### 3. Also fix the Stripe edge function call error handling (lines ~230-260)

The `create-pay-link` edge function invocation should also surface detailed errors rather than generic messages.

## Files Modified
- `src/components/staff/SalesManagement.tsx` — detailed error messages + session check

## No database changes needed
The RLS policy is correct (`authenticated` users can manage pay links with `true` USING/WITH CHECK). The issue is purely that the client isn't sending an authenticated request.

## Technical Notes
- `pay_link_items` table has RLS **disabled**, so it won't hit the same issue
- The `pay_links` ALL policy covers INSERT/UPDATE/DELETE for authenticated users
- The session check is a UX safeguard — if the session expired mid-use, the user gets a clear message instead of a cryptic RLS error

