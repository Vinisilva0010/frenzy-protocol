"use client";

import { motion } from "framer-motion";

// SVGs otimizados para não depender de bibliotecas externas (Clean Code)
const Icons = {
  X: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Discord: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0 a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
    </svg>
  ),
  GitHub: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
};

// Componente de Botão Social Brutalista
function SocialButton({ href, label, icon: Icon }: { href: string, label: string, icon: any }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-4 bg-[#14F195] border-[4px] md:border-[6px] border-black p-4 md:p-6 text-black hover:bg-white transition-colors duration-200"
      whileHover={{ x: -4, y: -4, boxShadow: "8px 8px 0px 0px #000" }}
      whileTap={{ x: 2, y: 2, boxShadow: "0px 0px 0px 0px #000" }}
      style={{ boxShadow: "4px 4px 0px 0px #000" }}
    >
      <Icon />
      <span 
        className="text-2xl md:text-3xl font-black uppercase tracking-tighter hidden md:block"
        style={{ fontFamily: "var(--font-bebas)" }}
      >
        {label}
      </span>
    </motion.a>
  );
}

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#9945FF] border-t-[8px] border-black overflow-hidden flex flex-col">
      
      {/* 1. SEÇÃO CALL TO ACTION (CTA) GIGANTE */}
      <div className="w-full border-b-[8px] border-black bg-[#9945FF] py-16 md:py-24 px-4 flex flex-col items-center justify-center text-center">
        <h2 
          className="text-[clamp(4rem,12vw,10rem)] font-black uppercase text-black leading-[0.85] tracking-tighter"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          ENTER THE
        </h2>
        <h2 
          className="text-[clamp(5rem,15vw,12rem)] font-black uppercase text-[#14F195] leading-[0.85] tracking-tighter"
          style={{ 
            fontFamily: "var(--font-bebas)",
            WebkitTextStroke: "clamp(2px, 0.4vw, 4px) #000",
            textShadow: "10px 10px 0px #000"
          }}
        >
          STRATA
        </h2>
        <p className="mt-8 text-black font-mono text-lg md:text-xl font-bold uppercase tracking-widest max-w-2xl bg-white border-4 border-black px-6 py-2 shadow-[4px_4px_0px_0px_#000]">
          Liquidity divided. Chaos multiplied.
        </p>
      </div>

      {/* 2. GRID DE REDES SOCIAIS E LINKS ÚTEIS */}
      <div className="w-full flex flex-col lg:flex-row">
        
        {/* Esquerda: Redes Sociais */}
        <div className="lg:w-1/2 p-8 md:p-12 border-b-[8px] lg:border-b-0 lg:border-r-[8px] border-black bg-[#9945FF] flex flex-col justify-center">
          <h3 
            className="text-3xl font-black text-black uppercase mb-8"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            // JOIN THE SYNDICATE
          </h3>
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            <SocialButton href="https://twitter.com/SEU_TWITTER" label="X" icon={Icons.X} />
            <SocialButton href="https://discord.gg/SEU_DISCORD" label="Discord" icon={Icons.Discord} />
            <SocialButton href="https://github.com/SEU_GITHUB" label="GitHub" icon={Icons.GitHub} />
          </div>
        </div>

        {/* Direita: Links do Protocolo */}
        <div className="lg:w-1/2 p-8 md:p-12 bg-[#0A0A0A] flex flex-col justify-center">
          <h3 
            className="text-3xl font-black text-[#14F195] uppercase mb-8"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            // PROTOCOL INTEL
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {['Whitepaper', 'Smart Contracts', 'Terms of Service', 'Privacy Policy'].map((link, i) => (
              <a 
                key={i}
                href={`#${link.toLowerCase().replace(' ', '-')}`} // Plugar rota real aqui
                className="text-white hover:text-[#14F195] font-mono font-bold text-sm md:text-base uppercase tracking-wider transition-colors border-b-2 border-transparent hover:border-[#14F195] w-fit pb-1"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* 3. RODAPÉ FINAL (COPYRIGHT & ZANVEXIS CREDIT) */}
      <div className="w-full bg-[#14F195] border-t-[8px] border-black py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-black font-mono font-bold text-xs md:text-sm uppercase tracking-widest text-center md:text-left">
          © {new Date().getFullYear()} STRATA PROTOCOL. ALL RIGHTS RESERVED.
        </p>
        
        {/* Crédito Oficial da Zanvexis - Exatamente onde deve estar */}
        <a 
          href="https://zanvexis.com" // Coloque a URL real da Zanvexis aqui
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 bg-black text-[#14F195] px-4 py-2 border-2 border-black hover:bg-white hover:text-black transition-colors duration-200"
        >
          <span className="font-mono text-xs font-bold uppercase tracking-widest">
            ENGINE BY
          </span>
          <span 
            className="text-lg font-black tracking-tighter"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            ZANVEXIS
          </span>
        </a>
      </div>

    </footer>
  );
}