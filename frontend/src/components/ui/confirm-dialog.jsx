import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({ title, message, onConfirm, onCancel, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-xl border border-slate-200 p-6 m-4 scale-100 animate-in zoom-in-95 duration-200"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-desc"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
               <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
             </div>
             <div>
                <h2 id="dialog-title" className="text-lg font-semibold text-slate-900">
                  {title}
                </h2>
                <p id="dialog-desc" className="text-sm text-slate-500 mt-1">
                  {message}
                </p>
             </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-500 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper function to render the dialog programmatically
export const confirm = ({ title, message }) => {
  return new Promise((resolve) => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = createRoot(div);

    const cleanup = () => {
      root.unmount();
      if (div.parentNode) {
        div.parentNode.removeChild(div);
      }
    };

    const handleConfirm = () => {
      cleanup();
      resolve(true);
    };

    const handleCancel = () => {
      cleanup();
      resolve(false);
    };

    root.render(
      <ConfirmDialog
        isOpen={true}
        title={title}
        message={message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );
  });
};
