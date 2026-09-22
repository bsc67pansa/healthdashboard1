import React from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Filter, 
  RefreshCw, 
  UserCheck, 
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface HeaderProps {
  updatedAt: string;
  isLive: boolean;
  isLoading: boolean;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  showFilters: boolean;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  onResetView: () => void;
  onRefreshData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  updatedAt,
  isLive,
  isLoading,
  hasActiveFilters,
  activeFilterCount,
  showFilters,
  onToggleFilters,
  onClearFilters,
  onResetView,
  onRefreshData,
}) => {
  return (
    <header className="relative w-full rounded-2xl bg-white/80 backdrop-blur-md border border-pink-200/70 shadow-sm shadow-pink-100/50 p-5 md:p-6 mb-6 overflow-hidden">
      {/* Decorative top gradient accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-sky-400 to-pink-300" />

      {/* Floating subtle sparkles in header background */}
      <div className="absolute top-3 right-8 text-pink-300 pointer-events-none animate-sparkle">
        <Sparkles className="w-5 h-5 opacity-70" />
      </div>
      <div className="absolute bottom-3 right-1/3 text-sky-300 pointer-events-none animate-sparkle-delayed">
        <Sparkles className="w-4 h-4 opacity-60" />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        {/* Left: Branding & Titles */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Sparkle icon badge */}
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-400 to-sky-400 text-white shadow-md shadow-pink-200">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600 bg-clip-text text-transparent">
                  คัดกรองข้อมูลสุขภาพ
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-100/80 text-pink-700 border border-pink-200">
                  ✨ NCDs Screening
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            ระบบวิเคราะห์และติดตามผลการคัดกรองสุขภาพเชิงรุก โรคเบาหวานและความดันโลหิตสูง 
            จำแนกตามพฤติกรรม สถิติความเสี่ยง และพิกัดพื้นที่ชุมชน
          </p>

          {/* Meta bar: Creator, Updated time, and Sheet ID */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs text-slate-600">
            {/* Creator name */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-50 text-pink-800 border border-pink-200/80 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-pink-600" />
              <span>ผู้จัดทำ:</span>
              <strong className="text-pink-900 font-semibold">พรรษา บอนขุนทด</strong>
            </div>

            {/* Updated date/time */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200/80">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>วันที่/เวลาอัปเดต:</span>
              <span className="font-medium text-slate-700">{updatedAt}</span>
            </div>

            {/* Live sync status badge */}
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              {isLive ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>เชื่อมโยงข้อมูลสด</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                  <span>ข้อมูลแคชล่าสุด</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Navigation Controls (ข้อ 5) */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          {/* 1. ปุ่มย้อนกลับ (Reset View / Overview) */}
          <button
            type="button"
            id="btn-nav-reset-view"
            onClick={onResetView}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:border-pink-300 transition-all active:scale-95"
            title="ย้อนกลับสู่มุมมองภาพรวมและด้านบนสุด"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>ย้อนกลับ / ค่าเริ่มต้น</span>
          </button>

          {/* 2. ปุ่มตัวกรองข้อมูล (Filter Toggle) */}
          <button
            type="button"
            id="btn-nav-toggle-filter"
            onClick={onToggleFilters}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95 ${
              showFilters
                ? 'bg-gradient-to-r from-pink-500 to-sky-500 text-white shadow-pink-200'
                : 'bg-white hover:bg-pink-50 text-slate-700 border border-pink-200'
            }`}
          >
            <Filter className={`w-4 h-4 ${showFilters ? 'text-white' : 'text-pink-600'}`} />
            <span>ตัวกรองข้อมูล</span>
            {activeFilterCount > 0 && (
              <span className={`inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-xs font-bold ${
                showFilters ? 'bg-white text-pink-600' : 'bg-pink-600 text-white'
              }`}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* 3. ปุ่มล้างการกรอง (Clear Filters) */}
          {hasActiveFilters && (
            <button
              type="button"
              id="btn-nav-clear-filter"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 shadow-sm transition-all active:scale-95"
            >
              <span>ล้างการกรอง</span>
            </button>
          )}

          {/* Sync / Refresh Button */}
          <button
            type="button"
            id="btn-refresh-sheet"
            onClick={onRefreshData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition-all active:scale-95 disabled:opacity-50"
            title="รีเฟรชข้อมูลจาก Google Sheet"
          >
            <RefreshCw className={`w-4 h-4 text-sky-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">รีเฟรช</span>
          </button>
        </div>
      </div>
    </header>
  );
};
