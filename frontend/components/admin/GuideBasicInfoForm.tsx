/**
 * GuideBasicInfoForm component
 * Handles basic guide information: division and category selection
 */

import { FunctionComponent } from 'react';

interface GuideBasicInfoFormProps {
    division: string;
    category: string;
    divisions: string[];
    categories: string[];
    onDivisionChange: (division: string) => void;
    onCategoryChange: (category: string) => void;
}

const GuideBasicInfoForm: FunctionComponent<GuideBasicInfoFormProps> = ({
    division,
    category,
    divisions,
    categories,
    onDivisionChange,
    onCategoryChange
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Division *
                </label>
                <select
                    value={division}
                    onChange={(e) => onDivisionChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                    required
                >
                    <option value="">Select Division</option>
                    {divisions.map((div) => (
                        <option key={div} value={div}>{div}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                </label>
                <select
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default GuideBasicInfoForm;
