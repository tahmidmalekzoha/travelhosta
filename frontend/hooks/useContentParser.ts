/**
 * Custom hook for managing content parsing and validation
 */

import { useState, useEffect, useRef } from 'react';
import { GuideData, Language, ContentBlock } from '../types';
import { parseGuideContent, contentToText, validateContent } from '../utils/contentParser';
import { formCacheManager } from '../utils/formCache';

export interface UseContentParserReturn {
    // Content state
    contentText: string;
    setContentText: React.Dispatch<React.SetStateAction<string>>;
    contentTextBn: string;
    setContentTextBn: React.Dispatch<React.SetStateAction<string>>;
    contentErrors: string[];
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    
    // Helper functions
    insertTemplate: (template: string, currentLanguage: Language) => void;
    countBlocksByType: (type: string, content?: ContentBlock[]) => number;
    findBlockLineNumber: (blockIndex: number, currentLanguage: Language) => number;
    scrollToLine: (lineNumber: number) => void;
}

export function useContentParser(
    guide?: GuideData,
    onContentChange?: (content: ContentBlock[], contentBn: ContentBlock[]) => void
): UseContentParserReturn {
    const [contentText, setContentText] = useState('');
    const [contentTextBn, setContentTextBn] = useState('');
    const [contentErrors, setContentErrors] = useState<string[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const prevGuideIdRef = useRef<number | undefined>(guide?.id);

    // Reset initialization when guide ID changes
    useEffect(() => {
        if (prevGuideIdRef.current !== guide?.id) {
            setIsInitialized(false);
            prevGuideIdRef.current = guide?.id;
        }
    }, [guide?.id]);

    // Initialize content text from existing guide or cache
    useEffect(() => {
        if (isInitialized) return;

        try {
            // If editing an existing guide, ALWAYS load from guide data (database)
            // Ignore cache to show the actual persisted content
            if (guide?.id) {
                console.log('📖 Loading guide content for editing, guide ID:', guide.id);
                console.log('📦 Original content from DB:', guide.content);
                
                if (guide?.content) {
                    const convertedText = contentToText(guide.content);
                    console.log('📝 Converted content to text:', convertedText);
                    setContentText(convertedText);
                } else {
                    setContentText('');
                }
                if (guide?.contentBn) {
                    setContentTextBn(contentToText(guide.contentBn));
                } else {
                    setContentTextBn('');
                }
            } else {
                // Only use cache for NEW guides (no ID yet)
                const cachedContent = formCacheManager.loadContentText();

                if (cachedContent) {
                    setContentText(cachedContent.contentEn);
                    setContentTextBn(cachedContent.contentBn);
                } else {
                    setContentText('');
                    setContentTextBn('');
                }
            }
        } catch (error) {
            console.error('Error loading content from cache:', error);
            // Fallback to guide data
            if (guide?.content) {
                setContentText(contentToText(guide.content));
            } else {
                setContentText('');
            }
            if (guide?.contentBn) {
                setContentTextBn(contentToText(guide.contentBn));
            } else {
                setContentTextBn('');
            }
        }

        setIsInitialized(true);
    }, [guide?.id, guide?.content, guide?.contentBn, isInitialized]);

    // Save content text to cache on every change
    useEffect(() => {
        if (!isInitialized) return;
        formCacheManager.saveContentText(contentText, contentTextBn);
    }, [contentText, contentTextBn, isInitialized]);

    // Parse content text and update form data
    useEffect(() => {
        let parsedContent: ContentBlock[] = [];
        let errors: string[] = [];

        if (contentText.trim()) {
            parsedContent = parseGuideContent(contentText);
            console.log('🔄 Parsed content blocks:', parsedContent);
            errors = validateContent(parsedContent);
        }

        // Update errors only if they changed
        setContentErrors(prevErrors => {
            if (errors.length === 0 && prevErrors.length === 0) return prevErrors;
            if (errors.length !== prevErrors.length) return errors;
            if (errors.every((err, idx) => err === prevErrors[idx])) return prevErrors;
            return errors;
        });

        // Parse Bengali content
        const parsedContentBn = contentTextBn.trim() ? parseGuideContent(contentTextBn) : [];

        // Notify parent component of content changes
        if (onContentChange) {
            onContentChange(parsedContent, parsedContentBn);
        }
    }, [contentText, contentTextBn]);

    /**
     * Inserts a template at the current cursor position in the content editor
     */
    const insertTemplate = (template: string, currentLanguage: Language) => {
        const isEnglish = currentLanguage === 'en';
        const currentContent = isEnglish ? contentText : contentTextBn;
        const setContent = isEnglish ? setContentText : setContentTextBn;
        
        const cursorPos = textareaRef.current?.selectionStart || currentContent.length;
        const before = currentContent.substring(0, cursorPos);
        const after = currentContent.substring(cursorPos);
        
        setContent(before + '\n\n' + template + '\n\n' + after);
    };

    /**
     * Counts blocks of a specific type in the current language content
     */
    const countBlocksByType = (type: string, content?: ContentBlock[]): number => {
        return content?.filter(b => b.type === type).length || 0;
    };

    /**
     * Finds the line number where a block starts in the editor
     */
    const findBlockLineNumber = (blockIndex: number, currentLanguage: Language): number => {
        const text = currentLanguage === 'en' ? contentText : contentTextBn;
        const lines = text.split('\n');
        let currentBlock = -1;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith(':::') && !line.match(/^:::$/)) {
                currentBlock++;
                if (currentBlock === blockIndex) {
                    return i + 1; // 1-indexed
                }
            }
        }
        return 1;
    };

    /**
     * Scrolls the textarea to show a specific line
     */
    const scrollToLine = (lineNumber: number) => {
        if (textareaRef.current) {
            const lineHeight = 24; // Match the CSS line-height
            const scrollTop = (lineNumber - 1) * lineHeight;
            textareaRef.current.scrollTop = scrollTop;
            textareaRef.current.focus();
            
            // Try to position cursor at that line
            const text = textareaRef.current.value;
            const lines = text.split('\n');
            let position = 0;
            for (let i = 0; i < lineNumber - 1 && i < lines.length; i++) {
                position += lines[i].length + 1; // +1 for newline
            }
            textareaRef.current.setSelectionRange(position, position);
        }
    };

    return {
        contentText,
        setContentText,
        contentTextBn,
        setContentTextBn,
        contentErrors,
        textareaRef,
        insertTemplate,
        countBlocksByType,
        findBlockLineNumber,
        scrollToLine
    };
}
