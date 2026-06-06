import React from 'react';

export default function CliXLusterLogo() {
  return (
    <div className="flex flex-col items-center justify-center select-none cursor-default group py-4 px-6">
      
      {/* Main Logo Text Row */}
      <div className="flex items-center font-sans">
        
        {/* CLI Part - Vibrant Neon Purple/Fuchsia */}
        <span className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 drop-shadow-sm">
          CLI
        </span>

        {/* XL Part - Sharp, Energetic, Unchanged */}
        <span 
          className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-blue-500 via-cyan-400 to-red-600 px-1.5 transition-transform duration-300 group-hover:scale-105"
          style={{ 
            filter: "drop-shadow(0px 0px 8px rgba(220, 38, 38, 0.5))",
            transform: "skewX(-15deg)"
          }}
        >
          XL
        </span>

        {/* USTER Part - Vibrant Indigo/Teal */}
        <span className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-l from-indigo-500 to-cyan-400 drop-shadow-sm">
          USTER
        </span>
        
      </div>

      {/* Slogan Area */}
      <div className="mt-3 flex items-center gap-1.5 bg-[#0f172a] py-1.5 px-4 rounded-md border border-gray-800 transition-all duration-300 group-hover:border-fuchsia-900/50 group-hover:shadow-[0_0_15px_rgba(217,70,239,0.15)]">
        
        {/* JUST - Vibrant Pink/Rose */}
        <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400 tracking-[0.2em] uppercase">
          Just
        </span>
        
        {/* CLICK - Solid Cyan */}
        <span className="text-xs font-black text-cyan-400 tracking-[0.2em] uppercase">
          Click
        </span>
        
        {/* Mouse Cursor with Click Animation */}
        <div className="relative flex items-center justify-center ml-1 w-5 h-5">
          {/* The spreading "Click" ripple effect */}
          <span className="absolute w-4 h-4 bg-cyan-400/60 rounded-full animate-ping"></span>
          
          {/* The SVG Cursor */}
          <svg 
            className="w-3.5 h-3.5 text-cyan-400 relative z-10 animate-bounce" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            style={{ filter: "drop-shadow(0 0 5px rgba(34, 211, 238, 0.9))" }}
          >
            <path d="M4.5 3V17l4.33-4.33 3.76 8.83 2.12-0.9-3.76-8.83H17.5L4.5 3z"/>
          </svg>
        </div>
        
      </div>

    </div>
  );
}