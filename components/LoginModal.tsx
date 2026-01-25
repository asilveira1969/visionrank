
import React, { useState } from 'react';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (password: string) => boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
        onClick={onClose}
      />
      
      <div className={`relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10 transform transition-all border border-gray-100 ${error ? 'animate-shake' : ''}`}>
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gray-50 text-black rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-serif font-bold italic text-black">Curator Access</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-3">Identity Verification Required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="System Password"
              className={`w-full px-6 py-4 bg-gray-50 border ${error ? 'border-red-500' : 'border-gray-100'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-all text-center font-bold tracking-widest`}
            />
            {error && <p className="text-[10px] text-red-500 mt-3 text-center font-bold uppercase tracking-widest">Unauthorized Access. Hint: admin</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-gray-800 shadow-xl transition-all active:scale-95"
          >
            Authenticate
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:text-black transition-colors"
          >
            Cancel Session
          </button>
        </form>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LoginModal;
