# Contributing to CanopyML

Thank you for contributing to CanopyML! Please follow these guidelines to keep the codebase clean, scalable, and reliable.

## Code Style & Guidelines

### Monorepo Structure
- **Apps**: Place user-facing applications inside `apps/` (`frontend/`, `backend/`, `ml/`).
- **Packages**: Place cross-cutting shared code inside `packages/shared/`.
- **Imports**: Use path aliases in frontend (`@/` and `@shared/`) and explicit module imports in backend.

### Naming Conventions
- **Directory Names**: `kebab-case` (e.g., `deforestation-detection`, `saved_models`)
- **React Components**: `PascalCase` (e.g., `ConfidenceChart.tsx`, `MetricsCard.tsx`)
- **Utilities & Helpers**: `camelCase` (e.g., `validateFileSize`, `formatNumber`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `CLASS_NAMES`, `DEFAULT_TIMEOUT`)

### Verification Before Submitting
1. **Frontend Build**:
   ```bash
   cd apps/frontend && npm run build
   ```
2. **Backend Import & Launch**:
   ```bash
   PYTHONPATH=. python3 -c "from apps.backend.src.main import app; print(app.title)"
   ```
3. **Linting**:
   ```bash
   cd apps/frontend && npm run lint
   ```
