import React from "react";
import styled from "styled-components";
import { Tooltip } from "@mui/material";

const Square = styled.div`
  margin: 0.15rem 0.1rem;
  position: relative;
  width: 2.8rem;
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
  enabled: boolean;
  onClick: () => void;
  Svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  title?: string;
}

const ActionButton: React.FC<Props> = (props: Props) => {
  const { enabled, onClick, Svg, title } = props;

  return (
    <Tooltip title={title ?? ''} placement="bottom" arrow disableHoverListener={!title}>
      <Square onClick={enabled ? onClick : undefined}>
        <SvgContainer>
          <Svg
            style={{
              filter: 'brightness(0) invert(1)',
              height: "70%",
              margin: "auto",
              opacity: enabled ? "0.85" : "0.2",
              width: "70%",
            }}
          />
        </SvgContainer>
      </Square>
    </Tooltip>
  );
};

export default ActionButton;
