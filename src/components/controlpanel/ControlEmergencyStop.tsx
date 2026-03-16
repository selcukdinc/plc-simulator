import React from 'react';
import { useDispatch } from 'react-redux';
import { TOGGLE_SWITCH_CLICK } from '../../store/types';

interface Props {
  elementId: string;
  label: string;
  isActive: boolean;
}

const ControlEmergencyStop: React.FC<Props> = ({ elementId, label, isActive }) => {
  const dispatch = useDispatch();
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" style={{ cursor: 'pointer', userSelect: 'none' }}
      onClick={() => dispatch({ type: TOGGLE_SWITCH_CLICK, payload: { elementId } })}
    >
      <circle cx="40" cy="40" r="30" fill={isActive ? '#d32f2f' : '#ef9a9a'} stroke="#b71c1c" strokeWidth="3" />
      <circle cx="40" cy="40" r="20" fill={isActive ? '#b71c1c' : '#e57373'} />
      <rect x="28" y="36" width="24" height="8" rx="2" fill="white" />
      <text x="40" y="70" textAnchor="middle" fontSize="9" fill="var(--color-text, #333)" fontWeight="bold">{label || 'ACİL STOP'}</text>
    </svg>
  );
};
export default ControlEmergencyStop;
