

# Update All Service Pages to Match Analysis Page UI Design

## Summary

Every individual service page will be updated to exactly match the seamless, gap-free UI design perfected on the Analysis page. This means:

1. **Seamless dark green gradient backgrounds** that flow between sections with zero gaps
2. **Unified `max-w-6xl` content width** across all components (tabs, cards, content blocks)
3. **Proper section structure** with explicit gradient backgrounds and `py-0` or minimal padding
4. **Hero video with borders** using `heroVideoWithBorders={true}`
5. **ServiceDetailTabs** using the fixed grid layout (grid-cols-2 md:grid-cols-5)

---

## Files to Update (12 Total)

| File | Current Issues |
|------|---------------|
| `Mentorship.tsx` | Uses `ServiceSection` wrapper with padding gaps; `max-w-5xl` content width |
| `Consultation.tsx` | Uses `ServiceSection` wrapper; `max-w-5xl` width; no seamless background |
| `StrengthPowerSpeed.tsx` | Uses `ServiceSection` wrapper; `max-w-5xl` width; old tab system |
| `Technical.tsx` | Uses `ServiceSection` wrapper; `max-w-5xl` width |
| `Conditioning.tsx` | Uses `ServiceSection` wrapper; `max-w-5xl` width |
| `Mental.tsx` | Uses `ServiceSection` wrapper; `max-w-5xl` width |
| `ProPerformance.tsx` | Uses `ServiceSection` wrapper; `max-w-5xl` width; custom tabs not using ServiceDetailTabs |
| `ElitePerformance.tsx` | Uses `ServiceSection` wrapper; `max-w-5xl` width; custom tabs |
| `Nutrition.tsx` | Uses `ServiceSection` wrapper; `max-w-5xl` width |
| `ActionReports.tsx` | Uses `ServiceSection` wrapper; `max-w-5xl` width |
| `EfficiencyReports.tsx` | Uses `ServiceSection` wrapper; `max-w-5xl` width |

---

## Design Pattern from Analysis.tsx

Each section follows this structure:

```tsx
{/* Section - Seamless dark green background */}
<section className="relative">
  <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
  
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
    <ServiceSectionTitle>SECTION TITLE</ServiceSectionTitle>
    
    <div className="max-w-6xl mx-auto mt-4">
      {/* Content */}
    </div>
  </div>
</section>
```

---

## Changes Per File

### 1. Mentorship.tsx

**Current:** 4 sections using `<ServiceSection>` wrapper

**Changes:**
- Add `heroVideoWithBorders={true}` to layout
- Replace all `<ServiceSection>` with explicit `<section>` tags with dark green gradient
- Change all `max-w-5xl` to `max-w-6xl`
- Wrap `<ServiceFullPackage />` in gradient section like Analysis.tsx

### 2. Consultation.tsx

**Current:** 4 sections using `<ServiceSection>` wrapper

**Changes:**
- Add `heroVideoWithBorders={true}` to layout
- Replace all `<ServiceSection>` with explicit gradient sections
- Change all `max-w-5xl` to `max-w-6xl`
- Wrap `<ServiceFullPackage />` in gradient section

### 3. StrengthPowerSpeed.tsx

**Current:** Uses ServiceDetailTabs, 4 sections with `<ServiceSection>`

**Changes:**
- Add `heroVideoWithBorders={true}` to layout
- Replace all `<ServiceSection>` with explicit gradient sections
- Change all `max-w-5xl` to `max-w-6xl`
- Wrap `<ServiceFullPackage />` in gradient section

### 4. Technical.tsx

**Current:** Uses ServiceDetailTabs, sections with `<ServiceSection>`

**Changes:**
- Add `heroVideoWithBorders={true}` to layout
- Replace all `<ServiceSection>` with explicit gradient sections
- Change all `max-w-5xl` and `max-w-2xl` to `max-w-6xl` where appropriate
- Wrap `<ServiceFullPackage />` in gradient section

### 5. Conditioning.tsx

**Current:** Uses ServiceDetailTabs, sections with `<ServiceSection>`

