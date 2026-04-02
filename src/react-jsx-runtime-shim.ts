/**
 * react/jsx-runtime の shim。
 * growiFacade.react から jsx 関連の関数を取得する。
 */
export const jsx     = (...a: any[]) => (window as any).growiFacade?.react?.createElement(...a);
export const jsxs    = (...a: any[]) => (window as any).growiFacade?.react?.createElement(...a);
export const Fragment = () => (window as any).growiFacade?.react?.Fragment;
