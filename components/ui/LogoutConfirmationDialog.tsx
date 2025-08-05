'use client';

import { useState } from 'react';
import { LogOut, X } from 'lucide-react';

interface LogoutDialogProps {
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function LogoutConfirmationDialog({ onConfirm, children }: LogoutDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    setIsOpen(false);
    onConfirm();
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <>
      {/* Wrap your existing button */}
      <div onClick={handleTriggerClick}>
        {children}
      </div>

      {/* Alert Dialog Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-300 ease-in-out">
          {/* Dialog Content */}
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative transform animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-in-out">
            {/* Close Button */}
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all duration-200 ease-in-out hover:rotate-90 hover:scale-110"
            >
              <X size={20} />
            </button>

            {/* Dialog Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out animate-pulse">
                <LogOut className="text-red-600 transition-all duration-300 ease-in-out" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 transition-all duration-200 ease-in-out">
                Confirm Logout
              </h2>
            </div>

            {/* Dialog Body */}
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </p>

            {/* Dialog Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}