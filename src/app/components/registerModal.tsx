import React, { useState } from 'react';
import Modal from './modal';
import { FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (token: string, userId: string) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const togglePasswordVisibility = (field: string) =>
    setShowPassword({ ...showPassword, [field]: !showPassword[field as keyof typeof showPassword] });

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && formData.name && formData.email) {
      setStep(2); 
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    if (!/\d/.test(formData.password)) {
      setError("A senha deve conter pelo menos um dígito ('0'-'9').");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://crochetstoreapi.onrender.com/Auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Falha no cadastro');

      const { token, userId } = await response.json();
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      onRegisterSuccess(token, userId);
    } catch (err) {
      setError('Erro ao cadastrar. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md max-w-sm sm:max-w-lg w-full mx-auto flex flex-col items-center relative">
        <button
          onClick={onClose}
          className="absolute text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition focus:outline-none top-2 right-2"
        >
        </button>
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-[#734230] dark:text-white">Cadastrar-se</h2>
        {error && <p className="text-red-500 mb-4 text-xs sm:text-sm">{error}</p>}

        {step === 1 ? (
          <form onSubmit={handleNextStep} className="w-full">
            {['name', 'email'].map((field) => (
              <div className="mb-3 sm:mb-4 relative" key={field}>
                <label htmlFor={field} className="block text-gray-600 dark:text-gray-300 font-medium text-xs sm:text-sm mb-1">
                  {field === 'email' ? 'Email*' : 'Nome*'}
                </label>
                <input
                  type="text"
                  id={field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#61B785] focus:ring-1 focus:ring-[#61B785] text-xs sm:text-sm"
                  value={formData[field as keyof typeof formData]}
                  onChange={handleInputChange}
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-[#61B785] text-white py-2 rounded-md font-semibold text-xs sm:text-sm hover:bg-[#734230] transition mt-2"
            >
              Próximo
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="w-full">
            {['phoneNumber', 'password', 'confirmPassword'].map((field) => (
              <div className="mb-3 sm:mb-4 relative" key={field}>
                <label htmlFor={field} className="block text-gray-600 dark:text-gray-300 font-medium text-xs sm:text-sm mb-1">
                  {field === 'confirmPassword'
                    ? 'Confirmar Senha*'
                    : field === 'phoneNumber'
                    ? 'Telefone*'
                    : 'Criar Senha*'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword[field as keyof typeof showPassword] ? 'text' : field.includes('password') ? 'password' : 'text'}
                    id={field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#61B785] focus:ring-1 focus:ring-[#61B785] text-xs sm:text-sm"
                    value={formData[field as keyof typeof formData]}
                    onChange={handleInputChange}
                    required
                  />
                  {field.includes('password') && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={() => togglePasswordVisibility(field)}
                    >
                      {showPassword[field as keyof typeof showPassword] ? (
                        <FaEyeSlash className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <FaEye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  )}
                </div>
                {field === 'password' && (
                  <p className="text-xs text-gray-500 mt-1">A senha deve conter pelo menos um dígito (&apos;0&apos;-&apos;9&apos;).</p>
                )}
              </div>
            ))}
            <div className="flex justify-between mt-2">
              <button
                type="button"
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-semibold text-xs sm:text-sm hover:bg-gray-400 transition"
                onClick={handlePreviousStep}
              >
                Voltar
              </button>
              <button
                type="submit"
                className={`bg-[#61B785] text-white py-2 px-4 rounded-md font-semibold text-xs sm:text-sm hover:bg-[#734230] transition flex justify-center items-center ${
                  isLoading ? 'cursor-not-allowed opacity-50' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? <FaSpinner className="animate-spin mr-2" size={16} /> : 'Cadastrar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default RegisterModal;
