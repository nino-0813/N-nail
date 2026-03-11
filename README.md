# N nail - ネイルサロンサイト

広島県福山市駅家町のネイルサロン「N nail」のウェブサイトです。

## ローカルで実行

**必要環境:** Node.js

1. 依存関係をインストール: `npm install`
2. 開発サーバーを起動: `npm run dev`
3. ブラウザで http://localhost:3000 を開く

## Googleスプレッドシート連携（予約をシートに保存）

予約フォームの送信内容をGoogleスプレッドシートに自動で保存できます。**2通りの方法**があります。

### 方法A: Google Apps Script（設定が簡単）

1. スプレッドシートを新規作成し、1行目にヘッダー（受付日時・予約日・予約時間・メニュー・お名前・電話番号・メールアドレス・メモ）を入力。
2. **拡張機能** → **Apps Script** で [scripts/google-apps-script-reservation.js](scripts/google-apps-script-reservation.js) の内容を貼り付け、**ウェブアプリ**としてデプロイ（アクセス: 全員）。
3. `.env.local` に `GOOGLE_APPS_SCRIPT_WEBHOOK_URL=デプロイしたURL` を追加。

→ くわしくは [docs/GOOGLE_SHEETS_SETUP.md](docs/GOOGLE_SHEETS_SETUP.md)

### 方法B: Google Sheets API（正式API）

1. Google Cloud でプロジェクトを作成し、**Google Sheets API** を有効化。
2. **サービスアカウント**を作成し、JSONキーをダウンロード。スプレッドシートをそのメールアドレスと「編集」で共有。
3. `.env.local` に `GOOGLE_SPREADSHEET_ID` と `GOOGLE_SERVICE_ACCOUNT_BASE64`（JSONをBase64にしたもの）を設定。

→ くわしくは [docs/GOOGLE_SHEETS_API_SETUP.md](docs/GOOGLE_SHEETS_API_SETUP.md)

**どちらか一方を設定すれば動作します。** 両方設定している場合は **Sheets API が優先**されます。
