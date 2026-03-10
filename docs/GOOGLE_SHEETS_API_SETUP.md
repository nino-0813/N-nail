# Google Sheets API でスプレッドシート連携する方法

予約を **Google Sheets API（正式API）** でスプレッドシートに保存する設定です。Apps Script の代わりに、サービスアカウントで直接書き込みます。

## 前提

- Google Cloud プロジェクトを作成できること
- スプレッドシートの「共有」でサービスアカウントのメールを追加できること

---

## 手順

### 1. Google Cloud でプロジェクトとAPIを有効化

1. [Google Cloud Console](https://console.cloud.google.com/) にログインし、**プロジェクトを選択**（または新規作成）。
2. **APIとサービス** → **ライブラリ** で「**Google Sheets API**」を検索し、**有効にする**。

### 2. サービスアカウントの作成

1. **APIとサービス** → **認証情報** → **認証情報を作成** → **サービスアカウント**。
2. 名前（例: `n-nail-reservation`）を入力して **作成**。ロールは未設定でOK。
3. 作成したサービスアカウントをクリック → **キー** タブ → **鍵を追加** → **新しい鍵を作成** → **JSON** を選んで **作成**。JSON ファイルがダウンロードされます。

### 3. スプレッドシートをサービスアカウントと共有

1. 予約を保存したい **Google スプレッドシート** を開く。
2. 右上 **共有** をクリック。
3. JSON の中の **`client_email`**（例: `xxx@project.iam.gserviceaccount.com`）をコピーし、共有相手に追加。権限は **編集**。
4. スプレッドシートの **URL** から **スプレッドシートID** を控える。  
   `https://docs.google.com/spreadsheets/d/【ここがID】/edit` の「ここがID」の部分。

### 4. スプレッドシートの1行目（ヘッダー）を用意

シートの **1行目** に次のヘッダーを入力しておきます（シート名はそのままでOK。デフォルトは `Sheet1`）。

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| 受付日時 | 予約日 | 予約時間 | メニュー | お名前 | 電話番号 | メールアドレス | メモ |

**お問い合わせフォーム用**に、同じスプレッドシート内にシート「**お問い合わせ**」を追加し、1行目に次のヘッダーを入力します。

| A | B | C | D |
|---|---|---|---|
| 受付日時 | お名前 | メールアドレス | お問い合わせ内容 |

（シート名は環境変数 `GOOGLE_CONTACT_SHEET_NAME` で変更可能。未設定時は「お問い合わせ」）

### 5. 環境変数を設定

**重要:** `.env.local` は **プロジェクトのルート**（`package.json` がある場所）に置いてください。`docs/` フォルダ内では読み込まれません。

プロジェクトの **`.env.local`** に以下を追加します。

```bash
# スプレッドシートID（URLの /d/ と /edit の間）
GOOGLE_SPREADSHEET_ID=あなたのスプレッドシートID

# サービスアカウントのJSON（2通りのどちらか）

# 方法A: JSONをそのまま貼る（全体を単一引用符で囲む）
# GOOGLE_SERVICE_ACCOUNT_BASE64='{"type": "service_account", "project_id": "...", ...}'

# 方法B: JSONをBase64にして1行で書く
# ターミナルで: base64 -i ダウンロードしたJSONファイル.json
# GOOGLE_SERVICE_ACCOUNT_BASE64=ここにBase64の文字列
```

**シート名を変えている場合**（例: 「予約一覧」にしている）:

```bash
GOOGLE_SHEET_NAME=予約一覧
```

指定しない場合は **Sheet1** に書き込みます。

### 6. 開発サーバーを再起動

```bash
npm run dev
```

---

## 動作の優先順位

- **GOOGLE_SPREADSHEET_ID** と **GOOGLE_SERVICE_ACCOUNT_JSON** または **GOOGLE_SERVICE_ACCOUNT_BASE64** が両方ある場合 → **Google Sheets API** で書き込み。
- 上記がなく **GOOGLE_APPS_SCRIPT_WEBHOOK_URL** がある場合 → **Apps Script** のウェブアプリに送信。

どちらか一方を設定すれば動作します。

---

## Base64 の出し方（方法A）

ターミナルで、ダウンロードした JSON ファイルのパスを指定して実行します。

```bash
# Mac / Linux
base64 -i ダウンロードした鍵.json | pbcopy   # Mac: クリップボードにコピー
base64 -i ダウンロードした鍵.json              # 表示して手動でコピー
```

出た文字列をそのまま `GOOGLE_SERVICE_ACCOUNT_BASE64=` の右に貼り付けます。

---

## トラブルシュート

- **403 / 権限エラー**  
  スプレッドシートを、サービスアカウントの `client_email` と **編集** で共有しているか確認してください。
- **404 / スプレッドシートが見つからない**  
  `GOOGLE_SPREADSHEET_ID` が URL の `d/` と `/edit` の間の部分だけになっているか確認してください。
- **予約が送信されない**  
  `.env.local` を変更したあと、必ず `npm run dev` を再起動してください。
