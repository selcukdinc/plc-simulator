# Data Model: 3 Bölgeli Endüstriyel PLC Simülatör

**Branch**: `001-3panel-industrial-sim` | **Date**: 2026-03-16

---

## Genel Mimari

Mevcut Redux store root level'ına 3 yeni flat slice eklenir. Tüm yeni slice'lar
`interface.ts`'e, başlangıç değerleri `const.ts`'e, reducer case'leri `simulator.ts`'e,
action type sabitleri `types.ts`'e eklenir.

```
Store (mevcut + yeni)
├── runglist, rungs, branches, elements, variables   ← mevcut, değişmez
├── controlPanel                                      ← YENİ
├── powerCircuit                                      ← YENİ
├── scene                                             ← YENİ
├── misc                                              ← mevcut (tab durumu)
└── temp                                              ← mevcut (persist edilmez)
    └── powerCircuitEnergized: Set<string>            ← YENİ (derived, temp)
```

---

## 1. ControlPanel Slice

### ControlElement (KumandaElemanı)

Kumanda panelindeki tıklanabilir kontrol cihazı.

```typescript
type ControlElementType =
  | 'PUSH_BUTTON'      // basmalı buton (momentary) — bırakınca false
  | 'TOGGLE_SWITCH'    // toggle anahtar — durum korur
  | 'PILOT_LAMP'       // sinyal lambası — yalnızca görsel, tıklanamaz
  | 'EMERGENCY_STOP';  // acil stop (NC mantıklı toggle)

interface ControlElement {
  id: string;              // UUID
  type: ControlElementType;
  label: string;           // kullanıcı etiketi, örn. "START"
  x: number;               // piksel konumu, panel içinde
  y: number;
  variableId: string | null; // bağlı ladder değişken UUID; null = bağlantısız
  // pilot lamp için: read-only (variableId'nin değeri okunur, yazılmaz)
}

interface ControlPanel {
  elements: { [id: string]: ControlElement };
}
```

**Kurallar**:
- `PUSH_BUTTON`: mousedown → `variableId` true; mouseup → false (momentary)
- `TOGGLE_SWITCH`, `EMERGENCY_STOP`: click → değeri tersine çevirir
- `PILOT_LAMP`: `variableId`'nin ladder değerini yansıtır; kullanıcı tıklayamaz
- `variableId === null` → eleman "⚠ Değişken atanmamış" gösterir
- Silinmiş `variableId` → eleman "⚠ Değişken bulunamadı" gösterir

---

## 2. PowerCircuit Slice

### PowerElement (GüçDevreElemanı)

Güç devresindeki endüstriyel bileşen.

```typescript
type PowerElementType =
  | 'POWER_SOURCE'       // L1/L2/L3 giriş — enerjinin kaynağı
  | 'CONTACTOR'          // kontaktör — ladder coil ile bağlı
  | 'THERMAL_RELAY'      // termik röle — koruma elemanı
  | 'MOTOR'              // motor — güç tüketici
  | 'FUSE'               // sigorta — pasif, her zaman iletken
  | 'TERMINAL_BLOCK';    // klemens — birleştirme noktası

interface Terminal {
  id: string;        // UUID — terminal başına unique
  elementId: string; // bağlı olduğu eleman
  side: 'in' | 'out';
  index: number;     // birden fazla terminale sahip elemanlarda sıra
}

interface PowerElement {
  id: string;
  type: PowerElementType;
  label: string;           // örn. "KM1", "M1", "Q1"
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
  variableId: string | null; // CONTACTOR için ladder coil değişkeni; diğerleri null
  terminals: Terminal[];
}

interface Cable {
  id: string;
  fromTerminalId: string;
  toTerminalId: string;
}

interface PowerCircuit {
  elements: { [id: string]: PowerElement };
  cables: { [id: string]: Cable };
}
```

**Kurallar**:
- `POWER_SOURCE` her zaman enerjilidir (BFS başlangıç düğümü)
- `FUSE`, `TERMINAL_BLOCK`: kablo bağlıysa iletir (pasif)
- `CONTACTOR`: ladder `variableId` true ve topolojik bağlantı varsa iletir
- `THERMAL_RELAY`: şimdilik pasif (gelecek: overload simülasyonu)
- Topoloji doğrulaması: güç kaynağına kablo ile bağlı olmayan eleman enerjilenemez
- Kablo çizimi: aynı terminale ikinci kablo bağlanamaz (unique terminal constraint)

### Derived State (temp, persist edilmez)

```typescript
// temp slice'a eklenir:
powerCircuitEnergized: Set<string>; // enerjili PowerElement id'leri
```

---

## 3. Scene Slice

### SceneBlock (SahneBloğu)

Gerçek hayat sahnesindeki makine bloğu.

