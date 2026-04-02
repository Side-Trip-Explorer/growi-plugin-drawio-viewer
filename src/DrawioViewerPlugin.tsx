// src/DrawioViewerPlugin.tsx
import React, { useEffect, useRef, useState } from 'react';

// viewer.min.js がロードされたかどうかのフラグ（モジュールスコープ）
let viewerLoaded = false;
let viewerLoadPromise: Promise<void> | null = null;

function loadDrawioViewer(): Promise<void> {
  if (viewerLoaded) return Promise.resolve();
  if (viewerLoadPromise) return viewerLoadPromise;

  viewerLoadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/static/viewer.min.js';
    script.onload = () => {
      viewerLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load draw.io viewer'));
    document.head.appendChild(script);
  });

  return viewerLoadPromise;
}

interface Props {
  value: string;
}

export const DrawioViewerPlugin: React.FC<Props> = ({ value }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container == null) return;
    if (!value) return;

    // 前回のレンダリングをクリア
    container.innerHTML = '';

    const mxDiv = document.createElement('div');
    mxDiv.className = 'mxgraph';
    mxDiv.style.cssText = 'max-width:100%;border:1px solid #ddd;border-radius:4px;';
    mxDiv.setAttribute(
      'data-mxgraph',
      JSON.stringify({ highlight: '#0000ff', nav: true, xml: value })
    );
    container.appendChild(mxDiv);

    loadDrawioViewer()
      .then(() => {
        const w = window as any;
        if (w.GraphViewer?.createViewerForElement != null) {
          w.GraphViewer.createViewerForElement(mxDiv);
        }
      })
      .catch((err: Error) => {
        setError(err.message);
      });
  }, [value]);

  if (error != null) {
    return (
      <div style={{ color: 'red', padding: '8px', border: '1px solid red', borderRadius: '4px' }}>
        draw.io viewer の読み込みに失敗しました: {error}
      </div>
    );
  }

  return <div ref={containerRef} />;
};
