# Timeline Format Update

## 📅 Update Date: October 4, 2025

## 🎯 Summary

The timeline block format has been updated to make it simpler and more intuitive for content editors.

## ✨ What Changed

### Old Format (Deprecated)

```
:::timeline [title="Day 1"]
## Step Title Here
- Detail 1
- Detail 2

## Another Step
- More details
:::
```

### New Format (Current)

```
:::timeline [title="Day 1"]
Step Title Here
- Detail 1
- Detail 2

Another Step
- More details
:::
```

## 🔑 Key Changes

1. **No `## ` prefix needed** - First line after empty line is automatically the title
2. **Empty lines separate steps** - Just add a blank line to start a new timeline step
3. **Simpler syntax** - Less markdown formatting required

## 📝 Format Rules

### Basic Structure

- **First line** = Step title (no special prefix needed)
- **Following lines** = Details/data under that step
- **Empty line** = Starts a new step

### With Tips

```
:::timeline [title="Journey"]
Dhaka to Sylhet
- Train: 395 Taka
- Duration: 6 hours
[tips]
- Book window seats for views
- Carry snacks and water
[/tips]

Hotel Check-in
- Budget: 1,500-2,000 Taka
- Location: City center
[tips]
- Check-in time is usually 2 PM
- Ask for a room with a view
[/tips]
:::
```

## 💡 Examples

### Example 1: Simple Timeline

```
:::timeline [title="Getting There"]
Dhaka to Sylhet
- Train: 395 Taka
- Journey time: 6 hours

Railway Station to Hotel
- CNG Auto: 25 Taka per person
- Duration: 15 minutes
:::
```

### Example 2: Multi-Day Journey

```
:::timeline [title="Day 1: Arrival"]
Dhaka to Sylhet
- Flight: 3,500-5,000 Taka (50 minutes)
- Train: 395 Taka (6 hours)

Hotel to Shahjalal Mazar
- CNG: 100 Taka for round trip
- Visit duration: 1-2 hours

Keane Bridge Sunset
- Walk or CNG: 50 Taka
- Perfect photo spot
:::
```

### Example 3: With Tips

```
:::timeline [title="Day 2: Exploring"]
Ratargul Swamp Forest Trip
- Car rental: 2,500 Taka (full day)
- Entry: 50 Taka per person
- Boat ride: 200 Taka per boat
[tips]
- Visit early morning (6-8 AM)
- Wear water-resistant shoes
- Bring waterproof bag for electronics
[/tips]

Jaflong Stone Collection
- Entry: 20 Taka
- Boat ride: 300 Taka
[tips]
- Bargain for souvenirs
- Don't cross border markers
[/tips]
:::
```

## 🔄 Migration

### For Existing Guides

- Old format guides will **continue to work** (backward compatible)
- Parser automatically handles both formats
- No immediate action required

### For New Guides

- Use the new simplified format
- Editor templates updated with new format
- Quick Insert buttons generate new format

## 🛠️ Technical Details

### Files Updated

1. `frontend/utils/contentParser.ts` - Parser logic updated
2. All documentation files updated with new examples:
   - `CONTENT_SYNTAX_QUICK_REF.md`
   - `CONTENT_EXAMPLES.md`
   - `GETTING_STARTED.md`
   - `TIPS_QUICK_REFERENCE.md`
   - `TIPS_FEATURE_GUIDE.md`
   - `ENHANCED_CONTENT_SYSTEM.md`

### Parser Changes

- Removed requirement for `## ` prefix
- Empty lines now trigger new step creation
- Maintains backward compatibility with old format

## ✅ Benefits

1. **Simpler to type** - Less markdown formatting
2. **More intuitive** - Natural flow for content creators
3. **Less error-prone** - Fewer special characters to remember
4. **Cleaner code** - Easier to read in the editor
5. **Backward compatible** - Old guides still work

## 📚 Quick Reference

| Element        | Syntax                                     |
| -------------- | ------------------------------------------ |
| Timeline start | `:::timeline [title="Title"]`              |
| Step title     | Just type it (first line after empty line) |
| Step details   | Lines starting with `- `                   |
| Tips section   | `[tips]` ... `[/tips]`                     |
| New step       | Empty line                                 |
| Timeline end   | `:::`                                      |

## 🎓 Tips for Editors

1. **Don't use `##`** - It's no longer needed for step titles
2. **Use empty lines** - They're your friend for separating steps
3. **Keep it clean** - Simple format = easier editing
4. **Test in preview** - Always check how it looks before saving

## 🚀 Getting Started

To use the new format in the admin panel:

1. Go to Admin Panel → Guides
2. Create or edit a guide
3. Click "Timeline" or "Timeline + Tips" in Quick Insert
4. The new format template will be inserted
5. Replace placeholder text with your content
6. Use empty lines to separate steps
7. Preview and save!

---

**Note:** This update maintains full backward compatibility. All existing guides will continue to function normally without any changes required.
