import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, FormControl,
  InputLabel, Grid,
} from '@mui/material';
import { Store } from '../../interface';
import { UPDATE_SCENE_BLOCK } from '../../store/types';

interface Props {
  blockId: string;
  open: boolean;
  onClose: () => void;
}

const PropertiesSceneBlock: React.FC<Props> = ({ blockId, open, onClose }) => {
  const dispatch = useDispatch();
  const block = useSelector((state: Store) => state.scene.blocks[blockId]);
  const variables = useSelector((state: Store) => state.variables);

  if (!block) return null;

  const update = (patch: Record<string, unknown>) => {
    dispatch({ type: UPDATE_SCENE_BLOCK, payload: { id: blockId, patch } });
  };

  const updateAxes = (field: 'forwardVariableId' | 'backwardVariableId', value: string | null) => {
    dispatch({
      type: UPDATE_SCENE_BLOCK,
      payload: { id: blockId, patch: { axes: { ...block.axes, [field]: value || null } } },
    });
  };

  const varEntries = [['', '— Bağlantısız —'], ...Object.entries(variables).map(([id, v]) => [id, v.name])];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Blok Özellikleri — {block.type}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              label="Etiket"
              value={block.label}
              onChange={(e) => update({ label: e.target.value })}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Hız (px/s)"
              type="number"
              value={block.speedPxPerSec}
              onChange={(e) => update({ speedPxPerSec: Number(e.target.value) })}
              fullWidth
              size="small"
              inputProps={{ min: 1, max: 2000 }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField label="Min X" type="number" value={block.minX}
              onChange={(e) => update({ minX: Number(e.target.value) })} fullWidth size="small" />
          </Grid>
          <Grid item xs={3}>
            <TextField label="Max X" type="number" value={block.maxX}
              onChange={(e) => update({ maxX: Number(e.target.value) })} fullWidth size="small" />
          </Grid>
          <Grid item xs={3}>
            <TextField label="Min Y" type="number" value={block.minY}
              onChange={(e) => update({ minY: Number(e.target.value) })} fullWidth size="small" />
          </Grid>
          <Grid item xs={3}>
            <TextField label="Max Y" type="number" value={block.maxY}
              onChange={(e) => update({ maxY: Number(e.target.value) })} fullWidth size="small" />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel>İleri / Yukarı Değişkeni</InputLabel>
              <Select
                label="İleri / Yukarı Değişkeni"
                value={block.axes.forwardVariableId ?? ''}
                onChange={(e) => updateAxes('forwardVariableId', e.target.value)}
              >
                {varEntries.map(([id, name]) => (
                  <MenuItem key={id} value={id}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Geri / Aşağı Değişkeni</InputLabel>
              <Select
                label="Geri / Aşağı Değişkeni"
                value={block.axes.backwardVariableId ?? ''}
                onChange={(e) => updateAxes('backwardVariableId', e.target.value)}
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

export default PropertiesSceneBlock;
