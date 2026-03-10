# 予約データをGoogleスプレッドシートに保存する設定

予約フォームから送信されたデータをGoogleスプレッドシートに保存するには、Google Apps Script でWebアプリを1つデプロイします。

---

## 手順

### 1. スプレッドシートを作成

1. [Google スプレッドシート](https://sheets.google.com) で新しいスプレッドシートを作成します。
2. 1行目に次のヘッダーを入力します（A1〜H1）:

   | A | B | C | D | E | F | G | H |
   |---|---|---|---|---|---|-----|---|
   | 受付日時 | 予約日 | 予約時間 | メニュー | お名前 | 電話番号 | メールアドレス | メモ |

### 2. Apps Script を追加

1. スプレッドシートのメニューで **拡張機能** → **Apps Script** を開く。
2. 既定の `function myFunction() {}` を削除し、下の **スクリプト全体** を貼り付けて保存（Ctrl+S / Cmd+S）。

```javascript
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
```

### 3. Webアプリとしてデプロイ

1. エディタ右上の **デプロイ** → **新しいデプロイ** をクリック。
2. 種類で **ウェブアプリ** を選択。
3. 設定:
   - **説明**: 任意（例: 予約フォーム用）
   - **次のユーザーとして実行**: **自分**
   - **アクセスできるユーザー**: **全員**（匿名ユーザーも含む）
4. **デプロイ** をクリック。
5. 初回は「アプリにアクセスする権限を確認します」と出るので **許可** を押し、表示された **ウェブアプリのURL** をコピーします（`https://script.google.com/macros/s/.../exec` の形式）。

### 4. プロジェクトの環境変数に設定

1. プロジェクトのルートに `.env.local` を作成（または既存の `.env.local` を編集）。
2. 次の1行を追加し、`YOUR_WEB_APP_URL` をコピーしたURLに置き換えます。

```
GOOGLE_APPS_SCRIPT_WEBHOOK_URL=YOUR_WEB_APP_URL
```

3. 開発サーバーを再起動します（`npm run dev` を止めて再度実行）。

---

## 動作確認

1. 開発サーバーを再起動したうえで、サイトの **Reservation** ページで予約フォームを送信する。
2. スプレッドシートを開き、2行目以降に「受付日時・予約日・予約時間・メニュー・お名前・電話番号・メールアドレス・メモ」が1行ずつ追加されていれば連携成功です。

## うまくいかない場合

- **「予約システムの設定が完了していません」**  
  `.env.local` に `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` が正しく設定されているか、サーバー再起動後に反映されているか確認してください。
- **「予約の送信に失敗しました」**  
  Apps Script のデプロイで「アクセスできるユーザー: 全員」になっているか、URLをコピーし損じていないか確認してください。
- スプレッドシートの **1行目はヘッダー** のままにし、スクリプトは **先頭のシート** に追記します。別シートを使う場合は Apps Script 内の `getActiveSheet()` を任意のシート名に変更できます。
