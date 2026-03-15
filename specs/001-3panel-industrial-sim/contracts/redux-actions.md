# Redux Action Contracts: 3-Panel Industrial Sim

**Branch**: `001-3panel-industrial-sim` | **Date**: 2026-03-16

Bu dosya yeni panellerin Redux action'larını ve state değişim sözleşmelerini tanımlar.
Tüm action'lar `store/types.ts`'e eklenir; reducer case'leri `store/simulator.ts`'e yazılır.

---

## Sekme Yönetimi

### SET_ACTIVE_TAB
```typescript
{
  type: 'SET_ACTIVE_TAB',
  payload: 'LADDER' | 'CONTROL_PANEL' | 'POWER_CIRCUIT' | 'SCENE'
}
// Etkisi: misc.activeTab güncellenir
```

---

## Kumanda Paneli (controlPanel)

### ADD_CONTROL_ELEMENT
```typescript
{
  type: 'ADD_CONTROL_ELEMENT',
  payload: {
    id: string;           // UUID — dispatch öncesi üretilir
    elementType: ControlElementType;
    x: number;
    y: number;
    label: string;
  }
}
// Etkisi: controlPanel.elements[id] oluşturulur; variableId: null
```

### REMOVE_CONTROL_ELEMENT
```typescript
{
  type: 'REMOVE_CONTROL_ELEMENT',
  payload: { id: string }
}
// Etkisi: controlPanel.elements[id] silinir
```

### UPDATE_CONTROL_ELEMENT
```typescript
{
  type: 'UPDATE_CONTROL_ELEMENT',
  payload: { id: string; patch: Partial<Omit<ControlElement, 'id'>> }
}
// Etkisi: controlPanel.elements[id] patch ile güncellenir
// Kullanım: etiket düzenleme, konum değiştirme, variableId atama
```

### CONTROL_BUTTON_PRESS / CONTROL_BUTTON_RELEASE
```typescript
{ type: 'CONTROL_BUTTON_PRESS',   payload: { elementId: string } }
{ type: 'CONTROL_BUTTON_RELEASE', payload: { elementId: string } }
// Etkisi:
//   PRESS → bağlı variable.value = true
//   RELEASE → PUSH_BUTTON türünde bağlı variable.value = false
//             TOGGLE_SWITCH türünde değer değişmez (TOGGLE_SWITCH_CLICK kullanılır)
```

### TOGGLE_SWITCH_CLICK
```typescript
{
  type: 'TOGGLE_SWITCH_CLICK',
  payload: { elementId: string }
}
// Etkisi: bağlı variable.value = !variable.value
```

---

## Güç Devresi (powerCircuit)

### ADD_POWER_ELEMENT
```typescript
{
  type: 'ADD_POWER_ELEMENT',
  payload: {
    id: string;
    elementType: PowerElementType;
    x: number;
    y: number;
    label: string;
  }
}
// Etkisi: powerCircuit.elements[id] oluşturulur; terminals otomatik eklenir
```

### REMOVE_POWER_ELEMENT
```typescript
{
  type: 'REMOVE_POWER_ELEMENT',
  payload: { id: string }
}
// Etkisi: powerCircuit.elements[id] silinir; bu elemana bağlı tüm cables silinir
```

### MOVE_POWER_ELEMENT
```typescript
{
  type: 'MOVE_POWER_ELEMENT',
  payload: { id: string; x: number; y: number }
}
// Etkisi: powerCircuit.elements[id].x/y güncellenir; kablo bağlantıları korunur
```

### ADD_CABLE
```typescript
{
  type: 'ADD_CABLE',
  payload: {
    id: string;
    fromTerminalId: string;
    toTerminalId: string;
  }
}
// Etkisi: powerCircuit.cables[id] oluşturulur
// Kural: aynı terminale birden fazla kablo bağlanamaz → reducer ignore eder
```

### REMOVE_CABLE
```typescript
{
  type: 'REMOVE_CABLE',
  payload: { id: string }
}
```

### SET_POWER_ELEMENT_VARIABLE
```typescript
{
  type: 'SET_POWER_ELEMENT_VARIABLE',
  payload: { elementId: string; variableId: string | null }
}
// Etkisi: powerCircuit.elements[elementId].variableId güncellenir
// Yalnızca CONTACTOR için anlamlı; diğer tipler için null kabul edilir
```

---

## Gerçek Hayat Sahnesi (scene)

### ADD_SCENE_BLOCK
```typescript
{
  type: 'ADD_SCENE_BLOCK',
  payload: {
    id: string;
    blockType: SceneBlockType;
    x: number;
    y: number;
    label: string;
    speedPxPerSec: number; // varsayılan: 100
  }
}
// Etkisi: scene.blocks[id] oluşturulur; axes: { forwardVariableId: null, ... }
```

### REMOVE_SCENE_BLOCK
```typescript
{
  type: 'REMOVE_SCENE_BLOCK',
  payload: { id: string }
}
```

### UPDATE_SCENE_BLOCK
```typescript
{
  type: 'UPDATE_SCENE_BLOCK',
  payload: { id: string; patch: Partial<Omit<SceneBlock, 'id' | 'targetX' | 'targetY'>> }
}
// Kullanım: label, hız, sınır ve variable atamaları
```

### SET_SCENE_BLOCK_TARGET
```typescript
{
  type: 'SET_SCENE_BLOCK_TARGET',
  payload: { id: string; targetX: number; targetY: number }
}
// SADECE cycleScan.ts içinden dispatch edilir
// Etkisi: scene.blocks[id].targetX/Y güncellenir → rAF animasyonu yakalar
```

### ADD_SENSOR_BLOCK
```typescript
{
  type: 'ADD_SENSOR_BLOCK',
  payload: {
    id: string;
    sensorType: SensorType;
    x: number;
    y: number;
    label: string;
    triggerWidth: number;    // varsayılan: 20px
    triggerHeight: number;   // varsayılan: 20px
  }
}
```

### REMOVE_SENSOR_BLOCK
```typescript
{
  type: 'REMOVE_SENSOR_BLOCK',
  payload: { id: string }
}
```

### UPDATE_SENSOR_BLOCK
```typescript
{
  type: 'UPDATE_SENSOR_BLOCK',
  payload: { id: string; patch: Partial<Omit<SensorBlock, 'id'>> }
}
```

---

## Simülasyon Durdurma (mevcut STOP_SIMULATION genişlemesi)

Mevcut `STOP_SIMULATION` action'ına ek etki eklenir:
- Tüm `PUSH_BUTTON` bağlı değişkenler → false
- Tüm sensor-triggered değişkenler → false
- `temp.powerCircuitEnergized` → boş Set
- `scene.blocks[*].targetX/Y` → mevcut `x/y` değerine eşitlenir (dondurulur)

---

## cycleScan Entegrasyon Sözleşmesi

`cycleScan.ts` scan sonunda şu sırayla çalışır:

```
1. Mevcut PLC logic (rung tarama, timer/counter güncelleme)
2. evaluatePowerCircuitTopology(draft.powerCircuit)
   → draft.temp.powerCircuitEnergized = Set<elementId>
3. evaluateSceneBlocks(draft.scene, draft.variables)
   → sensör kesişimleri → draft.variables[sensorVarId].value güncellenir
   → hareket hedefleri → draft.scene.blocks[id].targetX/Y güncellenir
```

`evaluateSceneBlocks` saf fonksiyonu `helpers/evaluateSceneBlocks.ts`'te yaşar.
`evaluatePowerCircuitTopology` saf fonksiyonu `helpers/evaluatePowerCircuitTopology.ts`'te yaşar.
