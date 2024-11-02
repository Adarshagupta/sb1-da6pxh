import React, { useState, useEffect } from 'react';
import { AlertTriangle, Loader } from 'lucide-react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteAccountModal = ({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) => {
  const [countdown, setCountdown] = useState(30);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
      setCountdown(30);
    };
  }, [isOpen]);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 text-red-600">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Delete Account</h3>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-gray-600">
            This action cannot be undone. All your data, including generated books, settings, and preferences will be permanently deleted.
          </p>
          
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <p className="text-sm text-red-600 font-medium">
              Please wait {countdown} seconds before confirming account deletion.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-600 transition-all duration-1000"
              style={{ width: `${(countdown / 30) * 100}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={countdown > 0 || isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              'Delete Account'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}; 