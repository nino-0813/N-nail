import { NextResponse } from "next/server";
import { getBookedSlots } from "@/lib/google-sheets";

export async function GET() {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME || "Sheet1";

  if (!spreadsheetId) {
    return NextResponse.json({ booked: [] });
  }

  try {
    const booked = await getBookedSlots(spreadsheetId, sheetName);
    return NextResponse.json({ booked });
  } catch (err) {
    console.error("Failed to fetch booked slots:", err);
    return NextResponse.json({ booked: [] });
  }
}
