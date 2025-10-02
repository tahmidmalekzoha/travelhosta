# Enhanced Content System Documentation

## Overview

The TravelHosta Enhanced Content System provides a flexible, block-based approach to creating rich travel guides. Instead of being limited to a single itinerary format, you can now mix and match different types of content in any order you choose.

## Features

✨ **Flexible Content Blocks**: Mix text, timelines, images, and galleries in any order
📝 **Rich Text Support**: Add narrative content with markdown formatting
🗺️ **Multiple Timelines**: Include several itineraries throughout a single guide
🖼️ **Image Integration**: Insert images and photo galleries anywhere
📱 **Responsive Design**: All content blocks are fully responsive
👁️ **Live Preview**: See exactly how your content will look while editing

## Content Block Types

### 1. Text Block

Add narrative content, descriptions, tips, or any textual information.

**Syntax:**

```
:::text [heading="Optional Section Title"]
Your content here with **bold** and *italic* formatting.

Multiple paragraphs are supported.
Add as much text as you need!
:::
```

**Features:**

- Optional heading
- Markdown support for **bold** and _italic_
- Multiple paragraphs
- Perfect for introductions, descriptions, and travel tips

**Example:**

```
:::text [heading="About This Journey"]
Welcome to the **Sylhet Adventure**! This guide will take you through
the most beautiful spots in Bangladesh's tea capital.

Get ready for stunning landscapes, delicious cuisine, and unforgettable
memories in the land of two leaves and a bud.
:::
```

---

### 2. Tips Block

Highlight important travel tips, advice, and recommendations in a visually distinct format.

**Syntax:**

```
:::tips [title="Optional Title"]
- Tip 1: Your first tip
- Tip 2: Another helpful tip
- Tip 3: More advice
:::
```

**Features:**

- Optional custom title (defaults to "Pro Tips")
- Numbered tips with distinctive styling
- Eye-catching amber/yellow theme with lightbulb icon
- Perfect for important advice, warnings, and recommendations

**Example:**

```
:::tips [title="Before You Go"]
- Always carry sufficient cash as many places don't accept cards
- Book train/bus tickets at least 2-3 days in advance
- Download offline maps before the journey
- Keep emergency contact numbers handy
- Pack light but bring a jacket for evening weather
:::
```

---

### 3. Timeline Block

Create step-by-step itineraries with routes, costs, and details.

**Syntax:**

```
:::timeline [title="Optional Timeline Title"]
## Step Title
- Detail 1
- Detail 2
- Detail 3

## Next Step Title
- More details
- Additional info
:::
```

**Features:**

- Optional timeline title
- Multiple steps per timeline
- Bullet-point details for each step
- Visual timeline representation with connecting lines
- Cost and time information display

**Timeline with Step-Specific Tips:**

```
:::timeline [title="Day 1: Getting There"]
## Dhaka to Sylhet
- Train: 395 Taka
- Journey time: 6 hours
[tips]
- Book window seats for scenic views
- Carry snacks and water
- Keep ticket accessible for checks
[/tips]

## Hotel Check-in
- Budget: 1,500-2,000 Taka
- Location: City center
[tips]
- Check-in time is usually 2 PM
- Ask for a room with a view
[/tips]
:::
```

**Example:**

```
:::timeline [title="Day 1: Getting There"]
## Dhaka to Sylhet
- Train: 395 Taka
- Journey time: 6 hours
- Departure: 7:00 AM

## Sylhet Railway Station to Shahjalal Mazar
- CNG Auto: 25 Taka per person
- Reserve CNG: 125 Taka
- Duration: 15 minutes
[tips]
- Dress modestly when visiting religious sites
- Remove shoes before entering
- Visit during non-prayer times
[/tips]
:::
```

---

### 4. Image Block

Insert single images with captions throughout your content.

**Syntax:**

```
:::image
url: https://example.com/your-image.jpg
caption: Describe your image here
alt: Alternative text for accessibility
:::
```

**Features:**

- Full-width responsive images
- Optional captions displayed below the image
- Alt text for accessibility
- Automatic shadow and rounded corners

**Example:**

```
:::image
url: https://images.unsplash.com/photo-tea-garden
caption: The lush green tea gardens of Sylhet stretch as far as the eye can see
alt: Panoramic view of Sylhet tea gardens
:::
```

**Note:** Only the `url` field is required. `caption` and `alt` are optional.

---

### 4. Image Gallery Block

Create beautiful photo galleries with multiple images in a grid layout.

**Syntax:**

