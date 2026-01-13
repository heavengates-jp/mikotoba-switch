# みことばスイッチ

「金の領域で捉える」視点で、日々みことばを黙想するためのPWAです。Firebase（Firestore + Auth）をデータ基盤にし、GitHub Pagesへデプロイできます。

## 機能
- みことばをランダム表示（直近と被りにくい抽選）
- スイッチで次のランダムへ
- お気に入り・履歴（ローカル保存）
- 文字サイズ設定（小/中/大）
- 管理者ログイン後の登録・編集・削除
- 一括登録（プレビュー・エラー表示）
- 管理者限定の初期データ投入
- PWA対応（オフラインで直近表示/お気に入り/履歴）

## 必要要件
- Node.js 18+ 推奨
- Firebase プロジェクト（既存）

## セットアップ

### 1) 依存関係
```
npm install
```

### 2) Firebase 設定
`.env.example` を参考に `.env` を作成してください。

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

Firebase Console → Project settings → General → Your apps（Web）から取得できます。

### 3) Firestore ルール
Firestore のルールは次を使用してください。

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null
        && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    match /verses/{id} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    match /admins/{uid} {
      allow read, write: if false;
    }
  }
}
```

### 4) 管理者ドキュメント作成
管理者として許可するUIDのドキュメントを `admins` コレクションに追加します。
- コレクション: `admins`
- ドキュメントID: `LxXKGwkD1EOQdX4gpUS9u2Da8E62`
- フィールド: なしでOK

### 5) 開発サーバー
```
npm run dev
```

## テスト（一括登録パース）
```
npm run test
```

## GitHub Pages デプロイ
このリポジトリには GitHub Actions 用の `deploy.yml` を同梱しています。

1. GitHub で `Settings` → `Pages` を開き、Source を `GitHub Actions` に設定
2. `Settings` → `Environments` → `github-pages` に以下の Environment variables を登録
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`（任意）
3. `main` へ push すると自動デプロイ

`vite.config.js` は `base: './'` と `HashRouter` を使用しているため、Pages でパス問題が起きにくい構成です。

## データ構造
- verses
  - id: string (UUID)
  - reference: string
  - text: string
  - note: string
  - tags: string[]
  - createdAt: ISO string
- admins
  - ドキュメントID = UID

## 操作フロー
- 一般ユーザー: ログイン不要で閲覧/お気に入り/履歴
- 管理者: Email/Password でログイン → 管理画面で登録/編集/削除
- 初期データ投入: 管理画面でデータが空のときのみ表示

## ファイル構成
```
src/
  components/
    SwitchButton.jsx
    VerseCard.jsx
  data/
    seedVerses.js
  pages/
    Admin.jsx
    Favorites.jsx
    History.jsx
    Home.jsx
    Settings.jsx
  services/
    firebase.js
    versesService.js
  utils/
    localStore.js
    parseBulk.js
    parseBulk.test.js
    random.js
  App.jsx
  App.css
  index.css
  main.jsx
public/
  icon-192.png
  icon-512.png
  icon.svg
```

## 補足
- オフライン時はローカル保存している「直近表示/お気に入り/履歴」を優先表示します。
- Firestoreに接続できる場合は自動的に最新データを取得します。
