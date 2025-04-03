import React from 'react';

interface SuccessModalProps {
    isOpen: boolean;
    message: string;
    title: string;
    onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, message, title, onClose }) => {
 
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md text-center max-w-sm">
                <h2 className="text-xl font-semibold mb-4 text-indigo-600">{title}</h2>
                <p className="text-gray-700 mb-6">{message || 'Your action was completed successfully.'}</p>
                <button
                    onClick={onClose}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                    Okay
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
