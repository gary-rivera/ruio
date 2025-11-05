# Release Process

This project uses automated GitHub releases via GitHub Actions.

## Creating a New Release

### 1. Create a Release Branch

```bash
git checkout -b release/v0.9.2  # or whatever version you're releasing
```

### 2. Update Version in package.json

Manually edit `package.json` and update the version:
```json
{
  "version": "0.9.2"  // Update this
}
```

Commit the change:
```bash
git add package.json
git commit -m "chore: bump version to 0.9.2"
git push origin release/v0.9.2
```

### 3. Create and Merge PR

- Create a PR from your release branch to `main`
- Wait for status checks to pass
- Merge the PR

### 4. Tag and Push from Main

After the PR is merged:

```bash
git checkout main
git pull

# Create the version tag
git tag v0.9.2

# Push the tag to trigger the release workflow
git push --tags
```

### 5. GitHub Actions Will Automatically:

- Run linting ✅
- Run type checking ✅
- Run tests ✅
- Build the package ✅
- Create a GitHub Release with auto-generated release notes ✅
- Show that beautiful green checkmark ✅

## What Gets Released

The release includes:
- All built distribution files from `dist/`
- `package.json`
- `README.md`
- `LICENSE`

## Version Numbering Guide

- **Patch** (0.9.1 → 0.9.2): Bug fixes, small tweaks
- **Minor** (0.9.2 → 0.10.0): New features, backwards compatible
- **Major** (0.10.0 → 1.0.0): Breaking changes

## Publishing to npm

Note: This workflow creates GitHub releases but does not automatically publish to npm. 

To publish to npm after the release is created:
```bash
npm publish
```

## Troubleshooting

**Tag already exists?**
```bash
# Delete local tag
git tag -d v0.9.2

# Delete remote tag
git push --delete origin v0.9.2

# Recreate and push
git tag v0.9.2
git push --tags
```

**Release workflow didn't trigger?**
- Ensure the tag follows the format `v*.*.*` (e.g., `v0.9.2`, not `0.9.2`)
- Check the Actions tab for any errors
- Verify the tag was pushed: `git ls-remote --tags origin`
