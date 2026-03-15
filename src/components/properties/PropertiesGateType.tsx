import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Store } from '../../interface';
import { GATE_AND, GATE_NOR, GATE_NAND, GATE_NOT, GATE_OR } from '../../consts/elementTypes';
import PropertiesTypeOption from './PropertiesTypeOption';
import { Typography } from '@mui/material';

const Container = styled.div`
  background-color: white;
  width: 100%;
`;

const TypeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const ALL_GATE_TYPES = [GATE_NOT, GATE_AND, GATE_OR, GATE_NAND, GATE_NOR];
const TWO_INPUT_GATES = [GATE_AND, GATE_OR, GATE_NAND, GATE_NOR];

const PropertiesGateType: React.FC = () => {
  const element = useSelector((state: Store) => state.elements[state.temp.selectedUuid]);

  if (!ALL_GATE_TYPES.includes(element?.type)) return null;

  // NOT gate has no switchable types — nothing to configure
  if (element.type === GATE_NOT) {
    return (
      <Container>
        <Typography my={1} variant="subtitle1" color="text.secondary">
          NOT — inverts incoming signal, no parameters needed.
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography my={1} variant="h6">
        Type
      </Typography>
      <TypeList>
        {TWO_INPUT_GATES.map((gateType) => (
          <PropertiesTypeOption key={gateType} elementType={element.type} option={gateType} />
        ))}
      </TypeList>
    </Container>
  );
};

export default PropertiesGateType;
