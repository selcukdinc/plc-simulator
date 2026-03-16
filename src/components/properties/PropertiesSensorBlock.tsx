import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, FormControl,
  InputLabel, Grid,
} from '@mui/material';
import { Store } from '../../interface';
import { UPDATE_SENSOR_BLOCK } from '../../store/types';
import { SENSOR_TYPES } from '../../consts/sceneBlockTypes';

interface Props {
  sensorId: string;
  open: boolean;
  onClose: () => void;
}

const SENSOR_LABELS: Record<string, string> = {
  LIMIT_SWITCH: 'Limit Switch',
  PHOTOELECTRIC: 'Fotoelektrik',
  PROXIMITY: 'Proximity',
};

const PropertiesSensorBlock: React.FC<Props> = ({ sensorId, open, onClose }) => {
  const dispatch = useDispatch();
  const sensor = useSelector((state: Store) => state.scene.sensors[sensorId]);
  const variables = useSelector((state: Store) => state.variables);

  if (!sensor) return null;

  const update = (patch: Record<string, unknown>) => {
    dispatch({ type: UPDATE_SENSOR_BLOCK, payload: { id: sensorId, patch } });
  };

  const varEntries = [['', '— Bağlantısız —'], ...Object.entries(variables).map(([id, v]) => [id, v.name])];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Sensör Özellikleri — {SENSOR_LABELS[sensor.type] ?? sensor.type}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              label="Etiket"
              value={sensor.label}
              onChange={(e) => update({ label: e.target.value })}
              fullWidth size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Sensör Tipi</InputLabel>
              <Select
                label="Sensör Tipi"
                value={sensor.type}
                onChange={(e) => update({ type: e.target.value })}
              >
                {SENSOR_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>{SENSOR_LABELS[t]}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField label="Tetikleme Genişliği (px)" type="number" value={sensor.triggerWidth}
              onChange={(e) => update({ triggerWidth: Number(e.target.value) })} fullWidth size="small"
              inputProps={{ min: 4, max: 400 }} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Tetikleme Yüksekliği (px)" type="number" value={sensor.triggerHeight}
              onChange={(e) => update({ triggerHeight: Number(e.target.value) })} fullWidth size="small"
              inputProps={{ min: 4, max: 400 }} />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Tetikleme Değişkeni</InputLabel>
              <Select
                label="Tetikleme Değişkeni"
                value={sensor.variableId ?? ''}
                onChange={(e) => update({ variableId: e.target.value || null })}
              >
                {varEntries.map(([id, name]) => (
                  <MenuItem key={id} value={id}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PropertiesSensorBlock;
