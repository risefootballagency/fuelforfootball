# Memory: features/analysis/viewer-ultimate-specs-v17
Updated: now

The Analysis Viewer (AnalysisViewer.tsx) is a tactical interface with cinematic vignette shaders and a realistic grass background.
- Header: Large central FFF logo. 'Back' and 'Save' buttons fixed at 'top-4' with h-8 sizing and increased side padding (left-4/right-4 mobile, left-8/right-8 desktop). 
- Match Image & Arch: Image height capped at 400px. A massive gold arch (tripled height) is centered on the image's bottom edge, featuring a solid gold center, a transparent outer glow fade, and a mirrored downward arch below it. A green fade gradient (h-32 md:h-48) layers on top of the match image starting at the same Y-position.
- VS Section: Uses Smoky-Background.png behind the 'VS'. Non-player team names have opacity-70. Team names use responsive font sizes (text-xs to xl:text-2xl) with justify-end/start positioning and proper margins (ml-[22vw] mr-[12vw] for home, ml-[12vw] mr-[22vw] for away) to prevent both logo overlap AND VS circle overlap. Date is italicized with dark text shadow.
- Player Name: White text centered over the gold arch inside a small oval smoky background.
- Navigation: 'QuickNav' dropdown is centrally positioned with reduced padding (py-5 mt-5). It uses a radiating dark shader ring and 'instant' scrolling. Once used, a 'navigationUsed' flag disables auto-opening of other sections to prevent scroll interference. For sections near end of page, scrolls to document bottom first before positioning.
- Potential Matchups: Player images span the full height on the left; names (CAPITALS), numbers, and notes on the right.
- Kit Customization: Viewer now renders all kit properties including collar colour, number colour, and stripe style from the analysis data.
- Points Section: Images and videos are both optional - the viewer only renders them if present.
- PDF Export: Saves a single continuous page at high resolution (scale 3) to the 'analyses' bucket and updates the database record. Fixed elements are hidden during capture.
