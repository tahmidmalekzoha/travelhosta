# Quick Reference: Admin Text Editor Features

## 🎯 Quick Navigation

### Jump to Any Block

1. Look at the **Block Structure** panel (below editor)
2. Find your block (numbered 1, 2, 3...)
3. **Click on it** → Editor jumps to that line!

Example:

```
Block Structure (3 blocks)
┌──────────────────────────────────┐
│ [2] 🗺️ TIMELINE Day 1      L15 │ ← Click this!
└──────────────────────────────────┘
        ↓
Editor jumps to Line 15!
```

## 🎨 Block Colors at a Glance

| Color     | Block Type | Icon |
| --------- | ---------- | ---- |
| 🔵 Blue   | Text       | 📝   |
| 🟢 Green  | Timeline   | 🗺️   |
| 🟣 Purple | Image      | 🖼️   |
| 🩷 Pink    | Gallery    | 🎨   |
| 🔮 Indigo | Table      | 📊   |
| 🟠 Amber  | Tips       | 💡   |

## 📍 Finding Your Place

### Line Numbers

- Left edge shows line numbers (1, 2, 3...)
- Use these to reference specific locations
- Automatically scrolls with your content

### Block Location

Each block in the overview shows:

```
[#] 📝 TYPE    Title             L##
 ↑   ↑   ↑      ↑                ↑
 │   │   │      │                Line number
 │   │   │      Block title
 │   │   Block type
 │   Icon
 Block number
```

## 🔍 Block Identification

### Reading the Structure Panel

```
[1] 📝 TEXT    Introduction                    L1
 │   │   │          │                          │
 │   │   │          │                          └─ Starts at line 1
 │   │   │          └─ Heading: "Introduction"
 │   │   └─ Type: TEXT block
 │   └─ Icon for quick recognition
 └─ Block #1 (first block in content)
```

## ⚡ Quick Actions

### Want to...

**Edit a specific block?**
→ Click it in Block Structure → Cursor jumps there

**See all your blocks?**
→ Look at Block Structure panel (auto-updates)

**Count blocks by type?**
→ Check stats below editor: "📝 3 text | 💡 2 tips..."

**Find block syntax?**
→ Check Syntax Guide panel (always visible)

**Reorder blocks?**
→ Cut/paste entire block (from `:::type` to `:::`)

## 📝 Syntax Reminders

```
:::type        ← Block starts
content here
:::            ← Block ends

:::text [heading="Title"]  ← With attributes
:::timeline [title="Day 1"]
:::tips [title="Pro Tips"]
```

## 💡 Pro Tips

### ✅ DO:

- Click blocks to navigate quickly
- Use line numbers for reference
- Check block colors to verify type
- Look at "L#" to find exact location
- Use Quick Insert buttons for templates

### ❌ DON'T:

- Forget closing `:::`
- Nest blocks improperly
- Remove block markers when editing
- Forget to check Block Structure after changes

## 🐛 Troubleshooting

### Block not showing in overview?

→ Check if it has both `:::type` and closing `:::`

### Wrong block type?

→ Verify the type name: `:::text`, `:::tips`, etc.

### Can't find a block?

→ Look at the "L#" (line number) in Block Structure

### Errors showing?

→ Red error box appears below editor with details

## 📊 Understanding Stats

```
📦 5 blocks | 📝 2 text | 🗺️ 1 timeline | 💡 1 tips | 🖼️ 1 image
 ↑           ↑           ↑                ↑            ↑
 Total       Text        Timeline         Tips         Image
 blocks      blocks      blocks           blocks       blocks
```

## 🎬 Quick Workflow

### Creating Content:

1. Click **Quick Insert** for block template
2. Fill in content
3. Check **Block Structure** → Block appears!
4. Continue adding blocks
5. Use **Live Preview** to verify

### Editing Content:

1. Look at **Block Structure**
2. Click the block you want to edit
3. Editor jumps to that block
4. Make your changes
5. Block updates automatically

### Reordering Blocks:

1. Find block in **Block Structure** (note the number)
2. Select entire block in editor (from `:::` to `:::`)
3. Cut (Ctrl+X)
4. Click where you want it
5. Paste (Ctrl+V)
6. **Block Structure** updates with new order!

## 🌟 Bonus Features

### Hover Effects

- Hover over blocks in overview → They grow slightly
- Shows it's clickable
- Smooth animation

### Real-time Updates

- Type in editor → Block Structure updates
- Add block → Instantly appears in overview
- Delete block → Removed from overview

### Language Support

- Works with both English and Bengali
- Switch language → Appropriate content shows
- Block Structure updates for active language

---

**Need More Help?**

- Check `EDITOR_IMPROVEMENTS.md` for detailed guide
- See `EDITOR_VISUAL_GUIDE.md` for visual examples
- Look at Quick Insert templates for syntax examples

**Last Updated**: October 4, 2025
