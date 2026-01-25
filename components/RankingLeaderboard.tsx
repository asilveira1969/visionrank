
import React from 'react';
import { BlogImage } from '../types';

interface RankingLeaderboardProps {
  images: BlogImage[];
}

const RankingLeaderboard: React.FC<RankingLeaderboardProps> = ({ images }) => {
  return (
    <div className="space-y-8">
      <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">The Hot List</h3>
        <div className="space-y-6">
          {images.length === 0 ? (
            <div className="py-12 text-center text-gray-400 italic font-serif text-sm">Awaiting entries...</div>
          ) : (
            images.map((img, idx) => (
              <div key={img.id} className="group flex items-center gap-5">
                <div className="relative">
                  <span className={`text-4xl font-serif font-bold italic transition-colors ${
                    idx === 0 ? 'text-black' : 'text-gray-200 group-hover:text-gray-400'
                  }`}>
                    {idx + 1}
                  </span>
                </div>
                <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 shadow-sm transition-transform group-hover:scale-105">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate tracking-tight">{img.title}</h4>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{img.views.toLocaleString()} Views</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-black text-white rounded-[2rem] p-8 shadow-xl">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Vision Stat</h3>
        <div className="space-y-1">
          <p className="text-3xl font-serif italic leading-none">Popularity</p>
          <p className="text-gray-400 text-sm font-light">Real-time engagement analysis enabled.</p>
        </div>
      </div>
    </div>
  );
};

export default RankingLeaderboard;
