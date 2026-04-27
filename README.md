# MERN Template CLI

Generate a production-ready MERN starter project with optional Redis and OpenAI integrations.

## Local Linking (Phase 4)

Use local linking to test the package globally before publishing:

```bash
npm install
npm link
```

Then from any other folder:

```bash
mern-template create
```

Unlink when done:

```bash
npm unlink -g mern-template
```

## Usage

Interactive mode:

```bash
mern-template create
```

With project name:

```bash
mern-template create my-app
```

Non-interactive mode:

```bash
mern-template create my-app --yes
```

## Flags

- `--redis` include Redis
- `--no-redis` exclude Redis
- `--openai` include OpenAI SDK dependency
- `--no-openai` exclude OpenAI SDK dependency
- `-y, --yes` skip prompts and use CLI/default values

Examples:

```bash
mern-template create api-app --no-redis --openai --yes
mern-template create web-app --redis --no-openai --yes
```

## Edge Case Checks

The CLI currently handles:

- Existing folder check: stops if target directory already exists.
- MongoDB warning: warns if `mongod --version` fails, so users know local MongoDB may be missing.
- Dependency shaping: only keeps optional dependencies selected by user (`redis`, `openai`).

## Automated Setup

After scaffold, the CLI automatically runs:

- `npm install` in generated directories with `package.json`
- `git init` in the generated project root

## Quick Test Matrix

Before publishing, test these combinations:

1. `--no-redis --no-openai`
2. `--redis --no-openai`
3. `--no-redis --openai`
4. `--redis --openai`

For each run, verify:

- project is generated
- dependencies match selected options
- backend starts with `npm run dev`
