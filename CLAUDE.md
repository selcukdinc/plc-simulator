# PLC Simulator — Claude Code Context

## Proje Özeti
Web tabanlı PLC ladder logic simülatörü. Kullanıcılar ladder diyagram çizebilir ve simülasyonu gerçek zamanlı çalıştırabilir.
- **Upstream:** https://github.com/codingplc/plc-simulator (GPL v3)
- **Fork:** https://github.com/selcukdinc/plc-simulator
- **Canlı (upstream):** https://app.plcsimulator.online
- **Canlı (fork):** https://devloop.com.tr/plc-sim
- **Stack:** React 18 + TypeScript + Redux + Immer + Styled Components + MUI
- **Paket yöneticisi:** `yarn` (`yarn.lock` var, `package-lock.json` yok)

## Geliştirme Komutları
```bash
yarn start       # Geliştirme sunucusu (localhost:3000)
yarn build       # Production build → build/ klasörü
```

## Deploy
- **Hedef:** `devloop.com.tr/plc-sim` (nginx static file serving, `/var/www/plc-sim/`)
- **Otomatik:** `selcuk-dev` branch'ine commit mesajında `[deploy]` varsa GitHub Actions tetiklenir
- **Manuel:**
  ```bash
  yarn build
  rsync -avz --delete -e "ssh -i ~/key -p PORT" build/ user@host:/var/www/plc-sim/
  ```
- **GitHub Actions secrets:** `SSH_PRIVATE_KEY`, `SSH_HOST`, `SSH_PORT`, `SSH_USER`
- **Workflow dosyası:** `.github/workflows/deploy.yml`

## Proje Yapısı
```
src/
├── components/
│   ├── actions/         # Toolbar butonları (SimulateButton, vs.)
│   ├── diagram/         # Ladder diyagram bileşenleri (Block*, Rung, Branch)
│   ├── menu/            # Üst menü (Menu, ShareButton, ExportButton, ImportButton)
│   ├── properties/      # Sağ panel (element özellikleri)
│   └── variables/       # Sol panel (değişken tablosu)
├── helpers/
│   ├── cycleScan.ts     # ⭐ Ana simülasyon motoru — her cycle burada çalışır
│   └── addVariable.ts   # Değişken oluşturma mantığı
├── store/
│   ├── simulator.ts     # Redux reducer (tüm action handler'lar)
│   ├── store.ts         # Redux store, redux-persist + Firebase yükleme
│   ├── types.ts         # Action type sabitleri
│   └── const.ts         # Başlangıç state'i ve örnek program
├── consts/
│   ├── elementTypes.ts  # Element tipi sabitleri (XIC, XIO, TON, CTU, vs.)
│   ├── variables.ts     # Değişken tipi sabitleri
│   └── consts.ts        # CYCLE_TIME = 66ms
└── interface.ts         # TypeScript type tanımları
```

## Simülasyon Motoru (`cycleScan.ts`)
- **Cycle süresi:** 66ms (`CYCLE_TIME`)
- **Akış:** Her rung soldan sağa taranır, RLO (Rung Logic Output) bir elementten diğerine geçer
- `rungOut()` → bir rung'u değerlendirir (elemanları sırayla işler)
- `branchOut()` → paralel dalları değerlendirir (OR mantığı)
- `elementOut()` → element tipine göre doğru fonksiyonu çağırır
- Her rung'un başlangıç RLO'su: `draft.temp.simulation` (simülasyon açıksa true)
- **`executedTimers` Set:** Her scan başında oluşturulur; aynı timer instance'ının cycle içinde yalnızca bir kez çalıştırılmasını sağlar

## Element Tipleri
### Kontaklar
| Tip | Ad | Mantık |
|-----|----|--------|
| XIC | Normalde Açık (NO) | `RLO && input.value` |
| XIO | Normalde Kapalı (NC) | `RLO && !input.value` |
| OSP | Yükselen Kenar | `RLO && input && !memInput` |
| OSN | Düşen Kenar | `RLO && !input && memInput` |

