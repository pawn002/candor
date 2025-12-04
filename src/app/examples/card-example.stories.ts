import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../components/button/button.component';
import { HeadingComponent } from '../components/typography/heading/heading.component';
import { TextComponent } from '../components/typography/text/text.component';

const meta: Meta = {
  title: 'Examples/Card Example',
  decorators: [
    moduleMetadata({
      imports: [ButtonComponent, HeadingComponent, TextComponent],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const ProductCard: Story = {
  render: () => ({
    template: `
      <div style="max-width: 350px; border: 1px solid var(--color-border, #ddd); border-radius: 8px; overflow: hidden;">
        <div style="width: 100%; height: 200px; background: linear-gradient(135deg, oklch(0.75 0.15 250), oklch(0.60 0.18 250));"></div>

        <div style="padding: 1.5rem;">
          <app-heading [level]="3" style="margin-bottom: 0.5rem;">
            Premium Wireless Headphones
          </app-heading>

          <app-text [variant]="'caption'" style="display: block; margin-bottom: 1rem; color: var(--color-text-secondary, #666);">
            Electronics • Audio
          </app-text>

          <app-text [variant]="'body'" style="display: block; margin-bottom: 1.5rem;">
            Experience crystal-clear sound with active noise cancellation.
            30-hour battery life and premium comfort for all-day listening.
          </app-text>

          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
            <div>
              <app-text [variant]="'caption'" style="display: block; text-decoration: line-through; color: var(--color-text-secondary, #666);">
                $299.99
              </app-text>
              <app-heading [level]="4" style="color: var(--color-primary);">
                $249.99
              </app-heading>
            </div>
            <div style="background: oklch(0.95 0.05 145); color: oklch(0.35 0.15 145); padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.875rem; font-weight: 600;">
              Save 17%
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem;">
            <app-button [variant]="'primary'" [size]="'medium'" style="flex: 1;">
              Add to Cart
            </app-button>
            <app-button [variant]="'ghost'" [size]="'medium'">
              ♡
            </app-button>
          </div>
        </div>
      </div>
    `,
  }),
};

export const ArticleCard: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px; border: 1px solid var(--color-border, #ddd); border-radius: 8px; overflow: hidden;">
        <div style="width: 100%; height: 180px; background: linear-gradient(135deg, oklch(0.70 0.12 180), oklch(0.55 0.15 200));"></div>

        <div style="padding: 1.5rem;">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
            <span style="background: var(--color-surface, #f5f5f5); padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
              Design
            </span>
            <span style="background: var(--color-surface, #f5f5f5); padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
              Accessibility
            </span>
          </div>

          <app-heading [level]="3" style="margin-bottom: 0.5rem;">
            Building Accessible Design Systems
          </app-heading>

          <app-text [variant]="'caption'" style="display: block; margin-bottom: 1rem; color: var(--color-text-secondary, #666);">
            By Jane Smith • Dec 4, 2025 • 5 min read
          </app-text>

          <app-text [variant]="'body'" style="display: block; margin-bottom: 1.5rem;">
            Learn how to create design systems that prioritize accessibility
            from the start, ensuring inclusive experiences for all users.
          </app-text>

          <div style="display: flex; gap: 0.75rem;">
            <app-button [variant]="'primary'" [size]="'small'">
              Read More
            </app-button>
            <app-button [variant]="'ghost'" [size]="'small'">
              Bookmark
            </app-button>
          </div>
        </div>
      </div>
    `,
  }),
};

export const ProfileCard: Story = {
  render: () => ({
    template: `
      <div style="max-width: 300px; border: 1px solid var(--color-border, #ddd); border-radius: 8px; text-align: center; padding: 2rem;">
        <div style="width: 100px; height: 100px; margin: 0 auto 1rem; border-radius: 50%; background: linear-gradient(135deg, oklch(0.65 0.18 320), oklch(0.50 0.20 280));"></div>

        <app-heading [level]="3" style="margin-bottom: 0.25rem;">
          Sarah Johnson
        </app-heading>

        <app-text [variant]="'body'" style="display: block; margin-bottom: 0.5rem; color: var(--color-text-secondary, #666);">
          Product Designer
        </app-text>

        <app-text [variant]="'caption'" style="display: block; margin-bottom: 1.5rem; color: var(--color-text-secondary, #666);">
          San Francisco, CA
        </app-text>

        <div style="display: flex; justify-content: center; gap: 2rem; margin-bottom: 1.5rem; padding: 1rem 0; border-top: 1px solid var(--color-border, #ddd); border-bottom: 1px solid var(--color-border, #ddd);">
          <div>
            <app-heading [level]="5" style="margin-bottom: 0.25rem;">
              1.2k
            </app-heading>
            <app-text [variant]="'caption'" style="display: block; color: var(--color-text-secondary, #666);">
              Followers
            </app-text>
          </div>
          <div>
            <app-heading [level]="5" style="margin-bottom: 0.25rem;">
              584
            </app-heading>
            <app-text [variant]="'caption'" style="display: block; color: var(--color-text-secondary, #666);">
              Following
            </app-text>
          </div>
          <div>
            <app-heading [level]="5" style="margin-bottom: 0.25rem;">
              127
            </app-heading>
            <app-text [variant]="'caption'" style="display: block; color: var(--color-text-secondary, #666);">
              Projects
            </app-text>
          </div>
        </div>

        <div style="display: flex; gap: 0.5rem;">
          <app-button [variant]="'primary'" [size]="'medium'" style="flex: 1;">
            Follow
          </app-button>
          <app-button [variant]="'secondary'" [size]="'medium'" style="flex: 1;">
            Message
          </app-button>
        </div>
      </div>
    `,
  }),
};

export const CardGrid: Story = {
  render: () => ({
    template: `
      <div style="padding: 2rem;">
        <app-heading [level]="2" style="margin-bottom: 2rem;">
          Featured Products
        </app-heading>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
          <!-- Card 1 -->
          <div style="border: 1px solid var(--color-border, #ddd); border-radius: 8px; overflow: hidden;">
            <div style="width: 100%; height: 150px; background: linear-gradient(135deg, oklch(0.75 0.15 250), oklch(0.60 0.18 250));"></div>
            <div style="padding: 1rem;">
              <app-heading [level]="4" style="margin-bottom: 0.5rem;">
                Product Name
              </app-heading>
              <app-text [variant]="'body'" style="display: block; margin-bottom: 1rem;">
                Short product description goes here.
              </app-text>
              <app-button [variant]="'primary'" [size]="'small'" style="width: 100%;">
                View Details
              </app-button>
            </div>
          </div>

          <!-- Card 2 -->
          <div style="border: 1px solid var(--color-border, #ddd); border-radius: 8px; overflow: hidden;">
            <div style="width: 100%; height: 150px; background: linear-gradient(135deg, oklch(0.70 0.12 180), oklch(0.55 0.15 200));"></div>
            <div style="padding: 1rem;">
              <app-heading [level]="4" style="margin-bottom: 0.5rem;">
                Another Product
              </app-heading>
              <app-text [variant]="'body'" style="display: block; margin-bottom: 1rem;">
                Brief description of the product features.
              </app-text>
              <app-button [variant]="'primary'" [size]="'small'" style="width: 100%;">
                View Details
              </app-button>
            </div>
          </div>

          <!-- Card 3 -->
          <div style="border: 1px solid var(--color-border, #ddd); border-radius: 8px; overflow: hidden;">
            <div style="width: 100%; height: 150px; background: linear-gradient(135deg, oklch(0.65 0.18 320), oklch(0.50 0.20 280));"></div>
            <div style="padding: 1rem;">
              <app-heading [level]="4" style="margin-bottom: 0.5rem;">
                Third Item
              </app-heading>
              <app-text [variant]="'body'" style="display: block; margin-bottom: 1rem;">
                More details about this product here.
              </app-text>
              <app-button [variant]="'primary'" [size]="'small'" style="width: 100%;">
                View Details
              </app-button>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
