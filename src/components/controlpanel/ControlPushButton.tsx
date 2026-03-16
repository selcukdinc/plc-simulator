import React from 'react';
import { useDispatch } from 'react-redux';
import { CONTROL_BUTTON_PRESS, CONTROL_BUTTON_RELEASE } from '../../store/types';

interface Props {
  elementId: string;
  label: string;
  isPressed: boolean;
}

const ControlPushButton: React.FC<Props> = ({ elementId, label, isPressed }) => {
  const dispatch = useDispatch();
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" style={{ userSelect: 'none', cursor: 'pointer' }}
      onMouseDown={() => dispatch({ type: CONTROL_BUTTON_PRESS, payload: { elementId } })}
      onMouseUp={() => dispatch({ type: CONTROL_BUTTON_RELEASE, payload: { elementId } })}
      onMouseLeave={() => dispatch({ type: CONTROL_BUTTON_RELEASE, payload: { elementId } })}
    >
      <circle cx="40" cy="40" r="28" fill={isPressed ? 'var(--color-primary, #1976d2)' : 'var(--color-button-bg, #e0e0e0)'} stroke="var(--color-border, #888)" strokeWidth="2" />
      <circle cx="40" cy="40" r="18" fill={isPressed ? 'var(--color-primary-light, #42a5f5)' : '#bdbdbd'} />
      <text x="40" y="70" textAnchor="middle" fontSize="10" fill="var(--color-text, #333)">{label}</text>
    </svg>
  );
};
export default ControlPushButton;
