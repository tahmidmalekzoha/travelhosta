import { ContentBlock, TextBlock, TimelineBlock, ImageBlock, ImageGalleryBlock, TableBlock, TipsBlock, NotesBlock, ItineraryStep } from '../types';

/**
 * Enhanced content parser for flexible guide structure
 * 
 * Supports multiple content types in any order:
 * 
 * :::text [heading="Optional Heading"]
 * Your **markdown** content here.
 * Multiple paragraphs supported.
 * :::
 * 
 * :::tips [title="Pro Tips"]
 * - Tip 1: Always carry cash
 * - Tip 2: Book in advance
 * - Tip 3: Learn basic phrases
 * :::
 * 
 * :::timeline [title="Optional Timeline Title"]
 * ## Step Title
 * - Detail 1
 * - Detail 2
 * [tips]
 * - Tip for this step
 * - Another tip
 * [/tips]
 * :::
 * 
 * :::image
 * url: https://example.com/image.jpg
 * caption: Optional caption
 * alt: Optional alt text
 * :::
 * 
 * :::gallery [title="Photo Gallery"]
 * url: https://example.com/img1.jpg
 * caption: First image
 * ---
 * url: https://example.com/img2.jpg
 * caption: Second image
 * :::
 * 
 * :::table [title="Price Comparison" caption="All prices in Taka"]
 * Item | Budget | Mid-Range | Luxury
 * ---
 * Hotel | 800 | 3000 | 8000
 * Food | 300 | 600 | 1500
 * Transport | 500 | 1000 | 3000
 * :::
 */

/**
 * Main parser function for guide content
 * Parses structured content blocks and returns an array of typed content blocks
 * 
 * @param text - The raw content text to parse
 * @returns Array of parsed content blocks
 * 
 * @example
 * const blocks = parseGuideContent(`
 *   :::text [heading="Introduction"]
 *   Welcome to our guide!
 *   :::
 * `);
 */
export function parseGuideContent(text: string): ContentBlock[] {
    if (!text || !text.trim()) {
        return [];
    }

    const blocks: ContentBlock[] = [];
    
    // Regex to match content blocks: :::type [attributes] content :::
    const blockRegex = /:::(\w+)(?:\s+\[([^\]]+)\])?\s*([\s\S]*?):::/g;
    let match;
    let blockIndex = 0;

    while ((match = blockRegex.exec(text)) !== null) {
        const [, blockType, attributes, content] = match;
        const parsedAttributes = parseAttributes(attributes || '');
        const trimmedContent = content.trim();
        
        // Parse each block type accordingly
        switch (blockType.toLowerCase()) {
            case 'text':
                blocks.push(parseTextBlock(trimmedContent, parsedAttributes, blockIndex++));
                break;
            case 'tips':
                blocks.push(parseTipsBlock(trimmedContent, parsedAttributes, blockIndex++));
                break;
            case 'notes':
                blocks.push(parseNotesBlock(trimmedContent, parsedAttributes, blockIndex++));
                break;
            case 'timeline':
                blocks.push(parseTimelineBlock(trimmedContent, parsedAttributes, blockIndex++));
                break;
            case 'image':
                blocks.push(parseImageBlock(trimmedContent, parsedAttributes, blockIndex++));
                break;
            case 'gallery':
                blocks.push(parseGalleryBlock(trimmedContent, parsedAttributes, blockIndex++));
                break;
            case 'table':
                blocks.push(parseTableBlock(trimmedContent, parsedAttributes, blockIndex++));
                break;
            default:
                // Skip unknown block types
                console.warn(`Unknown block type: ${blockType}`);
        }
    }

    return blocks;
}

/**
 * Parse attributes from block header
 * Extracts key="value" pairs from attribute strings
 * @example parseAttributes('title="My Title" caption="My Caption"')
 * @returns Object with parsed attributes
 */
function parseAttributes(attrString: string): Record<string, string> {
    const attrs: Record<string, string> = {};
    const attrRegex = /(\w+)="([^"]+)"/g;
    let match;

    while ((match = attrRegex.exec(attrString)) !== null) {
        const [, key, value] = match;
        attrs[key] = value;
    }

    return attrs;
}

/**
 * Parse text block with optional heading
 * @param content - The text content to parse
 * @param attributes - Block attributes (e.g., heading)
 * @param index - Block index for unique ID
 */
function parseTextBlock(content: string, attributes: Record<string, string>, index: number): TextBlock {
    return {
        type: 'text',
        id: `text-${index}`,
        content,
        heading: attributes.heading
    };
}

/**
 * Parse tips block extracting individual tip items
 * Supports both markdown list format (- Tip) and plain text lines
 * @param content - The tips content to parse
 * @param attributes - Block attributes (e.g., title)
 * @param index - Block index for unique ID
 */
