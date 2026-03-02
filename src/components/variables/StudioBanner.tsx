import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import { BORDER_SIZE } from "../../consts/variableTableStyles";
import { VAR_TABLE_BORDER } from "../../consts/colors";

import ladderImg from "../../images/ladder-logic-editor.png";
import simulationImg from "../../images/real-time-simulation.png";
import saveImg from "../../images/save-project-locally.png";
import stImg from "../../images/structured-text-editor.png";
import trendsImg from "../../images/trends-input-outputs.png";

const SLIDES = [
  { src: ladderImg, feature: "Ladder Logic Editor" },
  { src: stImg, feature: "Structured Text Editor" },
  { src: simulationImg, feature: "Real-Time Simulation" },
  { src: trendsImg, feature: "Trends & I/O Monitoring" },
  { src: saveImg, feature: "Save Projects Locally" },
];

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const Container = styled.div`
  position: relative;
`;
const Wrapper = styled.a`
  display: flex;
  border-top: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  text-decoration: none;
  overflow: hidden;
  aspect-ratio: 4 / 1;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  container-type: size;

  :hover .cta {
    background: #2563eb;
  }
`;
const Left = styled.div`
  width: 50%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4% 3%;
  gap: 8%;
  overflow: hidden;
`;
const Heading = styled.span`
  font-size: 3.6cqi;
  font-weight: 800;
  color: #f1f5f9;
  line-height: 1.2;
  text-align: center;
`;
const CTA = styled.span`
  display: inline-block;
  padding: 3% 6%;
  border-radius: 5px;
  background: #3b82f6;
  color: #fff;
  font-size: 3.1cqi;
  font-weight: 700;
  letter-spacing: 0.02em;
  transition: background 150ms ease;
  white-space: nowrap;
`;
const Right = styled.div`
  width: 50%;
  position: relative;
  overflow: hidden;
`;
const Feature = styled.span`
  font-size: 3.6cqi;
  font-weight: 700;
  color: #93c5fd;
  line-height: 1.2;
  text-align: center;
`;
const SlideImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  animation: ${fadeIn} 0.5s ease both;
`;

const DISMISS_KEY = "studio-banner-dismissed";
const DISMISS_DAYS = 7;
const DISMISS_WINDOW_MS = DISMISS_DAYS * 86_400_000;

const isDismissed = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const storage = window.localStorage;
    const ts = storage.getItem(DISMISS_KEY);
    if (!ts) return false;
    return Date.now() - Number(ts) < DISMISS_WINDOW_MS;
  } catch {
    return false;
  }
};

const setDismissedTimestamp = (): void => {
  if (typeof window === "undefined") return;
  try {
    const storage = window.localStorage;
    storage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // Ignore storage failures (privacy mode / restricted environments).
  }
};

const CloseBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 6px;
  background: rgba(15, 23, 42, 0.7);
  border: none;
  color: #94a3b8;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  z-index: 1;
  padding: 3px 5px;
  border-radius: 6px;
  &:hover {
    background: rgba(15, 23, 42, 0.85);
    color: #cbd5e1;
  }
`;

const StudioBanner: React.FC = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [dismissed, setDismissed] = useState(() => isDismissed());

  useEffect(() => {
    if (dismissed) return;
    const timer = setInterval(() => {
      setSlideIndex((i) => (i + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <Container>
      <Wrapper
        href="https://studio.rungs.dev"
        target="_blank"
        rel="noopener"
        aria-label="open the new PLC simulator at studio.rungs.dev"
      >
        <Left>
          <Feature>{SLIDES[slideIndex].feature}</Feature>
          <Heading>Try new features</Heading>
          <CTA className="cta">open studio.rungs.dev &rarr;</CTA>
        </Left>
        <Right>
          <SlideImg key={slideIndex} src={SLIDES[slideIndex].src} alt={SLIDES[slideIndex].feature} />
        </Right>
      </Wrapper>
      <CloseBtn
        aria-label="Dismiss banner"
        onClick={() => {
          setDismissedTimestamp();
          setDismissed(true);
        }}
      >
        ✕
      </CloseBtn>
    </Container>
  );
};

export default StudioBanner;
