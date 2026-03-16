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
import { SET_POWER_ELEMENT_VARIABLE } from '../../store/types';

interface Props {
  elementId: string;
  open: boolean;
  onClose: () => void;
}

const PowerElementVariableDialog: React.FC<Props> = ({ elementId, open, onClose }) => {
  const dispatch = useDispatch();
  const variables = useSelector((state: Store) => state.variables);
  const element = useSelector((state: Store) => state.powerCircuit.elements[elementId]);

  const handleSelect = (variableId: string | null) => {
    dispatch({ type: SET_POWER_ELEMENT_VARIABLE, payload: { elementId, variableId } });
    onClose();
  };

  const varEntries = Object.entries(variables);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Kontaktör Değişkeni Seç</DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {varEntries.length === 0 ? (
          <Typography sx={{ p: 2, color: 'text.secondary' }}>
            Henüz değişken tanımlanmamış. Ladder sekmesinden değişken ekleyin.
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

export default PowerElementVariableDialog;
