// client-entry.tsx
import React from 'react';
import { DrawioViewerPlugin } from './src/DrawioViewerPlugin';

const PLUGIN_NAME = 'growi-plugin-drawio-viewer';

const activate = (): void => {
  const w = window as any;
  const growiFacade = w.growiFacade;

  if (growiFacade == null || growiFacade.markdownRenderer == null) {
    console.warn(`[${PLUGIN_NAME}] growiFacade is not available`);
    return;
  }

  const { optionsGenerators } = growiFacade.markdownRenderer;
  if (optionsGenerators == null) {
    console.warn(`[${PLUGIN_NAME}] optionsGenerators is not available`);
    return;
  }

  // remark-drawio は drawio ブロックの XML を children として渡す
  const makeDrawioComponent = () => (props: any) => {
    const children = props.children;
    const xmlStr: string = Array.isArray(children)
      ? children.filter((n: any) => typeof n === 'string').join('')
      : typeof children === 'string'
        ? children
        : String(children ?? '');
    return React.createElement(DrawioViewerPlugin, { value: xmlStr });
  };

  // ページ表示用オプションをカスタマイズ
  optionsGenerators.customGenerateViewOptions = (...args: unknown[]) => {
    const options = (optionsGenerators.generateViewOptions as (...a: unknown[]) => any)(...args);
    if (options.components != null) {
      options.components.drawio = makeDrawioComponent();
    }
    return options;
  };

  // プレビュー用オプションをカスタマイズ（編集画面のプレビューペイン）
  optionsGenerators.customGeneratePreviewOptions = (...args: unknown[]) => {
    const options = (optionsGenerators.generatePreviewOptions as (...a: unknown[]) => any)(...args);
    if (options.components != null) {
      options.components.drawio = makeDrawioComponent();
    }
    return options;
  };

  console.info(`[${PLUGIN_NAME}] activated`);
};

const deactivate = (): void => {
  console.info(`[${PLUGIN_NAME}] deactivated`);
};

// window.pluginActivators に登録
const w = window as any;
if (w.pluginActivators == null) {
  w.pluginActivators = {};
}
w.pluginActivators[PLUGIN_NAME] = { activate, deactivate };
