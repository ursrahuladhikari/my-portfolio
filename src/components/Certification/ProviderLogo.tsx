import React from 'react';

export const ProviderLogo: React.FC<{ type: string; className?: string }> = ({ type, className = 'w-6 h-6' }) => {
  switch (type) {
    case 'google':
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      );
    case 'microsoft':
      return (
        <svg viewBox="0 0 23 23" className={className}>
          <rect x="0" y="0" width="11" height="11" fill="#F25022" />
          <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
          <rect x="0" y="12" width="11" height="11" fill="#00A4EF" />
          <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
        </svg>
      );
    case 'oracle':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#F80000">
          <path d="M12 4C5.37 4 0 7.58 0 12s5.37 8 12 8 12-3.58 12-8-5.37-8-12-8zm0 12.8c-3.98 0-7.2-2.15-7.2-4.8s3.22-4.8 7.2-4.8 7.2 2.15 7.2 4.8-3.22 4.8-7.2 4.8z" />
        </svg>
      );
    case 'ibm':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#0062FF">
          {/* I */}
          <rect x="2" y="4" width="3" height="16" />
          {/* B */}
          <path d="M7 4h5a4 4 0 0 1 0 8H7v-8zm0 8h5a4 4 0 0 1 0 8H7v-8z" />
          {/* M */}
          <path d="M14 20V4h3l2 5 2-5h3v16h-3V8l-2 5-2-5v12h-3z" />
          {/* 8-bar horizontal background cutouts to represent IBM striped logo */}
          <line x1="1" y1="6" x2="23" y2="6" stroke="#081221" strokeWidth="1" />
          <line x1="1" y1="9" x2="23" y2="9" stroke="#081221" strokeWidth="1" />
          <line x1="1" y1="12" x2="23" y2="12" stroke="#081221" strokeWidth="1" />
          <line x1="1" y1="15" x2="23" y2="15" stroke="#081221" strokeWidth="1" />
          <line x1="1" y1="18" x2="23" y2="18" stroke="#081221" strokeWidth="1" />
        </svg>
      );
    case 'mongodb':
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path fill="#4DB33D" d="M12 1.5c-.3 0-.6.1-.9.3C8.4 4.5 7 8 7 11.5c0 3.3 1.2 6 3.5 7.5.3.2.7.4 1 .5v2.5c0 .3.2.5.5.5s.5-.2.5-.5V19.5c.3-.1.7-.3 1-.5 2.3-1.5 3.5-4.2 3.5-7.5 0-3.5-1.4-7-4.1-9.7-.3-.2-.6-.3-.9-.3zm0 2.5c1.8 2.2 2.8 4.8 2.8 7.5 0 2.5-.8 4.6-2.3 5.7V4c-.2 0-.3 0-.5 0zm-.5 0v11.7c-1.5-1.1-2.3-3.2-2.3-5.7 0-2.7 1-5.3 2.8-7.5.1 0 .2.1.2.3c-.3.4-.6.9-.7 1.2z" />
        </svg>
      );
    case 'umich':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#FFCB05">
          <path d="M1.6 2h5.5l4.9 10.3L16.9 2h5.5v20h-4.9V7.6L12.5 18h-1L6.5 7.6V22H1.6V2z" />
        </svg>
      );
    case 'ucolorado':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#CFB87C">
          <path d="M8 6h8v2.5H11v7h5V18H8V6zm10 0h2.5v9a3 3 0 0 1-6 0V12h2.5v3a.5.5 0 0 0 1 0V6z" />
        </svg>
      );
    case 'skillup':
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#06b6d4" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      );
  }
};
