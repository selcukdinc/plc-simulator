import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Store, AppTab } from '../../interface';
import { SET_ACTIVE_TAB } from '../../store/types';
import styled from 'styled-components';

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid var(--color-border, rgba(0,0,0,0.12));
  background: var(--color-bg, transparent);
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: ${(p) => (p.$active ? 600 : 400)};
  color: ${(p) => (p.$active ? 'var(--color-primary, #1976d2)' : 'var(--color-text, inherit)')};
  border: none;
  border-bottom: 3px solid ${(p) => (p.$active ? 'var(--color-primary, #1976d2)' : 'transparent')};
  background: none;
  cursor: pointer;
  transition: var(--transition-fast, color 0.15s);
  white-space: nowrap;

  &:hover {
    background: var(--color-hover, rgba(0,0,0,0.04));
  }
`;

const TABS: { id: AppTab; label: string }[] = [
  { id: 'LADDER', label: 'Ladder Diyagramı' },
  { id: 'CONTROL_PANEL', label: 'Kumanda' },
  { id: 'POWER_CIRCUIT', label: 'Güç Devresi' },
  { id: 'SCENE', label: 'Gerçek Hayat' },
];

const TabBar: React.FC = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: Store) => state.misc.activeTab ?? 'LADDER');

  return (
    <TabsContainer>
      {TABS.map((tab) => (
        <Tab
          key={tab.id}
          $active={activeTab === tab.id}
          onClick={() => dispatch({ type: SET_ACTIVE_TAB, payload: tab.id })}
        >
          {tab.label}
        </Tab>
      ))}
    </TabsContainer>
  );
};

export default TabBar;
