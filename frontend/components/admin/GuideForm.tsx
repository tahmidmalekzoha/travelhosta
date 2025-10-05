import { FunctionComponent, useState, useEffect } from 'react';
import { GuideData, ItineraryStep } from '../../types';
import { parseItinerary, itineraryToText, validateItinerary } from '../../utils/itineraryParser';
import { uploadGuideImage, validateImageFile } from '../../utils/imageUpload';
import Timeline from '../Timeline';
import { Eye, EyeOff, AlertCircle, Upload, X } from 'lucide-react';

interface GuideFormProps {
    guide?: GuideData;
    onSubmit: (data: Omit<GuideData, 'id'>) => void;
    onCancel: () => void;
    divisions: string[];
    categories: string[];
}

/**
 * Enhanced guide form with itinerary input and preview
 */
const GuideForm: FunctionComponent<GuideFormProps> = ({
    guide,
    onSubmit,
    onCancel,
    divisions,
    categories
}) => {
    const [formData, setFormData] = useState<Omit<GuideData, 'id'>>({
        title: guide?.title || '',
        description: guide?.description || '',
        division: guide?.division || '',
        category: guide?.category || '',
        imageUrl: guide?.imageUrl || '',
        itinerary: guide?.itinerary || []
    });

    const [itineraryText, setItineraryText] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [itineraryErrors, setItineraryErrors] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Initialize itinerary text from existing guide
    useEffect(() => {
        if (guide?.itinerary) {
            setItineraryText(itineraryToText(guide.itinerary, true)); // Use timeline syntax
        }
        if (guide?.imageUrl) {
            setImagePreview(guide.imageUrl);
        }
    }, [guide]);

    // Parse itinerary text and update form data
    useEffect(() => {
        if (itineraryText.trim()) {
            const parsedSteps = parseItinerary(itineraryText);
            const errors = validateItinerary(parsedSteps);
            setItineraryErrors(errors);
            setFormData(prev => ({ ...prev, itinerary: parsedSteps }));
        } else {
            setFormData(prev => ({ ...prev, itinerary: [] }));
            setItineraryErrors([]);
        }
    }, [itineraryText]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
            alert(validation.error);
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
            const imageUrl = await uploadGuideImage(file, formData.title || 'guide');
            setFormData(prev => ({ ...prev, imageUrl }));
        } catch (error) {
            console.error('Upload failed:', error);
            alert(error instanceof Error ? error.message : 'Failed to upload image');
            setImagePreview(null);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, imageUrl: '' }));
        setImagePreview(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title || !formData.description || !formData.division) {
            alert('Please fill in all required fields');
            return;
        }

        if (itineraryErrors.length > 0) {
            alert('Please fix the itinerary errors before submitting');
            return;
        }

        onSubmit(formData);
    };

    const sampleItinerary = `:::timeline
## Dhaka to Sylhet
- Train: 395 Taka

## Sylhet Railway Station to Shahjalal Mazar
- CNG Auto: 25 Taka per person
- Reserve CNG: 125 Taka
- Breakfast: 100 Taka per person

## Shahjalal Mazar to Ratargul Swamp Forest
- Reserve car: 2500 Taka
- Entry fee: 50 Taka per person
- Boat ride: 200 Taka per boat
:::`;

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-[#1b3c44] mb-6">
                    {guide ? 'Edit Guide' : 'Create New Guide'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                                placeholder="Enter guide title..."
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Guide Image
                            </label>
                            
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mb-3 relative inline-block">
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="w-48 h-32 object-cover rounded-lg border-2 border-gray-200"
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

                            {/* Upload Button */}
                            <div className="flex gap-3">
                                <label className="flex items-center gap-2 px-4 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#b87344] transition-colors cursor-pointer">
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

                                {/* Manual URL Input */}
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, imageUrl: e.target.value }));
                                        setImagePreview(e.target.value);
                                    }}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                                    placeholder="Or paste image URL..."
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Upload an image (max 5MB) or paste an external URL
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Division *
                            </label>
                            <select
                                value={formData.division}
                                onChange={(e) => setFormData(prev => ({ ...prev, division: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                                required
                            >
                                <option value="">Select Division</option>
                                {divisions.map((division) => (
                                    <option key={division} value={division}>{division}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                            placeholder="Enter guide description..."
                            required
                        />
                    </div>

                    {/* Itinerary Section */}
                    <div className="border-t pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-[#1b3c44]">Travel Itinerary</h3>
                            <button
                                type="button"
                                onClick={() => setShowPreview(!showPreview)}
                                className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                                {showPreview ? 'Hide Preview' : 'Show Preview'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter Itinerary (Plain Text)
                                </label>
                                <textarea
                                    value={itineraryText}
                                    onChange={(e) => setItineraryText(e.target.value)}
                                    rows={12}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent font-mono text-sm"
                                    placeholder={sampleItinerary}
                                />

                                {/* Errors */}
                                {itineraryErrors.length > 0 && (
                                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                                            <AlertCircle size={16} />
                                            Itinerary Errors:
                                        </div>
                                        <ul className="text-sm text-red-700 space-y-1">
                                            {itineraryErrors.map((error, index) => (
                                                <li key={index}>• {error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Help Text */}
                                <div className="mt-2 text-xs text-gray-500">
                                    <p className="mb-1">💡 <strong>Supported Formats:</strong></p>
                                    <div className="ml-4 space-y-2">
                                        <div>
                                            <p className="font-medium">Timeline Syntax (Recommended):</p>
                                            <code className="text-xs bg-gray-100 p-1 rounded">
                                                :::timeline<br/>
                                                ## Step Title<br/>
                                                - Detail 1<br/>
                                                - Detail 2<br/>
                                                :::
                                            </code>
                                        </div>
                                        <div>
                                            <p className="font-medium">Plain Text (Legacy):</p>
                                            <ul className="space-y-1 text-xs">
                                                <li>• Routes with "to" (e.g., "Dhaka to Sylhet")</li>
                                                <li>• Details after dash (e.g., "- Train fare 395 Taka")</li>
                                                <li>• Blank lines between route changes</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            {showPreview && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Timeline Preview
                                    </label>
                                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                                        {formData.itinerary && formData.itinerary.length > 0 ? (
                                            <Timeline steps={formData.itinerary} />
                                        ) : (
                                            <div className="text-gray-500 text-center py-8">
                                                No itinerary to preview. Enter some steps on the left.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

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
        </div>
    );
};

export default GuideForm;