function parseTipsBlock(content: string, attributes: Record<string, string>, index: number): TipsBlock {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    const tips: string[] = [];

    for (const line of lines) {
        // Check for markdown list item (- Tip text)
        if (line.startsWith('- ')) {
            tips.push(line.substring(2).trim());
        }
        // Support plain text lines as tips (but skip headings)
        else if (line && !line.startsWith('#')) {
            tips.push(line);
        }
    }

    return {
        type: 'tips',
        id: `tips-${index}`,
        title: attributes.title,
        tips
    };
}

/**
 * Parse notes block extracting individual note items
 * Supports both markdown list format (- Note) and plain text lines
 * @param content - The notes content to parse
 * @param attributes - Block attributes (e.g., title)
 * @param index - Block index for unique ID
 */
function parseNotesBlock(content: string, attributes: Record<string, string>, index: number): NotesBlock {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    const notes: string[] = [];

    for (const line of lines) {
        // Check for markdown list item (- Note text)
        if (line.startsWith('- ')) {
            notes.push(line.substring(2).trim());
        }
        // Support plain text lines as notes (but skip headings)
        else if (line && !line.startsWith('#')) {
            notes.push(line);
        }
    }

    return {
        type: 'notes',
        id: `notes-${index}`,
        title: attributes.title,
        notes
    };
}

/**
 * Parse timeline block
 * Format:
 * - First line is the title
 * - Following lines are details/data
 * - Empty line starts a new title
 */
function parseTimelineBlock(content: string, attributes: Record<string, string>, index: number): TimelineBlock {
    const lines = content.split('\n');
    const steps: ItineraryStep[] = [];
    let currentStep: ItineraryStep | null = null;
    let inTipsSection = false;
    let inNotesSection = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Empty line - save current step and prepare for next title
        if (!line) {
            if (currentStep) {
                steps.push(currentStep);
                currentStep = null;
                inTipsSection = false;
                inNotesSection = false;
            }
            continue;
        }

        // Check for tips section markers
        if (line === '[tips]') {
            inTipsSection = true;
            inNotesSection = false;
            if (currentStep && !currentStep.tips) {
                currentStep.tips = [];
            }
            continue;
        } else if (line === '[/tips]') {
            inTipsSection = false;
            continue;
        }
        
        // Check for notes section markers
        if (line === '[notes]') {
            inNotesSection = true;
            inTipsSection = false;
            if (currentStep && !currentStep.notes) {
                currentStep.notes = [];
            }
            continue;
        } else if (line === '[/notes]') {
            inNotesSection = false;
            continue;
        }

        // If no current step, this line is a new title
        if (!currentStep) {
            currentStep = {
                id: `step-${steps.length + 1}`,
                title: line,
                details: []
            };
        }
        // Otherwise, this line is data under the current title
        else {
            // Check for detail/tip/note item (- Item)
            if (line.startsWith('- ')) {
                const item = line.substring(2).trim();
                if (inTipsSection) {
                    if (!currentStep.tips) {
                        currentStep.tips = [];
                    }
                    currentStep.tips.push(item);
                } else if (inNotesSection) {
                    if (!currentStep.notes) {
                        currentStep.notes = [];
                    }
                    currentStep.notes.push(item);
                } else {
                    currentStep.details.push(item);
                }
            }
            // Handle non-markdown lines as additional details/tips/notes
            else {
                if (inTipsSection) {
                    if (!currentStep.tips) {
                        currentStep.tips = [];
                    }
                    currentStep.tips.push(line);
                } else if (inNotesSection) {
                    if (!currentStep.notes) {
                        currentStep.notes = [];
                    }
                    currentStep.notes.push(line);
                } else {
                    currentStep.details.push(line);
                }
            }
        }
    }

    // Add the last step if exists
    if (currentStep) {
        steps.push(currentStep);
    }

    return {
        type: 'timeline',
        id: `timeline-${index}`,
        title: attributes.title,
        steps
    };
}

/**
 * Parse image block
 */
function parseImageBlock(content: string, attributes: Record<string, string>, index: number): ImageBlock {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    const props: Record<string, string> = {};

    for (const line of lines) {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            props[key.trim()] = valueParts.join(':').trim();
        }
    }

    return {
        type: 'image',
        id: `image-${index}`,
        url: props.url || '',
        caption: props.caption,
        alt: props.alt
    };
}

/**
 * Parse gallery block
 */
function parseGalleryBlock(content: string, attributes: Record<string, string>, index: number): ImageGalleryBlock {
    const imageBlocks = content.split('---').map(block => block.trim()).filter(block => block);
    const images = imageBlocks.map(block => {
        const lines = block.split('\n').map(line => line.trim()).filter(line => line);
        const props: Record<string, string> = {};

        for (const line of lines) {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                props[key.trim()] = valueParts.join(':').trim();
            }
        }

        return {
            url: props.url || '',
            caption: props.caption,
            alt: props.alt
        };
    });

    return {
        type: 'imageGallery',
        id: `gallery-${index}`,
        title: attributes.title,
        images
    };
}

