export interface RampHue { at: number; turn?: number; from?: number; over?: number }
export interface RampFamily { K: number; g: number; hue: RampHue }
export type Ladder = Record<string, number>;

export function hueAt(family: RampFamily, L: number): number;
export function stepLightness(ladder: Ladder, step: number): number;
export function inGamut(L: number, C: number, H: number): boolean;
export function maxChroma(L: number, H: number): number;
export function curveChroma(L: number, family: RampFamily, exponent: number): number;
export const inward: (c: number) => number;
export function chroma(L: number, family: RampFamily, exponent: number): number;
