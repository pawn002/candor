import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Table',
  tags: ['autodocs'],
  argTypes: {
    compact: { control: 'boolean' },
    caption: { control: 'text' },
  },
  args: { compact: false, caption: '' },
  render: (args) => ({
    template: `<candor-table
      id="demo-table"
      caption="${args['caption'] || ''}"
      ${args['compact'] ? 'compact' : ''}
    ></candor-table>
    <script>
      (function() {
        var t = document.getElementById('demo-table');
        t.headers = ['Name', 'Role', 'Department', 'Start date'];
        t.rows = [
          { cells: ['Alice Okonkwo', 'Senior Engineer', 'Platform', '2021-03-15'] },
          { cells: ['Ben Hargreaves', 'Product Manager', 'Growth', '2020-07-01'] },
          { cells: ['Carmen Silva', 'Designer', 'Brand', '2022-01-10'] },
          { cells: ['David Chen', 'Engineering Manager', 'Platform', '2019-11-22'] },
          { cells: ['Emeka Nwosu', 'Data Analyst', 'Analytics', '2023-05-08'] },
        ];
      })();
    </script>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Compact: Story = {
  args: { compact: true, caption: 'Team roster (compact)' },
};

export const KeyValue: Story = {
  render: () => ({
    template: `<candor-table id="kv-table"></candor-table>
    <script>
      (function() {
        var t = document.getElementById('kv-table');
        t.rows = [
          { cells: ['Package', '@candor-design/tokens'], isHeader: true },
          { cells: ['Version', '1.0.0'], isHeader: true },
          { cells: ['License', 'MIT'], isHeader: true },
          { cells: ['Dependencies', '0'], isHeader: true },
        ];
      })();
    </script>`,
  }),
};
