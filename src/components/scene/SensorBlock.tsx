import React from 'react';
import { useSelector } from 'react-redux';
import { Store, SensorBlock as SensorBlockType } from '../../interface';

interface Props {
  sensorId: string;
  onClick?: (id: string) => void;
  onDoubleClick?: (id: string) => void;
}

function LimitSwitchIcon({ triggered }: { triggered: boolean }) {
  const color = triggered ? '#e74c3c' : 'var(--color-border, #888)';
  return (
    <>
      <rect x={2} y={10} width={20} height={12} rx={2} fill="var(--color-bg,#e8e8e8)" stroke={color} strokeWidth={1.5} />
      <line x1={12} y1={10} x2={22} y2={2} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <circle cx={22} cy={2} r={2.5} fill={color} />
    </>
  );
}

function PhotoelectricIcon({ triggered }: { triggered: boolean }) {
  const color = triggered ? '#e74c3c' : 'var(--color-border, #888)';
  return (
    <>
      <rect x={2} y={8} width={20} height={16} rx={3} fill="var(--color-bg,#e8e8e8)" stroke={color} strokeWidth={1.5} />
      <circle cx={12} cy={16} r={4} fill={triggered ? '#e74c3c' : 'none'} stroke={color} strokeWidth={1.5} />
      <line x1={22} y1={16} x2={28} y2={16} stroke={color} strokeWidth={1.5} strokeDasharray="2 2" />
    </>
  );
}

function ProximityIcon({ triggered }: { triggered: boolean }) {
  const color = triggered ? '#e74c3c' : 'var(--color-border, #888)';
  return (
    <>
      <circle cx={12} cy={16} r={10} fill="var(--color-bg,#e8e8e8)" stroke={color} strokeWidth={1.5} />
      <circle cx={12} cy={16} r={4} fill={triggered ? '#e74c3c' : 'none'} stroke={color} strokeWidth={1.5} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={12} cy={16} r={6 + i * 3} fill="none" stroke={color} strokeWidth={0.8} opacity={0.4} />
      ))}
    </>
  );
}

const SensorBlock: React.FC<Props> = ({ sensorId, onClick, onDoubleClick }) => {
  const sensor = useSelector((state: Store) => state.scene.sensors[sensorId]);
  const triggered = useSelector((state: Store) =>
    sensor?.variableId ? Boolean(state.variables[sensor.variableId]?.value) : false
  );
  const varExists = useSelector((state: Store) =>
    sensor?.variableId ? !!state.variables[sensor.variableId] : true
  );
  const varMissing = sensor?.variableId && !varExists;

  if (!sensor) return null;

  const hw = sensor.triggerWidth / 2;
  const hh = sensor.triggerHeight / 2;

  return (
    <g
      transform={`translate(${sensor.x},${sensor.y})`}
      style={{ cursor: 'pointer' }}
      onClick={() => onClick?.(sensorId)}
      onDoubleClick={() => onDoubleClick?.(sensorId)}
    >
      {/* Trigger zone bounding box */}
      <rect
        x={-hw}
        y={-hh}
        width={sensor.triggerWidth}
        height={sensor.triggerHeight}
        fill={triggered ? 'rgba(231,76,60,0.1)' : 'rgba(100,100,200,0.05)'}
        stroke={triggered ? '#e74c3c' : 'rgba(100,100,200,0.3)'}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      {/* Sensor icon */}
      <svg x={-14} y={-18} width={32} height={32} viewBox="0 0 28 32" overflow="visible">
        {sensor.type === 'LIMIT_SWITCH' && <LimitSwitchIcon triggered={triggered} />}
        {sensor.type === 'PHOTOELECTRIC' && <PhotoelectricIcon triggered={triggered} />}
        {sensor.type === 'PROXIMITY' && <ProximityIcon triggered={triggered} />}
      </svg>
      {/* Label */}
      <text x={0} y={hh + 14} textAnchor="middle" fontSize={10} fill="var(--color-text, #333)">
        {sensor.label}
      </text>
      {/* Warning */}
      {!sensor.variableId && (
        <text x={0} y={hh + 24} textAnchor="middle" fontSize={9} fill="orange">⚠ Değişken atanmamış</text>
      )}
      {varMissing && (
        <text x={0} y={hh + 24} textAnchor="middle" fontSize={9} fill="orange">⚠ Değişken bulunamadı</text>
      )}
    </g>
  );
};

export default SensorBlock;
