# growi-plugin-drawio-viewer

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
[![growi-plugin](https://img.shields.io/badge/growi-plugin-brightgreen.svg)](https://growi.org/plugins)

A [GROWI](https://github.com/weseek/growi) plugin that renders **draw.io diagrams natively** from `drawio` code blocks in Markdown pages.

## Demo

Write a `drawio` code block in your GROWI page:

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

The block is rendered as an interactive draw.io diagram using the GraphViewer library.

## Requirements

- GROWI v7 or later
- `viewer.min.js` must be served locally (see setup below)

## Setup

### 1. Prepare viewer.min.js

This plugin loads the draw.io viewer library from `/static/viewer.min.js`.  
Download it and serve it via your web server (e.g. nginx):

```bash
curl -L -o nginx/static/viewer.min.js \
  "https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/js/viewer.min.js"
```

Add a location block to your nginx config:

```nginx
location /static/ {
    alias /etc/nginx/static/;
    expires 7d;
}
```

### 2. Deploy the plugin

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

## Development

```bash
git clone https://github.com/Side-Trip-Explorer/growi-plugin-drawio-viewer.git
cd growi-plugin-drawio-viewer
npm install
npm run build
```

## How it works

- Hooks into `growiFacade.markdownRenderer.optionsGenerators` to override the `drawio` component
- Receives diagram XML via the `children` prop (passed by `@growi/remark-drawio`)
- Loads `viewer.min.js` once per page and calls `GraphViewer.createViewerForElement()`
- Uses a React proxy shim (`growiFacade.react`) to avoid the React dual-instance problem

## License

[MIT](LICENSE) © 2026 Side-Trip-Explorer
