// src/components/ContatoModal.tsx
import React from 'react';
import Modal from './modal';

interface ContatoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContatoModal: React.FC<ContatoModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-[#734230]">Fale Conosco</h2>
      <p className="text-gray-700 mb-4">
        Estamos aqui para ajudar! Se você tiver alguma dúvida ou precisar de mais informações, entre em contato conosco através dos seguintes meios:
      </p>
      <ul className="text-gray-700 mb-4">
        <li><strong>Email:</strong> contato@crochestore.com</li>
        <li><strong>Telefone:</strong> (81) 99999-9999</li>
        <li><strong>Endereço:</strong> Rua do Crochê, 123, Bairro Artesanal, Cidade</li>
      </ul>
      <p className="text-gray-700">
        Ou envie-nos uma mensagem diretamente no nosso WhatsApp.
      </p>
    </Modal>
  );
};

export default ContatoModal;
