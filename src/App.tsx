import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HealthRecord, FilterState } from './types';
import { INITIAL_HEALTH_RECORDS } from './data/defaultData';
import { fetchHealthRecords, formatThaiDateTime } from './services/sheetService';
import { filterRecords, calculateKpis } from './utils/analytics';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { KpiCards } from './components/KpiCards';
import { Visualizations } from './components/Visualizations';
import { DetailTable } from './components/DetailTable';
import { SparkleBackground } from './components/SparkleBackground';
import { Sparkles, HeartHandshake } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  gender: 'all',
  area: 'all',
  ageGroup: 'all',
  riskLevel: 'all',
  diabetesRisk: 'all',
  hypertensionRisk: 'all',
  smoking: 'all',
  alcohol: 'all',
  exercise: 'all',
  searchQuery: '',
};

export default function App() {
  const [records, setRecords] = useState<HealthRecord[]>(INITIAL_HEALTH_RECORDS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [updatedAt, setUpdatedAt] = useState<string>(() => formatThaiDateTime(new Date()));
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Sync data on initial mount
  const loadData = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchHealthRecords();
    setRecords(result.records);
    setIsLive(result.isLive);
    setUpdatedAt(result.updatedAt);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle individual filter change
  const handleFilterChange = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  // Reset view to top and restore default filters
  const handleResetView = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setShowFilters(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filtered records calculation
  const filteredRecords = useMemo(() => {
    return filterRecords(records, filters);
  }, [records, filters]);

  // Overall KPI calculation
  const kpi = useMemo(() => {
    return calculateKpis(filteredRecords);
  }, [filteredRecords]);

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.gender !== 'all') count++;
    if (filters.area !== 'all') count++;
    if (filters.ageGroup !== 'all') count++;
    if (filters.riskLevel !== 'all') count++;
    if (filters.diabetesRisk !== 'all') count++;
    if (filters.hypertensionRisk !== 'all') count++;
    if (filters.smoking !== 'all') count++;
    if (filters.alcohol !== 'all') count++;
    if (filters.exercise !== 'all') count++;
    if (filters.searchQuery.trim() !== '') count++;
    return count;
  }, [filters]);

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="relative min-h-screen font-['Prompt',sans-serif] text-slate-800 antialiased selection:bg-pink-300 selection:text-pink-900">
      {/* Visual background sparkles & gradient orbs */}
      <SparkleBackground />

      <main className="relative max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 1. Header & Navigation Controls */}
        <Header
          updatedAt={updatedAt}
          isLive={isLive}
          isLoading={isLoading}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(prev => !prev)}
          onClearFilters={handleClearFilters}
          onResetView={handleResetView}
          onRefreshData={loadData}
        />

        {/* 1.1 Filter Bar (Gender, Age, Area, Risk, Search) */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          totalRecords={records.length}
          filteredRecords={filteredRecords.length}
          isOpen={showFilters}
        />

        {/* 2. Health Overview (KPI Cards / Summary Cards) */}
        <KpiCards kpi={kpi} />

        {/* 3. Visualizations / Charts */}
        <Visualizations records={filteredRecords} />

        {/* 4. Data Table / Detail View */}
        <DetailTable records={filteredRecords} />

        {/* Footer info */}
        <footer className="mt-12 py-6 border-t border-pink-200/60 text-center text-xs text-slate-500 space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 text-slate-700 font-semibold">
            <HeartHandshake className="w-4 h-4 text-pink-500" />
            <span>ระบบคัดกรองข้อมูลสุขภาพ (Health Screening Dashboard)</span>
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          </div>
          <p>
            พัฒนาและจัดทำโดย: <strong className="text-pink-800 font-bold">พรรษา บอนขุนทด</strong>
          </p>
          <p className="text-[11px] text-slate-400">
            ระบบจัดเก็บและวิเคราะห์ความเสี่ยงโรคเบาหวานและความดันโลหิตสูง สำหรับหน่วยงานสาธารณสุขและชุมชน
          </p>
        </footer>
      </main>
    </div>
  );
}
