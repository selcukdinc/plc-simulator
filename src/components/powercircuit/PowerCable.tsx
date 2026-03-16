import React from 'react';

interface Props {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  energized?: boolean;
  ghost?: boolean; // mid-drawing ghost line
}

const PowerCable: React.FC<Props> = ({ x1, y1, x2, y2, energized = false, ghost = false }) => {
  const color = ghost ? 'rgba(100,100,200,0.5)' : energized ? '#2ecc71' : 'var(--color-border, #888)';
  const strokeWidth = ghost ? 1.5 : 2.5;

  // Draw elbow route: horizontal then vertical
  const mx = (x1 + x2) / 2;

  return (
    <polyline
      points={`${x1},${y1} ${mx},${y1} ${mx},${y2} ${x2},${y2}`}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={ghost ? '6 3' : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ pointerEvents: ghost ? 'none' : 'stroke' }}
    />
  );
};

export default PowerCable;
