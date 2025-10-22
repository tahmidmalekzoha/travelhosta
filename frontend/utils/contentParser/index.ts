/**
 * Main content parser orchestrator
 * Maintains backward compatibility with original contentParser.ts
 */

import type { ContentBlock } from './types';
import { createParserContext } from './baseParser';

// Import specialized parsers
import { parseTextBlock, stringifyTextBlock, validateTextBlock } from './textParser';
import { parseTimelineBlock, stringifyTimelineBlock, validateTimelineBlock } from './timelineParser';
import { parseImageBlock, stringifyImageBlock, validateImageBlock, parseImageGalleryBlock, stringifyImageGalleryBlock, validateImageGalleryBlock } from './imageParser';
import { parseTableBlock, stringifyTableBlock, validateTableBlock } from './tableParser';
import { parseTipsBlock, stringifyTipsBlock, validateTipsBlock, parseNotesBlock, stringifyNotesBlock, validateNotesBlock } from './tipsParser';
import { parseProsConsBlock, stringifyProsConsBlock, validateProsConsBlock } from './prosConsParser';

/**
 * Parses guide content from text format to ContentBlock array
 * Supports: text, timeline, images, galleries, tables, tips, notes, and pros/cons
 * 
 * @param text - Raw text content with block markers (:::type ... :::)
 * @returns Array of parsed content blocks
 */