```
:::gallery [title="Optional Gallery Title"]
url: https://example.com/image1.jpg
caption: First photo caption
alt: Alt text for first image
---
url: https://example.com/image2.jpg
caption: Second photo caption
---
url: https://example.com/image3.jpg
caption: Third photo caption
:::
```

**Features:**

- Optional gallery title
- Responsive grid layout (1/2/3 columns)
- Individual captions for each image
- Hover effects
- Unlimited number of images

**Example:**

```
:::gallery [title="Photo Highlights"]
url: https://example.com/ratargul-morning.jpg
caption: Morning mist over Ratargul Swamp Forest
---
url: https://example.com/jaflong-stone.jpg
caption: Stone collection at Jaflong
---
url: https://example.com/local-food.jpg
caption: Traditional Sylheti cuisine
---
url: https://example.com/tea-garden-sunset.jpg
caption: Sunset at the tea estate
:::
```

**Note:** Use `---` (three dashes) to separate images in the gallery.

---

## Creating a Guide with Mixed Content

Here's a complete example showing how to structure a guide with multiple content types:

```
:::text [heading="Welcome to Sylhet"]
Sylhet is known as the spiritual and cultural capital of Bangladesh.
Famous for its **tea gardens**, **natural beauty**, and spiritual sites,
it's a must-visit destination for any traveler.

This comprehensive guide covers everything you need for a perfect 3-day trip.
:::

:::timeline [title="Day 1: Arrival & City Exploration"]
## Dhaka to Sylhet
- Train: 395 Taka
- Flight: 3,500-5,000 Taka
- Journey time: 6 hours by train, 1 hour by flight

## Sylhet Railway Station to Hotel
- CNG Auto: 25 Taka per person
- Reserve CNG: 125 Taka

## Shahjalal Mazar Visit
- Entry: Free
- Recommended time: Sunset
- Dress modestly
:::

:::image
url: https://example.com/shahjalal-mazar.jpg
caption: The beautiful Hazrat Shahjalal Mazar at sunset
alt: Shahjalal Mazar exterior view
:::

:::text [heading="Where to Stay"]
There are several excellent accommodation options in Sylhet:

**Budget**: Hotel Grand Sylhet (1,500-2,000 Taka/night)
**Mid-range**: Rose View Hotel (3,000-4,000 Taka/night)
**Luxury**: Hotel Noorjahan Grand (8,000+ Taka/night)

All hotels are located in the city center with easy access to attractions.
:::

:::timeline [title="Day 2: Nature & Adventure"]
## Hotel to Ratargul Swamp Forest
- Reserve car: 2,500 Taka (full day)
- Entry fee: 50 Taka per person
- Boat ride: 200 Taka per boat

## Ratargul to Jaflong
- Already included in car rental
- Border permit: Not required for viewing area
- Entry: 20 Taka per person
:::

:::gallery [title="Day 2 Highlights"]
url: https://example.com/ratargul-1.jpg
caption: Paddling through the swamp forest
---
url: https://example.com/ratargul-2.jpg
caption: Wildlife spotting in Ratargul
---
url: https://example.com/jaflong-1.jpg
caption: The crystal clear Piyain River
---
url: https://example.com/jaflong-2.jpg
caption: Local stone collectors at work
:::

:::text
After visiting Jaflong, stop by **Tamabil** for lunch. Try the local
fish curry and fresh river fish - it's absolutely delicious!
:::

:::timeline [title="Day 3: Tea Gardens & Departure"]
## Sreemangal Tea Gardens Tour
- Transport: 3,000 Taka for car
- Tea tasting: Free at most estates
- Duration: Full morning

## Return to Sylhet City
- Lunch at Panshi Restaurant
- Shopping at Zinda Bazar
- Evening train back to Dhaka
:::

:::text [heading="Essential Travel Tips"]
**Best Time to Visit**: November to February (winter) for pleasant weather

**What to Pack**:
- Comfortable walking shoes
- Sunscreen and hat
- Light rain jacket (monsoon season)
- Modest clothing for religious sites

**Budget Estimate**:
- Budget trip: 5,000-8,000 Taka per person
- Mid-range: 10,000-15,000 Taka per person
- Luxury: 20,000+ Taka per person

Have an amazing trip! 🌟
:::
```

## Using the Admin Panel

### Creating a New Guide

1. **Navigate to Admin → Guides Management**
2. **Click "Create New Guide"**
3. **Fill in Basic Information:**

   - Title (required)
   - Description (required)
   - Division (required)
   - Category (optional)
   - Cover Image URL

4. **Build Your Content:**

   - Use the **Quick Insert** buttons to add blocks
   - Type directly in the editor
   - Click "Load Sample" to see an example