/**
 * Parse table block
 */
function parseTableBlock(content: string, attributes: Record<string, string>, index: number): TableBlock {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length === 0) {
        return {
            type: 'table',
            id: `table-${index}`,
            title: attributes.title,
            caption: attributes.caption,
            headers: [],
            rows: []
        };
    }

    // First line is headers
    const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
    
    // Skip separator line (---) if present
    const dataStartIndex = lines.length > 1 && lines[1].includes('---') ? 2 : 1;
    
    // Rest are data rows
    const rows = lines.slice(dataStartIndex).map(line => 
        line.split('|').map(cell => cell.trim()).filter(cell => cell !== '')
    );

    return {
        type: 'table',
        id: `table-${index}`,
        title: attributes.title,
        caption: attributes.caption,
        headers,
        rows
    };
}

/**
 * Convert content blocks back to text format for editing
 */
export function contentToText(blocks: ContentBlock[]): string {
    return blocks.map(block => {
        switch (block.type) {
            case 'text':
                return textBlockToString(block);
            case 'tips':
                return tipsBlockToString(block);
            case 'notes':
                return notesBlockToString(block);
            case 'timeline':
                return timelineBlockToString(block);
            case 'image':
                return imageBlockToString(block);
            case 'imageGallery':
                return galleryBlockToString(block);
            case 'table':
                return tableBlockToString(block);
            default:
                return '';
        }
    }).join('\n\n');
}

function textBlockToString(block: TextBlock): string {
    const attrs = block.heading ? ` [heading="${block.heading}"]` : '';
    return `:::text${attrs}\n${block.content}\n:::`;
}

function tipsBlockToString(block: TipsBlock): string {
    const attrs = block.title ? ` [title="${block.title}"]` : '';
    const tips = block.tips.map(tip => `- ${tip}`).join('\n');
    return `:::tips${attrs}\n${tips}\n:::`;
}

function notesBlockToString(block: NotesBlock): string {
    const attrs = block.title ? ` [title="${block.title}"]` : '';
    const notes = block.notes.map(note => `- ${note}`).join('\n');
    return `:::notes${attrs}\n${notes}\n:::`;
}

function timelineBlockToString(block: TimelineBlock): string {
    const attrs = block.title ? ` [title="${block.title}"]` : '';
    const steps = block.steps.map(step => {
        const lines = [step.title]; // First line is the title (no ## prefix)
        step.details.forEach(detail => lines.push(`- ${detail}`));
        
        // Add tips section if present
        if (step.tips && step.tips.length > 0) {
            lines.push('[tips]');
            step.tips.forEach(tip => lines.push(`- ${tip}`));
            lines.push('[/tips]');
        }
        
        // Add notes section if present
        if (step.notes && step.notes.length > 0) {
            lines.push('[notes]');
            step.notes.forEach(note => lines.push(`- ${note}`));
            lines.push('[/notes]');
        }
        
        return lines.join('\n');
    }).join('\n\n'); // Empty line separates steps
    
    return `:::timeline${attrs}\n${steps}\n:::`;
}

function imageBlockToString(block: ImageBlock): string {
    const lines = [`url: ${block.url}`];
    if (block.caption) lines.push(`caption: ${block.caption}`);
    if (block.alt) lines.push(`alt: ${block.alt}`);
    
    return `:::image\n${lines.join('\n')}\n:::`;
}

function galleryBlockToString(block: ImageGalleryBlock): string {
    const attrs = block.title ? ` [title="${block.title}"]` : '';
    const images = block.images.map(img => {
        const lines = [`url: ${img.url}`];
        if (img.caption) lines.push(`caption: ${img.caption}`);
        if (img.alt) lines.push(`alt: ${img.alt}`);
        return lines.join('\n');
    }).join('\n---\n');
    
    return `:::gallery${attrs}\n${images}\n:::`;
}

function tableBlockToString(block: TableBlock): string {
    const attrs: string[] = [];
    if (block.title) attrs.push(`title="${block.title}"`);
    if (block.caption) attrs.push(`caption="${block.caption}"`);
    const attrString = attrs.length > 0 ? ` [${attrs.join(' ')}]` : '';
    
    const lines: string[] = [];
    
    // Add headers
    lines.push(block.headers.join(' | '));
    
    // Add separator
    lines.push('---');
    
    // Add rows
    block.rows.forEach(row => {
        lines.push(row.join(' | '));
    });
    
    return `:::table${attrString}\n${lines.join('\n')}\n:::`;
}

