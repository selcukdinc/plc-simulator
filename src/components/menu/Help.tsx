import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Divider,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { ReactComponent as HelpSvg } from '../../svg/help.svg';
import { ReactComponent as UndoSvg } from '../../svg/undo.svg';
import { ReactComponent as RedoSvg } from '../../svg/redo.svg';
import { ReactComponent as FileTextSvg } from '../../svg/fileText.svg';
import { ReactComponent as FileEmptySvg } from '../../svg/fileEmpty.svg';
import { ReactComponent as FileDownloadSvg } from '../../svg/fileDownload.svg';
import { ReactComponent as FileUploadSvg } from '../../svg/fileUpload.svg';
import { ReactComponent as SimStartSvg } from '../../svg/simulationStart.svg';
import { ReactComponent as ContactSvg } from '../../svg/toolbox/contact.svg';
import { ReactComponent as CoilSvg } from '../../svg/toolbox/coil.svg';
import { ReactComponent as TimerSvg } from '../../svg/toolbox/timer.svg';
import { ReactComponent as CounterSvg } from '../../svg/toolbox/counter.svg';
import { ReactComponent as MathSvg } from '../../svg/toolbox/math.svg';
import { ReactComponent as CompareSvg } from '../../svg/toolbox/compare.svg';
import { ReactComponent as GateSvg } from '../../svg/toolbox/gate.svg';
import { ReactComponent as MoveSvg } from '../../svg/toolbox/move.svg';
import { ReactComponent as BranchSvg } from '../../svg/toolbox/branch.svg';
import { ReactComponent as RungSvg } from '../../svg/toolbox/rung.svg';
import SvgButton from '../SvgButton';

const pulse = keyframes`
25% { transform: scale(0.8); }
75% { transform: scale(1.2); }
`;

const StyledHelpSvg = styled(HelpSvg)`
  animation: ${pulse} 1s linear 5;
  animation-delay: 10s;
`;

const BtnChip = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  background: var(--color-button-bg, rgba(255,255,255,0.15));
  border-radius: var(--radius-md, 6px);
  border: 1px solid rgba(0,0,0,0.12);
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  margin-bottom: 0.55rem;
  font-size: 0.85rem;
`;

const RowText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;

const Label = styled.span`
  font-weight: 600;
  font-size: 0.85rem;
