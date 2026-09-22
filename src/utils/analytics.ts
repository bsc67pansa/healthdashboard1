import { HealthRecord, OverallKpi, FilterState } from '../types';

export function filterRecords(records: HealthRecord[], filters: FilterState): HealthRecord[] {
  return records.filter(r => {
    // Gender filter
    if (filters.gender !== 'all' && r.gender !== filters.gender) return false;

    // Area filter
    if (filters.area !== 'all' && r.area !== filters.area) return false;

    // Age group filter
    if (filters.ageGroup !== 'all') {
      if (filters.ageGroup === '<35' && r.age >= 35) return false;
      if (filters.ageGroup === '35-49' && (r.age < 35 || r.age > 49)) return false;
      if (filters.ageGroup === '50-59' && (r.age < 50 || r.age > 59)) return false;
      if (filters.ageGroup === '60+' && r.age < 60) return false;
    }

    // Risk level filter
    if (filters.riskLevel !== 'all' && r.riskLevel !== filters.riskLevel) return false;

    // Diabetes risk filter
    if (filters.diabetesRisk !== 'all' && r.diabetesRisk !== filters.diabetesRisk) return false;

    // Hypertension risk filter
    if (filters.hypertensionRisk !== 'all' && r.hypertensionRisk !== filters.hypertensionRisk) return false;

    // Smoking filter
    if (filters.smoking !== 'all' && r.smoking !== filters.smoking) return false;

    // Alcohol filter
    if (filters.alcohol !== 'all' && r.alcohol !== filters.alcohol) return false;

    // Exercise filter
    if (filters.exercise !== 'all' && r.exercise !== filters.exercise) return false;

    // Search query
    if (filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      const match =
        r.id.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        r.gender.toLowerCase().includes(q) ||
        r.riskLevel.toLowerCase().includes(q) ||
        r.screeningDate.includes(q);
      if (!match) return false;
    }

    return true;
  });
}

export function calculateKpis(records: HealthRecord[]): OverallKpi {
  const count = records.length;
  if (count === 0) {
    return {
      totalCount: 0,
      avgBmi: 0,
      avgSugar: 0,
      avgSbp: 0,
      avgDbp: 0,
      avgPulse: 0,
      avgRiskScore: 0,
      minBmi: 0,
      minSugar: 0,
      minSbp: 0,
      minDbp: 0,
      minPulse: 0,
      maxBmi: 0,
      maxSugar: 0,
      maxSbp: 0,
      maxDbp: 0,
      maxPulse: 0,
      femaleCount: 0,
      maleCount: 0,
      genderRatioText: '0 : 0',
      highRiskCount: 0,
      highRiskPercent: 0,
      mediumRiskCount: 0,
      mediumRiskPercent: 0,
      lowRiskCount: 0,
      lowRiskPercent: 0,
      diabetesRiskCount: 0,
      diabetesRiskPercent: 0,
      hypertensionRiskCount: 0,
      hypertensionRiskPercent: 0,
      bothRiskCount: 0,
      bothRiskPercent: 0,
    };
  }

  const bmis = records.map(r => r.bmi);
  const sugars = records.map(r => r.sugar);
  const sbps = records.map(r => r.sbp);
  const dbps = records.map(r => r.dbp);
  const pulses = records.map(r => r.pulse);
  const riskScores = records.map(r => r.riskScore);

  const sum = (arr: number[]) => arr.reduce((acc, val) => acc + val, 0);
  const avg = (arr: number[]) => Number((sum(arr) / arr.length).toFixed(1));
  const min = (arr: number[]) => Math.min(...arr);
  const max = (arr: number[]) => Math.max(...arr);

  const femaleCount = records.filter(r => r.gender === 'หญิง').length;
  const maleCount = records.filter(r => r.gender === 'ชาย').length;
  const genderRatioText = `${femaleCount} : ${maleCount}`;

  const highRiskCount = records.filter(r => r.riskLevel === 'สูง').length;
  const mediumRiskCount = records.filter(r => r.riskLevel === 'ปานกลาง').length;
  const lowRiskCount = records.filter(r => r.riskLevel === 'ต่ำ').length;

  const diabetesRiskCount = records.filter(r => r.diabetesRisk === 'มีแนวโน้ม/เสี่ยง').length;
  const hypertensionRiskCount = records.filter(r => r.hypertensionRisk === 'มีแนวโน้ม/เสี่ยง').length;
  const bothRiskCount = records.filter(
    r => r.diabetesRisk === 'มีแนวโน้ม/เสี่ยง' && r.hypertensionRisk === 'มีแนวโน้ม/เสี่ยง'
  ).length;

  const toPct = (n: number) => Number(((n / count) * 100).toFixed(1));

  return {
    totalCount: count,
    avgBmi: avg(bmis),
    avgSugar: avg(sugars),
    avgSbp: avg(sbps),
    avgDbp: avg(dbps),
    avgPulse: avg(pulses),
    avgRiskScore: avg(riskScores),
    minBmi: min(bmis),
    minSugar: min(sugars),
    minSbp: min(sbps),
    minDbp: min(dbps),
    minPulse: min(pulses),
    maxBmi: max(bmis),
    maxSugar: max(sugars),
    maxSbp: max(sbps),
    maxDbp: max(max(dbps) ? dbps : [0]),
    maxPulse: max(pulses),
    femaleCount,
    maleCount,
    genderRatioText,
    highRiskCount,
    highRiskPercent: toPct(highRiskCount),
    mediumRiskCount,
    mediumRiskPercent: toPct(mediumRiskCount),
    lowRiskCount,
    lowRiskPercent: toPct(lowRiskCount),
    diabetesRiskCount,
    diabetesRiskPercent: toPct(diabetesRiskCount),
    hypertensionRiskCount,
    hypertensionRiskPercent: toPct(hypertensionRiskCount),
    bothRiskCount,
    bothRiskPercent: toPct(bothRiskCount),
  };
}

