import React, { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { useSelector, useDispatch } from 'react-redux';

import { Store } from '../../interface';
import { ADD_CONTROL_ELEMENT } from '../../store/types';
import ControlElement from './ControlElement';
import ControlElementPalette from './ControlElementPalette';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;
`;

const Canvas = styled.div`
  position: relative;
  flex: 1;
  overflow: auto;
  background:
    repeating-linear-gradient(
      0deg,
      var(--color-grid, rgba(0,0,0,0.05)) 0px,
      transparent 1px,
      transparent 40px
    ),
    repeating-linear-gradient(
      90deg,
      var(--color-grid, rgba(0,0,0,0.05)) 0px,
      transparent 1px,
      transparent 40px
    );
  min-height: 600px;
  min-width: 800px;
`;

const ControlPanel: React.FC = () => {
  const dispatch = useDispatch();
  const elements = useSelector((state: Store) => state.controlPanel.elements);

  const [, drop] = useDrop({
    accept: 'CONTROL_ELEMENT',
    drop: (item: { elementType: string }, monitor) => {
      const offset = monitor.getSourceClientOffset();
      const canvas = document.getElementById('control-panel-canvas');
      if (!offset || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = offset.x - rect.left;
      const y = offset.y - rect.top;
      dispatch({
        type: ADD_CONTROL_ELEMENT,
        payload: {
          id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
          elementType: item.elementType,
          x,
          y,
          label: item.elementType === 'PUSH_BUTTON' ? 'START'
            : item.elementType === 'TOGGLE_SWITCH' ? 'SW'
            : item.elementType === 'PILOT_LAMP' ? 'LAMP'
            : 'E-STOP',
        },
      });
    },
  });

  const setRef = useCallback((node: HTMLDivElement | null) => {
    drop(node);
  }, [drop]);

  return (
    <Container>
      <ControlElementPalette />
      <Canvas id="control-panel-canvas" ref={setRef}>
        {Object.values(elements).map((el) => (
          <ControlElement key={el.id} element={el} />
        ))}
      </Canvas>
    </Container>
  );
};
export default ControlPanel;