**Changes:**
- Add `heroVideoWithBorders={true}` to layout
- Replace all `<ServiceSection>` with explicit gradient sections
- Change all `max-w-4xl`/`max-w-5xl` to `max-w-6xl`
- Wrap `<ServiceFullPackage />` in gradient section

### 6. Mental.tsx

**Current:** Uses ServiceDetailTabs, sections with `<ServiceSection>`

**Changes:**
- Add `heroVideoWithBorders={true}` to layout
- Replace all `<ServiceSection>` with explicit gradient sections
- Change all `max-w-5xl` to `max-w-6xl`
- Wrap `<ServiceFullPackage />` in gradient section

### 7. ProPerformance.tsx

**Current:** Custom tab buttons (not ServiceDetailTabs), sections with `<ServiceSection>`, no `<ServiceFullPackage>`

**Changes:**
- Add `heroVideoWithBorders={true}` to layout
- Replace all `<ServiceSection>` with explicit gradient sections
- Convert custom tabs to use `ServiceDetailTabs` component
- Change all `max-w-5xl` to `max-w-6xl`
- Add `<ServiceFullPackage />` wrapped in gradient section at bottom

### 8. ElitePerformance.tsx

**Current:** Custom tab buttons with state, sections with `<ServiceSection>`, no `<ServiceFullPackage>`

**Changes:**
- Add `heroVideoWithBorders={true}` to layout
- Replace all `<ServiceSection>` with explicit gradient sections
- Convert custom tabs to use `ServiceDetailTabs` component
- Change all `max-w-5xl` to `max-w-6xl`
- Add `<ServiceFullPackage />` wrapped in gradient section at bottom

### 9. Nutrition.tsx

**Current:** Uses ServiceDetailTabs, sections with `<ServiceSection>`

**Changes:**
- Add `heroVideoWithBorders={true}` to layout
- Replace custom benefits section with gradient structure
- Replace all `<ServiceSection>` with explicit gradient sections
- Change all `max-w-5xl` to `max-w-6xl`
- Wrap `<ServiceFullPackage />` in gradient section

### 10. ActionReports.tsx

**Current:** Sections with `<ServiceSection>`, no `<ServiceFullPackage>`

**Changes:**
- Add `heroVideoWithBorders={true}` to layout
- Replace all `<ServiceSection>` with explicit gradient sections
- Change all `max-w-5xl` to `max-w-6xl`
- Add `<ServiceFullPackage />` wrapped in gradient section at bottom

### 11. EfficiencyReports.tsx

**Current:** Uses ServiceDetailTabs, sections with `<ServiceSection>`

**Changes:**
- Add `heroVideoWithBorders={true}` to layout
- Replace all `<ServiceSection>` with explicit gradient sections
- Change all `max-w-5xl` to `max-w-6xl`
- Wrap `<ServiceFullPackage />` in gradient section

---

## Technical Details

### Common Section Template

For every section in every file, replace:
```tsx
<ServiceSection dark>
  <ServiceSectionTitle>TITLE</ServiceSectionTitle>
  {/* content */}
</ServiceSection>
```

With:
```tsx
<section className="relative">
  <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
  
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
    <ServiceSectionTitle>TITLE</ServiceSectionTitle>
    
    <div className="max-w-6xl mx-auto mt-4">
      {/* content */}
    </div>
  </div>
</section>
```

### Pillars Section Template

Wrap the pillars in same gradient structure:
```tsx
<section className="relative">
  <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_60%)]" />
  <div className="relative z-10">
    <ServicePillars pillars={pillars} large />
  </div>
</section>
```

### Full Package Section Template

```tsx
<section className="relative">
  <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.06)_0%,transparent_60%)]" />
  <div className="relative z-10 pt-0 pb-4">
    <ServiceFullPackage />
  </div>
</section>
```

### Hero Video Update

Every page gets:
```tsx
<ServicePageLayout
  category="CATEGORY NAME"
  title="PAGE TITLE"
  heroVideo="/videos/players-hero.mp4"
  heroVideoWithBorders  // Add this!
>
```

