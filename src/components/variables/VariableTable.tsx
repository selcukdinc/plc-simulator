import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import styled from "styled-components";

import { Store } from "../../interface";
import { BG_VARIABLES, VAR_TABLE_BORDER } from "../../consts/colors";

import VariableTableFoot from "./VariableTableFoot";
import VariableTableVarRow from "./VariableTableVarRow";
import { BORDER_SIZE, DELETE_COL_WIDTH, TYPE_COL_WIDTH, VALUE_COL_WIDTH, ADDRESS_COL_WIDTH } from "../../consts/variableTableStyles";

const PanelHeader = styled.div`
  background: var(--color-bg-var-header);
  color: var(--color-var-header-text);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.45rem 0.6rem;
  text-transform: uppercase;
  user-select: none;
`;
const Body = styled.tbody`
  display: block;
  height: 100%;
  margin-left: 0.1rem;
  overflow-y: auto;
`;
const Container = styled.div`
  background: ${BG_VARIABLES};
  flex: 1;
  min-width: 300px;
  overflow: hidden;
`;
const DeletePlaceholder = styled.th`
  flex: 0 0 ${DELETE_COL_WIDTH};
`;
const Header = styled.thead`
  display: block;
  border-bottom: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  background: var(--color-bg-variables);
`;
const ColName = styled.th`
  border-right: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  flex-basis: 100%;
  margin-left: 0.3rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-var-text-muted);
  padding: 0.25rem 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;
const ColType = styled.th`
  border-right: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  box-sizing: border-box;
  padding-left: 0.3rem;
  flex: 0 0 ${TYPE_COL_WIDTH};
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-var-text-muted);
  padding: 0.25rem 0.3rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;
const ColAddress = styled.th`
  border-right: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  box-sizing: border-box;
  flex: 0 0 ${ADDRESS_COL_WIDTH};
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-var-text-muted);
  padding: 0.25rem 0.3rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;
const ColValue = styled.th`
  border-right: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  box-sizing: border-box;
  flex: 0 0 ${VALUE_COL_WIDTH};
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-var-text-muted);
  padding: 0.25rem 0.3rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;
const Row = styled.tr`
  display: flex;
`;
const Table = styled.table`
  border-collapse: collapse;
  box-sizing: border-box;
  color: var(--color-var-text);
  display: table;
  font-size: 0.81rem;
  height: 100%;
  outline: none;
  table-layout: fixed;
  text-align: left;
  width: 100%;
`;
const VariableTab = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: variables;
  height: 100%;
`;

interface Props {
  mobileUI: boolean;
}

const VariableTable: React.FC<Props> = ({ mobileUI }: Props) => {
  const variableIDs = useSelector(
    (state: Store) =>
      Object.keys(state.variables)
        .map((id) => id)
        .filter((id) => !state.variables[id].parrent),
    shallowEqual,
  );
  const [selectedUUID, setSelectedUUID] = useState("");
  const displayVarHelp = variableIDs.length === 0;

  return (
    <VariableTab>
      <PanelHeader>Variables &amp; I/O</PanelHeader>
      <Container>
        <Table>
          <Header>
            <Row>
              <ColName>Name</ColName>
              <ColType>Type</ColType>
              <ColAddress>Address</ColAddress>
              <ColValue>Value</ColValue>
              <DeletePlaceholder />
            </Row>
          </Header>
          <Body>
            {variableIDs.map((uuid: string, index: number) => {
              return (
                <VariableTableVarRow
                  selected={selectedUUID === uuid}
                  selectedUUID={selectedUUID}
                  key={`varRow_${index}`}
                  logUuid={(uuid) => setSelectedUUID(uuid)}
                  uuid={uuid}
                />
              );
            })}
          </Body>
        </Table>
      </Container>
      <VariableTableFoot displayVarHelp={displayVarHelp} mobileUI={mobileUI} />
    </VariableTab>
  );
};

export default VariableTable;
