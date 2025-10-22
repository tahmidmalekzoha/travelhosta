/**
 * Table block parser
 */

import type { TableBlock, BlockParser, BlockStringifier, BlockValidator } from './types';

/**
 * Parses table block from buffer
 */
export const parseTableBlock: BlockParser<TableBlock> = (buffer, attrs, context) => {
    const table: TableBlock = {
        type: 'table',
        id: context.generateId('table'),
        title: attrs.title,
        headers: [],
        rows: []
    };
    
    const nonEmptyLines = buffer.filter(line => line.trim() && line.trim() !== '---');
    
    if (nonEmptyLines.length < 2) {
        return table;
    }
    
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
    
    return table;
};

/**
 * Converts table block to string format
 */
export const stringifyTableBlock: BlockStringifier<TableBlock> = (block) => {
    const lines: string[] = [];
    
    if (block.title) {
        lines.push(`:::table [title="${block.title}"]`);
    } else {
        lines.push(`:::table`);
    }
    
    lines.push(block.headers.join(' | '));
    lines.push('---');
    
    block.rows.forEach(row => {
        lines.push(row.join(' | '));
    });
    
    lines.push(':::');
    return lines;
};

/**
 * Validates table block
 */
export const validateTableBlock: BlockValidator<TableBlock> = (block, index) => {
    const errors: string[] = [];
    
    if (!block.headers || block.headers.length === 0) {
        errors.push(`Block ${index + 1}: Table has no headers`);
    }
    
    if (!block.rows || block.rows.length === 0) {
        errors.push(`Block ${index + 1}: Table has no data rows`);
    }
    
    return errors;
};
