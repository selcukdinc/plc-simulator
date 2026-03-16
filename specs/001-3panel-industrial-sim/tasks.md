---

description: "Task list for 3 Bölgeli Endüstriyel PLC Simülatör Çalışma Alanı"
---

# Tasks: 3 Bölgeli Endüstriyel PLC Simülatör Çalışma Alanı

**Input**: Design documents from `/specs/001-3panel-industrial-sim/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/redux-actions.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation
and testing of each story. Tests are NOT included (not requested).

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)
- Exact file paths included in all descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions, constants, and utilities shared by all panels.
All Phase 1 tasks touch different files and can run in parallel.

- [X] T001 [P] Add TypeScript interfaces for all new entities to `src/interface.ts`: `ControlElementType`, `ControlElement`, `ControlPanel`, `PowerElementType`, `Terminal`, `PowerElement`, `Cable`, `PowerCircuit`, `SceneBlockType`, `SceneBlockAxes`, `SceneBlock`, `SensorType`, `SensorBlock`, `Scene`, `AppTab` — follow existing interface patterns in the file
- [X] T002 [P] Add all new action type string constants to `src/store/types.ts`: `SET_ACTIVE_TAB`, `ADD_CONTROL_ELEMENT`, `REMOVE_CONTROL_ELEMENT`, `UPDATE_CONTROL_ELEMENT`, `CONTROL_BUTTON_PRESS`, `CONTROL_BUTTON_RELEASE`, `TOGGLE_SWITCH_CLICK`, `ADD_POWER_ELEMENT`, `REMOVE_POWER_ELEMENT`, `MOVE_POWER_ELEMENT`, `ADD_CABLE`, `REMOVE_CABLE`, `SET_POWER_ELEMENT_VARIABLE`, `ADD_SCENE_BLOCK`, `REMOVE_SCENE_BLOCK`, `UPDATE_SCENE_BLOCK`, `SET_SCENE_BLOCK_TARGET`, `ADD_SENSOR_BLOCK`, `REMOVE_SENSOR_BLOCK`, `UPDATE_SENSOR_BLOCK`
- [X] T003 [P] Add initial state constants to `src/store/const.ts`: `INITIAL_CONTROL_PANEL = { elements: {} }`, `INITIAL_POWER_CIRCUIT = { elements: {}, cables: {} }`, `INITIAL_SCENE = { blocks: {}, sensors: {} }`; extend `INITIAL_STATE` to include `controlPanel`, `powerCircuit`, `scene`; add `activeTab: 'LADDER'` to `misc`
- [X] T004 [P] Create `src/hooks/useAnimationFrame.ts`: export `useAnimationFrame(callback: () => void): void` — wraps `requestAnimationFrame` in a `useEffect`, cancels on unmount, stable across renders via `useRef`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before any user story panel works.

**⚠️ CRITICAL**: No user story panel can render until this phase is complete.

- [X] T005 Extend the `Store` root interface in `src/interface.ts` to include `controlPanel: ControlPanel`, `powerCircuit: PowerCircuit`, `scene: Scene`; extend `misc` type to include `activeTab: AppTab` — depends on T001
- [X] T006 Create `src/components/menu/TabBar.tsx`: MUI Tabs component rendering four tabs (Ladder Diyagramı / Kumanda / Güç Devresi / Gerçek Hayat); reads `misc.activeTab` via `useSelector`, dispatches `SET_ACTIVE_TAB` on tab change; uses CSS `--color-*` tokens for theming
- [X] T007 Add `SET_ACTIVE_TAB` reducer case to `src/store/simulator.ts`: `draft.misc.activeTab = action.payload`
- [X] T008 Integrate `TabBar` into the main layout (locate where `Diagram` is rendered, likely `src/App.tsx` or `src/components/Layout.tsx`): render `TabBar` above content area; conditionally render `<Diagram>` only when `activeTab === 'LADDER'`; render placeholder `<div>` for other tabs (panels added in later phases)
- [X] T009 Extend `STOP_SIMULATION` handler in `src/store/simulator.ts` to: set all `PUSH_BUTTON`-connected `variables[id].value = false`; set `temp.powerCircuitEnergized = new Set()`; set each `scene.blocks[id].targetX = scene.blocks[id].x` and `targetY = y` (freeze positions)
- [X] T010 Update `src/components/menu/ExportButton.tsx`: add `'controlPanel'`, `'powerCircuit'`, `'scene'` to the exported keys array so the JSON export always includes the three new slices
- [X] T011 Update `src/components/menu/ImportButton.tsx`: keep the 5 required-key validation as-is; after `IMPORT_PROJECT` dispatch, ensure reducer merges missing `controlPanel`, `powerCircuit`, `scene` keys with their initial values from `const.ts` (add merge logic in the `IMPORT_PROJECT` case in `simulator.ts`)

**Checkpoint**: TabBar visible and switching between Ladder and placeholder panels; export/import forwards-compatible — proceed to user story phases.

---

## Phase 3: User Story 1 — Kumanda Panelinden Sistemi Tetikleme (Priority: P1) 🎯 MVP

**Goal**: Tıklanabilir kumanda panosu elemanları (buton, anahtar, lamba) ladder değişkenlerini gerçek zamanlı olarak tetikler.

**Independent Test**: Kumanda paneline bir basmalı buton ekle → ladder değişkeni ata → simülasyonu başlat → butona bas → değişken tablosunda `TRUE` gör → bırak → `FALSE` gör.

### Implementation for User Story 1

- [X] T012 [P] [US1] Add `ADD_CONTROL_ELEMENT`, `REMOVE_CONTROL_ELEMENT`, `UPDATE_CONTROL_ELEMENT` reducer cases to `src/store/simulator.ts` per contracts in `contracts/redux-actions.md`; `ADD_CONTROL_ELEMENT` initializes `variableId: null`
- [X] T013 [P] [US1] Add `CONTROL_BUTTON_PRESS`, `CONTROL_BUTTON_RELEASE`, `TOGGLE_SWITCH_CLICK` reducer cases to `src/store/simulator.ts`: `PRESS` sets `variables[variableId].value = true`; `RELEASE` sets `false` only for `PUSH_BUTTON` type; `TOGGLE_SWITCH_CLICK` inverts `variables[variableId].value`; no-op if `variableId` is null or variable not found
- [X] T014 [US1] Create `src/components/controlpanel/ControlPushButton.tsx`: renders as a circular industrial push-button SVG; dispatches `CONTROL_BUTTON_PRESS` on `onMouseDown`, `CONTROL_BUTTON_RELEASE` on `onMouseUp` and `onMouseLeave`; reflects pressed state visually; uses CSS `--color-*` tokens
- [X] T015 [P] [US1] Create `src/components/controlpanel/ControlToggleSwitch.tsx`: renders as a toggle/selector switch SVG; dispatches `TOGGLE_SWITCH_CLICK` on click; shows ON/OFF state visually
- [X] T016 [P] [US1] Create `src/components/controlpanel/ControlPilotLamp.tsx`: reads `variables[variableId].value` via `useSelector`; renders as colored circle (green=ON, grey=OFF); no click interaction
- [X] T017 [P] [US1] Create `src/components/controlpanel/ControlEmergencyStop.tsx`: large red mushroom-head button SVG; dispatches `TOGGLE_SWITCH_CLICK` (latches like toggle switch); red glow when active
- [X] T018 [US1] Create `src/components/controlpanel/ControlElement.tsx`: generic wrapper that routes rendering to the correct type-specific component based on `element.type`; shows `⚠ Değişken atanmamış` tooltip (MUI Tooltip) when `variableId === null`; shows `⚠ Değişken bulunamadı` when `variableId` points to a non-existent variable; handles drag-to-reposition via `onMouseDown` + Redux `UPDATE_CONTROL_ELEMENT`
- [X] T019 [US1] Create `src/components/controlpanel/ControlElementPalette.tsx`: left sidebar with react-dnd `useDrag` for each element type (PUSH_BUTTON, TOGGLE_SWITCH, PILOT_LAMP, EMERGENCY_STOP); SVG preview icons; styled with CSS tokens
- [X] T020 [US1] Create `src/components/controlpanel/ControlElementVariableDialog.tsx`: MUI Dialog; on double-click of any `ControlElement`, opens with a list of all `variables` in the store; user selects one → dispatches `UPDATE_CONTROL_ELEMENT` with `variableId`; "Bağlantıyı Kaldır" option sets `variableId: null`
- [X] T021 [US1] Create `src/components/controlpanel/ControlPanel.tsx`: full-panel SVG/div canvas; react-dnd `useDrop` target for `CONTROL_ELEMENT` type; on drop dispatches `ADD_CONTROL_ELEMENT` with canvas coordinates; renders all `controlPanel.elements` as `ControlElement` components
- [X] T022 [US1] Wire Kumanda tab: in the layout file updated in T008, replace the Kumanda placeholder `<div>` with `<ControlPanel />` rendered when `activeTab === 'CONTROL_PANEL'`

**Checkpoint**: Kumanda paneli tamamen bağımsız çalışır — ladder değişkeni tetiklenebilir ve simülasyon değişir.

---

## Phase 4: User Story 2 — Güç Devre Tasarım Alanı (Priority: P2)

**Goal**: 2D güç devresi kanvası; sürükle-bırak elemanlar; SVG kablo çizimi; BFS topoloji doğrulaması; ladder ile senkron enerjileme görseli.

**Independent Test**: PowerCircuit sekmesinde güç kaynağı + KM1 kontaktör + motor yerleştir → kablolarla bağla → KM1'e ladder coil değişkeni ata → simülasyonu başlat → kumandadan coil'i tetikle → kontaktör ve motorun enerjili göründüğünü doğrula.

### Implementation for User Story 2

- [X] T023 [P] [US2] Add `ADD_POWER_ELEMENT`, `REMOVE_POWER_ELEMENT`, `MOVE_POWER_ELEMENT` reducer cases to `src/store/simulator.ts`
- [X] T024 [P] [US2] Add `ADD_CABLE`, `REMOVE_CABLE`, `SET_POWER_ELEMENT_VARIABLE` reducer cases to `src/store/simulator.ts`
- [X] T025 [P] [US2] Create `src/helpers/evaluatePowerCircuitTopology.ts`: BFS topoloji fonksiyonu
- [X] T026 [US2] Integrate `evaluatePowerCircuitTopology` into `src/helpers/cycleScan.ts`
- [X] T027 [US2] Create `src/components/powercircuit/PowerElement.tsx`
- [X] T028 [US2] Create `src/components/powercircuit/PowerCable.tsx`
- [X] T029 [US2] Create `src/components/powercircuit/PowerCircuitCanvas.tsx`
- [X] T030 [P] [US2] Create `src/components/powercircuit/PowerElementPalette.tsx`
- [X] T031 [US2] Create `src/components/powercircuit/PowerElementVariableDialog.tsx`
- [X] T032 [US2] Wire Güç Devresi tab in `src/components/Simulator.tsx`

**Checkpoint**: Güç devresi bölümü bağımsız çalışır — ladder coil enerjisi güç devresine görsel olarak yansır; bağlantısız eleman enerjilenmez.

---

## Phase 5: User Story 3 — Gerçek Hayat Simülasyon Sahnesi: Vinç Sistemi (Priority: P3)

**Goal**: 2D animasyonlu makine blokları (vinç arabası + kancası); ladder-driven hareket; fiziksel sensör tetikleme; rAF ile scan'dan bağımsız 60fps animasyon.

**Independent Test**: Sahneye CRANE_TROLLEY ekle → MOTOR_ILERI değişkenini ata → simülasyon başlat → ladder coil'ini enerjile → vincin kanvas üzerinde hareket ettiğini gör → limit sensörü yerleştir → sensor değişkeninin tetiklendiğini doğrula.

### Implementation for User Story 3

- [X] T033 [P] [US3] Create `src/helpers/evaluateSceneBlocks.ts`
- [X] T034 [US3] Integrate `evaluateSceneBlocks` into `src/helpers/cycleScan.ts`
- [X] T035 [P] [US3] Add scene block reducer cases to `src/store/simulator.ts`
- [X] T036 [P] [US3] Add sensor block reducer cases to `src/store/simulator.ts`
- [X] T037 [US3] Create `src/components/scene/SceneBlock.tsx` (tüm 6 blok tipi + rAF animasyonu)
- [X] T038 [US3] Create `src/components/scene/SensorBlock.tsx`
- [X] T039 [US3] Create `src/components/scene/SceneBlockPalette.tsx` (arama + 6 blok + 3 sensör)
- [X] T040 [US3] Create `src/components/scene/SceneCanvas.tsx`
- [ ] T041 [US3] Create `src/components/properties/PropertiesSceneBlock.tsx` — blok properties paneli (ertelendi)
- [ ] T042 [US3] Create `src/components/properties/PropertiesSensorBlock.tsx` — sensör properties paneli (ertelendi)
- [ ] T043 [US3] Add SVG toolbox icons (ertelendi — paletteki SVG'ler inline)
- [X] T044 [US3] Wire Gerçek Hayat tab in `src/components/Simulator.tsx`

**Checkpoint**: Gerçek hayat sahnesi bağımsız çalışır — vinç hareket eder, limit sensörü ladder'ı tetikler, simülasyon durduğunda vinç donar.

---

## Phase 6: User Story 4 — Blok Kütüphanesi ve Lego Birleştirme (Priority: P4)

**Goal**: Vinç dışında 4 ek endüstriyel makine tipi; tam blok kütüphanesi (5 tip); sahne paletine arama.

**Independent Test**: Paletten CONVEYOR seçip sahneye ekle → MOTOR değişkeni ata → simülasyonu başlat → konveyör bant animasyonunun çalıştığını doğrula.

### Implementation for User Story 4

- [X] T045 [P] [US4] CONVEYOR block rendering in `src/components/scene/SceneBlock.tsx`
- [X] T046 [P] [US4] PNEUMATIC_CYL block in `src/components/scene/SceneBlock.tsx`
- [X] T047 [P] [US4] LIFT_TABLE block in `src/components/scene/SceneBlock.tsx`
- [X] T048 [P] [US4] SIGNAL_TOWER block in `src/components/scene/SceneBlock.tsx`
- [ ] T049 [P] [US4] SVG toolbox icons (ertelendi — inline SVG kullanılıyor)
- [X] T050 [US4] `src/components/scene/SceneBlockPalette.tsx` tüm tipleri + arama içeriyor

**Checkpoint**: Tüm 5 blok tipi sahnede kullanılabilir, bağımsız olarak ladder ile eşleştirilebilir.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Kod kalitesi, performans, tutarlılık ve export/import doğrulaması.

- [ ] T051 [P] Audit all new component files (`src/components/controlpanel/`, `src/components/powercircuit/`, `src/components/scene/`) for hardcoded color/size values — replace any `rgba(...)`, `#...`, or `px` sizing not using CSS custom properties with `var(--color-*)`, `var(--radius-*)`, `var(--shadow-*)`
- [ ] T052 [P] Add `src/consts/sceneBlockTypes.ts` with exported string constant arrays `SCENE_BLOCK_TYPES` and `SENSOR_TYPES` matching the union types in `interface.ts`; use these in palette and reducer instead of inline string literals
- [ ] T053 Update `CLAUDE.md` under "Yapılan Değişiklikler" table: add rows for every new file created (TabBar, ControlPanel, PowerCircuitCanvas, SceneCanvas, evaluatePowerCircuitTopology, evaluateSceneBlocks, useAnimationFrame, PropertiesSceneBlock, PropertiesSensorBlock, ExportButton/ImportButton changes, simulator.ts additions)
- [ ] T054 Run `yarn build` and fix all TypeScript errors until build exits with code 0
- [ ] T055 Manual browser test (console clean check): open app → switch all 4 tabs → add one element per panel → start simulation → trigger control panel button → verify variable changes → stop simulation → verify reset; browser console must show zero errors and zero warnings
- [ ] T056 Manual export/import round-trip test: add elements to all 3 panels → export JSON → clear all → import JSON → verify all panels restore correctly with variable assignments intact

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — all T001–T004 can start immediately in parallel
- **Foundational (Phase 2)**: Depends on Phase 1 completion (T005 needs T001, T006 needs T003+T005)
- **User Story 1 (Phase 3)**: Depends on Foundational completion — no dependency on US2/US3/US4
- **User Story 2 (Phase 4)**: Depends on Foundational completion — no dependency on US1/US3/US4
- **User Story 3 (Phase 5)**: Depends on Foundational + T004 (useAnimationFrame) — no dependency on US1/US2
- **User Story 4 (Phase 6)**: Depends on Phase 5 completion (extends SceneBlock.tsx and palette)
- **Polish (Phase N)**: Depends on all desired user stories being complete

