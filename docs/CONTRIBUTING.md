# Contributing to ruio

Thank you for your interest in contributing to **ruio** (React UI Outliner)! We welcome contributions from the community.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- Git
- One of the following package managers:
  - npm
  - yarn
  - bun

### Setting Up Your Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/ruio.git
cd ruio
```

3. Install dependencies using your preferred package manager:

```bash
# npm
npm install

# yarn
yarn install

# bun
bun install
```

4. Create a new branch for your feature or bug fix:

```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### Running the Development Server

```bash
# npm
npm run dev

# yarn
yarn dev

# bun
bun run dev
```

### Running Tests

```bash
# npm
npm run test

# yarn
yarn test

# bun
bun test
```

### Linting and Formatting

Before committing your changes, ensure your code passes linting and formatting checks:

```bash
# Run linter
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Check code formatting
npm run format:check

# Auto-format code
npm run format
```

### Type Checking

Ensure there are no TypeScript errors:

```bash
npm run type-check
```

## Coding Standards

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting a PR

## Commit Message Guidelines

Use clear and descriptive commit messages:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `refactor:` for code refactoring
- `test:` for adding or updating tests
- `chore:` for maintenance tasks

Example:

```
feat: add keyboard shortcuts for element selection
fix: resolve hover state bug on nested elements
docs: update installation instructions for bun
```

## Submitting a Pull Request

1. Ensure your code follows the coding standards
2. Run all tests and linting checks
3. Update documentation if needed
4. Push your changes to your fork
5. Open a pull request with a clear description of your changes

### Pull Request Checklist

- [ ] Tests pass locally
- [ ] Code is properly formatted and linted
- [ ] TypeScript type checking passes
- [ ] Documentation updated (if applicable)

## Reporting Bugs

When reporting bugs, please include:

- A clear description of the issue
- Steps to reproduce the problem
- Expected behavior
- Actual behavior
- Your environment (OS, Node version, package manager, etc.)
- Screenshots or code snippets (if applicable)

## Feature Requests

We welcome feature requests! Please open an issue and include:

- A clear description of the feature
- Use cases and benefits
- Any implementation ideas (optional)

## For Maintainers

See [RELEASE.md](./RELEASE.md) for information about cutting releases.

## Questions?

If you have questions about contributing, feel free to open an issue or reach out to the maintainers.

## License

By contributing to ruio, you agree that your contributions will be licensed under the MIT License.
