import React from "react";
import styled from "styled-components";
import { Tooltip } from "@mui/material";

const Square = styled.div`
  margin: 0.2rem 0.15rem;
  position: relative;
  width: 3.5rem;
  &::after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`;
const SvgContainer = styled.div`
  background: var(--color-button-bg);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  position: absolute;
  height: 100%;
  transition: background var(--transition-fast);
  width: 100%;
  &:hover {
    background: var(--color-button-hover);
  }
`;

interface Props {
  color?: string;
  disabled?: boolean;
  onClick: () => void;
  Svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  title?: string;
}

const SvgButton: React.FC<Props> = (props: Props) => {
  const { disabled, onClick, Svg, title } = props;

  return (
    <Tooltip title={title ?? ''} placement="bottom" arrow disableHoverListener={!title}>
      <Square onClick={disabled ? undefined : onClick}>
        <SvgContainer>
          <Svg
            style={{
              filter: 'brightness(0) invert(1)',
              height: "70%",
              margin: "auto",
              opacity: disabled ? "0.25" : "0.85",
              width: "70%",
            }}
          />
        </SvgContainer>
      </Square>
    </Tooltip>
  );
};

export default SvgButton;