// 1. Health Risk by Gender and Area
export function getRiskByGender(records: HealthRecord[]) {
  const genders = ['หญิง', 'ชาย'] as const;
  return genders.map(gender => {
    const list = records.filter(r => r.gender === gender);
    const low = list.filter(r => r.riskLevel === 'ต่ำ').length;
    const med = list.filter(r => r.riskLevel === 'ปานกลาง').length;
    const high = list.filter(r => r.riskLevel === 'สูง').length;
    const total = list.length;
    const avgScore = total > 0 ? Number((list.reduce((s, r) => s + r.riskScore, 0) / total).toFixed(1)) : 0;
    return {
      gender: gender === 'หญิง' ? 'หญิง 👩' : 'ชาย 👨',
      rawGender: gender,
      เสี่ยงต่ำ: low,
      เสี่ยงปานกลาง: med,
      เสี่ยงสูง: high,
      รวม: total,
      คะแนนเฉลี่ย: avgScore,
    };
  });
}

export function getRiskByArea(records: HealthRecord[]) {
  const areas = ['เมือง', 'เหนือ', 'ใต้', 'ตะวันออก', 'ตะวันตก'];
  return areas.map(area => {
    const list = records.filter(r => r.area === area);
    const low = list.filter(r => r.riskLevel === 'ต่ำ').length;
    const med = list.filter(r => r.riskLevel === 'ปานกลาง').length;
    const high = list.filter(r => r.riskLevel === 'สูง').length;
    const total = list.length;
    const avgScore = total > 0 ? Number((list.reduce((s, r) => s + r.riskScore, 0) / total).toFixed(1)) : 0;
    const highRiskPct = total > 0 ? Number(((high / total) * 100).toFixed(1)) : 0;
    return {
      area: `พื้นที่${area}`,
      shortArea: area,
      เสี่ยงต่ำ: low,
      เสี่ยงปานกลาง: med,
      เสี่ยงสูง: high,
      รวม: total,
      คะแนนความเสี่ยงเฉลี่ย: avgScore,
      ร้อยละเสี่ยงสูง: highRiskPct,
    };
  });
}

// 2. Health Trend by Month (เบาหวาน vs ความดันโลหิตสูง)
export function getHealthTrendByMonth(records: HealthRecord[]) {
  // Sort distinct months
  const months = Array.from(new Set(records.map(r => r.month))).sort();
  const monthNameMap: Record<string, string> = {
    '2026-01': 'ม.ค. 2569',
    '2026-02': 'ก.พ. 2569',
    '2026-03': 'มี.ค. 2569',
  };

  return months.map(m => {
    const list = records.filter(r => r.month === m);
    const total = list.length;
    const dmRisk = list.filter(r => r.diabetesRisk === 'มีแนวโน้ม/เสี่ยง').length;
    const htRisk = list.filter(r => r.hypertensionRisk === 'มีแนวโน้ม/เสี่ยง').length;
    const dmNormal = list.filter(r => r.diabetesRisk === 'ไม่มี').length;
    const htNormal = list.filter(r => r.hypertensionRisk === 'ไม่มี').length;
    const highRisk = list.filter(r => r.riskLevel === 'สูง').length;

    return {
      monthKey: m,
      monthName: monthNameMap[m] || m,
      รวมตรวจ: total,
      เสี่ยงเบาหวาน: dmRisk,
      เสี่ยงความดัน: htRisk,
      เบาหวานปกติ: dmNormal,
      ความดันปกติ: htNormal,
      เสี่ยงสูงรวม: highRisk,
      ร้อยละเสี่ยงเบาหวาน: total > 0 ? Number(((dmRisk / total) * 100).toFixed(1)) : 0,
      ร้อยละเสี่ยงความดัน: total > 0 ? Number(((htRisk / total) * 100).toFixed(1)) : 0,
    };
  });
}

