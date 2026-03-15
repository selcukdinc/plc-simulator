# Implementation Plan: 3 Bölgeli Endüstriyel PLC Simülatör Çalışma Alanı

**Branch**: `001-3panel-industrial-sim` | **Date**: 2026-03-16 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-3panel-industrial-sim/spec.md`

---

## Summary

Mevcut web tabanlı PLC ladder logic simülatörüne 3 yeni sekme paneli eklenir:
**Kumanda Paneli** (tıklanabilir buton/anahtar → ladder değişkeni tetikleme),
**Güç Devresi** (sürükle-bırak elemanlar + kablo topoloji doğrulaması → ladder ile
senkron enerjileme), **Gerçek Hayat Sahnesi** (animasyonlu 2D makine blokları,
fiziksel sensör yerleştirme → ladder ↔ sahne çift yönlü veri akışı).

Mevcut Redux + Immer + 66ms scan cycle altyapısı korunur; 3 yeni flat Redux slice
(`controlPanel`, `powerCircuit`, `scene`) eklenir. Animasyon `requestAnimationFrame`
ile scan cycle'dan bağımsız yürütülür.

---

## Technical Context

**Language/Version**: TypeScript strict mode (React 18) — mevcut
**Primary Dependencies**: React 18, Redux Toolkit + Immer, Styled Components, MUI,
react-dnd (v16, zaten mevcut), redux-persist + localforage — hiçbiri yeni değil
**Storage**: redux-persist + localforage (IndexedDB); JSON export/import (mevcut format genişletilir)
**Testing**: Manuel browser testleri (constitution gereği); cycleScan helper'ları için
pure function unit testleri opsiyonel
**Target Platform**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web SPA (React, client-side only)
**Performance Goals**: 66ms scan cycle bozulmadan çalışmalı; sahne animasyonu 60fps;
görsel geri bildirim <100ms; 10+ sahne bloğu + 20+ kumanda elemanıyla stabil
**Constraints**: Yeni ağır bağımlılık yok; bundle <5s ilk yükleme; cycleScan'a
blocking I/O veya heavy computation eklenmez
**Scale/Scope**: Tek kullanıcı, tarayıcı-yerel; ~50-80 yeni React bileşeni;
3 yeni helper fonksiyon; 3 yeni Redux slice

---

## Constitution Check

*GATE: Tüm maddeler Phase 0 araştırması öncesi değerlendirildi. Phase 1 sonrası yeniden kontrol edildi.*

| Prensip | Durum | Not |
|---------|-------|-----|
| **I. Kod Kalitesi** | ✅ PASS | Tüm yeni kod TypeScript strict; `any` yok; Redux mutations Immer üzerinden; YAGNI — 3 slice yeni gereksinimi karşılar, fazlası yok |
| **II. Test Standartları** | ✅ PASS | `evaluatePowerCircuitTopology` ve `evaluateSceneBlocks` saf fonksiyonlar → manuel test senaryoları commit mesajına eklenir; konsol temiz kalmalı |
| **III. UX Tutarlılığı** | ✅ PASS | Yeni paneller `--color-*`, `--radius-*`, `--shadow-*` CSS token'larını kullanır; MUI Tooltip/Dialog; sekme bileşeni mevcut MUI Tab'ı kullanır |
| **IV. Performans** | ✅ PASS | Animasyon rAF ile scan'dan ayrılmış; cycleScan'a eklenen BFS/sensor check O(V+E) < 1ms; Redux per-frame dispatch yok |
| **V. Upstream Uyumluluk** | ✅ PASS | Bu özellik fork'a özgü; CLAUDE.md güncellenecek; main branch dokunulmayacak |

---

## Project Structure

### Documentation (this feature)

```text
specs/001-3panel-industrial-sim/
├── plan.md              # Bu dosya
├── research.md          # Phase 0 çıktısı
├── data-model.md        # Phase 1 çıktısı
├── quickstart.md        # Phase 1 çıktısı
├── contracts/
│   └── redux-actions.md # Phase 1 çıktısı
├── checklists/
│   └── requirements.md  # Spec kalite kontrol listesi
└── tasks.md             # Phase 2 çıktısı (/speckit.tasks komutuyla)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── actions/          # mevcut — değişmez
│   ├── diagram/          # mevcut — değişmez
│   ├── menu/             # mevcut — TabBar bileşeni eklenir
│   ├── properties/       # mevcut — yeni panel eleman özellik panelleri
│   ├── variables/        # mevcut — değişmez
│   ├── controlpanel/     # YENİ
│   │   ├── ControlPanel.tsx          # panel konteyneri
│   │   ├── ControlElement.tsx        # generik eleman render
│   │   ├── ControlPushButton.tsx     # basmalı buton
│   │   ├── ControlToggleSwitch.tsx   # toggle anahtar
│   │   ├── ControlPilotLamp.tsx      # sinyal lambası
│   │   └── ControlEmergencyStop.tsx  # acil stop
│   ├── powercircuit/     # YENİ
│   │   ├── PowerCircuitCanvas.tsx    # SVG kanvas konteyneri + DnD drop target
│   │   ├── PowerElement.tsx          # generik eleman render
│   │   ├── PowerCable.tsx            # SVG kablo çizimi
│   │   └── PowerElementPalette.tsx   # sol eleman paleti
│   └── scene/            # YENİ
│       ├── SceneCanvas.tsx           # SVG kanvas konteyneri
│       ├── SceneBlock.tsx            # makine bloğu (animated)
│       ├── SensorBlock.tsx           # sensör bloğu
│       └── SceneBlockPalette.tsx     # blok paleti
├── helpers/
│   ├── cycleScan.ts                  # mevcut — BFS + sensor check çağrıları eklenir
│   ├── evaluatePowerCircuitTopology.ts  # YENİ — saf BFS fonksiyonu
│   └── evaluateSceneBlocks.ts           # YENİ — sensör kesişim + hedef güncelleme
├── hooks/
│   └── useAnimationFrame.ts          # YENİ — rAF custom hook
├── store/
│   ├── simulator.ts      # mevcut — yeni action case'leri eklenir
│   ├── store.ts          # mevcut — persist config güncellenir
│   ├── types.ts          # mevcut — yeni type sabitleri eklenir
│   └── const.ts          # mevcut — yeni slice başlangıç değerleri eklenir
├── consts/
│   └── sceneBlockTypes.ts  # YENİ — SceneBlockType sabitleri
└── interface.ts            # mevcut — yeni interface'ler eklenir
```

**Structure Decision**: Mevcut `src/components/` altına 3 yeni alt dizin. Mevcut
dizin yapısı bozulmaz. Yeni helper'lar `src/helpers/` altında saf fonksiyon olarak.
Custom hook `src/hooks/` altında (yeni dizin, küçük).

---

## Complexity Tracking

> Constitution ihlali yoktur. Aşağıdaki madde bilgi amaçlıdır.

| Karar | Neden Gerekli | Daha Basit Alternatif Neden Reddedildi |
|-------|--------------|---------------------------------------|
| `requestAnimationFrame` hook (yeni hooks/ dizini) | 60fps animasyon scan cycle'dan ayrılmalı; DOM manipülasyonu re-render olmadan yapılmalı | Redux per-frame dispatch: 60 re-render/s; Immer overhead; performans sorunları |
| BFS topoloji fonksiyonu | Güç devresi fiziksel doğruluk zorunlu (C seçeneği seçildi); ladder logic'ten farklı algoritma | Ladder rung olarak modelleme: anlam kayması, farklı algoritmik gereksinim |
