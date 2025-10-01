"use client";

import { FunctionComponent, useState } from 'react';
import { GuideData } from '../../types';
import { useGuides } from '../../contexts/GuidesContext';
import { useCategories } from '../../contexts/CategoriesContext';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

/**
 * Guides management component for creating, editing, and deleting guides
 */
const GuidesManagement: FunctionComponent = () => {
    const { guides, addGuide, updateGuide, deleteGuide } = useGuides();
    const { categories, divisions } = useCategories();
    const [showForm, setShowForm] = useState(false);
    const [editingGuide, setEditingGuide] = useState<GuideData | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState<Omit<GuideData, 'id'>>({
        title: '',
        description: '',
        division: '',
        category: '',
        imageUrl: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.division) {
            alert('Please fill in all required fields');
            return;
        }

        if (editingGuide) {
            // Update existing guide
            updateGuide(editingGuide.id, formData);
            alert('Guide updated successfully!');
        } else {
            // Create new guide
            addGuide(formData);
            alert('Guide created successfully!');
        }

        resetForm();
    };

    const handleEdit = (guide: GuideData) => {
        setEditingGuide(guide);
        setFormData({
            title: guide.title,
            description: guide.description,
            division: guide.division,
            category: guide.category,
            imageUrl: guide.imageUrl,
        });
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this guide?')) {
            deleteGuide(id);
            alert('Guide deleted successfully!');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            division: '',
            category: '',
            imageUrl: '',
        });
        setEditingGuide(null);
        setShowForm(false);
    };

    const filteredGuides = guides.filter(guide =>
        guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1b3c44]">Guides Management</h1>
                    <p className="text-gray-600 mt-1">Create and manage travel guides</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44] transition-colors"
                >
                    <Plus size={20} />
                    Create New Guide
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search guides by title, division, or category..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                    />
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-[#1b3c44] mb-4">
                        {editingGuide ? 'Edit Guide' : 'Create New Guide'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                                    placeholder="Complete Guide to Sajek Valley"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Division *
                                </label>
                                <select
                                    value={formData.division}
                                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                                >
                                    <option value="">Select Division</option>
                                    {divisions.map((division) => (
                                        <option key={division.id} value={division.name}>
                                            {division.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                                placeholder="Describe the guide..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image URL
                            </label>
                            <input
                                type="text"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                                placeholder="/images/guide-image.jpg"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44] transition-colors"
                            >
                                {editingGuide ? 'Update Guide' : 'Create Guide'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Guides List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Guide
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Division
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredGuides.map((guide) => (
                                <tr key={guide.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <img
                                                src={guide.imageUrl}
                                                alt={guide.title}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-[#1b3c44]">
                                                    {guide.title}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {guide.description.substring(0, 50)}...
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {guide.division}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {guide.category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(guide)}
                                            className="text-[#cd8453] hover:text-[#1b3c44] mr-4"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(guide.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {filteredGuides.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No guides found. Create your first guide!</p>
                </div>
            )}
        </div>
    );
};

export default GuidesManagement;
