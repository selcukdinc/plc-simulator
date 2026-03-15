# Feature Specification: 3 Bölgeli Endüstriyel PLC Simülatör Çalışma Alanı

**Feature Branch**: `001-3panel-industrial-sim`
**Created**: 2026-03-16
**Status**: Draft
**Input**: Ladder diyagramının çalıştığı mevcut sistemin üzerine; Kumanda Bölümü,
Güç Devre Tasarımı ve Gerçek Hayat Simülasyon Bölümü'nden oluşan, lego tarzı
blok tabanlı, endüstriyel odaklı 3 panelli çalışma alanı eklenmesi.

---

## Clarifications

### Session 2026-03-16

- Q: Üç panel (kumanda, güç devresi, gerçek hayat) ve ladder diyagramı nasıl bir düzende gösterilmeli? → A: Sekmeli (tabs) — Ladder, Kumanda, Güç Devresi, Gerçek Hayat ayrı sekmeler; tek seferde yalnızca biri görünür.
- Q: Ladder değişkeni silinirse bağlı kumanda/sahne elemanlarına ne olmalı? → A: Bağlantı asar, eleman "⚠ Değişken bulunamadı" etiketiyle işaretlenir; silme engellenmez.
- Q: Gerçek hayat sahnesi blok hareketi nasıl modellenmeli? → A: Yapılandırılabilir hız — her blok için kullanıcı birim/saniye cinsinden hız tanımlar; hareket buna göre hesaplanır.
- Q: Güç devresi topoloji doğrulaması gerekli mi? → A: Katı topoloji zorunluluğu — devre fiziksel olarak doğru kurulmadan ladder sinyali güç devresine yansımaz; doğru bağlantı olmadan simülasyon kurmak anlamsızdır.
- Q: Yeni proje oluşturulduğunda paneller nasıl başlamalı? → A: Boş başlar — tüm paneller tamamen boş; kullanıcı sıfırdan kurar.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Kumanda Panelinden Sistemi Tetikleme (Priority: P1)

Bir mühendislik öğrencisi, ladder diyagramında tanımladığı dijital giriş
değişkenlerini kumanda panelinden tıklanabilir butonlar ve anahtarlar aracılığıyla
kontrol etmek istiyor. Mevcut yapıda kontakların durumunu yalnızca değişken
tablosundan değiştirebiliyordu; şimdi gerçek bir kumanda panosu gibi görünen,
tıklandığında ilgili ladder değişkenini tetikleyen bir arayüz istiyor.

**Why this priority**: Kumanda paneli, diğer iki bölge için de tetikleme
noktasıdır. Buradaki veri akışı doğru çalışmadan güç devresi görselleştirmesi ve
gerçek hayat animasyonu anlamsız kalır. Aynı zamanda en hızlı değer sunan MVP
adımıdır — ladder diyagramı zaten çalışıyor, sadece tetikleme arayüzü eksik.

**Independent Test**: Yalnızca kumanda paneli bölümü implement edildiğinde,
kullanıcı bir butona tıklayıp ladder simülasyonunun değiştiğini ve değişken
tablosunda ilgili değerin TRUE/FALSE geçiş yaptığını görebilmelidir.

**Acceptance Scenarios**:

1. **Given** ladder diyagramında bir START_PB (basmalı buton) değişkeni
   tanımlanmış ve simülasyon çalışıyor, **When** kullanıcı kumanda panelindeki
   START butonuna tıklar, **Then** START_PB değişkeni TRUE olur, ilgili XIC
   kontağı kapanır ve varsa çıkış coil'i enerjilenir.
2. **Given** kumanda panelinde bir toggle anahtar eklenmiş, **When** kullanıcı
   anahtarı açık konuma getirir ve bırakır, **Then** anahtar açık konumda kalır
   (latch davranışı) ve ladder döngüsünde değer TRUE olmaya devam eder.
3. **Given** basmalı buton (momentary) eklenmiş, **When** kullanıcı butona
   tıklar ve mouse'u bırakır, **Then** buton FALSE'a döner (momentary davranışı)
   ve ladder bunu OSP/XIC ile algılar.

---

### User Story 2 - Güç Devre Tasarım Alanı (Priority: P2)

Mühendislik öğrencisi, ladder diyagramının endüstriyel güç devresindeki
karşılığını görsel olarak oluşturmak istiyor. Kontaktörler, termik röleler,
motorlar, sigorta ve klemens blokları gibi endüstriyel güç devresi elemanlarını
2 boyutlu bir kanvas üzerine sürükle-bırak yöntemiyle yerleştirip birbirine
bağlayabilecek. Ladder simülasyonu çalışırken güç devresi üzerindeki elemanlar
da enerjilenmeli ya da deaktiflenmeli.

