import React, { useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { ADD_VARIABLE } from '../../store/types';
import { BOOL, COUNTER, NUMBER, TIME, TIMER } from '../../consts/variables';
import { Store } from '../../interface';
import { BG_ERROR } from '../../consts/colors';
import NewVarHelp from './NewVarHelp';

const SectionHeader = styled.div`
  background: var(--color-bg-var-header);
  color: var(--color-var-header-text);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.3rem 0.6rem;
  text-transform: uppercase;
  user-select: none;
  border-top: 1px solid rgba(0,0,0,0.15);
`;
const FormRow = styled.div`
  display: flex;
  align-items: stretch;
  background: var(--color-bg-add-var);
  border-top: 1px solid var(--color-var-table-border);
  padding: 0.35rem 0.4rem;
  gap: 0.3rem;
  flex-wrap: wrap;
`;
const FieldLabel = styled.label`
  font-size: 0.65rem;
  font-weight: 600;
  color: #7a8a9a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 0.15rem;
`;
const FieldGroup = styled.div<{ grow?: boolean }>`
  display: flex;
  flex-direction: column;
  ${(props) => props.grow ? 'flex: 1 1 80px;' : ''}
`;
const StyledInput = styled.input<{ nameUsed?: boolean }>`
  background: ${(props) => (props.nameUsed ? BG_ERROR : '#ffffff')};
  border: 1px solid var(--color-var-table-border);
  border-radius: 3px;
  box-sizing: border-box;
  font-size: 0.8rem;
  height: 1.75rem;
  padding: 0 0.4rem;
  width: 100%;
  color: inherit;
  :focus {
    outline: none;
    border-color: var(--color-bg-var-header);
  }
  [data-theme="dark"] & {
    background: ${(props) => (props.nameUsed ? BG_ERROR : '#1e2535')};
  }
`;
const StyledSelect = styled.select`
  background: #ffffff;
  border: 1px solid var(--color-var-table-border);
  border-radius: 3px;
  box-sizing: border-box;
  font-size: 0.8rem;
  height: 1.75rem;
  padding: 0 0.25rem;
  width: 100%;
  color: inherit;
  :focus {
    outline: none;
    border-color: var(--color-bg-var-header);
  }
`;
const AddButton = styled.button<{ disabled?: boolean }>`
  background: ${(props) => props.disabled ? '#9ab8b8' : 'var(--color-add-btn-bg)'};
  color: var(--color-add-btn-text);
  border: none;
  border-radius: 3px;
  cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 0.75rem;
  font-weight: 700;
  height: 1.75rem;
  letter-spacing: 0.06em;
  padding: 0 0.75rem;
  align-self: flex-end;
  transition: filter 120ms ease;
  white-space: nowrap;
  &:hover:not(:disabled) {
    filter: brightness(1.1);
  }
`;

interface Props {
  displayVarHelp: boolean;
  mobileUI: boolean;
}

export default function VariableTableFoot({ displayVarHelp, mobileUI }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState(BOOL);
  const [address, setAddress] = useState('');
  const dispatch = useDispatch();
  const variableNames = useSelector(
    (state: Store) => Object.keys(state.variables).map((uuid) => state.variables[uuid].name),
    shallowEqual,
  );
  const nameUsed = variableNames.includes(name);
  const disableSubmit = nameUsed || name === '';
  const inputEl = useRef<HTMLInputElement>(null);

  const handleOnClick = () => {
    if (name === '') return;
    dispatch({ type: ADD_VARIABLE, payload: { name, type, address } });
    setName('');
    setAddress('');
    inputEl.current && inputEl.current.focus();
  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        !disableSubmit && handleOnClick();
        break;
      case 'Escape':
        setName('');
        break;
    }
  };

  return (
    <>
      {displayVarHelp && <NewVarHelp />}
      <SectionHeader>Add New Variable</SectionHeader>
      <FormRow>
        <FieldGroup grow>
          <FieldLabel htmlFor="new-var-name-input">Name</FieldLabel>
          <StyledInput
            aria-label="New variable name"
            autoComplete="off"
            nameUsed={nameUsed}
            ref={inputEl}
            type="text"
            id="new-var-name-input"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleOnKeyDown}
            placeholder="Variable name"
            value={name}
            data-intro="Add a new PLC variable"
            data-step="1"
            formNoValidate
          />
        </FieldGroup>
        <FieldGroup>
          <FieldLabel htmlFor="new-var-type-select">Type</FieldLabel>
          <StyledSelect
            aria-label="New variable type"
            name="varType"
            id="new-var-type-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value={BOOL}>{BOOL}</option>
            <option value={NUMBER}>{NUMBER}</option>
            <option value={COUNTER}>{COUNTER}</option>
            <option value={TIME}>{TIME}</option>
            <option value={TIMER}>{TIMER}</option>
          </StyledSelect>
        </FieldGroup>
        <FieldGroup>
          <FieldLabel htmlFor="new-var-address-input">Address</FieldLabel>
          <StyledInput
            aria-label="New variable address"
            autoComplete="off"
            type="text"
            id="new-var-address-input"
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={handleOnKeyDown}
            placeholder="e.g. I0.0"
            value={address}
            style={{ width: '5rem' }}
          />
        </FieldGroup>
        <AddButton disabled={disableSubmit} onClick={handleOnClick}>
          ADD
        </AddButton>
      </FormRow>
    </>
  );
}
