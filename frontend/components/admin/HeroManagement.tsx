"use client";

import { FunctionComponent, useState } from 'react';
import { useHero } from '../../contexts/HeroContext';
import { Upload, Check, Trash2, Plus, X } from 'lucide-react';
import { uploadHeroImage, validateImageFile } from '../../utils/imageUpload';
import Toast, { ToastType } from '../shared/Toast';

/**
 * Hero section management component for uploading and managing hero images
 */
const HeroManagement: FunctionComponent = () => {
    const { heroImages, loading, setActiveHero, addHeroImage, deleteHeroImage } = useHero();
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [newHero, setNewHero] = useState({
        imageUrl: '',
        title: '',
        subtitle: '',
    });
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validation = validateImageFile(file);
        if (!validation.valid) {
            setToast({ message: validation.error || 'Invalid file', type: 'error' });
            return;
        }

        setUploading(true);
        try {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload to Supabase
            const imageUrl = await uploadHeroImage(file);
            setNewHero(prev => ({ ...prev, imageUrl }));
            setToast({ message: 'Image uploaded successfully!', type: 'success' });
        } catch (error) {
            console.error('Upload failed:', error);
            setToast({ 
                message: error instanceof Error ? error.message : 'Failed to upload image', 
                type: 'error' 
            });
            setImagePreview(null);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setNewHero(prev => ({ ...prev, imageUrl: '' }));
        setImagePreview(null);
    };

    const handleSetActive = async (id: string) => {
        try {
            await setActiveHero(id);
            setToast({ message: 'Hero image set as active!', type: 'success' });
        } catch (error) {
            setToast({ message: 'Failed to set active hero image', type: 'error' });
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this hero image?')) {
            try {
                await deleteHeroImage(id);
                setToast({ message: 'Hero image deleted successfully!', type: 'success' });
            } catch (error) {
                setToast({ message: 'Failed to delete hero image', type: 'error' });
            }
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHero.imageUrl || !newHero.title || !newHero.subtitle) {
            setToast({ message: 'Please fill in all fields', type: 'error' });
            return;
        }

        try {
            await addHeroImage({
                imageUrl: newHero.imageUrl,
                title: newHero.title,
                subtitle: newHero.subtitle,
                isActive: false,
            });
            setNewHero({ imageUrl: '', title: '', subtitle: '' });
            setImagePreview(null);
            setShowUploadForm(false);
            setToast({ message: 'Hero image uploaded successfully!', type: 'success' });
        } catch (error) {
            setToast({ message: 'Failed to upload hero image', type: 'error' });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-xl text-[#1b3c44]">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1b3c44]">Hero Section Management</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Manage homepage hero images and text</p>
                </div>
                <button
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44] transition-colors text-sm sm:text-base w-full sm:w-auto"
                >
                    <Plus size={18} className="sm:w-5 sm:h-5" />
                    Upload New Hero
                </button>
            </div>

            {/* Upload Form */}
            {showUploadForm && (
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-[#1b3c44] mb-4">Upload New Hero Image</h2>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hero Image
                            </label>
                            
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mb-3 relative inline-block">
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            {/* Upload & URL Input */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#b87344] transition-colors cursor-pointer text-sm sm:text-base">
                                    <Upload size={18} />
                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="hidden"
                                    />
                                </label>

                                <input
                                    type="text"
                                    value={newHero.imageUrl}
                                    onChange={(e) => {
                                        setNewHero({ ...newHero, imageUrl: e.target.value });
                                        setImagePreview(e.target.value);
                                    }}
                                    className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                                    placeholder="Or paste image URL..."
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Upload an image (max 10MB) or paste an external URL
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                value={newHero.title}
                                onChange={(e) => setNewHero({ ...newHero, title: e.target.value })}
                                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                                placeholder="TRAVELHOSTA"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subtitle
                            </label>
                            <input
                                type="text"
                                value={newHero.subtitle}
                                onChange={(e) => setNewHero({ ...newHero, subtitle: e.target.value })}
                                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                                placeholder="Sajek, Hill of Wonders"
                            />
                        </div>
                        <div className="flex gap-2 sm:gap-3">
                            <button
                                type="submit"
                                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44] transition-colors text-sm sm:text-base"
                            >
                                Upload
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowUploadForm(false)}
                                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Hero Images Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {heroImages.map((hero) => (
                    <div
                        key={hero.id}
                        className={`bg-white rounded-lg shadow-md overflow-hidden ${
                            hero.isActive ? 'ring-2 ring-[#cd8453]' : ''
                        }`}
                    >
                        {/* Image Preview */}
                        <div
                            className="h-48 sm:h-64 bg-cover bg-center relative"
                            style={{ backgroundImage: `url("${hero.imageUrl}")` }}
                        >
                            {hero.isActive && (
                                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-[#cd8453] text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1">
                                    <Check size={14} className="sm:w-4 sm:h-4" />
                                    Active
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 sm:p-6">
                                <h3 className="text-white text-xl sm:text-3xl font-bold">{hero.title}</h3>
                                <p className="text-white text-base sm:text-xl mt-1 sm:mt-2">{hero.subtitle}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="text-xs sm:text-sm text-gray-600">
                                Uploaded: {new Date(hero.uploadedAt).toLocaleDateString()}
                            </div>
                            <div className="flex gap-2">
                                {!hero.isActive && (
                                    <button
                                        onClick={() => handleSetActive(hero.id)}
                                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44] transition-colors text-xs sm:text-sm"
                                    >
                                        Set Active
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(hero.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={hero.isActive}
                                    title={hero.isActive ? "Cannot delete active hero" : "Delete hero"}
                                >
                                    <Trash2 size={18} className="sm:w-5 sm:h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HeroManagement;
