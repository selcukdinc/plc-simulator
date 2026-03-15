# Quickstart: 3 Bölgeli Endüstriyel PLC Simülatör

**Branch**: `001-3panel-industrial-sim` | **Date**: 2026-03-16

Bu kılavuz, üç yeni panelin nasıl kullanılacağını ve bunların ladder diyagramı ile
nasıl entegre çalıştığını gösterir.

---

## Ön Koşul

- Ladder diyagramında en az bir değişken tanımlanmış olmalıdır (örn. `START_PB`,
  `KM1_COIL`, `MOTOR_ILERI`).
- Simülasyon en az bir kez çalıştırılmış olmalıdır.

---

## Senaryo 1: Kumanda Paneli — Basmalı Buton ile START/STOP

### Adımlar

1. Üst sekme çubuğundan **Kumanda** sekmesine tıkla.
2. Sol paletten **Basmalı Buton** öğesini panele sürükle.
3. Butona çift tıkla → "Değişken Seç" açılır. `START_PB` seç → Kaydet.
4. Ladder sekmesine dön → simülasyonu başlat.
5. Kumanda sekmesine geç → START butonuna basılı tut.
   - Beklenen: `START_PB = TRUE`, ladder'daki ilgili XIC kontağı kapanır.
6. Butonu bırak → `START_PB = FALSE`.

### Toggle Anahtar

1. Paletten **Toggle Anahtar** sürükle → `MOTOR_ENABLE` değişkenine ata.
2. Anahtara tıkla → açık konuma geçer, `MOTOR_ENABLE = TRUE` olur ve kalır.
3. Tekrar tıkla → `MOTOR_ENABLE = FALSE`.

---

## Senaryo 2: Güç Devresi — Kontaktörlü Motor Devresi

### Hedef Devre
```
L1 ──── KM1 kontaktör ──── M1 motor
L2 ─────────────────────── M1 motor
L3 ─────────────────────── M1 motor
```

### Adımlar

1. **Güç Devresi** sekmesine geç.
2. Paletten **Güç Kaynağı** → kanvasa sol üste yerleştir.
3. Paletten **Kontaktör** → kanvasa ortaya sürükle → etiketi "KM1" yap.
4. KM1'e çift tıkla → "Değişken Seç" → ladder'daki `KM1_COIL` değişkenini ata.
5. Paletten **Motor** → sağa yerleştir → etiketi "M1" yap.
6. **Kablo çizimi**: Güç Kaynağının çıkış terminalinden KM1'in giriş terminaline
   → tıkla, sürükle, bırak.
7. KM1'in çıkış terminalinden M1'in giriş terminaline → kablo çiz.
8. Simülasyonu başlat → Kumanda'dan `KM1_COIL` değişkenini tetikle.
   - Beklenen: KM1 kontaktör yeşil/enerjili görünüm alır, M1 motor enerjilenir.
9. KM1'e kablo bağlamadan simülasyon başlatırsan → M1 enerjilenmez;
   terminal kırmızı ile işaretlenir.

---

## Senaryo 3: Gerçek Hayat Sahnesi — Vinç Sistemi

### Hedef
Yatay hareket eden bir vinç arabası + dikey hareket eden kanca + 4 limit sensörü.

### Adımlar

1. **Gerçek Hayat** sekmesine geç.
2. Paletten **Vinç Arabası** → kanvasa üst ortaya yerleştir.
   - Çift tıkla → Özellikler:
     - İleri değişkeni: `MOTOR_ILERI` → Tamam
     - Geri değişkeni: `MOTOR_GERI` → Tamam
     - Hız: `150 px/s`
     - X sınırları: min `50`, max `800`
3. Paletten **Vinç Kancası** → kanvasa arabaya altına yerleştir.
   - Özellikler:
     - Aşağı değişkeni: `MOTOR_ASAGI`
     - Yukarı değişkeni: `MOTOR_YUKARI`
     - Hız: `80 px/s`
     - Y sınırları: min `100`, max `500`
4. **Limit Sensörü** → 4 adet yerleştir:
   - Sol limit: x=50, y=arabakY → `LS_SOL` değişkeni ata
   - Sağ limit: x=800, y=arabakY → `LS_SAG` değişkeni ata
   - Üst limit: x=arabaX, y=100 → `LS_YUKARI` değişkeni ata
   - Alt limit: x=arabaX, y=500 → `LS_ASAGI` değişkeni ata
5. Ladder sekmesinde:
   - `MOTOR_ILERI` XIC kontağına `LS_SAG` XIO kontağını seri bağla (sağa gidince dur)
   - Benzer şekilde diğer yönler için ladder yaz.
6. Simülasyonu başlat → Kumanda sekmesinden `MOTOR_ILERI` butonuna bas.
   - Beklenen: Vinç arabası sağa doğru hareket eder, sağ limit sensörüne ulaşınca
     `LS_SAG = TRUE` → ladder `MOTOR_ILERI`'yi deaktif eder → vinç durur.

---

## Doğrulama Kontrol Listesi

- [ ] Kumanda butonu basılınca değişken tablosunda TRUE göründü
- [ ] Kumanda butonu bırakılınca (basmalı) FALSE'a döndü
- [ ] Güç devresinde kablo eksikken motor enerjilenmedi
- [ ] Kablo bağlayınca kontaktör enerjilendi, motor enerjilendi
- [ ] Vinç kanvasta hareket etti
- [ ] Limit sensörüne ulaşınca ilgili değişken TRUE oldu
- [ ] Simülasyon durdurulunca vinç durdu ve son konumunda kaldı
- [ ] Export yapıp import sonrası tüm paneller geri yüklendi
- [ ] Tarayıcı konsolunda hata/uyarı yok

---

## Yaygın Sorunlar

| Sorun | Neden | Çözüm |
|-------|-------|-------|
| Buton bastım, değişken değişmedi | variableId atanmamış | Butona çift tıkla, değişken ata |
| Motor enerjilenmedi | Güç kaynağına kablo yok | Güç devresinde kablo bağlantısını kontrol et |
| Vinç hareket etmiyor | Değişken ataması eksik | Blok özelliklerinden ileri/geri değişkeni ata |
| Silinmiş değişken uyarısı | Ladder'dan değişken silindi | Yeni değişken ata veya ladder'da yeniden oluştur |
