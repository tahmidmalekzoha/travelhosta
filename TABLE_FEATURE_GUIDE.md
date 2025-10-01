# Table Feature Documentation

## Overview

The table feature allows you to create structured, professional-looking tables in your travel guides. Tables are perfect for:

- **Price comparisons** (Budget vs Mid-Range vs Luxury)
- **Itinerary schedules** (Time, Activity, Cost)
- **Packing lists** (Item, Quantity, Notes)
- **Transportation options** (Mode, Duration, Cost)
- **Accommodation comparisons** (Hotel, Location, Price, Rating)

## Two Ways to Create Tables

### Method 1: Visual Table Editor (Recommended)

The visual table editor provides a WYSIWYG interface for creating tables.

**Steps:**

1. Click the **"Table (Visual Editor)"** button (purple button with table icon)
2. A modal will open with:
   - **Title field** (optional) - Main heading for your table
   - **Caption field** (optional) - Description below the table
   - **Visual table editor** - Edit cells directly
   - **Live preview** - See how it will look

**Editor Features:**

- ✏️ **Edit cells** - Click any cell to edit content
- ➕ **Add columns** - Click "+ Column" button
- ➕ **Add rows** - Click "+ Row" button
- 🗑️ **Delete columns** - Click trash icon on column header
- 🗑️ **Delete rows** - Click trash icon on row
- ⬅️➡️ **Move columns** - Use arrow buttons to reorder
- ⬆️⬇️ **Move rows** - Use arrow buttons to reorder
- 👁️ **Live preview** - See final appearance at bottom

**Tips:**

- Start with default 3 columns, 2 rows - add/remove as needed
- Headers are automatically styled with dark background
- Use clear, concise text in cells
- Keep column widths balanced (avoid very long text in one cell)

### Method 2: Text Syntax

You can also write tables directly using pipe-separated syntax.

**Syntax:**

```
:::table [title="Your Title" caption="Your Caption"]
Header 1 | Header 2 | Header 3
---
Row 1, Cell 1 | Row 1, Cell 2 | Row 1, Cell 3
Row 2, Cell 1 | Row 2, Cell 2 | Row 2, Cell 3
:::
```

**Rules:**

- Headers on first line, separated by `|`
- Separator line `---` after headers
- Data rows, each cell separated by `|`
- Title and caption are optional
- Spaces around `|` are trimmed automatically

## Examples

### Example 1: Price Comparison Table

```
:::table [title="Accommodation Options" caption="Prices per night in Taka"]
Hotel | Location | Budget | Mid-Range | Luxury
---
Green View | City Center | 800 | 1500 | N/A
Rose Hotel | Downtown | 1200 | 2000 | 3500
Grand Plaza | Business District | N/A | 3000 | 5000
Hilltop Resort | Outskirts | 1000 | 2500 | 4500
:::
```

**Rendered Output:**

- Title "Accommodation Options" appears centered above table
- Table with alternating row colors for readability
- Headers in dark background with white text
- Caption "Prices per night in Taka" appears below
- Hover effect on rows for interactivity

### Example 2: Itinerary Schedule

```
:::table [title="Day 1 Schedule"]
Time | Activity | Location | Duration | Cost
---
6:00 AM | Departure from Dhaka | Kamalapur Station | - | 395 Taka
12:00 PM | Arrival in Sylhet | Sylhet Station | 6 hours | -
1:00 PM | Lunch | Panshi Restaurant | 1 hour | 300 Taka
3:00 PM | Shahjalal Mazar Visit | City Center | 2 hours | Free
6:00 PM | Keane Bridge Sunset | North Sylhet | 1 hour | Free
8:00 PM | Dinner | Hotel Restaurant | 1 hour | 400 Taka
:::
```

### Example 3: Packing List

```
:::table [title="Essential Packing List" caption="Don't forget these items!"]
Item | Quantity | Purpose | Notes
---
Sunscreen | 1 bottle | Sun protection | SPF 50+ recommended
Water bottle | 1-2 | Hydration | Reusable preferred
Comfortable shoes | 1 pair | Walking | Break in before trip
Light jacket | 1 | Mornings/evenings | Even in summer
Camera | 1 | Photos | Bring extra batteries
First aid kit | 1 small | Emergencies | Include basic medicines
Power bank | 1 | Charging | 10,000 mAh minimum
:::
```

