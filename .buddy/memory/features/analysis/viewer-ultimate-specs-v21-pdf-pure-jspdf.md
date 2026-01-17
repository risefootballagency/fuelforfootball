# Memory: features/analysis/viewer-ultimate-specs-v21-pdf-pure-jspdf
Updated: now

The Analysis Viewer PDF export now uses pure jsPDF programmatic rendering instead of html2canvas DOM capture.

## PDF Export Implementation
- **File**: `src/lib/analysisPdfExport.ts`
- **Approach**: Programmatically draws each element using jsPDF's native API
- **Fonts**: Uses built-in Helvetica (bold/normal/italic) for reliable rendering
- **Colors**: Brand colors defined as RGB tuples for jsPDF compatibility

## Key Functions
- `exportAnalysisPdf(analysis: AnalysisData, fileName: string)`: Main export function
- `addSectionTitle()`: Gold background bar with centered uppercase title
- `addParagraph()`: Wrapped text with automatic line splitting
- `addBulletPoint()`: Gold circle with +/- icon and italic text
- `checkPageBreak()`: Automatic page management with dark green background

## PDF Structure
1. **Header**: Gold bar with match title and score/date
2. **Player Name**: Centered oval box with player name
3. **Overview**: Content card with key details
4. **Opposition Strengths**: Bullet points with + icons
5. **Opposition Weaknesses**: Bullet points with - icons
6. **Matchups**: Cards with name, number, and notes
7. **Scheme**: Formation badge and paragraphs
8. **Analysis Points**: Section per point with descriptions
9. **Footer**: Gold bar with "Fuel for Football" branding

## Benefits Over html2canvas
- Guaranteed font rendering (no garbled text)
- Smaller file size (vector text vs raster image)
- Selectable/searchable text in PDF
- No CORS issues with images
- Faster generation
