import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { Store } from '../../interface';
import { UPDATE_CONTROL_ELEMENT } from '../../store/types';

interface Props {
  elementId: string;
  open: boolean;
  onClose: () => void;
}

const ControlElementVariableDialog: React.FC<Props> = ({ elementId, open, onClose }) => {
  const dispatch = useDispatch();
  const variables = useSelector((state: Store) => state.variables);
  const element = useSelector((state: Store) => state.controlPanel.elements[elementId]);

  const handleSelect = (variableId: string | null) => {
    dispatch({
      type: UPDATE_CONTROL_ELEMENT,
      payload: { id: elementId, patch: { variableId } },
    });
    onClose();
  };

  const varEntries = Object.entries(variables);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Değişken Seç</DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {varEntries.length === 0 ? (
          <Typography sx={{ p: 2, color: 'text.secondary' }}>
            Henüz değişken tanımlanmamış. Önce Ladder sekmesinden değişken ekleyin.
          </Typography>
        ) : (
          <List dense>
            {varEntries.map(([id, variable]) => (
              <ListItemButton
                key={id}
                selected={element?.variableId === id}
                onClick={() => handleSelect(id)}
              >
                <ListItemText
                  primary={variable.name}
                  secondary={variable.address ?? variable.type}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        {element?.variableId && (
          <Button color="warning" onClick={() => handleSelect(null)}>
            Bağlantıyı Kaldır
          </Button>
        )}
        <Button onClick={onClose}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ControlElementVariableDialog;
