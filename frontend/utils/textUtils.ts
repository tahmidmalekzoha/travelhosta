import React, { ReactNode } from 'react';

/**
 * Utility function to extract text content from React nodes
 * Handles strings, numbers, and JSX elements recursively
 * @param node - React node to extract text from
 * @returns Extracted text content as string
 */
export const extractTextFromNode = (node: ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return node.toString();

    if (React.isValidElement(node)) {
        const props = node.props as any;
        if (typeof props.children === 'string') return props.children;
        if (Array.isArray(props.children)) {
            return props.children.map(extractTextFromNode).join('');
        }
        return extractTextFromNode(props.children);
    }

    if (Array.isArray(node)) {
        return node.map(extractTextFromNode).join('');
    }

    return '';
};

/**
 * Splits text into word spans for animation purposes
 * Preserves whitespace between words
 * @param text - Text to split into words
 * @returns Array of React elements representing words and spaces
 */
export const splitTextIntoWords = (text: string): React.ReactElement[] => {
    return text.split(/(\s+)/).map((word, index) => {
        if (word.match(/^\s+$/)) {
            // Return whitespace as-is
            return React.createElement('span', { key: index }, word);
        }
        // Return word wrapped in span with 'word' class
        return React.createElement('span', {
            className: 'word',
            key: index
        }, word);
    });
};
