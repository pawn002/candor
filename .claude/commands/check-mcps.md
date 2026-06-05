# Check Tool Availability

Verify that required tools are available before starting design work.

## Required Tools

1. **klar CLI** - Color accessibility validation
2. **Playwright MCP** - Visual inspection and testing

## Your Task

Perform availability checks by:

1. **Test klar CLI**:
   - Run `klar --version` in a bash shell
   - If this succeeds, klar is working
   - If unavailable: `npm install -g klar-cli`

2. **Test Playwright MCP**:
   - Attempt `browser_close` to free any existing resource locks
   - Then use `browser_snapshot` or check browser status
   - If this succeeds, Playwright is working

3. **Report Status**:
   - Clearly indicate which tools are ✓ available or ✗ unavailable
   - If any are unavailable, provide guidance on how to restore them
   - If all are available, confirm ready to proceed with design work

4. **Additional Check**:
   - Verify Storybook is NOT already running on port 6006
   - If it is running, note it's ready for visual inspection
   - If not, remind that `npm run storybook` can start it when needed

Present the results in a clear, concise format showing the status of each dependency.
