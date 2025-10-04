# Tags Feature - Visual Guide

## Admin Panel - Adding Tags

### Tags Section in Guide Form

```
┌─────────────────────────────────────────────────────────────┐
│  Tags (for filtering)                                       │
│  ┌───────────────────────────────────────┐  ┌──────────┐  │
│  │ Type a tag and press Enter...         │  │ Add Tag  │  │
│  └───────────────────────────────────────┘  └──────────┘  │
│                                                             │
│  [Adventure ×]  [Budget-Friendly ×]  [Nature ×]           │
│                                                             │
│  💡 Add tags to help users filter guides by theme,         │
│     budget, activity type, etc.                             │
└─────────────────────────────────────────────────────────────┘
```

**How it works:**

1. Type tag name in input field
2. Press Enter or click "Add Tag"
3. Tag appears as dark badge with × button
4. Click × to remove tag
5. All tags save with the guide

---

## Guides Page - Tag Filters

### Full Filter Layout

```
┌──────────────────────────────────────────────────────────────────┐
│                         GUIDES                                    │
│                                                                   │
│  ┌─────────────────────────────────────┐                        │
│  │ 🔍  Search guides...                 │                        │
│  └─────────────────────────────────────┘                        │
│                                                                   │
│  DIVISIONS:                                                       │
│  ( All Divisions )  ( Dhaka )  ( Chittagong )  ( Sylhet )  ...  │
│                                                                   │
│  CATEGORIES:                                                      │
│  ( All Guides )  ( Day Tour )  ( Beach )  ( Adventure )  ...    │
│                                                                   │
│  FILTER BY TAGS:                                                 │
│  ( ✓ Adventure )  ( Budget-Friendly )  ( ✓ Nature )  ( Beach ) │
│  ( Cultural )  ( Family-Friendly )  ( Historical )  ( Wildlife )│
│                          Clear all tags                          │
│                                                                   │
│  Showing 5 guides in Sylhet for Trekking with tags:             │
│  Adventure, Nature matching "forest"                             │
└──────────────────────────────────────────────────────────────────┘
```

**Color Coding:**

- **Orange background with ✓**: Selected tags (Adventure, Nature)
- **White background**: Available tags (Budget-Friendly, Beach, etc.)
- **Hover effect**: Border color changes on hover

**Interaction:**

- Click tag → Becomes selected (orange with ✓)
- Click again → Deselects (white)
- Multiple tags → Shows guides with ALL selected tags

---

## Guide Cards - Tag Display

### Individual Guide Card

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                   [GUIDE IMAGE]                         │
│                                                         │
│  Cultural                                               │
│                                                         │
│  Historic Dhaka Tour                                    │
│                                                         │
│  Explore Old Dhaka's heritage sites and                │
│  cultural landmarks                                     │
│                                                         │
│  Dhaka                                   3 steps        │
│                                                         │
│  [Budget-Friendly] [Historical] [Cultural]             │
│                                                         │
│  ┌─────────────────────────────────────┐              │
│  │ View Guide                        → │              │
│  └─────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

### Guide Card with Many Tags

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                   [GUIDE IMAGE]                         │
│                                                         │
│  Adventure                                              │
│                                                         │
│  Bandarban Hill Climbing                               │
│                                                         │
│  Highest peaks and indigenous culture                  │
│  exploration                                            │
│                                                         │
│  Chittagong                             8 steps        │
│                                                         │
│  [Adventure] [Trekking] [Cultural] [+1 more]          │
│                                                         │
│  ┌─────────────────────────────────────┐              │
│  │ View Guide                        → │              │
│  └─────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

**Tag Badge Style:**

- Semi-transparent white background
- White text with subtle border
- Rounded pill shape
- Compact spacing
- "+X more" badge for >3 tags

---

## User Journey Examples

### Example 1: Finding Budget Adventures

```
1. User clicks:
   ┌─────────────────┐
   │ ✓ Budget-Friendly│
   └─────────────────┘

2. Then clicks:
   ┌───────────┐
   │ ✓ Adventure│
   └───────────┘

3. Sees:
   "Showing 3 guides with tags: Budget-Friendly, Adventure"

   ✓ Historic Dhaka Tour
   ✓ Sylhet to Ratargul Adventure
   ✓ Rangpur Countryside
```

### Example 2: Family Beach Vacation

