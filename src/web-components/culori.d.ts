declare module 'culori' {
  interface Oklch { mode: 'oklch'; l: number; c: number; h: number; }
  type Color = Oklch | Record<string, unknown>;
  type DifferenceFn = (a: Color, b: Color) => number;
  export function differenceCiede2000(weights?: { l?: number; c?: number; h?: number }): DifferenceFn;
}