// 3. Health Behavior vs Risk Level
export function getBehaviorRiskAnalysis(records: HealthRecord[]) {
  // Smoking
  const smokers = records.filter(r => r.smoking === 'สูบ');
  const nonSmokers = records.filter(r => r.smoking === 'ไม่สูบ');

  // Alcohol
  const drinkers = records.filter(r => r.alcohol === 'ดื่ม');
  const nonDrinkers = records.filter(r => r.alcohol === 'ไม่ดื่ม');

  // Exercise
  const regularEx = records.filter(r => r.exercise === 'สม่ำเสมอ');
  const someEx = records.filter(r => r.exercise === 'บางครั้ง');
  const noEx = records.filter(r => r.exercise === 'ไม่ออกกำลังกาย');

  const calcGroup = (label: string, category: string, list: HealthRecord[], icon: string) => {
    const total = list.length;
    const high = list.filter(r => r.riskLevel === 'สูง').length;
    const med = list.filter(r => r.riskLevel === 'ปานกลาง').length;
    const low = list.filter(r => r.riskLevel === 'ต่ำ').length;
    const ht = list.filter(r => r.hypertensionRisk === 'มีแนวโน้ม/เสี่ยง').length;
    const avgScore = total > 0 ? Number((list.reduce((s, r) => s + r.riskScore, 0) / total).toFixed(1)) : 0;
    const highPct = total > 0 ? Number(((high / total) * 100).toFixed(1)) : 0;
    return {
      label,
      category,
      icon,
      รวม: total,
      เสี่ยงต่ำ: low,
      เสี่ยงปานกลาง: med,
      เสี่ยงสูง: high,
      เสี่ยงความดัน: ht,
      คะแนนเฉลี่ย: avgScore,
      ร้อยละเสี่ยงสูง: highPct,
    };
  };

  return [
    calcGroup('สูบบุหรี่', 'การสูบบุหรี่', smokers, '🚬'),
    calcGroup('ไม่สูบบุหรี่', 'การสูบบุหรี่', nonSmokers, '🚭'),
    calcGroup('ดื่มแอลกอฮอล์', 'การดื่มสุรา', drinkers, '🍷'),
    calcGroup('ไม่ดื่มแอลกอฮอล์', 'การดื่มสุรา', nonDrinkers, '🥛'),
    calcGroup('ออกกำลังสม่ำเสมอ', 'การออกกำลังกาย', regularEx, '🏃‍♂️'),
    calcGroup('ออกกำลังบางครั้ง', 'การออกกำลังกาย', someEx, '🚶‍♂️'),
    calcGroup('ไม่ออกกำลังกาย', 'การออกกำลังกาย', noEx, '🛋️'),
  ];
}

// 4. Age Groups vs High Risk
export function getRiskByAgeGroup(records: HealthRecord[]) {
  const groups = [
    { label: 'วัยรุ่น-เริ่มทำงาน (< 35 ปี)', key: '<35', check: (a: number) => a < 35 },
    { label: 'วัยทำงาน (35-49 ปี)', key: '35-49', check: (a: number) => a >= 35 && a <= 49 },
    { label: 'วัยผู้ใหญ่ (50-59 ปี)', key: '50-59', check: (a: number) => a >= 50 && a <= 59 },
    { label: 'ผู้สูงอายุ (60 ปีขึ้นไป)', key: '60+', check: (a: number) => a >= 60 },
  ];

  return groups.map(g => {
    const list = records.filter(r => g.check(r.age));
    const total = list.length;
    const high = list.filter(r => r.riskLevel === 'สูง').length;
    const med = list.filter(r => r.riskLevel === 'ปานกลาง').length;
    const low = list.filter(r => r.riskLevel === 'ต่ำ').length;
    const avgScore = total > 0 ? Number((list.reduce((s, r) => s + r.riskScore, 0) / total).toFixed(1)) : 0;
    const highPct = total > 0 ? Number(((high / total) * 100).toFixed(1)) : 0;

    return {
      groupLabel: g.label,
      shortKey: g.key,
      รวม: total,
      เสี่ยงต่ำ: low,
      เสี่ยงปานกลาง: med,
      เสี่ยงสูง: high,
      ร้อยละเสี่ยงสูง: highPct,
      คะแนนเฉลี่ย: avgScore,
    };
  });
}

// 5. Correlation points for BMI vs Sugar & BMI vs Blood Pressure
export function getCorrelationData(records: HealthRecord[]) {
  return records.map(r => ({
    id: r.id,
    bmi: r.bmi,
    sugar: r.sugar,
    sbp: r.sbp,
    dbp: r.dbp,
    pulse: r.pulse,
    age: r.age,
    gender: r.gender,
    area: r.area,
    riskScore: r.riskScore,
    riskLevel: r.riskLevel,
    diabetesRisk: r.diabetesRisk,
    hypertensionRisk: r.hypertensionRisk,
    exercise: r.exercise,
    smoking: r.smoking,
    alcohol: r.alcohol,
  }));
}
