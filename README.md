# growi-plugin-drawio-viewer

Growi スクリプトプラグイン。Markdown の `drawio` コードブロックに書いた draw.io ダイアグラムをネイティブ描画します。

## 使い方

Growi のページに以下のように記述するとダイアグラムが表示されます。

````markdown
```drawio
<mxfile>
  <diagram name="Page-1">
    <mxGraphModel>
      ...
    </mxGraphModel>
  </diagram>
</mxfile>
```
````

## 前提条件

- Growi v7 以降
- draw.io の `viewer.min.js` をローカルで配信する必要があります（下記参照）

## viewer.min.js のセットアップ

このプラグインは `/static/viewer.min.js` からdraw.ioビューワーを読み込みます。  
nginx などで以下のように配信してください。

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

## ローカルデプロイ

```bash
npm run build

docker exec <growi-container> mkdir -p /opt/growi/apps/app/tmp/plugins/local/growi-plugin-drawio-viewer
docker cp package.json <growi-container>:/opt/growi/apps/app/tmp/plugins/local/growi-plugin-drawio-viewer/
docker cp dist <growi-container>:/opt/growi/apps/app/tmp/plugins/local/growi-plugin-drawio-viewer/
docker restart <growi-container>
```

## 技術的な詳細

- Growi の `growiFacade.markdownRenderer.optionsGenerators` を使って `components.drawio` を上書き
- React の dual-instance 問題を回避するため `growiFacade.react` へのプロキシ shim を使用
- `remark-drawio` が XML を `children` プロップとして渡す仕様に対応

## ライセンス

MIT
