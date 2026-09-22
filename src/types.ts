export type Gender = 'ชาย' | 'หญิง';
export type Area = 'เมือง' | 'เหนือ' | 'ใต้' | 'ตะวันออก' | 'ตะวันตก' | string;
export type RiskLevel = 'ต่ำ' | 'ปานกลาง' | 'สูง';
export type ScreeningStatus = 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง';
export type ExerciseStatus = 'สม่ำเสมอ' | 'บางครั้ง' | 'ไม่ออกกำลังกาย';
export type SmokingStatus = 'สูบ' | 'ไม่สูบ';
export type AlcoholStatus = 'ดื่ม' | 'ไม่ดื่ม';

export interface HealthRecord {
  id: string; // รหัสบุคคล เช่น H0001
  screeningDate: string; // วันที่คัดกรอง เช่น 3/1/2026
  area: Area; // พื้นที่
  gender: Gender; // เพศ
  age: number; // อายุ
  height: number; // ส่วนสูง cm
  weight: number; // น้ำหนัก kg
  bmi: number; // BMI
  sbp: number; // SBP_mmHg
  dbp: number; // DBP_mmHg
  pulse: number; // ชีพจร_bpm
  sugar: number; // น้ำตาล_mg_dL
  smoking: SmokingStatus; // สูบบุหรี่
  alcohol: AlcoholStatus; // ดื่มแอลกอฮอล์
  exercise: ExerciseStatus; // การออกกำลังกาย
  diabetesRisk: ScreeningStatus; // เบาหวาน_คัดกรอง
  hypertensionRisk: ScreeningStatus; // ความดันโลหิตสูง_คัดกรอง
  riskScore: number; // คะแนนความเสี่ยง
  riskLevel: RiskLevel; // ระดับความเสี่ยง
  month: string; // เดือน เช่น 2026-01
}

export interface FilterState {
  gender: 'all' | Gender;
  area: 'all' | string;
  ageGroup: 'all' | '<35' | '35-49' | '50-59' | '60+';
  riskLevel: 'all' | RiskLevel;
  diabetesRisk: 'all' | ScreeningStatus;
  hypertensionRisk: 'all' | ScreeningStatus;
  smoking: 'all' | SmokingStatus;
  alcohol: 'all' | AlcoholStatus;
  exercise: 'all' | ExerciseStatus;
  searchQuery: string;
}

export interface MetricSummary {
  count: number;
  avg: number;
  min: number;
  max: number;
}

export interface OverallKpi {
  totalCount: number;
  // ค่าเฉลี่ย
  avgBmi: number;
  avgSugar: number;
  avgSbp: number;
  avgDbp: number;
  avgPulse: number;
  avgRiskScore: number;
  // ค่าต่ำสุด
  minBmi: number;
  minSugar: number;
  minSbp: number;
  minDbp: number;
  minPulse: number;
  // ค่าสูงสุด
  maxBmi: number;
  maxSugar: number;
  maxSbp: number;
  maxDbp: number;
  maxPulse: number;
  // สัดส่วน
  femaleCount: number;
  maleCount: number;
  genderRatioText: string;
  // ร้อยละ
  highRiskCount: number;
  highRiskPercent: number;
  mediumRiskCount: number;
  mediumRiskPercent: number;
  lowRiskCount: number;
  lowRiskPercent: number;
  diabetesRiskCount: number;
  diabetesRiskPercent: number;
  hypertensionRiskCount: number;
  hypertensionRiskPercent: number;
  bothRiskCount: number;
  bothRiskPercent: number;
}
