import type { Meta, StoryObj } from '@storybook/angular';

const MENU_ENTRIES = JSON.stringify([
  { label: 'Save for later' },
  { label: 'Add to wishlist' },
  'separator',
  { label: 'Share product' },
  { label: 'Report listing' },
]);

const meta: Meta = {
  title: 'Examples/Card Example',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Composition examples showing how Candor primitives combine into card-shaped UI patterns.

Cards are not a single component — they are a layout convention built from:
\`<candor-heading>\` (title), \`<candor-text>\` (body copy and metadata),
\`<candor-button>\` (primary and secondary actions), \`<candor-chip>\` (selectable attributes),
\`<candor-menu>\` (overflow actions), and \`<candor-tooltip>\` (inline help text).

These examples demonstrate the expected spacing, typographic hierarchy, and action placement
for product cards and content cards. Use them as a reference when composing custom card layouts.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const ProductCard: Story = {
  render: () => ({
    template: `
      <div style="padding: 1rem; max-width: 100%;"><div style="max-width: 350px; border: 1px solid var(--color-border-default); border-radius: 8px; overflow: hidden;">
        <div style="width: 100%; height: 200px; background: linear-gradient(135deg, oklch(0.75 0.15 250), oklch(0.60 0.18 250));"></div>

        <div style="padding: 1.5rem;">
          <candor-heading level="h3" style="margin-bottom: 0.5rem;">
            Premium Wireless Headphones
          </candor-heading>

          <candor-text variant="caption" style="display: block; margin-bottom: 1rem; color: var(--color-text-subtle);">
            Electronics • Audio
          </candor-text>

          <candor-text variant="body" style="display: block; margin-bottom: 1.5rem;">
            Experience crystal-clear sound with active noise cancellation.
            30-hour battery life and premium comfort for all-day listening.
          </candor-text>

          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
            <div>
              <candor-text variant="caption" style="display: block; text-decoration: line-through; color: var(--color-text-subtle);">
                $299.99
              </candor-text>
              <candor-heading level="h4" style="color: var(--color-action-primary);">
                $249.99
              </candor-heading>
            </div>
            <div style="background: oklch(0.95 0.05 145); color: oklch(0.35 0.15 145); padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.875rem; font-weight: 600;">
              Save 17%
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <candor-button variant="primary" size="medium" style="flex: 1;">
              Add to Cart
            </candor-button>
            <candor-menu label="More" entries='${MENU_ENTRIES}'></candor-menu>
          </div>
        </div>
      </div></div>
    `,
  }),
};

export const ArticleCard: Story = {
  render: () => ({
    template: `
      <div style="padding: 1rem; max-width: 100%;"><div style="max-width: 400px; border: 1px solid var(--color-border-default); border-radius: 8px; overflow: hidden;">
        <div style="width: 100%; height: 180px; background: linear-gradient(135deg, oklch(0.70 0.12 180), oklch(0.55 0.15 200));"></div>

        <div style="padding: 1.5rem;">
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
            <candor-chip label="Design" variant="primary"></candor-chip>
            <candor-chip label="Accessibility" variant="secondary"></candor-chip>
          </div>

          <candor-heading level="h3" style="margin-bottom: 0.5rem;">
            Building Accessible Design Systems
          </candor-heading>

          <candor-text variant="caption" style="display: block; margin-bottom: 1rem; color: var(--color-text-subtle);">
            By Jane Smith • Dec 4, 2025 • 5 min read
          </candor-text>

          <candor-text variant="body" style="display: block; margin-bottom: 1.5rem;">
            Learn how to create design systems that prioritize accessibility
            from the start, ensuring inclusive experiences for all users.
          </candor-text>

          <div style="display: flex; gap: 0.75rem;">
            <candor-button variant="primary" size="small">
              Read More
            </candor-button>
            <candor-tooltip text="Save to reading list" position="top">
              <candor-button variant="ghost" size="small">
                Bookmark
              </candor-button>
            </candor-tooltip>
          </div>
        </div>
      </div></div>
    `,
  }),
};

export const ProfileCard: Story = {
  render: () => ({
    template: `
      <div style="padding: 1rem; max-width: 100%;"><div style="max-width: 300px; border: 1px solid var(--color-border-default); border-radius: 8px; text-align: center; padding: 2rem;">
        <div style="width: 100px; height: 100px; margin: 0 auto 1rem; border-radius: 50%; background: linear-gradient(135deg, oklch(0.65 0.18 320), oklch(0.50 0.20 280));"></div>

        <candor-heading level="h3" style="margin-bottom: 0.25rem;">
          Sarah Johnson
        </candor-heading>

        <candor-text variant="body" style="display: block; margin-bottom: 0.5rem; color: var(--color-text-subtle);">
          Product Designer
        </candor-text>

        <candor-text variant="caption" style="display: block; margin-bottom: 1.5rem; color: var(--color-text-subtle);">
          San Francisco, CA
        </candor-text>

        <div style="display: flex; justify-content: center; gap: 2rem; margin-bottom: 1.5rem; padding: 1rem 0; border-top: 1px solid var(--color-border-default); border-bottom: 1px solid var(--color-border-default);">
          <div>
            <candor-heading level="h5" style="margin-bottom: 0.25rem;">
              1.2k
            </candor-heading>
            <candor-text variant="caption" style="display: block; color: var(--color-text-subtle);">
              Followers
            </candor-text>
          </div>
          <div>
            <candor-heading level="h5" style="margin-bottom: 0.25rem;">
              584
            </candor-heading>
            <candor-text variant="caption" style="display: block; color: var(--color-text-subtle);">
              Following
            </candor-text>
          </div>
          <div>
            <candor-heading level="h5" style="margin-bottom: 0.25rem;">
              127
            </candor-heading>
            <candor-text variant="caption" style="display: block; color: var(--color-text-subtle);">
              Projects
            </candor-text>
          </div>
        </div>

        <div style="display: flex; gap: 0.5rem;">
          <candor-button variant="primary" size="medium" style="flex: 1;">
            Follow
          </candor-button>
          <candor-button variant="secondary" size="medium" style="flex: 1;">
            Message
          </candor-button>
        </div>
      </div></div>
    `,
  }),
};

export const CardGrid: Story = {
  render: () => ({
    template: `
      <div style="padding: 2rem;">
        <candor-heading level="h2" style="margin-bottom: 2rem;">
          Featured Products
        </candor-heading>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 1.5rem;">
          <div style="border: 1px solid var(--color-border-default); border-radius: 8px; overflow: hidden;">
            <div style="width: 100%; height: 150px; background: linear-gradient(135deg, oklch(0.75 0.15 250), oklch(0.60 0.18 250));"></div>
            <div style="padding: 1rem;">
              <candor-heading level="h4" style="margin-bottom: 0.5rem;">
                Product Name
              </candor-heading>
              <candor-text variant="body" style="display: block; margin-bottom: 1rem;">
                Short product description goes here.
              </candor-text>
              <candor-button variant="primary" size="small" style="width: 100%;">
                View Details
              </candor-button>
            </div>
          </div>

          <div style="border: 1px solid var(--color-border-default); border-radius: 8px; overflow: hidden;">
            <div style="width: 100%; height: 150px; background: linear-gradient(135deg, oklch(0.70 0.12 180), oklch(0.55 0.15 200));"></div>
            <div style="padding: 1rem;">
              <candor-heading level="h4" style="margin-bottom: 0.5rem;">
                Another Product
              </candor-heading>
              <candor-text variant="body" style="display: block; margin-bottom: 1rem;">
                Brief description of the product features.
              </candor-text>
              <candor-button variant="primary" size="small" style="width: 100%;">
                View Details
              </candor-button>
            </div>
          </div>

          <div style="border: 1px solid var(--color-border-default); border-radius: 8px; overflow: hidden;">
            <div style="width: 100%; height: 150px; background: linear-gradient(135deg, oklch(0.65 0.18 320), oklch(0.50 0.20 280));"></div>
            <div style="padding: 1rem;">
              <candor-heading level="h4" style="margin-bottom: 0.5rem;">
                Third Item
              </candor-heading>
              <candor-text variant="body" style="display: block; margin-bottom: 1rem;">
                More details about this product here.
              </candor-text>
              <candor-button variant="primary" size="small" style="width: 100%;">
                View Details
              </candor-button>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
