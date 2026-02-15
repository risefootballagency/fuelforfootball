# Memory: features/staff/analysis-management-specs-v13
Updated: now

The staff analysis system manages Pre-Match, Post-Match, and Concept reports via AnalysisManagement.
- Image Cropping: Integrated cropping for match images (16:9, max 400px height) and club logos (flexible aspect ratio for positioning, minZoom 0.3). Cropping tool allows zooming out and manual positioning/moving of the image within the crop area. Logo crops have `restrictPosition={false}` to allow free movement.
- Scheme Management: Supports 10 specific formations (4-2-1-3, 4-2-4, 4-3-3, 3-4-1-2, 3-3-2-2, etc.) matching the coaching database. Changing a scheme preserves existing player surnames and numbers in their index order.
- Kit Customization: Full control over primary, secondary, collar/trim, and number colours (UK spelling). Stripe styles include none, thin, thick, and halves. Starting XI preview in editor matches the high-end viewer aesthetic.
- Match Details: Includes 'Player Name (for display)' and a selector to designate the 'Player's Team' (controlling the opacity effect in the viewer).
- Matchups: Includes an editable 'notes' field for brief player introductions.
- Points: Images and videos are both marked as "(Optional)" - either or both can be used.
- Save Logic: Uses graceful degradation for shared database compatibility. Attempts save with new UI-only fields (kit_collar_color, kit_number_color, kit_stripe_style, player_team), and if the shared database lacks these columns, automatically retries without them. Only includes fields with defined values to avoid undefined errors.
- Video URL: Removed the optional video URL text input from all analysis sections (MatchDetails, Overview, KeyDetails). Only the file upload option remains.
- Quick Link: Player dropdown now shows ALL players (no representation_status filter). A "+" button next to the fixture selector opens a dialog to create a new fixture inline, linking it to the selected player.
- Analyst Restrictions: Analysts (isAnalystOnly) cannot see the Settings button, AI Point Writer tab, or any "Use AI" buttons on points/schemes. Error toasts for failed fetch are suppressed for analysts.
