# Google Analytics 実装ガイド

## 概要
このプロジェクトには Google Analytics 4 (GA4) が実装されています。
- **測定ID**: `G-WDZSEFZKY2`
- **実装日**: 2025年8月19日
- **ホスティング**: GitHub Pages

## 実装済みの追跡機能

### 1. ページビュー追跡
全ページで自動的にページビューを追跡

### 2. イベント追跡
以下のリンククリックを追跡中：

#### プロダクトリンク
| プロダクト名 | イベントラベル | URL |
|------------|---------------|-----|
| Bento Planner | `bento_planner_web` | https://bento.cocoroai.co.jp |
| お米ソムリエ | `rice_sommelier_web` | https://rice.cocoroai.co.jp/ |
| 美肌コンシェルジュ | `bihada_concierge_web` | https://bihadaconcierge.cocoroai.co.jp/ |
| 癒しの白衣ちゃん | `iyashi_nurse_web` | https://iyashinurse.cocoroai.co.jp/ |
| 癒しの三角コーン | `iyashi_cone_web` | https://genba.cocoroai.co.jp/ |
| 癒しのチョーク | `iyashi_chalk_web` | https://iyashiteacher.cocoroai.co.jp/ |
| 毎日のアファメーション | `affirmation_web` | https://affirmation.cocoroai.co.jp/ |
| ココロAI占い | `fortune_web` | https://fortune.cocoroai.co.jp/ |

#### その他の重要リンク
- お問い合わせフォーム: `contact_form`

## 新しいページやリンクを追加する方法

### 1. 新しいHTMLページを追加する場合

`<head>` タグ内に以下のコードを追加してください：

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-WDZSEFZKY2"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-WDZSEFZKY2');
</script>
```

### 2. 新しい外部リンクを追跡する場合

リンクに `onclick` イベントを追加：

```html
<a href="https://新しいサイト.cocoroai.co.jp" 
   target="_blank" 
   onclick="gtag('event', 'click', {
     event_category: 'external_link', 
     event_label: 'プロダクト名_web', 
     event_content: 'product_section'
   });">
   🌐 Webアプリ
</a>
```

### 3. App Storeリンクを追跡する場合

```html
<a href="https://apps.apple.com/..." 
   target="_blank" 
   onclick="gtag('event', 'click', {
     event_category: 'external_link', 
     event_label: 'プロダクト名_appstore', 
     event_content: 'product_section'
   });">
   📱 App Store
</a>
```

## イベントラベルの命名規則

- **Webアプリ**: `プロダクト名_web`
- **App Store**: `プロダクト名_appstore`
- **Mac App Store**: `プロダクト名_macappstore`
- **コンバージョン系**: `contact_form`, `signup`, など

## GitHub Pages への反映手順

1. ファイルを編集
2. `git add .`
3. `git commit -m "メッセージ"`
4. `git push origin main`
5. 5-10分待つ（GitHub Pages の更新）

## Google Analytics での確認方法

1. [Google Analytics](https://analytics.google.com) にアクセス
2. **リアルタイム** で即座に確認可能
3. **レポート → エンゲージメント → イベント** で詳細データ確認

### 確認できるデータ
- どのプロダクトが人気か
- Web版 vs アプリ版のクリック数
- お問い合わせへの導線効果
- ページごとの滞在時間

## トラブルシューティング

### イベントが記録されない場合
1. ブラウザの広告ブロッカーを無効化
2. キャッシュをクリア（Ctrl+F5 または Cmd+Shift+R）
3. 開発者ツールのConsoleで確認：
   ```javascript
   typeof gtag  // "function" と表示されればOK
   ```

### GitHub Pages が更新されない場合
1. GitHub の Actions タブで状態確認
2. 強制的にキャッシュクリア
3. 別のブラウザで確認

## 次回Claudeに依頼する際の手順

1. このREADMEを読み込んでもらう
2. 追加したいプロダクトやページの情報を伝える
3. 以下の情報を提供：
   - プロダクト名
   - WebアプリのURL
   - App StoreのURL（ある場合）

例：
```
新しいプロダクト「○○○」を追加したいです。
- Webアプリ: https://xxx.cocoroai.co.jp
- App Store: https://apps.apple.com/...
```

## 注意事項

- **測定IDは変更しない**: `G-WDZSEFZKY2` を全ページで統一
- **event_category は統一**: 外部リンクは `external_link`、コンバージョンは `conversion`
- **テスト時は本番環境で**: ローカルファイルでは動作しない場合がある

---

最終更新: 2025年8月19日
担当: Claude (Anthropic)