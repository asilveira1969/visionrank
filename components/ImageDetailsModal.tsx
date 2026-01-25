
import React from 'react';
import { BlogImage } from '../types';

interface ImageDetailsModalProps {
  image: BlogImage;
  isAdmin: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const ImageDetailsModal: React.FC<ImageDetailsModalProps> = ({ image, isAdmin, onClose, onDelete }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-6xl h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-white/10">
        <div className="flex-grow bg-gray-50 flex items-center justify-center relative overflow-hidden">
          <img 
            src={image.url} 
            alt={image.title} 
            className="w-full h-full object-cover lg:object-contain transition-transform duration-1000"
          />
          <button 
            onClick={onClose} 
            className="absolute top-8 left-8 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-xl rounded-full text-white transition-all lg:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        
        <div className="w-full lg:w-[450px] bg-white p-10 flex flex-col h-full overflow-y-auto border-l border-gray-50">
          <div className="flex justify-between items-start mb-10">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-6 bg-gray-200"></span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{image.category}</span>
              </div>
              <h2 className="text-4xl font-serif font-bold italic text-black leading-tight">{image.title}</h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-3 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hidden lg:block"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="p-6 bg-gray-50 rounded-[1.5rem] border border-gray-100">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Rank</p>
              <p className="text-3xl font-serif font-black text-black">#{image.rank}</p>
            </div>
            <div className="p-6 bg-black rounded-[1.5rem] shadow-xl">
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Views</p>
              <p className="text-3xl font-serif font-black text-white">{image.views.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="space-y-8 flex-grow">
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Story Context</h3>
              <p className="text-gray-600 font-light leading-relaxed italic text-lg">
                "{image.description}"
              </p>
            </div>
            
            <div className="pt-8 border-t border-gray-50 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Timestamp</span>
                <span className="text-gray-900">{new Date(image.uploadedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Curation Engine</span>
                <span className="text-gray-900 italic font-serif">VisionRank AI</span>
              </div>
            </div>
          </div>
          
          {isAdmin && (
            <div className="mt-12 pt-8 border-t border-gray-50">
              <button 
                onClick={onDelete}
                className="w-full py-4 text-[11px] text-red-500 font-bold uppercase tracking-widest border border-red-50 hover:bg-red-50 rounded-full transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Permanently Archive
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageDetailsModal;
