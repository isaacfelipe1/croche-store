
"use client"
import React from 'react'
import Modal from './modal'

interface SobreModalProps {
  isOpen: boolean
  onClose: () => void
}

const SobreModal: React.FC<SobreModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-[#734230]">Sobre Nós</h2>
      <p className="text-gray-700">
        Bem-vindo à Crochê Store! Somos apaixonados por crochê e artesanato, e
        nossa missão é oferecer produtos de alta qualidade feitos com carinho e
        dedicação. Desde tapetes únicos a peças decorativas, estamos aqui para
        ajudar você a encontrar o que precisa para transformar seu lar com um
        toque de amor e arte.
      </p>
    </Modal>
  )
}

export default SobreModal