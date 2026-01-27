
# Fix Service Catalogue Updates Not Persisting

## Problem Identified

The RLS (Row Level Security) policy for managing the `service_catalog` table is **missing the `WITH CHECK` clause**. 

Currently, the policy is:
```sql
-- Policy: "Staff can manage service_catalog"
-- Command: ALL
-- USING: (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'))
-- WITH CHECK: NULL (missing!)
```

For UPDATE and INSERT operations, PostgreSQL requires:
- `USING` clause: determines which rows can be selected/modified
- `WITH CHECK` clause: validates that new row values are allowed

Without `WITH CHECK`, the database silently rejects the update even though the toast says "success" (because the Supabase JS client doesn't throw an error when 0 rows are affected).

## Solution

Update the RLS policy to include a matching `WITH CHECK` clause that mirrors the `USING` condition.

## Implementation

### Step 1: Database Migration

Run a migration to fix the RLS policy:

```sql
-- Drop the existing policy
DROP POLICY IF EXISTS "Staff can manage service_catalog" ON public.service_catalog;

-- Recreate with proper WITH CHECK clause
CREATE POLICY "Staff can manage service_catalog"
ON public.service_catalog
FOR ALL
TO public
USING (
  has_role(auth.uid(), 'staff'::app_role) 
  OR has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'staff'::app_role) 
  OR has_role(auth.uid(), 'admin'::app_role)
);
```

### Step 2: Update Frontend to Check for Affected Rows (Optional Enhancement)

Update `handleSave` in `ServiceCatalogManagement.tsx` to verify the update actually worked:

```typescript
const handleSave = async () => {
  try {
    const serviceData = { ... };

    if (editingService) {
      const { data, error, count } = await supabase
        .from('service_catalog')
        .update(serviceData)
        .eq('id', editingService.id)
        .select();  // Add .select() to get the updated row

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Update failed - no rows affected');
      }
      toast.success('Service updated successfully');
    } else {
      // ... insert logic
    }
    // ...
  } catch (error) {
    console.error('Error saving service:', error);
    toast.error('Failed to save service');
  }
};
```

## Files to Modify

| File/Area | Changes |
|-----------|---------|
| Database (migration) | Fix RLS policy with proper `WITH CHECK` clause |
| `src/components/staff/ServiceCatalogManagement.tsx` | Add `.select()` to verify update succeeded |

## Expected Outcome

- Service updates will actually persist to the database
- If an update fails due to permissions, the user will see an error message instead of false success
- Staff and admin users will be able to create, update, and delete services as intended
