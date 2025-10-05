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
                (currentBlock as TipsBlock).tips = blockBuffer.filter(line => line.trim());
                break;
            case 'notes':
                (currentBlock as NotesBlock).notes = blockBuffer.filter(line => line.trim());
                break;
            case 'table':
                parseTableData(currentBlock as TableBlock, blockBuffer);
                break;
        }

        blocks.push(currentBlock);
        currentBlock = null;
        blockBuffer = [];
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Block type markers
        if (trimmed.startsWith('### TEXT:') || trimmed.startsWith('### HEADING:')) {
            processBuffer();
            const heading = trimmed.startsWith('### HEADING:') ? trimmed.substring(13).trim() : undefined;
            currentBlock = {
                type: 'text',
                id: generateId('text'),
                content: '',
                heading
            } as TextBlock;
        } else if (trimmed.startsWith('### TIMELINE:')) {
            processBuffer();
            const title = trimmed.substring(13).trim() || undefined;
            currentBlock = {
                type: 'timeline',
                id: generateId('timeline'),
                title,
                steps: []
            } as TimelineBlock;
        } else if (trimmed.startsWith('### IMAGE:')) {
            processBuffer();
            const imageUrl = trimmed.substring(10).trim();
            currentBlock = {
                type: 'image',
                id: generateId('image'),
                url: imageUrl,
                caption: lines[i + 1]?.startsWith('Caption:') ? lines[++i].substring(8).trim() : undefined,
                alt: lines[i + 1]?.startsWith('Alt:') ? lines[++i].substring(4).trim() : undefined
            } as ImageBlock;
            blocks.push(currentBlock);
            currentBlock = null;
        } else if (trimmed.startsWith('### GALLERY:')) {
            processBuffer();
            const title = trimmed.substring(12).trim() || undefined;
            const images: ImageGalleryBlock['images'] = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith('###')) {
                const imgLine = lines[i].trim();
                if (imgLine.startsWith('- ')) {
                    const url = imgLine.substring(2).trim();
                    const caption = lines[i + 1]?.trim().startsWith('Caption:') ? lines[++i].trim().substring(8).trim() : undefined;
                    images.push({ url, caption });
                }
                i++;
            }
            i--; // Step back one line
            currentBlock = {
                type: 'imageGallery',
                id: generateId('gallery'),
                images,
                title
            } as ImageGalleryBlock;
            blocks.push(currentBlock);
            currentBlock = null;
        } else if (trimmed.startsWith('### TABLE:')) {
            processBuffer();
            const title = trimmed.substring(10).trim() || undefined;
            currentBlock = {
                type: 'table',
                id: generateId('table'),
                title,
                headers: [],
                rows: []
            } as TableBlock;
        } else if (trimmed.startsWith('### TIPS:')) {
            processBuffer();
            const title = trimmed.substring(9).trim() || undefined;
            currentBlock = {
                type: 'tips',
                id: generateId('tips'),
                title,
                tips: []
            } as TipsBlock;
        } else if (trimmed.startsWith('### NOTES:')) {
            processBuffer();
            const title = trimmed.substring(10).trim() || undefined;
            currentBlock = {
                type: 'notes',
                id: generateId('notes'),
                title,
                notes: []
            } as NotesBlock;
        } else if (trimmed.startsWith('---')) {
            processBuffer();
        } else if (currentBlock) {
            blockBuffer.push(line);
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

    for (const line of buffer) {
        const trimmed = line.trim();
        if (trimmed.startsWith('## ')) {
            if (currentStep && currentStep.title) {
                steps.push(currentStep as ItineraryStep);
            }
            currentStep = {
                id: `step-${steps.length + 1}`,
                title: trimmed.substring(3).trim(),
                details: []
            };
        } else if (trimmed.startsWith('- ') && currentStep) {
            currentStep.details = currentStep.details || [];
            currentStep.details.push(trimmed.substring(2).trim());
        }
    }

    if (currentStep && currentStep.title) {
        steps.push(currentStep as ItineraryStep);
    }

    return steps;
}

