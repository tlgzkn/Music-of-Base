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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
        
        {status === 'signing' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-signature text-blue-400 text-2xl animate-pulse"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Signature Request</h3>
            <p className="text-slate-400 text-sm mb-6">
              Please sign the message in your wallet to confirm your vote for <span className="text-white font-semibold">{song.title}</span>.
            </p>
            <div className="flex justify-center">
              <div className="flex gap-2">
                 <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce delay-100"></div>
                 <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        {status === 'confirming' && (
           <div className="text-center">
             <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
               <i className="fas fa-circle-notch fa-spin text-yellow-400 text-2xl"></i>
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Confirming on Base</h3>
             <p className="text-slate-400 text-sm mb-6">
               Waiting for block confirmation...
             </p>
             <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
               <div className="bg-yellow-500 h-full w-2/3 animate-[loading_1s_ease-in-out_infinite]"></div>
             </div>
           </div>
        )}

        {status === 'success' && (
           <div className="text-center">
             <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
               <i className="fas fa-check text-green-400 text-2xl"></i>
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Vote Cast!</h3>
             <p className="text-slate-400 text-sm mb-6">
               You successfully voted for {song.title}.
             </p>
             <button 
               onClick={onClose}
               className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors"
             >
               Close
             </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default TransactionModal;
