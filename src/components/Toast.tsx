import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import { setToastMessage } from '../store/uiSlice.ts';

export const Toast: React.FC = () => {
  const dispatch = useAppDispatch();
  const { toastMessage } = useAppSelector((state) => state.ui);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        dispatch(setToastMessage(null));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, dispatch]);

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-fade-in flex items-center gap-3 bg-slate-900/95 dark:bg-slate-800/95 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-md">
      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
      </div>
      <p className="text-xs font-semibold leading-relaxed pr-2">{toastMessage}</p>
      <button
        onClick={() => dispatch(setToastMessage(null))}
        className="text-slate-400 hover:text-white transition ml-auto"
        aria-label="Dismiss notification"
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
};
