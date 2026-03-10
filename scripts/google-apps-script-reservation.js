/**
 * 予約フォーム用 Google Apps Script
 *
 * 使い方:
 * 1. 新しいGoogleスプレッドシートを作成
 * 2. 拡張機能 → Apps Script でこの内容を貼り付け
 * 3. デプロイ → 新しいデプロイ → ウェブアプリ（全員にアクセス許可）
 * 4. 発行されたURLを .env.local の GOOGLE_APPS_SCRIPT_WEBHOOK_URL に設定
 *
 * スプレッドシート1行目（ヘッダー）: 受付日時 | 予約日 | 予約時間 | メニュー | お名前 | 電話番号 | メールアドレス | メモ
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var body = e.postData ? JSON.parse(e.postData.contents) : {};
    var row = [
      new Date(),
      body.date || "",
      body.time || "",
      body.menuLabel || body.menuId || "",
      body.name || "",
      body.phone || "",
      body.email || "",
      body.memo || ""
    ];
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
