import { HealthRecord } from '../types';
import { INITIAL_HEALTH_RECORDS, GOOGLE_SHEET_CSV_URL } from '../data/defaultData';

export interface FetchResult {
  records: HealthRecord[];
  isLive: boolean;
  updatedAt: string;
  error?: string;
}

// Format current or given date to Thai friendly format
export function formatThaiDateTime(date: Date = new Date()): string {
  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear() + 543; // พ.ศ.
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${day} ${month} ${year} เวลา ${hours}:${minutes}:${seconds} น.`;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseHealthCsv(csvText: string): HealthRecord[] {
  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return INITIAL_HEALTH_RECORDS;

  const records: HealthRecord[] = [];
  // Line 0 is header
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (!cols || cols.length < 5) continue;

    // Header mapping:
    // 0: รหัสบุคคล
    // 1: วันที่คัดกรอง
    // 2: พื้นที่
    // 3: เพศ
    // 4: อายุ
    // 5: ส่วนสูง_cm
    // 6: น้ำหนัก_kg
    // 7: BMI
    // 8: SBP_mmHg
    // 9: DBP_mmHg
    // 10: ชีพจร_bpm
    // 11: น้ำตาล_mg_dL
    // 12: สูบบุหรี่
    // 13: ดื่มแอลกอฮอล์
    // 14: การออกกำลังกาย
    // 15: เบาหวาน_คัดกรอง
    // 16: ความดันโลหิตสูง_คัดกรอง
    // 17: คะแนนความเสี่ยง
    // 18: ระดับความเสี่ยง
    // 19: เดือน
    const id = cols[0] || `H${(i).toString().padStart(4, '0')}`;
    if (!id.startsWith('H')) continue; // Skip blank or invalid rows

    const record: HealthRecord = {
      id,
      screeningDate: cols[1] || '',
      area: cols[2] || 'เมือง',
      gender: (cols[3] === 'ชาย' ? 'ชาย' : 'หญิง'),
      age: parseFloat(cols[4]) || 0,
      height: parseFloat(cols[5]) || 0,
      weight: parseFloat(cols[6]) || 0,
      bmi: parseFloat(cols[7]) || 0,
      sbp: parseFloat(cols[8]) || 0,
      dbp: parseFloat(cols[9]) || 0,
      pulse: parseFloat(cols[10]) || 0,
      sugar: parseFloat(cols[11]) || 0,
      smoking: cols[12] === 'สูบ' ? 'สูบ' : 'ไม่สูบ',
      alcohol: cols[13] === 'ดื่ม' ? 'ดื่ม' : 'ไม่ดื่ม',
      exercise: (cols[14] === 'สม่ำเสมอ' ? 'สม่ำเสมอ' : cols[14] === 'บางครั้ง' ? 'บางครั้ง' : 'ไม่ออกกำลังกาย'),
      diabetesRisk: cols[15] === 'มีแนวโน้ม/เสี่ยง' ? 'มีแนวโน้ม/เสี่ยง' : 'ไม่มี',
      hypertensionRisk: cols[16] === 'มีแนวโน้ม/เสี่ยง' ? 'มีแนวโน้ม/เสี่ยง' : 'ไม่มี',
      riskScore: parseFloat(cols[17]) || 0,
      riskLevel: (cols[18] === 'สูง' ? 'สูง' : cols[18] === 'ปานกลาง' ? 'ปานกลาง' : 'ต่ำ'),
      month: cols[19] || '2026-01',
    };

    records.push(record);
  }

  return records.length > 0 ? records : INITIAL_HEALTH_RECORDS;
}

export async function fetchHealthRecords(): Promise<FetchResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(GOOGLE_SHEET_CSV_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'text/csv,text/plain,*/*'
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const text = await response.text();
    const records = parseHealthCsv(text);

    return {
      records,
      isLive: true,
      updatedAt: formatThaiDateTime(new Date()),
    };
  } catch (err: unknown) {
    // Graceful fallback to initial bundled data
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return {
      records: INITIAL_HEALTH_RECORDS,
      isLive: false,
      updatedAt: formatThaiDateTime(new Date()),
      error: errorMessage
    };
  }
}
