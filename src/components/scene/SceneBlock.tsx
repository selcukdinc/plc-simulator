import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Store } from '../../interface';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';

const BLOCK_W = 80;
const BLOCK_H = 48;

interface Props {
  blockId: string;
  onClick?: (id: string) => void;
  onDoubleClick?: (id: string) => void;
}

function CraneTrolleyShape({ active }: { active: boolean }) {
  const fill = active ? '#3498db' : 'var(--color-bg, #e8e8e8)';
  const stroke = active ? '#2980b9' : 'var(--color-border, #aaa)';
  return (
    <>
      {/* Body */}
      <rect x={0} y={4} width={BLOCK_W} height={BLOCK_H - 12} rx={4} fill={fill} stroke={stroke} strokeWidth={2} />
      {/* Wheels */}
      <circle cx={14} cy={BLOCK_H - 4} r={6} fill={stroke} />
      <circle cx={BLOCK_W - 14} cy={BLOCK_H - 4} r={6} fill={stroke} />
      {/* Rail groove */}
      <line x1={0} y1={4} x2={BLOCK_W} y2={4} stroke={stroke} strokeWidth={3} />
    </>
  );
}

function CraneHookShape({ active }: { active: boolean }) {
  const fill = active ? '#e67e22' : 'var(--color-bg, #e8e8e8)';
  const stroke = active ? '#d35400' : 'var(--color-border, #aaa)';
  return (
    <>
      {/* Vertical rope */}
      <line x1={BLOCK_W / 2} y1={0} x2={BLOCK_W / 2} y2={24} stroke={stroke} strokeWidth={2} />
      {/* Hook body */}
      <path
        d={`M${BLOCK_W / 2 - 10},24 L${BLOCK_W / 2 + 10},24 Q${BLOCK_W / 2 + 18},24 ${BLOCK_W / 2 + 18},34 Q${BLOCK_W / 2 + 18},44 ${BLOCK_W / 2},44 Q${BLOCK_W / 2 - 6},44 ${BLOCK_W / 2 - 6},38`}
        fill="none"
        stroke={stroke}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <rect x={BLOCK_W / 2 - 12} y={20} width={24} height={8} rx={2} fill={fill} stroke={stroke} strokeWidth={1.5} />
    </>
  );
}

function ConveyorShape({ active }: { active: boolean }) {
  const fill = active ? '#27ae60' : 'var(--color-bg, #e8e8e8)';
  const stroke = active ? '#229954' : 'var(--color-border, #aaa)';
  return (
    <>
      {/* Belt body */}
      <rect x={0} y={12} width={BLOCK_W} height={BLOCK_H - 20} rx={2} fill={fill} stroke={stroke} strokeWidth={2} />
      {/* Left drum */}
      <ellipse cx={10} cy={BLOCK_H / 2} rx={8} ry={BLOCK_H / 2 - 6} fill={stroke} />
      {/* Right drum */}
      <ellipse cx={BLOCK_W - 10} cy={BLOCK_H / 2} rx={8} ry={BLOCK_H / 2 - 6} fill={stroke} />
      {/* Belt lines */}
      {active && [0, 1, 2].map((i) => (
        <line key={i} x1={20 + i * 18} y1={14} x2={20 + i * 18} y2={BLOCK_H - 8} stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
      ))}
    </>
  );
}

function PneumaticCylShape({ active }: { active: boolean }) {
  const stroke = active ? '#8e44ad' : 'var(--color-border, #aaa)';
  const fill = active ? '#9b59b6' : 'var(--color-bg, #e8e8e8)';
  const rodExtend = active ? 20 : 0;
  return (
    <>
      {/* Cylinder body */}
      <rect x={8} y={8} width={BLOCK_W - 16} height={BLOCK_H - 16} rx={4} fill={fill} stroke={stroke} strokeWidth={2} />
      {/* Piston rod */}
      <rect x={BLOCK_W / 2 - 4} y={0} width={8} height={8 + rodExtend} rx={2} fill={stroke} />
    </>
  );
}

