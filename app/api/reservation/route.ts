import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getServiceAccountCredentials } from "@/lib/google-sheets";

const MENU_IDS = [
  "clear",
  "onecolor",
  "gradient",
  "magnet",
  "french",
  "simple",
  "design",
  "length",
  "off_own_change",
  "off_own_only",
  "off_other_change",
  "off_other_only",
] as const;

function validateBody(body: unknown): {
  date: string;
  time: string;
  menuId: string;
  menuLabel: string;
  name: string;
  phone: string;
  email: string;
  memo: string;
} | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (
    typeof b.date !== "string" ||
    typeof b.time !== "string" ||
    typeof b.menuId !== "string" ||
    !MENU_IDS.includes(b.menuId as (typeof MENU_IDS)[number]) ||
    typeof b.name !== "string" ||
    typeof b.phone !== "string" ||
    typeof b.email !== "string"
  ) {
    return null;
  }
  return {
    date: b.date,
    time: b.time,
    menuId: b.menuId,
    menuLabel: typeof b.menuLabel === "string" ? b.menuLabel : b.menuId,
    name: b.name.trim(),
    phone: b.phone.trim(),
    email: b.email.trim(),
    memo: typeof b.memo === "string" ? b.memo.trim() : "",
  };
}

/** Apps Script の Web アプリに POST してスプレッドシートに追記 */
async function sendToAppsScript(
  webhookUrl: string,
  data: {
    date: string;
    time: string;
    menuId: string;
    menuLabel: string;
    name: string;
    phone: string;
    email: string;
    memo: string;
  }
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Google Apps Script error:", res.status, text);
    return { ok: false, error: text };
  }
  return { ok: true };
}

/** 日本時間で「YYYY-MM-DD HH:mm:ss」を返す（受付日時・予約日のタイムゾーンずれ防止） */
function formatJST(d: Date): string {
  return d.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .replace(/\//g, "-")
    .replace(/\s/g, " ");
}

/** Google Sheets API でスプレッドシートに1行追記（日本時間・日付は文字列のまま） */
async function appendRowWithSheetsAPI(
  spreadsheetId: string,
  credentials: { client_email: string; private_key: string },
  data: {
    date: string;
    time: string;
    menuLabel: string;
    name: string;
    phone: string;
    email: string;
    memo: string;
  }
): Promise<{ ok: boolean; error?: string }> {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const sheetName = process.env.GOOGLE_SHEET_NAME || "Sheet1";
  const now = new Date();
  const row = [
    formatJST(now),
    data.date,
    data.time,
    data.menuLabel,
    data.name,
    data.phone,
    data.email,
    data.memo,
  ];
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:H`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
  return { ok: true };
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "リクエスト形式が正しくありません。" },
      { status: 400 }
    );
  }

  const data = validateBody(body);
  if (!data) {
    return NextResponse.json(
      { message: "必須項目が不足しているか、形式が正しくありません。" },
      { status: 400 }
    );
  }

  const webhookUrl = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const credentials = getServiceAccountCredentials();

  // 方法1: Google Sheets API（環境変数が揃っている場合）
  if (spreadsheetId && credentials) {
    try {
      const result = await appendRowWithSheetsAPI(spreadsheetId, credentials, data);
      if (!result.ok) {
        return NextResponse.json(
          { message: "予約の送信に失敗しました。しばらくしてからお試しください。" },
          { status: 502 }
        );
      }
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("Google Sheets API error:", err);
      return NextResponse.json(
        { message: "予約の送信に失敗しました。しばらくしてからお試しください。" },
        { status: 502 }
      );
    }
  }

  // 方法2: Apps Script ウェブアプリ
  if (webhookUrl) {
    const result = await sendToAppsScript(webhookUrl, data);
    if (!result.ok) {
      return NextResponse.json(
        { message: "予約の送信に失敗しました。しばらくしてからお試しください。" },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  }

  console.error("Neither GOOGLE_APPS_SCRIPT_WEBHOOK_URL nor (GOOGLE_SPREADSHEET_ID + GOOGLE_SERVICE_ACCOUNT_*) is set");
  return NextResponse.json(
    { message: "予約システムの設定が完了していません。しばらくしてからお試しください。" },
    { status: 503 }
  );
}
