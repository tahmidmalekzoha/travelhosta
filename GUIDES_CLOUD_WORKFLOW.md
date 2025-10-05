# 📝 Guide Management - Cloud-First Approach

## ✅ Guides are Now Cloud-Based

All guides are stored in **Supabase** (cloud database), not in local files.

---

## 🆕 Creating New Guides

### Option 1: Admin Panel (Easiest)

1. Visit: **http://localhost:3001/admin/guides**
2. Click **"Add New Guide"**
3. Fill in the form (title, description, category, etc.)
4. Click **"Save"**
5. ✅ Done! Guide is now in the cloud

### Option 2: Supabase Dashboard

1. Go to: https://app.supabase.com/project/icimdqlnkndmdhdoicsm/editor
2. Click on `guides` table
3. Click **"Insert row"**
4. Enter guide data
5. Save

### Option 3: Programmatically (For Developers)

```typescript
import { supabase } from "@/utils/supabase";

const { data, error } = await supabase
  .from("guides")
  .insert([
    {
      title: "Weekend in Sylhet",
      description: "Beautiful tea gardens and waterfalls",
      division: "Sylhet",
      category: "Weekend",
      image_url: "https://example.com/image.jpg",
      tags: ["Nature", "Family Friendly"],
      content: [
        /* Your content blocks */
      ],
    },
  ])
  .select();
```

---

## 📊 Where Data is Stored

| Data Type           | Storage Location                 | Access            |
| ------------------- | -------------------------------- | ----------------- |
| **Guides**          | Supabase `guides` table          | Admin panel / API |
| **Featured Guides** | Supabase `featured_guides` table | Auto-synced       |
| **Categories**      | Supabase `categories` table      | Auto-synced       |
| **Divisions**       | Supabase `divisions` table       | Auto-synced       |
| **Tags**            | localStorage (temporary)         | Frontend only     |

---

## 🔄 How the App Works Now

```
User Creates Guide
      ↓
Admin Panel Form
      ↓
Saves to Supabase (Cloud)
      ↓
GuidesContext fetches updated data
      ↓
Guides Page displays new guide
```

**No files are created** - everything is in the database!

---

## ✏️ Editing Guides

1. Go to: http://localhost:3001/admin/guides
2. Click **"Edit"** on any guide
3. Make changes
4. Click **"Save"**
5. ✅ Changes instantly saved to Supabase

---

## 🗑️ Deleting Guides

1. Go to: http://localhost:3001/admin/guides
2. Click **"Delete"** on any guide
3. Confirm deletion
4. ✅ Removed from database

---

## ⭐ Managing Featured Guides

1. Go to: http://localhost:3001/admin/featured
2. Select up to 4 guides to feature
3. Click **"Save Featured Guides"**
4. ✅ Featured guides update on homepage

---

## 🛠️ Developer Tools

### Update TypeScript Types (After Schema Changes)

```bash
npx supabase gen types typescript --linked > frontend/types/supabase.ts
```

### View Database Directly

- **Dashboard**: https://app.supabase.com/project/icimdqlnkndmdhdoicsm
- **SQL Editor**: https://app.supabase.com/project/icimdqlnkndmdhdoicsm/sql
- **Table Editor**: https://app.supabase.com/project/icimdqlnkndmdhdoicsm/editor

### Refresh Data in App

```typescript
// In your component
const { refreshGuides } = useGuides();
await refreshGuides(); // Fetches latest from Supabase
```

---

## ⚠️ Important Notes

### ✅ DO:

- Always create guides through admin panel or Supabase dashboard
- Use cloud database as the single source of truth
- Keep TypeScript types synced with database

### ❌ DON'T:

- Don't create guides as files in the codebase
- Don't store guides in `constants/index.ts`
- Don't rely on localStorage (it's deprecated)

---

## 🚀 Quick Links

- **Create Guide**: http://localhost:3001/admin/guides
- **View Guides**: http://localhost:3001/guides
- **Supabase Dashboard**: https://app.supabase.com/project/icimdqlnkndmdhdoicsm

---

**Everything is now cloud-based! 🌩️**