**Why this priority**: Güç devresi, mühendislik eğitiminin kritik bir parçasıdır.
Öğrenciler ladder ile güç devresinin bağlantısını görsel olarak kurabildiğinde
sistem bütünlüğünü çok daha iyi kavrar. Kumanda bölümünden gelen sinyaller güç
devresini etkiler; bu bölüm kumanda bölümüne bağımlıdır.

**Independent Test**: Güç devresi bölümünde bir kontaktör ve motor
yerleştirildiğinde, ladder'da ilgili coil enerjisini aldığında kontaktörün görsel
olarak kapandığı ve motora enerji gittiğinin görülebilmesi bu bölümün tek başına
test edilmesi için yeterlidir.

**Acceptance Scenarios**:

1. **Given** güç devresi kanvası açık ve eleman paleti görünür, **When**
   kullanıcı paletten bir kontaktör bloğunu kanvasa sürükler, **Then** kontaktör
   kanvas üzerine yerleşir ve bağlantı noktaları (terminal) görünür olur.
2. **Given** iki eleman kanvas üzerinde yerleştirilmiş, **When** kullanıcı bir
   terminalden diğerine kablo çizer, **Then** kablo iki elemanı bağlar ve
   devre topolojisi güncellenir.
3. **Given** ladder simülasyonu çalışıyor ve KM1 kontaktör coil'i enerjilenmiş,
   **When** güç devresi görünümü açık, **Then** KM1 kontaktör bloğu enerjili
   görünüm alır (renk değişir, kapanma animasyonu oynar).

---

### User Story 3 - Gerçek Hayat Simülasyon Sahnesi: Vinç Sistemi (Priority: P3)

Mühendislik öğrencisi, ladder diyagramı ve kumanda paneli aracılığıyla kontrol
ettiği bir vinç sisteminin gerçek zamanlı animasyonunu görmek istiyor. Vinç
yatayda (ileri-geri) ve dikeyde (yukarı-aşağı) hareket edebilmeli. Limitler ve
konum sensörleri kanvas üzerinde fiziksel olarak yerleştirilebilmeli; vinç bu
sensörlerin konumuna ulaşınca ilgili ladder değişkeni otomatik olarak
tetiklenmelidir.

**Why this priority**: Gerçek hayat sahnesi tüm sistemin anlam kazandığı katman
olmakla birlikte en karmaşık bölümdür. Kumanda ve güç devresi olmadan
anlamsızdır; bu yüzden P3'tür.

**Independent Test**: Yalnızca sahne bölümü implement edildiğinde, kullanıcı
ladder'da tanımlanmış bir motor değişkeni üzerinden vinç motorunu çalıştırabilmeli,
vincin kanvas üzerinde görsel olarak hareket ettiğini görebilmeli ve yerleştirilen
bir limit sensörüne ulaşınca ladder değişkeninin otomatik tetiklendiğini
doğrulayabilmelidir.

**Acceptance Scenarios**:

1. **Given** gerçek hayat sahnesi açık ve bir vinç bloğu yerleştirilmiş,
   **When** ladder'da MOTOR_ILERI coil'i enerjilenirse, **Then** vinç bloğu
   kanvas üzerinde yatay olarak ileri doğru hareket eder.
2. **Given** sahneye bir sağ limit sensörü blok olarak yerleştirilmiş ve
   ilgili değişken ladder'da bir XIC kontağına bağlı, **When** vinç bu bloğun
   koordinatlarına ulaşır, **Then** sensör değişkeni otomatik olarak TRUE olur
   ve ladder bunu algılar.
3. **Given** vinç hem yatay hem dikey motorlara sahip, **When** MOTOR_ASAGI
   coil'i enerjilenirse, **Then** vinç yük kancası aşağı doğru hareket eder
   ve alt limit sensörüne çarptığında durur.
4. **Given** kullanıcı yeni bir senaryo oluşturmak istiyor, **When** sahneye
   bir lift table bloğu sürükler, **Then** bu blok vincin bloğundan bağımsız
   olarak ladder değişkenleriyle eşleştirilebilir.

---

### User Story 4 - Blok Kütüphanesi ve Lego Birleştirme (Priority: P4)

Kullanıcı, proje kapsamını vinç ile sınırlı kalmadan genişletebilmek istiyor.
Farklı endüstriyel makine blokları (konveyör, pnömatik silindir, ışık kulesi,
kaldırma platformu, limit switch) kütüphaneden seçilerek sahneye eklenebilmeli
ve her biri ladder değişkenleriyle ilişkilendirilebilmelidir.

**Why this priority**: Blok kütüphanesi projenin uzun vadeli öğretim değerini
belirler. Ancak bir sonraki sürümde eklenebilir; P1-P3 çalışmadan bu bölümün
değeri yoktur.

