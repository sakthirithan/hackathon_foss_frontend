# 🌿 Git Workflow & Branching Guidelines

## 1. Branching Model

Always create feature branches off `main`:

```bash
git checkout main
git pull origin main
git checkout -b feature/<module-name>-<feature-description>
```

### Examples:
- `feature/journey-landing`
- `feature/battle-fall-rise`
- `feature/wisdom-boss-victory`

## 2. Commit Message Structure

Use conventional commits with module scopes:

- `feat(journey): add cinematic intro cutscene`
- `feat(battle): add warrior fall and rise sequence`
- `feat(wisdom): add victory rank calculation`
- `fix(battle): fix button hover flickering`
- `docs: update developer guide`

## 3. Pull Requests & Merging

Push feature branch to remote origin:
```bash
git push -u origin feature/<module-name>-<feature-description>
```
Create a Pull Request to merge into `main`.
