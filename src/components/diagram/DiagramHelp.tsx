import styled from 'styled-components';
import { OpenInNew } from '@mui/icons-material';
import { SlSocialYoutube } from 'react-icons/sl';
import { LuFileText } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { LOAD_SAMPLE } from '../../store/types';

const Overlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 2rem;
`;
const Card = styled.div`
  background: var(--color-bg-diagram);
  border: 1px solid var(--color-var-table-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  min-width: 280px;
`;
const Title = styled.h2`
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-element);
  margin: 0 0 0.5rem;
  text-align: center;
`;
const GuideButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.6rem 1rem;
  border: 1.5px solid var(--color-var-table-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-diagram);
  color: var(--color-element);
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: background var(--transition-fast), border-color var(--transition-fast);
  box-sizing: border-box;
  &:hover {
    border-color: var(--color-bg-var-header);
    background: var(--color-var-selected);
  }
  svg {
    flex-shrink: 0;
    opacity: 0.6;
    font-size: 1rem;
  }
`;
const LoadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.6rem 1rem;
  border: 1.5px solid var(--color-var-table-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-diagram);
  color: var(--color-element);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background var(--transition-fast), border-color var(--transition-fast);
  box-sizing: border-box;
  text-align: left;
  &:hover {
    border-color: var(--color-bg-var-header);
    background: var(--color-var-selected);
  }
  svg {
    flex-shrink: 0;
    opacity: 0.6;
    font-size: 1rem;
  }
`;

export default function DiagramHelp() {
  const dispatch = useDispatch();
  return (
    <Overlay>
      <Card>
        <Title>Getting Started Guide</Title>
        <GuideButton
          href="https://plcsimulator.online/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Read the Documentation</span>
          <OpenInNew fontSize="small" />
        </GuideButton>
        <GuideButton
          href="https://youtu.be/Cgd_Or1Mcac"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Watch Tutorial Video</span>
          <SlSocialYoutube />
        </GuideButton>
        <LoadButton onClick={() => dispatch({ type: LOAD_SAMPLE })}>
          <span>Load Sample Diagram</span>
          <LuFileText />
        </LoadButton>
      </Card>
    </Overlay>
  );
}
