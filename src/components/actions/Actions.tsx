import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as Delete } from '../../svg/binDelete.svg';
import { ReactComponent as ArrowDown } from '../../svg/arrowDownRound.svg';
import { ReactComponent as ArrowLeft } from '../../svg/arrowLeftRound.svg';
import { ReactComponent as ArrowRight } from '../../svg/arrowRightRound.svg';
import { ReactComponent as ArrowUp } from '../../svg/arrowUpRound.svg';
import { Store } from '../../interface';
import {
  DELETE_OBJECT,
  MOVE_OBJECT_DOWN,
  MOVE_OBJECT_LEFT,
  MOVE_OBJECT_RIGHT,
  MOVE_OBJECT_UP,
} from '../../store/types';
import { findParrentRung } from '../../helpers/simulationObjects';
import ActionButton from './ActionButton';
import EditElementButton from './EditElementButton';
import SimulateButton from './SimulateButton';
import { Box } from '@mui/material';
import { logEvent } from '../../helpers/firebase';
import { BG_ACTIONS } from '../../consts/colors';

export default function Actions() {
  const objectUuid = useSelector((state: Store) => state.temp.selectedUuid);
  const rungs = useSelector((state: Store) => state.rungs);
  const elements = useSelector((state: Store) => state.elements);
  const runglist = useSelector((state: Store) => state.runglist);
  const dispatch = useDispatch();
  const handleClick = (actionType: string) => {
    dispatch({ type: actionType });
    if (actionType !== DELETE_OBJECT) {
      logEvent('move_object_click');
    }
  };
  const isElement = Object.keys(elements).includes(objectUuid);
  const canMoveUp = runglist.indexOf(objectUuid) > 0;
  const canMoveDown =
    -1 < runglist.indexOf(objectUuid) && runglist.indexOf(objectUuid) < runglist.length - 1;
  const parrentRungUuid = findParrentRung(objectUuid, rungs);
  const rungElements = parrentRungUuid ? rungs[parrentRungUuid].elements : [];
  const canMoveLeft = isElement && rungElements.indexOf(objectUuid) > 0;
  const canMoveRight = isElement && rungElements.indexOf(objectUuid) < rungElements.length - 1;

  return (
    <Box
      sx={{
        background: BG_ACTIONS,
        display: 'flex',
        flex: '1 1 auto',
        gridArea: 'actions',
        alignItems: 'center',
      }}
    >
      <ActionButton
        enabled={objectUuid !== ''}
        onClick={() => handleClick(DELETE_OBJECT)}
        Svg={Delete}
        title="Sil (Delete)"
      />
      <div className="toolbar-divider" />
      <ActionButton enabled={canMoveUp} onClick={() => handleClick(MOVE_OBJECT_UP)} Svg={ArrowUp} title="Yukarı Taşı" />
      <ActionButton
        enabled={canMoveDown}
        onClick={() => handleClick(MOVE_OBJECT_DOWN)}
        Svg={ArrowDown}
        title="Aşağı Taşı"
      />
      <ActionButton
        enabled={canMoveLeft}
        onClick={() => handleClick(MOVE_OBJECT_LEFT)}
        Svg={ArrowLeft}
        title="Sola Taşı"
      />
      <ActionButton
        enabled={canMoveRight}
        onClick={() => handleClick(MOVE_OBJECT_RIGHT)}
        Svg={ArrowRight}
        title="Sağa Taşı"
      />
      <div className="toolbar-divider" />
      <EditElementButton />
      <SimulateButton />
    </Box>
  );
}
