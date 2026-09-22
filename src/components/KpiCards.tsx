import React, { useState } from 'react';
import { OverallKpi } from '../types';
import { 
  Users, 
  AlertTriangle, 
  Droplet, 
  Heart, 
  Scale, 
  Activity, 
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

interface KpiCardsProps {
  kpi: OverallKpi;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpi }) => {
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'sugar' | 'bp' | 'bmi' | 'risk'>('all');

  return (
    <section className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-pink-100 text-pink-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              การสรุปข้อมูลสำคัญ (Health Overview KPI)
            </h2>
            <p className="text-xs text-slate-500">
              สรุปข้อมูลจำนวน, ค่าเฉลี่ย, ค่าต่ำสุด-สูงสุด, สัดส่วน และร้อยละ
            </p>
          </div>
        </div>

        {/* Metric mode toggle pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/80 border border-pink-200/60 shadow-xs self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => setSelectedMetric('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedMetric === 'all'
                ? 'bg-gradient-to-r from-pink-500 to-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ภาพรวมหลัก
          </button>
          <button
            type="button"
            onClick={() => setSelectedMetric('sugar')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedMetric === 'sugar'
                ? 'bg-gradient-to-r from-pink-500 to-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🩸 น้ำตาล
          </button>
          <button
            type="button"
            onClick={() => setSelectedMetric('bp')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedMetric === 'bp'
                ? 'bg-gradient-to-r from-pink-500 to-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🫀 ความดัน
          </button>
          <button
            type="button"
            onClick={() => setSelectedMetric('bmi')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedMetric === 'bmi'
                ? 'bg-gradient-to-r from-pink-500 to-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚖️ BMI
          </button>
        </div>
      </div>

      {/* 6 Grid Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Card 1: จำนวน (Total Count) & สัดส่วน (Ratio) */}
        <div className="relative rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/70 p-4 shadow-sm shadow-pink-100/40 hover:shadow-md hover:border-pink-300 transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-pink-100/50 rounded-bl-full pointer-events-none -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">จำนวนที่คัดกรอง</span>
            <div className="p-1.5 rounded-lg bg-pink-100 text-pink-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-2xl font-extrabold text-slate-900">{kpi.totalCount}</span>
            <span className="text-xs text-slate-500">คน</span>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span className="text-slate-400">สัดส่วน หญิง:ชาย</span>
            <span className="font-semibold text-pink-700 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-100">
              {kpi.genderRatioText}
            </span>
          </div>
        </div>

        {/* Card 2: ร้อยละกลุ่มเสี่ยงสูง (High Risk % & Count) */}
        <div className="relative rounded-2xl bg-white/90 backdrop-blur-md border border-rose-200/80 p-4 shadow-sm shadow-rose-100/40 hover:shadow-md hover:border-rose-300 transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-rose-100/60 rounded-bl-full pointer-events-none -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-700">ร้อยละเสี่ยงสูง 🔴</span>
            <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-2xl font-extrabold text-rose-600">{kpi.highRiskPercent}%</span>
            <span className="text-xs text-slate-500">({kpi.highRiskCount} คน)</span>
          </div>
          <div className="pt-2 mt-2 border-t border-rose-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span className="text-slate-400">ปานกลาง {kpi.mediumRiskCount} คน</span>
            <span className="font-semibold text-emerald-700">ต่ำ {kpi.lowRiskCount} คน</span>
          </div>
        </div>

        {/* Card 3: ร้อยละเสี่ยงเบาหวาน (Diabetes Risk % & Blood Sugar) */}
        <div className="relative rounded-2xl bg-white/90 backdrop-blur-md border border-sky-200/80 p-4 shadow-sm shadow-sky-100/40 hover:shadow-md hover:border-sky-300 transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-sky-100/50 rounded-bl-full pointer-events-none -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-sky-800">เสี่ยงเบาหวาน 🩸</span>
            <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-2xl font-extrabold text-sky-700">{kpi.diabetesRiskPercent}%</span>
            <span className="text-xs text-slate-500">({kpi.diabetesRiskCount} คน)</span>
          </div>
          <div className="pt-2 mt-2 border-t border-sky-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span className="text-slate-400">น้ำตาลเฉลี่ย</span>
            <span className="font-semibold text-sky-900">{kpi.avgSugar} mg/dL</span>
          </div>
        </div>

        {/* Card 4: ร้อยละเสี่ยงความดันโลหิตสูง (Hypertension Risk % & SBP) */}
        <div className="relative rounded-2xl bg-white/90 backdrop-blur-md border border-purple-200/80 p-4 shadow-sm shadow-purple-100/40 hover:shadow-md hover:border-purple-300 transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100/50 rounded-bl-full pointer-events-none -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-purple-800">เสี่ยงความดันสูง 🫀</span>
            <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-2xl font-extrabold text-purple-700">{kpi.hypertensionRiskPercent}%</span>
            <span className="text-xs text-slate-500">({kpi.hypertensionRiskCount} คน)</span>
          </div>
          <div className="pt-2 mt-2 border-t border-purple-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span className="text-slate-400">SBP เฉลี่ย</span>
            <span className="font-semibold text-purple-900">{kpi.avgSbp} mmHg</span>
          </div>
        </div>

        {/* Card 5: ดัชนีมวลกาย BMI (ค่าเฉลี่ย, ต่ำสุด-สูงสุด) */}
        <div className="relative rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/80 p-4 shadow-sm shadow-pink-100/40 hover:shadow-md hover:border-pink-300 transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-pink-100/50 rounded-bl-full pointer-events-none -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700">BMI เฉลี่ย ⚖️</span>
            <div className="p-1.5 rounded-lg bg-pink-100 text-pink-700">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-2xl font-extrabold text-pink-600">{kpi.avgBmi}</span>
            <span className="text-xs text-slate-500">kg/m²</span>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span className="text-slate-400">ช่วงต่ำ-สูงสุด</span>
            <span className="font-semibold text-slate-700">{kpi.minBmi} - {kpi.maxBmi}</span>
          </div>
        </div>

        {/* Card 6: คะแนนความเสี่ยงเฉลี่ย (Risk Score Avg & Pulse) */}
        <div className="relative rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 p-4 shadow-sm shadow-slate-100/40 hover:shadow-md hover:border-slate-300 transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-slate-100 rounded-bl-full pointer-events-none -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700">คะแนนเสี่ยงเฉลี่ย 🎯</span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-2xl font-extrabold text-slate-800">{kpi.avgRiskScore}</span>
            <span className="text-xs text-slate-500">/ 10</span>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span className="text-slate-400">ชีพจรเฉลี่ย</span>
            <span className="font-semibold text-slate-700">{kpi.avgPulse} bpm</span>
          </div>
        </div>
      </div>

      {/* Expanded Clinical Summary Matrix: Showing explicitly จำนวน, ค่าเฉลี่ย, ค่าต่ำสุด, ค่าสูงสุด, สัดส่วน, ร้อยละ */}
      <div className="rounded-2xl bg-gradient-to-r from-pink-50/70 via-white/90 to-sky-50/70 backdrop-blur-md border border-pink-200/70 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-pink-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              ตารางสรุปตัวชี้วัดสุขภาพ: จำนวน • ค่าเฉลี่ย • ค่าต่ำสุด • ค่าสูงสุด • สัดส่วน • ร้อยละ
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
            อ้างอิงเกณฑ์มาตรฐานกรมควบคุมโรค
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-pink-100 text-slate-500">
                <th className="pb-2 font-semibold">ตัวชี้วัดสุขภาพ (Indicator)</th>
                <th className="pb-2 font-semibold text-center">จำนวน (Count)</th>
                <th className="pb-2 font-semibold text-center">ค่าเฉลี่ย (Mean)</th>
                <th className="pb-2 font-semibold text-center">ค่าต่ำสุด (Min)</th>
                <th className="pb-2 font-semibold text-center">ค่าสูงสุด (Max)</th>
                <th className="pb-2 font-semibold text-center">สัดส่วน / ร้อยละ (%)</th>
                <th className="pb-2 font-semibold text-right">เกณฑ์ประเมิน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-slate-700">
              {/* BMI */}
              <tr className="hover:bg-white/60 transition-colors">
                <td className="py-2.5 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-400" />
                  <span>ดัชนีมวลกาย (BMI)</span>
                </td>
                <td className="py-2.5 text-center">{kpi.totalCount} ราย</td>
                <td className="py-2.5 text-center font-bold text-pink-700">{kpi.avgBmi}</td>
                <td className="py-2.5 text-center text-slate-500">{kpi.minBmi}</td>
                <td className="py-2.5 text-center text-slate-500">{kpi.maxBmi}</td>
                <td className="py-2.5 text-center">
                  <span className="px-2 py-0.5 rounded bg-pink-100 text-pink-800 font-semibold">
                    เฉลี่ยเกินเกณฑ์ 22.9
                  </span>
                </td>
                <td className="py-2.5 text-right text-slate-500">ปกติ 18.5 - 22.9 kg/m²</td>
              </tr>

              {/* น้ำตาลในเลือด */}
              <tr className="hover:bg-white/60 transition-colors">
                <td className="py-2.5 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span>ระดับน้ำตาลในเลือด (FBS)</span>
                </td>
                <td className="py-2.5 text-center">{kpi.totalCount} ราย</td>
                <td className="py-2.5 text-center font-bold text-sky-700">{kpi.avgSugar} mg/dL</td>
                <td className="py-2.5 text-center text-slate-500">{kpi.minSugar} mg/dL</td>
                <td className="py-2.5 text-center text-slate-500">{kpi.maxSugar} mg/dL</td>
                <td className="py-2.5 text-center">
                  <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold">
                    เสี่ยง {kpi.diabetesRiskPercent}% ({kpi.diabetesRiskCount} คน)
                  </span>
                </td>
                <td className="py-2.5 text-right text-slate-500">เสี่ยงเมื่อ ≥ 100 mg/dL</td>
              </tr>

              {/* ความดัน Systolic SBP */}
              <tr className="hover:bg-white/60 transition-colors">
                <td className="py-2.5 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>ความดันตัวบน (SBP)</span>
                </td>
                <td className="py-2.5 text-center">{kpi.totalCount} ราย</td>
                <td className="py-2.5 text-center font-bold text-purple-700">{kpi.avgSbp} mmHg</td>
                <td className="py-2.5 text-center text-slate-500">{kpi.minSbp} mmHg</td>
                <td className="py-2.5 text-center text-slate-500">{kpi.maxSbp} mmHg</td>
                <td className="py-2.5 text-center">
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">
                    เสี่ยง {kpi.hypertensionRiskPercent}% ({kpi.hypertensionRiskCount} คน)
                  </span>
                </td>
                <td className="py-2.5 text-right text-slate-500">เสี่ยงเมื่อ ≥ 140 mmHg</td>
              </tr>

              {/* ความดัน Diastolic DBP */}
              <tr className="hover:bg-white/60 transition-colors">
                <td className="py-2.5 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>ความดันตัวล่าง (DBP)</span>
                </td>
                <td className="py-2.5 text-center">{kpi.totalCount} ราย</td>
                <td className="py-2.5 text-center font-bold text-indigo-700">{kpi.avgDbp} mmHg</td>
                <td className="py-2.5 text-center text-slate-500">{kpi.minDbp} mmHg</td>
                <td className="py-2.5 text-center text-slate-500">{kpi.maxDbp} mmHg</td>
                <td className="py-2.5 text-center">
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    เฉลี่ยปกติ
                  </span>
                </td>
                <td className="py-2.5 text-right text-slate-500">เสี่ยงเมื่อ ≥ 90 mmHg</td>
              </tr>

              {/* ชีพจร */}
              <tr className="hover:bg-white/60 transition-colors">
                <td className="py-2.5 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>อัตราชีพจร (Pulse)</span>
                </td>
                <td className="py-2.5 text-center">{kpi.totalCount} ราย</td>
                <td className="py-2.5 text-center font-bold text-rose-700">{kpi.avgPulse} bpm</td>
                <td className="py-2.5 text-center text-slate-500">{kpi.minPulse} bpm</td>
                <td className="py-2.5 text-center text-slate-500">{kpi.maxPulse} bpm</td>
                <td className="py-2.5 text-center text-slate-500">อยู่ในเกณฑ์ปกติ</td>
                <td className="py-2.5 text-right text-slate-500">ปกติ 60 - 100 bpm</td>
              </tr>

              {/* ทั้งเสี่ยงเบาหวาน + ความดัน (Comorbidity) */}
              <tr className="hover:bg-white/60 transition-colors bg-pink-50/40">
                <td className="py-2.5 font-semibold text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>เสี่ยงร่วมทั้ง 2 โรค (DM & HT)</span>
                </td>
                <td className="py-2.5 text-center font-bold text-rose-700">{kpi.bothRiskCount} คน</td>
                <td className="py-2.5 text-center text-slate-400">-</td>
                <td className="py-2.5 text-center text-slate-400">-</td>
                <td className="py-2.5 text-center text-slate-400">-</td>
                <td className="py-2.5 text-center font-bold text-rose-700">
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                    ร้อยละ {kpi.bothRiskPercent}%
                  </span>
                </td>
                <td className="py-2.5 text-right font-medium text-rose-700">กลุ่มเฝ้าระวังพิเศษ ⚠️</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
