/**
 * Custom hook for managing guide form state and validation
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { GuideData, Language } from '../types';
import { ToastType } from '../components/shared/Toast';
import { formCacheManager } from '../utils/formCache';

export interface UseGuideFormReturn {
    // Form state
    formData: Omit<GuideData, 'id'> & { id?: number };
    setFormData: React.Dispatch<React.SetStateAction<Omit<GuideData, 'id'> & { id?: number }>>;
    currentLanguage: Language;
    setCurrentLanguage: React.Dispatch<React.SetStateAction<Language>>;
    
    // Toast state
    toast: { message: string; type: ToastType } | null;
    setToast: React.Dispatch<React.SetStateAction<{ message: string; type: ToastType } | null>>;
    
    // Helper functions
    updateLanguageField: (field: 'title' | 'description', value: string) => void;
    getLanguageFieldValue: (field: 'title' | 'description') => string;
    getCurrentContent: () => GuideData['content'];
    
    // Form submission
    handleSubmit: (e: React.FormEvent, onSubmit: (data: Omit<GuideData, 'id'>) => void, contentErrors: string[]) => void;
}

export function useGuideForm(guide?: GuideData): UseGuideFormReturn {
    const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
    // Initialize with cached data or guide data to prevent loss on remount
    const [formData, setFormData] = useState<Omit<GuideData, 'id'> & { id?: number }>(() => {
        if (guide) {
            return {
                title: guide.title || '',
                description: guide.description || '',
                division: guide.division || '',
                category: guide.category || '',
                imageUrl: guide.imageUrl || '',
                tags: guide.tags || [],
                content: guide.content || [],
                titleBn: guide.titleBn || '',
                descriptionBn: guide.descriptionBn || '',
                contentBn: guide.contentBn || [],
                id: guide.id
            };
        }
        // For new guides, try to load from cache
        const cached = formCacheManager.loadFormData();
        if (cached) {
            return cached;
        }
        // Default empty form
        return {
            title: '',
            description: '',
            division: '',
            category: '',
            imageUrl: '',
            tags: [],
            content: [],
            titleBn: '',
            descriptionBn: '',
            contentBn: []
        };
    });

    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [sessionId] = useState(() => Date.now().toString());
    const initializedGuideIdRef = useRef<number | undefined>(guide?.id);

    // Update form data when switching to a different guide (not on every render)
    useEffect(() => {
        if (guide && guide.id !== initializedGuideIdRef.current) {
            console.log('📝 Switching to different guide, loading form data:', guide.id);
            initializedGuideIdRef.current = guide.id;
            setFormData({
                title: guide.title || '',
                description: guide.description || '',
                division: guide.division || '',
                category: guide.category || '',
                imageUrl: guide.imageUrl || '',
                tags: guide.tags || [],
                content: guide.content || [],
                titleBn: guide.titleBn || '',
                descriptionBn: guide.descriptionBn || '',
                contentBn: guide.contentBn || [],
                id: guide.id
            });
        } else if (!guide && initializedGuideIdRef.current !== undefined) {
            // Switched from editing to creating new
            console.log('📝 Switched to create mode, loading from cache or resetting');
            initializedGuideIdRef.current = undefined;
            const cached = formCacheManager.loadFormData();
            if (cached) {
                setFormData(cached);
            }
        }
    }, [guide?.id]); // Only re-run when the guide ID changes

    // Save form data to cache on every change (for persistence across tab switches)
    useEffect(() => {
        formCacheManager.saveFormData(formData);
        formCacheManager.saveSession(sessionId, formData.id);
    }, [formData, sessionId]);

    /**
     * Updates form field based on current language
     */
    const updateLanguageField = (field: 'title' | 'description', value: string) => {
        const fieldName = currentLanguage === 'en' ? field : `${field}Bn`;
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    /**
     * Gets the value of a language-specific field
     */
    const getLanguageFieldValue = (field: 'title' | 'description'): string => {
        return currentLanguage === 'en' ? formData[field] : (formData[`${field}Bn` as keyof typeof formData] as string || '');
    };

    /**
     * Gets the current language content
     */
    const getCurrentContent = () => {
        return currentLanguage === 'en' ? formData.content : formData.contentBn;
    };

    /**
     * Form submission handler - validates required fields and content before submitting
     */
    const handleSubmit = (
        e: React.FormEvent,
        onSubmit: (data: Omit<GuideData, 'id'>) => void,
        contentErrors: string[]
    ) => {
        e.preventDefault();
        
        if (!formData.title || !formData.description || !formData.division) {
            setToast({ message: 'Please fill in all required fields', type: 'error' });
            return;
        }

        if (contentErrors.length > 0) {
            setToast({ message: 'Please fix the content errors before submitting', type: 'error' });
            return;
        }

        onSubmit(formData);
    };

    return {
        formData,
        setFormData,
        currentLanguage,
        setCurrentLanguage,
        toast,
        setToast,
        updateLanguageField,
        getLanguageFieldValue,
        getCurrentContent,
        handleSubmit
    };
}
