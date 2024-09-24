import React from 'react';

interface LoginRequiredModalProps {
  message: string;
  onClose: () => void;
}

const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <p className="text-center text-lg text-[#432721] mb-4">{message}</p>
        <button
          onClick={onClose}
          className="block w-full py-2 bg-[#E56446] text-white rounded hover:bg-[#432721] transition-colors duration-200"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