```
1. User clicks:
   ┌─────────────────┐
   │ ✓ Family-Friendly│
   └─────────────────┘

2. Then clicks:
   ┌───────┐
   │ ✓ Beach│
   └───────┘

3. Sees:
   "Showing 2 guides with tags: Family-Friendly, Beach"

   ✓ Cox's Bazar Beach
   ✓ Kuakata Beach Retreat
```

### Example 3: Cultural Photography Trip

```
1. User clicks:
   ┌──────────┐
   │ ✓ Cultural│
   └──────────┘

2. Then clicks:
   ┌──────────────┐
   │ ✓ Photography│
   └──────────────┘

3. Optionally selects division:
   ┌──────────┐
   │ ✓ Rajshahi│
   └──────────┘

4. Sees:
   "Showing 1 guide in Rajshahi with tags: Cultural, Photography"

   ✓ Paharpur Buddhist Monastery
```

---

## Filter Combinations

### How Filters Work Together

```
┌────────────────────────────────────────────────────┐
│  FILTER TYPE      │  LOGIC  │  BEHAVIOR            │
├────────────────────────────────────────────────────┤
│  Search           │  AND    │  Must match text     │
│  Division         │  OR     │  Only one selected   │
│  Category         │  OR     │  Only one selected   │
│  Tags (multiple)  │  AND    │  Must have ALL tags  │
├────────────────────────────────────────────────────┤
│  Between Types    │  AND    │  All must match      │
└────────────────────────────────────────────────────┘
```

**Example:**

```
Selected:
- Division: Sylhet
- Category: Trekking
- Tags: Adventure, Nature
- Search: "forest"

Results: Guides that are:
  ✓ In Sylhet
  ✓ AND categorized as Trekking
  ✓ AND tagged with Adventure
  ✓ AND tagged with Nature
  ✓ AND contain "forest" in title/description
```

---

## Empty States

### No Guides Found

```
┌────────────────────────────────────────────────────┐
│                                                    │
│                      🔍                            │
│                                                    │
│              No guides found                       │
│                                                    │
│    Try adjusting your filters or search term      │
│                                                    │
│         ┌─────────────────────┐                  │
│         │  Clear all filters  │                  │
│         └─────────────────────┘                  │
│                                                    │
└────────────────────────────────────────────────────┘
```

### No Tags Yet

```
If no guides have tags, the "Filter by Tags" section
simply doesn't appear on the guides page.
```

---

## Mobile Responsive Design

### On Mobile Devices

```
┌──────────────────────────┐
│      GUIDES             │
│                          │
│  ┌──────────────────┐   │
│  │ 🔍 Search...     │   │
│  └──────────────────┘   │
│                          │
│  DIVISIONS (scroll →)    │
│  [All] [Dhaka] [Chit]   │
│                          │
│  CATEGORIES (scroll →)   │
│  [All] [Day] [Beach]    │
│                          │
│  TAGS (wrap)             │
│  [Adventure]             │
│  [Budget] [Nature]      │
│  [Beach] [Cultural]     │
│                          │
│  Showing 12 guides      │
│                          │
│  ┌────────────────────┐ │
│  │                    │ │
│  │   [GUIDE CARD]     │ │
│  │                    │ │
│  └────────────────────┘ │
│                          │
│  ┌────────────────────┐ │
│  │                    │ │
│  │   [GUIDE CARD]     │ │
│  │                    │ │
│  └────────────────────┘ │
└──────────────────────────┘
```

Tags wrap naturally on smaller screens and remain
fully functional with touch interaction.

---

## Color Reference

### Tag Colors

- **Selected Tag**: `#cd8453` (Orange) - Brand accent color
- **Unselected Tag**: `#ffffff` (White) with `#e5e7eb` border
- **Hover**: Border changes to `#cd8453`
- **Card Tag Badge**: `rgba(255, 255, 255, 0.2)` (Semi-transparent white)

### States

- **Default**: White background, gray border
- **Hover**: Orange border
- **Active/Selected**: Orange background, white text, checkmark
- **Disabled**: N/A (all tags always clickable)

---

## Accessibility

### Keyboard Navigation

- Tab through tag buttons
- Enter/Space to select/deselect
- Focus indicators visible

### Screen Readers

- Proper ARIA labels
- Clear button text
- State changes announced

### Visual

- High contrast colors
- Clear selected state
- Descriptive text
