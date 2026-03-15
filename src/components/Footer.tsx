import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Store } from '../interface';

const Bar = styled.div`
  background: var(--color-bg-footer);
  bottom: 0;
  display: flex;
  grid-area: footer;
  height: 1.9rem;
  justify-content: space-between;
  align-items: center;
  left: 0;
  position: relative;
  right: 0;
  padding: 0 0.75rem;
  gap: 1rem;
`;
const StatusGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-footer-text);
`;
const StatusLabel = styled.span`
  opacity: 0.55;
`;
const StatusDot = styled.span<{ running: boolean }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => props.running ? 'var(--color-status-running)' : 'var(--color-status-stopped)'};
  box-shadow: 0 0 0 2px ${(props) => props.running ? 'rgba(47,158,68,0.3)' : 'rgba(224,49,49,0.3)'};
`;
const InfoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid var(--color-footer-text);
  font-size: 0.6rem;
  font-style: italic;
  font-weight: 700;
  opacity: 0.55;
  line-height: 1;
`;
const Attribution = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.65rem;
  color: var(--color-footer-text);
  opacity: 0.45;
  white-space: nowrap;
  a {
    color: inherit;
    text-decoration: none;
    &:hover { opacity: 0.8; text-decoration: underline; }
  }
`;
const Separator = styled.span`
  opacity: 0.5;
`;

const CenterLinks = styled(Attribution)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  @media (max-width: 1000px) {
    display: none;
  }
`;

type Props = {
  mobileUI: boolean;
};

export default function Footer({ mobileUI }: Props) {
  const simulation = useSelector((state: Store) => state.temp.simulation);
  const variables = useSelector((state: Store) => state.variables);

  const inputCount = Object.values(variables).filter(
    (v) => !v.parrent && v.address && v.address.startsWith('I')
  ).length;
  const outputCount = Object.values(variables).filter(
    (v) => !v.parrent && v.address && v.address.startsWith('Q')
  ).length;

  return (
    <Bar>
      <StatusGroup>
        <StatusItem>
          <StatusLabel>System Status:</StatusLabel>
          <StatusDot running={simulation} />
          <span style={{ color: simulation ? 'var(--color-status-running)' : 'var(--color-status-stopped)' }}>
            {simulation ? 'RUNNING' : 'STOPPED'}
          </span>
        </StatusItem>
        {!mobileUI && (
          <StatusItem>
            <StatusLabel>I/O Status:</StatusLabel>
            <span>{inputCount} Input, {outputCount} Output</span>
            <InfoIcon>i</InfoIcon>
          </StatusItem>
        )}
      </StatusGroup>
      {!mobileUI && (
        <>
          <CenterLinks>
            <a href="https://www.codingplc.com/" target="_blank" rel="noopener noreferrer">© CodingPLC</a>
            <Separator>·</Separator>
            <a href="https://github.com/codingplc/plc-simulator" target="_blank" rel="noopener noreferrer">Original Project</a>
            <Separator>·</Separator>
            <a href="https://app.plcsimulator.online" target="_blank" rel="noopener noreferrer">Original Site</a>
          </CenterLinks>
          <Attribution>
            <a href="https://github.com/selcukdinc/plc-simulator" target="_blank" rel="noopener noreferrer">Fork by selcukdinc</a>
            <Separator>·</Separator>
            <a href="https://devloop.com.tr" target="_blank" rel="noopener noreferrer">devloop.com.tr</a>
            <Separator>·</Separator>
            <span>Version 1.0.2</span>
          </Attribution>
        </>
      )}
    </Bar>
  );
}