**Independent Test**: Kütüphaneden konveyör bloğu sahnede kullanılabilmeli ve
ladder değişkeniyle eşleştirildikten sonra enerjinin animasyona yansıdığı
görülmelidir.

**Acceptance Scenarios**:

1. **Given** blok kütüphanesi açık, **When** kullanıcı "Konveyör" öğesini
   arar, **Then** ilgili blok listelenir ve sahneye sürüklenebilir.
2. **Given** bir konveyör bloğu sahneye eklenmiş, **When** kullanıcı blok
   özelliklerinden bir ladder değişkeni atar, **Then** o değişken enerjisini
   aldığında konveyör animasyonu başlar.

---

### Edge Cases

- Kumanda panelindeki butona hiçbir ladder değişkeni atanmadan tıklanırsa →
  buton görsel tepki verir ama hiçbir şey tetiklenmez; "Değişken atanmamış"
  uyarısı gösterilir.
- Güç devresinde kablo çizilirken aynı terminal hem çıkış hem giriş olarak
  bağlanmaya çalışılırsa → kısa devre uyarısı görsel olarak gösterilir,
  bağlantı iptal edilir.
- Güç devresinde bir eleman güç kaynağına kablo ile bağlı değilse, ladder
  sinyali o elemana yansımaz; eksik bağlantı terminal üzerinde görsel
  olarak işaretlenir.
- Vinç bloğu kanvas sınırının dışına çıkarsa → vinç kenarda durur; limit sensörü
  yoksa sonsuz hareket engellenir.
- Aynı ladder değişkeni birden fazla kumanda elemanına veya sahne bloğuna
  atanabilir; her atama geçerlidir ve hepsi aynı anda tepki verir.
- Simülasyon durdurulurken vinç hareket halindeyse → vinç anında durur, son
  konumunu korur.
- Bir ladder değişkeni değişken tablosundan silinirse, bağlı tüm kumanda ve
  sahne elemanları "⚠ Değişken bulunamadı" etiketiyle işaretlenir; elemanlar
  silinmez ve silme işlemi engellenmez.
- Proje export/import (mevcut JSON) işlemi 3 panel verisini de kapsamalıdır;
  import sonrası tüm panel konfigürasyonları geri yüklenmelidir.

---

## Requirements *(mandatory)*

### Functional Requirements

**Kumanda Bölümü**

- **FR-001**: Kullanıcılar kumanda paneli alanına basmalı buton (momentary),
  toggle anahtar, sinyal lambası ve acil stop gibi standart kumanda elemanları
  ekleyebilmelidir.
- **FR-002**: Her kumanda elemanı, projedeki herhangi bir ladder değişkeniyle
  ilişkilendirilebilmelidir.
- **FR-003**: Basmalı buton elemanları fare bırakıldığında FALSE'a dönmelidir
  (momentary davranışı); toggle anahtarlar durumlarını korumalıdır.
- **FR-004**: Kumanda elemanlarının görsel durumu (enerjili/deenerjili), bağlı
  ladder değişkeninin gerçek zamanlı değerini yansıtmalıdır.
- **FR-005**: Kullanıcılar kumanda elemanlarını panelde özgürce
  konumlandırabilmeli ve etiketleyebilmelidir.

**Güç Devresi Tasarım Alanı**

- **FR-006**: Kullanıcılar güç devresi kanvasına kontaktör, termik röle, motor,
  sigorta ve klemens blokları sürükle-bırak yöntemiyle ekleyebilmelidir.
- **FR-007**: Elemanlar arasında kablo çizgisi ile bağlantı kurulabilmelidir;
  bağlantılar devre topolojisini oluşturur.
- **FR-008**: Ladder simülasyonu çalışırken güç devresi elemanlarının görsel
  durumu gerçek zamanlı güncellenmelidir.
- **FR-008a**: Güç devresi topolojisi doğrulanmalıdır: bir eleman güç
  kaynağına fiziksel kablo bağlantısıyla bağlı değilse, ladder coil'i
  energilense dahi o elemana enerji yansımaz. Eksik bağlantı görsel olarak
  işaretlenir (kırmızı/sarı terminal).
- **FR-009**: Güç devresi elemanları ladder değişkenleriyle ilişkilendirilmelidir;
  bir kontaktörün kapanması ilgili coil'in enerji almasıyla tetiklenmelidir.

**Gerçek Hayat Simülasyon Sahnesi**

- **FR-010**: Kullanıcılar 2D kanvas sahnesine vinç, konveyör, pnömatik silindir
  ve lift table gibi endüstriyel makine bloklarını ekleyebilmelidir.
- **FR-011**: Her makine bloğu, hareketini kontrol eden ladder değişkenleriyle
  ilişkilendirilebilmelidir. Kullanıcı her blok için hareket hızını birim/saniye
  cinsinden yapılandırabilmelidir; hareket bu değere ve scan döngüsüne göre
  hesaplanır.
