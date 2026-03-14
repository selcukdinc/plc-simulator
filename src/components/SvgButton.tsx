import React from "react";
import styled from "styled-components";
import { Tooltip } from "@mui/material";

const Square = styled.div`
  margin: 0.25rem;
  position: relative;
  width: 4rem;
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
  transition: filter var(--transition-fast);
  width: 100%;
  &:hover {
    filter: brightness(1.1);
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
  const { color, disabled, onClick, Svg, title } = props;

  return (
    <Tooltip title={title ?? ''} placement="bottom" arrow disableHoverListener={!title}>
      <Square onClick={disabled ? undefined : onClick}>
        <SvgContainer>
          <Svg
            style={{
              fill: color,
              height: "80%",
              margin: "auto",
              opacity: disabled ? "0.2" : "0.8",
              width: "80%",
            }}
          />
        </SvgContainer>
      </Square>
    </Tooltip>
  );
};

export default SvgButton;
