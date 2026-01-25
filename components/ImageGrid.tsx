
import React from 'react';
import { BlogImage } from '../types';

interface ImageGridProps {
  images: BlogImage[];
  onImageClick: (id: string) => void;
  isLoading?: boolean;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageClick, isLoading }) => {
  if (images.length === 0 && !isLoading) {
    return (
      <div className="bg-gray-50 rounded-[2.5rem] border border-gray-100 py-40 flex flex-col items-center justify-center text-gray-300">
        <p className="text-3xl font-serif italic mb-4">No talent listed yet.</p>
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Awaiting editorial submissions</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-12">
      {isLoading && (
        <div className="aspect-[3/4] bg-gray-50 border border-gray-100 animate-pulse rounded-[2.5rem] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
            <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Identifying Talent...</span>
          </div>
        </div>
      )}
      {images.map((img) => (
        <div 
          key={img.id}
          onClick={() => onImageClick(img.id)}
          className="group cursor-pointer"
        >
          <div className="aspect-[3/4] relative overflow-hidden rounded-[2.5rem] bg-gray-50 border border-gray-100 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-black/10 group-hover:-translate-y-2">
            <img 
              src={img.url} 
              alt={`${img.title} profile`} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              loading="lazy"
            />
            
            <div className="absolute top-6 left-6 flex items-center justify-center w-12 h-12 bg-white/95 backdrop-blur-xl rounded-full text-black font-serif italic text-lg shadow-xl border border-white/50 transition-transform group-hover:scale-110">
              {img.rank}
            </div>

            <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md rounded-[1.5rem] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 border border-white/20">
              <span className="block text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-1">{img.country || 'International'}</span>
              <h3 className="text-xl font-serif font-bold text-black italic">{img.title}</h3>
            </div>
          </div>
          
          <div className="mt-8 px-4 text-center">
            <h3 className="text-2xl font-serif font-bold text-black group-hover:text-gray-500 transition-colors">
              {img.title}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">
              {img.country}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
