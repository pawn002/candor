# Check MCP Server Status

Verify that all required MCP servers are running and functional before starting design work.

## Required MCP Servers

1. **CPQI MCP** - Color accessibility validation
2. **Playwright MCP** - Visual inspection and testing

## Your Task

Perform health checks on the MCP servers by:

1. **Test CPQI MCP**:
   - Use `get_color_meta` to get metadata for a simple color like "red"
   - If this succeeds, CPQI is working

2. **Test Playwright MCP**:
   - Use `browser_snapshot` or check browser status
   - If this succeeds, Playwright is working

3. **Report Status**:
   - Clearly indicate which MCP servers are ✓ available or ✗ unavailable
   - If any are unavailable, provide guidance on how to start them
   - If all are available, confirm ready to proceed with design work

4. **Additional Check**:
   - Verify Storybook is NOT already running on port 6006
   - If it is running, note it's ready for visual inspection
   - If not, remind that `npm run storybook` can start it when needed

Present the results in a clear, concise format showing the status of each dependency.
