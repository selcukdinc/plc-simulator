import React, { useCallback, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { Store, PowerElementType } from '../../interface';
import { ADD_POWER_ELEMENT, ADD_CABLE, MOVE_POWER_ELEMENT, REMOVE_POWER_ELEMENT } from '../../store/types';
import PowerElement, { getTerminalDots } from './PowerElement';
import PowerCable from './PowerCable';
import PowerElementPalette from './PowerElementPalette';
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
  min-width: 1000px;
  min-height: 700px;
  background:
    repeating-linear-gradient(0deg, var(--color-grid, rgba(0,0,0,0.04)) 0px, transparent 1px, transparent 40px),
    repeating-linear-gradient(90deg, var(--color-grid, rgba(0,0,0,0.04)) 0px, transparent 1px, transparent 40px);
`;

interface GhostLine {
  x1: number; y1: number;
  x2: number; y2: number;
  fromTerminalId: string;
}

function makeId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

const PowerCircuitCanvas: React.FC = () => {
  const dispatch = useDispatch();
  const elements = useSelector((state: Store) => state.powerCircuit.elements);
  const cables = useSelector((state: Store) => state.powerCircuit.cables);
  const energized = useSelector((state: Store) => state.temp.powerCircuitEnergized ?? new Set<string>());

  const svgRef = useRef<SVGSVGElement>(null);
  const [ghost, setGhost] = useState<GhostLine | null>(null);
  const movingRef = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

  // react-dnd drop target
  const [, drop] = useDrop({
    accept: 'POWER_ELEMENT',
    drop: (item: { elementType: PowerElementType; defaultLabel: string }, monitor) => {
      const offset = monitor.getSourceClientOffset();
      const wrapper = document.getElementById('power-circuit-svg-wrapper');
      if (!offset || !wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const x = offset.x - rect.left;
      const y = offset.y - rect.top;
      dispatch({
        type: ADD_POWER_ELEMENT,
        payload: { id: makeId(), elementType: item.elementType, x, y, label: item.defaultLabel },
      });
    },
  });

  const setDropRef = useCallback((node: HTMLDivElement | null) => { drop(node); }, [drop]);

  // Terminal positions lookup
  function getTerminalPosition(terminalId: string): { x: number; y: number } | null {
    for (const el of Object.values(elements)) {
      const dots = getTerminalDots(el);
      const dot = dots.find((d) => d.id === terminalId);
      if (dot) return { x: el.x + dot.cx, y: el.y + dot.cy };
    }
    return null;
  }

  // Cable drawing handlers
  const handleTerminalPointerDown = (terminalId: string, ex: number, ey: number) => {
    setGhost({ x1: ex, y1: ey, x2: ex, y2: ey, fromTerminalId: terminalId });
  };

  const handleTerminalPointerUp = (terminalId: string) => {
    if (!ghost || ghost.fromTerminalId === terminalId) { setGhost(null); return; }
    dispatch({
      type: ADD_CABLE,
      payload: { id: makeId(), fromTerminalId: ghost.fromTerminalId, toTerminalId: terminalId },
    });
    setGhost(null);
  };

  const handleSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (ghost) {
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (!svgRect) return;
      setGhost((g) => g ? { ...g, x2: e.clientX - svgRect.left, y2: e.clientY - svgRect.top } : null);
    }
    if (movingRef.current) {
      const { id, startX, startY, origX, origY } = movingRef.current;
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (!svgRect) return;
      const dx = (e.clientX - svgRect.left) - startX;
      const dy = (e.clientY - svgRect.top) - startY;
      dispatch({ type: MOVE_POWER_ELEMENT, payload: { id, x: origX + dx, y: origY + dy } });
    }
  };

  const handleSvgPointerUp = () => {
    setGhost(null);
    movingRef.current = null;
  };

  const handleElementStartMove = (elementId: string, e: React.PointerEvent) => {
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return;
    const el = elements[elementId];
    movingRef.current = {
      id: elementId,
      startX: e.clientX - svgRect.left,
      startY: e.clientY - svgRect.top,
      origX: el.x,
      origY: el.y,
    };
  };

  const handleSvgDoubleClick = (e: React.MouseEvent) => {
    // double-click on empty area — no-op
    e.stopPropagation();
  };

  return (
    <Container>
      <PowerElementPalette />
      <CanvasWrapper id="power-circuit-svg-wrapper" ref={setDropRef}>
        <SVGCanvas
          ref={svgRef}
          width="100%"
          height="100%"
          onPointerMove={handleSvgPointerMove}
          onPointerUp={handleSvgPointerUp}
          onPointerLeave={handleSvgPointerUp}
          onDoubleClick={handleSvgDoubleClick}
        >
          {/* Cables */}
          {Object.values(cables).map((cable) => {
            const from = getTerminalPosition(cable.fromTerminalId);
            const to = getTerminalPosition(cable.toTerminalId);
            if (!from || !to) return null;
            const fromEl = Object.values(elements).find((el) => el.terminals.some((t) => t.id === cable.fromTerminalId));
            const toEl = Object.values(elements).find((el) => el.terminals.some((t) => t.id === cable.toTerminalId));
            const cableEnergized = !!(fromEl && toEl && energized.has(fromEl.id) && energized.has(toEl.id));
            return (
              <g key={cable.id} onDoubleClick={(e) => { e.stopPropagation(); dispatch({ type: 'REMOVE_CABLE', payload: { id: cable.id } }); }}>
                <PowerCable x1={from.x} y1={from.y} x2={to.x} y2={to.y} energized={cableEnergized} />
              </g>
            );
          })}

          {/* Ghost line while drawing */}
          {ghost && (
            <PowerCable x1={ghost.x1} y1={ghost.y1} x2={ghost.x2} y2={ghost.y2} ghost />
          )}

          {/* Elements */}
          {Object.values(elements).map((el) => (
            <PowerElement
              key={el.id}
              element={el}
              onTerminalPointerDown={handleTerminalPointerDown}
              onTerminalPointerUp={handleTerminalPointerUp}
              onStartMove={handleElementStartMove}
            />
          ))}
        </SVGCanvas>
        <div style={{ position: 'absolute', bottom: 8, right: 8, fontSize: 11, color: 'var(--color-text-muted, #888)', pointerEvents: 'none' }}>
          Elemana sürükle-bırak • Terminal noktasından kabloyu başlat • Kontaktöre çift tıkla → değişken ata • Kabloya çift tıkla → sil
        </div>
      </CanvasWrapper>
    </Container>
  );
};

export default PowerCircuitCanvas;
