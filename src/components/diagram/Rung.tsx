import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RungDropResult, Store } from '../../interface';
import { ELEMENT, OUT_ON, SELECTED } from '../../consts/colors';
import { OTE, OTL, OTN, OTU } from '../../consts/elementTypes';
import { DROP_RUNG, SET_RUNG_COMMENT } from '../../store/types';
import Branch from './Branch';
import DraggableBlock from './DraggableBlock';
import Wire from './Wire';
import { Box } from '@mui/material';
import { useDrag, useDrop } from 'react-dnd';
import { RUNG, TOOL_RUNG } from '../../consts/itemTypes';
import PowerRail from './PowerRail';
import RungHelp from './RungHelp';
import { nanoid } from 'nanoid';
import styled from 'styled-components';

const NetworkHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.15rem 0.4rem 0.15rem 0.3rem;
  border-top: 1px solid rgba(128, 128, 128, 0.2);
  background: rgba(0, 0, 0, 0.04);
`;

const NetworkLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: rgba(128, 128, 128, 0.7);
  white-space: nowrap;
  user-select: none;
  text-transform: uppercase;
`;

const CommentInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.75rem;
  color: rgba(128, 128, 128, 0.85);
  font-style: italic;
  padding: 0.1rem 0.25rem;
  border-radius: 3px;
  transition: background 0.15s, color 0.15s;
  &::placeholder {
    color: rgba(128, 128, 128, 0.35);
  }
  &:focus {
    background: rgba(25, 118, 210, 0.06);
    color: inherit;
    font-style: normal;
  }
`;

interface Props {
  index: number;
  mobileUI: boolean;
  uuid: string;
}

export default function Rung({ index, mobileUI, uuid }: Props) {
  const dispatch = useDispatch();
  const { elements, out, comment } = useSelector((state: Store) => state.rungs[uuid]);
  const [localComment, setLocalComment] = useState<string | null>(null);
  const displayComment = localComment !== null ? localComment : (comment ?? '');
  const diagramElements = useSelector((state: Store) => state.elements);
  const diagramBranches = useSelector((state: Store) => state.branches);
  const selectedUuid = useSelector((state: Store) => state.temp.selectedUuid);
  const simulation = useSelector((state: Store) => state.temp.simulation);
  const selected = selectedUuid === uuid;
  const fillLeft = simulation ? OUT_ON : selected ? SELECTED : ELEMENT;
  const fillRight = simulation ? (out ? OUT_ON : ELEMENT) : selected ? SELECTED : ELEMENT;
  const rungElementTypes = elements.map((rungElement) => diagramElements[rungElement]?.type);
  const coils = [OTE, OTL, OTU, OTN];
  const lastCoilGrpIndex = rungElementTypes.map((type) => (coils.includes(type) ? 'coil' : null)).lastIndexOf(null);
  const indexedElements = elements.map((element, index) => ({ element, blockIndex: index }));
  indexedElements.splice(lastCoilGrpIndex + 1, 0, {
    element: 'WIRE',
    blockIndex: lastCoilGrpIndex + 1,
  });
  const elementBeforeWire = elements[lastCoilGrpIndex];
  const elementBeforeWireOut = Object.keys(diagramBranches).includes(elementBeforeWire)
    ? diagramBranches[elementBeforeWire].out
    : Object.keys(diagramElements).includes(elementBeforeWire)
    ? diagramElements[elementBeforeWire].out
    : true;
  const wireColor = simulation ? (elementBeforeWireOut ? OUT_ON : ELEMENT) : selected ? SELECTED : ELEMENT;
  const displayRungHelp = index === 0 && elements.length === 0 && !mobileUI;
  const isOnlyElementOf1stRung = index === 0 && elements.length === 1;

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: RUNG,
      item: {},
      end: (item, monitor) => {
        const dropResult: RungDropResult | null = monitor.getDropResult();
        if (item && dropResult) {
          const { dropIndex } = dropResult;
          return dispatch({
            type: DROP_RUNG,
            payload: { dragRungId: uuid, dragIndex: index, dropIndex },
          });
        }
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [uuid, index],
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [RUNG, TOOL_RUNG],
      drop: (): RungDropResult => ({
        dropIndex: index,
      }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
      canDrop: () => {
        return !isDragging;
      },
    }),
    [index, uuid, elements, isDragging],
  );

  const combinedRef = (node: HTMLElement) => {
    drag(node);
    drop(node);
  };

  const getComponentName = (elementUuid: string) => {
    if (Object.keys(diagramBranches).includes(elementUuid)) return Branch;
    if (Object.keys(diagramElements).includes(elementUuid)) return DraggableBlock;
    return Wire;
  };

  const handleOnCLick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    return dispatch({
      type: 'SELECT_OBJECT',
      payload: { uuid },
    });
  };

  const handleCommentBlur = () => {
    if (localComment !== null) {
      dispatch({ type: SET_RUNG_COMMENT, payload: { uuid, comment: localComment } });
      setLocalComment(null);
    }
  };

  const handleCommentKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: isOver && !isDragging ? 'rgba(236, 158, 20, 0.2)' : 'transparent',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '0.25em',
        position: 'relative',
        opacity: isDragging ? 0.5 : 1,
        outline: 'none',
      }}
      onClick={(e) => handleOnCLick(e)}
      ref={combinedRef}
    >
      <NetworkHeader onClick={(e) => e.stopPropagation()}>
        <NetworkLabel>Network {index + 1}</NetworkLabel>
        <CommentInput
          value={displayComment}
          placeholder="Açıklama ekle..."
          onChange={(e) => setLocalComment(e.target.value)}
          onFocus={() => setLocalComment(comment ?? '')}
          onBlur={handleCommentBlur}
          onKeyDown={handleCommentKeyDown}
        />
      </NetworkHeader>
      <Box sx={{ display: 'flex' }}>
        <PowerRail animated={simulation} elementsLength={elements.length} fillColor={fillLeft} position={'left'} rungId={uuid} />
        <Box
          sx={{
            display: 'flex',
            py: '0.25em',
            minWidth: 'calc(100% - 0.5em)',
            flexShrink: 0,
          }}
        >
          {indexedElements.map(({ element, blockIndex }, index) => {
            const Component = getComponentName(element);
            return (
              <Component
                key={nanoid()}
                blockIndex={blockIndex}
                isOnlyElementOf1stRung={isOnlyElementOf1stRung}
                flexIndex={index}
                uuid={element}
                parrentSelected={selected}
                parrentId={uuid}
                color={wireColor}
              />
            );
          })}
        </Box>
        <PowerRail animated={simulation && out} elementsLength={elements.length} fillColor={fillRight} position={'right'} rungId={uuid} />
        {displayRungHelp && <RungHelp />}
      </Box>
    </Box>
  );
}
