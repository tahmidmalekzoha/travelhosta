# Developer Migration Guide

This guide helps developers understand the refactored codebase and adopt the new patterns.

## 🎯 What Changed?

The codebase has been refactored to improve:

- **Performance** - Using React optimization hooks
- **Maintainability** - Extracted utilities and constants
- **Type Safety** - Better TypeScript usage
- **Documentation** - Comprehensive JSDoc comments
- **Code Quality** - Following React best practices

**Important:** All functionality remains exactly the same. This is purely internal code improvement.

---

## 🆕 New Files You Should Know About

### 1. `utils/imageUtils.ts`

**Purpose:** Centralized image validation utilities

**When to use:**

- Checking if an image URL is valid (not a placeholder)
- Getting appropriate alt text for images

**Example:**

```typescript
import { isValidImageUrl, getImageAltText } from "@/utils/imageUtils";

// Instead of: imageUrl && imageUrl !== '' && imageUrl !== 'dummy.jpg'...
const isValid = isValidImageUrl(imageUrl);

// Get alt text with fallback
const alt = getImageAltText(imageAlt, imageCaption, "Default text");
```

### 2. `components/shared/ImagePlaceholder.tsx`

**Purpose:** Reusable placeholder for missing images

**When to use:**

- Anywhere you need to show a placeholder for missing images
- Replaces duplicate placeholder div code

**Example:**

```typescript
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";

{
  !isValidImageUrl(imageUrl) ? (
    <ImagePlaceholder text="No Image" size="medium" />
  ) : (
    <img src={imageUrl} alt={alt} />
  );
}
```

**Sizes available:** `'small'`, `'medium'`, `'large'`

---

## 🔄 Pattern Changes

### 1. Memoization for Performance

#### When to use `useMemo`:

```typescript
// ✅ For expensive calculations
const filteredList = useMemo(
  () => items.filter((item) => condition),
  [items, condition]
);

// ✅ For derived data
const sortedData = useMemo(() => [...data].sort(), [data]);

// ✅ For context values
const contextValue = useMemo(() => ({ data, methods }), [data, methods]);
```

#### When to use `useCallback`:

```typescript
// ✅ For event handlers passed to child components
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies]);

// ✅ For context methods
const addItem = useCallback((item) => {
  setItems((prev) => [...prev, item]);
}, []);
```

### 2. Constants Extraction

#### Before:

```typescript
// ❌ Magic strings and numbers scattered
if (items.length > 4) { ... }
const color = '#1b3c44';
```

#### After:

```typescript
// ✅ Constants at the top of file
const MAX_ITEMS = 4;
const THEME_COLORS = {
    primary: '#1b3c44',
    secondary: '#cd8453'
} as const;

if (items.length > MAX_ITEMS) { ... }
const color = THEME_COLORS.primary;
```

### 3. Helper Functions

#### Before:

```typescript
// ❌ Complex inline logic
const result = items.filter(
  (item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
);
```

#### After:

```typescript
// ✅ Extracted helper function
const filterItems = (items, searchTerm) => {
  if (!searchTerm.trim()) return items;
  const lower = searchTerm.toLowerCase();
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(lower) ||
      item.category.toLowerCase().includes(lower)
  );
};

const result = filterItems(items, search);
```

---

## 📚 Updated Components Guide

### GuidesContext.tsx

**Key Changes:**

- Now uses `useMemo` for context value
- All methods use `useCallback`
- Storage operations extracted to helper functions
- Better error handling

**How to use (no changes needed):**

```typescript
import { useGuides } from "@/contexts/GuidesContext";

const { guides, addGuide, updateGuide, deleteGuide } = useGuides();
// Use exactly as before
```

### GuidesManagement.tsx

**Key Changes:**

- Filter logic extracted to helper
- Uses `useMemo` for filtered guides
- Handlers use `useCallback`
- Image validation from shared utility

**Impact:** Better performance, no API changes

### HomePage.tsx

**Key Changes:**

- Theme colors extracted to constants
- Featured guides memoized

**If you're updating theme colors:**

```typescript
// Update the THEME_COLORS constant at the top
const THEME_COLORS = {
  background: "your-gradient",
  heading: "#your-color",
  faqBackground: "#your-color",
} as const;
```

### ContentRenderer.tsx

**Key Changes:**

