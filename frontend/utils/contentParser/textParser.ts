/**
 * Text block parser
 */

import type { TextBlock, BlockParser, BlockStringifier, BlockValidator } from './types';

/**
 * Parses text block from buffer
 */
export const parseTextBlock: BlockParser<TextBlock> = (buffer, attrs, context) => {
    return {
        type: 'text',
        id: context.generateId('text'),
        content: buffer.join('\n').trim(),
        heading: attrs.heading
    };
};

/**
 * Converts text block to string format
 */
export const stringifyTextBlock: BlockStringifier<TextBlock> = (block) => {
    const lines: string[] = [':::text'];
    lines.push(block.content);
    lines.push(':::');
    return lines;
};

/**
 * Validates text block
 */
export const validateTextBlock: BlockValidator<TextBlock> = (block, index) => {
    const errors: string[] = [];
    
    if (!block.content?.trim()) {
        errors.push(`Block ${index + 1}: Text block is empty`);
    }
    
    return errors;
};