/**
 * Validate content blocks
 */
export function validateContent(blocks: ContentBlock[]): string[] {
    const errors: string[] = [];

    blocks.forEach((block, index) => {
        switch (block.type) {
            case 'text':
                if (!block.content.trim()) {
                    errors.push(`Text block ${index + 1}: Content is required`);
                }
                break;
            case 'tips':
                if (block.tips.length === 0) {
                    errors.push(`Tips block ${index + 1}: At least one tip is required`);
                }
                break;
            case 'notes':
                if (block.notes.length === 0) {
                    errors.push(`Notes block ${index + 1}: At least one note is required`);
                }
                break;
            case 'timeline':
                if (block.steps.length === 0) {
                    errors.push(`Timeline block ${index + 1}: At least one step is required`);
                }
                block.steps.forEach((step, stepIndex) => {
                    if (!step.title.trim()) {
                        errors.push(`Timeline block ${index + 1}, Step ${stepIndex + 1}: Title is required`);
                    }
                });
                break;
            case 'image':
                if (!block.url.trim()) {
                    errors.push(`Image block ${index + 1}: URL is required`);
                }
                break;
            case 'imageGallery':
                if (block.images.length === 0) {
                    errors.push(`Gallery block ${index + 1}: At least one image is required`);
                }
                block.images.forEach((img, imgIndex) => {
                    if (!img.url.trim()) {
                        errors.push(`Gallery block ${index + 1}, Image ${imgIndex + 1}: URL is required`);
                    }
                });
                break;
            case 'table':
                if (block.headers.length === 0) {
                    errors.push(`Table block ${index + 1}: At least one header column is required`);
                }
                if (block.rows.length === 0) {
                    errors.push(`Table block ${index + 1}: At least one data row is required`);
                }
                block.rows.forEach((row, rowIndex) => {
                    if (row.length !== block.headers.length) {
                        errors.push(`Table block ${index + 1}, Row ${rowIndex + 1}: Column count mismatch (expected ${block.headers.length}, got ${row.length})`);
                    }
                });
                break;
        }
    });

    return errors;
}

/**
 * Sample content for reference
 */
export const sampleContent = `:::text [heading="About This Journey"]
Welcome to this **amazing travel guide**! This journey will take you through some of the most beautiful locations.

Get ready for an unforgettable adventure filled with stunning landscapes, delicious food, and wonderful memories.
:::

:::tips
- Always carry sufficient cash as many places don't accept cards
- Book train/bus tickets at least 2-3 days in advance
- Carry a power bank and portable charger
- Download offline maps before the journey
:::

:::notes
- Best time to visit: October to March
- Local language: Bengali (English widely understood in tourist areas)
- Currency: Bangladeshi Taka (BDT)
- Emergency numbers: Police 999, Tourist Police 01320-014140
:::

:::timeline [title="Day 1: Getting There"]
Dhaka to Sylhet
- Train: 395 Taka
- Journey time: 6 hours
[tips]
- Book window seats for better views
- Carry snacks and water bottles
[/tips]
[notes]
- Trains depart from Kamalapur Railway Station
- Book tickets online at railway.gov.bd
- Intercity trains are more comfortable than mail trains
[/notes]

Sylhet Railway Station to Shahjalal Mazar
- CNG Auto: 25 Taka per person
- Reserve CNG: 125 Taka
- Breakfast: 100 Taka per person
:::

:::image
url: https://example.com/scenic-view.jpg
caption: A breathtaking view along the journey
alt: Scenic landscape view
:::

:::text
After reaching the destination, take some time to explore the local markets and try authentic street food. Don't forget to bargain!
:::

:::timeline [title="Day 2: Exploring"]
Shahjalal Mazar to Ratargul Swamp Forest
- Reserve car: 2500 Taka
- Entry fee: 50 Taka per person
- Boat ride: 200 Taka per boat
[tips]
- Visit early morning for the best experience
- Wear comfortable shoes suitable for water
[/tips]
[notes]
- Forest is closed during monsoon season (June-August)
- Boat capacity is 4-6 people
- Life jackets are provided and mandatory
[/notes]
:::

:::table [title="Budget Breakdown" caption="Estimated costs per person"]
Category | Budget | Mid-Range | Luxury
---
Accommodation | 800 | 3000 | 8000
Food (Daily) | 300 | 600 | 1500
Transport | 500 | 1000 | 3000
Activities | 200 | 500 | 1000
Total (2 Days) | 3600 | 10200 | 27000
:::

:::gallery [title="Photo Highlights"]
url: https://example.com/photo1.jpg
caption: Morning at the market
---
url: https://example.com/photo2.jpg
caption: Sunset at the forest
---
url: https://example.com/photo3.jpg
caption: Local cuisine
:::`;
