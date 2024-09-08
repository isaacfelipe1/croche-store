import React from 'react'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  onConfirm?: () => void
  confirmButtonText?: string
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmButtonText = 'OK',
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="mr-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {confirmButtonText}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

export default AlertModal
