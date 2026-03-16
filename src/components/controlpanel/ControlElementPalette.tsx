import React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { ControlElementType } from '../../interface';

const Palette = styled.div`
  width: 100px;
  border-right: 1px solid var(--color-border, rgba(0,0,0,0.12));
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  background: var(--color-bg-secondary, rgba(0,0,0,0.02));
`;

const PaletteItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: grab;
  padding: 4px;
  border-radius: var(--radius-sm, 4px);
  &:hover { background: var(--color-hover, rgba(0,0,0,0.06)); }
`;

const ITEMS: { type: ControlElementType; label: string }[] = [
  { type: 'PUSH_BUTTON', label: 'Buton' },
  { type: 'TOGGLE_SWITCH', label: 'Anahtar' },
  { type: 'PILOT_LAMP', label: 'Lamba' },
  { type: 'EMERGENCY_STOP', label: 'ACİL' },
];

const DraggablePaletteItem: React.FC<{ type: ControlElementType; label: string }> = ({ type, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CONTROL_ELEMENT',
    item: { elementType: type },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));
  return (
    <PaletteItem ref={drag as unknown as React.Ref<HTMLDivElement>} style={{ opacity: isDragging ? 0.4 : 1 }}>
      <svg width="40" height="40" viewBox="0 0 80 80">
        {type === 'PUSH_BUTTON' && <circle cx="40" cy="40" r="28" fill="#e0e0e0" stroke="#888" strokeWidth="2" />}
        {type === 'TOGGLE_SWITCH' && <rect x="10" y="25" width="60" height="30" rx="15" fill="#e0e0e0" stroke="#888" strokeWidth="2" />}
        {type === 'PILOT_LAMP' && <circle cx="40" cy="40" r="24" fill="#4caf50" stroke="#888" strokeWidth="2" />}
        {type === 'EMERGENCY_STOP' && <circle cx="40" cy="40" r="30" fill="#ef9a9a" stroke="#b71c1c" strokeWidth="3" />}
      </svg>
      <span style={{ fontSize: '10px', textAlign: 'center' }}>{label}</span>
    </PaletteItem>
  );
};

const ControlElementPalette: React.FC = () => (
  <Palette>
    {ITEMS.map((item) => (
      <DraggablePaletteItem key={item.type} type={item.type} label={item.label} />
    ))}
  </Palette>
);
export default ControlElementPalette;
