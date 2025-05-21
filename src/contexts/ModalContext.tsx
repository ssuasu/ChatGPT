// src/contexts/ModalContext.tsx
import React, { createContext, useContext, useState } from 'react';
import Modal from '../components/common/Modal'



const ModalContext = createContext<{
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
} | null>(null);

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('ModalProvider 내부에서 사용해야 함');
  return ctx;
};

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<React.ReactNode>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (c: React.ReactNode) => {
    setContent(c);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setContent(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal isOpen={isOpen} onClose={closeModal}>
        {content}
      </Modal>
    </ModalContext.Provider>
  );
};
