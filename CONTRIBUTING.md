# 🤝 Contributing to Creatify MCP Server

Thank you for your interest in contributing to the Creatify MCP Server! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)
- [Documentation](#documentation)
- [Community](#community)

## 📜 Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow:

- **Be respectful** and inclusive in all interactions
- **Be constructive** in feedback and discussions
- **Be collaborative** and help others learn
- **Be patient** with newcomers and questions
- **Focus on the code**, not the person

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Git** for version control
- **Creatify API credentials** for testing (Pro plan or higher)

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/creatify-mcp.git
   cd creatify-mcp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your Creatify API credentials
   # CREATIFY_API_ID=your-api-id
   # CREATIFY_API_KEY=your-api-key
   ```

4. **Verify setup**
   ```bash
   # Run tests to ensure everything works
   npm test
   
   # Build the project
   npm run build
   
   # Run type checking
   npm run type-check
   ```

## 🛠️ Making Changes

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements

Examples:
- `feature/add-batch-processing`
- `fix/avatar-resource-error`
- `docs/update-api-examples`

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```bash
feat(tools): add batch video creation support
fix(resources): handle empty avatar list gracefully
docs(readme): add troubleshooting section
test(server): add integration tests for MCP tools
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/server.test.ts
```

### Writing Tests

- **Unit tests** for individual functions and classes
- **Integration tests** for MCP tool interactions
- **Mock external dependencies** (Creatify API calls)
- **Test error conditions** and edge cases

Example test structure:
```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreatifyMcpServer } from "../src/server.js";

describe("CreatifyMcpServer", () => {
  let server: CreatifyMcpServer;

  beforeEach(() => {
    server = new CreatifyMcpServer("test-id", "test-key");
  });

  it("should create avatar video successfully", async () => {
    // Test implementation
  });
});
```

### Test Coverage

Maintain high test coverage:
- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

## 📝 Code Style

### TypeScript Guidelines

- Use **strict TypeScript** configuration
- Prefer **interfaces** over types for object shapes
- Use **explicit return types** for public methods
- Avoid `any` - use proper typing
- Use **optional chaining** (`?.`) and **nullish coalescing** (`??`)

### ESLint Rules

We follow these key rules:
- No unused variables
- Prefer const over let
- Use semicolons
- Single quotes for strings
- No console.log in production code (use proper logging)

### Prettier Configuration

Code is automatically formatted with Prettier:
- **Print width**: 100 characters
- **Tab width**: 2 spaces
- **Semicolons**: Always
- **Single quotes**: Yes
- **Trailing commas**: ES5

### Running Code Quality Checks

```bash
# Run all checks
npm run check

# Individual checks
npm run lint          # ESLint
npm run lint:fix      # Fix ESLint issues
npm run format        # Prettier formatting
npm run type-check    # TypeScript checking
```

## 📚 Documentation

### Code Documentation

- **JSDoc comments** for all public methods
- **Inline comments** for complex logic
- **README updates** for new features
- **API documentation** for new tools/resources

Example JSDoc:
```typescript
/**
 * Create an avatar video with the specified parameters
 * @param params - Video creation parameters
 * @param params.text - Text for the avatar to speak
 * @param params.avatarId - ID of the avatar to use
 * @returns Promise resolving to the video creation response
 * @throws {Error} When API credentials are invalid
 * @example
 * ```typescript
 * const result = await server.createAvatarVideo({
 *   text: "Hello world",
 *   avatarId: "anna_costume1_cameraA",
 *   aspectRatio: "16:9"
 * });
 * ```
 */
```

### Documentation Updates

When adding features, update:
- **README.md** - Main documentation
- **API examples** - Usage examples
- **Type definitions** - TypeScript interfaces
- **CHANGELOG.md** - Version history

## 🔄 Submitting Changes

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code
   - Add tests
   - Update documentation

3. **Test thoroughly**
   ```bash
   npm run check  # Lint, format, type-check
   npm test       # Run all tests
   npm run build  # Ensure it builds
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to GitHub and create a PR
   - Fill out the PR template
   - Link any related issues

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by maintainers
3. **Testing** in development environment
4. **Approval** and merge

## 🏗️ Architecture Guidelines

### Project Structure

```
src/
├── index.ts          # Main entry point
├── server.ts         # MCP server implementation
├── types.ts          # Type definitions
└── utils/            # Utility functions

tests/
├── server.test.ts    # Server tests
└── utils/            # Test utilities

examples/
├── basic-client.ts   # Usage examples
└── claude-desktop-config.json
```

### Design Principles

- **Single Responsibility** - Each module has one clear purpose
- **Dependency Injection** - Easy to test and mock
- **Error Handling** - Graceful error handling with meaningful messages
- **Type Safety** - Full TypeScript coverage
- **Performance** - Efficient resource usage

### Adding New MCP Tools

When adding new MCP tools:

1. **Define the tool schema** with Zod validation
2. **Implement the tool handler** with proper error handling
3. **Add comprehensive tests** including error cases
4. **Update documentation** with examples
5. **Consider rate limiting** and resource usage

Example tool structure:
```typescript
server.tool(
  "tool_name",
  {
    param1: z.string().describe("Parameter description"),
    param2: z.number().optional().describe("Optional parameter")
  },
  async ({ param1, param2 }) => {
    try {
      // Implementation
      const result = await this.creatify.api.method(param1, param2);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);
```

## 🌟 Feature Requests

### Proposing New Features

1. **Check existing issues** to avoid duplicates
2. **Create a detailed issue** with:
   - Clear description of the feature
   - Use cases and benefits
   - Proposed implementation approach
   - Breaking changes (if any)

3. **Discuss with maintainers** before starting work
4. **Create a design document** for complex features

### Priority Guidelines

**High Priority:**
- Bug fixes
- Security improvements
- Performance optimizations
- Core MCP functionality

**Medium Priority:**
- New MCP tools
- Developer experience improvements
- Documentation enhancements

**Low Priority:**
- Nice-to-have features
- Experimental functionality

## 🐛 Bug Reports

### Reporting Bugs

Use the GitHub issue template and include:

- **Clear description** of the bug
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Environment details** (Node.js version, OS, etc.)
- **Error messages** and stack traces
- **Minimal reproduction** example

### Bug Fix Process

1. **Reproduce the bug** locally
2. **Write a failing test** that demonstrates the bug
3. **Fix the bug** with minimal changes
4. **Ensure the test passes** and no regressions
5. **Update documentation** if needed

## 💬 Community

### Getting Help

- **GitHub Discussions** - General questions and ideas
- **GitHub Issues** - Bug reports and feature requests
- **Email** - [listentomy@nefariousplan.com](mailto:listentomy@nefariousplan.com) for direct support

### Staying Updated

- **Watch the repository** for notifications
- **Follow releases** for new versions
- **Join MCP community** discussions

## 🎯 Roadmap

### Current Focus

- Comprehensive test coverage
- Performance optimizations
- Enhanced error handling
- Better documentation

### Future Plans

- Batch processing capabilities
- Advanced caching strategies
- Webhook support improvements
- Integration with more MCP clients

---

<div align="center">

**Thank you for contributing to Creatify MCP Server!** 🙏

**Created with ❤️ by [T Savo](mailto:listentomy@nefariousplan.com)**

🌐 **[Horizon City](https://www.horizon-city.com)** - *Building the future of AI-powered creativity*

</div>
