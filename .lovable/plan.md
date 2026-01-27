
# Fix Product Widgets on Players Page

## Problem Identified
The Players page uses **hardcoded static product data** with incomplete descriptions and links to category pages (e.g., `/tactical`) instead of linking to actual products on the services page (`/services?service={id}`).

## Solution
Replace the static product arrays with **dynamic data fetched from the `service_catalog` database**, and update the `ServiceCarousel` component to link to the correct URLs.

---

## Implementation Steps

### 1. Update ServiceCarousel Component
Modify `src/components/ServiceCarousel.tsx` to:
- Accept an optional `serviceId` property for each product
- Update the "Learn More" button to link to `/services?service={id}` when a service ID is provided
- Ensure the full description from the database is displayed (not truncated)

### 2. Fetch Real Products on Players Page
Update `src/pages/Players.tsx` to:
- Fetch products from `service_catalog` table grouped by category (tactical, psychological, technical, physical, conditioning, nutrition, data/analysis)
- Pass the real database data (including `id`, `name`, `description`, `price`, `image_url`) to each `ServiceCarousel`
- Ensure "Learn More" links go to `/services?service={product.id}`

### 3. Update Product Interface
Extend the `Product` interface in ServiceCarousel to include:
- `id?: string` - The service catalog ID for deep linking

---

## Technical Details

### Database Query Pattern
```typescript
const { data } = await supabase
  .from('service_catalog')
  .select('id, name, description, price, image_url, category')
  .ilike('category', '%tactical%')
  .limit(5);
```

### Link Pattern
```tsx
<Link to={product.id ? `/services?service=${product.id}` : product.link}>
```

### Description Display
Full description from database will be displayed without any truncation or line-clamp limits.

---

## Files to Modify
| File | Changes |
|------|---------|
| `src/components/ServiceCarousel.tsx` | Add `id` to Product interface, update Link logic |
| `src/pages/Players.tsx` | Replace static product arrays with database fetch, pass service IDs |

---

## Expected Outcome
- All product widgets on Players page will show **full descriptions** from the database
- "Learn More" buttons will link to `/services?service={id}` for the specific product
- Products will **auto-slide every 6 seconds** (already working)
- Product images will display as **square shape** (already working)
