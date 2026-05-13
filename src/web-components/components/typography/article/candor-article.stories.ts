import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Typography/Article',
  tags: ['autodocs'],
  argTypes: {
    font: { control: 'select', options: ['serif', 'sans'] },
  },
  args: { font: 'serif' },
  render: (args) => ({
    template: `<candor-article font="${args['font']}">
      <h1>The humanist case for accessible design</h1>
      <p>Good typography isn't decoration — it's a form of care. When we choose typefaces that honour the shapes of letters, set type that breathes, and maintain contrast that doesn't strain the eye, we're acknowledging that text exists to be read by people.</p>
      <h2>Perceptual colour</h2>
      <p>OKLCH gives designers control over <strong>perceived lightness</strong> rather than numerical luminance. A colour that looks mid-tone on screen should behave as mid-tone — not surprise you with a jarring jump when lightness is adjusted by 10%.</p>
      <blockquote>
        The measure of a typeface is not its beauty in isolation but its service to the reader over long stretches of text.
      </blockquote>
      <h3>Code as prose</h3>
      <p>Even code blocks belong inside the humanist frame. A <code>monospace</code> span should feel warm, not clinical.</p>
      <pre><code>npm install @candor-design/tokens</code></pre>
      <p>Visit the <a href="#">documentation site</a> for full usage guidance.</p>
    </candor-article>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Serif: Story = {};

export const SansSerif: Story = {
  args: { font: 'sans' },
};
