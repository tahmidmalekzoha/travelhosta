/**
 * Utility functions for handling table paste from various sources
 * Supports: Google Docs, Excel, Word, HTML tables, TSV, CSV
 */

export interface ParsedTable {
    headers: string[];
    rows: string[][];
}

/**
 * Main function to parse pasted table content
 * Automatically detects format and parses accordingly
 */
export function parseTableFromClipboard(pastedContent: string): ParsedTable | null {
    if (!pastedContent || !pastedContent.trim()) {
        return null;
    }

    // Try different parsing methods in order of likelihood
    
    // 1. Try HTML table (from Google Docs, Word, etc.)
    const htmlResult = parseHTMLTable(pastedContent);
    if (htmlResult) return htmlResult;

    // 2. Try TSV (Tab-separated, common from spreadsheets)
    const tsvResult = parseTSV(pastedContent);
    if (tsvResult && tsvResult.rows.length > 0) return tsvResult;

    // 3. Try CSV
    const csvResult = parseCSV(pastedContent);
    if (csvResult && csvResult.rows.length > 0) return csvResult;

    // 4. Try pipe-separated (Markdown tables)
    const pipeResult = parsePipeSeparated(pastedContent);
    if (pipeResult && pipeResult.rows.length > 0) return pipeResult;

    return null;
}

/**
 * Parse HTML table (Google Docs, Word, etc.)
 */
function parseHTMLTable(content: string): ParsedTable | null {
    // Check if content contains HTML table tags
    if (!content.includes('<table') && !content.includes('<tr')) {
        return null;
    }

    try {
        // Create a temporary DOM element to parse HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const table = doc.querySelector('table');

        if (!table) return null;

        const rows = Array.from(table.querySelectorAll('tr'));
        if (rows.length === 0) return null;

        // Extract headers from first row (could be <th> or <td>)
        const firstRow = rows[0];
        const headerCells = Array.from(firstRow.querySelectorAll('th, td'));
        const headers = headerCells.map(cell => cell.textContent?.trim() || '');

        // Extract data rows
        const dataRows = rows.slice(1).map(row => {
            const cells = Array.from(row.querySelectorAll('td, th'));
            return cells.map(cell => cell.textContent?.trim() || '');
        }).filter(row => row.some(cell => cell !== '')); // Filter empty rows

        return {
            headers,
            rows: dataRows
        };
    } catch (error) {
        console.error('Error parsing HTML table:', error);
        return null;
    }
}

/**
 * Parse TSV (Tab-separated values) - common from Google Sheets/Excel
 */
function parseTSV(content: string): ParsedTable | null {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) return null;

    // Check if content has tabs
    if (!content.includes('\t')) return null;

    const headers = lines[0].split('\t').map(h => h.trim());
    const rows = lines.slice(1).map(line => 
        line.split('\t').map(cell => cell.trim())
    );

    // Validate: all rows should have same number of columns
    const headerLength = headers.length;
    const validRows = rows.filter(row => row.length === headerLength);

    if (validRows.length === 0) return null;

    return {
        headers,
        rows: validRows
    };
}

/**
 * Parse CSV (Comma-separated values)
 */
function parseCSV(content: string): ParsedTable | null {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) return null;

    // Check if content has commas
    if (!content.includes(',')) return null;

    // Simple CSV parser (doesn't handle quoted commas)
    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    const rows = lines.slice(1).map(line => 
        line.split(',').map(cell => cell.trim().replace(/^["']|["']$/g, ''))
    );

    // Validate
    const headerLength = headers.length;
    const validRows = rows.filter(row => row.length === headerLength && row.some(cell => cell !== ''));

    if (validRows.length === 0) return null;

    return {
        headers,
        rows: validRows
    };
}

/**
 * Parse pipe-separated (Markdown tables)
 */
function parsePipeSeparated(content: string): ParsedTable | null {
    const lines = content.split('\n').filter(line => line.trim() && !line.trim().match(/^[\|\-\s]+$/));
    if (lines.length < 2) return null;

    // Check if content has pipes
    if (!content.includes('|')) return null;

    const parseRow = (line: string) => {
        return line
            .split('|')
            .map(cell => cell.trim())
            .filter((cell, index, arr) => {
                // Remove first and last empty cells from |col1|col2| format
                return !(cell === '' && (index === 0 || index === arr.length - 1));
            });
    };

    const headers = parseRow(lines[0]);
    const rows = lines.slice(1)
        .filter(line => !line.match(/^\|?[\s\-:]+\|?$/)) // Skip separator lines
        .map(parseRow);

    // Validate
    const validRows = rows.filter(row => row.length === headers.length && row.some(cell => cell !== ''));

    if (validRows.length === 0) return null;

    return {
        headers,
        rows: validRows
    };
}

/**
 * Convert parsed table to content block syntax
 */
export function tableToContentBlock(table: ParsedTable, title?: string, caption?: string): string {
    const attrs: string[] = [];
    if (title) attrs.push(`title="${title}"`);
    if (caption) attrs.push(`caption="${caption}"`);
    const attrString = attrs.length > 0 ? ` [${attrs.join(' ')}]` : '';

    const lines: string[] = [];
    
    // Headers
    lines.push(table.headers.join(' | '));
    
    // Separator
    lines.push('---');
    
    // Rows
    table.rows.forEach(row => {
        lines.push(row.join(' | '));
    });

    return `:::table${attrString}\n${lines.join('\n')}\n:::`;
}

/**
 * Detect and auto-convert table from clipboard
 */
export function handleTablePaste(event: ClipboardEvent): string | null {
    const clipboardData = event.clipboardData;
    if (!clipboardData) return null;

    // Try HTML first (rich paste from Google Docs/Excel)
    const htmlData = clipboardData.getData('text/html');
    if (htmlData) {
        const table = parseTableFromClipboard(htmlData);
        if (table) {
            return tableToContentBlock(table);
        }
    }

    // Fall back to plain text
    const textData = clipboardData.getData('text/plain');
    if (textData) {
        const table = parseTableFromClipboard(textData);
        if (table) {
            return tableToContentBlock(table);
        }
    }

    return null;
}

/**
 * Preview table from clipboard data
 */
export function previewTableFromClipboard(pastedContent: string): { 
    success: boolean; 
    table?: ParsedTable; 
    preview?: string;
    error?: string;
} {
    const table = parseTableFromClipboard(pastedContent);
    
    if (!table) {
        return {
            success: false,
            error: 'Could not detect table format. Please paste from Google Docs, Excel, or use tab/comma separated format.'
        };
    }

    const preview = tableToContentBlock(table);
    
    return {
        success: true,
        table,
        preview
    };
}
