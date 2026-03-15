import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Divider,
  Box,
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

/* ── Küçük buton önizlemesi ─────────────────────────────── */
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

/* ── Satır düzeni ───────────────────────────────────────── */
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
  color: #666;
  font-size: 0.82rem;
`;

/* ── Bölüm başlığı ──────────────────────────────────────── */
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

/* ── Kredi kartları ─────────────────────────────────────── */
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
  color: #888;
  font-size: 0.78rem;
`;

/* ── İkon yardımcı ──────────────────────────────────────── */
function BtnIcon({ Svg }: { Svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }) {
  return (
    <BtnChip>
      <Svg style={{ width: '60%', height: '60%', filter: 'brightness(0) opacity(0.6)' }} />
    </BtnChip>
  );
}

/* ── Bileşen ────────────────────────────────────────────── */
const Help: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SvgButton onClick={() => setOpen(true)} Svg={StyledHelpSvg} title="Yardım" />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <span>PLC Ladder Logic Simülatörü — Kullanım Kılavuzu</span>
          <IconButton size="small" onClick={() => setOpen(false)}>
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ fontSize: '0.875rem' }}>

          {/* Araç Çubuğu */}
          <Section>
            <SectionTitle>Araç Çubuğu (Üst Menü)</SectionTitle>

            <Row>
              <BtnIcon Svg={UndoSvg} />
              <RowText>
                <Label>Geri Al</Label>
                <Desc>Son işlemi geri alır.</Desc>
              </RowText>
            </Row>

            <Row>
              <BtnIcon Svg={RedoSvg} />
              <RowText>
                <Label>İleri Al</Label>
                <Desc>Geri alınan işlemi yeniden uygular.</Desc>
              </RowText>
            </Row>

            <Row>
              <BtnIcon Svg={FileTextSvg} />
              <RowText>
                <Label>Örnek Proje</Label>
                <Desc>Hazır bir ladder diyagramı yükler (mevcut proje silinir).</Desc>
              </RowText>
            </Row>

            <Row>
              <BtnIcon Svg={FileEmptySvg} />
              <RowText>
                <Label>Boş Proje</Label>
                <Desc>Tüm diyagramı temizler, sıfırdan başlar.</Desc>
              </RowText>
            </Row>

            <Row>
              <BtnIcon Svg={FileDownloadSvg} />
              <RowText>
                <Label>Dışa Aktar</Label>
                <Desc>
                  Mevcut ladder diyagramını <strong>.json</strong> dosyası olarak bilgisayarınıza indirir.
                  İndirilen dosyayı paylaşabilir veya yedek olarak saklayabilirsiniz.
                </Desc>
              </RowText>
            </Row>

            <Row>
              <BtnIcon Svg={FileUploadSvg} />
              <RowText>
                <Label>İçe Aktar</Label>
                <Desc>
                  Daha önce dışa aktarılan <strong>.json</strong> dosyasını seçerek projeyi geri yükler.
                  Mevcut diyagram yerine geçer.
                </Desc>
              </RowText>
            </Row>

            <Row>
              <BtnIcon Svg={HelpSvg} />
              <RowText>
                <Label>Yardım</Label>
                <Desc>Bu pencereyi açar.</Desc>
              </RowText>
            </Row>
          </Section>

          {/* Araç Kutusu */}
          <Section>
            <SectionTitle>Araç Kutusu (Sol Panel)</SectionTitle>

            <Row>
              <BtnIcon Svg={ContactSvg} />
              <RowText>
                <Label>Kontak (NO Contact)</Label>
                <Desc>XIC (Normalde Açık), XIO (Normalde Kapalı), OSP (Yükselen Kenar), OSN (Düşen Kenar) — Properties&apos;den değiştirilebilir.</Desc>
              </RowText>
            </Row>

            <Row>
              <BtnIcon Svg={CoilSvg} />
              <RowText>
                <Label>Bobin (Coil)</Label>
                <Desc>OTE (Normal), OTL (Set/Latch), OTU (Reset/Unlatch), OTN (Negatif) — Properties&apos;den değiştirilebilir.</Desc>
              </RowText>
            </Row>

            <Row>
              <BtnIcon Svg={TimerSvg} />
              <RowText>
                <Label>Zamanlayıcı (Timer TON)</Label>
                <Desc>TON (On Delay), TOF (Off Delay), TONR (Retentive) — Properties&apos;den değiştirilebilir.</Desc>
              </RowText>
            </Row>

            <Row>
              <BtnIcon Svg={CounterSvg} />
              <RowText>
                <Label>Sayaç (Counter CTU)</Label>
                <Desc>CTU (Yukarı), CTD (Aşağı), CTUD (Her İki Yön) — Properties&apos;den değiştirilebilir.</Desc>
              </RowText>
            </Row>

            <Row>
              <BtnIcon Svg={MathSvg} />
              <RowText>
                <Label>Matematik (Math)</Label>
                <Desc>ADD, SUB, MUL, DIV — iki girişi işleyip çıkışa yazar.</Desc>
              </RowText>
            </Row>

            <Row>
              <BtnIcon Svg={CompareSvg} />
              <RowText>
                <Label>Karşılaştırma (Comparator)</Label>
                <Desc>EQU, NEQ, GRT, GEQ, LES, LEQ — iki değeri karşılaştırır, koşul sağlanırsa RLO geçer.</Desc>
              </RowText>
            </Row>

            <Row>
              <BtnIcon Svg={GateSvg} />
              <RowText>
                <Label>NOT Kapısı</Label>
                <Desc>Gelen sinyali tersler, değişken gerektirmez.</Desc>
              </RowText>
            </Row>

            <Row>
              <BtnIcon Svg={GateSvg} />
              <RowText>
                <Label>Mantık Kapısı (Logic Gate)</Label>
                <Desc>AND, OR, NAND, NOR — Properties&apos;den kapı tipi seçilir.</Desc>
              </RowText>
            </Row>

            <Row>
              <BtnIcon Svg={MoveSvg} />
              <RowText>
                <Label>Kopyala (Move)</Label>
                <Desc>Bir değişkenin değerini başka bir değişkene kopyalar.</Desc>
              </RowText>
            </Row>

            <Row>
              <BtnIcon Svg={BranchSvg} />
              <RowText>
                <Label>Dal (Branch)</Label>
                <Desc>Rung&apos;a paralel dal ekler — OR mantığı oluşturur.</Desc>
              </RowText>
            </Row>

            <Row>
              <BtnIcon Svg={RungSvg} />
              <RowText>
                <Label>Rung Ekle (Add Rung)</Label>
                <Desc>Diyagrama yeni bir ladder satırı ekler.</Desc>
              </RowText>
            </Row>
          </Section>

          {/* Simülasyon */}
          <Section>
            <SectionTitle>Simülasyon</SectionTitle>
            <Row>
              <BtnIcon Svg={SimStartSvg} />
              <RowText>
                <Label>Simülasyon Başlat / Durdur</Label>
                <Desc>
                  Sağ alt köşedeki butona basarak döngüyü başlatın.
                  Ladder diyagramı 66 ms&apos;de bir soldan sağa taranır, değişken değerleri anlık güncellenir.
                </Desc>
              </RowText>
            </Row>
          </Section>

          <Divider sx={{ my: 1.5 }} />

          {/* Credits */}
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
              <CreditSub>Fork — Türkçe arayüz, export/import, mantık kapıları</CreditSub>
              <CreditSub style={{ marginTop: '0.3rem' }}>
                <a href="https://github.com/selcukdinc/plc-simulator" target="_blank" rel="noopener noreferrer">
                  github.com/selcukdinc/plc-simulator
                </a>
              </CreditSub>
              <CreditSub>devloop.com.tr/plc-sim</CreditSub>
            </CreditCard>
          </Box>

        </DialogContent>
      </Dialog>
    </>
  );
};

export default Help;
