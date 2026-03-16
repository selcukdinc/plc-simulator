import React from 'react';

interface Props {
  label: string;
  isOn: boolean;
}

const ControlPilotLamp: React.FC<Props> = ({ label, isOn }) => (
  <svg width="80" height="80" viewBox="0 0 80 80" style={{ userSelect: 'none' }}>
    <circle cx="40" cy="40" r="24" fill={isOn ? '#4caf50' : '#bdbdbd'} stroke="var(--color-border, #888)" strokeWidth="2" />
    {isOn && <circle cx="40" cy="40" r="24" fill="rgba(76,175,80,0.3)" strokeWidth="0">
      <animate attributeName="r" values="24;32;24" dur="1.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite" />
    </circle>}
    <circle cx="40" cy="40" r="14" fill={isOn ? '#81c784' : '#9e9e9e'} />
    <text x="40" y="70" textAnchor="middle" fontSize="10" fill="var(--color-text, #333)">{label}</text>
  </svg>
);
export default ControlPilotLamp;
