# PLC Simulator — Claude Code Context

## Proje Özeti
Web tabanlı PLC ladder logic simülatörü. Kullanıcılar ladder diyagram çizebilir ve simülasyonu gerçek zamanlı çalıştırabilir.
- **URL:** https://app.plcsimulator.online/
- **Stack:** React 18 + TypeScript + Redux + Immer + Styled Components + MUI
- **Deploy:** Firebase Hosting

## Geliştirme Komutları
```bash
npm start        # Geliştirme sunucusu (localhost:3000)
npm run build    # Production build
npm run deploy   # Build + Firebase deploy
```

## Proje Yapısı
```
src/
├── components/
│   ├── actions/         # Toolbar butonları (SimulateButton, vs.)
│   ├── diagram/         # Ladder diyagram bileşenleri (Block*, Rung, Branch)
│   ├── menu/            # Üst menü (ShareButton, Menu)
│   ├── properties/      # Sağ panel (element özellikleri)
│   └── variables/       # Sol panel (değişken tablosu, StudioBanner)
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
- **ShareButton** → Firebase Firestore'a kaydeder, paylaşılabilir link üretir (`/{uuid}`)
- `manualPersist: true` ile kontrollü persist
- Migration sistemi mevcut (v3)

## Bilinen Sınırlamalar / Gelecek Geliştirmeler
- **Yerel dosya export/import yok:** Çizimler IndexedDB + Firebase link ile paylaşılır; JSON dosyası indirme/yükleme özelliği yoktur (eklenebilir)
- **Aynı timer instance'ı tek rung'da kullanılmalı:** Bir timer function block'u birden fazla rung'a eklenirse davranış kısıtlıdır (fix uygulandı: bkz. `fix/ton-timer-multiple-execution` branch)
- Timer'ın Q/ET değerlerine başka rung'lardan contact olarak erişim yok (XIC ile timer.Q referanslanamıyor)

## Branch Stratejisi
- `main` → resmi upstream (upstream'den fork)
- `fix/ton-timer-multiple-execution` → TON timer bug fix (PR açıldı)
- `selcuk-dev` → aktif geliştirme branch'i

## Önemli Notlar
- Upstream proje: açık kaynak PLC simülatörü (fork)
- Firebase config yoksa uygulama gracefully degrade olur
- Sentry ile hata takibi yapılıyor
- `react-dnd` ile drag-and-drop element yerleştirme