export function parseGuideContent(text: string): ContentBlock[] {
    const blocks: ContentBlock[] = [];
    const lines = text.split('\n');
    const context = createParserContext();
    
    let currentBlockType: string | null = null;
    let blockBuffer: string[] = [];
    let blockAttrs: Record<string, string> = {};

    const processBuffer = () => {
        if (!currentBlockType || blockBuffer.length === 0) return;

        try {
            let block: ContentBlock | null = null;

            switch (currentBlockType) {
                case 'text':
                    block = parseTextBlock(blockBuffer, blockAttrs, context);
                    break;
                case 'timeline':
                    block = parseTimelineBlock(blockBuffer, blockAttrs, context);
                    break;
                case 'tips':
                    block = parseTipsBlock(blockBuffer, blockAttrs, context);
                    break;
                case 'notes':
                    block = parseNotesBlock(blockBuffer, blockAttrs, context);
                    break;
                case 'proscons':
                    block = parseProsConsBlock(blockBuffer, blockAttrs, context);
                    break;
                case 'image':
                    block = parseImageBlock(blockBuffer, blockAttrs, context);
                    break;
                case 'gallery':
                    block = parseImageGalleryBlock(blockBuffer, blockAttrs, context);
                    break;
                case 'table':
                    block = parseTableBlock(blockBuffer, blockAttrs, context);
                    break;
            }

            if (block) {
                blocks.push(block);
            }
        } catch (error) {
            console.error(`Error parsing ${currentBlockType} block:`, error);
        }

        currentBlockType = null;
        blockBuffer = [];
        blockAttrs = {};
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Check for block start with :::
        if (trimmed.startsWith(':::')) {
            processBuffer();
            
            const blockType = trimmed.substring(3).split(/[\s\[]/)[0].toLowerCase();
            const attrs = context.parseAttributes(trimmed);

            currentBlockType = blockType;
            blockAttrs = attrs;
        } else if (currentBlockType && !trimmed.startsWith(':::')) {
            // Add content to current block
            blockBuffer.push(line);
        } else if (trimmed.startsWith(':::') && currentBlockType) {
            // End of block
            processBuffer();
        }
    }

    processBuffer(); // Process any remaining buffer
    return blocks;
}

/**
 * Converts ContentBlock array to text format
 * 
 * @param blocks - Array of content blocks
 * @returns Formatted text with block markers
 */
export function contentToText(blocks: ContentBlock[]): string {
    if (!blocks || blocks.length === 0) return '';

    const textParts: string[] = [];

    blocks.forEach((block, index) => {
        if (index > 0) textParts.push('\n\n');

        try {
            let lines: string[] = [];

            switch (block.type) {
                case 'text':
                    lines = stringifyTextBlock(block);
                    break;
                case 'timeline':
                    lines = stringifyTimelineBlock(block);
                    break;
                case 'image':
                    lines = stringifyImageBlock(block);
                    break;
                case 'imageGallery':
                    lines = stringifyImageGalleryBlock(block);
                    break;
                case 'table':
                    lines = stringifyTableBlock(block);
                    break;
                case 'tips':
                    lines = stringifyTipsBlock(block);
                    break;
                case 'notes':
                    lines = stringifyNotesBlock(block);
                    break;
                case 'proscons':
                    lines = stringifyProsConsBlock(block);
                    break;
            }

            textParts.push(...lines);
        } catch (error) {
            console.error(`Error stringifying ${block.type} block:`, error);
        }
    });

    return textParts.join('\n');
}

/**
 * Validates content blocks and returns array of error messages
 * 
 * @param blocks - Array of content blocks to validate
 * @returns Array of error messages (empty if valid)
 */
export function validateContent(blocks: ContentBlock[]): string[] {
    const errors: string[] = [];

    blocks.forEach((block, index) => {
        try {
            let blockErrors: string[] = [];

            switch (block.type) {
                case 'text':
                    blockErrors = validateTextBlock(block, index);
                    break;
                case 'timeline':
                    blockErrors = validateTimelineBlock(block, index);
                    break;
                case 'image':
                    blockErrors = validateImageBlock(block, index);
                    break;
                case 'imageGallery':
                    blockErrors = validateImageGalleryBlock(block, index);
                    break;
                case 'table':
                    blockErrors = validateTableBlock(block, index);
                    break;
                case 'tips':
                    blockErrors = validateTipsBlock(block, index);
                    break;
                case 'notes':
                    blockErrors = validateNotesBlock(block, index);
                    break;
                case 'proscons':
                    blockErrors = validateProsConsBlock(block, index);
                    break;
            }

            errors.push(...blockErrors);
        } catch (error) {
            errors.push(`Block ${index + 1}: Validation error - ${error}`);
        }
    });

    return errors;
}

/**
 * Sample content for demonstration/help
 */
export const sampleContent = `:::text
Welcome to this amazing travel destination! This is a text block where you can write detailed descriptions.

You can use **bold** and *italic* text in your content.
:::


:::timeline [title="Day 1: Journey"]
Location A to Location B
- Transportation: Cost
- Duration: Time
- Notes: Additional info

[tips]
- Tip for this step
- Another tip
[/tips]

[notes]
- Note for this step
- Another note
[/notes]
:::


:::tips
- Always carry sufficient cash as many places don't accept cards
- Book train/bus tickets at least 2-3 days in advance
- Download offline maps before the journey
:::


:::notes
- Entry times may vary by season - check before visiting
- Some locations require advance booking
- Photography restrictions may apply in certain areas
:::


:::proscons [title="Visiting in Summer"]
[pros]
- Clear weather and excellent visibility
- All attractions are open
- Perfect for outdoor activities
- Best time for photography
[/pros]

[cons]
- Peak tourist season with large crowds
- Higher prices for accommodation
- Can be extremely hot during midday
- Need to book well in advance
[/cons]
:::


:::table
Category | Cost (BDT) | Notes
---
Accommodation | 1500 | Per night
Food | 800 | Per day
Transport | 500 | Local travel
:::


:::image
url: https://example.com/your-image.jpg
caption: Describe your image
alt: Alternative text for accessibility
:::


:::gallery [title="Photo Highlights"]
url: https://example.com/image1.jpg
caption: First photo
---
url: https://example.com/image2.jpg
caption: Second photo
:::`;

// Re-export types for convenience
export type {
    ContentBlock,
    TextBlock,
    TimelineBlock,
    ImageBlock,
    ImageGalleryBlock,
    TableBlock,
    TipsBlock,
    NotesBlock,
    ProsConsBlock,
    ItineraryStep
} from './types';
