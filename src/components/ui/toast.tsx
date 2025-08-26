import React from 'react';

interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

export const ToastViewport = () => {
  return <div className="fixed top-0 right-0 z-50 p-4" />;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const Toaster = () => {
  return <ToastViewport />;
};