### Coil'ler
| Tip | Ad | Mantık |
|-----|----|--------|
| OTE | Normal Çıkış | `output = RLO` |
| OTL | Latch (Set) | `if RLO → output = true` |
| OTU | Unlatch (Reset) | `if RLO → output = false` |
| OTN | Negatif Çıkış | `output = !RLO` |

### Timer'lar
| Tip | Açıklama |
|-----|----------|
| TON | Timer On Delay — IN=true iken ET artar, ET==PT olunca Q=true |
| TOF | Timer Off Delay — IN=false iken ET azalır |
| TONR | Retentive TON — IN düşünce ET'yi korur |

Timer alt değişkenleri: `PT` (Preset), `ET` (Elapsed), `IN`, `R` (Reset), `Q`

> ⚠️ Aynı timer instance'ı birden fazla rung'a eklenebilir. İkinci karşılaşmada
> yalnızca `RLO && Q` döner, timer state'i değiştirilmez.

### Sayaçlar: CTU, CTD, CTUD
### Matematik: ADD, SUB, MUL, DIV
### Karşılaştırma: EQU, NEQ, GRT, GEQ, LES, LEQ
### Diğer: MOV/MOVE

### Logic Kapıları (fork'a özgü)
| Tip | Parametre | Mantık |
|-----|-----------|--------|
| NOT | — | `output = !RLO` (değişken gerektirmez, gelen sinyali tersler) |
| AND | 2 × BOOL | `output = RLO && (A && B)` |
| OR  | 2 × BOOL | `output = RLO && (A \|\| B)` |
| NAND| 2 × BOOL | `output = RLO && !(A && B)` |
| NOR | 2 × BOOL | `output = RLO && !(A \|\| B)` |

NOT kapısı toolbox'ta ayrı bir öğe olarak `configured: true` ile gelir (parametre yapılandırması gerekmez).
AND/OR/NAND/NOR kapıları tek bir "Logic Gate" toolbox öğesi olarak gelir; Properties'den birbirine dönüştürülebilir.

## State Yapısı (Redux)
```typescript
Store {
  runglist: string[]           // Rung UUID sırası
  rungs: { [uuid]: Rung }
  branches: { [uuid]: Branch }
  elements: { [uuid]: Element }
  variables: { [uuid]: Variable }
  temp: {
    simulation: boolean        // Simülasyon açık/kapalı
    // ... UI geçici state (persist edilmez)
  }
}
```

## State Kalıcılığı
- **redux-persist + localforage** → IndexedDB'ye otomatik kaydeder
- `temp` state'i persist edilmez (blacklist'te)
- **ExportButton** → `{ branches, elements, runglist, rungs, variables }` yapısını JSON dosyası olarak indirir
- **ImportButton** → JSON dosyası seçer, 5 gerekli key'i validate eder, `IMPORT_PROJECT` dispatch eder
- **ShareButton** → Firebase Firestore'a kaydeder, paylaşılabilir link üretir (`/{uuid}`)
- Migration sistemi mevcut (v3)

