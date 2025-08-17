# rengwutils

rengwu's ts utilities

## Tag + Push to Publish

When you’re ready to release:

```
npm version patch   # or minor / major
git push --follow-tags
```

That pushes a tag like `v0.1.1` → triggers the workflow → runs build → `npm publish`.