`;

const Desc = styled.span`
  color: var(--color-text-muted, #666);
  font-size: 0.82rem;
`;

const Section = styled.div`
  margin-bottom: 1.2rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 0.65rem 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-primary, #1976d2);
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const CreditCard = styled.div`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.04);
  font-size: 0.82rem;
`;

const CreditName = styled.div`
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
`;

const CreditSub = styled.div`
  color: var(--color-text-muted, #888);
  font-size: 0.78rem;
`;

const StepList = styled.ol`
  margin: 0.3rem 0 0.8rem 1.2rem;
  padding: 0;
  font-size: 0.82rem;
  color: var(--color-text-muted, #555);
  li { margin-bottom: 0.25rem; }
`;

const TipBox = styled.div`
  background: rgba(25, 118, 210, 0.06);
  border-left: 3px solid var(--color-primary, #1976d2);
  border-radius: 0 6px 6px 0;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  color: var(--color-text-muted, #555);
  margin-bottom: 0.8rem;
`;

const VersionBadge = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  background: var(--color-primary, #1976d2);
  color: #fff;
  border-radius: 4px;
  padding: 1px 6px;
  margin-left: 6px;
  vertical-align: middle;
`;

function BtnIcon({ Svg }: { Svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }) {
  return (
    <BtnChip>
      <Svg style={{ width: '60%', height: '60%', filter: 'brightness(0) opacity(0.6)' }} />
    </BtnChip>
  );
}

/* ── Sekme içerikleri ───────────────────────────────────── */

function TabGenel() {
  return (
    <>
      <Section>
        <SectionTitle>Bu Simülatör Nedir?</SectionTitle>
        <Desc>
          Endüstriyel PLC programlama ortamını web tarayıcısında simüle eden,
          açık kaynaklı bir eğitim aracıdır. 4 çalışma alanı sunar:
        </Desc>
        <StepList>
          <li><strong>Ladder Diyagramı</strong> — PLC mantık programı (kontaklar, bobinler, zamanlayıcılar…)</li>
          <li><strong>Kumanda Paneli</strong> — Tıklanabilir butonlar ve lambalarla ladder değişkenlerini tetikle</li>
          <li><strong>Güç Devresi</strong> — Kontaktör, motor, sigorta bağlantılarını 2D çiz</li>
          <li><strong>Gerçek Hayat Sahnesi</strong> — Vinç, konveyör gibi makinelerin animasyonlu simülasyonu</li>
        </StepList>
        <TipBox>
          Simülasyon <strong>66 ms</strong>&apos;de bir döngü tarar (≈ 15 Hz). Tüm paneller aynı değişken
          tablosunu paylaşır — ladder&apos;da tanımlanan değişkenler her panelde kullanılabilir.
        </TipBox>
      </Section>

      <Section>
        <SectionTitle>Araç Çubuğu (Üst Menü)</SectionTitle>
        <Row>
          <BtnIcon Svg={UndoSvg} />
          <RowText><Label>Geri Al</Label><Desc>Son işlemi geri alır.</Desc></RowText>
        </Row>
        <Row>
          <BtnIcon Svg={RedoSvg} />
          <RowText><Label>İleri Al</Label><Desc>Geri alınan işlemi yeniden uygular.</Desc></RowText>
        </Row>
        <Row>
          <BtnIcon Svg={FileTextSvg} />
          <RowText><Label>Örnek Proje</Label><Desc>Hazır bir ladder diyagramı yükler (mevcut proje silinir).</Desc></RowText>
        </Row>
        <Row>
          <BtnIcon Svg={FileEmptySvg} />
          <RowText><Label>Boş Proje</Label><Desc>Tüm diyagramı temizler, sıfırdan başlar.</Desc></RowText>
        </Row>
        <Row>
          <BtnIcon Svg={FileDownloadSvg} />
          <RowText>
            <Label>Dışa Aktar</Label>
            <Desc>Tüm çalışma alanını (ladder + 3 panel) <strong>.json</strong> olarak indirir.</Desc>
          </RowText>
        </Row>
        <Row>
          <BtnIcon Svg={FileUploadSvg} />
          <RowText>
            <Label>İçe Aktar</Label>
            <Desc>Daha önce dışa aktarılan <strong>.json</strong> dosyasını yükler. Mevcut veriyi değiştirir.</Desc>
          </RowText>
        </Row>
        <Row>
          <BtnIcon Svg={SimStartSvg} />
          <RowText>
            <Label>Simülasyon Başlat / Durdur</Label>
            <Desc>Simülasyon döngüsünü başlatır. Durdurulduğunda tüm çıkışlar sıfırlanır, vinçler son konumda dondurulur.</Desc>
          </RowText>
        </Row>
      </Section>
    </>
  );
}

function TabLadder() {
  return (
    <>
      <Section>
        <SectionTitle>Araç Kutusu — Kontaklar & Bobinler</SectionTitle>
        <Row>
          <BtnIcon Svg={ContactSvg} />
          <RowText>
            <Label>Kontak</Label>
            <Desc>XIC (NO), XIO (NC), OSP (Yükselen Kenar), OSN (Düşen Kenar) — Properties&apos;den değiştir.</Desc>
          </RowText>
        </Row>
        <Row>
          <BtnIcon Svg={CoilSvg} />
          <RowText>
            <Label>Bobin (Coil)</Label>
            <Desc>OTE (Normal), OTL (Set), OTU (Reset), OTN (Negatif) — Properties&apos;den değiştir.</Desc>
          </RowText>
        </Row>
        <Row>
          <BtnIcon Svg={TimerSvg} />
          <RowText>
            <Label>Zamanlayıcı</Label>
            <Desc>TON (On Delay), TOF (Off Delay), TONR (Retentive) — PT değeri Properties&apos;den girilir.</Desc>
          </RowText>
        </Row>
        <Row>
          <BtnIcon Svg={CounterSvg} />
          <RowText>
            <Label>Sayaç</Label>
            <Desc>CTU (Yukarı), CTD (Aşağı), CTUD (Her İki Yön) — PV değeri Properties&apos;den girilir.</Desc>
          </RowText>
        </Row>
        <Row>
          <BtnIcon Svg={MathSvg} />
          <RowText><Label>Matematik</Label><Desc>ADD, SUB, MUL, DIV — iki girişi işleyip çıkışa yazar.</Desc></RowText>
        </Row>
        <Row>
          <BtnIcon Svg={CompareSvg} />
          <RowText><Label>Karşılaştırma</Label><Desc>EQU, NEQ, GRT, GEQ, LES, LEQ — koşul sağlanırsa RLO geçer.</Desc></RowText>
        </Row>
        <Row>
          <BtnIcon Svg={GateSvg} />
          <RowText><Label>NOT Kapısı</Label><Desc>Gelen sinyali tersler, değişken gerektirmez.</Desc></RowText>
        </Row>
        <Row>
          <BtnIcon Svg={GateSvg} />
          <RowText><Label>Mantık Kapısı</Label><Desc>AND, OR, NAND, NOR — Properties&apos;den kapı tipi seçilir.</Desc></RowText>
        </Row>
        <Row>
          <BtnIcon Svg={MoveSvg} />
          <RowText><Label>Kopyala (Move)</Label><Desc>Bir değişkenin değerini başka bir değişkene kopyalar.</Desc></RowText>
        </Row>
        <Row>
          <BtnIcon Svg={BranchSvg} />
          <RowText><Label>Dal (Branch)</Label><Desc>Rung&apos;a paralel dal ekler — OR mantığı oluşturur.</Desc></RowText>
        </Row>
        <Row>
          <BtnIcon Svg={RungSvg} />
          <RowText><Label>Rung Ekle</Label><Desc>Diyagrama yeni bir ladder satırı ekler.</Desc></RowText>
        </Row>
      </Section>

      <Section>
        <SectionTitle>Tipik Kullanım Akışı</SectionTitle>
        <StepList>
          <li>Sol panelden değişken ekle (örn. <code>START_PB</code>, <code>KM1_COIL</code>).</li>
          <li>Toolbox&apos;tan elemana tıkla → diyagrama sürükle veya tıklayarak ekle.</li>
          <li>Elemanın üzerine tıkla → Properties panelinden değişken ata ve tipi değiştir.</li>
          <li>Simülasyonu başlat → değişken tablosunda değerleri gerçek zamanlı izle.</li>
        </StepList>
        <TipBox>
          Aynı timer instance&apos;ı birden fazla rung&apos;a eklenebilir. İkinci karşılaşmada
          yalnızca <code>RLO &amp;&amp; Q</code> döner, timer state değişmez.
        </TipBox>
      </Section>
    </>
  );
}

function TabKumanda() {
  return (
    <>
      <Section>
        <SectionTitle>Kumanda Paneli Nedir?</SectionTitle>
        <Desc>
          Gerçek kumanda panosu gibi davranır. Ladder&apos;daki değişkenleri
          tıklanabilir butonlar ve anahtarlar aracılığıyla tetikler.
          Simülatörü klavye yerine sahne elemanları ile kullanmanızı sağlar.
        </Desc>
      </Section>

      <Section>
        <SectionTitle>Eleman Tipleri</SectionTitle>
        <Row>
          <RowText>
            <Label>🔵 Basmalı Buton (Push Button)</Label>
            <Desc>Basılı tuttuğunuz sürece değişken TRUE, bırakınca FALSE olur. Momentary mantığı.</Desc>
          </RowText>
        </Row>
        <Row>
          <RowText>
            <Label>🔀 Toggle Anahtar</Label>
            <Desc>Her tıklamada durumu değişir (TRUE → FALSE → TRUE). Durum kalır.</Desc>
          </RowText>
        </Row>
        <Row>
          <RowText>
            <Label>🟢 Sinyal Lambası (Pilot Lamp)</Label>
            <Desc>Bağlı değişkenin değerini görüntüler. Tıklanamaz, salt okunur.</Desc>
          </RowText>
        </Row>
        <Row>
          <RowText>
            <Label>🔴 Acil Stop</Label>
            <Desc>Toggle mantığıyla çalışır. Aktifken kırmızı glow yanar.</Desc>
          </RowText>
        </Row>
      </Section>

      <Section>
        <SectionTitle>Nasıl Kullanılır?</SectionTitle>
        <StepList>
          <li>Üst sekmelerden <strong>Kumanda</strong>&apos;ya geç.</li>
          <li>Sol paletten bir eleman sürükleyip kanvasa bırak.</li>
          <li>Elemana <strong>çift tıkla</strong> → açılan diyalogdan ladder değişkenini seç.</li>
          <li>Simülasyonu başlat → elemana bas → değişken tablosunda değişimi gör.</li>
        </StepList>
        <TipBox>
          ⚠ Değişken atanmamış uyarısı görünüyorsa elemana çift tıklayarak değişken ata.
          Ladder&apos;dan silinen değişkenler için &ldquo;⚠ Değişken bulunamadı&rdquo; gösterilir.
        </TipBox>
      </Section>
    </>
  );
}

function TabGucDevresi() {
  return (
    <>
      <Section>
        <SectionTitle>Güç Devresi Nedir?</SectionTitle>
        <Desc>
          2D SVG kanvası üzerinde endüstriyel güç devresi çizmenizi sağlar.
          Ladder mantığı ve kontaktör değişkenleri aracılığıyla devre
          enerjileme durumu görsel olarak yansıtılır.
        </Desc>
      </Section>

      <Section>
        <SectionTitle>Eleman Tipleri</SectionTitle>
        <Row>
          <RowText><Label>⚡ Güç Kaynağı</Label><Desc>BFS&apos;nin başlangıç noktası. Her zaman enerjilidir (L1/L2/L3).</Desc></RowText>
        </Row>
        <Row>
          <RowText><Label>🔌 Kontaktör (KM)</Label><Desc>Bağlı ladder coil değişkeni TRUE olunca enerji iletir. Çift tıkla → değişken ata.</Desc></RowText>
        </Row>
        <Row>
          <RowText><Label>🔥 Termik Röle (F)</Label><Desc>Pasif koruma elemanı. Kablo bağlıysa her zaman iletir.</Desc></RowText>
        </Row>
        <Row>
          <RowText><Label>⚙ Motor (M)</Label><Desc>Güç tüketici. Enerji aldığında yeşil görünür, enerji iletmez.</Desc></RowText>
        </Row>
        <Row>
          <RowText><Label>🔒 Sigorta (Q)</Label><Desc>Pasif. Her zaman iletir.</Desc></RowText>
        </Row>
        <Row>
          <RowText><Label>🔲 Klemens</Label><Desc>Bağlantı noktası. Birden fazla kablo birleştirmek için kullanılır.</Desc></RowText>
        </Row>
      </Section>

      <Section>
        <SectionTitle>Nasıl Kullanılır?</SectionTitle>
        <StepList>
          <li>Üst sekmelerden <strong>Güç Devresi</strong>&apos;ne geç.</li>
          <li>Sol paletten elemanı kanvasa sürükle-bırak.</li>
          <li>Bir terminal noktasına (kırmızı/yeşil daire) <strong>pointer ile bas</strong> → başka terminale sürükle → bırak → kablo çizilir.</li>
          <li>Kontaktöre <strong>çift tıkla</strong> → ladder coil değişkenini ata.</li>
          <li>Simülasyonu başlat → kontaktör enerjilenince devre yeşil renk alır.</li>
        </StepList>
        <TipBox>
          Kabloyu silmek için kabloların üzerine <strong>çift tıkla</strong>.
          Güç kaynağına kablo bağlı olmayan eleman hiçbir zaman enerjilenmez.
        </TipBox>
      </Section>
    </>
  );
}

function TabSahne() {
  return (
    <>
      <Section>
        <SectionTitle>Gerçek Hayat Sahnesi Nedir?</SectionTitle>
        <Desc>
          Ladder mantığınızın fiziksel sonuçlarını 2D animasyonlu ortamda
          görmenizi sağlar. Blok tabanlı yapıyla gerçek sistemleri modellerin.
        </Desc>
      </Section>

      <Section>
        <SectionTitle>Makine Blokları</SectionTitle>
        <Row>
          <RowText><Label>🏗 Vinç Arabası (Crane Trolley)</Label><Desc>Yatay hareket. İleri/Geri değişken ataması.</Desc></RowText>
        </Row>
        <Row>
          <RowText><Label>🪝 Vinç Kancası (Crane Hook)</Label><Desc>Dikey hareket. Yukarı/Aşağı değişken ataması.</Desc></RowText>
        </Row>
        <Row>
          <RowText><Label>📦 Konveyör (Conveyor)</Label><Desc>Yatay bant hareketi. İleri/Geri değişken ataması.</Desc></RowText>
        </Row>
        <Row>
          <RowText><Label>🔧 Pnömatik Silindir</Label><Desc>Piston uzama/çekme. Tek eksen hareketi.</Desc></RowText>
        </Row>
        <Row>
          <RowText><Label>⬆ Kaldırma Platformu</Label><Desc>Makas kaldırma mekanizması. Dikey hareket.</Desc></RowText>
        </Row>
        <Row>
          <RowText><Label>🚦 Işık Kulesi (Signal Tower)</Label><Desc>Kırmızı/Sarı/Yeşil renk durumu. Hareketsiz.</Desc></RowText>
        </Row>
      </Section>

      <Section>
        <SectionTitle>Sensörler</SectionTitle>
        <Row>
          <RowText><Label>Limit Switch</Label><Desc>Mekanik temas sensörü. Blok bounding box&apos;ı trigger alanıyla kesişince değişkeni TRUE yapar.</Desc></RowText>
        </Row>
        <Row>
          <RowText><Label>Fotoelektrik</Label><Desc>Mesafe/ışın bazlı sensör. Aynı AABB çarpışma mantığı.</Desc></RowText>
        </Row>
        <Row>
          <RowText><Label>Proximity</Label><Desc>Yakınlık sensörü. Aynı AABB çarpışma mantığı.</Desc></RowText>
        </Row>
      </Section>

      <Section>
        <SectionTitle>Nasıl Kullanılır?</SectionTitle>
        <StepList>
          <li>Üst sekmelerden <strong>Gerçek Hayat</strong>&apos;a geç.</li>
          <li>Sol paletten makine veya sensör bloğunu kanvasa sürükle-bırak.</li>
          <li>Bloka <strong>çift tıkla</strong> → özellikler diyalogu açılır:<br />
            hız (px/s), hareket sınırları, ileri/geri değişkenleri ayarlanır.
          </li>
          <li>Sensöre <strong>çift tıkla</strong> → trigger boyutunu ve tetiklenecek değişkeni seç.</li>
          <li>Simülasyonu başlat → bloklar ladder değişkenlerine göre animasyonlu hareket eder.</li>
          <li>Blok sensör trigger alanına girince bağlı değişken otomatik TRUE olur.</li>
        </StepList>
        <TipBox>
          Animasyon, scan cycle&apos;dan (<strong>66 ms</strong>) bağımsız olarak <strong>60 fps</strong>&apos;te
          çalışır (requestAnimationFrame). Simülasyon durdurulunca bloklar son
          konumunda dondurulur ve sensör değerleri sıfırlanır.
        </TipBox>
      </Section>
    </>
  );
}

function TabHakkinda() {
  return (
    <>
      <Section>
        <SectionTitle>Sürüm Bilgisi</SectionTitle>
        <Desc>
          <strong>001-3panel-industrial-sim</strong>
          <VersionBadge>fork</VersionBadge>
        </Desc>
        <StepList>
          <li>Kumanda Paneli — basmalı buton, toggle, lamba, acil stop</li>
          <li>Güç Devresi — BFS topoloji doğrulaması, SVG kablo çizimi</li>
          <li>Gerçek Hayat Sahnesi — 6 blok tipi, 3 sensör tipi, 60fps animasyon</li>
          <li>Export/Import — 3 yeni panel kalıcı olarak kaydedilir</li>
          <li>Sayfalı yardım (bu ekran)</li>
        </StepList>
      </Section>

      <Section>
        <SectionTitle>Önceki Fork Değişiklikleri</SectionTitle>
        <StepList>
          <li>TON timer çift-çalışma hatası düzeltmesi</li>
          <li>NOT / AND / OR / NAND / NOR mantık kapıları</li>
          <li>JSON dışa/içe aktarma</li>
          <li>CSS tasarım tokenları, dark mode desteği</li>
          <li>Türkçe arayüz</li>
        </StepList>
      </Section>

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <CreditCard>
          <CreditName>CodingPLC</CreditName>
          <CreditSub>Orijinal geliştirici</CreditSub>
          <CreditSub style={{ marginTop: '0.3rem' }}>
            <a href="https://github.com/codingplc/plc-simulator" target="_blank" rel="noopener noreferrer">
              github.com/codingplc/plc-simulator
            </a>
          </CreditSub>
          <CreditSub>GPL v3 · plcsimulator.online</CreditSub>
        </CreditCard>

        <CreditCard>
          <CreditName>Selçuk DİNÇ</CreditName>
          <CreditSub>Fork — 3 panel + Türkçe arayüz + mantık kapıları</CreditSub>
          <CreditSub style={{ marginTop: '0.3rem' }}>
            <a href="https://github.com/selcukdinc/plc-simulator" target="_blank" rel="noopener noreferrer">
              github.com/selcukdinc/plc-simulator
            </a>
          </CreditSub>
          <CreditSub>devloop.com.tr/plc-sim</CreditSub>
        </CreditCard>
      </Box>
    </>
  );
}

/* ── Ana bileşen ────────────────────────────────────────── */
const HELP_TABS = [
  { label: 'Genel', component: TabGenel },
  { label: 'Ladder', component: TabLadder },
  { label: 'Kumanda', component: TabKumanda },
  { label: 'Güç Devresi', component: TabGucDevresi },
  { label: 'Sahne', component: TabSahne },
  { label: 'Hakkında', component: TabHakkinda },
];

const Help: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const ActiveTabContent = HELP_TABS[activeTab].component;

  return (
    <>
      <SvgButton onClick={() => setOpen(true)} Svg={StyledHelpSvg} title="Yardım" />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { height: '80vh' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 0 }}>
          <span>PLC Simülatörü — Kullanım Kılavuzu</span>
          <IconButton size="small" onClick={() => setOpen(false)}>
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, minHeight: 40 }}
          TabIndicatorProps={{ style: { height: 2 } }}
        >
          {HELP_TABS.map((t, i) => (
            <Tab key={i} label={t.label} sx={{ minHeight: 40, fontSize: '0.78rem', py: 0.5 }} />
          ))}
        </Tabs>

        <DialogContent dividers sx={{ fontSize: '0.875rem', overflowY: 'auto' }}>
          <ActiveTabContent />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Help;