```typescript
type SceneBlockType =
  | 'CRANE_TROLLEY'     // vinç arabası (yatay hareket)
  | 'CRANE_HOOK'        // vinç kancası (dikey hareket, crane_trolley'e bağlı)
  | 'CONVEYOR'          // konveyör bandı
  | 'PNEUMATIC_CYL'     // pnömatik silindir (tek eksen)
  | 'LIFT_TABLE'        // kaldırma platformu (dikey)
  | 'SIGNAL_TOWER';     // ışık kulesi (animasyon yok, renk değişimi)

interface SceneBlockAxes {
  // Her eksen için ladder değişkeni ataması
  forwardVariableId: string | null;   // ileri/yukarı hareketi tetikler
  backwardVariableId: string | null;  // geri/aşağı hareketi tetikler
}

interface SceneBlock {
  id: string;
  type: SceneBlockType;
  label: string;
  // Pozisyon (kanvas koordinatı)
  x: number;
  y: number;
  // Animasyon hedef pozisyonu (scan güncellemesi; rAF interpolasyon yapar)
  targetX: number;
  targetY: number;
  // Hareket parametreleri
  speedPxPerSec: number;   // kullanıcı tanımlı hız (piksel/saniye)
  minX: number;            // hareket sınırları
  maxX: number;
  minY: number;
  maxY: number;
  // Değişken atamaları
  axes: SceneBlockAxes;
  // İlgili sinyal değişkeni (SIGNAL_TOWER için)
  signalVariableId?: string | null;
}
```

### SensorBlock (SensörBloğu)

Sahneye fiziksel olarak yerleştirilmiş algılayıcı.

```typescript
type SensorType =
  | 'LIMIT_SWITCH'        // limit switch — mekanik temas
  | 'PHOTOELECTRIC'       // fotoelektrik sensör — mesafe tabanlı
  | 'PROXIMITY';          // proximity sensör — mesafe tabanlı

interface SensorBlock {
  id: string;
  type: SensorType;
  label: string;
  x: number;
  y: number;
  // Tetikleme alanı (bounding box — piksel)
  triggerWidth: number;
  triggerHeight: number;
  // Bağlı ladder değişkeni (sensor tetiklenince TRUE yapılır)
  variableId: string | null;
}

interface Scene {
  blocks: { [id: string]: SceneBlock };
  sensors: { [id: string]: SensorBlock };
}
```

**Kurallar**:
- Bir makine bloğunun bounding box'ı bir sensörün tetikleme alanıyla kesişirse
  → sensörün `variableId` TRUE yapılır (cycleScan içinde hesaplanır)
- Simülasyon durduğunda tüm sensör değerleri FALSE'a sıfırlanır
- Silinmiş `variableId` → "⚠ Değişken bulunamadı"

---

## 4. Misc Slice Güncellemesi

Sekme durumu `misc` slice'ına eklenir (zaten mevcut).

```typescript
type AppTab = 'LADDER' | 'CONTROL_PANEL' | 'POWER_CIRCUIT' | 'SCENE';

// misc.activeTab: AppTab
```

---

## 5. Export / Import Şema Güncellemesi

Mevcut 5 zorunlu anahtar korunur; yeni 3 anahtar opsiyoneldir.

```typescript
// Export: her zaman 8 anahtar içerir
const EXPORTABLE_KEYS = [
  'branches', 'elements', 'runglist', 'rungs', 'variables',  // mevcut
  'controlPanel', 'powerCircuit', 'scene'                     // yeni
];

// Import: 5 zorunlu; eksik yeni anahtarlar varsayılan değerle doldurulur
const REQUIRED_KEYS = ['branches', 'elements', 'runglist', 'rungs', 'variables'];
```

---

## 6. Başlangıç Değerleri (const.ts)

```typescript
const INITIAL_CONTROL_PANEL: ControlPanel = { elements: {} };
const INITIAL_POWER_CIRCUIT: PowerCircuit = { elements: {}, cables: {} };
const INITIAL_SCENE: Scene = { blocks: {}, sensors: {} };
```

Yeni proje oluşturulduğunda tüm paneller boş başlar.

---

## Durum Geçişleri

### ControlElement değer değişimi
```
variableId yazılabilir olmalı →
  - scan cycle'da değil, doğrudan dispatch ile
  - PUSH_BUTTON: mousedown → FORCE_VARIABLE_TRUE; mouseup → FORCE_VARIABLE_FALSE
  - TOGGLE_SWITCH: click → TOGGLE_VARIABLE
```

### SceneBlock pozisyon güncellemesi
```
cycleScan → SET_SCENE_BLOCK_TARGET (targetX, targetY)
    ↓
useAnimationFrame (rAF, ~60fps)
    ↓
CSS transform via ref (re-render yok)
```

### Sensör tetikleme
```
cycleScan → her SceneBlock.boundingBox × her SensorBlock.triggerBox kesişim kontrolü
    → kesişim varsa: draft.variables[sensor.variableId].value = true
    → simülasyon durduğunda: tüm sensor-triggered variables false
```
