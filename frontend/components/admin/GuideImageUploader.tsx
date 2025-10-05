/**
 * GuideImageUploader component
 * Handles guide cover image upload and preview
 */

import { FunctionComponent } from 'react';
import { Upload, X } from 'lucide-react';

interface GuideImageUploaderProps {
    imageUrl: string;
    imagePreview: string | null;
    uploading: boolean;
    onImageUrlChange: (url: string) => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: () => void;
}

const GuideImageUploader: FunctionComponent<GuideImageUploaderProps> = ({
    imageUrl,
    imagePreview,
    uploading,
    onImageUrlChange,
    onImageUpload,
    onRemoveImage
}) => {
    return (
        <div className="border-b pb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
            </label>
            
            {/* Image Preview */}
            {imagePreview && (
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
                    placeholder="Or paste image URL..."
                />
            </div>
            <p className="mt-1 text-xs text-gray-500">
                Upload an image (max 5MB) or paste an external URL
            </p>
        </div>
    );
};

export default GuideImageUploader;
