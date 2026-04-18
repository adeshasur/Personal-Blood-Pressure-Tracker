import { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, Activity, Heart, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { pressureService } from '../services/api.js';

// ── Status helpers ──────────────────────────────────────────────────────────
const getStatus = (sys, dia) => {
  if (sys >= 180 || dia >= 120) return { label: 'Crisis',   color: '#ef4444' };
  if (sys >= 140 || dia >= 90)  return { label: 'High',     color: '#f97316' };
  if (sys >= 130)               return { label: 'Elevated', color: '#f59e0b' };
  return                               { label: 'Normal',   color: '#6b7280' };
};

const SLOT_TIME = { Morning: '08:30', Afternoon: '14:00', Evening: '20:30' };
const DAILY_SLOTS = ['Morning', 'Afternoon', 'Evening'];

const formatDate = (dateStr) =>
  new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

const rowBg = {
  Normal:   null,
  Elevated: 'bg-amber-500/5 border-amber-500/10',
  High:     'bg-orange-500/5 border-orange-500/10',
  Crisis:   'bg-red-500/8 border-red-500/10',
};

const badgeStyle = {
  Normal:   'bg-white/10 text-slate-400',
  Elevated: 'bg-amber-500/20 text-amber-400',
  High:     'bg-orange-500/20 text-orange-400',
  Crisis:   'bg-red-500/20 text-red-400',
};

// ── PDF generation ──────────────────────────────────────────────────────────
const generatePDF = (history, summary) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // ── Cover / header
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('BLOOD PRESSURE REPORT', 14, 22);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}`, 14, 30);
  doc.text(`Period: ${formatDate(history[history.length - 1]?.date)} — ${formatDate(history[0]?.date)}`, 14, 36);

  // ── Summary boxes
  const boxes = [
    { label: 'AVG SYSTOLIC',  value: summary.avgSys,  unit: 'mmHg' },
    { label: 'AVG DIASTOLIC', value: summary.avgDia,  unit: 'mmHg' },
    { label: 'AVG PULSE',     value: summary.avgPulse, unit: 'bpm' },
    { label: 'TOTAL READINGS', value: summary.count,  unit: 'entries' },
  ];

  boxes.forEach((b, i) => {
    const x = 14 + i * 47;
    doc.setFillColor(15, 15, 15);
    doc.rect(x, 44, 43, 20, 'F');
    doc.setDrawColor(40, 40, 40);
    doc.rect(x, 44, 43, 20, 'S');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(b.label, x + 3, 50);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(String(b.value), x + 3, 59);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 90, 105);
    doc.text(b.unit, x + 3 + String(b.value).length * 3.5, 59);
  });

  // ── Legend
  doc.setFontSize(7);
  doc.setTextColor(80, 90, 100);
  doc.text('COLOUR KEY:', 14, 72);
  const legend = [
    { label: 'Normal   sys <130, dia <90',  color: [80, 90, 100] },
    { label: 'Elevated  sys 130-139',        color: [245, 158, 11] },
    { label: 'High      sys ≥140 or dia ≥90', color: [249, 115, 22] },
    { label: 'Crisis    sys ≥180 or dia ≥120', color: [239, 68, 68] },
  ];
  legend.forEach((l, i) => {
    doc.setFillColor(...l.color);
    doc.rect(14 + i * 50, 74, 3, 3, 'F');
    doc.setTextColor(...l.color);
    doc.text(l.label, 19 + i * 50, 77);
  });

  // ── Table rows: one row per date+slot (including missing)
  const tableRows = [];
  history.forEach(({ date, readings }) => {
    const byCategory = {};
    readings.forEach(r => (byCategory[r.category] = r));
    DAILY_SLOTS.forEach(slot => {
      const r = byCategory[slot];
      if (r) {
        const s = getStatus(r.systolic, r.diastolic);
        tableRows.push({
          date:     formatDate(date),
          slot,
          time:     SLOT_TIME[slot],
          sys:      String(r.systolic),
          dia:      String(r.diastolic),
          pulse:    String(r.pulse),
          status:   s.label,
          color:    s.color,
        });
      } else {
        tableRows.push({
          date:   formatDate(date),
          slot,
          time:   SLOT_TIME[slot],
          sys:    '—',
          dia:    '—',
          pulse:  '—',
          status: 'No Record',
          color:  '#374151',
        });
      }
    });
  });

  autoTable(doc, {
    startY: 82,
    head: [['Date', 'Slot', 'Time', 'Systolic', 'Diastolic', 'Pulse', 'Status']],
    body: tableRows.map(r => [r.date, r.slot, r.time, r.sys, r.dia, r.pulse, r.status]),
    styles: {
      fillColor: [10, 10, 10],
      textColor: [200, 200, 200],
      fontSize: 8,
      cellPadding: 3,
      lineColor: [30, 30, 30],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [20, 20, 20],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7,
    },
    alternateRowStyles: { fillColor: [14, 14, 14] },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 6) {
        const row = tableRows[data.row.index];
        if (row) data.cell.styles.textColor = hexToRgb(row.color);
      }
    },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 22 },
      2: { cellWidth: 16 },
      3: { cellWidth: 20 },
      4: { cellWidth: 22 },
      5: { cellWidth: 16 },
      6: { cellWidth: 24 },
    },
    margin: { left: 14, right: 14 },
  });

  // ── Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(40, 40, 40);
    doc.text('Personal Blood Pressure Tracker — Confidential Health Record', 14, 290);
    doc.text(`Page ${i} of ${pageCount}`, 196, 290, { align: 'right' });
  }

  doc.save(`BP_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

