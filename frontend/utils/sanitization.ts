/**
 * Content Sanitization Utilities
 * 
 * Provides XSS protection by sanitizing user-generated content
 * Uses DOMPurify for HTML sanitization
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Allows safe HTML tags like <strong>, <em>, <p>, etc.
 * 
 * @param html - Raw HTML content to sanitize
 * @returns Sanitized HTML safe for rendering
 * 
 * @example
 * const clean = sanitizeHtml('<script>alert("xss")</script><strong>Safe Text</strong>');
 * // Returns: '<strong>Safe Text</strong>'
 */
export function sanitizeHtml(html: string): string {
    if (!html) return '';

    // Configure DOMPurify with safe defaults
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre'
        ],
        ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
        ALLOW_DATA_ATTR: false,
        KEEP_CONTENT: true
    });
}

/**
 * Sanitize plain text by escaping HTML entities
 * Use this for text that should not contain any HTML
 * 
 * @param text - Raw text to sanitize
 * @returns Escaped text safe for rendering
 * 
 * @example
 * const clean = sanitizeText('<script>alert("xss")</script>');
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 */
export function sanitizeText(text: string): string {
    if (!text) return '';

    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Sanitize URL to prevent javascript: and data: protocol attacks
 * Only allows http, https, and mailto protocols
 * 
 * @param url - URL to sanitize
 * @returns Safe URL or empty string if invalid
 * 
 * @example
 * sanitizeUrl('javascript:alert("xss")') // Returns: ''
 * sanitizeUrl('https://example.com') // Returns: 'https://example.com'
 */
export function sanitizeUrl(url: string): string {
    if (!url) return '';

    try {
        const parsed = new URL(url, window.location.origin);
        const allowedProtocols = ['http:', 'https:', 'mailto:'];

        if (allowedProtocols.includes(parsed.protocol)) {
            return url;
        }

        return '';
    } catch {
        // Invalid URL
        return '';
    }
}

/**
 * Sanitize markdown-style text that may contain bold/italic markers
 * Converts markdown to safe HTML
 * 
 * @param text - Markdown text to sanitize
 * @returns Sanitized HTML
 * 
 * @example
 * const clean = sanitizeMarkdown('**Bold** and *italic*');
 * // Returns: '<strong>Bold</strong> and <em>italic</em>'
 */
export function sanitizeMarkdown(text: string): string {
    if (!text) return '';

    // Convert markdown to HTML
    let formatted = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Sanitize the result
    return sanitizeHtml(formatted);
}

/**
 * Sanitize user input for search queries
 * Removes special characters that could be used for injection
 * 
 * @param query - Search query to sanitize
 * @returns Sanitized query string
 */
export function sanitizeSearchQuery(query: string): string {
    if (!query) return '';

    // Remove potentially dangerous characters
    return query
        .replace(/[<>{}[\]\\]/g, '')
        .trim()
        .slice(0, 200); // Limit length
}

/**
 * Check if content is safe (doesn't contain suspicious patterns)
 * Use this as an additional validation layer
 * 
 * @param content - Content to check
 * @returns True if content appears safe
 */
export function isSafeContent(content: string): boolean {
    if (!content) return true;

    const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /onerror=/i,
        /onload=/i,
        /onclick=/i,
        /eval\(/i,
        /<iframe/i,
        /<object/i,
        /<embed/i
    ];

    return !suspiciousPatterns.some(pattern => pattern.test(content));
}

/**
 * Configure DOMPurify for the application
 * Call this once on app initialization
 */
export function configureSanitizer(): void {
    if (typeof window === 'undefined') return;

    // Add custom hooks for additional security
    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
        // Ensure all links open in new tab and have noopener
        if (node.tagName === 'A') {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener noreferrer');
        }
    });
}
