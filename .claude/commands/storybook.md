# Open Storybook in Browser

Check if Storybook is running on port 6006, and open it in the Playwright browser.

## Your Task

1. Check if Storybook is running by testing port 6006:
   - Use `netstat -ano | findstr :6006` on Windows
   - Look for a process listening on port 6006

2. If Storybook is NOT running:
   - Inform the user that Storybook is not running
   - Prompt the user: "Storybook is not running. Would you like me to help you start it? You can run `npm run storybook` in your terminal."
   - DO NOT run the npm command yourself
   - Wait for user confirmation before proceeding

3. If Storybook IS running:
   - Use the Playwright MCP `browser_navigate` tool to open http://localhost:6006
   - Confirm to the user that Storybook has been opened in the browser

4. If the user confirms they've started Storybook:
   - Wait a few seconds for it to fully start
   - Then use `browser_navigate` to open http://localhost:6006

## Important Notes
- Always check the port status first
- Never run `npm run storybook` yourself
- Always prompt the user to start it manually if needed