5. **Preview Your Work:**

   - Click "Show Preview" to see live rendering
   - Check for any validation errors
   - Make adjustments as needed

6. **Save:**
   - Click "Create Guide" when satisfied
   - The guide will be immediately visible to users

### Quick Insert Buttons

- **📝 Text Block**: Adds a text section with optional heading
- **📅 Timeline**: Adds an itinerary timeline
- **🖼️ Single Image**: Adds one image with caption
- **🎨 Image Gallery**: Adds a multi-image gallery
- **Load Sample**: Loads a complete example to reference

### Content Editor Tips

1. **Use the Proper Syntax**: Each block must start with `:::blocktype` and end with `:::`

2. **Attributes Go in Brackets**: Optional attributes like titles go in square brackets

   ```
   :::timeline [title="My Timeline"]
   ```

3. **Separate Images with Dashes**: In galleries, use `---` between images

4. **Check the Stats**: At the bottom of the editor, you'll see:

   - Total number of blocks
   - Count of each block type
   - Helps ensure your content is balanced

5. **Fix Errors Before Saving**: Red error messages will show if something is wrong

## Best Practices

### Content Structure

1. **Start with Text**: Begin with an introduction text block
2. **Use Multiple Timelines**: Break multi-day trips into separate timeline blocks
3. **Add Context Between Sections**: Use text blocks to provide transitions
4. **Include Visual Breaks**: Insert images between long sections
5. **End with Summary**: Close with tips or conclusion text block

### Image Guidelines

1. **Use High-Quality Images**: At least 1920x1080 for full-width images
2. **Always Add Captions**: Help users understand what they're seeing
3. **Include Alt Text**: Makes content accessible
4. **Use Galleries for Multiple Views**: Don't create separate blocks for related photos
5. **Optimize Images**: Compress images before uploading to external hosts

### Timeline Organization

1. **One Day Per Timeline**: Separate each day into its own timeline block
2. **Clear Step Titles**: Use location names or time periods
3. **Include All Costs**: List all expenses for budgeting
4. **Add Time Estimates**: Help travelers plan their schedule
5. **Provide Alternatives**: Mention different transport options

### Writing Style

1. **Be Conversational**: Write like you're talking to a friend
2. **Use Formatting**: **Bold** important info, _italicize_ for emphasis
3. **Break Up Text**: Keep paragraphs short and scannable
4. **Include Tips**: Share insider knowledge
5. **Be Specific**: Exact costs, times, and locations

## Migration from Old Format

If you have existing guides with the old itinerary-only format, they will continue to work! The system automatically detects and displays legacy content.

To upgrade an old guide:

1. Edit the guide in the admin panel
2. The old itinerary will be displayed in the new editor
3. Add text blocks, images, or galleries around the timeline
4. Save the guide - it now uses the enhanced format

## Technical Details

### Data Structure

Guides now have a `content` field containing an array of content blocks:

```typescript
interface GuideData {
  id: number;
  title: string;
  description: string;
  division: string;
  category: string;
  imageUrl: string;
  content?: ContentBlock[]; // New flexible format
  itinerary?: ItineraryStep[]; // Legacy support
}
```

### Block Types

```typescript
type ContentBlockType = "text" | "timeline" | "image" | "imageGallery";
```

Each block type has its own interface with specific properties.

### Parser

The content parser (`contentParser.ts`) handles:

- Converting text format to structured blocks
- Converting blocks back to text for editing
- Validation of content structure
- Error reporting

### Renderer

The content renderer (`ContentRenderer.tsx`) provides:

- Consistent styling across block types
- Responsive layouts
- Accessibility features
- Smooth animations

## Troubleshooting

### Common Errors

**"No itinerary steps found"**

- Make sure timeline blocks have at least one `## Step Title`

**"Title is required"**

- Each timeline step needs a title starting with `##`

**"URL is required"**

- Image and gallery blocks must have a `url:` field

**"Content is required"**

- Text blocks cannot be empty

### Syntax Issues

**Block not parsing:**

- Check that you have both opening `:::type` and closing `:::`
- Ensure no extra spaces in the opening tag
- Verify correct block type spelling

**Attributes not working:**

- Attributes must be in square brackets `[title="My Title"]`
- Use quotes around attribute values
- Only use supported attributes (title, heading)

**Gallery images not separating:**

- Use exactly three dashes `---` between images
- No spaces around the dashes
- Each image section must have a `url:` field

## Support

For additional help or feature requests:

- Check the sample content in the admin panel
- Review this documentation
- Contact the development team

---

**Version**: 1.0  
**Last Updated**: October 2025  
**Author**: TravelHosta Development Team
