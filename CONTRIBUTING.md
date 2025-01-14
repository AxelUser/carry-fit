# Contributing to CarryFit

Thank you for your interest in contributing to CarryFit! This document provides guidelines and information about contributing to this project.

## Ways to Contribute

1. **Report Bugs**
   - Use the GitHub Issues page to report bugs
   - Use the bug report template
   - Clearly describe the issue, including steps to reproduce
   - Include browser and device information if relevant

2. **Suggest Enhancements**
   - Feature requests are welcome
   - Use the feature request template
   - Provide clear and detailed explanation of the feature
   - Explain why this enhancement would be useful

3. **Update Airline Data**
   - Airline data is stored in [`src/lib/allowances/cabin-luggage-allowances.ts`](src/lib/allowances/cabin-luggage-allowances.ts)
   - Please include links to the policy pages or screenshots
   - Optionally, add test cases using the `test` property to verify data accuracy. We're using simple text matching on the innerText of the policy page. You may see the logic in [`e2e/allowance-consistency.test.ts`](e2e/allowance-consistency.test.ts)

4. **Submit Code Changes**
   - Fork the repository
   - Create a new branch for your changes
   - Submit a Pull Request with a clear description of the changes
   - Ensure all tests pass

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Start development server: `pnpm dev`
4. Make your changes
5. Run tests: `pnpm test`
6. Submit a Pull Request

## Testing

1. **Unit Tests**
   - Write unit tests for new functionality
   - Run unit tests: `pnpm test:unit`
   - Tests should be placed in the same directory as the code they are testing

2. **End-to-End Tests**
   - E2E tests use Playwright
   - Run E2E tests: `pnpm test:e2e`
   - Add new test cases in `e2e/` directory or update existing ones (e.g. [`e2e/main-flow.test.ts`](e2e/main-flow.test.ts))

## Code Style

- Follow existing code formatting rules, use `prettier` to format your code
- Use TypeScript only
- Add comments or docstrings for complex logic
- Use Svelte 5 runes for state management

## Pull Request Process

1. Update the README.md if needed
2. Update the documentation if needed
3. Ensure all tests pass
4. Link any relevant issues
5. Your PR will be reviewed by maintainers

## Questions?

Feel free to reach out to the maintainer:

- Email: [alexey.maltsev.work@gmail.com](mailto:alexey.maltsev.work@gmail.com)
- Twitter: [@axel_user](https://x.com/axel_user)
