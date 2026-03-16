import React, { useCallback, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { Store, SceneBlockType, SensorType } from '../../interface';
import { ADD_SCENE_BLOCK, ADD_SENSOR_BLOCK } from '../../store/types';
import SceneBlock from './SceneBlock';
import SensorBlock from './SensorBlock';
import SceneBlockPalette from './SceneBlockPalette';
import PropertiesSceneBlock from '../properties/PropertiesSceneBlock';
import PropertiesSensorBlock from '../properties/PropertiesSensorBlock';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;
`;

const CanvasWrapper = styled.div`
  flex: 1;
  overflow: auto;
  position: relative;
`;

const SVGCanvas = styled.svg`
  min-width: 1100px;
  min-height: 700px;
  background:
    repeating-linear-gradient(0deg, var(--color-grid, rgba(0,0,0,0.04)) 0px, transparent 1px, transparent 40px),
    repeating-linear-gradient(90deg, var(--color-grid, rgba(0,0,0,0.04)) 0px, transparent 1px, transparent 40px);
`;

function makeId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

const SceneCanvas: React.FC = () => {
  const dispatch = useDispatch();
  const blocks = useSelector((state: Store) => state.scene.blocks);
  const sensors = useSelector((state: Store) => state.scene.sensors);
  const [blockPropsId, setBlockPropsId] = useState<string | null>(null);
  const [sensorPropsId, setSensorPropsId] = useState<string | null>(null);

  const getCanvasCoords = (monitor: any): { x: number; y: number } => {
    const offset = monitor.getSourceClientOffset();
    const wrapper = document.getElementById('scene-canvas-wrapper');
    if (!offset || !wrapper) return { x: 100, y: 100 };
    const rect = wrapper.getBoundingClientRect();
    return { x: offset.x - rect.left, y: offset.y - rect.top };
  };

  const [, drop] = useDrop({
    accept: ['SCENE_BLOCK', 'SENSOR_BLOCK'],
    drop: (item: any, monitor) => {
      const { x, y } = getCanvasCoords(monitor);
      if (monitor.getItemType() === 'SCENE_BLOCK') {
        dispatch({
          type: ADD_SCENE_BLOCK,
          payload: {
            id: makeId(),
            blockType: item.blockType as SceneBlockType,
            x,
            y,
            label: item.label,
            speedPxPerSec: 100,
          },
        });
      } else if (monitor.getItemType() === 'SENSOR_BLOCK') {
        dispatch({
          type: ADD_SENSOR_BLOCK,
          payload: {
            id: makeId(),
            sensorType: item.sensorType as SensorType,
            x,
            y,
            label: item.label,
            triggerWidth: 20,
            triggerHeight: 20,
          },
        });
      }
    },
  });

  const setDropRef = useCallback((node: HTMLDivElement | null) => { drop(node); }, [drop]);

  return (
    <Container>
      <SceneBlockPalette />
      <CanvasWrapper id="scene-canvas-wrapper" ref={setDropRef}>
        <SVGCanvas width="100%" height="100%">
          {/* Sensors rendered below blocks */}
          {Object.keys(sensors).map((id) => (
            <SensorBlock key={id} sensorId={id} onDoubleClick={setSensorPropsId} />
          ))}
          {/* Animated machine blocks */}
          {Object.keys(blocks).map((id) => (
            <SceneBlock key={id} blockId={id} onDoubleClick={setBlockPropsId} />
          ))}
        </SVGCanvas>
        <div style={{ position: 'absolute', bottom: 8, right: 8, fontSize: 11, color: 'var(--color-text-muted, #888)', pointerEvents: 'none' }}>
          Sürükle-bırak • Çift tıkla → özellikler
        </div>
      </CanvasWrapper>
      {blockPropsId && (
        <PropertiesSceneBlock
          blockId={blockPropsId}
          open={true}
          onClose={() => setBlockPropsId(null)}
        />
      )}
      {sensorPropsId && (
        <PropertiesSensorBlock
          sensorId={sensorPropsId}
          open={true}
          onClose={() => setSensorPropsId(null)}
        />
      )}
    </Container>
  );
};

export default SceneCanvas;
