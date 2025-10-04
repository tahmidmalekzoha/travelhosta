# Visual Guide: Admin Panel Text Editor Improvements

## Before vs After

### BEFORE

```
┌─────────────────────────────────────────────────────────┐
│ Content Editor (English)                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ :::text [heading="Introduction"]                    │ │
│ │ Welcome to our travel guide...                      │ │
│ │ :::                                                 │ │
│ │                                                     │ │
│ │ :::timeline [title="Day 1"]                        │ │
│ │ ## Morning                                          │ │
│ │ - Visit temple                                      │ │
│ │ :::                                                 │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [No visual aids or navigation]                          │
└─────────────────────────────────────────────────────────┘
```

### AFTER

```
┌─────────────────────────────────────────────────────────┐
│ Content Editor (English)                                │
│ ┌──┬──────────────────────────────────────────────────┐ │
│ │1 │ :::text [heading="Introduction"]                │ │
│ │2 │ Welcome to our travel guide...                  │ │
│ │3 │ :::                                             │ │
│ │4 │                                                 │ │
│ │5 │ :::timeline [title="Day 1"]                    │ │
│ │6 │ ## Morning                                      │ │
│ │7 │ - Visit temple                                  │ │
│ │8 │ :::                                             │ │
│ └──┴──────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📝 Syntax Guide                                     │ │
│ │ :::type → Block start   |  ::: → Block end        │ │
│ │ [key="val"] → Attributes | ## → Heading           │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📐 Block Structure (2 blocks)                       │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ [1] 📝 TEXT    Introduction            L1       │ │ │ ← Clickable!
│ │ │ [2] 🗺️ TIMELINE Day 1                  L5       │ │ │ ← Clickable!
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Block Structure Panel - Detailed View

```
┌─────────────────────────────────────────────────────────────┐
│ 📐 Block Structure (6 blocks)                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [1] 📝 TEXT       Introduction                  L1   │  │ ← Blue
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [2] 💡 TIPS       Pro Tips                      L8   │  │ ← Amber
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [3] 🗺️ TIMELINE   Day 1 Itinerary              L15  │  │ ← Green
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [4] 🖼️ IMAGE      Sunset View                  L32  │  │ ← Purple
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [5] 📊 TABLE      Price Comparison              L38  │  │ ← Indigo
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [6] 🎨 GALLERY    Photo Gallery                 L48  │  │ ← Pink
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         ↑          ↑         ↑                          ↑
      Number     Icon      Type                    Line Number
```

## Line Numbers Feature

```
Before:                          After:
┌──────────────────────┐        ┌──┬───────────────────┐
│                      │        │  │                   │
│ :::text              │        │1 │ :::text          │
│ Content here         │   →    │2 │ Content here     │
│ :::                  │        │3 │ :::              │
│                      │        │4 │                   │
└──────────────────────┘        └──┴───────────────────┘
                                 ↑
                          Line Number Gutter
```

## Color-Coded Block Types

### Text Block (Blue)

```
┌─────────────────────────────────────────────┐
│ [1] 📝 TEXT    Introduction            L1  │ ← Light Blue Background
└─────────────────────────────────────────────┘
```

### Tips Block (Amber)

```
┌─────────────────────────────────────────────┐
│ [2] 💡 TIPS    Pro Travel Tips         L8  │ ← Amber/Orange Background
└─────────────────────────────────────────────┘
```

### Timeline Block (Green)

```
┌─────────────────────────────────────────────┐
│ [3] 🗺️ TIMELINE Day 1 Itinerary       L15 │ ← Light Green Background
└─────────────────────────────────────────────┘
```

### Image Block (Purple)

```
┌─────────────────────────────────────────────┐
│ [4] 🖼️ IMAGE    Sunset at Beach        L32 │ ← Light Purple Background
└─────────────────────────────────────────────┘
```

### Gallery Block (Pink)

```
┌─────────────────────────────────────────────┐
│ [5] 🎨 GALLERY  Photo Collection       L48 │ ← Light Pink Background
└─────────────────────────────────────────────┘
```

### Table Block (Indigo)

```
┌─────────────────────────────────────────────┐
│ [6] 📊 TABLE    Price Comparison       L38 │ ← Light Indigo Background
└─────────────────────────────────────────────┘
```

## Interactive Features

### Hover Effect

```
Normal State:
┌─────────────────────────────────────────┐
│ [1] 📝 TEXT    Introduction        L1  │
└─────────────────────────────────────────┘

