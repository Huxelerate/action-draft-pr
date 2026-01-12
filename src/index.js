const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    // Get inputs
    const prNumber = core.getInput('pr-number', { required: true });
    const token = core.getInput('github-token', { required: true });

    // Get repository information from context
    const { owner, repo } = github.context.repo;

    core.info(`Converting PR #${prNumber} to draft in ${owner}/${repo}`);

    // Create GitHub client
    const octokit = github.getOctokit(token);

    // First, get the PR to check if it's already a draft and get its node ID
    const { data: pullRequest } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: parseInt(prNumber, 10),
    });

    if (pullRequest.draft) {
      core.info(`PR #${prNumber} is already a draft. No action needed.`);
      return;
    }

    // Get the PR node ID for GraphQL mutation
    const prNodeId = pullRequest.node_id;
    core.info(`PR node ID: ${prNodeId}`);

    // Use GraphQL mutation to convert PR to draft
    const mutation = `
      mutation($pullRequestId: ID!) {
        convertPullRequestToDraft(input: {pullRequestId: $pullRequestId}) {
          pullRequest {
            id
            number
            isDraft
          }
        }
      }
    `;

    const variables = {
      pullRequestId: prNodeId,
    };

    const result = await octokit.graphql(mutation, variables);

    if (result.convertPullRequestToDraft.pullRequest.isDraft) {
      core.info(`Successfully converted PR #${prNumber} to draft`);
    } else {
      core.setFailed(`Failed to convert PR #${prNumber} to draft`);
    }
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
