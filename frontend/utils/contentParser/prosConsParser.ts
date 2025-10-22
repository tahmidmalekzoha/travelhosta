/**
 * Pros/Cons block parser
 */

import type { ProsConsBlock, BlockParser, BlockStringifier, BlockValidator } from './types';
import { extractSections } from './baseParser';

/**
 * Parses pros/cons block from buffer
 */
export const parseProsConsBlock: BlockParser<ProsConsBlock> = (buffer, attrs, context) => {
    const proscons: ProsConsBlock = {
        type: 'proscons',
        id: context.generateId('proscons'),
        title: attrs.title,
        pros: [],
        cons: []
    };
    
    const sections = extractSections(buffer, ['pros', 'cons']);
    
    // Extract pros
    if (sections.pros) {
        proscons.pros = sections.pros
            .filter(line => {
                const trimmed = line.trim();
                return trimmed.startsWith('-') || trimmed.startsWith('- ');
            })
            .map(line => {
                const trimmed = line.trim();
                return trimmed.startsWith('- ') 
                    ? trimmed.substring(2).trim() 
                    : trimmed.substring(1).trim();
            });
    }
    
    // Extract cons
    if (sections.cons) {
        proscons.cons = sections.cons
            .filter(line => {
                const trimmed = line.trim();
                return trimmed.startsWith('-') || trimmed.startsWith('- ');
            })
            .map(line => {
                const trimmed = line.trim();
                return trimmed.startsWith('- ') 
                    ? trimmed.substring(2).trim() 
                    : trimmed.substring(1).trim();
            });
    }
    
    return proscons;
};

/**
 * Converts pros/cons block to string format
 */
export const stringifyProsConsBlock: BlockStringifier<ProsConsBlock> = (block) => {
    const lines: string[] = [];
    
    if (block.title) {
        lines.push(`:::proscons [title="${block.title}"]`);
    } else {
        lines.push(`:::proscons`);
    }
    
    lines.push('[pros]');
    block.pros.forEach(pro => lines.push(`- ${pro}`));
    lines.push('[/pros]');
    lines.push('');
    lines.push('[cons]');
    block.cons.forEach(con => lines.push(`- ${con}`));
    lines.push('[/cons]');
    lines.push(':::');
    
    return lines;
};

/**
 * Validates pros/cons block
 */
export const validateProsConsBlock: BlockValidator<ProsConsBlock> = (block, index) => {
    const errors: string[] = [];
    
    if ((!block.pros || block.pros.length === 0) && (!block.cons || block.cons.length === 0)) {
        errors.push(`Block ${index + 1}: Pros/Cons block has no content`);
    }
    
    if (!block.pros || block.pros.length === 0) {
        errors.push(`Block ${index + 1}: Pros/Cons block has no pros`);
    }
    
    if (!block.cons || block.cons.length === 0) {
        errors.push(`Block ${index + 1}: Pros/Cons block has no cons`);
    }
    
    return errors;
};
