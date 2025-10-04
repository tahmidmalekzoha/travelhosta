# Tips Feature Guide

## Overview

The **Tips Feature** allows you to add highlighted, eye-catching travel tips and advice throughout your guides. Tips can be added in two ways:

1. **Standalone Tips Block** - Perfect for general advice under the description
2. **Timeline Step Tips** - Specific tips for individual steps in a timeline

---

## 1. Standalone Tips Block

Use this format to add general travel tips anywhere in your guide, typically right after the introduction.

### Syntax

```
:::tips [title="Optional Title"]
- Tip 1: Your first tip
- Tip 2: Another helpful tip
- Tip 3: More advice
:::
```

### Visual Appearance

- **Amber/yellow gradient background** with border
- **Lightbulb icon** for instant recognition
- **Numbered tips** (1, 2, 3...) in amber circles
- **Bold heading** (defaults to "Pro Tips" if no title provided)

### Example

```
:::tips [title="Before You Go"]
- Always carry sufficient cash as many places don't accept cards
- Book train/bus tickets at least 2-3 days in advance
- Download offline maps before the journey
- Keep emergency contact numbers handy
- Pack light but bring a jacket for evening weather
:::
```

### When to Use

✅ General travel advice  
✅ Pre-trip preparation  
✅ Budget tips  
✅ Safety information  
✅ Cultural etiquette

---

## 2. Timeline Step Tips

Add specific tips directly within timeline steps for context-relevant advice.

### Syntax

```
:::timeline [title="Day 1: Getting There"]
## Step Title
- Detail 1
- Detail 2
[tips]
- Tip specific to this step
- Another tip for this step
[/tips]

## Next Step
- More details
[tips]
- Tips for the next step
[/tips]
:::
```

### Visual Appearance

- **Amber border on the left** for distinction
- **Lightbulb icon** with "TIPS" label
- **Bullet points** in amber color
- **Integrated within timeline** flow

### Example

```
:::timeline [title="Day 1: Journey to Sylhet"]
Dhaka to Sylhet by Train
- Train: 395 Taka (Parabat Express)
- Departure: 6:30 AM
- Journey time: 6 hours
[tips]
- Book window seats on the right side for scenic views of rivers
- Carry snacks and bottled water for the journey
- Keep your ticket accessible as it will be checked multiple times
[/tips]

Sylhet Railway Station to Hotel
- CNG Auto: 100 Taka
- Reserve CNG: 300 Taka
- Duration: 20 minutes
[tips]
- Use metered CNG or agree on price before starting
- Save hotel address in Bengali on your phone
- Keep small change ready for easier transactions
[/tips]

Shahjalal Mazar Visit
- Entry: Free
- CNG from hotel: 50 Taka round trip
- Best time: Sunset
[tips]
- Dress modestly (cover shoulders and knees)
- Remove shoes before entering the shrine
- Visit during non-prayer times for a peaceful experience
- Photography may be restricted inside
[/tips]
:::
```

### When to Use

✅ Step-specific safety advice  
✅ Booking recommendations  
✅ Best times to visit  
✅ Cultural considerations  
✅ Money-saving tricks  
✅ Hidden gems or insider knowledge

---

## Complete Guide Example

Here's a full guide using both types of tips:

```
:::text [heading="Weekend Trip to Sylhet"]
Experience the natural beauty of Bangladesh's tea capital. This guide covers
a perfect **2-day weekend trip** with accommodation, transport, and must-visit
spots all mapped out.

**Best Season**: November to February
**Budget**: 5,000-8,000 Taka per person
:::

:::tips [title="Essential Travel Tips"]
- Always carry sufficient cash - ATMs may be limited in remote areas
- Book train tickets 3-5 days in advance during peak season
- Download offline maps of Sylhet before leaving Dhaka
- Keep emergency contacts: Tourist Police 01713-373344
- Pack light layers - mornings are cool, afternoons warm
:::

:::timeline [title="Day 1: Arrival & City Exploration"]
Dhaka to Sylhet
- Train: 395 Taka (Parabat Express)
- Departure: 6:30 AM from Kamalapur
- Arrival: 12:30 PM
[tips]
- Book window seats on the right side for river views
- Breakfast vendors board at major stations
- Keep your ticket safe - it's checked multiple times
[/tips]

Hotel Check-in
- Budget: 1,500-2,000 Taka
- Mid-range: 3,000-4,000 Taka
- Location: City center near Zindabazar
[tips]
- Check-in time is usually 2 PM
- Ask for rooms facing away from the street for quieter sleep
- Confirm if breakfast is included
[/tips]

Shahjalal Mazar & Keane Bridge
- CNG to Mazar: 50 Taka
- Mazar entry: Free
- Walk to Keane Bridge: 10 minutes
[tips]
- Visit Mazar before sunset for the best atmosphere
- Dress modestly and remove shoes before entering
- Keane Bridge is perfect for sunset photos
- Try street food near the bridge - fresh jhalmuri is amazing
[/tips]
:::

:::tips [title="Where to Eat in Sylhet"]
- Panshi Restaurant: Best traditional mutton curry (300 Taka)
- Dosa Plaza: Vegetarian options (150-200 Taka)
- Woodland Restaurant: Clean, AC dining (400 Taka)
- Street vendors near Keane Bridge: Snacks (50-100 Taka)
:::

:::timeline [title="Day 2: Nature & Return"]
Ratargul Swamp Forest
- Reserve car from hotel: 2,500 Taka full day
- Entry fee: 50 Taka per person
- Boat ride: 200 Taka per boat (seats 4-5)
- Duration: 2-3 hours
[tips]
- Start early (6 AM departure) to avoid crowds
- Wear clothes that can get wet
- Bring waterproof bag for phone/camera
- Apply sunscreen - there's limited shade on boats
[/tips]

Jaflong Border Area
- Continue in same car (included in daily rate)
- Entry: 20 Taka
- Boat on Piyain River: 300 Taka
[tips]
- Best time is 11 AM-2 PM when it's less crowded
- Bargain for stone souvenirs - start at 50% asking price
- Don't cross the border markers - stay in Bangladesh side
[/tips]

Return to Sylhet
- Car back to Sylhet city: 1.5 hours
- Evening train to Dhaka: 6:00 PM
[tips]
- Have lunch in Jaflong before heading back
- Arrive at station 30 minutes before departure
- Keep return ticket and ID ready
[/tips]
:::

:::text
This 2-day trip gives you a perfect taste of Sylhet's natural beauty and
spiritual heritage. Safe travels!
:::
```

