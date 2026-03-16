import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { SceneBlockType, SensorType } from '../../interface';

const Palette = styled.div`
  width: 100px;
  flex-shrink: 0;
  background: var(--color-panel-bg, #f5f5f5);
  border-right: 1px solid var(--color-border, #ddd);
  display: flex;
  flex-direction: column;
  padding: 8px 6px;
  overflow-y: auto;
  gap: 6px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 4px 6px;
  border: 1px solid var(--color-border, #ccc);
  border-radius: var(--radius-sm, 4px);
  font-size: 11px;
  background: var(--color-bg, #fff);
  color: var(--color-text, #333);
  box-sizing: border-box;
`;

const SectionTitle = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-muted, #888);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 0;
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: grab;
  &:active { cursor: grabbing; }
`;

const ItemLabel = styled.div`
  font-size: 9px;
  text-align: center;
  color: var(--color-text, #444);
  margin-top: 2px;
  line-height: 1.2;
`;

const SCENE_BLOCKS: { type: SceneBlockType; label: string }[] = [
  { type: 'CRANE_TROLLEY', label: 'Vinç Arabası' },
  { type: 'CRANE_HOOK', label: 'Vinç Kancası' },
  { type: 'CONVEYOR', label: 'Konveyör' },
  { type: 'PNEUMATIC_CYL', label: 'Pnömatik Sil.' },
  { type: 'LIFT_TABLE', label: 'Kaldırma Pltf.' },
  { type: 'SIGNAL_TOWER', label: 'Işık Kulesi' },
];

const SENSOR_BLOCKS: { type: SensorType; label: string }[] = [
  { type: 'LIMIT_SWITCH', label: 'Limit Switch' },
  { type: 'PHOTOELECTRIC', label: 'Fotoelektrik' },
  { type: 'PROXIMITY', label: 'Proximity' },
];

function SceneBlockItem({ type, label }: { type: SceneBlockType; label: string }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'SCENE_BLOCK',
    item: { blockType: type, label },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));
  return (
    <ItemWrapper ref={drag} style={{ opacity: isDragging ? 0.4 : 1 }}>
      <svg width={40} height={32} viewBox="0 0 80 48">
        <rect x={2} y={4} width={76} height={40} rx={4} fill="var(--color-bg,#e8e8e8)" stroke="var(--color-border,#aaa)" strokeWidth={2} />
      </svg>
      <ItemLabel>{label}</ItemLabel>
    </ItemWrapper>
  );
}

function SensorBlockItem({ type, label }: { type: SensorType; label: string }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'SENSOR_BLOCK',
    item: { sensorType: type, label },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));
  return (
    <ItemWrapper ref={drag} style={{ opacity: isDragging ? 0.4 : 1 }}>
      <svg width={32} height={32} viewBox="0 0 32 32">
        <circle cx={16} cy={16} r={12} fill="var(--color-bg,#e8e8e8)" stroke="var(--color-border,#888)" strokeWidth={2} />
        <circle cx={16} cy={16} r={4} fill="var(--color-border,#888)" />
      </svg>
      <ItemLabel>{label}</ItemLabel>
    </ItemWrapper>
  );
}

const SceneBlockPalette: React.FC = () => {
  const [search, setSearch] = useState('');
  const q = search.toLowerCase();

  const filteredBlocks = SCENE_BLOCKS.filter((b) => b.label.toLowerCase().includes(q) || b.type.toLowerCase().includes(q));
  const filteredSensors = SENSOR_BLOCKS.filter((s) => s.label.toLowerCase().includes(q) || s.type.toLowerCase().includes(q));

  return (
    <Palette>
      <SearchInput
        placeholder="Ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredBlocks.length > 0 && <SectionTitle>Makineler</SectionTitle>}
      {filteredBlocks.map((b) => <SceneBlockItem key={b.type} type={b.type} label={b.label} />)}
      {filteredSensors.length > 0 && <SectionTitle>Sensörler</SectionTitle>}
      {filteredSensors.map((s) => <SensorBlockItem key={s.type} type={s.type} label={s.label} />)}
    </Palette>
  );
};

export default SceneBlockPalette;