### Example 4: Transportation Comparison

```
:::table [title="Dhaka to Sylhet Transportation"]
Mode | Duration | Comfort | Cost | Frequency | Best For
---
Train | 6 hours | Good | 395-580 Taka | 2-3/day | Budget travelers
Bus (AC) | 5-6 hours | Fair | 600-800 Taka | Hourly | Mid-budget
Bus (Non-AC) | 6-7 hours | Basic | 400-500 Taka | Frequent | Budget
Flight | 50 min | Excellent | 3500-5000 Taka | 3-4/day | Time-conscious
Private Car | 4-5 hours | Very Good | 8000-12000 Taka | On demand | Groups/families
:::
```

### Example 5: Budget Breakdown

```
:::table [title="2-Day Trip Budget" caption="All amounts in Bangladeshi Taka (per person)"]
Category | Budget Travel | Mid-Range | Luxury | Notes
---
Transport | 800 | 1500 | 4000 | Includes round trip
Accommodation | 1200 | 4000 | 12000 | 2 nights
Food | 600 | 1200 | 3000 | All meals
Activities | 300 | 800 | 2000 | Entry fees, tours
Shopping | 500 | 1000 | 3000 | Souvenirs, gifts
Miscellaneous | 500 | 1000 | 2000 | Buffer/emergencies
**Total** | **3900** | **9500** | **26000** | Grand total
:::
```

## Styling Features

### Automatic Styling

The table renderer applies professional styling automatically:

**Headers:**

