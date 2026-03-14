# Roadmap

## v1.7 — Hızlı Düzeltmeler ✅
> Öncelikli, kısa vadeli iyileştirmeler

- [x] Firebase hata mesajını kaldır (Firebase config yoksa sessizce devam et)
- [x] Karanlık mod (Dark mode) — CSS custom properties + MUI palette mode entegrasyonu
- [x] Genel UI modernizasyonu — sistem font ailesi, temiz renk paleti, MUI dark theme

---

## v1.8 — Profesyonel UI
> Görsel kimlik yenileme

- [ ] Tutarlı design system (renk, gölge, border-radius token'ları)
- [ ] Toolbar yeniden tasarımı — tooltip'ler, gruplandırma
- [ ] Responsive iyileştirmeler
- [ ] Animasyonlar — simülasyon çalışırken enerji akışının görsel olarak belirginleşmesi

---

## v2.0 — Gerçek Hayat Simülasyonu
> Ladder diyagramından gerçek dünya sahnesine

### Elektrik Panosu Görünümü
- [ ] Coil → fiziksel kontaktör görseline eşleme
- [ ] Kontaktörün 3 fazlı asenkron motora bağlanması
- [ ] "Simülasyon çalıştır" → motorun döndüğünün animasyonla gösterilmesi

### Hazır Senaryo Örnekleri
- [ ] **Direk yolveren:** Tek butonla motor çalıştır/durdur
- [ ] **İleri-Geri:** Sağa/sola hareket eden yük (örn. vinç kolu)
- [ ] **Vinç:** Yukarı/aşağı hareket, buton kontrolü, limit switch

---

## v2.5 — Güç Devresi Editörü
> Kontrol devresiyle eş zamanlı güç devresi çizimi

### Mimari Gereksinimler
- [ ] Element sistemi genişletilebilir yapıya kavuşturulacak
  - `elementTypes.ts` kategorilere ayrılacak: `control`, `power`, `mechanical`
  - Her element tipi kendi renderer ve simülasyon handler'ına sahip olacak
- [ ] Yeni güç devresi elementleri:
  - [ ] 3 fazlı asenkron motor (genel sembol)
  - [ ] Kontaktör güç kontakları (L1/L2/L3 → T1/T2/T3)
  - [ ] Termik röle
  - [ ] Sigorta / NH sigorta
  - [ ] Bara (busbar)

### Motor Bağlantı Şemaları
- [ ] **Yıldız bağlantısı** — sargı uçları açık şema (U1-V1-W1 / U2-V2-W2)
- [ ] **Üçgen bağlantısı** — sargı uçları açık şema
- [ ] **Yıldız-Üçgen yolveren** — kontaktör kombinasyonu ile otomatik geçiş
  - Ladder diyagramıyla güç devresinin senkron simülasyonu

---

## v3.0 — Online İşbirliği
> Paylaşım ve topluluk

- [ ] Proje kütüphanesi — kayıtlı kullanıcıların projelerini listeleyip paylaşması
- [ ] Proje fork'lama (uygulama içinden)
- [ ] Gerçek zamanlı işbirliği (multi-user editing)
- [ ] Senaryo marketplace — hazır eğitim içerikleri

---

## Teknik Borç
> Herhangi bir versiyonda ele alınabilir

- [ ] Timer function block'u için ayrı "contact" elementi (XIC ile `timer.Q` referansı)
- [ ] Aynı FB instance'ının birden fazla rung'da kullanımına dair kullanıcı uyarısı
- [ ] Unit test altyapısı (`cycleScan` için)
- [ ] `cycleScan.ts` büyüdükçe dosyayı element kategorilerine göre böl

---

## Değişiklik Geçmişi

| Sürüm | Tarih | Değişiklik |
|-------|-------|------------|
| v1.7 | 2026-03-14 | Dark mode (CSS vars + MUI), Firebase sessiz hata, subpath shareUuid fix |
| v1.6.x | — | TON timer bug fix, JSON export/import, deploy workflow |
