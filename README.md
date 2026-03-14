# PLC Simulator Online

Web tabanlı PLC ladder logic simülatörü. Ladder diyagram çizin, simülasyonu gerçek zamanlı çalıştırın.

> **Upstream:** [codingplc/plc-simulator](https://github.com/codingplc/plc-simulator) (GPL v3)
> **Bu fork:** [selcukdinc/plc-simulator](https://github.com/selcukdinc/plc-simulator) — [devloop.com.tr/plc-sim](https://devloop.com.tr/plc-sim)

## Özellikler

- Ladder Diagram editörü (sürükle & bırak)
- Gerçek zamanlı PLC simülasyonu (66ms cycle)
- JSON export / import (yerel kayıt)
- **Dark mode** (Menü sağ üst köşeden toggle)
- **Profesyonel UI** — Tooltip'ler, gruplandırılmış toolbar, simülasyon animasyonu
- Desteklenen element tipleri: XIC, XIO, OSP, OSN, OTE, OTL, OTU, OTN, TON, TOF, TONR, CTU, CTD, CTUD, ADD, SUB, MUL, DIV, EQU, NEQ, GRT, GEQ, LES, LEQ, MOV

## Kurulum

```bash
git clone https://github.com/selcukdinc/plc-simulator.git
cd plc-simulator
yarn install
yarn start        # localhost:3000
```

## Geliştirme

```bash
yarn start        # Dev sunucusu
yarn build        # Production build → build/
```

## Deploy

`selcuk-dev` branch'ine `[deploy]` içeren bir commit mesajıyla push etmek GitHub Actions'ı tetikler ve `devloop.com.tr/plc-sim`'e deploy eder.

## Fork'a Özgü Değişiklikler

| Özellik | Açıklama |
|---------|----------|
| **Dark mode** | CSS custom properties tabanlı tema sistemi; menü butonuyla toggle |
| **Profesyonel UI (v1.8)** | Tooltip'ler, gruplandırılmış toolbar, tasarım token'ları (radius/shadow/transition) |
| **Simülasyon animasyonu** | Çalışan simülasyonda SimulateButton pulse animasyonu, enerji taşıyan ray glow efekti |
| **Dark mode bug fix** | ActionButton/SimulateButton hardcoded renkleri CSS var'a çevrildi |
| **JSON Export/Import** | Diyagramı yerel dosyaya kaydetme/yükleme |
| **TON timer bug fix** | `executedTimers` Set ile double-execution düzeltildi |
| **Firebase sessiz hata** | Firebase config yoksa konsol uyarısı yok, sessizce devre dışı |
| **subpath deploy** | `homepage: /plc-sim`, shareUuid yolu düzeltildi |
| **GitHub Actions** | Otomatik deploy workflow |

## Lisans

[GNU GPL v3.0](LICENSE) — kaynak kodu açık kalmak zorunda.

---

*Upstream proje: [app.plcsimulator.online](https://app.plcsimulator.online) · [CodingPLC](https://www.codingplc.com/)*
