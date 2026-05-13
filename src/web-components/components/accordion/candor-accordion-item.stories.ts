import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Accordion',
  tags: ['autodocs'],
  render: () => ({
    template: `
      <div>
        <candor-accordion-item heading="What is Candor?">
          Candor is a humanist design system built with OKLCH color tokens and Lit web components.
        </candor-accordion-item>
        <candor-accordion-item heading="How do I install it?" open>
          Run <code>npm install @candor-design/tokens @candor-design/web-components</code> and import the CSS tokens.
        </candor-accordion-item>
        <candor-accordion-item heading="Does it support dark mode?">
          Yes — all color tokens have dark mode equivalents applied via <code>[data-theme="dark"]</code>.
        </candor-accordion-item>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
