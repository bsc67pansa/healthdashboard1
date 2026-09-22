import React, { useState } from 'react';
import { HealthRecord } from '../types';
import {
  getRiskByGender,
  getRiskByArea,
  getHealthTrendByMonth,
  getBehaviorRiskAnalysis,
  getRiskByAgeGroup,
  getCorrelationData,
} from '../utils/analytics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
} from 'recharts';
import {
  ShieldAlert,
  TrendingUp,
  Activity,
  HeartPulse,
  Scale,
  Sparkles,
  MapPin,
  Users,
  Compass,
} from 'lucide-react';

interface VisualizationsProps {
  records: HealthRecord[];
}

export const Visualizations: React.FC<VisualizationsProps> = ({ records }) => {
  const [activeTab, setActiveTab] = useState<'risk' | 'trend' | 'behavior' | 'correlation'>('risk');

  // Prepared data
  const riskByGenderData = getRiskByGender(records);
  const riskByAreaData = getRiskByArea(records);
  const healthTrendData = getHealthTrendByMonth(records);
  const behaviorRiskData = getBehaviorRiskAnalysis(records);
  const riskByAgeData = getRiskByAgeGroup(records);
  const correlationData = getCorrelationData(records);

  // Color constants - Modern pastel pink, sky blue, amber, emerald, and coral
  const COLORS = {
    low: '#10b981', // Emerald for Low risk
    medium: '#f59e0b', // Amber for Medium risk
    high: '#ef4444', // Red for High risk
    pink: '#ec4899',
    pinkLight: '#f472b6',
    sky: '#0284c7',
    skyLight: '#38bdf8',
    purple: '#8b5cf6',
  };

  // Pie distribution of risk levels
  const riskLevelCounts = [
    { name: 'เสี่ยงต่ำ 🟢', value: records.filter(r => r.riskLevel === 'ต่ำ').length, color: COLORS.low },
    { name: 'เสี่ยงปานกลาง 🟡', value: records.filter(r => r.riskLevel === 'ปานกลาง').length, color: COLORS.medium },
    { name: 'เสี่ยงสูง 🔴', value: records.filter(r => r.riskLevel === 'สูง').length, color: COLORS.high },
  ];

  return (
    <section className="mb-8 space-y-4">
      {/* Visualizations Header & Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-sky-100 text-sky-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              ส่วนการวิเคราะห์ด้วยภาพ (Visualizations & Charts)
            </h2>
            <p className="text-xs text-slate-500">
              วิเคราะห์ความเสี่ยงสุขภาพ, แนวโน้มโรค, พฤติกรรม และความสัมพันธ์ของดัชนีชีววัด
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/90 backdrop-blur-md border border-pink-200/80 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('risk')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'risk'
                ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-pink-50/60'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>1. Health Risk (เพศ/พื้นที่/กลุ่มอายุ)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('trend')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'trend'
                ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>2. Health Trend (เบาหวาน/ความดัน)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('behavior')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'behavior'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-purple-50/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>3. Health Behavior (พฤติกรรมเสี่ยง)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('correlation')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'correlation'
                ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>4. Correlations (BMI & น้ำตาล/ความดัน)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Health Risk */}
      {activeTab === 'risk' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Chart 1.1: Risk by Gender (Field: เพศ, ระดับความเสี่ยง) */}
            <div className="lg:col-span-5 rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/70 p-4 shadow-sm shadow-pink-100/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-pink-100 text-pink-700">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    ระดับความเสี่ยงจำแนกตามเพศ
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">หญิง vs ชาย</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                แสดงจำนวนบุคคลในแต่ละระดับความเสี่ยง (เสี่ยงต่ำ, ปานกลาง, สูง)
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskByGenderData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="gender" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #fbcfe8',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(244,114,182,0.15)',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="เสี่ยงต่ำ" fill={COLORS.low} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="เสี่ยงปานกลาง" fill={COLORS.medium} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="เสี่ยงสูง" fill={COLORS.high} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 1.2: Risk by Area (Field: พื้นที่, คะแนนความเสี่ยง, ระดับความเสี่ยง) */}
            <div className="lg:col-span-7 rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/70 p-4 shadow-sm shadow-pink-100/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-purple-100 text-purple-700">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    พื้นที่ที่มีผู้เสี่ยงสูง & คะแนนความเสี่ยงเฉลี่ย
                  </h3>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                  พื้นที่เสี่ยงสูงสุด: ใต้ & ตะวันออก
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                วิเคราะห์ระดับความเสี่ยงและคะแนนความเสี่ยงเฉลี่ยตามพื้นที่ (เมือง, เหนือ, ใต้, ตะวันออก, ตะวันตก)
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskByAreaData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="shortArea" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 10]} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar yAxisId="left" dataKey="เสี่ยงสูง" name="จำนวนคนเสี่ยงสูง 🔴" fill={COLORS.high} radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="left" dataKey="เสี่ยงปานกลาง" name="จำนวนคนเสี่ยงปานกลาง 🟡" fill={COLORS.medium} radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="คะแนนความเสี่ยงเฉลี่ย" name="คะแนนเฉลี่ย (เต็ม 10)" fill={COLORS.purple} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 2: กลุ่มอายุที่มีความเสี่ยงสูง & สัดส่วนภาพรวม */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Chart 1.3: กลุ่มอายุที่มีความเสี่ยงสูง (High Risk by Age Group) */}
            <div className="lg:col-span-8 rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/70 p-4 shadow-sm shadow-pink-100/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-rose-100 text-rose-700">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    กลุ่มอายุที่มีความเสี่ยงสูง (High Risk by Age Cohort)
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500">
                  กลุ่ม 50-59 ปี และ 60+ ปี มีความชุกความเสี่ยงสูงที่สุด
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                สัดส่วนผู้รับการตรวจที่ตกอยู่ในกลุ่มเสี่ยงสูง (High Risk Level) ในแต่ละช่วงวัย
              </p>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskByAgeData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" unit="%" tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <YAxis dataKey="shortKey" type="category" tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'ร้อยละเสี่ยงสูง']}
                      labelFormatter={(label) => {
                        const itm = riskByAgeData.find(d => d.shortKey === label);
                        return itm ? itm.groupLabel : label;
                      }}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #fecdd3',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="ร้อยละเสี่ยงสูง" name="ร้อยละเสี่ยงสูง (%)" fill="#f43f5e" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 1.4: สัดส่วนระดับความเสี่ยงโดยรวม (Donut) */}
            <div className="lg:col-span-4 rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/70 p-4 shadow-sm shadow-pink-100/30 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                  สัดส่วนระดับความเสี่ยงโดยรวม
                </h3>
                <p className="text-[11px] text-slate-500">
                  ร้อยละของผู้ผ่านการคัดกรองทั้งหมด
                </p>
              </div>

              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskLevelCounts}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {riskLevelCounts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${val} คน`, 'จำนวน']}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        fontSize: '11px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100 text-center text-[10px]">
                {riskLevelCounts.map(item => (
                  <div key={item.name} className="p-1 rounded bg-slate-50">
                    <span className="block font-bold text-slate-800">{item.value} คน</span>
                    <span className="text-slate-500 truncate block">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Health Trend */}
      {activeTab === 'trend' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Chart 2.1: Health Trend for Diabetes Screening (เบาหวาน_คัดกรอง) */}
            <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-sky-200/70 p-4 shadow-sm shadow-sky-100/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-sky-100 text-sky-700">
                    <HeartPulse className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    แนวโน้มการคัดกรองเบาหวานรายเดือน
                  </h3>
                </div>
                <span className="text-[11px] text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  Field: เบาหวาน_คัดกรอง
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                เปรียบเทียบจำนวนผู้มีแนวโน้ม/เสี่ยงเบาหวาน กับผู้ไม่มีความเสี่ยงในแต่ละเดือน
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={healthTrendData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="monthName" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #bae6fd',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="เสี่ยงเบาหวาน" name="มีแนวโน้ม/เสี่ยง ⚠️" fill={COLORS.sky} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="เบาหวานปกติ" name="ปกติ (ไม่มี) ✅" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2.2: Health Trend for Hypertension Screening (ความดันโลหิตสูง_คัดกรอง) */}
            <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-purple-200/70 p-4 shadow-sm shadow-purple-100/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-purple-100 text-purple-700">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    แนวโน้มการคัดกรองความดันโลหิตสูงรายเดือน
                  </h3>
                </div>
                <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Field: ความดันโลหิตสูง_คัดกรอง
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                เปรียบเทียบสัดส่วนและร้อยละผู้มีแนวโน้ม/เสี่ยงความดันโลหิตสูง
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={healthTrendData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="monthName" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #ddd6fe',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="เสี่ยงความดัน" name="มีแนวโน้ม/เสี่ยง ⚠️" fill={COLORS.purple} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="ความดันปกติ" name="ปกติ (ไม่มี) ✅" fill="#c4b5fd" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Line Chart: Percentage Rate of DM vs HT over time */}
          <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                เส้นแนวโน้มร้อยละผู้มีความเสี่ยง (%) เบาหวาน vs ความดันโลหิตสูง
              </h3>
              <span className="text-xs text-slate-500">มกราคม - มีนาคม 2569</span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthTrendData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="monthName" tick={{ fontSize: 12 }} />
                  <YAxis unit="%" tick={{ fontSize: 11 }} domain={[0, 70]} />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'ร้อยละความเสี่ยง']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line type="monotone" dataKey="ร้อยละเสี่ยงเบาหวาน" name="ร้อยละเสี่ยงเบาหวาน (%)" stroke={COLORS.sky} strokeWidth={2.5} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="ร้อยละเสี่ยงความดัน" name="ร้อยละเสี่ยงความดัน (%)" stroke={COLORS.purple} strokeWidth={2.5} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Health Behavior */}
      {activeTab === 'behavior' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Chart 3.1: พฤติกรรมกับระดับความเสี่ยง (Fields: สูบบุหรี่, ดื่มแอลกอฮอล์, การออกกำลังกาย, ความดันโลหิตสูง_คัดกรอง) */}
            <div className="lg:col-span-7 rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/70 p-4 shadow-sm shadow-pink-100/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-purple-100 text-purple-700">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    พฤติกรรมกับระดับความเสี่ยง (Behavior vs Risk Level)
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">สูบ / ดื่ม / ออกกำลังกาย</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                การกระจายระดับความเสี่ยง (ต่ำ, ปานกลาง, สูง) ในแต่ละกลุ่มพฤติกรรมสุขภาพ
              </p>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={behaviorRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="label" 
                      tick={{ fontSize: 10 }} 
                      interval={0} 
                      angle={-20} 
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #fbcfe8',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="เสี่ยงต่ำ" name="เสี่ยงต่ำ 🟢" fill={COLORS.low} stackId="a" />
                    <Bar dataKey="เสี่ยงปานกลาง" name="เสี่ยงปานกลาง 🟡" fill={COLORS.medium} stackId="a" />
                    <Bar dataKey="เสี่ยงสูง" name="เสี่ยงสูง 🔴" fill={COLORS.high} stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3.2: Behavior vs Hypertension Risk (ความดันโลหิตสูงตามพฤติกรรม) */}
            <div className="lg:col-span-5 rounded-2xl bg-white/90 backdrop-blur-md border border-purple-200/70 p-4 shadow-sm shadow-purple-100/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-rose-100 text-rose-700">
                    <HeartPulse className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    พฤติกรรมกับความเสี่ยงความดันโลหิตสูง
                  </h3>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                จำนวนผู้มีความเสี่ยงความดันโลหิตสูงในแต่ละกลุ่มพฤติกรรม
              </p>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={behaviorRiskData} layout="vertical" margin={{ top: 5, right: 20, left: 35, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="label" type="category" tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val: any) => [`${val} คน`, 'เสี่ยงความดันโลหิตสูง']}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #ddd6fe',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="เสี่ยงความดัน" name="เสี่ยงความดันสูง" fill={COLORS.purple} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Behavior Impact Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/70 text-xs">
              <div className="flex items-center gap-2 font-bold text-rose-800 mb-1">
                <span>🚬 สูบบุหรี่</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-200/80 text-rose-900">ตัวเร่งความดัน</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                ผู้ที่สูบบุหรี่มีคะแนนความเสี่ยงเฉลี่ยสูงกว่ากลุ่มไม่สูบอย่างมีนัยสำคัญ และสัมพันธ์กับค่าความดัน SBP สูงเกินเกณฑ์มาตรฐาน
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/70 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-800 mb-1">
                <span>🍷 ดื่มแอลกอฮอล์</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900">เพิ่มน้ำตาล/ไขมัน</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                กลุ่มผู้ดื่มแอลกอฮอล์มีอัตราความเสี่ยงเบาหวานและคะแนนความเสี่ยงสะสมสูง โดยเฉพาะเมื่อร่วมกับการไม่ออกกำลังกาย
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/70 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-800 mb-1">
                <span>🏃‍♂️ ออกกำลังกายสม่ำเสมอ</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-200/80 text-emerald-900">เกราะป้องกัน</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                กลุ่มที่ออกกำลังกายสม่ำเสมอร้อยละ 100 อยู่ในกลุ่มเสี่ยงต่ำ (Low Risk) และมีระดับน้ำตาล FBS อยู่ในเกณฑ์ปกติ
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Correlations & Vitals */}
      {activeTab === 'correlation' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Chart 4.1: ความสัมพันธ์ระหว่าง BMI กับน้ำตาล (Scatter Plot: BMI vs Sugar) */}
            <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/70 p-4 shadow-sm shadow-pink-100/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-pink-100 text-pink-700">
                    <Scale className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    ความสัมพันธ์ระหว่าง BMI กับระดับน้ำตาล (Blood Sugar)
                  </h3>
                </div>
                <span className="text-[11px] text-pink-700 font-semibold bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                  BMI vs น้ำตาล_mg_dL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                จุดตัดเกณฑ์มาตรฐาน: BMI ปกติ &lt; 23, น้ำตาลปกติ &lt; 100 mg/dL (สีแดง = เสี่ยงสูง)
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      type="number"
                      dataKey="bmi"
                      name="BMI"
                      unit=" kg/m²"
                      domain={[18, 35]}
                      tick={{ fontSize: 11 }}
                      label={{ value: 'ดัชนีมวลกาย BMI (kg/m²)', position: 'insideBottom', offset: -10, fontSize: 10 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="sugar"
                      name="น้ำตาล"
                      unit=" mg/dL"
                      domain={[70, 180]}
                      tick={{ fontSize: 11 }}
                      label={{ value: 'ระดับน้ำตาล FBS (mg/dL)', angle: -90, position: 'insideLeft', offset: 20, fontSize: 10 }}
                    />
                    <ZAxis range={[60, 60]} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ payload }) => {
                        if (!payload || payload.length === 0) return null;
                        const data = payload[0].payload;
                        return (
                          <div className="p-2.5 bg-white border border-pink-200 rounded-xl shadow-md text-xs">
                            <strong className="block text-slate-900 font-semibold mb-1">
                              {data.id} ({data.gender}, {data.age} ปี)
                            </strong>
                            <div className="text-slate-600 space-y-0.5">
                              <div>BMI: <span className="font-bold text-pink-700">{data.bmi}</span> kg/m²</div>
                              <div>น้ำตาล: <span className="font-bold text-sky-700">{data.sugar}</span> mg/dL</div>
                              <div>ระดับความเสี่ยง: <span className={`font-bold ${data.riskLevel === 'สูง' ? 'text-red-600' : data.riskLevel === 'ปานกลาง' ? 'text-amber-600' : 'text-emerald-600'}`}>{data.riskLevel}</span></div>
                              <div>พื้นที่: {data.area}</div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    {/* Reference Lines for Cutoffs */}
                    <ReferenceLine x={23} stroke="#f472b6" strokeDasharray="4 4" label={{ value: 'BMI 23', fill: '#ec4899', fontSize: 10 }} />
                    <ReferenceLine y={100} stroke="#38bdf8" strokeDasharray="4 4" label={{ value: 'FBS 100', fill: '#0284c7', fontSize: 10 }} />
                    <Scatter
                      data={correlationData}
                      fill="#ec4899"
                      shape={(props: unknown) => {
                        const { cx, cy, payload } = props as { cx: number; cy: number; payload: { riskLevel: string } };
                        const fill = payload.riskLevel === 'สูง' ? '#ef4444' : payload.riskLevel === 'ปานกลาง' ? '#f59e0b' : '#10b981';
                        return <circle cx={cx} cy={cy} r={6} fill={fill} stroke="#ffffff" strokeWidth={1.5} />;
                      }}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4.2: ความสัมพันธ์ระหว่าง BMI กับความดัน (Scatter Plot: BMI vs SBP) */}
            <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-purple-200/70 p-4 shadow-sm shadow-purple-100/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-purple-100 text-purple-700">
                    <HeartPulse className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    ความสัมพันธ์ระหว่าง BMI กับความดันตัวบน (SBP)
                  </h3>
                </div>
                <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  BMI vs SBP_mmHg
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                จุดตัดเกณฑ์มาตรฐาน: BMI ปกติ &lt; 23, ความดันตัวบนปกติ &lt; 140 mmHg
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      type="number"
                      dataKey="bmi"
                      name="BMI"
                      unit=" kg/m²"
                      domain={[18, 35]}
                      tick={{ fontSize: 11 }}
                      label={{ value: 'ดัชนีมวลกาย BMI (kg/m²)', position: 'insideBottom', offset: -10, fontSize: 10 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="sbp"
                      name="ความดันตัวบน SBP"
                      unit=" mmHg"
                      domain={[100, 180]}
                      tick={{ fontSize: 11 }}
                      label={{ value: 'ความดัน SBP (mmHg)', angle: -90, position: 'insideLeft', offset: 20, fontSize: 10 }}
                    />
                    <ZAxis range={[60, 60]} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ payload }) => {
                        if (!payload || payload.length === 0) return null;
                        const data = payload[0].payload;
                        return (
                          <div className="p-2.5 bg-white border border-purple-200 rounded-xl shadow-md text-xs">
                            <strong className="block text-slate-900 font-semibold mb-1">
                              {data.id} ({data.gender}, {data.age} ปี)
                            </strong>
                            <div className="text-slate-600 space-y-0.5">
                              <div>BMI: <span className="font-bold text-pink-700">{data.bmi}</span> kg/m²</div>
                              <div>ความดัน SBP/DBP: <span className="font-bold text-purple-700">{data.sbp}/{data.dbp}</span> mmHg</div>
                              <div>ชีพจร: {data.pulse} bpm</div>
                              <div>ระดับความเสี่ยง: <span className={`font-bold ${data.riskLevel === 'สูง' ? 'text-red-600' : data.riskLevel === 'ปานกลาง' ? 'text-amber-600' : 'text-emerald-600'}`}>{data.riskLevel}</span></div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    {/* Reference Lines for Cutoffs */}
                    <ReferenceLine x={23} stroke="#f472b6" strokeDasharray="4 4" label={{ value: 'BMI 23', fill: '#ec4899', fontSize: 10 }} />
                    <ReferenceLine y={140} stroke="#a855f7" strokeDasharray="4 4" label={{ value: 'SBP 140', fill: '#8b5cf6', fontSize: 10 }} />
                    <Scatter
                      data={correlationData}
                      fill="#8b5cf6"
                      shape={(props: unknown) => {
                        const { cx, cy, payload } = props as { cx: number; cy: number; payload: { riskLevel: string } };
                        const fill = payload.riskLevel === 'สูง' ? '#ef4444' : payload.riskLevel === 'ปานกลาง' ? '#f59e0b' : '#10b981';
                        return <circle cx={cx} cy={cy} r={6} fill={fill} stroke="#ffffff" strokeWidth={1.5} />;
                      }}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Vitals Summary Strip: Fields BMI, น้ำตาล_mg_dL, SBP_mmHg, DBP_mmHg, ชีพจร_bpm */}
          <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 p-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-sky-600" />
              <span>สรุปภาพรวม Field สัญญาณชีพและค่าวัดทางคลินิก (Vitals & Biomarkers)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-pink-50/70 border border-pink-200">
                <span className="text-slate-500 block text-[11px]">ดัชนีมวลกาย</span>
                <strong className="text-base font-extrabold text-pink-700">BMI</strong>
                <span className="block text-[10px] text-pink-800 mt-1">เฉลี่ย 26.3 kg/m²</span>
              </div>
              <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200">
                <span className="text-slate-500 block text-[11px]">น้ำตาลในเลือด</span>
                <strong className="text-base font-extrabold text-sky-700">น้ำตาล_mg_dL</strong>
                <span className="block text-[10px] text-sky-800 mt-1">เฉลี่ย 117.8 mg/dL</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200">
                <span className="text-slate-500 block text-[11px]">ความดันตัวบน</span>
                <strong className="text-base font-extrabold text-purple-700">SBP_mmHg</strong>
                <span className="block text-[10px] text-purple-800 mt-1">เฉลี่ย 134.4 mmHg</span>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200">
                <span className="text-slate-500 block text-[11px]">ความดันตัวล่าง</span>
                <strong className="text-base font-extrabold text-indigo-700">DBP_mmHg</strong>
                <span className="block text-[10px] text-indigo-800 mt-1">เฉลี่ย 83.9 mmHg</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 col-span-2 sm:col-span-1">
                <span className="text-slate-500 block text-[11px]">อัตราชีพจร</span>
                <strong className="text-base font-extrabold text-rose-700">ชีพจร_bpm</strong>
                <span className="block text-[10px] text-rose-800 mt-1">เฉลี่ย 81.9 bpm</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
