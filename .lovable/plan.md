
# Fix ServiceCarousel Layout and Visibility on Players Page

## Issues Identified

1. **Learn More button not visible** - The button exists in code but the layout may be causing it to be cut off or hidden
2. **Image not square** - Despite `aspect-square`, the image container may not be enforcing the correct ratio
3. **Side content not filling space** - The description, Daily Fuel, and category button should expand to fill the available space next to the product widget

---

## Solution

### 1. Fix ServiceCarousel Component Layout

Update `src/components/ServiceCarousel.tsx` to ensure:
- The button is always visible with proper flex layout
- The image container enforces square aspect ratio
- No content overflow hides the button

**Changes:**
- Wrap content in a proper flex column with `justify-between`
- Add `mt-auto` to button to push it to the bottom
- Ensure the card structure doesn't hide overflow

### 2. Fix ServiceSection Layout in Players.tsx

Update the `ServiceSection` component to make the description/Daily Fuel side properly fill the remaining space:
- Change grid layout so description side uses `flex-1` properly
- Remove fixed heights that may constrain content
- Ensure the side column stretches to match the carousel height

---

## Technical Details

### ServiceCarousel.tsx Updates

```tsx
// Update card structure for proper visibility
<div className="bg-card border border-border/50 rounded-lg overflow-hidden hover:border-accent/50 transition-all duration-300 flex flex-col h-full">
  {/* Square Image */}
  <div className="w-full aspect-square overflow-hidden bg-muted flex-shrink-0">
    <img src={product.image} className="w-full h-full object-cover" />
  </div>
  
  {/* Content - flex-grow with button at bottom */}
  <div className="p-4 md:p-6 flex flex-col flex-grow bg-card">
    <h4>...</h4>
    <p className="flex-grow">...</p>
    
    {/* Button always at bottom */}
    <Button className="w-full mt-auto">
      <Link to={...}>Learn More</Link>
    </Button>
  </div>
</div>
```

### Players.tsx ServiceSection Updates

```tsx
// Grid with proper stretch
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
  {/* Carousel - contained */}
  <div className="h-full">
    <ServiceCarousel products={products} />
  </div>
  
  {/* Description side - fills remaining space */}
  <div className="flex flex-col h-full justify-between">
    <p className="text-muted-foreground flex-grow">
      {description}
    </p>
    
    <div className="mt-auto space-y-6">
      <Button>Category Button</Button>
      <DailyFuel />
    </div>
  </div>
</div>
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/ServiceCarousel.tsx` | Fix flex layout, ensure button visibility, enforce square image |
| `src/pages/Players.tsx` | Update ServiceSection grid to fill space properly |

---

## Expected Outcome

- **Learn More button** clearly visible on every product slide
- **Square product images** properly enforced
- **Side content** (description, Daily Fuel, category button) fills the space next to the product widget
- **6-second auto-slideshow** continues working as before
