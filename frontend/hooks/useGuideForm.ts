/**
 * Custom hook for managing guide form state and validation
 */

import { useState, useEffect } from 'react';
import { GuideData, Language } from '../types';
import { ToastType } from '../components/shared/Toast';

export interface UseGuideFormReturn {
    // Form state
    formData: Omit<GuideData, 'id'>;
    setFormData: React.Dispatch<React.SetStateAction<Omit<GuideData, 'id'>>>;
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
    const [formData, setFormData] = useState<Omit<GuideData, 'id'>>({
        title: guide?.title || '',
        description: guide?.description || '',
        division: guide?.division || '',
        category: guide?.category || '',
        imageUrl: guide?.imageUrl || '',
        tags: guide?.tags || [],
        content: guide?.content || [],
        titleBn: guide?.titleBn || '',
        descriptionBn: guide?.descriptionBn || '',
        contentBn: guide?.contentBn || []
    });

    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    // Update form data when guide prop changes
    useEffect(() => {
        if (guide) {
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
                contentBn: guide.contentBn || []
            });
        }
    }, [guide]);

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
