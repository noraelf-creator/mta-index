# M.T.A. — MurdeR Trick Algorithm — 制作INDEX（v5）

公開サイト：https://noraelf-creator.github.io/mta-index/
旧確認サイト（Ver.4.1.1）：https://noraelf-creator.github.io/mta-review/

マダミス6作目『M.T.A.』の制作資料を読み、気になった箇所に修正案を残すためのサイト。2026-10-04〜05のv5改稿（信頼RTA・終幕・全面校正・整合性チェック・仮想プレイ）を載せている。画面の作りは『お母さんは大統領』の制作INDEXと同じ。

## 画面
- 左：大題と中題の2列（幅はドラッグで変えられる）
- 中央：本文。読み合わせは話者ごとの色分け、HOは見出しカード、カードは1枚ずつの枠
- 右：修正案。本文の段落・台詞・表の行で「✎」→ その箇所の修正案を書く

## 修正案の保存先
- 共有保存：Cloudflare Worker `mother-president-sync`（D1）、projectId `mta`、page_id の先頭 `v5-`
- 編集キーを入れていない間は、端末のブラウザーに下書きとして残る（あとで「下書きを共有へ送る」）
- 編集キーはこのリポジトリに含めない

## 更新のしかた
```
npm install       # 初回だけ
npm run sync      # mta6（作業の正本）から content/ を作る
npm run build     # content/ → data/site-data.js
npm run serve     # http://127.0.0.1:8765/ で確認
```
作業の正本は非公開リポジトリ noraelf-creator/mta-madamis6（ローカル `C:\02_claude.projects\mta6`）。