function LiftTableShape({ active }: { active: boolean }) {
  const stroke = active ? '#c0392b' : 'var(--color-border, #aaa)';
  const fill = active ? '#e74c3c' : 'var(--color-bg, #e8e8e8)';
  return (
    <>
      {/* Table top */}
      <rect x={0} y={4} width={BLOCK_W} height={8} rx={2} fill={fill} stroke={stroke} strokeWidth={2} />
      {/* Scissors */}
      <line x1={16} y1={12} x2={BLOCK_W - 8} y2={BLOCK_H - 4} stroke={stroke} strokeWidth={2} />
      <line x1={BLOCK_W - 16} y1={12} x2={8} y2={BLOCK_H - 4} stroke={stroke} strokeWidth={2} />
      {/* Base */}
      <rect x={0} y={BLOCK_H - 8} width={BLOCK_W} height={8} rx={2} fill={stroke} />
    </>
  );
}

function SignalTowerShape({ r, y, g }: { r: boolean; y: boolean; g: boolean }) {
  return (
    <>
      {/* Tower pole */}
      <rect x={BLOCK_W / 2 - 4} y={0} width={8} height={BLOCK_H} fill="var(--color-border, #aaa)" rx={2} />
      {/* Red */}
      <circle cx={BLOCK_W / 2} cy={10} r={8} fill={r ? '#e74c3c' : '#555'} stroke="#333" strokeWidth={1} />
      {/* Yellow */}
      <circle cx={BLOCK_W / 2} cy={BLOCK_H / 2} r={8} fill={y ? '#f39c12' : '#555'} stroke="#333" strokeWidth={1} />
      {/* Green */}
      <circle cx={BLOCK_W / 2} cy={BLOCK_H - 10} r={8} fill={g ? '#2ecc71' : '#555'} stroke="#333" strokeWidth={1} />
    </>
  );
}

const SceneBlock: React.FC<Props> = ({ blockId, onClick, onDoubleClick }) => {
  const block = useSelector((state: Store) => state.scene.blocks[blockId]);
  const variables = useSelector((state: Store) => state.variables);
  const groupRef = useRef<SVGGElement>(null);

  useAnimationFrame(() => {
    if (!block || !groupRef.current) return;
    // Interpolate current visual position toward target (lerp ~12% per frame)
    const el = groupRef.current;
    const currentTransform = el.getAttribute('data-x') ?? block.x.toString();
    const currentTransformY = el.getAttribute('data-y') ?? block.y.toString();
    const cx = parseFloat(currentTransform);
    const cy = parseFloat(currentTransformY);
    const nx = cx + (block.targetX - cx) * 0.12;
    const ny = cy + (block.targetY - cy) * 0.12;
    el.setAttribute('data-x', nx.toString());
    el.setAttribute('data-y', ny.toString());
    el.setAttribute('transform', `translate(${nx},${ny})`);
  });

  if (!block) return null;

  const fwdActive = block.axes.forwardVariableId ? Boolean(variables[block.axes.forwardVariableId]?.value) : false;
  const bwdActive = block.axes.backwardVariableId ? Boolean(variables[block.axes.backwardVariableId]?.value) : false;
  const isActive = fwdActive || bwdActive;

  const sigVarId = (block as any).signalVariableId as string | null | undefined;
  const sigActive = sigVarId ? Boolean(variables[sigVarId]?.value) : false;

  return (
    <g
      ref={groupRef}
      data-x={block.x}
      data-y={block.y}
      transform={`translate(${block.x},${block.y})`}
      style={{ cursor: 'pointer' }}
      onClick={() => onClick?.(blockId)}
      onDoubleClick={() => onDoubleClick?.(blockId)}
    >
      <svg width={BLOCK_W} height={BLOCK_H} viewBox={`0 0 ${BLOCK_W} ${BLOCK_H}`} overflow="visible">
        {block.type === 'CRANE_TROLLEY' && <CraneTrolleyShape active={isActive} />}
        {block.type === 'CRANE_HOOK' && <CraneHookShape active={isActive} />}
        {block.type === 'CONVEYOR' && <ConveyorShape active={isActive} />}
        {block.type === 'PNEUMATIC_CYL' && <PneumaticCylShape active={isActive} />}
        {block.type === 'LIFT_TABLE' && <LiftTableShape active={isActive} />}
        {block.type === 'SIGNAL_TOWER' && <SignalTowerShape r={sigActive} y={false} g={!sigActive} />}
      </svg>
      <text
        x={BLOCK_W / 2}
        y={BLOCK_H + 14}
        textAnchor="middle"
        fontSize={11}
        fill="var(--color-text, #333)"
      >
        {block.label}
      </text>
    </g>
  );
};

export { BLOCK_W, BLOCK_H };
export default SceneBlock;
