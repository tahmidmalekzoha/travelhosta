import { FunctionComponent } from 'react';

interface ImagePlaceholderProps {
    /** Text to display in the placeholder */
    text?: string;
    /** Size variant of the placeholder */
    size?: 'small' | 'medium' | 'large';
    /** Additional CSS classes */
    className?: string;
}

/**
 * Reusable image placeholder component for missing or invalid images
 * Displays a centered icon with descriptive text
 */
const ImagePlaceholder: FunctionComponent<ImagePlaceholderProps> = ({ 
    text = 'No Image', 
    size = 'medium',
    className = ''
}) => {
    const sizeConfig = {
        small: {
            height: 'h-48',
            icon: 'w-12 h-12',
            text: 'text-xs'
        },
        medium: {
            height: 'h-64',
            icon: 'w-16 h-16',
            text: 'text-sm'
        },
        large: {
            height: 'h-96',
            icon: 'w-20 h-20',
            text: 'text-base'
        }
    };

    const config = sizeConfig[size];

    return (
        <div className={`w-full ${config.height} flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 ${className}`}>
            <div className="text-center text-gray-500">
                <svg 
                    className={`${config.icon} mx-auto mb-2 opacity-50`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                </svg>
                <p className={config.text}>{text}</p>
            </div>
        </div>
    );
};

export default ImagePlaceholder;