### User Story Dependencies (within each story)

- Within US1: T012, T013 [P] first → T014–T017 [P] → T018 (needs type components) → T019 → T020 → T021 → T022
- Within US2: T023, T024, T025 [P] first → T026 (needs T025) → T027 → T028 → T029, T030 [P] → T031 → T032
- Within US3: T033, T035, T036 [P] first → T034 (needs T033) → T037 (needs T004+T035) → T038 → T039, T043 [P] → T040 → T041, T042 [P] → T044

### Parallel Opportunities

```bash
# Phase 1 — all parallel:
T001 (interface.ts) + T002 (types.ts) + T003 (const.ts) + T004 (useAnimationFrame.ts)

# Phase 2 — sequential setup then parallel per concern:
T005 → T006
T007 + T008 (both simulator related but different) → T009

# Phase 3 — reducer cases then components in parallel:
T012 + T013 → T014 + T015 + T016 + T017 → T018 → T019 → T020 → T021 → T022

# Phase 4 — reducer + helper in parallel:
T023 + T024 + T025 → T026 → T027 + T030 + T031 → T028 → T029 → T032

# Phase 5 — reducer cases + helper in parallel:
T033 + T035 + T036 → T034 → T037 + T038 + T039 + T043 → T040 → T041 + T042 → T044
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T004)
2. Complete Phase 2: Foundational (T005–T011)
3. Complete Phase 3: User Story 1 — Kumanda Paneli (T012–T022)
4. **STOP and VALIDATE**: Butona bas → değişken tetiklenir → ladder değişir
5. Deploy if ready

### Incremental Delivery

1. Setup + Foundational → TabBar görünür, sekme geçişi çalışır
2. US1 (Kumanda) → Buton/anahtar ile ladder tetikleme ✅ demo
3. US2 (Güç Devresi) → Güç devresi + BFS topoloji ✅ demo
4. US3 (Gerçek Hayat) → Vinç animasyonu + sensör tetikleme ✅ demo
5. US4 (Blok Kütüphanesi) → Tam 5-blok kütüphanesi ✅ demo
6. Polish → Production-ready

---

## Notes

- `[P]` = farklı dosyalar, bağımlılık yok — paralel çalıştırılabilir
- `[Story]` etiketi her görevin hangi user story'e ait olduğunu gösterir
- Her checkpoint'te o user story bağımsız olarak test edilebilir
- `yarn build` her fazın sonunda hatasız çalışmalıdır
- CSS custom property kullanımı her yeni bileşende zorunludur (constitution III)
- `cycleScan.ts`'e eklenen her helper çağrısı performans açısından doğrulanmalıdır (constitution IV)
