# Pros & Cons Block Feature

## Overview

Added a new content block type for displaying pros and cons side by side in a comparison format. This feature is perfect for helping users make informed decisions about travel destinations, seasons, accommodation options, etc.

## Visual Design

The pros and cons block displays two columns side by side (stacks on mobile):

### Light Theme

- **Pros Column**: Green-tinted background (`#e8f8f0`) with green border and checkmark icons
- **Cons Column**: Red-tinted background (`#ffe8e8`) with red border and X icons
- Both columns have rounded corners (28px) and match the design system
- Icons: ThumbsUp for pros section header, ThumbsDown for cons section header

### Dark Theme

- **Pros Column**: Green transparent background with green border
- **Cons Column**: Red transparent background with red border
- Both use backdrop blur for a modern glass-morphism effect
- Adapted colors for dark mode visibility

## Usage in Admin Panel

### Syntax

```
:::proscons [title="Your Title Here"]
[pros]
- First advantage
- Second advantage
- Third advantage
[/pros]

[cons]
- First disadvantage
- Second disadvantage
- Third disadvantage
[/cons]
:::
```

### Example

```
:::proscons [title="Visiting in Summer"]
[pros]
- Clear weather and excellent visibility
- All attractions are open
- Perfect for outdoor activities
- Best time for photography
[/pros]

[cons]
- Peak tourist season with large crowds
- Higher prices for accommodation
- Can be extremely hot during midday
- Need to book well in advance
[/cons]
:::
```

### Quick Insert Button

A new "Pros & Cons" button has been added to the Quick Insert section with:

- Gradient background (green to red)
- ThumbsUp icon
- Pre-filled template when clicked

## Technical Implementation

### 1. Type Definition (`types/index.ts`)

Added new `ProsConsBlock` interface:

```typescript
export interface ProsConsBlock {
  type: "proscons";
  id: string;
  title?: string;
  pros: string[];
  cons: string[];
}
```

Updated `ContentBlockType` and `ContentBlock` union type to include `'proscons'`.

### 2. Content Renderer (`components/ContentRenderer.tsx`)

Added `ProsConsBlockRenderer` component that:

- Renders two columns in a grid layout (responsive)
- Shows section headers with icons
- Displays checkmarks for pros and X marks for cons
- Applies theme-specific styling (light/dark)
- Handles optional main title

Added `prosConsClasses` theme configuration for styling.

### 3. Content Parser (`utils/contentParser.ts`)

Added parsing support:

- `parseProsConsData()` function to parse `[pros]` and `[cons]` sections
- Converts between text format and block structure
- Added validation to ensure both pros and cons are present
- Included in sample content

### 4. Admin Editor (`components/admin/GuideContentEditor.tsx`)

- Added template with example content
- Added Quick Insert button with gradient styling
- Added help documentation section
- Added syntax guide entry

### 5. Guide Detail Page (`app/guides/[id]/page.tsx`)

- Added proscons block rendering for the public-facing guide pages
- Renders two-column layout matching the dark theme design
- Shows section headers with ThumbsUp/ThumbsDown icons
- Displays checkmarks for pros and X marks for cons
- Fully responsive with mobile stacking

## How Users See It

When viewing a published guide at `/guides/[id]`, users will see:

### Desktop View

- **Two columns side by side** within the dark guide content area
- **Pros column (left)**:
  - Semi-transparent green background (#0f8450 at 10% opacity)
  - Green border (#0f8450 at 30% opacity)
  - "Pros" header in light green (#7dd6a7) with ThumbsUp icon
  - Checkmark icons (✓) in light green before each pro
  - White text on dark background for readability
- **Cons column (right)**:
  - Semi-transparent red background (#d62828 at 10% opacity)
  - Red border (#d62828 at 30% opacity)
  - "Cons" header in light red (#ff9999) with ThumbsDown icon
  - X mark icons (✗) in light red before each con
  - White text on dark background for readability
- Optional main title centered above both columns

### Mobile View

- Columns stack vertically (Pros on top, Cons below)
- Maintains all styling and readability
- Proper spacing between columns
- Touch-friendly layout

### Visual Styling

- Rounded corners (28px) matching other content blocks
- Backdrop blur effect for modern glass-morphism appearance
- Consistent 76px spacing between content blocks
- Text sizes: 18-20px for content, 28-36px for headers
- Icons sized at 24px (checkmarks/X) and 32px (headers)

### Example Appearance

```
┌─────────────────────────────────────────────────────────────┐
│            Visiting in Summer (optional title)               │
├───────────────────────────┬─────────────────────────────────┤
│  👍 Pros                  │  👎 Cons                        │
│  (green bg, green border) │  (red bg, red border)           │
├───────────────────────────┼─────────────────────────────────┤
│  ✓ Clear weather          │  ✗ Peak tourist season          │
│  ✓ All attractions open   │  ✗ Higher prices                │
│  ✓ Perfect for outdoors   │  ✗ Extremely hot at midday      │
│  ✓ Best for photography   │  ✗ Book well in advance         │
└───────────────────────────┴─────────────────────────────────┘
```

## Features

✅ Side-by-side comparison layout  
✅ Responsive design (stacks on mobile)  
✅ Theme support (light/dark)  
✅ Optional title for the section  
✅ Visual icons (checkmarks & X marks)  
✅ Consistent with existing design system  
✅ Full TypeScript support  
✅ Validation in content parser  
✅ Help documentation in editor

## Use Cases

- **Seasonal comparisons**: "Visiting in Summer vs Winter"
- **Transportation options**: "Bus vs Train vs Flight"
- **Accommodation types**: "Hotels vs Guesthouses"
- **Activity choices**: "Mountain Trekking vs Beach Relaxation"
- **Budget considerations**: "Budget Travel vs Luxury Travel"
- **Time of day visits**: "Morning vs Evening visits"

## Design Consistency

The pros/cons block follows the same design patterns as other content blocks:

- Rounded corners (28px border radius)
- Proper spacing (76px between blocks)
- Responsive typography
- Icon usage consistent with tips/notes blocks
- Theme-aware color schemes
- Smooth hover transitions

## Mobile Responsiveness

- Desktop: Two columns side by side
- Tablet: Two columns with reduced spacing
- Mobile: Stacks vertically for better readability
- Text sizes scale appropriately
- Touch-friendly spacing

## Accessibility

- Semantic HTML structure
- Color contrast meets WCAG guidelines
- Icons have proper stroke width for visibility
- Alt text considerations
- Screen reader friendly structure

## Testing Recommendations

1. Create a guide with pros/cons block
2. Test in both light and dark themes
3. Verify mobile responsive behavior
4. Check that reload persistence works
5. Validate with and without optional title
6. Test with varying amounts of pros/cons

## Future Enhancements

- [ ] Custom icon support
- [ ] Color scheme customization
- [ ] Import/export pros/cons from spreadsheet
- [ ] Voting/rating system integration
- [ ] Comparison scoring feature
