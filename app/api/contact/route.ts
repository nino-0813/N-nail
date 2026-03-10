import { NextRequest, NextResponse } from "next/server";
import { getServiceAccountCredentials, appendRowToSheet } from "@/lib/google-sheets";

function validateBody(body: unknown): { name: string; email: string; message: string } | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b.name !== "string" || typeof b.email !== "string" || typeof b.message !== "string") {
    return null;
  }
  return {
    name: b.name.trim(),
    email: b.email.trim(),
    message: b.message.trim(),
  };
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
      { message: "お名前・メールアドレス・お問い合わせ内容は必須です。" },
      { status: 400 }
    );
  }

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const credentials = getServiceAccountCredentials();

  if (!spreadsheetId || !credentials) {
    return NextResponse.json(
      { message: "お問い合わせ機能の設定が完了していません。しばらくしてからお試しください。" },
      { status: 503 }
    );
  }

  const sheetName = process.env.GOOGLE_CONTACT_SHEET_NAME || "お問い合わせ";
  const now = new Date();

  try {
    await appendRowToSheet(spreadsheetId, sheetName, [
      now.toISOString(),
      data.name,
      data.email,
      data.message,
    ]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { message: "送信に失敗しました。しばらくしてからお試しください。" },
      { status: 500 }
    );
  }
}
