
import React, { useState, useRef } from 'react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
  isAnalyzing: boolean;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload, isAnalyzing }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setSelectedFiles(files);
    Promise.all(
      files.map(file => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      }))
    ).then(results => setPreviews(results));
  };

  const handleConfirm = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 overflow-hidden border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif font-bold italic text-gray-900">New Profile Entry</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {previews.length === 0 ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-100 rounded-[2rem] p-16 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all group"
          >
            <div className="w-16 h-16 bg-gray-50 text-black rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-900">Select Portrait</p>
            <p className="text-[10px] font-bold text-gray-400 mt-2 tracking-widest uppercase">Editorial Standard Required</p>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              accept="image/*" 
              multiple
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-inner relative">
              <img src={previews[0]} alt="Preview" className="w-full h-full object-cover" />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center text-black p-10 text-center">
                   <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin mb-6"></div>
                   <p className="text-[11px] font-bold uppercase tracking-[0.2em]">Curation AI is generating Profile Identity...</p>
                </div>
              )}
            </div>

            {previews.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {previews.slice(0, 5).map((preview, idx) => (
                  <div key={`${preview}-${idx}`} className="aspect-square rounded-xl overflow-hidden border border-gray-100">
                    <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                {previews.length > 5 && (
                  <div className="aspect-square rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">+{previews.length - 5}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex gap-4">
              <button 
                onClick={() => { setPreviews([]); setSelectedFiles([]); }}
                className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                disabled={isAnalyzing}
              >
                Retake
              </button>
              <button 
                onClick={handleConfirm}
                disabled={isAnalyzing}
                className="flex-[2] py-4 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-gray-800 shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                Confirm Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadModal;
