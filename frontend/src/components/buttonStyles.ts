export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:translate-y-0";

export const primaryButton = `${buttonBase} bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0`;

export const secondaryButton = `${buttonBase} bg-slate-900 text-slate-50 shadow-md hover:-translate-y-0.5 active:translate-y-0`;
