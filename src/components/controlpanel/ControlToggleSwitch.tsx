import React from 'react';
import { useDispatch } from 'react-redux';
import { TOGGLE_SWITCH_CLICK } from '../../store/types';

interface Props {
  elementId: string;
  label: string;
  isOn: boolean;
}

const ControlToggleSwitch: React.FC<Props> = ({ elementId, label, isOn }) => {
  const dispatch = useDispatch();
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" style={{ cursor: 'pointer', userSelect: 'none' }}
      onClick={() => dispatch({ type: TOGGLE_SWITCH_CLICK, payload: { elementId } })}
    >
      <rect x="10" y="25" width="60" height="30" rx="15" fill={isOn ? 'var(--color-primary, #1976d2)' : 'var(--color-button-bg, #e0e0e0)'} stroke="var(--color-border, #888)" strokeWidth="2" />
      <circle cx={isOn ? 55 : 25} cy="40" r="12" fill="white" />
      <text x="40" y="70" textAnchor="middle" fontSize="10" fill="var(--color-text, #333)">{label}</text>
    </svg>
  );
};
export default ControlToggleSwitch;
