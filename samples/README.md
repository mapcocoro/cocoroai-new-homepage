# Beauty Salon Luna - サンプルサイト

## リンク情報

| 項目 | URL |
|------|-----|
| 公開サイト | https://www.cocoroai.co.jp/samples/beauty-salon-template.html |
| GitHub | https://github.com/mapcocoro/beauty-salon-template |
| ローカル | `/Users/runa/projects/cocoroai-website/samples/` |

## 概要
女性向け美容サロン（エステ・ネイル）のモダンなWebサイトテンプレートです。スマートフォンでの閲覧に最適化されており、iOSアプリのような直感的なユーザーインターフェースを実現。サロンの魅力的な紹介に加えて、ホットペッパービューティー風のカレンダー予約システムを搭載し、お客様が簡単にメニュー選択から日時予約まで完結できる実用的なWebサイトです。

## 主な機能
- ✅ レスポンシブデザイン（モバイルファースト）
- ✅ タブ式ナビゲーション
- ✅ カレンダー予約システム
- ✅ サービスカテゴリー（フェイシャル・ネイル・ボディ・スペシャル）
- ✅ スタッフ紹介
- ✅ 料金表
- ✅ お客様の声
- ✅ よくある質問（FAQ）
- ✅ アクセス情報

## 技術仕様
- **言語**: HTML5, CSS3, JavaScript
- **フレームワーク**: なし（Vanilla JS）
- **デザイン**: モバイルファースト・レスポンシブ
- **ブラウザ対応**: iOS Safari, Chrome, Firefox, Edge

## ファイル構成
```
samples/
├── beauty-salon-template.html  # メインファイル（単一ファイル構成）
├── README.md                   # このファイル
└── DEVELOPMENT_LOG.md          # 開発ログ（Claudeとの会話記録）
```

## デモ表示方法

### 1. ローカルで開く
```bash
# ファイルを直接開く
open beauty-salon-template.html

# またはVSCodeのLive Server使用
# 右クリック → "Open with Live Server"
```

### 2. iframeで埋め込み
```html
<div class="mobile-preview">
  <iframe 
    src="samples/beauty-salon-template.html" 
    width="375" 
    height="667"
    style="border: 1px solid #ccc; border-radius: 20px;">
  </iframe>
</div>
```

## カスタマイズ方法

### 色の変更
```css
/* メインカラーの変更 */
#8b5fbf → お好みの色に変更（紫）
#e8b4cb → お好みの色に変更（ピンク）
#d4a574 → お好みの色に変更（ベージュ）
```

### 営業情報の変更
- 営業時間、定休日、電話番号などは直接HTML内で編集

### メニューの追加/変更
- menuDataオブジェクト内でメニュー情報を管理
- HTMLのservice-itemsセクションに新規メニュー追加

## 注意事項
- Service Worker機能はデモ環境のため無効化されています
- 予約データはlocalStorageに保存（デモ用）
- 実際の運用には、バックエンドシステムとの連携が必要

## 開発履歴
詳細な開発過程は `DEVELOPMENT_LOG.md` を参照してください。

## ライセンス
サンプルサイトのため、自由に使用・改変可能です。

---
Created with Claude (2025年1月)