/**
 * Parses table data from text buffer
 */
function parseTableData(table: TableBlock, buffer: string[]): void {
    const rows = buffer.filter(line => line.trim().startsWith('|'));
    if (rows.length === 0) return;

    // Parse headers
    const headerRow = rows[0].split('|').map(cell => cell.trim()).filter(cell => cell);
    table.headers = headerRow;

    // Skip separator row and parse data rows
    for (let i = 2; i < rows.length; i++) {
        const cells = rows[i].split('|').map(cell => cell.trim()).filter(cell => cell);
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
        if (index > 0) textParts.push('---\n');

        switch (block.type) {
            case 'text':
                const textBlock = block as TextBlock;
                if (textBlock.heading) {
                    textParts.push(`### HEADING: ${textBlock.heading}\n${textBlock.content}`);
                } else {
                    textParts.push(`### TEXT:\n${textBlock.content}`);
                }
                break;

            case 'timeline':
                const timeline = block as TimelineBlock;
                textParts.push(`### TIMELINE: ${timeline.title || ''}`);
                timeline.steps.forEach(step => {
                    textParts.push(`## ${step.title}`);
                    step.details.forEach(detail => textParts.push(`- ${detail}`));
                });
                break;

            case 'image':
                const image = block as ImageBlock;
                textParts.push(`### IMAGE: ${image.url}`);
                if (image.caption) textParts.push(`Caption: ${image.caption}`);
                if (image.alt) textParts.push(`Alt: ${image.alt}`);
                break;

            case 'imageGallery':
                const gallery = block as ImageGalleryBlock;
                textParts.push(`### GALLERY: ${gallery.title || ''}`);
                gallery.images.forEach(img => {
                    textParts.push(`- ${img.url}`);
                    if (img.caption) textParts.push(`  Caption: ${img.caption}`);
                });
                break;

            case 'table':
                const table = block as TableBlock;
                textParts.push(`### TABLE: ${table.title || ''}`);
                textParts.push(`| ${table.headers.join(' | ')} |`);
                textParts.push(`| ${table.headers.map(() => '---').join(' | ')} |`);
                table.rows.forEach(row => {
                    textParts.push(`| ${row.join(' | ')} |`);
                });
                break;

            case 'tips':
                const tips = block as TipsBlock;
                textParts.push(`### TIPS: ${tips.title || ''}`);
                tips.tips.forEach(tip => textParts.push(`- ${tip}`));
                break;

            case 'notes':
                const notes = block as NotesBlock;
                textParts.push(`### NOTES: ${notes.title || ''}`);
                notes.notes.forEach(note => textParts.push(`- ${note}`));
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
export const sampleContent = `### TEXT:
Welcome to this amazing travel destination! This is a text block where you can write detailed descriptions.

---

### TIMELINE: Day-by-Day Itinerary
## Day 1: Arrival
- Check in to hotel - 500 Taka
- Evening city tour - Free
- Dinner at local restaurant - 300 Taka

## Day 2: Exploration
- Visit museum - 100 Taka
- Lunch - 250 Taka
- Sunset viewpoint - Free

---

### TIPS: Travel Tips
- Book hotels in advance for better rates
- Carry local currency
- Learn basic local phrases

---

### TABLE: Budget Breakdown
| Category | Cost (BDT) | Notes |
| --- | --- | --- |
| Accommodation | 1500 | Per night |
| Food | 800 | Per day |
| Transport | 500 | Local travel |

---

### IMAGE: https://example.com/image.jpg
Caption: Beautiful sunset view
Alt: Sunset over the beach

---

### NOTES: Important Information
- Best time to visit: November to February
- Language: Bengali and English widely spoken
- Currency: Bangladeshi Taka (BDT)`;