// ── ReportPage ───────────────────────────────────────────────────────────────
export const ReportPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    pressureService.getHistory()
      .then(res => setHistory(res.data))
      .catch(err => {
        console.error(err);
        setError('Failed to load readings.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Compute summary stats from all real readings
  const allReadings = history.flatMap(d => d.readings);
  const count = allReadings.length;
  const avgSys  = count ? Math.round(allReadings.reduce((s, r) => s + r.systolic,  0) / count) : 0;
  const avgDia  = count ? Math.round(allReadings.reduce((s, r) => s + r.diastolic, 0) / count) : 0;
  const avgPulse= count ? Math.round(allReadings.reduce((s, r) => s + r.pulse,     0) / count) : 0;
  const summary = { avgSys, avgDia, avgPulse, count };

  return (
    <div className="pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-8">

        {/* Page header */}
        <header className="mb-20 animate-modern-fade">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/10 text-slate-500 text-[9px] font-black uppercase tracking-[0.4em] mb-8">
            Clinical Report Engine
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                BP REPORT
              </h1>
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mt-4">
                Full log history · color-coded · exportable PDF
              </p>
            </div>
            <button
              onClick={() => !loading && count > 0 && generatePDF(history, summary)}
              disabled={loading || count === 0}
              className="btn-primary flex items-center gap-3 !px-8 !py-4 !text-[11px] disabled:opacity-30"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </header>

        {/* Summary stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 animate-modern-fade">
          {[
            { label: 'Avg Systolic',   value: avgSys,   unit: 'mmHg', Icon: Activity },
            { label: 'Avg Diastolic',  value: avgDia,   unit: 'mmHg', Icon: TrendingUp },
            { label: 'Avg Pulse',      value: avgPulse,  unit: 'bpm',  Icon: Heart },
            { label: 'Total Readings', value: count,    unit: 'entries', Icon: FileText },
          ].map(({ label, value, unit, Icon }) => (
            <div key={label} className="modern-card flex items-center gap-5">
              <div className="p-3 border border-white/10 text-white">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">{label}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white">{loading ? '—' : value}</span>
                  <span className="text-[9px] font-black text-slate-700 uppercase">{unit}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Color legend */}
        <div className="flex flex-wrap gap-6 mb-10 animate-modern-fade">
          {[
            { status: 'Normal',   style: 'bg-white/10 text-slate-400',     desc: 'Sys < 130, Dia < 90' },
            { status: 'Elevated', style: 'bg-amber-500/20 text-amber-400',  desc: 'Sys 130–139' },
            { status: 'High',     style: 'bg-orange-500/20 text-orange-400',desc: 'Sys ≥ 140 or Dia ≥ 90' },
            { status: 'Crisis',   style: 'bg-red-500/20 text-red-400',      desc: 'Sys ≥ 180 or Dia ≥ 120' },
          ].map(l => (
            <div key={l.status} className="flex items-center gap-2">
              <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 ${l.style}`}>
                {l.status}
              </span>
              <span className="text-[9px] text-slate-600 font-bold">{l.desc}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 bg-white/5 text-slate-600">
              No Record
            </span>
            <span className="text-[9px] text-slate-600 font-bold">Missing slot</span>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="modern-card !p-0 overflow-hidden animate-pulse">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-12 border-b border-white/5 bg-white/[0.02]" />
            ))}
          </div>
        ) : error ? (
          <div className="modern-card text-center py-12 border-l-2 border-l-red-500/50">
            <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-3" />
            <p className="text-red-400 font-black uppercase tracking-widest text-sm">{error}</p>
          </div>
        ) : (
          <div className="modern-card !p-0 overflow-hidden animate-modern-fade">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_110px_80px_110px_110px_90px_110px] gap-0 px-5 py-3 bg-white/[0.04] border-b border-white/10">
              {['Date', 'Slot', 'Time', 'Systolic', 'Diastolic', 'Pulse', 'Status'].map(h => (
                <span key={h} className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{h}</span>
              ))}
            </div>

            {/* Table rows */}
            {history.map(({ date, readings }) => {
              const byCategory = {};
              readings.forEach(r => (byCategory[r.category] = r));
              return DAILY_SLOTS.map(slot => {
                const r = byCategory[slot];
                if (r) {
                  const { label } = getStatus(r.systolic, r.diastolic);
                  return (
                    <div
                      key={`${date}-${slot}`}
                      className={`grid grid-cols-[1fr_110px_80px_110px_110px_90px_110px] gap-0 px-5 py-3.5 border-b border-white/5 last:border-0 transition-colors ${rowBg[label] || ''}`}
                    >
                      <span className="text-[11px] font-black text-white tracking-tight">{formatDate(date)}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{slot}</span>
                      <span className="text-[10px] font-bold text-slate-600">{SLOT_TIME[slot]}</span>
                      <span className="text-[11px] font-black text-white">{r.systolic} <span className="text-slate-700 text-[9px]">mmHg</span></span>
                      <span className="text-[11px] font-black text-white">{r.diastolic} <span className="text-slate-700 text-[9px]">mmHg</span></span>
                      <span className="text-[11px] font-black text-white">{r.pulse} <span className="text-slate-700 text-[9px]">bpm</span></span>
                      <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 self-center inline-block ${badgeStyle[label]}`}>{label}</span>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={`${date}-${slot}-empty`}
                      className="grid grid-cols-[1fr_110px_80px_110px_110px_90px_110px] gap-0 px-5 py-3.5 border-b border-white/5 last:border-0 opacity-30"
                    >
                      <span className="text-[11px] font-black text-slate-500 tracking-tight">{formatDate(date)}</span>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{slot}</span>
                      <span className="text-[10px] font-bold text-slate-700">{SLOT_TIME[slot]}</span>
                      <span className="text-[10px] text-slate-700">—</span>
                      <span className="text-[10px] text-slate-700">—</span>
                      <span className="text-[10px] text-slate-700">—</span>
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 self-center inline-block bg-white/5 text-slate-600">
                        No Record
                      </span>
                    </div>
                  );
                }
              });
            })}
          </div>
        )}

        {/* Download CTA (bottom) */}
        {!loading && count > 0 && (
          <div className="mt-12 text-center animate-modern-fade">
            <button
              onClick={() => generatePDF(history, summary)}
              className="btn-primary inline-flex items-center gap-3 !px-12 !py-5 !text-[11px]"
            >
              <Download className="w-5 h-5" />
              Export Full Report as PDF
            </button>
            <p className="text-slate-700 text-[9px] font-bold uppercase tracking-widest mt-3">
              {count} readings · {history.length} days · A4 format
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
