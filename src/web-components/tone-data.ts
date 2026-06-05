// Entry point for @candor-design/web-components/tone-data
//
// Provides utilities for building ToneRow[] data for <candor-tone-picker>.
// Import this from the sub-path when you need to construct gamut grids for
// custom hues — the main package entry does not include these utilities.
//
//   import { buildGamutRows } from '@candor-design/web-components/tone-data';

export {
  buildGamutRows,
  NAVY_GAMUT_ROWS,
  NAVY_GAMUT_HEADERS,
  BURGUNDY_GAMUT_ROWS,
  BURGUNDY_GAMUT_HEADERS,
  AZURE_GAMUT_ROWS,
  AZURE_GAMUT_HEADERS,
  INDIGO_GAMUT_ROWS,
  INDIGO_GAMUT_HEADERS,
} from './components/tone-picker/gamut-data';

export type { ToneRow, ToneCell, ToneCellValue } from './components/tone-picker/candor-tone-picker';
