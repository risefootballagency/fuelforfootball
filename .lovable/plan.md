

# Fix Analysis Page Spacing, Portal Example Navigation & Dialog Layout

## Issues to Fix

### 1. Analysis Page - "Our Analysis Services" Section Height
- The section cuts off abruptly at the bottom
- Need to add `pb-6` padding to ensure the last card has breathing room

### 2. Analysis Page - Space at End of "In Detail" Section
- Looking at the screenshot, there's visible empty space between the "In Detail" content and "THE FULL PACKAGE" section
- The container has `pb-4` which is causing this gap
- Change `pb-4` to `pb-0` to eliminate the space

### 3. Portal Example - Incorrect Dropdown Menu Design
The current PublicHub navigation doesn't match the Dashboard.tsx design:

**Current Problem:**
- Uses a different dropdown styling with simpler colors
- Button styling doesn't match Dashboard (missing gold borders, gold text colors)
- DropdownMenuContent styling is different

**Dashboard Pattern (Lines 1750-1807):**
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
      variant="outline" 
      className="w-full justify-center font-bebas uppercase text-xl px-6 py-6 bg-card hover:bg-card/80 border-t-2 border-gold border-x-0 border-b-2 !text-gold hover:!text-gold z-50 rounded-none"
    >
      <span>{activeTab === "hub" && "Hub"}</span>
      <ChevronDown className="ml-2 h-5 w-5" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start" className="w-[280px] bg-card border-2 border-gold shadow-lg shadow-gold/20 z-50">
    <DropdownMenuItem 
      onClick={() => setActiveTab("hub")}
      className="font-bebas uppercase text-base py-3 cursor-pointer text-gold hover:text-gold/80 hover:bg-gold/10"
    >
      Hub
    </DropdownMenuItem>
    ...
  </DropdownMenuContent>
</DropdownMenu>
```

**Fix:** Update PublicHub.tsx to use the exact same dropdown styling as Dashboard.tsx:
- Gold border (border-gold/border-accent)
- Gold text (!text-gold/text-accent)
- Uppercase font-bebas text
- Same padding and hover states

### 4. Portal Example Dialog - Lateral Scrolling & Exit Button
The PortalExampleDialog needs fixes:

**Current Issues:**
- Content can overflow horizontally causing lateral scrolling
- Close button exists but may need better visibility

**Fixes:**
- Add `overflow-x-hidden` to prevent lateral scrolling
- Update content wrapper to use proper width constraints
- Make close button more visible with text "CLOSE" or larger styling

---

## Technical Implementation

### File: `src/pages/services/Analysis.tsx`

**"Our Analysis Services" section (around line 164-255):**
- Change container padding from `pt-0 pb-0` to `pt-0 pb-6`
- This adds bottom padding so the last card doesn't cut off abruptly

**"In Detail" section (around line 257-299):**
- Change container padding from `pt-0 pb-4` to `pt-0 pb-0`
- This removes the empty space before "THE FULL PACKAGE"

### File: `src/pages/PublicHub.tsx`

**Navigation Section (around line 194-228):**
Replace the current dropdown styling with the exact Dashboard pattern:

```tsx
// Replace the nav section with Dashboard-style navigation
<nav className="w-full z-40">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="outline" 
        className="w-full justify-center font-bebas uppercase text-xl px-6 py-6 bg-card hover:bg-card/80 border-t-2 border-accent border-x-0 border-b-2 !text-accent hover:!text-accent z-50 rounded-none"
      >
        <span>
          {activeSection === 'hub' && 'Hub'}
          {activeSection === 'schedule' && 'Schedule'}
          {activeSection === 'analysis' && 'Analysis'}
          {activeSection === 'programmes' && 'Programmes'}
          {activeSection === 'highlights' && 'Highlights'}
        </span>
        <ChevronDown className="ml-2 h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="w-[280px] bg-card border-2 border-accent shadow-lg shadow-accent/20 z-50">
      {sections.map((section) => (
        <DropdownMenuItem 
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          className="font-bebas uppercase text-base py-3 cursor-pointer text-accent hover:text-accent/80 hover:bg-accent/10"
        >
          {section.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
</nav>
```

### File: `src/components/services/PortalExampleDialog.tsx`

**Prevent lateral scrolling and improve close button:**

```tsx
<DialogContent className="max-w-[95vw] w-full h-[95vh] bg-background border-white/10 p-0 overflow-hidden">
  <DialogHeader className="sr-only">
    <DialogTitle>Player Portal Example</DialogTitle>
  </DialogHeader>
  
  {/* Improved Close button - larger, more visible */}
  <button 
    onClick={() => onOpenChange(false)}
    className="absolute right-4 top-4 z-[60] px-4 py-2 rounded-lg bg-accent text-black font-bebas tracking-wider hover:bg-accent/90 transition-colors flex items-center gap-2"
  >
    <X className="w-4 h-4" />
    CLOSE
  </button>

  {/* Prevent horizontal overflow */}
  <div className="h-full overflow-y-auto overflow-x-hidden">
    <div className="w-full max-w-full">
      <PortalExample isEmbedded />
    </div>
  </div>
</DialogContent>
```

---

## Summary of Changes

| File | Change | Purpose |
|------|--------|---------|
| `Analysis.tsx` | Add `pb-6` to Services section | Prevent abrupt cut-off |
| `Analysis.tsx` | Remove `pb-4` from In Detail section | Eliminate empty space before Full Package |
| `PublicHub.tsx` | Replace dropdown with Dashboard-style nav | Exact UI match with authenticated portal |
| `PortalExampleDialog.tsx` | Add `overflow-x-hidden`, improve close button | Prevent lateral scroll, better UX |

