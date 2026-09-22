import React from 'react';
import { FilterState } from '../types';
import { Search, X, Check, Users, MapPin, Activity, HeartCrack, Sparkles } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClearFilters: () => void;
  totalRecords: number;
  filteredRecords: number;
  isOpen: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  totalRecords,
  filteredRecords,
  isOpen,
}) => {
  if (!isOpen) return null;

  const areas = ['ทั้งหมด', 'เมือง', 'เหนือ', 'ใต้', 'ตะวันออก', 'ตะวันตก'];
  const ageGroups = [
    { label: 'ทุกช่วงอายุ', value: 'all' },
    { label: 'วัยรุ่น-เริ่มทำงาน (< 35)', value: '<35' },
    { label: 'วัยทำงาน (35-49)', value: '35-49' },
    { label: 'วัยผู้ใหญ่ (50-59)', value: '50-59' },
    { label: 'ผู้สูงอายุ (60+)', value: '60+' },
  ];
  const genders = [
    { label: 'ทุกเพศ', value: 'all' },
    { label: 'หญิง 👩', value: 'หญิง' },
    { label: 'ชาย 👨', value: 'ชาย' },
  ];
  const riskLevels = [
    { label: 'ทุกระดับ', value: 'all', dot: 'bg-slate-400' },
    { label: 'เสี่ยงต่ำ', value: 'ต่ำ', dot: 'bg-emerald-500' },
    { label: 'เสี่ยงปานกลาง', value: 'ปานกลาง', dot: 'bg-amber-500' },
    { label: 'เสี่ยงสูง', value: 'สูง', dot: 'bg-rose-500' },
  ];

  return (
    <section 
      id="filter-control-panel"
      className="mb-6 rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/80 p-5 shadow-sm shadow-pink-100/40 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 mb-4 border-b border-pink-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-pink-100 text-pink-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-800">
            ระบบตัวกรองข้อมูลสุขภาพ (Filters)
          </h2>
          <span className="text-xs text-slate-500">
            (เลือกเพื่อวิเคราะห์ข้อมูลแบบจำเพาะเจาะจง)
          </span>
        </div>

        {/* Counter of results & Clear button */}
        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 font-medium">
            พบ <strong className="text-sky-900 font-bold">{filteredRecords}</strong> จาก {totalRecords} คน
          </span>

          <button
            type="button"
            id="btn-filter-clear-all"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1 text-xs text-pink-600 hover:text-pink-800 hover:bg-pink-50 px-2.5 py-1 rounded-lg border border-pink-200 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>ล้างค่าทั้งหมด</span>
          </button>
        </div>
      </div>

      {/* Grid of primary filters requested: เพศ, อายุ, พื้นที่ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. เพศ (Gender Filter) */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Users className="w-3.5 h-3.5 text-pink-600" />
            <span>1. เพศ (Gender)</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {genders.map(g => {
              const active = filters.gender === g.value;
              return (
                <button
                  key={g.value}
                  type="button"
                  id={`filter-gender-${g.value}`}
                  onClick={() => onFilterChange('gender', g.value as FilterState['gender'])}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm shadow-pink-200 scale-102'
                      : 'bg-slate-100 hover:bg-pink-50 text-slate-700 border border-slate-200/80 hover:border-pink-200'
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. อายุ (Age Filter) */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Activity className="w-3.5 h-3.5 text-sky-600" />
            <span>2. อายุ (Age Group)</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ageGroups.map(ag => {
              const active = filters.ageGroup === ag.value;
              return (
                <button
                  key={ag.value}
                  type="button"
                  id={`filter-age-${ag.value}`}
                  onClick={() => onFilterChange('ageGroup', ag.value as FilterState['ageGroup'])}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-sm shadow-sky-200 scale-102'
                      : 'bg-slate-100 hover:bg-sky-50 text-slate-700 border border-slate-200/80 hover:border-sky-200'
                  }`}
                >
                  {ag.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. พื้นที่ (Area Filter) */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            <span>3. พื้นที่ (Area)</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {areas.map(a => {
              const val = a === 'ทั้งหมด' ? 'all' : a;
              const active = filters.area === val;
              return (
                <button
                  key={a}
                  type="button"
                  id={`filter-area-${val}`}
                  onClick={() => onFilterChange('area', val)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm shadow-purple-200 scale-102'
                      : 'bg-slate-100 hover:bg-purple-50 text-slate-700 border border-slate-200/80 hover:border-purple-200'
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Secondary Row: ระดับความเสี่ยง & ช่องค้นหา */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4 pt-4 border-t border-slate-100">
        {/* ระดับความเสี่ยง */}
        <div className="space-y-2 md:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <HeartCrack className="w-3.5 h-3.5 text-rose-500" />
            <span>ระดับความเสี่ยงโดยรวม (Risk Level)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {riskLevels.map(rl => {
              const active = filters.riskLevel === rl.value;
              return (
                <button
                  key={rl.value}
                  type="button"
                  id={`filter-risk-${rl.value}`}
                  onClick={() => onFilterChange('riskLevel', rl.value as FilterState['riskLevel'])}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/80'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${rl.dot}`} />
                  <span>{rl.label}</span>
                  {active && <Check className="w-3 h-3 text-pink-300 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            ค้นหาข้อมูล (ID / คำสำคัญ)
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="filter-search-input"
              value={filters.searchQuery}
              onChange={e => onFilterChange('searchQuery', e.target.value)}
              placeholder="ค้นหารหัส เช่น H0005, เมือง..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange('searchQuery', '')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
