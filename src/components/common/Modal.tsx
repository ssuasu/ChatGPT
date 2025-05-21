// src/components/Modal.tsx
import React from 'react';
import styled from 'styled-components';
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  //background: rgba(0, 0, 0, 0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 999;
`;

const ModalContainer = styled.div<{ isOpen: boolean }>`
  position: relative;   //닫기 버튼을 이 기준으로 absolute 위치
  background: white;
  padding: 2rem;
  border-radius: 12px;
  min-width: 300px;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
  
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(50px)')};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
`;

const CloseButton = styled.button`
  position: absolute; 
  top: 1rem; 
  right: 1rem;
  //margin-top: 1rem;
  background: none;
  border: none;
  color:rgb(88, 88, 88);
  cursor: pointer;
  font-size: 0.9rem;
  z-index: 10;

  &:hover{
    background: #efefef;
  }
`;

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer isOpen={isOpen} onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}><IoMdClose/></CloseButton>
        {children}
      </ModalContainer>
    </Overlay>
  );
};