- Dark background (#1b3c44)
- White text
- Bold font
- Padding for readability
- Borders between columns

**Data Rows:**

- Alternating colors (white and light gray)
- Hover effect (changes to beige #f2eee9)
- Borders between cells
- Proper padding

**Overall:**

- Rounded corners
- Shadow effect
- Responsive (scrolls horizontally on mobile)
- White background
- Professional appearance

### Responsive Design

- On desktop: Full table width, all columns visible
- On tablet: Horizontal scroll if needed
- On mobile: Full horizontal scroll for wide tables
- Always readable and accessible

## Best Practices

### Content Guidelines

1. **Keep Headers Short**

   - ✅ Good: "Duration", "Cost", "Time"
   - ❌ Avoid: "How long it takes to complete", "The total amount in Taka"

2. **Consistent Data Format**

   - ✅ All prices in same currency (Taka)
   - ✅ Same units (hours, not mix of hours/minutes)
   - ✅ Similar detail level across rows

3. **Use Alignment**

   - Numbers naturally align right
   - Text aligns left
   - Keep consistent for scannability

4. **Limit Columns**

   - Ideal: 3-5 columns
   - Maximum: 6-7 columns
   - More columns = harder to read on mobile

5. **Appropriate Row Count**
   - Minimum: 2 data rows (after header)
   - Ideal: 3-8 rows
   - Maximum: 12-15 rows (consider splitting into multiple tables)

### Design Tips

1. **Add Context**

   - Use title to explain the table's purpose
   - Use caption to add important notes
   - Place related text block before/after table

2. **Strategic Placement**

   - Tables work well after descriptive text
   - Group related tables together
   - Don't start a guide with a table

3. **Combine with Other Blocks**

   ```
   :::text [heading="Accommodation Guide"]
   Sylhet offers various accommodation options for every budget.
   Here's a comprehensive comparison to help you choose:
   :::

   :::table [title="Hotels Comparison"]
   [Your table here]
   :::

   :::text
   All hotels listed above are in safe areas with good access
   to transportation and attractions.
   :::
   ```

## Common Use Cases

### Use Case 1: Budget Planning

Perfect for helping travelers plan their expenses.

```
:::table [title="Daily Budget Estimate" caption="Per person, per day"]
Expense Type | Budget | Mid-Range | Luxury
---
Breakfast | 50-80 | 150-200 | 300-400
Lunch | 100-150 | 250-350 | 500-700
Dinner | 150-200 | 350-450 | 700-1000
Snacks/Tea | 50-100 | 100-150 | 200-300
Transport | 200-300 | 500-700 | 1000-1500
Activities | 100-200 | 300-500 | 800-1200
Total | 650-1030 | 1650-2350 | 3500-5100
:::
```

### Use Case 2: Comparing Options

Help travelers make informed decisions.

```
:::table [title="Train Options Dhaka-Sylhet"]
Train Name | Departure | Arrival | Class | Fare
---
Parabat Express | 06:30 | 12:30 | Shovan | 395
Upaban Express | 21:30 | 05:00 | Shovan | 395
Kalni Express | 23:00 | 06:20 | AC | 850
Joyontika Express | 15:30 | 22:00 | Snigdha | 580
:::
```

### Use Case 3: Weather Information

Seasonal travel planning.

```
:::table [title="Sylhet Weather Guide"]
Month | Avg Temp (°C) | Rainfall | Crowd Level | Best For
---
January | 15-25 | Low | High | Sightseeing
April | 25-35 | Medium | Medium | Tea gardens
July | 28-32 | Very High | Low | Waterfalls
October | 20-30 | Medium | Medium | All activities
:::
```

## Troubleshooting

### Common Issues

**Problem: Columns don't align**

- **Cause**: Different number of cells in rows
- **Solution**: Ensure all rows have same number of cells as headers

**Problem: Table too wide on mobile**

- **Cause**: Too many columns or long text
- **Solution**: Reduce columns, shorten text, or split into two tables

**Problem: Empty cells show nothing**

- **Cause**: Cells are truly empty
- **Solution**: Add "N/A", "-", or "TBD" for clarity

**Problem: Table not parsing**

- **Cause**: Missing `:::` markers or `---` separator
- **Solution**: Check syntax, use visual editor to generate correct format

### Validation Errors

**"At least one header column is required"**

- Add headers on first line

**"At least one data row is required"**

- Add at least one row after the `---` separator

**"Column count mismatch"**

- Ensure all rows have same number of `|` separators
- Each row should have same columns as header

## Tips for Content Creators

1. **Start Simple**: Begin with 3 columns, 3 rows. Expand as needed.

2. **Use Visual Editor**: Much easier than writing syntax manually.

3. **Preview Often**: Click "Show Preview" to see how table looks.

4. **Test on Mobile**: Tables should be readable on phones.

5. **Be Consistent**: Use similar tables throughout your guide for consistency.

6. **Add Context**: Always explain what the table shows (title/text).

7. **Update Regularly**: Keep prices and information current.

8. **Consider Alternatives**: Sometimes a list or text is clearer than a table.

## Examples in Context

Here's how to structure content with tables:

```
:::text [heading="Planning Your Sylhet Trip"]
Budget is a crucial factor when planning any trip. Here's a detailed
breakdown to help you plan according to your preferences.
:::

:::table [title="Complete Trip Budget" caption="2-day trip, per person"]
Category | Budget | Mid-Range | Luxury
---
Transport | 800 | 1500 | 4000
Hotel (2 nights) | 1200 | 4000 | 12000
Food (all meals) | 600 | 1200 | 3000
Activities | 300 | 800 | 2000
Total | 2900 | 7500 | 21000
:::

:::text
As you can see, Sylhet can accommodate any budget level. Budget travelers
can have a great experience for under 3000 Taka, while luxury seekers
can enjoy premium services for around 20,000 Taka.
:::
```

---

## Quick Reference

**Visual Editor:**

- Click purple "Table (Visual Editor)" button
- Edit cells directly
- Add/remove rows and columns
- Click "Insert Table" when done

**Text Syntax:**

```
:::table [title="Title" caption="Caption"]
Header 1 | Header 2 | Header 3
---
Data 1 | Data 2 | Data 3
:::
```

**Features:**

- ✅ Headers with dark background
- ✅ Alternating row colors
- ✅ Hover effects
- ✅ Responsive design
- ✅ Optional title and caption

**Best For:**

- Price comparisons
- Schedule/itineraries
- Feature comparisons
- Budget breakdowns
- Packing lists

---

Tables make your travel guides more professional, informative, and user-friendly. Use them strategically to present structured data clearly!
