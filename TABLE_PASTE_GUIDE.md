# Table Paste Feature Guide

## Overview

The **Table Paste Feature** allows you to copy tables directly from Google Docs, Google Sheets, Microsoft Excel, Word, or any spreadsheet application and paste them into the guide editor. The system automatically detects the table format and converts it to the proper syntax.

---

## Supported Sources

✅ **Google Docs** - Tables created in Google Docs  
✅ **Google Sheets** - Spreadsheet data  
✅ **Microsoft Excel** - Excel tables and ranges  
✅ **Microsoft Word** - Word tables  
✅ **CSV files** - Comma-separated values  
✅ **TSV files** - Tab-separated values  
✅ **Markdown tables** - Pipe-separated format  
✅ **HTML tables** - Any webpage table

---

## How to Use

### Method 1: Direct Paste (Recommended)

1. **Create or copy your table** in Google Docs, Sheets, or Excel
2. **Select the table** (including headers)
3. **Copy it** (Ctrl+C / Cmd+C)
4. **Click in the Content Editor** textarea in the guide form
5. **Paste** (Ctrl+V / Cmd+V)
6. **Confirmation dialog appears** showing the detected table
7. **Click "Insert Table"** to add it to your guide

### Method 2: Visual Table Editor

1. Click the **"Table (Visual Editor)"** button
2. Use the visual interface to create your table
3. Click Insert when done

---

## Step-by-Step: Google Docs Table

### Example: Creating a Price Comparison Table

1. **In Google Docs, create your table:**

```
Item          | Budget   | Mid-Range | Luxury
Hotel         | 1,500    | 3,500     | 8,000
Food (daily)  | 300      | 600       | 1,500
Transport     | 500      | 1,000     | 3,000
```

2. **Select the entire table** (click and drag from top-left to bottom-right)

3. **Copy** (Ctrl+C or Cmd+C)

4. **Go to your guide editor** in TravelHosta admin panel

5. **Click in the Content Editor textarea**

6. **Paste** (Ctrl+V or Cmd+V)

7. **You'll see a green confirmation box:**

   ```
   ✅ Table Detected!
   We detected a table in your paste. Would you like to insert it as a table block?

   [Preview of the converted table syntax]

   [Insert Table] [Cancel]
   ```

8. **Click "Insert Table"**

9. **The table is inserted in the correct format:**

   ```
   :::table
   Item | Budget | Mid-Range | Luxury
   ---
   Hotel | 1,500 | 3,500 | 8,000
   Food (daily) | 300 | 600 | 1,500
   Transport | 500 | 1,000 | 3,000
   :::
   ```

10. **Add optional title and caption:**
    ```
    :::table [title="Price Comparison" caption="All prices in Taka"]
    Item | Budget | Mid-Range | Luxury
    ---
    Hotel | 1,500 | 3,500 | 8,000
    Food (daily) | 300 | 600 | 1,500
    Transport | 500 | 1,000 | 3,000
    :::
    ```

---

## Step-by-Step: Google Sheets

### Example: Budget Breakdown

1. **In Google Sheets, create your data:**

| Category      | Cost (Taka) | Notes               |
| ------------- | ----------- | ------------------- |
| Accommodation | 6,000       | 3 nights hotel      |
| Food          | 1,800       | 3 days, 3 meals/day |
| Transport     | 1,500       | Train + local CNGs  |
| Activities    | 1,200       | Entry fees          |
| **Total**     | **10,500**  | Per person          |

2. **Select the range** (A1:C6 in this example)

3. **Copy** (Ctrl+C)

4. **Paste into guide editor** (Ctrl+V)

5. **Confirm in the dialog**

6. **Result:**
   ```
   :::table [title="Budget Breakdown"]
   Category | Cost (Taka) | Notes
   ---
   Accommodation | 6,000 | 3 nights hotel
   Food | 1,800 | 3 days, 3 meals/day
   Transport | 1,500 | Train + local CNGs
   Activities | 1,200 | Entry fees
   **Total** | **10,500** | Per person
   :::
   ```

---

## Step-by-Step: Excel

### Example: Travel Schedule

1. **In Excel, create your schedule:**

```
Time     | Activity              | Location       | Cost
09:00 AM | Hotel Check-out       | Sylhet City    | 0
10:00 AM | Ratargul Forest       | Gowainghat     | 250
01:00 PM | Lunch                 | Local Restaurant| 300
03:00 PM | Jaflong               | Jaflong        | 320
06:00 PM | Return to Sylhet      | Sylhet City    | 0
```

