# Phase 0 Research: 3 Bölgeli Endüstriyel PLC Simülatör

**Branch**: `001-3panel-industrial-sim` | **Date**: 2026-03-16

---

## R1: Drag-and-Drop — Kanvas Panel Eleman Yerleştirme

**Karar**: Mevcut `react-dnd` (v16, HTML5Backend) + Redux state ile koordinat yönetimi.

**Gerekçe**:
- Kodtabanı zaten `react-dnd` kullanıyor (`DraggableBlock.tsx`, `CustomDragLayer.tsx`).
  İkinci bir sürükle-bırak kütüphanesi eklemek gereksiz bağımlılık yaratır.
- Kanvas SVG üzerinde render; elemanların konumu Redux state'den okunur.
  `useDrop` drop olayını yakalar → Redux action dispatch → state güncellenir.
- Kablo çizimi için SVG `onPointerDown/onPointerMove/onPointerUp` olayları kullanılır;
  react-dnd kablo çiziminde kullanılmaz.

**Değerlendirilen Alternatifler**:
- `@dnd-kit/core`: Hafif ve modern; ancak mevcut react-dnd kodu zaten mevcut,
  migration maliyeti yüksek.
- Framer Motion: Animasyon odaklı; DnD için doğru araç değil.
- Özel mouse event: react-dnd olmadan doğrudan mouse event; type-safety ve event
  deduplication eksikliği nedeniyle reddedildi.

---

## R2: Animasyon Döngüsü — 60fps Hareket, 66ms Scan

**Karar**: `requestAnimationFrame` hook + Redux hedef konum (targetX/Y) pattern'i.

**Gerekçe**:
- Scan cycle 66ms (~15fps) tetikler; Redux state'te `targetX`/`targetY` günceller.
- `useAnimationFrame` custom hook ~60fps çalışır; her frame'de mevcut konum →
  hedef konuma doğru interpolasyon yapar; sonucu CSS `transform` üzerinden DOM'a yazar.
- Redux per-frame dispatch yapılmaz → gereksiz re-render yok → scan cycle etkilenmez.
- Animasyon bileşen `ref`'i üzerinden CSS transform ile doğrudan manipüle edilir;
  React render döngüsü bypass edilir.

**Değerlendirilen Alternatifler**:
- Redux dispatch 60/s: 60 re-render/s → performans sorunu; Immer overhead; reddedildi.
- cycleScan içinde animasyon: Scan döngüsüne bağımlı; timing sorunlarına neden olur;
  reddedildi.
- Framer Motion: 25KB ek bağımlılık; gereksiz; reddedildi.

**Pattern**:
```
scan (66ms) → dispatch SET_SCENE_TARGET → Redux.scene.blocks[id].targetX/Y güncellenir
rAF (~16ms) → ref.current.x += (targetX - ref.current.x) * 0.2 → CSS transform
```

---

## R3: Güç Devresi Topoloji Doğrulaması

**Karar**: `evaluatePowerCircuitTopology()` saf fonksiyonu — BFS traversal,
`cycleScan.ts` içinden çağrılır, sonuç `temp.powerCircuitEnergized` Set'inde saklanır.

**Gerekçe**:
- Güç devresi bir graf: node = eleman, edge = kablo.
- Güç kaynağından BFS yapılır; erişilebilen düğümler "enerjili" kabul edilir.
- O(V+E) — 100 eleman altı topolojiler için ihmal edilebilir (<1ms).
- `cycleScan.ts` scan sonunda bu fonksiyonu çağırır; sonuç `temp` slice'a yazılır
  (persist edilmez — derived state).
- PLC logic doğrulamasından bağımsız; ayrı saf fonksiyon, ayrı dosya.

**Değerlendirilen Alternatifler**:
- Ladder rung olarak modelleme: Anlam kayması; güç topolojisi ile PLC mantığı
  farklı algoritmalar gerektirir; reddedildi.
- Sürekli doğrulama (her değişiklikte): Gereksiz; scan başına bir kez yeterli.

---

## R4: Redux State Genişletme

**Karar**: Root level'da 3 yeni flat slice (`controlPanel`, `powerCircuit`, `scene`);
export/import'ta yeni anahtarlar opsiyonel; `temp` blacklist korunur.

**Gerekçe**:
- Mevcut store root-level flat yapıda: `rungs`, `branches`, `elements`, `variables`.
  Yeni slice'lar aynı düzeyde eklenir; selector temiz kalır.
- Geriye dönük uyumluluk: Eski JSON'lar (5 zorunlu anahtar) hâlâ import edilir;
  eksik yeni slice'lar reducer'da varsayılan değerlerle doldurulur.
- Export yeni anahtarları her zaman içerir (boş ya da dolu).
- redux-persist: `temp` blacklist korunur; yeni slice'lar otomatik persist edilir.
- Migration gerekmez; yeni slice'ların güvenli varsayılan değerleri var.

**Değerlendirilen Alternatifler**:
- `state.extensions` nested: Selector karmaşıklığı artar; reddedildi.
- Redux Toolkit `createSlice()`: Mevcut kodtabanı ile tutarsız; reddedildi.
