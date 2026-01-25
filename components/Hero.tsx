
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-black text-white rounded-[2rem] p-12 md:p-20 shadow-2xl mb-12">
      <div className="max-w-4xl relative z-10">
        <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-white/20">
          The Official Ranking
        </span>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1]">
          Elegance, Defined by <br/>
          <span className="italic">the Audience.</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed font-light">
          An elite gallery where the world’s most impactful visuals are curated by Gemini AI and ranked live by global engagement.
        </p>
        <div className="flex items-center gap-12 border-t border-white/10 pt-8">
          <div>
            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Active Profiles</span>
            <span className="text-2xl font-serif italic">Global Top 40</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Metric</span>
            <span className="text-2xl font-serif italic">View Engagement</span>
          </div>
        </div>
      </div>
      <div className="absolute right-0 top-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute right-[10%] top-[10%] w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute right-[20%] bottom-[10%] w-64 h-64 bg-purple-500 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
};

export default Hero;
