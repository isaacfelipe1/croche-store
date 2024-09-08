import React, { useState } from 'react'
import Modal from './modal'
import { FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onRegisterSuccess: (token: string, userId: string) => void
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Verifica se as senhas coincidem
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      setIsLoading(false)
      return
    }

    // Verifica se a senha contém pelo menos um dígito
    const passwordPattern = /\d/
    if (!passwordPattern.test(password)) {
      setError("A senha deve conter pelo menos um dígito ('0'-'9').")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:5207/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
        }),
      })

      if (!response.ok) {
        throw new Error('Falha no cadastro')
      }

      const { token, userId } = await response.json()
      console.log('Cadastro bem-sucedido, token recebido:', token)

      // Armazenar o token e o userId no localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('userId', userId)

      onRegisterSuccess(token, userId)
    } catch (err) {
      console.error('Erro ao realizar cadastro:', err)
      setError('Erro ao cadastrar. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm w-full mx-auto animate-slideIn max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-center mb-4 text-[#734230] dark:text-white">
          Cadastro
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-600 dark:text-gray-300 font-medium mb-1"
            >
              Nome
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61B785] transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-600 dark:text-gray-300 font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61B785] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-gray-600 dark:text-gray-300 font-medium mb-1"
            >
              Senha
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61B785] transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <FaEyeSlash size={20} className="mt-4" />
              ) : (
                <FaEye size={20} className="mt-4" />
              )}
            </button>
            <p className="text-xs text-gray-500 mt-1">
              <p className="text-xs text-gray-500 mt-1">
                A senha deve conter pelo menos um dígito
                (&apos;0&apos;-&apos;9&apos;).
              </p>
            </p>
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-600 dark:text-gray-300 font-medium mb-1"
            >
              Confirmar Senha
            </label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61B785] transition"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? (
                <FaEyeSlash size={20} className="mt-4" />
              ) : (
                <FaEye size={20} className="mt-4" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className={`w-full bg-[#61B785] text-white py-2 rounded-lg font-semibold hover:bg-[#734230] transition-colors duration-200 shadow-md hover:shadow-lg flex justify-center items-center ${
              isLoading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mr-2" size={20} />
            ) : (
              'Cadastrar'
            )}
          </button>
        </form>
      </div>
    </Modal>
  )
}

export default RegisterModal
