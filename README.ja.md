# growi-plugin-drawio-viewer

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
[![growi-plugin](https://img.shields.io/badge/growi-plugin-brightgreen.svg)](https://growi.org/plugins)

[🇺🇸 English](README.md) | 🇯🇵 日本語

---

Markdown ページの `drawio` コードブロックから **draw.io ダイアグラムをネイティブ描画** する [GROWI](https://github.com/weseek/growi) プラグインです。

## 使い方

GROWI のページに `drawio` コードブロックを記述するだけでダイアグラムが表示されます。

````markdown
```drawio
<mxfile>
  <diagram name="Page-1">
    <mxGraphModel>
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="2" value="Hello draw.io"
          style="rounded=1;fillColor=#e1f5ff;strokeColor=#6c9ebf;"
          vertex="1" parent="1">
          <mxGeometry x="80" y="80" width="160" height="60" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```
````

GraphViewer ライブラリによってインタラクティブなダイアグラムとして描画されます。

## 必要な環境

- GROWI v7 以降
- `viewer.min.js` をローカルで配信する必要があります（下記セットアップ参照）

## セットアップ

### 1. viewer.min.js を準備する

このプラグインは `/static/viewer.min.js` から draw.io ビューワーライブラリを読み込みます。  
以下のコマンドでダウンロードし、nginx などで配信してください。

```bash
curl -L -o nginx/static/viewer.min.js \
  "https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/js/viewer.min.js"
```

nginx 設定例:

```nginx
location /static/ {
    alias /etc/nginx/static/;
    expires 7d;
}
```

### 2. プラグインをデプロイする

```bash
npm run build

docker exec <growi-container> mkdir -p \
  /opt/growi/apps/app/tmp/plugins/local/growi-plugin-drawio-viewer

docker cp package.json \
  <growi-container>:/opt/growi/apps/app/tmp/plugins/local/growi-plugin-drawio-viewer/

docker cp dist \
  <growi-container>:/opt/growi/apps/app/tmp/plugins/local/growi-plugin-drawio-viewer/

docker restart <growi-container>
```

## 開発

```bash
git clone https://github.com/Side-Trip-Explorer/growi-plugin-drawio-viewer.git
cd growi-plugin-drawio-viewer
npm install
npm run build
```

## 技術的な仕組み

- `growiFacade.markdownRenderer.optionsGenerators` に hook して `drawio` コンポーネントを上書き
- `@growi/remark-drawio` が `children` プロップとして渡す XML を受け取って描画
- `viewer.min.js` を1ページにつき1度だけロードし、`GraphViewer.createViewerForElement()` を呼び出す
- React の dual-instance 問題を回避するため `growiFacade.react` へのプロキシ shim を使用

## ライセンス

[MIT](LICENSE) © 2026 Side-Trip-Explorer