---

## Best Practices

### ✅ Do's

- Keep tips concise and actionable
- Use specific numbers (prices, times, distances)
- Add context-relevant tips to timeline steps
- Group related tips together in standalone blocks
- Use tips for insider knowledge and practical advice

### ❌ Don'ts

- Don't make tips too long (max 2-3 lines each)
- Don't repeat information already in details
- Don't add too many tips per step (3-5 is ideal)
- Don't use tips for basic information (use text blocks instead)
- Don't forget to close tips sections with `[/tips]`

---

## Tips vs. Details: When to Use What?

### Use **Details** (bullet points) for:

- Prices and costs
- Timings and schedules
- Distance and duration
- Factual information

### Use **Tips** for:

- Advice and recommendations
- Money-saving tricks
- Best practices
- Safety warnings
- Cultural etiquette
- Insider knowledge

---

## Styling Details

### Standalone Tips Block

- Background: Gradient from amber-50 to yellow-50
- Border: 2px solid amber-200
- Icon: White lightbulb on amber-500 circle
- Numbers: White text on amber-500 circles
- Text: Gray-800 on white/translucent background

### Timeline Step Tips

- Border: 4px left border in amber-400
- Background: Amber-50
- Icon: Amber-600 lightbulb (18px)
- Label: Amber-900 bold uppercase "TIPS"
- Bullets: Amber-600 color
- Text: Gray-700

---

## Technical Details

### Type Definitions

```typescript
// Standalone tips block
interface TipsBlock {
  type: "tips";
  id: string;
  title?: string;
  tips: string[];
}

// Timeline step with tips
interface ItineraryStep {
  id: string;
  title: string;
  details: string[];
  tips?: string[]; // Optional tips array
}
```

### Parsing Rules

1. Tips block: Lines starting with `- ` become individual tips
2. Timeline tips: Content between `[tips]` and `[/tips]` markers
3. Tips are trimmed and filtered (empty lines removed)
4. Title defaults to "Pro Tips" if not specified

---

## FAQ

**Q: Can I have multiple tips blocks in one guide?**  
A: Yes! Add as many as needed. Place them wherever appropriate.

**Q: Do all timeline steps need tips?**  
A: No, tips are optional. Only add them where you have specific advice.

**Q: Can I use markdown in tips?**  
A: Currently, tips support plain text only. Keep them simple and clear.

**Q: What's the ideal number of tips?**  
A: 3-5 tips per block is ideal. More than 8 can be overwhelming.

**Q: Can I nest tips blocks inside other blocks?**  
A: No, tips blocks are standalone. For timeline-specific tips, use the `[tips]` syntax.

---

## Migration Guide

If you have existing guides with tips in text blocks, here's how to convert:

### Before (Old Way)

```
:::text
**Pro Tips:**
- Tip 1
- Tip 2
- Tip 3
:::
```

### After (New Way)

```
:::tips [title="Pro Tips"]
- Tip 1
- Tip 2
- Tip 3
:::
```

The new way provides:

- Better visual distinction
- Consistent styling across all guides
- Mobile-responsive design
- Improved readability

---

## Support

For questions or issues with the tips feature:

1. Check the example guides in the admin panel
2. Use the preview feature while editing
3. Refer to CONTENT_SYNTAX_QUICK_REF.md for syntax
4. See CONTENT_EXAMPLES.md for complete examples
