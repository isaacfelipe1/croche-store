'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiLock, FiMail, FiUser } from 'react-icons/fi'
import withAuth from '../../hoc/withAuth'
import AlertModal from '../components/AlertModal'

const EditProfile: React.FC = () => {
  const [email, setEmail] = useState('')
  const [nome, setNome] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')

    if (storedUserId && token) setUserId(storedUserId)
    else router.push('/')
  }, [router])

  const handleAuthError = (error: string) => {
    setMessage(error)
    console.error(error)
    setIsLoading(false)
    setIsModalOpen(true)
  }

  const handleAction = async (url: string, method: string, body?: object) => {
    const token = localStorage.getItem('token')
    if (!userId || !token)
      return handleAuthError('Token de autenticação não encontrado.')

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) throw new Error('Erro na operação.')

      if (method === 'DELETE') {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        setMessage('Conta excluída com sucesso!')
        setIsModalOpen(true)
        router.push('/')
      } else {
        return true
      }
    } catch (error) {
      handleAuthError('Erro na operação. Por favor, tente novamente.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const success = await handleAction(`http://localhost:5207/Auth/edit/${userId}`, 'PUT', {
      email,
      nome,
      currentPassword,
      password: newPassword,
    })
    if (success) {
      setMessage('Perfil atualizado com sucesso!')
      setIsModalOpen(true)
    }
  }

  const handleDeleteAccount = () => {
    setIsConfirmModalOpen(true)
  }

  const confirmDeleteAccount = () => {
    setIsConfirmModalOpen(false)
    setIsLoading(true)
    handleAction(`http://localhost:5207/Auth/delete/${userId}`, 'DELETE')
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setMessage('')
  }

  return (
    <div className="max-w-md mx-auto mt-15 p-20 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Configuração
      </h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-800">
            Email
          </label>
          <div className="flex items-center mt-1 border rounded">
            <FiMail className="ml-2 text-gray-500" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full p-2 border-none focus:outline-none"
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="nome" className="block text-sm font-medium text-gray-800">
            Nome
          </label>
          <div className="flex items-center mt-1 border rounded">
            <FiUser className="ml-2 text-gray-500" />
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="block w-full p-2 border-none focus:outline-none"
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-800">
            Senha Atual
          </label>
          <div className="flex items-center mt-1 border rounded">
            <FiLock className="ml-2 text-gray-500" />
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="block w-full p-2 border-none focus:outline-none"
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-800">
            Nova Senha
          </label>
          <div className="flex items-center mt-1 border rounded">
            <FiLock className="ml-2 text-gray-500" />
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full p-2 border-none focus:outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ backgroundColor: '#61B785', color: '#FFFFFF' }}
          disabled={isLoading}
        >
          {isLoading ? 'Atualizando...' : 'Atualizar Perfil'}
        </button>
        <button
          onClick={handleDeleteAccount}
          className="w-full py-2 px-4 rounded hover:bg-red-700 mt-4"
          style={{ backgroundColor: '#734230', color: '#FFFFFF' }}
          type="button"
        >
          Excluir Conta
        </button>
      </form>

      <AlertModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Mensagem"
        message={message}
      />

      <AlertModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirmação"
        message="Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita!"
        onConfirm={confirmDeleteAccount}
        confirmButtonText="Excluir"
      />
    </div>
  )
}

export default withAuth(EditProfile)
