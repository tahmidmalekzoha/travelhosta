"use client";

import { FunctionComponent, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

/**
 * Toast notification component
 * Shows success/error messages at the bottom of the screen
 * Auto-dismisses after specified duration
 * Uses React Portal to render at document body level for proper z-index
 */
const Toast: FunctionComponent<ToastProps> = ({ 
    message, 
    type, 
    onClose, 
    duration = 3000 
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const Icon = type === 'success' ? CheckCircle : XCircle;

    const toastElement = (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999] animate-slide-up pointer-events-auto">
            <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md`}>
                <Icon size={24} className="flex-shrink-0" />
                <span className="flex-1 font-medium">{message}</span>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
                    aria-label="Close notification"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );

    // Use portal to render toast at document body level
    if (typeof window !== 'undefined') {
        return createPortal(toastElement, document.body);
    }

    return null;
};

export default Toast;
