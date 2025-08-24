# Publish Steps

When you’re ready to release:

```
npm version patch  # choose betweem patch/minor/major
git push --follow-tags
```

That pushes a tag like `v0.1.1` → triggers the workflow → runs build → `npm publish`.

### One-liner

```
npm version patch && git push --follow-tags
```
