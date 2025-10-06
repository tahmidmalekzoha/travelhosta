# Image URL Warning - Visual Changes

## Before vs After

### BEFORE (Required Field)

```
┌─────────────────────────────────────────────────────┐
│ Cover Image                                          │
│                                                      │
│ ┌──────────┐  ┌────────────────────────────────┐  │
│ │ Upload   │  │ Or paste image URL...          │  │
│ │  Image   │  │                                │  │
│ └──────────┘  └────────────────────────────────┘  │
│                                                      │
│ Upload an image (max 5MB) or paste an external URL  │
└─────────────────────────────────────────────────────┘

❌ Submission fails if empty or dummy.jpg used
```

### AFTER (Optional with Warning)

```
┌─────────────────────────────────────────────────────┐
│ Cover Image (Optional)                               │
│                                                      │
│ ┌──────────────────────────────────────────────────┐│
│ │ ⚠️  No image provided.                           ││
│ │    The guide will be created without a cover     ││
│ │    image. You can add one later.                 ││
│ └──────────────────────────────────────────────────┘│
│                                                      │
│ ┌──────────┐  ┌────────────────────────────────┐  │
│ │ Upload   │  │ Or paste image URL (or leave   │  │
│ │  Image   │  │ empty)...                      │  │
│ └──────────┘  └────────────────────────────────┘  │
│                                                      │
│ Upload an image (max 5MB), paste an external URL,   │
│ or leave empty to skip                               │
└─────────────────────────────────────────────────────┘

✅ Submission succeeds with warning shown
```

## Warning States

### 1. Empty Field

- **Shows**: Yellow warning banner
- **Message**: "No image provided. The guide will be created without a cover image."
- **Action**: Allows form submission

### 2. "dummy.jpg" or variants

- **Shows**: Yellow warning banner (same as empty)
- **Handles**:
  - `dummy.jpg`
  - `/images/dummy.jpg`
  - `images/dummy.jpg`
  - Any path ending with `dummy.jpg`

### 3. Valid Image URL

- **Shows**: No warning
- **Shows**: Image preview
- **Action**: Normal submission

## Color Scheme

- **Warning Banner**: `bg-yellow-50` with `border-yellow-200`
- **Warning Icon**: `text-yellow-600` (AlertCircle)
- **Warning Text**: `text-yellow-800`

## What Gets Saved to Database

| Input Value         | Saved to DB |
| ------------------- | ----------- |
| Empty string        | `NULL`      |
| `dummy.jpg`         | `NULL`      |
| `/images/dummy.jpg` | `NULL`      |
| `images/dummy.jpg`  | `NULL`      |
| Valid URL           | URL string  |
| Uploaded file       | Storage URL |

## User Benefits

1. ✅ No more confusion about required images
2. ✅ Clear visual feedback with warning banner
3. ✅ Can create draft guides without images
4. ✅ Can add images later when editing
5. ✅ No database errors from dummy values
