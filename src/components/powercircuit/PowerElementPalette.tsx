import React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { PowerElementType } from '../../interface';

const Palette = styled.div`
  width: 96px;
  flex-shrink: 0;
  background: var(--color-panel-bg, #f5f5f5);
  border-right: 1px solid var(--color-border, #ddd);
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 8px;
  overflow-y: auto;
`;

const ItemLabel = styled.div`
  font-size: 10px;
  text-align: center;
  color: var(--color-text, #444);
  margin-top: 2px;
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: grab;
  opacity: 1;
  &:active { cursor: grabbing; }
`;

const PALETTE_ITEMS: { type: PowerElementType; label: string }[] = [
  { type: 'POWER_SOURCE', label: 'Güç Kaynağı' },
  { type: 'CONTACTOR', label: 'Kontaktör' },
  { type: 'THERMAL_RELAY', label: 'Termik Röle' },
  { type: 'MOTOR', label: 'Motor' },
  { type: 'FUSE', label: 'Sigorta' },
  { type: 'TERMINAL_BLOCK', label: 'Klemens' },
];

const DEFAULT_LABELS: Record<PowerElementType, string> = {
  POWER_SOURCE: 'L',
  CONTACTOR: 'KM1',
  THERMAL_RELAY: 'F1',
  MOTOR: 'M1',
  FUSE: 'Q1',
  TERMINAL_BLOCK: 'X1',
};

function PaletteItem({ type, label }: { type: PowerElementType; label: string }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'POWER_ELEMENT',
    item: { elementType: type, defaultLabel: DEFAULT_LABELS[type] },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <ItemWrapper ref={drag} style={{ opacity: isDragging ? 0.4 : 1 }}>
      <svg width={48} height={48} viewBox="0 0 64 64">
        <PreviewShape type={type} />
      </svg>
      <ItemLabel>{label}</ItemLabel>
    </ItemWrapper>
  );
}

function PreviewShape({ type }: { type: PowerElementType }) {
  const fill = 'var(--color-bg, #fff)';
  const stroke = 'var(--color-border, #aaa)';
  switch (type) {
    case 'POWER_SOURCE':
      return <rect x={4} y={4} width={56} height={56} rx={4} fill={fill} stroke={stroke} strokeWidth={2} />;
    case 'CONTACTOR':
      return (
        <>
          <rect x={4} y={4} width={56} height={56} rx={4} fill={fill} stroke={stroke} strokeWidth={2} />
          <line x1={20} y1={24} x2={44} y2={24} stroke={stroke} strokeWidth={2} />
          <line x1={20} y1={40} x2={44} y2={40} stroke={stroke} strokeWidth={2} />
        </>
      );
    case 'THERMAL_RELAY':
      return (
        <>
          <rect x={4} y={4} width={56} height={56} rx={4} fill={fill} stroke={stroke} strokeWidth={2} />
          <path d="M16 32 Q24 20 32 32 Q40 44 48 32" fill="none" stroke={stroke} strokeWidth={2} />
        </>
      );
    case 'MOTOR':
      return <circle cx={32} cy={32} r={28} fill={fill} stroke={stroke} strokeWidth={2} />;
    case 'FUSE':
      return <rect x={4} y={20} width={56} height={24} rx={4} fill={fill} stroke={stroke} strokeWidth={2} />;
    case 'TERMINAL_BLOCK':
      return (
        <>
          <rect x={4} y={8} width={56} height={48} rx={2} fill={fill} stroke={stroke} strokeWidth={2} />
          <rect x={20} y={20} width={24} height={24} rx={2} fill="var(--color-border,#ccc)" />
        </>
      );
    default:
      return <rect x={4} y={4} width={56} height={56} rx={4} fill={fill} stroke={stroke} strokeWidth={2} />;
  }
}

const PowerElementPalette: React.FC = () => (
  <Palette>
    {PALETTE_ITEMS.map((item) => (
      <PaletteItem key={item.type} type={item.type} label={item.label} />
    ))}
  </Palette>
);

export default PowerElementPalette;
