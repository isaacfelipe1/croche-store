import React from 'react';
import { FaFacebook } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear(); 

  return (
    <footer className="bg-[#432721] text-white text-center py-5 w-full mt-auto">
      <p className="text-[#F1E4A6]">
        &copy; {currentYear} loja de crochê. - Todos os direitos reservados.
      </p>
      <p className="text-[#E56446] hover:text-[#61B785] transition-colors duration-300">
        Desenvolvido para você comprar seus produtos!
      </p>
      <div className="flex justify-center mt-4">
        <a
          href="https://www.facebook.com/people/Amor-Croch%C3%AA/100095593387200/?mibextid=ZbWKwL"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook
            className="text-[#F1E4A6] hover:text-[#61B785] transition-colors duration-300"
            size={24}
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
