/**
 * EnhancedGuideForm - Refactored version
 * Main form component orchestrating all child components and custom hooks
 * Reduced from 1135 lines to ~200 lines by extracting components and hooks
 */

import { FunctionComponent, useState } from 'react';
import { GuideData } from '../../types';
import { useCategories } from '../../contexts/CategoriesContext';
import { useGuideForm } from '../../hooks/useGuideForm';
import { useContentParser } from '../../hooks/useContentParser';
import { useImageUpload } from '../../hooks/useImageUpload';
import GuideImageUploader from './GuideImageUploader';
import GuideBasicInfoForm from './GuideBasicInfoForm';
import GuideTagsSelector from './GuideTagsSelector';
import GuideContentEditor from './GuideContentEditor';
import TableEditor from './TableEditor';
import Toast from '../shared/Toast';

interface EnhancedGuideFormProps {
    guide?: GuideData;
    onSubmit: (data: Omit<GuideData, 'id'>) => void;
    onCancel: () => void;
    divisions: string[];
    categories: string[];
}

/**
 * Enhanced guide form with flexible content blocks support
 * Supports: text, timeline, images, galleries, tables, and tips in any order
 * Features bilingual support (English/Bengali) with live preview and validation
 */
const EnhancedGuideForm: FunctionComponent<EnhancedGuideFormProps> = ({
    guide,
    onSubmit,
    onCancel,
    divisions,
    categories
}) => {
    // Get tags from context
    const { tags: availableTags } = useCategories();

    // Custom hooks for form management
    const {
        formData,
        setFormData,
        currentLanguage,
        setCurrentLanguage,
        toast,
        setToast,
        updateLanguageField,
        getCurrentContent,
        handleSubmit: handleFormSubmit
    } = useGuideForm(guide);

    // Custom hook for content parsing
    const {
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
    } = useContentParser(guide, (content, contentBn) => {
        setFormData(prev => ({ ...prev, content, contentBn }));
    });

    // Custom hook for image upload
    const {
        uploading,
        imagePreview,
        setImagePreview,
        handleImageUpload: uploadImage,
        handleRemoveImage
    } = useImageUpload(
        guide?.imageUrl ?? undefined,
        (url) => setFormData(prev => ({ ...prev, imageUrl: url })),
        (message, type) => setToast({ message, type })
    );

    // UI state
    const [showTableEditor, setShowTableEditor] = useState(false);

    /**
     * Handle image upload
     */
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await uploadImage(e, formData.title || 'guide');
    };

    /**
     * Handle image URL change
     */
    const handleImageUrlChange = (url: string) => {
        setFormData(prev => ({ ...prev, imageUrl: url }));
        setImagePreview(url);
    };

    /**
     * Handle form submission
     */
    const handleSubmit = (e: React.FormEvent) => {
        handleFormSubmit(e, onSubmit, contentErrors);
    };

    return (
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-[#1b3c44] mb-6">
                    {guide ? 'Edit Guide' : 'Create New Guide'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Cover Image Upload Section */}
                    <GuideImageUploader
                        imageUrl={formData.imageUrl || ''}
                        imagePreview={imagePreview}
                        uploading={uploading}
                        onImageUrlChange={handleImageUrlChange}
                        onImageUpload={handleImageUpload}
                        onRemoveImage={handleRemoveImage}
                    />

                    {/* Basic Info - Division and Category */}
                    <GuideBasicInfoForm
                        division={formData.division}
                        category={formData.category}
                        divisions={divisions}
                        categories={categories}
                        onDivisionChange={(division) => setFormData(prev => ({ ...prev, division }))}
                        onCategoryChange={(category) => setFormData(prev => ({ ...prev, category }))}
                    />

                    {/* Tags Section */}
                    <GuideTagsSelector
                        selectedTags={formData.tags || []}
                        availableTags={availableTags}
                        onTagsChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
                    />

                    {/* Content Section */}
                    <GuideContentEditor
                        currentLanguage={currentLanguage}
                        onLanguageChange={setCurrentLanguage}
                        contentText={contentText}
                        contentTextBn={contentTextBn}
                        onContentTextChange={setContentText}
                        onContentTextBnChange={setContentTextBn}
                        contentErrors={contentErrors}
                        textareaRef={textareaRef}
                        title={formData.title}
                        titleBn={formData.titleBn || ''}
                        description={formData.description}
                        descriptionBn={formData.descriptionBn || ''}
                        onTitleChange={(title, lang) => updateLanguageField('title', title)}
                        onDescriptionChange={(desc, lang) => updateLanguageField('description', desc)}
                        content={formData.content}
                        contentBn={formData.contentBn}
                        onInsertTemplate={(template) => insertTemplate(template, currentLanguage)}
                        onTableEditorOpen={() => setShowTableEditor(true)}
                        countBlocksByType={countBlocksByType}
                        findBlockLineNumber={(index) => findBlockLineNumber(index, currentLanguage)}
                        scrollToLine={scrollToLine}
                    />

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44] transition-colors"
                        >
                            {guide ? 'Update Guide' : 'Create Guide'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Table Editor Modal */}
            {showTableEditor && (
                <TableEditor
                    onInsert={(template) => insertTemplate(template, currentLanguage)}
                    onClose={() => setShowTableEditor(false)}
                />
            )}

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default EnhancedGuideForm;
