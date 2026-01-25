
import React from 'react';

interface HeaderProps {
  isAdmin: boolean;
  onUploadClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onUploadClick }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-serif font-black tracking-tighter text-black">
            VISION<span className="font-light italic">RANK</span>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-black text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded">
                Curator
              </span>
              <div className="flex items-center gap-1.5 ml-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">System Live</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-gray-400">
            <a href="#" className="text-black">Home</a>
            <a href="#" className="hover:text-black transition-colors">Archive</a>
            <a href="#" className="hover:text-black transition-colors">Top 40</a>
          </div>
          {isAdmin && (
            <button 
              onClick={onUploadClick}
              className="px-6 py-2.5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.15em] rounded-full hover:bg-gray-800 transition-all shadow-lg active:scale-95"
            >
              New Entry
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
