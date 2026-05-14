import type { Meta, StoryObj } from '@storybook/angular';

const COUNTRY_OPTIONS = JSON.stringify([
  { value: 'gb', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
]);

const meta: Meta = {
  title: 'Web Components/Form/Select',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<candor-select label="Country" placeholder="Select a country" hint="Select your country of residence" options='${COUNTRY_OPTIONS}'></candor-select>`,
  }),
};

export const WithError: Story = {
  render: () => ({
    template: `<candor-select label="Country" placeholder="Select a country" error="Please select a country" options='${COUNTRY_OPTIONS}'></candor-select>`,
  }),
};

export const Required: Story = {
  render: () => ({
    template: `<candor-select label="Country" placeholder="Select a country" required options='${COUNTRY_OPTIONS}'></candor-select>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<candor-select label="Country" value="us" disabled options='${COUNTRY_OPTIONS}'></candor-select>`,
  }),
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1.5rem;max-width:420px;">
        <candor-select label="Default" placeholder="Select a country" hint="Select your country of residence" options='${COUNTRY_OPTIONS}'></candor-select>
        <candor-select label="With error" placeholder="Select a country" error="Please select a country" options='${COUNTRY_OPTIONS}'></candor-select>
        <candor-select label="Required" placeholder="Select a country" required options='${COUNTRY_OPTIONS}'></candor-select>
        <candor-select label="Disabled" value="us" disabled options='${COUNTRY_OPTIONS}'></candor-select>
      </div>
    `,
  }),
};
