/**
 * GuideImageUploader component
 * Handles guide cover image upload and preview
 */

import { FunctionComponent } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';

interface GuideImageUploaderProps {
    imageUrl: string;
    imagePreview: string | null;
    uploading: boolean;
    onImageUrlChange: (url: string) => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: () => void;
}

/**
 * Check if the image URL is a dummy/placeholder value
 */
const isDummyImage = (url: string): boolean => {
    if (!url) return true;
    const lowerUrl = url.toLowerCase();
    return lowerUrl === 'dummy.jpg' || 
           lowerUrl === '/images/dummy.jpg' || 
           lowerUrl === 'images/dummy.jpg' || 
           lowerUrl.endsWith('dummy.jpg');
};

const GuideImageUploader: FunctionComponent<GuideImageUploaderProps> = ({
    imageUrl,
    imagePreview,
    uploading,
    onImageUrlChange,
    onImageUpload,
    onRemoveImage
}) => {
    const showWarning = !imageUrl || isDummyImage(imageUrl);
    
    return (
        <div className="border-b pb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            
            {/* Warning when no image is provided */}
            {showWarning && (
                <div className="mb-3 flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                        <strong>No image provided.</strong> The guide will be created without a cover image. You can add one later.
                    </div>
                </div>
            )}
            
            {/* Image Preview */}
            {imagePreview && !isDummyImage(imageUrl) && (
                <div className="mb-3 relative inline-block">
                    <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-64 h-40 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                        type="button"
                        onClick={onRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Upload Button & URL Input */}
            <div className="flex gap-3 flex-wrap">
                <label className="flex items-center gap-2 px-4 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#b87344] transition-colors cursor-pointer">
                    <Upload size={18} />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={onImageUpload}
                        disabled={uploading}
                        className="hidden"
                    />
                </label>

                <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => onImageUrlChange(e.target.value)}
                    className="flex-1 min-w-[300px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                    placeholder="Or paste image URL (or leave empty)..."
                />
            </div>
            <p className="mt-1 text-xs text-gray-500">
                Upload an image (max 5MB), paste an external URL, or leave empty to skip
            </p>
        </div>
    );
};

export default GuideImageUploader;
