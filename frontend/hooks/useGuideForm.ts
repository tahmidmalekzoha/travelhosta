/**
 * Custom hook for managing guide form state and validation
 */

import { useState, useEffect, useCallback } from 'react';
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
    const [formData, setFormData] = useState<Omit<GuideData, 'id'> & { id?: number }>({
        title: guide?.title || '',
        description: guide?.description || '',
        division: guide?.division || '',
        category: guide?.category || '',
        imageUrl: guide?.imageUrl || '',
        tags: guide?.tags || [],
        content: guide?.content || [],
        titleBn: guide?.titleBn || '',
        descriptionBn: guide?.descriptionBn || '',
        contentBn: guide?.contentBn || [],
        id: guide?.id
    });

    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [sessionId] = useState(() => Date.now().toString());

    // Update form data when guide prop changes
    useEffect(() => {
        if (guide) {
            console.log('📝 Updating form with guide data:', guide.id);
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
        }
    }, [guide]); // Re-run when guide object changes

    // Save form data to cache on every change
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
