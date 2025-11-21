import React from 'react';
import { Song, VoteStatus } from '../types';

interface TransactionModalProps {
  song: Song | null;
  status: VoteStatus;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ song, status, onClose }) => {
  if (!song || status === 'idle') return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300">
      <div className="w-full max-w-md bg-slate-900/90 border border-white/10 rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300 relative overflow-hidden">
        
        {/* Background blobs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {status === 'signing' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-blue-500/30">
                <i className="fas fa-signature text-blue-400 text-3xl animate-pulse"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Signature Request</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Please check your wallet to sign the vote for <br/>
                <span className="text-white font-bold text-lg">{song.title}</span>
              </p>
              <div className="flex justify-center gap-2">
                 <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></div>
                 <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}

          {status === 'confirming' && (
             <div className="text-center">
               <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-yellow-500/30">
                 <i className="fas fa-cube fa-spin text-yellow-400 text-3xl"></i>
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">Confirming...</h3>
               <p className="text-slate-400 text-sm mb-8">
                 Wait while the blockchain records your vote.
               </p>
               <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
                 <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full w-2/3 animate-[loading_1s_ease-in-out_infinite] rounded-full"></div>
               </div>
             </div>
          )}

          {status === 'success' && (
             <div className="text-center">
               <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-green-500/30">
                 <i className="fas fa-check text-green-400 text-3xl scale-0 animate-[zoomIn_0.3s_ease-out_forwards]"></i>
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">Vote Recorded!</h3>
               <p className="text-slate-400 text-sm mb-8">
                 Your voice has been heard on Base.
               </p>
               <button 
                 onClick={onClose}
                 className="w-full py-4 bg-white hover:bg-blue-50 text-slate-900 rounded-2xl font-bold transition-colors shadow-lg shadow-white/10 active:scale-95"
               >
                 Continue
               </button>
             </div>
          )}
          
          {status === 'error' && (
             <div className="text-center">
               <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-red-500/30">
                 <i className="fas fa-exclamation-triangle text-red-400 text-3xl"></i>
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">Transaction Failed</h3>
               <p className="text-slate-400 text-sm mb-8">
                 Something went wrong. Please try again.
               </p>
               <button 
                 onClick={onClose}
                 className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-colors"
               >
                 Close
               </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;