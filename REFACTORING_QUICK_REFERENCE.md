# Quick Reference: Key Improvements

## New Utility Files Created

### 1. `utils/imageUtils.ts`

```typescript
// Use this instead of inline image validation
import { isValidImageUrl, getImageAltText } from "@/utils/imageUtils";

const hasImage = isValidImageUrl(imageUrl);
const alt = getImageAltText(altText, caption, "Default");
```

### 2. `components/shared/ImagePlaceholder.tsx`

```typescript
// Reusable placeholder for missing images
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";

<ImagePlaceholder text="No Image" size="medium" />;
```

---

## Performance Optimizations Applied

### Use useMemo for expensive calculations:

```typescript
// Before
const filteredGuides = guides.filter(guide => ...);

// After
const filteredGuides = useMemo(
    () => guides.filter(guide => ...),
    [guides, searchTerm]
);
```

### Use useCallback for handlers:

```typescript
// Before
const handleClick = () => { ... };

// After
const handleClick = useCallback(() => { ... }, [dependencies]);
```

### Memoize context values:

```typescript
const value = useMemo(
  () => ({
    guides,
    addGuide,
    updateGuide,
    // ...
  }),
  [guides, addGuide, updateGuide]
);
```

---

## Constants Extracted

### Theme Colors (HomePage.tsx)

```typescript
const THEME_COLORS = {
  background: "linear-gradient(135deg, #f8f6f1 0%, #f2eee9 50%, #ede8e0 100%)",
  heading: "#1b3c44",
  faqBackground: "#213c44",
};
```

### Storage Keys (GuidesContext.tsx)

```typescript
const STORAGE_KEYS = {
  GUIDES: "travelhosta_guides",
  FEATURED: "travelhosta_featured_guides",
};
```

### Configuration (Various files)

```typescript
const MAX_FEATURED_GUIDES = 4;
const DEFAULT_FEATURED_IDS = [1, 2, 3, 4];
```

---

## Helper Functions Extracted

### Guide Filtering

```typescript
const filterGuides = (guides: GuideData[], searchTerm: string): GuideData[] => {
  if (!searchTerm.trim()) return guides;

  const lowerSearchTerm = searchTerm.toLowerCase();
  return guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(lowerSearchTerm) ||
      guide.division.toLowerCase().includes(lowerSearchTerm) ||
      guide.category.toLowerCase().includes(lowerSearchTerm)
  );
};
```

### Storage Utilities

```typescript
const loadFromStorage = <T,>(key: string, defaultValue: T): T => { ... };
const saveToStorage = (key: string, data: unknown): void => { ... };
```

### Array Comparison

```typescript
const areIdsEqual = (ids1: number[], ids2: number[]): boolean => {
  return JSON.stringify([...ids1].sort()) === JSON.stringify([...ids2].sort());
};
```

---

## Best Practices to Continue

1. **Always use utility functions for image validation**

   - Import from `utils/imageUtils.ts`
   - Use `ImagePlaceholder` component

2. **Optimize with React hooks**

   - `useMemo` for computed values
   - `useCallback` for event handlers
   - Memoize context values

3. **Extract constants**

   - No magic numbers or strings
   - Centralize theme values
   - Make configuration explicit

4. **Document your code**

   - JSDoc comments for components
   - Parameter descriptions
   - Usage examples

5. **Keep functions small and focused**
   - One responsibility per function
   - Extract helpers when logic is complex
   - Make functions reusable

---

## Before/After Examples

### Image Validation

```typescript
// ❌ Before (duplicated everywhere)
const hasValidUrl =
  imageUrl &&
  imageUrl !== "" &&
  imageUrl !== "dummy.jpg" &&
  imageUrl !== "/images/dummy.jpg";

// ✅ After (centralized utility)
import { isValidImageUrl } from "@/utils/imageUtils";
const hasValidUrl = isValidImageUrl(imageUrl);
```

### Event Handlers

```typescript
// ❌ Before (recreated on every render)
const handleClick = () => {
  doSomething();
};

// ✅ After (memoized)
const handleClick = useCallback(() => {
  doSomething();
}, [dependencies]);
```

### Context Values

```typescript
// ❌ Before (new object on every render)
return (
  <Context.Provider value={{ data, methods }}>{children}</Context.Provider>
);

// ✅ After (memoized)
const value = useMemo(() => ({ data, methods }), [data, methods]);
return <Context.Provider value={value}>{children}</Context.Provider>;
```

---

## Checklist for Future Components

- [ ] Use TypeScript interfaces for props
- [ ] Add JSDoc comments
- [ ] Memoize expensive calculations with `useMemo`
- [ ] Memoize callbacks with `useCallback`
- [ ] Extract magic numbers/strings to constants
- [ ] Use shared utilities (imageUtils, etc.)
- [ ] Handle errors appropriately
- [ ] Keep functions small and focused
- [ ] Write self-documenting code
- [ ] Consider performance implications

---

## Common Patterns Used

### 1. Helper Function Pattern

```typescript
// Extract to top of file or separate utility
const helperFunction = (param: Type): ReturnType => {
  // logic here
};

// Use in component
const Component = () => {
  const result = helperFunction(data);
  // ...
};
```

### 2. Memoization Pattern

```typescript
const Component = () => {
    // Memoize expensive calculations
    const computed = useMemo(() => expensiveOperation(), [deps]);

    // Memoize callbacks
    const handler = useCallback(() => { ... }, [deps]);

    return <div onClick={handler}>{computed}</div>;
};
```

### 3. Constants Pattern

```typescript
// At top of file
const CONFIG = {
    MAX_ITEMS: 4,
    DEFAULT_VALUE: 'default',
    THEME: { ... }
} as const;

// Use throughout component
if (items.length > CONFIG.MAX_ITEMS) { ... }
```

---

## Resources

- React Hooks: https://react.dev/reference/react
- TypeScript: https://www.typescriptlang.org/docs/
- Next.js: https://nextjs.org/docs
- Performance Optimization: https://react.dev/learn/render-and-commit
