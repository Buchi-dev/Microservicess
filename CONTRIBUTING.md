# Contributing to the Microservices E-Commerce Project

Thank you for considering contributing to our microservices e-commerce application! This guide outlines the best practices and workflows we follow to maintain a high-quality, reliable, and consistent codebase.

## Development Workflow

### 1. Branching Strategy

We follow a strict branching strategy:

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: For new features (e.g., `feature/user-profile`)
- `bugfix/*`: For bug fixes (e.g., `bugfix/login-error`)
- `hotfix/*`: For urgent production fixes (e.g., `hotfix/payment-crash`)

**Never** push directly to the `main` or `develop` branches. All code changes must go through pull requests.

### 2. Development Setup

#### Option 1: Full Docker Environment
```
setup.bat        # Windows
make setup       # Linux/Mac
```

#### Option 2: Local Development of Specific Service
```
dev-setup.bat    # Windows
```

#### Option 3: Running RabbitMQ Only
If you're developing locally but need the message broker:
```
docker-compose up -d rabbitmq
```

### 3. Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates, etc.

Examples:
```
feat(user): add password reset functionality
fix(payment): resolve checkout race condition
refactor(product): simplify filtering logic
```

### 4. Pull Request Process

1. Create a branch from `develop` using the appropriate prefix
2. Implement your changes, following the code standards
3. Write or update relevant tests
4. Ensure all tests pass
5. Update documentation if necessary
6. Open a PR against the `develop` branch
7. Wait for code reviews and address any feedback
8. Squash commits before merging to keep history clean

## Code Standards

### General Principles

- **DRY** (Don't Repeat Yourself): Avoid code duplication
- **KISS** (Keep It Simple, Stupid): Prefer simple solutions over complex ones
- **YAGNI** (You Aren't Gonna Need It): Don't add functionality until it's necessary

### JavaScript/Node.js Standards

- Use ES6+ features where appropriate
- Use async/await instead of callbacks or raw promises
- Add JSDoc comments for public functions
- Use meaningful variable and function names
- Handle errors properly, don't swallow exceptions

### API Design

1. Follow RESTful principles
2. Use appropriate HTTP methods (GET, POST, PUT, DELETE)
3. Return consistent JSON response formats:
   ```json
   {
     "success": true/false,
     "data": {...},
     "error": "Error message if applicable"
   }
   ```
4. Use proper status codes

### Microservices Best Practices

1. Keep services loosely coupled
2. Each service should have a single responsibility
3. Use message queues for asynchronous communication
4. Implement proper error handling and retry logic
5. Include health checks and monitoring

## Testing Requirements

- All features must include unit tests
- Integration tests for critical paths
- Aim for at least 80% code coverage
- Write tests for bug fixes to prevent regressions

## Security Guidelines

1. **Never** commit secrets, API keys, or credentials
2. Always use environment variables for sensitive data
3. Validate and sanitize all user inputs
4. Implement proper authentication and authorization
5. Follow OWASP security best practices

## Working with AI Assistance

When using AI tools like Cursor's AI features:

1. Always review AI-generated code before committing
2. Understand what the code does before accepting it
3. Add a comment indicating AI assistance for complex blocks
4. Ensure AI-generated code follows our standards and conventions
5. Verify AI-generated code doesn't introduce security vulnerabilities

## Documentation

- Update the README.md with any relevant changes
- Document new API endpoints
- Include JSDoc comments for functions and methods
- Document environment variables in .env.example files

## Asking for Help

If you're stuck on an issue:
1. Check existing documentation first
2. Search through closed issues and PRs
3. Ask for help in the team communication channels
4. When asking for help, clearly describe the problem and what you've tried

Remember that we value collaboration over competition. Don't struggle alone!

## License

By contributing to this project, you agree that your contributions will be licensed under the project's license. 