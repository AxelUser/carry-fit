# Contributing to CarryFit

Thank you for your interest in contributing to CarryFit! This document provides guidelines and information about contributing to this project.

## Ways to Contribute

1. **Report Bugs**
   - Use the GitHub Issues page to report bugs
   - Clearly describe the issue, including steps to reproduce
   - Include browser and device information if relevant

2. **Suggest Enhancements**
   - Feature requests are welcome
   - Provide clear and detailed explanation of the feature
   - Explain why this enhancement would be useful

3. **Update Airline Data**
   - Airline data is stored in `src/lib/carry-on-limits.json`
   - Each airline entry should include:     ```json
     {
       "airline": "Airline Name",
       "region": "Region Name",
       "link": "URL to baggage policy (optional)",
       "inches": "L x W x H",
       "centimeters": "L x W x H",
       "pounds": number (null if not applicable),
       "kilograms": number (null if not applicable)
     }     ```
   - Please include source links for any data updates

4. **Submit Code Changes**
   - Fork the repository
   - Create a new branch for your changes
   - Submit a Pull Request with a clear description of the changes

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Start development server: `pnpm dev`
4. Make your changes
5. Test your changes
6. Submit a Pull Request

## Code Style

- Follow existing code formatting
- Use TypeScript where possible
- Add comments for complex logic
- Keep components focused and reusable

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
