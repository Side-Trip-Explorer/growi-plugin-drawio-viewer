/**
 * Growi の growiFacade.react へのプロキシ。
 * Growi は GrowiPluginsActivator で window.growiFacade.react に
 * 自身の React インスタンスを注入する。
 * プラグインがこの shim を通して React を使うことで
 * hooks が Growi の React dispatcher を参照し、dual-instance 問題を防ぐ。
 */
const ReactProxy = new Proxy({} as any, {
  get(_target, prop: string) {
    return (window as any).growiFacade?.react?.[prop];
  },
});

export default ReactProxy;

// named exports（hooks）を個別にエクスポートする
// JSX transform (react/jsx-runtime) も同様に growiFacade.react 経由にする
export const Children     = new Proxy({} as any, { get: (_t, p: string) => (window as any).growiFacade?.react?.Children?.[p] });
export const Fragment      = (...a: any[]) => (window as any).growiFacade?.react?.Fragment;
export const createElement = (...a: any[]) => (window as any).growiFacade?.react?.createElement(...a);
export const useRef        = (...a: any[]) => (window as any).growiFacade?.react?.useRef(...a);
export const useState      = (...a: any[]) => (window as any).growiFacade?.react?.useState(...a);
export const useEffect     = (...a: any[]) => (window as any).growiFacade?.react?.useEffect(...a);
export const useCallback   = (...a: any[]) => (window as any).growiFacade?.react?.useCallback(...a);
export const useMemo       = (...a: any[]) => (window as any).growiFacade?.react?.useMemo(...a);
