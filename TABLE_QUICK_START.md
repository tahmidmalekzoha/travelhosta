# Quick Start: Creating Tables

## Method 1: Visual Editor (Easiest!)

### Step-by-Step

**1. Open the Editor**

```
Admin Panel → Guides → Create/Edit Guide → Click purple "Table (Visual Editor)" button
```

**2. See the Modal**
You'll see:

- Title field (optional)
- Caption field (optional)
- Editable table (3 columns × 2 rows by default)
- Live preview at bottom

**3. Edit Your Table**

**Change Headers:**

- Click on any header cell (e.g., "Column 1")
- Type new name (e.g., "Item")
- Press Enter or click outside

**Edit Data:**

- Click on any cell
- Type your data
- Cells auto-save as you type

**Add Column:**

- Click "+ Column" button
- New column appears on right
- Edit the new header and cells

**Add Row:**

- Click "+ Row" button
- New row appears at bottom
- Fill in the cells

**Remove Column:**

- Click trash icon (🗑️) on column header
- Column deleted (minimum 1 column required)

**Remove Row:**

- Click trash icon (🗑️) on row side
- Row deleted (minimum 1 row required)

**Reorder Columns:**

- Click left arrow (⬅️) to move column left
- Click right arrow (➡️) to move column right

**Reorder Rows:**

- Click up arrow (⬆️) to move row up
- Click down arrow (⬇️) to move row down

**4. Add Title/Caption (Optional)**

- Type in "Table Title" field for heading
- Type in "Caption" field for description

**5. Preview**

- Scroll down to see "Preview" section
- See exactly how table will look
- Make adjustments if needed

**6. Insert**

- Click "Insert Table" button
- Table syntax added to your content
- Modal closes
- Continue editing guide

---

## Method 2: Text Syntax

### Basic Structure

```
:::table
Header 1 | Header 2 | Header 3
---
Row 1 Cell 1 | Row 1 Cell 2 | Row 1 Cell 3
Row 2 Cell 1 | Row 2 Cell 2 | Row 2 Cell 3
:::
```

### With Title and Caption

```
:::table [title="My Table Title" caption="Additional info"]
Header 1 | Header 2
---
Data 1 | Data 2
:::
```

### Rules

- Use `|` (pipe) to separate cells
- First line = headers
- Second line = `---` (separator)
- Following lines = data rows
- Spaces around `|` are ignored
- Each row must have same number of cells

---

## Real Examples

### Example 1: Simple Price List

```
:::table [title="Hotel Prices" caption="Per night in Taka"]
Hotel | Budget | Deluxe
---
Green View | 800 | 1500
Rose Hotel | 1200 | 2000
Grand Plaza | 1500 | 2500
:::
```

### Example 2: Itinerary

```
:::table [title="Day 1 Schedule"]
Time | Activity | Cost
---
6:00 AM | Train to Sylhet | 395 Taka
12:00 PM | Lunch | 200 Taka
3:00 PM | Mazar Visit | Free
8:00 PM | Dinner | 300 Taka
:::
```

### Example 3: Comparison

```
:::table [title="Transport Options"]
Mode | Duration | Cost | Comfort
---
Train | 6 hours | 395 | Good
Bus | 5 hours | 600 | Fair
Flight | 1 hour | 4000 | Excellent
:::
```

---

## Tips

✅ **Start simple** - Begin with 3 columns, 2-3 rows
✅ **Use visual editor** - Much easier than typing syntax
✅ **Keep headers short** - "Price" not "Price in Taka"
✅ **Add title** - Explains what table shows
✅ **Use caption** - Add important notes
✅ **Preview often** - Click "Show Preview" to see result
✅ **Test on mobile** - Make sure it's readable

❌ **Avoid too many columns** - Max 6 columns for mobile
❌ **Don't leave cells empty** - Use "N/A" or "-" instead
❌ **Don't mix data types** - Keep formatting consistent
❌ **Don't make rows too long** - Split into multiple tables

---

## Troubleshooting

**Q: Table not showing?**

- Check you have `:::table` at start and `:::` at end
- Make sure there's a `---` separator line
- Verify all rows have same number of `|` separators

**Q: Columns don't align?**

- Count the `|` in each row
- Make sure all rows have same count
- Headers must match data column count

**Q: Can't delete column/row?**

- Tables need minimum 1 column and 1 row
- Add another column/row first, then delete old one

**Q: Visual editor not opening?**

- Make sure you clicked the purple "Table (Visual Editor)" button
- Try refreshing the page
- Check browser console for errors

---

## Complete Workflow Example

**Goal**: Create a budget comparison table

**Steps**:

1. Click purple "Table (Visual Editor)" button

2. Fill in title: "Trip Budget Breakdown"

3. Fill in caption: "Prices in Bangladeshi Taka"

4. Edit headers:

   - Column 1: "Category"
   - Column 2: "Budget"
   - Column 3: "Luxury"

5. Click "+ Column" to add 4th column

   - Header: "Mid-Range"

6. Click "Move left" on "Mid-Range" twice

   - Now order is: Category, Budget, Mid-Range, Luxury

7. Edit first row:

   - "Transport" | "800" | "1500" | "4000"

8. Click "+ Row" and edit:

   - "Accommodation" | "1200" | "3000" | "8000"

9. Click "+ Row" and edit:

   - "Food" | "600" | "1200" | "2500"

10. Preview looks good? Click "Insert Table"

11. Table added to content! ✅

---

## Remember

- **Visual editor** = Easiest way (recommended!)
- **Text syntax** = Faster if you know it
- **Preview** = Always check before saving
- **Documentation** = Full guide in TABLE_FEATURE_GUIDE.md

Happy table creating! 📊
