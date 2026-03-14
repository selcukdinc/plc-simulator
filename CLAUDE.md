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
| `components/actions/SimulateButton.tsx` | `useEffect` dependency array eksikliği düzeltildi (`[simulation]`) |
| `components/menu/ExportButton.tsx` | **Yeni** — JSON export |
| `components/menu/ImportButton.tsx` | **Yeni** — JSON import |
| `components/menu/Menu.tsx` | Export/Import butonları eklendi |
| `components/Footer.tsx` | Patreon/About/Contact kaldırıldı, attribution linkleri eklendi |
| `package.json` | `homepage` → `/plc-sim` (subpath deploy) |
| `.github/workflows/deploy.yml` | **Yeni** — otomatik deploy workflow |

## Branch Stratejisi
- `main` → upstream ile senkron, dokunulmaz
- `fix/ton-timer-multiple-execution` → timer bug fix PR'ı (upstream'e açıldı)
- `selcuk-dev` → aktif geliştirme branch'i, buradan deploy edilir

## Lisans
GPL v3 — kaynak kodu açık kalmak zorunda. Ticari servis/destek sunulabilir,
kaynak kapatılamaz. `LICENSE` dosyasına dokunulmamalı.
