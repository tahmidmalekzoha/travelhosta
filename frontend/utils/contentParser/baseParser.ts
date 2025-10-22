/**
 * Base parser utilities shared across all content block parsers
 */

import type { ParserContext } from './types';

/**
 * Generates unique block ID
 */
export function createIdGenerator(): (type: string) => string {
    let blockId = 0;
    return (type: string) => `${type}-${Date.now()}-${blockId++}`;
}

/**
 * Parses attributes from block header line
 * Example: :::timeline [title="My Timeline", theme="dark"]
 */
export function parseAttributes(line: string): Record<string, string> {
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
}

/**
 * Creates parser context with utilities
 */
export function createParserContext(): ParserContext {
    const generateId = createIdGenerator();
    return {
        blockId: 0,
        generateId,
        parseAttributes
    };
}

/**
 * Extracts items from list format (lines starting with "- ")
 */
export function extractListItems(buffer: string[]): string[] {
    return buffer
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

/**
 * Splits content into sections based on markers
 * Example: [pros] ... [/pros] [cons] ... [/cons]
 */
export function extractSections(
    buffer: string[],
    sectionNames: string[]
): Record<string, string[]> {
    const sections: Record<string, string[]> = {};
    let currentSection: string | null = null;
    
    for (const line of buffer) {
        const trimmed = line.trim().toLowerCase();
        
        // Check for section start markers
        const startMatch = trimmed.match(/^\[(\w+)\]$/);
        if (startMatch) {
            const sectionName = startMatch[1];
            if (sectionNames.includes(sectionName)) {
                currentSection = sectionName;
                sections[sectionName] = sections[sectionName] || [];
            }
            continue;
        }
        
        // Check for section end markers
        const endMatch = trimmed.match(/^\[\/(\w+)\]$/);
        if (endMatch) {
            currentSection = null;
            continue;
        }
        
        // Add content to current section
        if (currentSection && trimmed) {
            sections[currentSection].push(line);
        }
    }
    
    return sections;
}

/**
 * Parses key-value pairs from buffer
 * Example: "url: https://example.com" -> { url: "https://example.com" }
 */
export function parseKeyValuePairs(buffer: string[]): Record<string, string> {
    const pairs: Record<string, string> = {};
    
    for (const line of buffer) {
        const trimmed = line.trim();
        const colonIndex = trimmed.indexOf(':');
        
        if (colonIndex > 0) {
            const key = trimmed.substring(0, colonIndex).trim();
            const value = trimmed.substring(colonIndex + 1).trim();
            if (key && value) {
                pairs[key] = value;
            }
        }
    }
    
    return pairs;
}