- Uses shared `ImagePlaceholder` component
- Image validation from shared utility
- Markdown formatting extracted to helper

**Creating new block renderers:**

```typescript
const MyBlockRenderer: FunctionComponent<{ block: MyBlock }> = ({ block }) => {
  // Your rendering logic
  // Use isValidImageUrl() for images
  // Use ImagePlaceholder for missing images
};
```

---

## 🎨 Working with Images

### New Standard Pattern:

```typescript
import { isValidImageUrl, getImageAltText } from "@/utils/imageUtils";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";

const MyComponent = ({ imageUrl, alt, caption }) => {
  const hasValidImage = isValidImageUrl(imageUrl);
  const altText = getImageAltText(alt, caption, "Fallback text");

  return (
    <figure>
      {hasValidImage ? (
        <img src={imageUrl} alt={altText} />
      ) : (
        <ImagePlaceholder text="No Image" size="medium" />
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
};
```

---

## 🔧 Adding New Features

### When adding a new component:

1. **Add TypeScript interfaces for props**

```typescript
interface MyComponentProps {
  /** Description of prop */
  title: string;
  /** Description with default */
  count?: number;
}
```

2. **Add JSDoc comments**

```typescript
/**
 * Brief description of component
 * More detailed explanation if needed
 */
const MyComponent: FunctionComponent<MyComponentProps> = ({
  title,
  count = 0,
}) => {
  // ...
};
```

3. **Use optimization hooks where appropriate**

```typescript
// Memoize expensive calculations
const processed = useMemo(() => processData(data), [data]);

// Memoize callbacks
const handleClick = useCallback(() => { ... }, [deps]);
```

4. **Extract constants**

```typescript
const CONFIG = {
  MAX_VALUE: 100,
  DEFAULT_TEXT: "Default",
} as const;
```

5. **Use shared utilities**

```typescript
import { isValidImageUrl } from "@/utils/imageUtils";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";
```

---

## 🧪 Testing Your Changes

### Check for unnecessary re-renders:

```typescript
// Add this temporarily to see if component re-renders
console.log("Component rendered", { deps });
```

### Use React DevTools Profiler:

1. Open React DevTools
2. Go to Profiler tab
3. Click record
4. Interact with your feature
5. Stop recording
6. Check which components re-rendered and why

---

## ⚠️ Common Pitfalls to Avoid

### 1. Forgetting dependencies in useMemo/useCallback

```typescript
// ❌ Missing dependency
const result = useMemo(() => process(data, filter), [data]);

// ✅ All dependencies included
const result = useMemo(() => process(data, filter), [data, filter]);
```

### 2. Overusing memoization

```typescript
// ❌ Unnecessary memoization
const simple = useMemo(() => value + 1, [value]);

// ✅ Only for expensive operations
const simple = value + 1;
```

### 3. Creating new objects in dependencies

```typescript
// ❌ New object every render
const handler = useCallback(() => { ... }, [{ key: value }]);

// ✅ Primitive values or stable references
const handler = useCallback(() => { ... }, [value]);
```

### 4. Not using shared utilities

```typescript
// ❌ Duplicating image validation
if (url && url !== '' && url !== 'dummy.jpg') { ... }

// ✅ Using shared utility
if (isValidImageUrl(url)) { ... }
```

---

## 📖 Further Reading

- [React useMemo](https://react.dev/reference/react/useMemo)
- [React useCallback](https://react.dev/reference/react/useCallback)
- [Optimizing Performance](https://react.dev/learn/render-and-commit)
- [TypeScript with React](https://react-typescript-cheatsheet.netlify.app/)

---

## 🤝 Getting Help

If you have questions about:

- **Patterns used**: Check `REFACTORING_QUICK_REFERENCE.md`
- **Changes made**: Check `REFACTORING_SUMMARY.md`
- **Verification**: Check `REFACTORING_CHECKLIST.md`
- **This guide**: Ask the team lead

---

## ✅ Quick Checklist for New Code

When writing new code, ensure:

- [ ] TypeScript interfaces defined
- [ ] JSDoc comments added
- [ ] Constants extracted
- [ ] Shared utilities used
- [ ] Memoization applied where beneficial
- [ ] No unused imports
- [ ] Code follows existing patterns
- [ ] Tested for performance

---

**Remember:** The goal is maintainable, performant code. When in doubt, check existing refactored files for examples!
