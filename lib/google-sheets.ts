import { google } from "googleapis";

export function getServiceAccountCredentials(): {
  client_email: string;
  private_key: string;
} | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const base64OrJson = process.env.GOOGLE_SERVICE_ACCOUNT_BASE64;
  let json: string;
  if (base64OrJson) {
    if (base64OrJson.trimStart().startsWith("{")) {
      json = base64OrJson;
    } else {
      try {
        json = Buffer.from(base64OrJson, "base64").toString("utf8");
      } catch {
        return null;
      }
    }
  } else if (raw) {
    json = raw;
  } else {
    return null;
  }
  try {
    const parsed = JSON.parse(json) as { client_email?: string; private_key?: string };
    if (parsed.client_email && parsed.private_key) {
      return { client_email: parsed.client_email, private_key: parsed.private_key };
    }
  } catch {
    // ignore
  }
  return null;
}

/** スプレッドシートから予約済みの「日付_時間」一覧を取得（B列=予約日, C列=予約時間） */
export async function getBookedSlots(
  spreadsheetId: string,
  sheetName: string
): Promise<string[]> {
  const credentials = getServiceAccountCredentials();
  if (!credentials) return [];

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const range = `${sheetName}!B2:C500`;
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  const rows = (res.data.values || []) as (string | number)[][];
  const booked = new Set<string>();

  for (const row of rows) {
    const [dateVal, timeVal] = row;
    if (dateVal == null || timeVal == null) continue;
    const dateStr = normalizeDate(dateVal);
    const timeStr = normalizeTime(timeVal);
    if (dateStr && timeStr) booked.add(`${dateStr}_${timeStr}`);
  }

  return Array.from(booked);
}

function normalizeDate(val: string | number): string {
  if (typeof val === "number") {
    const ms = (val - 25569) * 86400 * 1000;
    return new Date(ms).toISOString().slice(0, 10);
  }
  const s = String(val).trim();
  const match = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return match[0];
  return "";
}

function normalizeTime(val: string | number): string {
  if (typeof val === "number") {
    const fraction = val;
    const totalMinutes = Math.round(fraction * 24 * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }
  const s = String(val).trim();
  const match = s.match(/(\d{1,2}):(\d{2})/);
  if (match) {
    const h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }
  return "";
}

/** 指定シートに1行追記（予約・お問い合わせなど） */
export async function appendRowToSheet(
  spreadsheetId: string,
  sheetName: string,
  values: (string | number)[]
): Promise<void> {
  const credentials = getServiceAccountCredentials();
  if (!credentials) throw new Error("No credentials");

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const range = `${sheetName}!A:Z`;
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  });
}
