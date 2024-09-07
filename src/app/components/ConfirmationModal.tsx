"use client";

import React from 'react';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-auto">
        <p className="text-[#734230] dark:text-white mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="py-2 px-4 bg-[#E56446] text-white rounded hover:bg-red-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 bg-[#61B785] text-white rounded hover:bg-[#734230] transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
