/**
 * Tips and notes block parsers
 */

import type { TipsBlock, NotesBlock, WarningBlock, BlockParser, BlockStringifier, BlockValidator } from './types';
import { extractListItems } from './baseParser';

/**
 * Parses tips block from buffer
 */
export const parseTipsBlock: BlockParser<TipsBlock> = (buffer, attrs, context) => {
    return {
        type: 'tips',
        id: context.generateId('tips'),
        title: attrs.title,
        tips: extractListItems(buffer)
    };
};

/**
 * Converts tips block to string format
 */
export const stringifyTipsBlock: BlockStringifier<TipsBlock> = (block) => {
    const lines: string[] = [];
    
    if (block.title) {
        lines.push(`:::tips [title="${block.title}"]`);
    } else {
        lines.push(`:::tips`);
    }
    
    block.tips.forEach(tip => lines.push(`- ${tip}`));
    lines.push(':::');
    
    return lines;
};

/**
 * Validates tips block
 */
export const validateTipsBlock: BlockValidator<TipsBlock> = (block, index) => {
    const errors: string[] = [];
    
    if (!block.tips || block.tips.length === 0) {
        errors.push(`Block ${index + 1}: Tips block is empty`);
    }
    
    return errors;
};

/**
 * Parses notes block from buffer
 */
export const parseNotesBlock: BlockParser<NotesBlock> = (buffer, attrs, context) => {
    return {
        type: 'notes',
        id: context.generateId('notes'),
        title: attrs.title,
        notes: extractListItems(buffer)
    };
};

/**
 * Converts notes block to string format
 */
export const stringifyNotesBlock: BlockStringifier<NotesBlock> = (block) => {
    const lines: string[] = [];
    
    if (block.title) {
        lines.push(`:::notes [title="${block.title}"]`);
    } else {
        lines.push(`:::notes`);
    }
    
    block.notes.forEach(note => lines.push(`- ${note}`));
    lines.push(':::');
    
    return lines;
};

/**
 * Validates notes block
 */
export const validateNotesBlock: BlockValidator<NotesBlock> = (block, index) => {
    const errors: string[] = [];
    
    if (!block.notes || block.notes.length === 0) {
        errors.push(`Block ${index + 1}: Notes block is empty`);
    }
    
    return errors;
};

/**
 * Parses warning block from buffer
 */
export const parseWarningBlock: BlockParser<WarningBlock> = (buffer, attrs, context) => {
    return {
        type: 'warning',
        id: context.generateId('warning'),
        title: attrs.title,
        warnings: extractListItems(buffer)
    };
};

/**
 * Converts warning block to string format
 */
export const stringifyWarningBlock: BlockStringifier<WarningBlock> = (block) => {
    const lines: string[] = [];
    
    if (block.title) {
        lines.push(`:::warning [title="${block.title}"]`);
    } else {
        lines.push(`:::warning`);
    }
    
    block.warnings.forEach(warning => lines.push(`- ${warning}`));
    lines.push(':::');
    
    return lines;
};

/**
 * Validates warning block
 */
export const validateWarningBlock: BlockValidator<WarningBlock> = (block, index) => {
    const errors: string[] = [];
    
    if (!block.warnings || block.warnings.length === 0) {
        errors.push(`Block ${index + 1}: Warning block is empty`);
    }
    
    return errors;
};
