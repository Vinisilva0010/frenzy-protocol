"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  
  { name: "ENTER VAULT", href: "/demo" },
  { name: "PORTFOLIO", href: "/dashboard" },
  { name: "GLOBAL STATS", href: "/analytics" },
  
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Efeito para detectar scroll e dar feedback visual na navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav 
      className={`fixed top-0 w-full z-[1000] transition-all duration-300 border-b-[4px] border-black ${
        scrolled ? "bg-[#9945FF] py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO FRENZY */}
        <a href="#hero" className="flex items-center gap-2 group">
          <span 
            className="text-4xl md:text-5xl font-black tracking-tighter text-black uppercase"
            style={{ 
              fontFamily: "var(--font-bebas)",
              WebkitTextStroke: "1px #fff",
              textShadow: "3px 3px 0px #000"
            }}
          >
            FRENZY
          </span>
        </a>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              className="font-mono text-sm font-black text-black uppercase hover:text-white transition-colors tracking-widest"
            >
              {link.name}
            </a>
          ))}
          
          {/* BOTÕES DE AÇÃO BRUTALISTAS */}
          <div className="flex items-center gap-4 ml-4">
            <a 
              href="/docs" 
              className="bg-white border-4 border-black px-4 py-2 text-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              CONSERVATIVE
               YIELD
            </a>
            <a 
              href="/whitepaper" 
              className="bg-white border-4 border-black px-4 py-2 text-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              DOCS
            </a>
            <a 
              href="/security" 
              className="bg-[#14F195] border-4 border-black px-4 py-2 text-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              security 
            </a>
          </div>
        </div>

        {/* MOBILE MENU BUTTON (HAMBURGER) */}
        <button 
          onClick={toggleMenu}
          className="lg:hidden w-12 h-12 border-4 border-black bg-[#14F195] flex flex-col items-center justify-center gap-1.5 shadow-[4px_4px_0px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
        >
          <span className={`w-7 h-1 bg-black transition-all ${isOpen ? "rotate-45 translate-y-2.5" : ""}`} />
          <span className={`w-7 h-1 bg-black transition-all ${isOpen ? "opacity-0" : ""}`} />
          <span className={`w-7 h-1 bg-black transition-all ${isOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
        </button>
      </div>

      {/* MOBILE OVERLAY MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[999] bg-[#9945FF] flex flex-col items-center justify-center gap-8 p-10 lg:hidden border-l-[8px] border-black"
          >
            {/* Fechar no Mobile */}
            <button onClick={toggleMenu} className="absolute top-8 right-8 text-black font-black text-4xl">
              [ X ]
            </button>

            {NAV_LINKS.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                onClick={toggleMenu}
                className="text-5xl md:text-6xl font-black text-black uppercase tracking-tighter hover:text-white"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                {link.name}
              </a>
            ))}

            <div className="flex flex-col w-full gap-4 mt-10">
              <a href="/docs" className="bg-white border-4 border-black p-6 text-center text-black font-black text-2xl uppercase shadow-[8px_8px_0px_0px_#000]">
                DOCUMENTATION
              </a>
              <a href="#contract" className="bg-[#14F195] border-4 border-black p-6 text-center text-black font-black text-2xl uppercase shadow-[8px_8px_0px_0px_#000]">
                VIEW CONTRACT
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}