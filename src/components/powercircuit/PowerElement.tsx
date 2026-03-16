import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Store, PowerElement as PowerElementType } from '../../interface';
import PowerElementVariableDialog from './PowerElementVariableDialog';

const ELEMENT_W = 64;
const ELEMENT_H = 64;
export const TERMINAL_RADIUS = 6;

interface TerminalDot {
  id: string;
  cx: number;
  cy: number;
}

function getTerminalDots(el: PowerElementType): TerminalDot[] {
  return el.terminals.map((t) => {
    const cx = t.side === 'in' ? 0 : ELEMENT_W;
    const cy = ELEMENT_H / 2 + (el.terminals.filter((x) => x.side === t.side).indexOf(t) - 0.5) * 16;
    return { id: t.id, cx, cy };
  });
}

function ElementShape({ type, energized }: { type: string; energized: boolean }) {
  const fill = energized ? '#2ecc71' : 'var(--color-bg, #fff)';
  const stroke = energized ? '#27ae60' : 'var(--color-border, #aaa)';

  switch (type) {
    case 'POWER_SOURCE':
      return (
        <>
          <rect x={4} y={4} width={56} height={56} rx={4} fill={fill} stroke={stroke} strokeWidth={2} />
          <text x={32} y={28} textAnchor="middle" fontSize={10} fill={energized ? '#fff' : 'var(--color-text,#333)'}>L1</text>
          <text x={32} y={42} textAnchor="middle" fontSize={10} fill={energized ? '#fff' : 'var(--color-text,#333)'}>L2</text>
          <line x1={16} y1={54} x2={48} y2={54} stroke={stroke} strokeWidth={2} />
        </>
      );
    case 'CONTACTOR':
      return (
        <>
          <rect x={4} y={4} width={56} height={56} rx={4} fill={fill} stroke={stroke} strokeWidth={2} />
          {/* Main contacts symbol */}
          <line x1={20} y1={24} x2={44} y2={24} stroke={stroke} strokeWidth={2} />
          <line x1={20} y1={40} x2={44} y2={40} stroke={stroke} strokeWidth={2} />
          {energized
            ? <line x1={32} y1={24} x2={32} y2={40} stroke="#27ae60" strokeWidth={3} />
            : <line x1={32} y1={28} x2={32} y2={36} stroke={stroke} strokeWidth={2} strokeDasharray="3 2" />
          }
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
      return (
        <>
          <circle cx={32} cy={32} r={28} fill={fill} stroke={stroke} strokeWidth={2} />
          <text x={32} y={37} textAnchor="middle" fontSize={14} fontWeight="bold" fill={energized ? '#fff' : 'var(--color-text,#333)'}>M</text>
        </>
      );
    case 'FUSE':
      return (
        <>
          <rect x={4} y={20} width={56} height={24} rx={4} fill={fill} stroke={stroke} strokeWidth={2} />
          <line x1={4} y1={32} x2={0} y2={32} stroke={stroke} strokeWidth={2} />
          <line x1={60} y1={32} x2={64} y2={32} stroke={stroke} strokeWidth={2} />
        </>
      );
    case 'TERMINAL_BLOCK':
      return (
        <>
          <rect x={4} y={8} width={56} height={48} rx={2} fill={fill} stroke={stroke} strokeWidth={2} />
          <rect x={20} y={20} width={24} height={24} rx={2} fill={energized ? '#27ae60' : 'var(--color-border,#ccc)'} />
        </>
      );
    default:
      return <rect x={4} y={4} width={56} height={56} rx={4} fill={fill} stroke={stroke} strokeWidth={2} />;
  }
}

interface Props {
  element: PowerElementType;
  onTerminalPointerDown?: (terminalId: string, ex: number, ey: number) => void;
  onTerminalPointerUp?: (terminalId: string) => void;
  onStartMove?: (elementId: string, e: React.PointerEvent) => void;
}

const PowerElement: React.FC<Props> = ({ element, onTerminalPointerDown, onTerminalPointerUp, onStartMove }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const energized = useSelector((state: Store) =>
    (state.temp.powerCircuitEnergized ?? new Set<string>()).has(element.id)
  );

  const terminalDots = getTerminalDots(element);

  return (
    <g
      transform={`translate(${element.x},${element.y})`}
      style={{ cursor: 'move' }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onStartMove?.(element.id, e);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (element.type === 'CONTACTOR') setDialogOpen(true);
      }}
    >
      <ElementShape type={element.type} energized={energized} />
      {/* Label */}
      <text
        x={ELEMENT_W / 2}
        y={ELEMENT_H + 14}
        textAnchor="middle"
        fontSize={11}
        fill="var(--color-text, #333)"
      >
        {element.label}
      </text>
      {/* Terminals */}
      {terminalDots.map((t) => (
        <circle
          key={t.id}
          cx={t.cx}
          cy={t.cy}
          r={TERMINAL_RADIUS}
          fill={energized ? '#2ecc71' : '#e74c3c'}
          stroke="#fff"
          strokeWidth={1.5}
          style={{ cursor: 'crosshair' }}
          onPointerDown={(e) => {
            e.stopPropagation();
            onTerminalPointerDown?.(t.id, element.x + t.cx, element.y + t.cy);
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            onTerminalPointerUp?.(t.id);
          }}
        />
      ))}
      {element.type === 'CONTACTOR' && (
        <PowerElementVariableDialog
          elementId={element.id}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </g>
  );
};

export { getTerminalDots };
export default PowerElement;
