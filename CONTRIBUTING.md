# Contributing to CarryFit

Thank you for your interest in contributing to CarryFit! This document provides guidelines and information about contributing to this project.

## Ways to Contribute

1. **Report Bugs**
   - Use the [bug report template](https://github.com/AxelUser/carry-fit/issues/new/choose)
   - Clearly describe the issue, including steps to reproduce

2. **Suggest Enhancements**
   - Use the [feature request template](https://github.com/AxelUser/carry-fit/issues/new/choose)
   - Provide clear and detailed explanation of the feature
   - Explain why this enhancement would be useful

3. **Update Airline Data**
   - Airline data is stored in [`src/lib/allowances/cabin-luggage-allowances.ts`](src/lib/allowances/cabin-luggage-allowances.ts)
   - Please include links to the policy pages or screenshots

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
   - Add new test cases in `e2e/` directory or update existing ones

## Using Storybook

Storybook is used for developing and testing UI components in isolation. Moreover, it contains a lot of examples and documentation for most of the components used in the project.

1. **Start Storybook**
   - Run `pnpm storybook` to start the Storybook development server
   - Access Storybook at `http://localhost:6006`

2. **Creating Stories**
   - Stories are located in `src/stories` directory
   - Create new story files with `.stories.svelte` extension
   - Use the Svelte CSF format for writing stories

## Code Style

- Follow existing code formatting rules, use `prettier` to format your code.
- Use TypeScript only.
- Add comments or docstrings for complex logic.
- Use Svelte 5 runes for state management. Consider using `*.svelte.ts` files to move complex logic to a separate file.
- Place components in the `src/lib/components` directory. If a new component is used only at one place, put it in the same directory as the component that uses it. Else, create a new directory for the component and place it in the `src/lib/components` directory.

## Pull Request Process

1. Update the README.md if needed
2. Update the documentation if needed
3. Ensure all tests pass
4. Link any relevant issues
5. Your PR will be reviewed by maintainers

## Questions?

Feel free to reach out to the maintainer:

- Email: [aleksey@maltsev.space](mailto:aleksey@maltsev.space)
- Open a [GitHub issue](https://github.com/AxelUser/carry-fit/issues/new/choose)
