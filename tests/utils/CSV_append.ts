import fs from 'fs';
import path from 'path';

type Row = Record<string, string | number | boolean | null | undefined>;

const dataDir = path.join(__dirname, '..', 'data'); // -> c:\Data\pst_PW_test\tests\data
const defaultFile = path.join(dataDir, 'registrations.csv');
const defaultHeaders = ['first_name', 'last_name', 'email', 'createdAt'];

function ensureDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function csvEscape(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export function saveToCsv(filePath: string, headers: string[], row: Row) {
  ensureDir(filePath);
  const exists = fs.existsSync(filePath);
  if (!exists) {
    fs.writeFileSync(filePath, headers.join(',') + '\n', 'utf8');
  }
  const line = headers
    .map(h => {
      const v = row[h];
      const s = v === undefined || v === null ? '' : String(v);
      return csvEscape(s);
    })
    .join(',') + '\n';
  fs.appendFileSync(filePath, line, 'utf8');
}

export function saveRegistration(row: Row, filePath = defaultFile) {
  saveToCsv(filePath, defaultHeaders, row);
}