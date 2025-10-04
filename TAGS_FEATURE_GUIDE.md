# Tags Feature Guide

## Overview

The tags feature allows you to categorize guides with flexible, custom tags that users can click to filter guides by similar themes, budget types, activities, or any other criteria.

## Features

### 1. **Admin: Adding Tags to Guides**

When creating or editing a guide in the admin panel:

- Find the "Tags" section below the basic info fields (Division, Category)
- Type a tag name in the input field
- Press **Enter** or click **Add Tag** button
- Tags appear as colored badges below the input
- Click the **×** on any tag to remove it
- No limit on number of tags per guide

**Example Tags:**

- Budget-Friendly
- Family-Friendly
- Adventure
- Cultural
- Historical
- Nature
- Beach
- Photography
- Wildlife
- Food
- Trekking
- Camping
- UNESCO
- Unique Experience
- Boat Tour
- Village Tour
- Tea Gardens
- Shopping
- Relaxation

### 2. **User: Filtering Guides by Tags**

On the guides page (`/guides`):

- Tags appear as filter buttons below the Division and Category filters
- Only tags that are used in at least one guide will appear
- Click any tag to filter guides with that tag
- Click multiple tags to show guides that have **ALL** selected tags (AND logic)
- Selected tags have a checkmark (✓) and orange background
- Click a selected tag again to deselect it
- Click "Clear all tags" to remove all tag filters
- Click "Clear all filters" to reset all filters including tags

### 3. **Guide Cards Display**

Each guide card shows:

- Up to 3 tags as small badges with semi-transparent white backgrounds
- If more than 3 tags exist, a "+X more" badge appears
- Tags help users quickly identify guide characteristics

## How It Works

### Data Structure

```typescript
interface GuideData {
  // ... other fields
  tags?: string[]; // Optional array of tag strings
}
```

### Filtering Logic

- **Division Filter**: Filters by selected division (OR logic - only one can be selected)
- **Category Filter**: Filters by selected category (OR logic - only one can be selected)
- **Tags Filter**: Shows guides that have ALL selected tags (AND logic - multiple can be selected)
- **Search**: Additionally filters by title/description text match
- All filters work together (AND logic between different filter types)

## Use Cases

### Example 1: Budget Traveler

A user looking for budget-friendly options:

1. Click "Budget-Friendly" tag
2. See all guides tagged with "Budget-Friendly"
3. Can further filter by division (e.g., "Sylhet")

### Example 2: Family Vacation

A family planning a trip:

1. Click "Family-Friendly" tag
2. Click "Beach" tag
3. See guides suitable for families at beach destinations

### Example 3: Adventure Seeker

An adventure enthusiast:

1. Click "Adventure" tag
2. Click "Nature" tag
3. Click "Trekking" tag
4. See only guides with all three characteristics

## Best Practices

### For Admins:

1. **Be Consistent**: Use the same tag names across guides (e.g., "Budget-Friendly" not "Budget" or "Cheap")
2. **Keep Tags Short**: 1-3 words max
3. **Use Title Case**: Makes tags look professional
4. **Think Categories**: Consider different ways users might search:
   - By budget (Budget-Friendly, Luxury, Mid-Range)
   - By activity (Adventure, Relaxation, Cultural)
   - By audience (Family-Friendly, Solo Travel, Couples)
   - By features (Beach, Mountains, Wildlife, Historical)
   - By special interests (Photography, Food, Shopping)
5. **Limit Tags**: 3-5 tags per guide is usually enough
6. **Avoid Redundancy**: Don't tag what's already in Category or Division

### For Users:

1. **Combine Filters**: Use tags with division/category filters for precise results
2. **Multiple Tags**: Select multiple tags to narrow down options
3. **Clear Filters**: Use "Clear all filters" to start fresh if results are too narrow

## Technical Implementation

### Files Modified:

1. **types/index.ts**: Added `tags?: string[]` to `GuideData` interface
2. **components/admin/EnhancedGuideForm.tsx**:
   - Added tag input field with add/remove functionality
   - State management for tag input
3. **app/guides/page.tsx**:
   - Added tag extraction from all guides
   - Added tag filtering logic
   - Added tag filter UI with toggle functionality
   - Updated results count to show selected tags
4. **components/shared/GuideCard.tsx**: Added tag display (max 3 visible)
5. **constants/index.ts**: Added sample tags to default guides

### Key Functions:

```typescript
// Extract all unique tags
const allTags = useMemo(() => {
  const tagsSet = new Set<string>();
  guides.forEach((guide) => {
    guide.tags?.forEach((tag) => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
}, [guides]);

// Toggle tag selection
const toggleTag = (tag: string) => {
  setSelectedTags((prev) =>
    prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
  );
};

// Filter guides by tags (AND logic)
const matchesTags =
  selectedTags.length === 0 ||
  selectedTags.every((tag) => guide.tags?.includes(tag));
```

## Future Enhancements

Potential improvements:

1. **Popular Tags**: Show most-used tags first
2. **Tag Suggestions**: Auto-suggest tags while typing
3. **Tag Management**: Admin page to manage/rename tags across all guides
4. **Tag Analytics**: Track which tags users click most
5. **Related Guides**: Show guides with similar tags
6. **Tag Cloud**: Visual representation of tag popularity
7. **OR Logic Option**: Toggle between AND/OR logic for multiple tags
8. **Tag Colors**: Different colors for different tag categories

## Support

For questions or issues with the tags feature, please refer to the main documentation or contact the development team.
