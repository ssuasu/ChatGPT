import React from "react";
import styled from "styled-components";

// --- Props 정의 ---
interface ButtonProps {
  icon?: React.ReactNode;
  label?: string;
  border?: boolean;
  borderRadius?: string;
  hoverColor?: string;
  description?: string;
  descriptionPosition?:  "top" | "bottom" | "left" | "right";
  onClick?: () => void;
  opacity?: number;
  fontsize? : string;
}

const Description = styled.div<{ position: string }>`
  position: absolute;
  background-color: black;
  color: white;
  padding: 0.2rem 0.4rem;
  font-size: 0.75rem;
  border-radius: 0.5rem;
  opacity: 0;
  transition: opacity 0.1s ease;
  white-space: nowrap;
  font-weight:bold;
  z-index: 1000;

  ${({ position }) => {
    switch (position) {
      case "top":
        return `bottom: 100%; margin-bottom: 0.4rem; left: 50%; transform: translateX(-50%);`;
      case "left":
        return `top: 100%; margin-top: 0.4rem; left: 0;`;
      case "right":
        return `top: 100%; margin-top: 0.4rem; right: 0;`;
      case "bottom":
      default:
        return `top: 100%; margin-top: 0.4rem; left: 50%; transform: translateX(-50%);`;
    }
  }}
`;

// 부모 
const ButtonWrapper = styled.div<{hoverColor:string}>`
  display: inline-flex;
  flex-direction: column;   //버튼과 버튼 설명을 위한 세로 정렬.
  align-items: start;
  position: relative;

  //ButtonWrapper 안의 버튼 요소가 hover 됐을 때
  //buttonWrapper 안의 div 요소의 opacity를 1로 바꿈.
  &:has(button:hover) div {
    opacity: 1;
  }
`;
// 자식 
const StyledButton = styled.button<{
  border: boolean;
  borderRadius: string;
  hoverColor: string;
  haslabel: boolean;
  opacity: number;
  fontsize: string;
}>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background-color: transparent;
  border: ${(props) => (props.border ? "1px solid #ccc" : "none")};
  border-radius: ${(props) => props.borderRadius};
  padding: ${(props) => (props.haslabel ? "0.5rem 0.7rem":"0.6rem")};
  opacity: ${(props)=> props.opacity ?? 1 };
  cursor: pointer;
  font-size: ${(props)=> props.fontsize?? "14px" };
  white-space: nowrap;


  &:hover {
    background-color: ${(props) => props.hoverColor};
    border: 1px solid #ccc;
  }

  &:focus {
    outline: none; 
  }
`;

// --- 컴포넌트 ---
const Button: React.FC<ButtonProps> = ({
  icon,
  label,
  border = false,
  borderRadius = "9999px",
  hoverColor = "#f0f0f0",
  description,
  descriptionPosition="bottom",
  onClick,
  opacity=1,
  fontsize="14px",
}) => {
  return (
    <ButtonWrapper hoverColor={hoverColor}>
      {description && 
        <Description position={descriptionPosition}>
        {description}
        </Description>}
      <StyledButton
        border={border}
        borderRadius={borderRadius}
        hoverColor={hoverColor}
        haslabel={!!label}
        onClick={onClick}
        opacity={opacity}
        fontsize={fontsize}
      >
        {icon}
        {label && <span>{label}</span>}
      </StyledButton>
    </ButtonWrapper>
  );
};

export default Button;
