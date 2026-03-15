import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthState } from 'react-firebase-hooks/auth';

import { Store } from '../../interface';
import { UNDO, REDO, LOAD_EMPTY, LOAD_SAMPLE } from '../../store/types';
import { BG_MENU } from '../../consts/colors';
import { auth, firebaseEnabled, logEvent } from '../../helpers/firebase';
import { useColorMode } from '../../App';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import useOnline from './useOnline';
import { ReactComponent as FileText } from '../../svg/fileText.svg';
import { ReactComponent as FileEmpty } from '../../svg/fileEmpty.svg';
import { ReactComponent as Redo } from '../../svg/redo.svg';
import { ReactComponent as Undo } from '../../svg/undo.svg';
import { ReactComponent as SvgWifiOff } from '../../svg/wifi-off.svg';
import SvgButton from '../SvgButton';
import ExportButton from './ExportButton';
import ImportButton from './ImportButton';
import ShareButton from './ShareButton';
import SignButton from './SignButton';
import SignOut from './SignOut';
import Help from './Help';
import { Alert, Box, Button, IconButton, Snackbar } from '@mui/material';
import { Close } from '@mui/icons-material';

export default function Menu() {
  const canRedo = useSelector((state: Store) => state.temp.canRedo);
  const canUndo = useSelector((state: Store) => state.temp.canUndo);
  const [popupOpen, setPopupOpen] = useState(false);
  const [action, setAction] = useState('');
  const [user] = useAuthState(auth);
  const online = useOnline();
  const dispatch = useDispatch();
  const { mode, toggleColorMode } = useColorMode();

  const dispatchAction = (actionType: string) => {
    logEvent('load_diagram', { action: actionType });
    dispatch({ type: actionType });
    setPopupOpen(false);
  };
  const openPopup = (action: string) => {
    logEvent('open_load_popup');
    setAction(action);
    setPopupOpen(true);
  };

  return (
    <Box
      sx={{
        backgroundColor: BG_MENU,
        display: 'flex',
        flex: '999 1 auto',
        gridArea: 'menu',
        alignItems: 'center',
      }}
    >
      <SvgButton onClick={() => dispatchAction(UNDO)} disabled={!canUndo} Svg={Undo} title="Geri Al" />
      <SvgButton onClick={() => dispatchAction(REDO)} disabled={!canRedo} Svg={Redo} title="İleri Al" />
      <div className="toolbar-divider" />
      <SvgButton onClick={() => openPopup(LOAD_SAMPLE)} Svg={FileText} title="Örnek Proje Yükle" />
      <SvgButton onClick={() => openPopup(LOAD_EMPTY)} Svg={FileEmpty} title="Boş Proje Yükle" />
      <div className="toolbar-divider" />
      <ExportButton />
      <ImportButton />
      {online && firebaseEnabled ? (
        user ? (
          <ShareButton user={user} />
        ) : (
          <SignButton />
        )
      ) : (
        <SvgButton disabled={true} onClick={() => null} Svg={SvgWifiOff} title="Çevrimdışı" />
      )}
      <SignOut />
      <Help />
      {/*       
      <IconButton onClick={toggleColorMode} size="small" sx={{ margin: '0.25rem', color: 'rgba(255,255,255,0.7)' }} title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
      */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
      >
        <Alert
          action={
            <>
              <Button onClick={() => dispatchAction(action)} color="inherit" size="small">
                <strong>LOAD</strong>
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setPopupOpen(false)}
              >
                <Close fontSize="small" />
              </IconButton>
            </>
          }
          severity={'warning'}
          color={'warning'}
          variant="filled"
          onClose={() => setPopupOpen(false)}
        >
          {`${action.toLowerCase().replace('load_', 'Load ')} project?`}
        </Alert>
      </Snackbar>
    </Box>
  );
}
