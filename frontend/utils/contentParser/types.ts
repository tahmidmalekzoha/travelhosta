/**
 * Shared types and interfaces for content parsers
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
    WarningBlock,
    ProsConsBlock,
    ItineraryStep 
} from '../../types';

/**
 * Re-export types from main types file for convenience
 */
export type {
    ContentBlock,
    TextBlock,
    TimelineBlock,
    ImageBlock,
    ImageGalleryBlock,
    TableBlock,
    TipsBlock,
    NotesBlock,
    WarningBlock,
    ProsConsBlock,
    ItineraryStep
};

/**
 * Parser context passed to individual parsers
 */
export interface ParserContext {
    blockId: number;
    generateId: (type: string) => string;
    parseAttributes: (line: string) => Record<string, string>;
}

/**
 * Parser function type for specific content block types
 */
export type BlockParser<T extends ContentBlock> = (
    buffer: string[],
    attrs: Record<string, string>,
    context: ParserContext
) => T;

/**
 * Stringifier function type for converting blocks back to text
 */
export type BlockStringifier<T extends ContentBlock> = (block: T) => string[];

/**
 * Validator function type for content blocks
 */
export type BlockValidator<T extends ContentBlock> = (
    block: T,
    blockIndex: number
) => string[];
