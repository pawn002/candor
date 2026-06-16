// Consolidated docs theming for Candor.
//
// Storybook's docs UI (page chrome, ArgTypes table, code blocks, story preview
// canvas, PrismJS syntax highlighting) is styled by a Storybook *theme*, not by
// Candor's `data-theme` attribute — so it does not follow the light/dark toggle
// on its own. Rather than patch each piece with per-element CSS overrides, we
// hand the docs renderer a full Storybook theme that flips with the `theme`
// global. `base: 'dark'` also gives the SyntaxHighlighter its dark token palette.
//
// Colours are concrete hex (not `var(--color-*)`) because Storybook runs theme
// colours through `polished`, which cannot parse `oklch()`/CSS custom properties.
// Values are the hex equivalents of the Candor light/dark token set; keep them in
// sync if those tokens change.
import { createElement, useEffect, useState } from 'react';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { create } from 'storybook/theming';

const shared = {
  appBorderRadius: 8,
  fontBase:
    "'Roboto Flex Variable','Roboto Flex',system-ui,-apple-system,sans-serif",
  fontCode: "'Noto Sans Mono','Roboto Mono',monospace",
  brandTitle: 'Candor',
};

const lightTheme = create({
  ...shared,
  base: 'light',
  colorPrimary: '#072942', // action-primary
  colorSecondary: '#005fc1', // link
  appBg: '#ffffff', // bg-page
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#dbd6d6', // border-default
  textColor: '#333333', // text-default
  textMutedColor: '#636363', // text-subtle
  textInverseColor: '#ffffff',
  barBg: '#e1e1e1', // bg-surface
  barTextColor: '#636363',
  barSelectedColor: '#072942',
  inputBg: '#ffffff',
  inputBorder: '#dbd6d6',
  inputTextColor: '#333333',
});

const darkTheme = create({
  ...shared,
  base: 'dark',
  colorPrimary: '#74c2ff', // action-primary (dark)
  colorSecondary: '#64b9ff', // link (dark)
  appBg: '#070e16', // bg-page (dark)
  appContentBg: '#070e16',
  appPreviewBg: '#070e16',
  appBorderColor: '#585858', // border-default (dark)
  textColor: '#d2d8de', // text-default (dark)
  textMutedColor: '#a1a1a1', // text-subtle (dark)
  textInverseColor: '#070e16',
  barBg: '#14202d', // bg-surface (dark)
  barTextColor: '#a1a1a1',
  barSelectedColor: '#d2d8de',
  inputBg: '#14202d',
  inputBorder: '#585858',
  inputTextColor: '#d2d8de',
});

function themeFromUrl(): string | null {
  try {
    // `:` arrives URL-encoded as %3A in globals (theme%3Adark)
    const s = decodeURIComponent(window.location.search);
    const m = s.match(/theme:(\w+)/);
    if (m) return m[1];
  } catch {
    /* no-op */
  }
  return null;
}

function themeFromContext(ctx: any): string | null {
  return (
    ctx?.store?.userGlobals?.globals?.theme ??
    ctx?.store?.globals?.get?.()?.theme ??
    ctx?.globals?.theme ??
    null
  );
}

// Custom container: subscribes to the same globals events the toolbar emits and
// swaps the Storybook theme so docs chrome tracks the light/dark toggle.
export const CandorDocsContainer = (props: any) => {
  const { context, children } = props;
  const [mode, setMode] = useState<string>(
    () => themeFromContext(context) ?? themeFromUrl() ?? 'light',
  );

  useEffect(() => {
    const channel = context?.channel;
    if (!channel) return;
    const update = (e: any) => {
      const t = (e?.globals ?? e)?.theme;
      if (t) setMode(t);
    };
    channel.on('globalsUpdated', update);
    channel.on('setGlobals', update);
    return () => {
      channel.off('globalsUpdated', update);
      channel.off('setGlobals', update);
    };
  }, [context]);

  return createElement(
    DocsContainer,
    { context, theme: mode === 'dark' ? darkTheme : lightTheme },
    children,
  );
};