Hover State (slightly larger with shadow):
  ┌─────────────────────────────────────────┐
  │ [1] 📝 TEXT    Introduction        L1  │ ← Scales up 2%
  └─────────────────────────────────────────┘ ← Adds shadow
       ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
```

### Click to Jump

```
User Action Flow:

1. User sees blocks:
   ┌─────────────────────────────────┐
   │ [1] 📝 TEXT    Intro       L1  │
   │ [2] 💡 TIPS    Tips        L8  │
   │ [3] 🗺️ TIMELINE Day 1     L15 │ ← User clicks here
   └─────────────────────────────────┘

2. Editor scrolls to line 15:
   ┌──┬──────────────────────────┐
   │12│ - Visit beach           │
   │13│ :::                     │
   │14│                         │
   │15│ :::timeline [title="Day 1"] ← Cursor jumps here
   │16│ ## Morning              │
   │17│ - Breakfast at hotel    │
   └──┴──────────────────────────┘
```

## Syntax Guide Panel

```
┌─────────────────────────────────────────────────────────┐
│ 📝 Syntax Guide                                         │
├──────────────────────────┬──────────────────────────────┤
│ :::type → Block start    │ ::: → Block end             │
│ [key="val"] → Attributes │ ## → Heading/Step           │
└──────────────────────────┴──────────────────────────────┘
```

## Complete Editor Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Admin Panel - Create/Edit Guide                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [Title, Description, Category fields above...]             │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Guide Content                                       │    │
│  │ ┌─────────┬───────────────────────────────────────┐ │    │
│  │ │ English │ বাংলা                                │ │    │
│  │ └─────────┴───────────────────────────────────────┘ │    │
│  │                                                     │    │
│  │ [Quick Insert Buttons: Text | Tips | Timeline...]  │    │
│  │                                                     │    │
│  │ Content Editor                  │ Live Preview     │    │
│  │ ┌──┬───────────────────┐       │ ┌──────────────┐ │    │
│  │ │1 │ :::text          │       │ │ Introduction │ │    │
│  │ │2 │ Intro text...    │       │ │              │ │    │
│  │ │3 │ :::              │       │ │ Intro text   │ │    │
│  │ │4 │                  │       │ │              │ │    │
│  │ │5 │ :::tips          │       │ │ 💡 Pro Tips  │ │    │
│  │ │6 │ - Tip 1          │       │ │ • Tip 1      │ │    │
│  │ │7 │ :::              │       │ │              │ │    │
│  │ └──┴───────────────────┘       │ └──────────────┘ │    │
│  │                                                     │    │
│  │ 📝 Syntax Guide                                    │    │
│  │ [:::type] [::: ] [key="val"] [##]                 │    │
│  │                                                     │    │
│  │ 📐 Block Structure (2 blocks)                      │    │
│  │ ┌────────────────────────────────────────────────┐ │    │
│  │ │ [1] 📝 TEXT    Introduction             L1    │ │    │
│  │ │ [2] 💡 TIPS    Pro Tips                 L5    │ │    │
│  │ └────────────────────────────────────────────────┘ │    │
│  │                                                     │    │
│  │ Stats: 📦 2 blocks | 📝 1 text | 💡 1 tips         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  [Cancel] [Create Guide]                                    │
└──────────────────────────────────────────────────────────────┘
```

## Key Visual Indicators

### Block Number Badge

```
┌─────┐
│  1  │ ← Circular white badge with border
└─────┘
```

### Line Number Reference

```
L15 ← Small, faded text showing line location
```

### Type Label

```
TEXT ← Uppercase, small font, bold
```

### Icon System

```
📝 = Text Block
💡 = Tips Block
🗺️ = Timeline Block
🖼️ = Image Block
🎨 = Gallery Block
📊 = Table Block
```

---

**Visual Guide Version**: 1.0  
**Last Updated**: October 4, 2025  
**Component**: EnhancedGuideForm Text Editor
