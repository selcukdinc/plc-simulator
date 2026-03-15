import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: var(--color-button-bg);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  height: 100%;
  width: 100%;
  gap: 0.15rem;
  padding: 0.25rem 0.1rem 0.2rem;
  box-sizing: border-box;
  transition: background var(--transition-fast);
  &:hover {
    background: var(--color-button-hover);
  }
`;
const IconWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 0;
`;
const Label = styled.span`
  font-size: 0.56rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  line-height: 1.1;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 2px;
`;

interface Props {
  Svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  label?: string;
}

export default function ToolboxIcon({ Svg, label }: Props) {
  return (
    <Container>
      <IconWrapper>
        <Svg
          style={{
            filter: 'brightness(0) invert(1)',
            height: '65%',
            width: '65%',
            opacity: 0.85,
          }}
        />
      </IconWrapper>
      {label && <Label>{label}</Label>}
    </Container>
  );
}
