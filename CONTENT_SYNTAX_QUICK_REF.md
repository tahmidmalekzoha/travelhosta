# Enhanced Content Syntax - Quick Reference

## Text Block

```
:::text [heading="Optional Heading"]
Your content with **bold** and *italic* text.

Multiple paragraphs supported.
:::
```

## Tips Block

```
:::tips [title="Pro Tips"]
- Tip 1: Always carry cash
- Tip 2: Book in advance
- Tip 3: Learn basic local phrases
:::
```

## Timeline Block

```
:::timeline [title="Optional Title"]
## Step Title
- Detail 1: Info
- Detail 2: More info

## Next Step
- Detail 1
- Detail 2
:::
```

## Timeline with Tips

```
:::timeline [title="Day by Day"]
## Day 1: Arrival
- Train ticket: 400 Taka
- Hotel check-in
[tips]
- Book window seats for scenic views
- Carry snacks for the journey
[/tips]

## Day 2: Sightseeing
- Entry fee: 50 Taka
- Guide: 500 Taka
[tips]
- Visit early morning to avoid crowds
- Wear comfortable shoes
[/tips]
:::
```

## Image Block

```
:::image
url: https://example.com/image.jpg
caption: Optional caption
alt: Optional alt text
:::
```

## Image Gallery

```
:::gallery [title="Optional Title"]
url: https://example.com/img1.jpg
caption: First image
---
url: https://example.com/img2.jpg
caption: Second image
---
url: https://example.com/img3.jpg
caption: Third image
:::
```

## Complete Example

```
:::text [heading="Introduction"]
Welcome to this amazing journey!
:::

:::timeline [title="Day 1"]
## Dhaka to Sylhet
- Train: 395 Taka
- Time: 6 hours
:::

:::image
url: https://example.com/photo.jpg
caption: Beautiful scenery
:::

:::gallery [title="Highlights"]
url: https://example.com/pic1.jpg
caption: First stop
---
url: https://example.com/pic2.jpg
caption: Second stop
:::

:::text
Hope you enjoyed this guide!
:::
```

## Important Rules

1. **Opening & Closing**: Every block must start with `:::type` and end with `:::`
2. **Attributes**: Optional attributes go in brackets: `[title="My Title"]`
3. **Required Fields**:
   - Text: `content`
   - Timeline: At least one `## Step`
   - Image: `url:`
   - Gallery: At least one `url:`
4. **Gallery Separator**: Use `---` (three dashes) between images
5. **Markdown**: Text blocks support **bold** and _italic_

## Tips

- Use "Quick Insert" buttons in the admin panel
- Click "Load Sample" to see a full example
- Enable "Show Preview" to see live results
- Check error messages at the bottom
- Mix content types in any order you want!
