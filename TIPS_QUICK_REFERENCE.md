# Tips Feature - Quick Reference Card

## 🎯 What is the Tips Feature?

A dedicated content block for highlighting travel advice, recommendations, and insider tips with eye-catching styling.

---

## 📝 Two Ways to Add Tips

### 1. Standalone Tips Block (General Advice)

**Click:** `Tips Block` button in Quick Insert

**Result:**

```
:::tips [title="Pro Tips"]
- Always carry sufficient cash as many places don't accept cards
- Book train/bus tickets at least 2-3 days in advance
- Download offline maps before the journey
- Keep emergency contact numbers handy
- Pack light but bring layers for changing weather
:::
```

**Visual:**

- 🟡 Amber/yellow gradient background
- 💡 Lightbulb icon
- 🔢 Numbered tips in circles
- ✨ Stands out from regular content

---

### 2. Tips Within Timeline Steps (Step-Specific Advice)

**Click:** `Timeline + Tips` button in Quick Insert

**Result:**

```
:::timeline [title="Day 1: Getting There"]
## Dhaka to Sylhet
- Train: 395 Taka
- Journey time: 6 hours
[tips]
- Book window seats for scenic views
- Carry snacks and water bottles
[/tips]

## Hotel Check-in
- Budget: 1,500-2,000 Taka
[tips]
- Check-in time is usually 2 PM
- Ask for a room with a view
[/tips]
:::
```

**Visual:**

- 📍 Amber left border
- 💡 Small lightbulb icon
- • Bullet points in amber
- 📦 Integrated within timeline

---

## 🎨 Button Locations

In the **Quick Insert** toolbar, you'll find:

1. **📝 Text Block** (white)
2. **💡 Tips Block** (amber) ← NEW!
3. **📅 Timeline** (white)
4. **📅💡 Timeline + Tips** (light amber) ← NEW!
5. **🖼️ Single Image** (white)
6. **🎨 Image Gallery** (white)
7. **📊 Table (Visual Editor)** (purple)
8. **📋 Load Sample** (orange)

---

## ✏️ How to Customize

### Change the Title

```
:::tips [title="Before You Go"]
- Tip 1
- Tip 2
:::
```

```
:::tips [title="Money Saving Tips"]
- Tip 1
- Tip 2
:::
```

```
:::tips [title="Safety Advice"]
- Tip 1
- Tip 2
:::
```

### Remove Title (Uses Default "Pro Tips")

```
:::tips
- Tip 1
- Tip 2
:::
```

---

## 💡 Best Practices

### ✅ Do's

- Keep tips concise (1-2 lines each)
- Use 3-5 tips per block
- Make tips actionable
- Add context-specific tips to timeline steps
- Place standalone tips after introduction

### ❌ Don'ts

- Don't make tips too long
- Don't repeat information from details
- Don't overuse (1-2 tips blocks per guide)
- Don't forget to close with `:::`

---

## 📍 When to Use Each Type

### Standalone Tips Block

✅ Pre-trip preparation  
✅ General budget advice  
✅ Safety information  
✅ Cultural etiquette  
✅ Packing suggestions

**Example:**

```
:::tips [title="Before You Go"]
- Apply for permits 2 weeks in advance
- Get travel insurance
- Vaccinations recommended for rural areas
:::
```

### Timeline Step Tips

✅ Booking recommendations  
✅ Best time to visit  
✅ Step-specific warnings  
✅ Hidden gems  
✅ Money-saving tricks

**Example:**

```
:::timeline
## Visit to Ratargul Forest
- Entry: 50 Taka
- Boat: 200 Taka
[tips]
- Visit early morning (6-8 AM) to avoid crowds
- Wear water-resistant shoes
- Bring waterproof bag for electronics
[/tips]
:::
```

---

## 🔄 Complete Example

Here's how to use both types together:

```
:::text [heading="Weekend Trip to Sylhet"]
Experience the natural beauty of Bangladesh's tea capital...
:::

:::tips [title="Essential Travel Tips"]
- Always carry cash for rural areas
- Download offline maps before leaving
- Book train tickets 3-5 days in advance
- Keep emergency contacts saved
:::

:::timeline [title="Day 1: Arrival"]
## Dhaka to Sylhet by Train
- Train: 395 Taka
- Duration: 6 hours
[tips]
- Book window seats on the right side for river views
- Keep ticket accessible for multiple checks
[/tips]

## Shahjalal Mazar Visit
- Entry: Free
- CNG: 50 Taka
[tips]
- Dress modestly (cover shoulders and knees)
- Remove shoes before entering
[/tips]
:::

:::tips [title="Where to Eat"]
- Panshi Restaurant for mutton curry (300 Taka)
- Dosa Plaza for vegetarian (150-200 Taka)
- Street food near Keane Bridge (50-100 Taka)
:::
```

---

## 🎯 Quick Syntax Reference

### Standalone Tips

```
:::tips [title="Optional Title"]
- Tip 1
- Tip 2
- Tip 3
:::
```

### Timeline with Tips

```
:::timeline [title="Title"]
## Step Name
- Detail 1
- Detail 2
[tips]
- Tip for this step
- Another tip
[/tips]
:::
```

---

## 🚀 Getting Started

1. **Open guide editor** in admin panel
2. **Click "Tips Block"** in Quick Insert (amber button)
3. **Edit the template** that appears
4. **Click "Show Preview"** to see how it looks
5. **Save your guide**

That's it! No need to remember syntax - just click the button! 🎉

---

## ❓ Need Help?

- Click **"Show Help"** button in the editor
- Click **"Load Sample"** to see complete examples
- Tips blocks work with all other content blocks
- Mix and match in any order you like

---

## 🎨 Visual Reference

**Standalone Tips Block appears as:**

```
┌─────────────────────────────────────┐
│ 💡 Pro Tips                          │
│                                     │
│ ① Always carry cash               │
│ ② Book tickets in advance         │
│ ③ Download offline maps           │
└─────────────────────────────────────┘
```

**Timeline Step Tips appear as:**

```
🔴─┐
  │ Step Title
  │ • Detail 1
  │ • Detail 2
  │
  │ ┌──────────────────────┐
  │ │ 💡 TIPS              │
  │ │ • Tip 1              │
  │ │ • Tip 2              │
  │ └──────────────────────┘
```

---

**Pro Tip:** Use the preview feature to see exactly how your tips will look before saving! 👁️