## Yapılan Değişiklikler (fork'a özgü)
| Dosya | Değişiklik |
|-------|-----------|
| `helpers/cycleScan.ts` | TON timer double-execution bug fix (`executedTimers` Set) |
| `helpers/cycleScan.ts` | Timer ikinci çağrısında `RLO && Q` döner (RLO gating fix) |
| `components/actions/SimulateButton.tsx` | `useEffect` dependency fix; hardcoded bg → CSS var; pulse animasyonu |
| `components/actions/ActionButton.tsx` | Hardcoded `rgba(255,255,255,0.7)` → CSS var; MUI Tooltip; hover/cursor |
| `components/SvgButton.tsx` | `--color-button-bg`; MUI Tooltip; hover; `--radius-md` |
| `components/actions/Actions.tsx` | Tooltip label'lar + toolbar divider gruplandırması |
| `components/menu/Menu.tsx` | Tooltip label'lar + toolbar divider gruplandırması; Export/Import butonları eklendi |
| `components/diagram/PowerRail.tsx` | `animated` prop → `energized` CSS sınıfı (glow animasyonu) |
| `components/diagram/Rung.tsx` | PowerRail'e `animated` prop iletimi |
| `src/index.css` | Design tokens (`--radius-*`, `--shadow-*`, `--transition-*`); animasyon keyframe'leri |
| `components/menu/ExportButton.tsx` | **Yeni** — JSON export |
| `components/menu/ImportButton.tsx` | **Yeni** — JSON import |
| `components/Footer.tsx` | Patreon/About/Contact kaldırıldı, attribution linkleri eklendi |
| `package.json` | `homepage` → `/plc-sim` (subpath deploy) |
| `.github/workflows/deploy.yml` | **Yeni** — otomatik deploy workflow |
| `consts/elementTypes.ts` | GATE_NOT/AND/OR/NAND/NOR sabitleri eklendi |
| `interface.ts` | `GateType`, `ElementGate` tipleri eklendi |
| `helpers/cycleScan.ts` | Logic kapı simülasyon mantığı (setGateOut, NOT doğrudan !RLO) |
| `components/diagram/BlockGate.tsx` | **Yeni** — logic kapı görsel bileşeni |
| `components/toolbox/elements.ts` | `gate` (AND default) ve `gateNot` toolbox öğeleri |
| `components/toolbox/Toolbox.tsx` | NOT ve Logic Gate butonları eklendi |
| `components/properties/PropertiesGateType.tsx` | **Yeni** — kapı tipi seçici |
| `components/properties/Properties.tsx` | PropertiesGateType eklendi |
| `svg/toolbox/gate.svg` | **Yeni** — AND kapısı şekli |
| `components/variables/VariableTable.tsx` | StudioBanner (studio.rungs.dev reklamı) kaldırıldı; dark mode CSS var'ları |
| `components/diagram/Diagram.tsx` | AdSense/AddBanner kaldırıldı |
| `components/variables/VariableName.tsx` | Input text color → `inherit` (dark mode fix) |
| `components/variables/VariableTableVarRow.tsx` | Address color → CSS var (dark mode fix) |
| `index.css` | `--color-var-text`, `--color-var-text-muted`, `--color-var-text-address` token'ları |
| `components/actions/ActionButton.tsx` | Buton boyutu 3.5rem → 2.8rem |
| `components/actions/SimulateButton.tsx` | Buton boyutu 4.5rem → 3.6rem |
| `components/SvgButton.tsx` | Buton boyutu 3.5rem → 2.8rem |
| `components/toolbox/ToolboxBlock.tsx` | Toolbox öğe boyutu 4rem → 3.2rem |
| `components/toolbox/ToolboxBranch.tsx` | Toolbox öğe boyutu 4rem → 3.2rem |
| `components/toolbox/ToolboxRung.tsx` | Toolbox öğe boyutu 4rem → 3.2rem |
| `components/menu/Help.tsx` | Dış URL → sayfa içi MUI Dialog; her buton için ikon chip + açıklama; credits bölümü (CodingPLC + Selçuk DİNÇ) |
| `components/menu/Menu.tsx` | Çevrimdışı wifi-off butonu kaldırıldı; kullanılmayan import'lar temizlendi |
| `components/menu/ExportButton.tsx` | `title` tooltip eklendi ("Dışa Aktar (JSON)") |
| `components/menu/ImportButton.tsx` | `title` tooltip eklendi ("İçe Aktar (JSON)") |
| `interface.ts` | ControlElement, ControlPanel, PowerElement, Terminal, Cable, PowerCircuit, SceneBlock, SensorBlock, Scene, AppTab tipleri eklendi |
| `store/types.ts` | 20 yeni action type sabiti (SET_ACTIVE_TAB, ADD_CONTROL_ELEMENT, ADD_POWER_ELEMENT, ADD_CABLE, ADD_SCENE_BLOCK vb.) |
| `store/const.ts` | controlPanel, powerCircuit, scene slice başlangıç state'leri |
| `store/simulator.ts` | 19 yeni reducer case; STOP_SIMULATION genişletmesi; IMPORT_PROJECT merge mantığı |
| `hooks/useAnimationFrame.ts` | **Yeni** — rAF custom hook (60fps, scan'dan bağımsız) |
| `components/menu/TabBar.tsx` | **Yeni** — 4 sekme: Ladder / Kumanda / Güç Devresi / Gerçek Hayat |
| `components/menu/ExportButton.tsx` | controlPanel, powerCircuit, scene slice'ları export'a eklendi |
| `components/Simulator.tsx` | TabBar entegre; 4 sekme koşullu render |
| `components/controlpanel/ControlPushButton.tsx` | **Yeni** — basmalı buton (momentary) |
| `components/controlpanel/ControlToggleSwitch.tsx` | **Yeni** — toggle anahtar |
| `components/controlpanel/ControlPilotLamp.tsx` | **Yeni** — sinyal lambası (read-only) |
| `components/controlpanel/ControlEmergencyStop.tsx` | **Yeni** — acil stop butonu |
| `components/controlpanel/ControlElement.tsx` | **Yeni** — generic wrapper + ⚠ uyarılar + çift tıkla dialog |
| `components/controlpanel/ControlElementPalette.tsx` | **Yeni** — sol palet (react-dnd) |
| `components/controlpanel/ControlElementVariableDialog.tsx` | **Yeni** — değişken atama dialogu |
| `components/controlpanel/ControlPanel.tsx` | **Yeni** — drop target kanvas |
| `components/powercircuit/PowerElement.tsx` | **Yeni** — 6 eleman tipi SVG (POWER_SOURCE, CONTACTOR, MOTOR, FUSE, THERMAL_RELAY, TERMINAL_BLOCK) |
| `components/powercircuit/PowerCable.tsx` | **Yeni** — SVG kablo (elbow routing, energized rengi) |
| `components/powercircuit/PowerCircuitCanvas.tsx` | **Yeni** — SVG kanvas + kablo çizim etkileşimi + DnD drop target |
| `components/powercircuit/PowerElementPalette.tsx` | **Yeni** — sol palet (react-dnd) |
| `components/powercircuit/PowerElementVariableDialog.tsx` | **Yeni** — kontaktör değişken dialogu |
| `components/scene/SceneBlock.tsx` | **Yeni** — 6 blok tipi + rAF lerp animasyonu (re-render yok) |
| `components/scene/SensorBlock.tsx` | **Yeni** — 3 sensör tipi + AABB trigger zone görseli |
| `components/scene/SceneBlockPalette.tsx` | **Yeni** — sol palet + arama kutusu |
| `components/scene/SceneCanvas.tsx` | **Yeni** — SVG kanvas + çift tıkla → properties dialog |
| `components/properties/PropertiesSceneBlock.tsx` | **Yeni** — blok özellikleri (hız, sınır, değişken atama) |
| `components/properties/PropertiesSensorBlock.tsx` | **Yeni** — sensör özellikleri (tip, trigger boyutu, değişken) |
| `helpers/evaluatePowerCircuitTopology.ts` | **Yeni** — saf BFS fonksiyonu (güç devresi topoloji doğrulaması) |
| `helpers/evaluateSceneBlocks.ts` | **Yeni** — sensör çarpışma + blok hareket hesabı (her scan sonunda çalışır) |
| `helpers/cycleScan.ts` | evaluatePowerCircuitTopology + evaluateSceneBlocks çağrıları eklendi |
| `consts/sceneBlockTypes.ts` | **Yeni** — SCENE_BLOCK_TYPES ve SENSOR_TYPES sabitleri |

## Branch Stratejisi
- `main` → upstream ile senkron, dokunulmaz
- `fix/ton-timer-multiple-execution` → timer bug fix PR'ı (upstream'e açıldı)
- `selcuk-dev` → aktif geliştirme branch'i, buradan deploy edilir

## Lisans
GPL v3 — kaynak kodu açık kalmak zorunda. Ticari servis/destek sunulabilir,
kaynak kapatılamaz. `LICENSE` dosyasına dokunulmamalı.

## Active Technologies
- TypeScript strict mode (React 18) — mevcu + React 18, Redux Toolkit + Immer, Styled Components, MUI, (001-3panel-industrial-sim)
- redux-persist + localforage (IndexedDB); JSON export/import (mevcut format genişletilir) (001-3panel-industrial-sim)

## Recent Changes
- 001-3panel-industrial-sim: Added TypeScript strict mode (React 18) — mevcu + React 18, Redux Toolkit + Immer, Styled Components, MUI,
