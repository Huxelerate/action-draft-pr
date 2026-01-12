# action-draft-pr

This GitHub action sets a PR to draft (if not already so)

## Description

This action converts a pull request to draft status using the GitHub GraphQL API. If the PR is already a draft, no action is taken.

## Inputs

### `pr-number`

**Required** The pull request number to convert to draft.

### `github-token`

**Required** GitHub token with permissions to modify pull requests. Defaults to `${{ github.token }}`.

**Required Permissions:**
- `pull-requests: write` - Required to modify pull request status
- `contents: write` - Required for GraphQL mutation operations

## Example Usage

```yaml
name: Convert PR to Draft
on:
  pull_request:
    types: [opened, reopened]

jobs:
  draft-pr:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
      contents: write
    steps:
      - name: Convert to Draft
        uses: Huxelerate/action-draft-pr@v1
        with:
          pr-number: ${{ github.event.pull_request.number }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## How it Works

1. Takes a PR number as input
2. Checks if the PR is already in draft status
3. If not, uses the GitHub GraphQL `convertPullRequestToDraft` mutation to convert it
4. Reports success or failure

## License

MIT
