/**
 * Image and image gallery parsers
 */

import type { ImageBlock, ImageGalleryBlock, BlockParser, BlockStringifier, BlockValidator } from './types';
import { parseKeyValuePairs } from './baseParser';

/**
 * Parses image block from buffer
 */
export const parseImageBlock: BlockParser<ImageBlock> = (buffer, attrs, context) => {
    const image: ImageBlock = {
        type: 'image',
        id: context.generateId('image'),
        url: '',
        caption: undefined,
        alt: undefined
    };
    
    const pairs = parseKeyValuePairs(buffer);
    image.url = pairs.url || '';
    image.caption = pairs.caption;
    image.alt = pairs.alt;
    
    return image;
};

/**
 * Converts image block to string format
 */
export const stringifyImageBlock: BlockStringifier<ImageBlock> = (block) => {
    const lines: string[] = [':::image'];
    lines.push(`url: ${block.url}`);
    if (block.caption) lines.push(`caption: ${block.caption}`);
    if (block.alt) lines.push(`alt: ${block.alt}`);
    lines.push(':::');
    return lines;
};

/**
 * Validates image block
 */
export const validateImageBlock: BlockValidator<ImageBlock> = (block, index) => {
    const errors: string[] = [];
    
    if (!block.url?.trim()) {
        errors.push(`Block ${index + 1}: Image URL is required`);
    }
    
    return errors;
};

/**
 * Parses image gallery block from buffer
 */
export const parseImageGalleryBlock: BlockParser<ImageGalleryBlock> = (buffer, attrs, context) => {
    const gallery: ImageGalleryBlock = {
        type: 'imageGallery',
        id: context.generateId('gallery'),
        title: attrs.title,
        images: []
    };
    
    let currentImage: { url?: string; caption?: string } = {};
    
    for (const line of buffer) {
        const trimmed = line.trim();
        
        if (trimmed === '---') {
            if (currentImage.url) {
                gallery.images.push({
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
        gallery.images.push({
            url: currentImage.url,
            caption: currentImage.caption
        });
    }
    
    return gallery;
};

/**
 * Converts image gallery block to string format
 */
export const stringifyImageGalleryBlock: BlockStringifier<ImageGalleryBlock> = (block) => {
    const lines: string[] = [];
    
    if (block.title) {
        lines.push(`:::gallery [title="${block.title}"]`);
    } else {
        lines.push(`:::gallery`);
    }
    
    block.images.forEach((img, idx) => {
        if (idx > 0) lines.push('---');
        lines.push(`url: ${img.url}`);
        if (img.caption) lines.push(`caption: ${img.caption}`);
    });
    
    lines.push(':::');
    return lines;
};

/**
 * Validates image gallery block
 */
export const validateImageGalleryBlock: BlockValidator<ImageGalleryBlock> = (block, index) => {
    const errors: string[] = [];
    
    if (!block.images || block.images.length === 0) {
        errors.push(`Block ${index + 1}: Gallery has no images`);
    }
    
    block.images?.forEach((img, imgIndex) => {
        if (!img.url?.trim()) {
            errors.push(`Block ${index + 1}, Image ${imgIndex + 1}: Missing URL`);
        }
    });
    
    return errors;
};