- **FR-012**: Makine blokları sahne üzerinde gerçek zamanlı hareket animasyonu
  sergilemelidir; hareket ladder döngüsüyle senkronize çalışmalıdır.
- **FR-013**: Kullanıcılar sahneye limit switch, fotoelektrik sensör veya
  proximity sensör bloğu yerleştirebilmeli; makine bloğu bu koordinata
  ulaştığında bağlı ladder değişkeni otomatik olarak tetiklenmelidir.
- **FR-014**: Vinç sistemi yatay (x ekseni) ve dikey (y ekseni) olmak üzere
  bağımsız iki eksen üzerinde hareket edebilmelidir; her eksen ayrı ladder
  değişkenleriyle kontrol edilmelidir.

**Genel**

- **FR-015**: Ladder Diyagramı, Kumanda, Güç Devresi ve Gerçek Hayat olmak üzere
  dört sekme bulunmalıdır; kullanıcı sekmeler arasında geçiş yaparak tek seferde
  bir paneli görüntüler.
- **FR-016**: Panel konfigürasyonları mevcut export/import JSON formatıyla
  kaydedilip yüklenebilmelidir.
- **FR-017**: Tüm paneller mevcut ladder diyagram bölümüyle aynı simülasyon
  motorunu paylaşmalıdır; ortak değişken tablosu tek kaynak olmalıdır.

### Key Entities

- **KumandaElemanı**: Kumanda panelindeki bir kontrol cihazı (buton, anahtar,
  lamba). Türü, konumu, etiketi ve bağlı ladder değişkeni vardır.
- **GüçDevreElemanı**: Güç devresindeki bir endüstriyel bileşen (kontaktör,
  motor, vb.). Konumu, terminal bağlantıları ve bağlı ladder değişkeni vardır.
- **SahneBloğu**: Gerçek hayat sahnesindeki makine veya sensör bloğu. Tipi,
  2D konumu, hareket eksenleri ve bağlı ladder değişkenleri vardır.
- **SensörBloğu**: Sahneye fiziksel olarak yerleştirilmiş algılayıcı.
  Koordinatı, tetikleme alanı ve bağlı ladder değişkeni vardır.
- **PanelKonfigürasyonu**: Bir panel içindeki tüm eleman düzeni ve bağlantılar.
  Projeyle birlikte export/import edilir.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Daha önce sistemi kullanmamış bir mühendislik öğrencisi, kumanda
  paneline ilk elemanını ekleyip ladder değişkeniyle ilişkilendirmeyi 5 dakika
  içinde tamamlayabilmelidir.
- **SC-002**: Ladder simülasyonu çalışırken kumanda paneli, güç devresi ve
  gerçek hayat sahnesi arasındaki görsel geri bildirim gecikmesi 100ms'nin
  altında olmalıdır.
- **SC-003**: Kullanıcı, vinç sistemi kurarak ileri/geri + yukarı/aşağı
  hareketini ve en az 2 limit sensörünü çalışır hale getirecek tam bir
  senaryoyu 30 dakika içinde tamamlayabilmelidir.
- **SC-004**: Blok kütüphanesinde en az 5 farklı endüstriyel makine tipi
  bulunmalı; bunların tamamı sahneye eklenip bağımsız olarak ladder ile
  eşleştirilebilmelidir.
- **SC-005**: Panel konfigürasyonu dahil tam proje export/import işlemi
  sorunsuz çalışmalıdır; import sonrası hiçbir eleman veya bağlantı
  kaybolmamalıdır.
- **SC-006**: Sistem, 10 veya daha fazla sahne bloğu ve 20 veya daha fazla
  kumanda elemanı ile 66ms scan döngüsü bozulmadan çalışabilmelidir.

---

## Assumptions

- Güç devresi tasarımı gerçek elektriksel hesaplama (akım, gerilim) yapmaz;
  sadece görsel temsil ve enerjileme durumu simüle edilir.
- Gerçek hayat sahnesi 2D'dir; 3D render gerektirmez.
- Blok kütüphanesi sabit bir ön tanımlı set ile başlar; kullanıcı özel blok
  oluşturmaz (bu kapsam dışıdır).
- Mevcut Redux tabanlı state yönetimi ve 66ms simülasyon döngüsü korunur;
  yeni paneller bu altyapıyı genişletir, değiştirmez.
- Arayüz dili Türkçe olarak başlar; çok dilli destek bu kapsam dışıdır.
- Yeni proje oluşturulduğunda tüm paneller (Kumanda, Güç Devresi, Gerçek Hayat)
  boş başlar; hazır şablon veya örnek kurulum sunulmaz.
