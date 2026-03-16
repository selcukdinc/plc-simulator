import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Store, ControlElement as ControlElementType } from '../../interface';
import ControlPushButton from './ControlPushButton';
import ControlToggleSwitch from './ControlToggleSwitch';
import ControlPilotLamp from './ControlPilotLamp';
import ControlEmergencyStop from './ControlEmergencyStop';
import ControlElementVariableDialog from './ControlElementVariableDialog';
import styled from 'styled-components';

const Wrapper = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${(p) => p.$x}px;
  top: ${(p) => p.$y}px;
`;

const Warning = styled.div`
  font-size: 10px;
  color: orange;
  text-align: center;
  margin-top: 2px;
`;

interface Props {
  element: ControlElementType;
}

const ControlElement: React.FC<Props> = ({ element }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const variable = useSelector((state: Store) =>
    element.variableId ? state.variables[element.variableId] : undefined
  );

  const isActive = variable ? Boolean(variable.value) : false;
  const variableMissing = element.variableId !== null && !variable;
  const variableUnassigned = element.variableId === null;

  return (
    <Wrapper $x={element.x} $y={element.y} onDoubleClick={() => setDialogOpen(true)}>
      {element.type === 'PUSH_BUTTON' && (
        <ControlPushButton elementId={element.id} label={element.label} isPressed={isActive} />
      )}
      {element.type === 'TOGGLE_SWITCH' && (
        <ControlToggleSwitch elementId={element.id} label={element.label} isOn={isActive} />
      )}
      {element.type === 'PILOT_LAMP' && (
        <ControlPilotLamp label={element.label} isOn={isActive} />
      )}
      {element.type === 'EMERGENCY_STOP' && (
        <ControlEmergencyStop elementId={element.id} label={element.label} isActive={isActive} />
      )}
      {variableUnassigned && <Warning>&#9888; Değişken atanmamış</Warning>}
      {variableMissing && <Warning>&#9888; Değişken bulunamadı</Warning>}
      <ControlElementVariableDialog
        elementId={element.id}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </Wrapper>
  );
};

export default ControlElement;
