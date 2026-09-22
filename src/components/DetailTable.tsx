import React, { useState, useMemo } from 'react';
import { HealthRecord } from '../types';
import { 
  Table, 
  ArrowUpDown, 
  Eye, 
  Download, 
  Sparkles, 
  Heart, 
  Droplet, 
  User, 
  Activity, 
  MapPin, 
  X,
  FileSpreadsheet
} from 'lucide-react';

interface DetailTableProps {
  records: HealthRecord[];
}

type SortField = 'id' | 'screeningDate' | 'age' | 'bmi' | 'sugar' | 'sbp' | 'pulse' | 'riskScore';
type SortOrder = 'asc' | 'desc';

export const DetailTable: React.FC<DetailTableProps> = ({ records }) => {
  const [sortField, setSortField] = useState<SortField>('riskScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Sorting
  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      valA = Number(valA);
      valB = Number(valB);

      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [records, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Export filtered table to CSV
  const handleExportCsv = () => {
    const headers = [
      'รหัสบุคคล',
      'วันที่คัดกรอง',
      'พื้นที่',
      'เพศ',
      'อายุ',
      'ส่วนสูง_cm',
      'น้ำหนัก_kg',
      'BMI',
      'SBP_mmHg',
      'DBP_mmHg',
      'ชีพจร_bpm',
      'น้ำตาล_mg_dL',
      'สูบบุหรี่',
      'ดื่มแอลกอฮอล์',
      'การออกกำลังกาย',
      'เบาหวาน_คัดกรอง',
      'ความดันโลหิตสูง_คัดกรอง',
      'คะแนนความเสี่ยง',
      'ระดับความเสี่ยง',
      'เดือน',
    ];

    const rows = sortedRecords.map(r => [
      r.id,
      r.screeningDate,
      r.area,
      r.gender,
      r.age,
      r.height,
      r.weight,
      r.bmi,
      r.sbp,
      r.dbp,
      r.pulse,
      r.sugar,
      r.smoking,
      r.alcohol,
      r.exercise,
      r.diabetesRisk,
      r.hypertensionRisk,
      r.riskScore,
      r.riskLevel,
      r.month,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `health_screening_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for risk badge styling according to user requirement:
  // สีแดงคือ เสี่ยงสูง 🔴, สีเหลืองคือ เสี่ยงปานกลาง 🟡, สีเขียวคือเสี่ยงต่ำ 🟢
  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'สูง':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>เสี่ยงสูง 🔴</span>
          </span>
        );
      case 'ปานกลาง':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>เสี่ยงปานกลาง 🟡</span>
          </span>
        );
      case 'ต่ำ':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>เสี่ยงต่ำ 🟢</span>
          </span>
        );
    }
  };

  return (
    <section id="detail-data-table-section" className="mb-8 space-y-4">
      {/* Table Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-pink-100 text-pink-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              ส่วนรายละเอียดเชิงลึก (Data Table / Detail View)
            </h2>
            <p className="text-xs text-slate-500">
              ตารางระดับความเสี่ยงที่จะเกิดโรคเบาหวานและความดันโลหิตสูง พร้อมข้อมูลสัญญาณชีพและพฤติกรรม
            </p>
          </div>
        </div>

        {/* Action button: Export CSV & Count */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-pink-600" />
            <span>ส่งออก CSV ({records.length} รายการ)</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-pink-200/80 shadow-sm shadow-pink-100/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-pink-50/80 via-white to-sky-50/80 border-b border-pink-100 text-slate-600">
                <th 
                  className="py-3 px-3.5 font-bold cursor-pointer hover:text-pink-600 transition-colors"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center gap-1">
                    <span>รหัสบุคคล</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th 
                  className="py-3 px-3 font-bold cursor-pointer hover:text-pink-600 transition-colors"
                  onClick={() => handleSort('age')}
                >
                  <div className="flex items-center gap-1">
                    <span>เพศ / อายุ</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-3 font-bold">พื้นที่</th>
                <th 
                  className="py-3 px-3 font-bold cursor-pointer hover:text-pink-600 transition-colors"
                  onClick={() => handleSort('bmi')}
                >
                  <div className="flex items-center gap-1">
                    <span>BMI (kg/m²)</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th 
                  className="py-3 px-3 font-bold cursor-pointer hover:text-pink-600 transition-colors"
                  onClick={() => handleSort('sugar')}
                >
                  <div className="flex items-center gap-1">
                    <span>น้ำตาล (mg/dL)</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th 
                  className="py-3 px-3 font-bold cursor-pointer hover:text-pink-600 transition-colors"
                  onClick={() => handleSort('sbp')}
                >
                  <div className="flex items-center gap-1">
                    <span>ความดัน SBP/DBP</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-3 font-bold">พฤติกรรม (สูบ/ดื่ม/ออกกำลัง)</th>
                <th className="py-3 px-3 font-bold">เบาหวาน_คัดกรอง 🩸</th>
                <th className="py-3 px-3 font-bold">ความดันโลหิตสูง_คัดกรอง 🫀</th>
                <th 
                  className="py-3 px-3 font-bold cursor-pointer hover:text-pink-600 transition-colors"
                  onClick={() => handleSort('riskScore')}
                >
                  <div className="flex items-center gap-1">
                    <span>คะแนน</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-3.5 font-bold text-center">ระดับความเสี่ยง</th>
                <th className="py-3 px-3 font-bold text-center">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-10 text-center text-slate-400">
                    ไม่พบข้อมูลที่ตรงกับเงื่อนไขตัวกรอง
                  </td>
                </tr>
              ) : (
                paginatedRecords.map(record => {
                  const isHigh = record.riskLevel === 'สูง';
                  const isMed = record.riskLevel === 'ปานกลาง';
                  return (
                    <tr
                      key={record.id}
                      className={`hover:bg-pink-50/40 transition-colors ${
                        isHigh ? 'bg-rose-50/20' : isMed ? 'bg-amber-50/10' : ''
                      }`}
                    >
                      {/* ID & Date */}
                      <td className="py-2.5 px-3.5 font-mono font-bold text-slate-800">
                        <div>{record.id}</div>
                        <div className="text-[10px] text-slate-400 font-sans">{record.screeningDate}</div>
                      </td>

                      {/* Gender & Age */}
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-800 flex items-center gap-1">
                          <span>{record.gender === 'หญิง' ? '👩' : '👨'}</span>
                          <span>{record.gender}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">{record.age} ปี</div>
                      </td>

                      {/* Area */}
                      <td className="py-2.5 px-3 font-medium text-slate-700">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{record.area}</span>
                        </span>
                      </td>

                      {/* BMI */}
                      <td className="py-2.5 px-3">
                        <span className={`font-semibold ${record.bmi >= 25 ? 'text-rose-600 font-bold' : record.bmi >= 23 ? 'text-amber-600' : 'text-slate-800'}`}>
                          {record.bmi}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {record.weight}kg / {record.height}cm
                        </div>
                      </td>

                      {/* Sugar */}
                      <td className="py-2.5 px-3">
                        <span className={`font-semibold ${record.sugar >= 126 ? 'text-rose-600 font-bold' : record.sugar >= 100 ? 'text-amber-600' : 'text-emerald-700'}`}>
                          {record.sugar}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">mg/dL</span>
                      </td>

                      {/* Blood Pressure */}
                      <td className="py-2.5 px-3">
                        <span className={`font-semibold ${record.sbp >= 140 ? 'text-rose-600 font-bold' : record.sbp >= 130 ? 'text-amber-600' : 'text-slate-800'}`}>
                          {record.sbp}/{record.dbp}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{record.pulse} bpm</span>
                      </td>

                      {/* Behaviors */}
                      <td className="py-2.5 px-3 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <span title={`สูบบุหรี่: ${record.smoking}`}>{record.smoking === 'สูบ' ? '🚬' : '🚭'}</span>
                          <span title={`ดื่มแอลกอฮอล์: ${record.alcohol}`}>{record.alcohol === 'ดื่ม' ? '🍷' : '🥛'}</span>
                          <span title={`การออกกำลังกาย: ${record.exercise}`}>
                            {record.exercise === 'สม่ำเสมอ' ? '🏃‍♂️' : record.exercise === 'บางครั้ง' ? '🚶‍♂️' : '🛋️'}
                          </span>
                        </div>
                      </td>

                      {/* Diabetes Risk Screening */}
                      <td className="py-2.5 px-3">
                        {record.diabetesRisk === 'มีแนวโน้ม/เสี่ยง' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            ⚠️ เสี่ยง
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✅ ปกติ
                          </span>
                        )}
                      </td>

                      {/* Hypertension Risk Screening */}
                      <td className="py-2.5 px-3">
                        {record.hypertensionRisk === 'มีแนวโน้ม/เสี่ยง' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            ⚠️ เสี่ยง
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✅ ปกติ
                          </span>
                        )}
                      </td>

                      {/* Risk Score */}
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 text-center">
                        <span className={`inline-block w-6 h-6 leading-6 rounded-full ${
                          record.riskScore >= 4 ? 'bg-rose-100 text-rose-700 font-extrabold' : record.riskScore >= 2 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {record.riskScore}
                        </span>
                      </td>

                      {/* Risk Level Badge (Required colors: สีแดง=เสี่ยงสูง, สีเหลือง=เสี่ยงปานกลาง, สีเขียว=เสี่ยงต่ำ) */}
                      <td className="py-2.5 px-3.5 text-center">
                        {getRiskBadge(record.riskLevel)}
                      </td>

                      {/* View Detail button */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedRecord(record)}
                          className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                          title="ดูการประเมินรายบุคคล"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-600">
          <div>
            แสดง {sortedRecords.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} ถึง {Math.min(currentPage * pageSize, sortedRecords.length)} จาก {sortedRecords.length} รายการ
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              ก่อนหน้า
            </button>
            <span className="px-2 py-1 font-semibold text-slate-800">
              หน้า {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      {/* Individual Clinical Assessment Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-pink-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-pink-400 to-sky-400 text-white">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    บัตรคัดกรองสุขภาพ: {selectedRecord.id}
                  </h3>
                  <p className="text-xs text-slate-500">
                    วันที่คัดกรอง: {selectedRecord.screeningDate} • พื้นที่{selectedRecord.area}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Risk Badge Summary */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-pink-50/50 border border-pink-200/80">
              <div>
                <span className="text-xs text-slate-500 block">ผลการประเมินความเสี่ยงโดยรวม</span>
                <span className="text-xs font-semibold text-slate-700">คะแนนความเสี่ยง: {selectedRecord.riskScore} / 10 คะแนน</span>
              </div>
              <div>{getRiskBadge(selectedRecord.riskLevel)}</div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">ดัชนีมวลกาย</span>
                <strong className="text-slate-800 text-sm">{selectedRecord.bmi}</strong> kg/m²
                <span className="block text-[10px] text-slate-500">{selectedRecord.weight} kg / {selectedRecord.height} cm</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">น้ำตาลในเลือด</span>
                <strong className="text-sky-700 text-sm">{selectedRecord.sugar}</strong> mg/dL
                <span className="block text-[10px] text-slate-500">FBS</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">ความดันโลหิต</span>
                <strong className="text-purple-700 text-sm">{selectedRecord.sbp}/{selectedRecord.dbp}</strong>
                <span className="block text-[10px] text-slate-500">mmHg</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">ชีพจร</span>
                <strong className="text-rose-700 text-sm">{selectedRecord.pulse}</strong> bpm
                <span className="block text-[10px] text-slate-500">อัตราเต้นหัวใจ</span>
              </div>
            </div>

            {/* Disease Screening Summary */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-sky-200 bg-sky-50/50">
                <div className="flex items-center gap-1.5 font-bold text-sky-800 mb-1">
                  <Droplet className="w-4 h-4 text-sky-600" />
                  <span>โรคเบาหวาน</span>
                </div>
                <div className="font-semibold text-slate-800">
                  {selectedRecord.diabetesRisk === 'มีแนวโน้ม/เสี่ยง' ? '⚠️ มีแนวโน้ม/เสี่ยง' : '✅ ปกติ (ไม่มีความเสี่ยง)'}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-purple-200 bg-purple-50/50">
                <div className="flex items-center gap-1.5 font-bold text-purple-800 mb-1">
                  <Heart className="w-4 h-4 text-purple-600" />
                  <span>ความดันโลหิตสูง</span>
                </div>
                <div className="font-semibold text-slate-800">
                  {selectedRecord.hypertensionRisk === 'มีแนวโน้ม/เสี่ยง' ? '⚠️ มีแนวโน้ม/เสี่ยง' : '✅ ปกติ (ไม่มีความเสี่ยง)'}
                </div>
              </div>
            </div>

            {/* Lifestyle Behaviors */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <h4 className="font-semibold text-slate-700 mb-2">พฤติกรรมสุขภาพในชีวิตประจำวัน:</h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">สูบบุหรี่</span>
                  <span className="font-bold text-slate-800">{selectedRecord.smoking === 'สูบ' ? '🚬 สูบประจำ' : '🚭 ไม่สูบ'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">ดื่มแอลกอฮอล์</span>
                  <span className="font-bold text-slate-800">{selectedRecord.alcohol === 'ดื่ม' ? '🍷 ดื่มเป็นประจำ' : '🥛 ไม่ดื่ม'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">การออกกำลังกาย</span>
                  <span className="font-bold text-slate-800">
                    {selectedRecord.exercise === 'สม่ำเสมอ' ? '🏃‍♂️ สม่ำเสมอ' : selectedRecord.exercise === 'บางครั้ง' ? '🚶‍♂️ บางครั้ง' : '🛋️ ไม่ออกกำลังกาย'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-pink-50 to-sky-50 border border-pink-200/80 text-xs">
              <span className="font-bold text-pink-900 block mb-1">💡 คำแนะนำการดูแลสุขภาพเฉพาะบุคคล:</span>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                {selectedRecord.riskLevel === 'สูง'
                  ? 'ควรส่งต่อพบแพทย์เพื่อตรวจคัดกรองยืนยันระดับน้ำตาลและวัดความดันซ้ำ 2 ครั้ง ปรับเปลี่ยนพฤติกรรมการบริโภค ลดหวาน มัน เค็ม และเริ่มโปรแกรมออกกำลังกายเบาๆ 150 นาที/สัปดาห์'
                  : selectedRecord.riskLevel === 'ปานกลาง'
                  ? 'แนะนำให้ตรวจติดตามผลทุก 6 เดือน ควบคุมน้ำหนักให้อยู่ในเกณฑ์มาตรฐาน BMI 18.5-22.9 และลดพฤติกรรมเสี่ยง'
                  : 'สุขภาพดีมาก แนะนำให้ออกกำลังกายสม่ำเสมอ รับประทานอาหารครบ 5 หมู่ และตรวจสุขภาพประจำปีอย่างต่อเนื่อง'}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
