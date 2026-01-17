# Memory: features/analysis/viewer-ultimate-specs-v20-pdf-hybrid
Updated: now

The Analysis Viewer (AnalysisViewer.tsx) is a tactical interface featuring cinematic vignette shaders, a realistic grass background, and character-scrolling HoverText effects.
- Header: Large central FFF logo. 'Back' and 'Save' buttons are standardized (h-8 py-1.5 px-3) and positioned at 'top-4' with high side padding (left-4 md:left-8, right-4 md:right-8).
- Match Image & Arch: Image height is capped at 400px. A massive gold arch is centered on the bottom edge of the image, covering the edge completely. It features a solid gold center, a transparent outer glow, and a mirrored downward arch below merging into the grass. A green fade gradient (h-32 md:h-48) layers on top of the image.
- VS Section: Uses Smoky-Background.png behind 'VS'. Team names use fluid typography (CSS clamp 10px-24px) with multi-line wrapping (break-word) and centered alignment. The non-player team is set to opacity-70. The date is italicized with dark text shadow shading.
- Player Name: White text centered over the gold arch inside a small oval smoky background.
- Navigation: 'Jump to Section' dropdown is centrally positioned below the player name with a radiating dark shader ring. It uses instant scrolling and a 'navigationUsed' flag that disables all auto-opening/closing of other sections once used to prevent positioning conflicts.
- Matchups: Player images span the full height of the box on the left; names (CAPITALS), numbers, and notes on the right.
- Schemes: Formation name in a skewed black/gold box. Player kits are realistic V-neck shapes with 25% increased sizing. Names have gold glowing shadows and accent lines.
- Video: AnalysisVideo component handles muted, looping, auto-play/pause via IntersectionObserver.
- PDF Export: Uses hybrid html2canvas + jsPDF approach (src/lib/analysisPdfExport.ts). The `isSaving` state triggers `forceOpen={isSaving}` on all ExpandableSection components, expanding them before capture. html2canvas captures at scale 3 with CORS enabled and a dark green background. Global CSS `[data-printing]` disables animations during capture. Multi-page PDFs are created by slicing the canvas into A4 page segments.
