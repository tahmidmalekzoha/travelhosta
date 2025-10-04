# Quick Reference: Timeline Format Changes

## 🔄 What Changed

The timeline format has been simplified for easier editing in the admin panel.

---

## ❌ Old Format (Deprecated)

```
:::timeline [title="Day 1"]
## Step Title Here      ← Required ## prefix
- Detail 1
- Detail 2

## Another Step         ← Required ## prefix
- More details
:::
```

### Old Format with Tips

```
:::timeline [title="Journey"]
## Dhaka to Sylhet      ← Required ## prefix
- Train: 395 Taka
- Duration: 6 hours
[tips]
- Book window seats
- Carry snacks
[/tips]

## Hotel Check-in       ← Required ## prefix
- Budget: 1,500 Taka
:::
```

---

## ✅ New Format (Current)

```
:::timeline [title="Day 1"]
Step Title Here         ← No prefix needed!
- Detail 1
- Detail 2
                        ← Empty line starts new step
Another Step
- More details
:::
```

### New Format with Tips

```
:::timeline [title="Journey"]
Dhaka to Sylhet         ← No prefix needed!
- Train: 395 Taka
- Duration: 6 hours
[tips]
- Book window seats
- Carry snacks
[/tips]
                        ← Empty line starts new step
Hotel Check-in
- Budget: 1,500 Taka
:::
```

---

## 📋 Format Rules

| Element        | Old Format                  | New Format                         |
| -------------- | --------------------------- | ---------------------------------- |
| Step Title     | `## Title`                  | `Title` (just type it)             |
| Step Details   | `- Detail`                  | `- Detail` (same)                  |
| New Step       | `## Next`                   | Empty line + `Next`                |
| Tips Section   | `[tips]...[/tips]`          | `[tips]...[/tips]` (same)          |
| Timeline Start | `:::timeline [title="..."]` | `:::timeline [title="..."]` (same) |
| Timeline End   | `:::`                       | `:::` (same)                       |

---

## 💡 Quick Tips

### ✅ Do This

```
:::timeline [title="Day 1"]
Morning: Arrival
- Train arrives at 9 AM
- Check into hotel

Afternoon: Sightseeing
- Visit main attraction
- Lunch at local restaurant

Evening: Relaxation
- Sunset at beach
- Dinner
:::
```

### ❌ Don't Do This

```
:::timeline [title="Day 1"]
## Morning: Arrival        ← Old format (still works but not needed)
- Train arrives at 9 AM
## Afternoon: Sightseeing  ← Old format (still works but not needed)
- Visit main attraction
:::
```

---

## 🎯 Using in Admin Panel

### 1. Timeline Button

Click the "Timeline" button in Quick Insert:

```
:::timeline [title="Day 1: Journey"]
Location A to Location B
- Transportation: Cost
- Duration: Time
- Notes: Additional info

Location B to Location C
- Transportation: Cost
- Tips: Helpful advice
:::
```

### 2. Timeline + Tips Button

Click the "Timeline + Tips" button for a template with tips:

```
:::timeline [title="Day 1: Getting There"]
Dhaka to Sylhet
- Train: 395 Taka
- Journey time: 6 hours
[tips]
- Book window seats for scenic views
- Carry snacks and water bottles
[/tips]

Hotel Check-in
- Budget: 1,500-2,000 Taka
[tips]
- Check-in time is usually 2 PM
[/tips]
:::
```

### 3. Load Sample

Click "Load Sample" to see a complete guide example with the new format.

---

## 🔄 Backward Compatibility

### Your Old Guides Still Work!

✅ Old format guides continue to function normally
✅ No need to update existing content
✅ Parser handles both formats automatically
✅ Mix and match old and new format if needed

### When to Update?

- **New Guides:** Automatically use new format (via buttons)
- **Editing Old Guides:** Can keep old format or update
- **No Deadline:** Update at your convenience

---

## 📚 More Examples

### Simple Day Trip

```
:::timeline [title="One Day in Sylhet"]
Morning: Ratargul Swamp Forest
- Departure: 6 AM
- Entry: 50 Taka
- Boat ride: 200 Taka

Afternoon: Jaflong
- Travel time: 1 hour
- Entry: 20 Taka
- Lunch: 300 Taka

Evening: Return to Sylhet
- Shopping at Zinda Bazar
- Dinner at Panshi Restaurant
:::
```

### Multi-Day Trip with Tips

```
:::timeline [title="Weekend Getaway"]
Day 1: Arrival
- Train: 395 Taka
- Hotel check-in: 2 PM
- Evening: Shahjalal Mazar visit
[tips]
- Book tickets 3 days in advance
- Carry cash for local transport
[/tips]

Day 2: Nature Tour
- Car rental: 2,500 Taka
- Ratargul + Jaflong
- Full day excursion
[tips]
- Start early (6 AM)
- Bring waterproof bag
- Pack lunch or budget 500 Taka
[/tips]

Day 3: Departure
- Morning: Tea garden visit
- Lunch: Local restaurant
- Evening train back
:::
```

### Budget Breakdown

```
:::timeline [title="Transportation Costs"]
Dhaka to Sylhet
- Train (Economy): 395 Taka
- Train (AC): 580 Taka
- Flight: 3,500-5,000 Taka

Local Transport
- CNG (shared): 20-30 Taka
- CNG (reserve): 500-800 Taka per half day
- Car rental: 2,500-3,000 Taka per day

Return Journey
- Same options as arrival
- Book in advance for better prices
[tips]
- Book round trip for discounts
- Share CNGs with other travelers
[/tips]
:::
```

---

## 🎨 Visual Comparison

### Old Format Structure

```
:::timeline
├─ ## Title 1          ← Markdown header required
│  ├─ - Detail
│  └─ - Detail
├─ ## Title 2          ← Markdown header required
│  └─ - Detail
:::
```

### New Format Structure

```
:::timeline
├─ Title 1             ← Just plain text
│  ├─ - Detail
│  └─ - Detail
├─ [empty line]        ← Separator
├─ Title 2             ← Just plain text
│  └─ - Detail
:::
```

---

## ❓ FAQ

**Q: Do I need to update my old guides?**
A: No, old format still works perfectly. Update only when convenient.

**Q: Can I mix old and new format?**
A: Yes, the parser handles both automatically.

**Q: What if I forget the format?**
A: Just click the Timeline button in Quick Insert for a template!

**Q: Where can I see more examples?**
A: Click "Load Sample" button or check `CONTENT_EXAMPLES.md`

**Q: What if I make a mistake?**
A: Use "Show Preview" to see how it looks before saving!

---

## 🚀 Start Using It Now!

1. Open Admin Panel → Guides
2. Create or Edit a guide
3. Click "Timeline" button
4. Replace placeholder text
5. Use empty lines to separate steps
6. Preview and Save!

**That's it!** No `##` needed, just clean and simple! 🎉
