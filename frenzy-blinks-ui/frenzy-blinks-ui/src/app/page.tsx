export default function Home() {
  return (
    // Fundo cartunesco (amarelo vibrante) para dar o contraste bizarro do Smiling Friends
    <main className="relative min-h-screen w-full overflow-hidden bg-[#FFD700] font-sans text-black selection:bg-[#9945FF] selection:text-white">
      
      {/* CAMADA 1: O Palco do Monstrinho (Z-index 0) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-80">
        {/* TODO: Suas 3 imagens PNG vão entrar aqui. 
            Exemplo da tag que vamos usar:
            <img src="/monstrinho-1.png" className="absolute w-[800px] object-contain transition-transform duration-1000" /> 
        */}
        
        {/* Um grid tosco e grosso no fundo para reforçar o estilo 2D Flat */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000022_2px,transparent_2px),linear-gradient(to_bottom,#00000022_2px,transparent_2px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* CAMADA 2: A Interface Brutalista 2D (Z-index 10) */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 text-center">
        
        {/* Título com Borda Grossa (Stroke) e Sombra Sólida Solana-Purple */}
        <h1 
          className="mb-8 text-7xl font-black uppercase tracking-tighter sm:text-[9rem] leading-none" 
          style={{ 
            WebkitTextStroke: '6px black', 
            color: '#14F195', // Verde Solana
            textShadow: '12px 12px 0px #9945FF' // Roxo Solana
          }}
        >
          FRENZY
          <br />
          <span className="text-white" style={{ WebkitTextStroke: '6px black' }}>
            PROTOCOL
          </span>
        </h1>

        {/* Copy Matadora com fundo de alto contraste */}
        <div className="mb-12 border-4 border-black bg-white px-8 py-4 shadow-[8px_8px_0px_#000000] rotate-[-2deg]">
          <p className="text-2xl font-black uppercase leading-relaxed text-black sm:text-4xl">
            50% Peace of Mind. <br className="hidden sm:block" />
            50% Full Throttle.
          </p>
        </div>

        {/* Botão de Ação: Estilo Cartoon (Hover insano, Sombra Dura) */}
        <div className="flex flex-col gap-6 sm:flex-row">
          <a 
            href="#" 
            className="group relative border-8 border-black bg-[#14F195] px-12 py-6 text-3xl font-black uppercase tracking-widest text-black transition-all hover:-translate-y-3 hover:translate-x-[-3px] hover:bg-[#9945FF] hover:text-white shadow-[12px_12px_0px_#000000]"
          >
            Enter the Vault
          </a>
        </div>

        {/* Rodapé Tosco e Honesto */}
        <div className="mt-20 border-t-8 border-black w-full max-w-4xl pt-8">
          <p className="text-lg font-black tracking-widest text-black uppercase bg-white inline-block px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000000] rotate-[1deg]">
            No AI has access to your keys. Jito MEV-Protected.
          </p>
        </div>
      </div>
    </main>
  );
}