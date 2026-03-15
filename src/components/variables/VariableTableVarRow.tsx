import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { VAR_SELECTED, VAR_TABLE_BORDER } from '../../consts/colors';
import {
  ADDRESS_COL_WIDTH,
  BORDER_SIZE,
  DELETE_COL_WIDTH,
  ROW_HEIGHT,
  TYPE_COL_WIDTH,
} from '../../consts/variableTableStyles';
import { Store } from '../../interface';
import { DELETE_VARIABLE } from '../../store/types';

import VariableDelete from './VariableDelete';
import VariableName from './VariableName';
import VariableTableSubVarRow from './VariableTableSubVarRow';
import VariableValue from './VariableValue';

const DeletePlaceholder = styled.th`
  flex: 0 0 ${DELETE_COL_WIDTH};
`;
const Row = styled.tr<{ bgColor: string }>`
  background: ${(props) => props.bgColor};
  border-bottom: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  display: flex;
  height: ${ROW_HEIGHT};
  outline: none;
`;
const Type = styled.td`
  border-right: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  box-sizing: border-box;
  padding-left: 0.2rem;
  flex: 0 0 ${TYPE_COL_WIDTH};
`;
const Address = styled.td`
  border-right: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  box-sizing: border-box;
  padding-left: 0.3rem;
  flex: 0 0 ${ADDRESS_COL_WIDTH};
  font-family: 'Cascadia', monospace;
  font-size: 0.75rem;
  color: var(--color-var-text-address);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface Props {
  selected: boolean;
  selectedUUID: string;
  logUuid: (uuid: string) => void;
  uuid: string;
}

const VariableTableVarRow: React.FC<Props> = (props: Props) => {
  const { selected, selectedUUID, logUuid, uuid } = props;
  const [showSubVars, setShowSubVars] = useState(false);
  const variableName = useSelector((state: Store) => state.variables[uuid].name);
  const type = useSelector((state: Store) => state.variables[uuid].type);
  const address = useSelector((state: Store) => state.variables[uuid].address);
  const subVars = useSelector((state: Store) => state.variables[uuid].subVars);
  const dispatch = useDispatch();

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (e.key !== 'Delete') return;
    dispatch({ type: DELETE_VARIABLE, payload: { uuid: uuid } });
  };

  return (
    <Fragment>
      <Row
        onKeyDown={(e) => handleOnKeyDown(e)}
        tabIndex={0}
        bgColor={selected ? VAR_SELECTED : 'none'}
        onClick={() => logUuid(uuid)}
      >
        <VariableName selected={selected} uuid={uuid} />
        <Type>{type}</Type>
        <Address>{address || '—'}</Address>
        <VariableValue
          showSubvars={() => setShowSubVars(!showSubVars)}
          showSubVars={showSubVars}
          uuid={uuid}
        />
        {selected ? <VariableDelete uuid={uuid} /> : <DeletePlaceholder />}
      </Row>
      {showSubVars &&
        Object.keys(subVars).map((subVarName: string, index: number) => (
          <VariableTableSubVarRow
            key={`${variableName}SubVar${index}`}
            logUuid={(uuid) => logUuid(uuid)}
            name={subVarName}
            parrentUuid={uuid}
            selected={selectedUUID === subVars[subVarName]}
            uuid={subVars[subVarName]}
          />
        ))}
    </Fragment>
  );
};

export default VariableTableVarRow;
