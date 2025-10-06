/**
 * Content parser utilities for guide content
 * Converts between text format and ContentBlock array structures
 */

import type { 
    ContentBlock, 
    TextBlock, 
    TimelineBlock, 
    ImageBlock, 
    ImageGalleryBlock, 
    TableBlock, 
    TipsBlock, 
    NotesBlock,
    ItineraryStep 
} from '../types';

/**
 * Parses guide content from text format to ContentBlock array
 * Supports: text, timeline, images, galleries, tables, tips, and notes
 */
export function parseGuideContent(text: string): ContentBlock[] {
    const blocks: ContentBlock[] = [];
    const lines = text.split('\n');
    let currentBlock: ContentBlock | null = null;
    let blockBuffer: string[] = [];
    let blockId = 0;

    const generateId = (type: string) => `${type}-${Date.now()}-${blockId++}`;

    const parseAttributes = (line: string): Record<string, string> => {
        const attrs: Record<string, string> = {};
        const attrMatch = line.match(/\[([^\]]+)\]/);
        if (attrMatch) {
            const attrPairs = attrMatch[1].split(/,\s*/);
            attrPairs.forEach(pair => {
                const [key, value] = pair.split('=');
                if (key && value) {
                    attrs[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
                }
            });
        }
        return attrs;
    };

    const processBuffer = () => {
        if (!currentBlock || blockBuffer.length === 0) return;

        switch (currentBlock.type) {
            case 'text':
                (currentBlock as TextBlock).content = blockBuffer.join('\n').trim();
                break;
            case 'timeline':
                (currentBlock as TimelineBlock).steps = parseTimelineSteps(blockBuffer);
                break;
            case 'tips':
                (currentBlock as TipsBlock).tips = blockBuffer
                    .filter(line => line.trim().startsWith('-'))
                    .map(line => line.trim().substring(1).trim());
                break;
            case 'notes':
                (currentBlock as NotesBlock).notes = blockBuffer
                    .filter(line => line.trim().startsWith('-'))
                    .map(line => line.trim().substring(1).trim());
                break;
            case 'table':
                parseTableData(currentBlock as TableBlock, blockBuffer);
                break;
            case 'image':
                parseImageData(currentBlock as ImageBlock, blockBuffer);
                break;
            case 'imageGallery':
                parseGalleryData(currentBlock as ImageGalleryBlock, blockBuffer);
                break;
        }

        blocks.push(currentBlock);
        currentBlock = null;
        blockBuffer = [];
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Check for block start with :::
        if (trimmed.startsWith(':::')) {
            processBuffer();
            
            const blockType = trimmed.substring(3).split(/[\s\[]/)[0].toLowerCase();
            const attrs = parseAttributes(trimmed);

            switch (blockType) {
                case 'text':
                    currentBlock = {
                        type: 'text',
                        id: generateId('text'),
                        content: '',
                        heading: attrs.heading
                    } as TextBlock;
                    break;

                case 'timeline':
                    currentBlock = {
                        type: 'timeline',
                        id: generateId('timeline'),
                        title: attrs.title,
                        steps: []
                    } as TimelineBlock;
                    break;

                case 'tips':
                    currentBlock = {
                        type: 'tips',
                        id: generateId('tips'),
                        title: attrs.title,
                        tips: []
                    } as TipsBlock;
                    break;

                case 'notes':
                    currentBlock = {
                        type: 'notes',
                        id: generateId('notes'),
                        title: attrs.title,
                        notes: []
                    } as NotesBlock;
                    break;

                case 'image':
                    currentBlock = {
                        type: 'image',
                        id: generateId('image'),
                        url: '',
                        caption: undefined,
                        alt: undefined
                    } as ImageBlock;
                    break;

                case 'gallery':
                    currentBlock = {
                        type: 'imageGallery',
                        id: generateId('gallery'),
                        title: attrs.title,
                        images: []
                    } as ImageGalleryBlock;
                    break;

                case 'table':
                    currentBlock = {
                        type: 'table',
                        id: generateId('table'),
                        title: attrs.title,
                        headers: [],
                        rows: []
                    } as TableBlock;
                    break;
            }
        } else if (currentBlock && !trimmed.startsWith(':::')) {
            // Add content to current block
            blockBuffer.push(line);
        } else if (trimmed.startsWith(':::') && currentBlock) {
            // End of block
            processBuffer();
        }
    }

    processBuffer(); // Process any remaining buffer
    return blocks;
}

/**
 * Parses timeline steps from text buffer
 */
function parseTimelineSteps(buffer: string[]): ItineraryStep[] {
    const steps: ItineraryStep[] = [];
    let currentStep: Partial<ItineraryStep> | null = null;
    let tipsBuffer: string[] = [];
    let notesBuffer: string[] = [];
    let inTips = false;
    let inNotes = false;
    let emptyLineCount = 0;

    const finalizeCurrentStep = () => {
        if (currentStep && currentStep.title) {
            // Add any pending tips/notes before finalizing
            if (tipsBuffer.length > 0) {
                currentStep.tips = (currentStep.tips || []).concat(tipsBuffer.filter(t => t.trim()));
                tipsBuffer = [];
            }
            if (notesBuffer.length > 0) {
                currentStep.notes = (currentStep.notes || []).concat(notesBuffer.filter(n => n.trim()));
                notesBuffer = [];
            }
            steps.push(currentStep as ItineraryStep);
            currentStep = null;
        } else if (tipsBuffer.length > 0 || notesBuffer.length > 0) {
            // If we have tips/notes but no step, clear the buffers
            tipsBuffer = [];
            notesBuffer = [];
        }
    };

    for (const line of buffer) {
        const trimmed = line.trim();
        
        // Track empty lines for step separation
        if (!trimmed) {
            emptyLineCount++;
            // Two or more consecutive empty lines signal a new step
            if (emptyLineCount >= 2 && !inTips && !inNotes) {
                finalizeCurrentStep();
                emptyLineCount = 0;
            }
            continue;
        } else {
            emptyLineCount = 0;
        }
        
        // Check for inline tips/notes sections
        if (trimmed === '[tips]') {
            // If not in a step yet, create one
            if (!currentStep) {
                currentStep = {
                    id: `step-${steps.length + 1}`,
                    title: '',
                    details: []
                };
            }
            inTips = true;
            inNotes = false;
            continue;
        } else if (trimmed === '[/tips]') {
            // Add collected tips to current step
            if (currentStep && tipsBuffer.length > 0) {
                currentStep.tips = (currentStep.tips || []).concat(tipsBuffer.filter(t => t.trim()));
                tipsBuffer = [];
            }
            inTips = false;
            continue;
        } else if (trimmed === '[notes]') {
            // If not in a step yet, create one
            if (!currentStep) {
                currentStep = {
                    id: `step-${steps.length + 1}`,
                    title: '',
                    details: []
                };
            }
            inNotes = true;
            inTips = false;
            continue;
        } else if (trimmed === '[/notes]') {
            // Add collected notes to current step
            if (currentStep && notesBuffer.length > 0) {
                currentStep.notes = (currentStep.notes || []).concat(notesBuffer.filter(n => n.trim()));
                notesBuffer = [];
            }
            inNotes = false;
            continue;
        }

        if (inTips) {
            if (trimmed.startsWith('- ') || trimmed.startsWith('-')) {
                const content = trimmed.startsWith('- ') ? trimmed.substring(2).trim() : trimmed.substring(1).trim();
                tipsBuffer.push(content);
            } else {
                // Non-list item in tips - add as continuation
                tipsBuffer.push(trimmed);
            }
        } else if (inNotes) {
            if (trimmed.startsWith('- ') || trimmed.startsWith('-')) {
                const content = trimmed.startsWith('- ') ? trimmed.substring(2).trim() : trimmed.substring(1).trim();
                notesBuffer.push(content);
            } else {
                // Non-list item in notes - add as continuation
                notesBuffer.push(trimmed);
            }
        } else if (trimmed && !trimmed.startsWith(':::')) {
            // Main timeline step content
            if (trimmed.startsWith('- ')) {
                // It's a detail line
                if (!currentStep) {
                    // If no current step, this line itself becomes the title
                    currentStep = {
                        id: `step-${steps.length + 1}`,
                        title: trimmed.substring(2).trim(),
                        details: []
                    };
                } else {
                    // If current step has no title, use first detail as title
                    if (!currentStep.title) {
                        currentStep.title = trimmed.substring(2).trim();
                    } else {
                        currentStep.details = currentStep.details || [];
                        currentStep.details.push(trimmed.substring(2).trim());
                    }
                }
            } else {
                // Non-list line
                if (!currentStep) {
                    // Start new step with this as title
                    currentStep = {
                        id: `step-${steps.length + 1}`,
                        title: trimmed,
                        details: []
                    };
                } else if (!currentStep.title) {
                    // Set as title if step has no title yet
                    currentStep.title = trimmed;
                } else {
                    // Add to details if we already have a title
                    currentStep.details = currentStep.details || [];
                    currentStep.details.push(trimmed);
                }
            }
        }
    }

    // Finalize the last step
    finalizeCurrentStep();

    return steps;
}

/**
 * Parses image data from text buffer
 */
function parseImageData(image: ImageBlock, buffer: string[]): void {
    for (const line of buffer) {
        const trimmed = line.trim();
        if (trimmed.startsWith('url:')) {
            image.url = trimmed.substring(4).trim();
        } else if (trimmed.startsWith('caption:')) {
            image.caption = trimmed.substring(8).trim();
        } else if (trimmed.startsWith('alt:')) {
            image.alt = trimmed.substring(4).trim();
        }
    }
}

/**
 * Parses gallery data from text buffer
 */
function parseGalleryData(gallery: ImageGalleryBlock, buffer: string[]): void {
    const images: ImageGalleryBlock['images'] = [];
    let currentImage: { url?: string; caption?: string } = {};

    for (const line of buffer) {
        const trimmed = line.trim();
        if (trimmed === '---') {
            if (currentImage.url) {
                images.push({
                    url: currentImage.url,
                    caption: currentImage.caption
                });
            }
            currentImage = {};
        } else if (trimmed.startsWith('url:')) {
            currentImage.url = trimmed.substring(4).trim();
        } else if (trimmed.startsWith('caption:')) {
            currentImage.caption = trimmed.substring(8).trim();
        }
    }

    // Add last image if exists
    if (currentImage.url) {
        images.push({
            url: currentImage.url,
            caption: currentImage.caption
        });
    }

    gallery.images = images;
}

/**
 * Parses table data from text buffer
 */
function parseTableData(table: TableBlock, buffer: string[]): void {
    const nonEmptyLines = buffer.filter(line => line.trim() && line.trim() !== '---');
    if (nonEmptyLines.length < 2) return;

    // First line is headers
    const headerLine = nonEmptyLines[0].trim();
    table.headers = headerLine.split('|').map(cell => cell.trim()).filter(cell => cell);

    // Rest are data rows (skip the separator line if present)
    for (let i = 1; i < nonEmptyLines.length; i++) {
        const line = nonEmptyLines[i].trim();
        if (line === '---' || line.match(/^[-\s|]+$/)) continue; // Skip separator lines
        
        const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
        if (cells.length > 0) {
            table.rows.push(cells);
        }
    }
}

/**
 * Converts ContentBlock array to text format
 */
export function contentToText(blocks: ContentBlock[]): string {
    if (!blocks || blocks.length === 0) return '';

    const textParts: string[] = [];

    blocks.forEach((block, index) => {
        if (index > 0) textParts.push('\n\n');

        switch (block.type) {
            case 'text':
                const textBlock = block as TextBlock;
                textParts.push(`:::text`);
                textParts.push(textBlock.content);
                textParts.push(':::');
                break;

            case 'timeline':
                const timeline = block as TimelineBlock;
                if (timeline.title) {
                    textParts.push(`:::timeline [title="${timeline.title}"]`);
                } else {
                    textParts.push(`:::timeline`);
                }
                timeline.steps.forEach(step => {
                    textParts.push(step.title);
                    step.details.forEach(detail => textParts.push(`- ${detail}`));
                    if (step.tips && step.tips.length > 0) {
                        textParts.push('\n[tips]');
                        step.tips.forEach(tip => textParts.push(`- ${tip}`));
                        textParts.push('[/tips]');
                    }
                    if (step.notes && step.notes.length > 0) {
                        textParts.push('\n[notes]');
                        step.notes.forEach(note => textParts.push(`- ${note}`));
                        textParts.push('[/notes]');
                    }
                });
                textParts.push(':::');
                break;

            case 'image':
                const image = block as ImageBlock;
                textParts.push(':::image');
                textParts.push(`url: ${image.url}`);
                if (image.caption) textParts.push(`caption: ${image.caption}`);
                if (image.alt) textParts.push(`alt: ${image.alt}`);
                textParts.push(':::');
                break;

            case 'imageGallery':
                const gallery = block as ImageGalleryBlock;
                if (gallery.title) {
                    textParts.push(`:::gallery [title="${gallery.title}"]`);
                } else {
                    textParts.push(`:::gallery`);
                }
                gallery.images.forEach((img, idx) => {
                    if (idx > 0) textParts.push('---');
                    textParts.push(`url: ${img.url}`);
                    if (img.caption) textParts.push(`caption: ${img.caption}`);
                });
                textParts.push(':::');
                break;

            case 'table':
                const table = block as TableBlock;
                if (table.title) {
                    textParts.push(`:::table [title="${table.title}"]`);
                } else {
                    textParts.push(`:::table`);
                }
                textParts.push(table.headers.join(' | '));
                textParts.push('---');
                table.rows.forEach(row => {
                    textParts.push(row.join(' | '));
                });
                textParts.push(':::');
                break;

            case 'tips':
                const tips = block as TipsBlock;
                if (tips.title) {
                    textParts.push(`:::tips [title="${tips.title}"]`);
                } else {
                    textParts.push(`:::tips`);
                }
                tips.tips.forEach(tip => textParts.push(`- ${tip}`));
                textParts.push(':::');
                break;

            case 'notes':
                const notes = block as NotesBlock;
                if (notes.title) {
                    textParts.push(`:::notes [title="${notes.title}"]`);
                } else {
                    textParts.push(`:::notes`);
                }
                notes.notes.forEach(note => textParts.push(`- ${note}`));
                textParts.push(':::');
                break;
        }
    });

    return textParts.join('\n');
}

/**
 * Validates content blocks and returns array of error messages
 */
export function validateContent(blocks: ContentBlock[]): string[] {
    const errors: string[] = [];

    blocks.forEach((block, index) => {
        switch (block.type) {
            case 'text':
                if (!(block as TextBlock).content?.trim()) {
                    errors.push(`Block ${index + 1}: Text block is empty`);
                }
                break;

            case 'timeline':
                const timeline = block as TimelineBlock;
                if (!timeline.steps || timeline.steps.length === 0) {
                    errors.push(`Block ${index + 1}: Timeline has no steps`);
                }
                timeline.steps?.forEach((step, stepIndex) => {
                    if (!step.title?.trim()) {
                        errors.push(`Block ${index + 1}, Step ${stepIndex + 1}: Missing title`);
                    }
                    if (!step.details || step.details.length === 0) {
                        errors.push(`Block ${index + 1}, Step ${stepIndex + 1}: No details provided`);
                    }
                });
                break;

            case 'image':
                if (!(block as ImageBlock).url?.trim()) {
                    errors.push(`Block ${index + 1}: Image URL is required`);
                }
                break;

            case 'imageGallery':
                const gallery = block as ImageGalleryBlock;
                if (!gallery.images || gallery.images.length === 0) {
                    errors.push(`Block ${index + 1}: Gallery has no images`);
                }
                gallery.images?.forEach((img, imgIndex) => {
                    if (!img.url?.trim()) {
                        errors.push(`Block ${index + 1}, Image ${imgIndex + 1}: Missing URL`);
                    }
                });
                break;

            case 'table':
                const table = block as TableBlock;
                if (!table.headers || table.headers.length === 0) {
                    errors.push(`Block ${index + 1}: Table has no headers`);
                }
                if (!table.rows || table.rows.length === 0) {
                    errors.push(`Block ${index + 1}: Table has no data rows`);
                }
                break;

            case 'tips':
                if (!(block as TipsBlock).tips || (block as TipsBlock).tips.length === 0) {
                    errors.push(`Block ${index + 1}: Tips block is empty`);
                }
                break;

            case 'notes':
                if (!(block as NotesBlock).notes || (block as NotesBlock).notes.length === 0) {
                    errors.push(`Block ${index + 1}: Notes block is empty`);
                }
                break;
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
