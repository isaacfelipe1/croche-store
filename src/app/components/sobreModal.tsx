
"use client"
import React, { memo } from 'react';
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
        Bem-vindo a vitrine amor & crochê! Nossa missão é oferecer produtos de alta qualidade feitos com carinho e
        dedicação. Desde tapetes únicos a peças por encomenda, estamos aqui para
        ajudar você a encontrar o que precisa para transformar seu lar com um
        toque de amor e arte.
      </p>
    </Modal>
  )
}

export default memo(SobreModal);