2. **Select the table cells**

3. **Copy** (Ctrl+C)

4. **Paste into guide editor**

5. **The system detects it as a table** and shows confirmation

6. **Click Insert**

---

## What Happens Behind the Scenes

### 1. **Paste Detection**

When you paste content, the system checks if it contains:

- HTML table tags (`<table>`, `<tr>`, `<td>`)
- Tab characters (from Excel/Sheets)
- Pipe characters (from Markdown)
- Consistent comma/tab separation

### 2. **Format Recognition**

The parser tries formats in this order:

1. HTML tables (Google Docs, Word, HTML)
2. TSV - Tab-separated values (Excel, Sheets)
3. CSV - Comma-separated values
4. Pipe-separated (Markdown tables)

### 3. **Table Extraction**

- First row is treated as **headers**
- Subsequent rows are treated as **data rows**
- Empty rows are filtered out
- Cell content is cleaned and trimmed

### 4. **Syntax Conversion**

The table is converted to the content block format:

```
:::table
Header1 | Header2 | Header3
---
Cell1 | Cell2 | Cell3
Cell4 | Cell5 | Cell6
:::
```

### 5. **Preview & Confirmation**

You see a preview before insertion, allowing you to:

- Review the converted format
- Cancel if it doesn't look right
- Manually edit after insertion if needed

---

## Adding Title and Caption

After the table is inserted, you can add optional title and caption:

**Default (no title/caption):**

```
:::table
Item | Price
---
Hotel | 3,000
Food | 500
:::
```

**With title:**

```
:::table [title="Cost Breakdown"]
Item | Price
---
Hotel | 3,000
Food | 500
:::
```

**With title and caption:**

```
:::table [title="Cost Breakdown" caption="All prices in Taka per person"]
Item | Price
---
Hotel | 3,000
Food | 500
:::
```

---

## Best Practices

### ✅ Do's

- **Keep headers simple** - Short, clear column names
- **Align data properly** - Ensure data matches the right columns
- **Use consistent formatting** - Keep number formats consistent
- **Test with preview** - Always check the preview before inserting
- **Copy clean data** - Remove extra formatting when possible

### ❌ Don'ts

- **Don't merge cells** - Merged cells won't paste correctly
- **Don't include complex formatting** - Bold/colors are lost in paste
- **Don't paste huge tables** - Keep tables under 10-15 rows for readability
- **Don't forget headers** - Always include a header row
- **Don't use special characters** - Pipe (|) in cell content may break formatting

---

## Troubleshooting

### Problem: Table not detected

**Possible causes:**

- Pasted plain text without structure
- Only one row of data
- Inconsistent column counts

**Solution:**

- Ensure you're copying from a structured table
- Include at least 2 rows (header + 1 data row)
- Make sure all rows have the same number of columns

### Problem: Incorrect column alignment

**Possible causes:**

- Merged cells in source
- Inconsistent separators
- Hidden columns

**Solution:**

- Unmerge all cells before copying
- Copy visible cells only
- Check source data structure

### Problem: Special characters breaking format

**Possible causes:**

- Pipe character (|) in cell content
- Line breaks within cells

**Solution:**

- Replace | with alternative (like "or", "-", etc.)
- Remove line breaks from cells
- Manually edit after paste if needed

### Problem: Preview looks wrong

**Solution:**

- Click "Cancel" in the confirmation dialog
- Fix the source table
- Copy and paste again
- Or use the Visual Table Editor instead

---

## Examples of Common Tables

### 1. Price Comparison Table

**From Google Docs:**

```
:::table [title="Accommodation Options" caption="Prices per night in Taka"]
Hotel Type | Budget | Mid-Range | Luxury
---
Single Room | 1,200 | 2,500 | 6,000
Double Room | 1,800 | 3,500 | 8,000
Suite | 3,000 | 5,500 | 12,000
:::
```

### 2. Schedule Table

**From Excel:**

```
:::table [title="Day 1 Schedule"]
Time | Activity | Duration | Cost
---
08:00 AM | Depart Dhaka | 6 hours | 395
02:00 PM | Hotel Check-in | 30 mins | 0
03:00 PM | Shahjalal Mazar | 1.5 hours | 0
05:00 PM | Keane Bridge | 1 hour | 0
07:00 PM | Dinner | 1 hour | 400
:::
```

