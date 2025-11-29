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
    // Initialize with cached content or guide content immediately to prevent loss on remount
    const [contentText, setContentText] = useState(() => {
        if (guide?.id && guide.content) {
            return contentToText(guide.content);
        }
        const cached = formCacheManager.loadContentText();
        return cached?.contentEn || '';
    });
    const [contentTextBn, setContentTextBn] = useState(() => {
        if (guide?.id && guide.contentBn) {
            return contentToText(guide.contentBn);
        }
        const cached = formCacheManager.loadContentText();
        return cached?.contentBn || '';
    });
    const [contentErrors, setContentErrors] = useState<string[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const initializedGuideIdRef = useRef<number | undefined>(guide?.id);
    const isRestoringStateRef = useRef(false);
    const hasRestoredPositionRef = useRef(false);

    // Restore scroll position and cursor after component mounts (once)
    useEffect(() => {
        if (!textareaRef.current || isRestoringStateRef.current || hasRestoredPositionRef.current) return;

        const editorState = formCacheManager.loadEditorState();
        if (editorState && contentText) {
            isRestoringStateRef.current = true;
            hasRestoredPositionRef.current = true;
            
            // Use multiple RAF to ensure DOM is fully ready
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (textareaRef.current) {
                        textareaRef.current.scrollTop = editorState.scrollTop;
                        textareaRef.current.setSelectionRange(editorState.cursorStart, editorState.cursorEnd);
                        console.log('📍 Restored editor position - scroll:', editorState.scrollTop, 'cursor:', editorState.cursorStart);
                        isRestoringStateRef.current = false;
                    }
                });
            });
        }
    }, [contentText]); // Still depend on contentText to wait for it to load

    // Save editor state on interaction
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        let saveTimeout: NodeJS.Timeout;
        
        const saveEditorState = () => {
            if (textarea && !isRestoringStateRef.current) {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    const state = {
                        scrollTop: textarea.scrollTop,
                        cursorStart: textarea.selectionStart,
                        cursorEnd: textarea.selectionEnd,
                        language: 'en' as const
                    };
                    formCacheManager.saveEditorState(state);
                }, 150); // Debounce to reduce localStorage writes
            }
        };

        // Save on scroll, click, and keyup
        textarea.addEventListener('scroll', saveEditorState, { passive: true });
        textarea.addEventListener('click', saveEditorState);
        textarea.addEventListener('keyup', saveEditorState);
        
        // Save immediately on blur (tab switch)
        const saveImmediately = () => {
            if (textarea && !isRestoringStateRef.current) {
                clearTimeout(saveTimeout);
                const state = {
                    scrollTop: textarea.scrollTop,
                    cursorStart: textarea.selectionStart,
                    cursorEnd: textarea.selectionEnd,
                    language: 'en' as const
                };
                formCacheManager.saveEditorState(state);
                console.log('💾 Saved editor state on blur');
            }
        };
        textarea.addEventListener('blur', saveImmediately);

        return () => {
            clearTimeout(saveTimeout);
            textarea.removeEventListener('scroll', saveEditorState);
            textarea.removeEventListener('click', saveEditorState);
            textarea.removeEventListener('keyup', saveEditorState);
            textarea.removeEventListener('blur', saveImmediately);
        };
    }, []);

    // Update content when switching to a different guide
    useEffect(() => {
        // Only update if guide ID actually changed (not just reference)
        if (guide?.id !== undefined && guide.id !== initializedGuideIdRef.current) {
            console.log('📖 Switching to different guide, loading content for ID:', guide.id);
            initializedGuideIdRef.current = guide.id;
            
            // Load guide content from database
            if (guide.content) {
                const convertedText = contentToText(guide.content);
                console.log('📝 Loaded guide content from DB');
                setContentText(convertedText);
            } else {
                setContentText('');
            }
            if (guide.contentBn) {
                setContentTextBn(contentToText(guide.contentBn));
            } else {
                setContentTextBn('');
            }
        } else if (guide?.id === undefined && initializedGuideIdRef.current !== undefined) {
            // Switched from editing to creating new - reset to cache or empty
            console.log('📝 Switched to create mode, resetting content');
            initializedGuideIdRef.current = undefined;
            const cachedContent = formCacheManager.loadContentText();
            setContentText(cachedContent?.contentEn || '');
            setContentTextBn(cachedContent?.contentBn || '');
        }
    }, [guide?.id]); // Only depend on guide ID

    // Save content text to cache on every change (for persistence across tab switches)
    useEffect(() => {
        formCacheManager.saveContentText(contentText, contentTextBn);
    }, [contentText, contentTextBn]);

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
