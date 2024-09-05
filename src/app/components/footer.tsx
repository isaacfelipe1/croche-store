import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-[#432721] text-white text-center py-5 w-full mt-auto">
      <p className="text-[#F1E4A6]"> {/* Texto em amarelo claro para contraste */}
        &copy; 2024 loja de crochê. - Todos os direitos reservados.
      </p>
      <p className="text-[#E56446] hover:text-[#61B785] transition-colors duration-300">
        {/* Texto em coral com hover verde menta */}
        Desenvolvido para você vender seus produtos!
      </p>
    </footer>
  )
}

export default Footer;