### 3. Budget Breakdown

**From Google Sheets:**

```
:::table [title="Total Trip Cost" caption="Per person for 3 days"]
Category | Amount (Taka) | Percentage
---
Transport | 1,500 | 18%
Accommodation | 4,500 | 53%
Food | 1,800 | 21%
Activities | 700 | 8%
**Total** | **8,500** | **100%**
:::
```

### 4. Transport Options

**From Word:**

```
:::table [title="Getting to Sylhet"]
Mode | Duration | Cost | Comfort Level
---
Train | 6 hours | 395 | ⭐⭐⭐⭐
Bus | 5 hours | 550 | ⭐⭐⭐
Flight | 50 mins | 4,500 | ⭐⭐⭐⭐⭐
:::
```

---

## Advanced: Manual Table Creation

If paste doesn't work, you can manually type the table:

```
:::table [title="Your Title" caption="Your Caption"]
Column1 | Column2 | Column3
---
Data1 | Data2 | Data3
Data4 | Data5 | Data6
:::
```

**Rules:**

- First line after `:::table` is headers
- `---` separates headers from data
- Use `|` to separate columns
- Spaces around `|` are optional but recommended
- Close with `:::`

---

## Tips for Better Tables

### 1. Keep It Simple

- Maximum 5-6 columns for mobile readability
- Use short column headers
- Keep cell content concise

### 2. Use Appropriate Data

- Prices with consistent units
- Times in 12-hour or 24-hour format (be consistent)
- Distances with units (km, miles)

### 3. Make It Scannable

- Bold important totals in cells
- Use clear category names
- Align numbers properly in source

### 4. Add Context

- Always use descriptive titles
- Add captions to explain units or assumptions
- Place tables near relevant text

---

## Integration with Content

Tables work best when:

1. **Preceded by explanatory text**

   ```
   :::text
   Here's a detailed cost breakdown for your trip...
   :::

   :::table [title="Cost Breakdown"]
   ...
   :::
   ```

2. **Followed by additional tips**

   ```
   :::table [title="Transport Options"]
   ...
   :::

   :::tips [title="Booking Tips"]
   - Book trains 3-5 days in advance
   - Compare bus companies for best prices
   :::
   ```

3. **Part of a timeline**

   ```
   :::timeline [title="Day 1"]
   ## Morning Activities
   - Breakfast: 7 AM
   - Checkout: 9 AM
   :::

   :::table [title="Morning Costs"]
   Item | Cost
   ---
   Breakfast | 200
   CNG to station | 100
   :::
   ```

---

## FAQ

**Q: Can I paste multiple tables at once?**  
A: No, paste one table at a time. Each gets its own confirmation dialog.

**Q: What happens to cell formatting (colors, bold, etc.)?**  
A: Formatting is lost during paste. Tables are rendered with default styling.

**Q: Can I edit a table after pasting?**  
A: Yes! Edit the text syntax directly in the editor. Or re-paste from your source.

**Q: Does it work with complex tables (merged cells, nested tables)?**  
A: No, merged cells and nested tables are not supported. Keep tables simple.

**Q: Can I paste from a website?**  
A: Yes! If the website uses proper HTML tables, they'll be detected.

**Q: What if paste detection doesn't work?**  
A: Use the "Table (Visual Editor)" button or type the table manually.

**Q: Is there a limit on table size?**  
A: No hard limit, but large tables (>20 rows) may not display well on mobile.

**Q: Can I paste CSV files?**  
A: Yes! Open the CSV, select and copy the data, then paste in the editor.

---

## Technical Details

### Supported Clipboard Formats

1. **text/html** - Rich HTML content from browsers/editors
2. **text/plain** - Plain text with structure

### Detection Logic

```typescript
// Priority order:
1. HTML table tags → HTML parser
2. Tab characters → TSV parser
3. Consistent commas → CSV parser
4. Pipe characters → Markdown parser
```

### Validation

- Minimum 1 header row + 1 data row
- All rows must have equal column count
- Empty rows are automatically filtered

---

## Examples Gallery

See the "Load Sample" button in the guide editor for complete examples including tables integrated with other content blocks.

---

## Support

If you encounter issues:

1. Try copying again from your source
2. Check that your table has consistent structure
3. Use the Visual Table Editor as an alternative
4. Refer to the manual table syntax if needed
5. Preview your guide before saving to ensure tables render correctly
