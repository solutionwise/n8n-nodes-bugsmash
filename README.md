# n8n-nodes-bugsmash

This is an n8n community node for [BugSmash](https://bugsmash.io/) — a visual feedback and bug reporting tool for websites and web apps.

It allows you to trigger n8n workflows automatically when feedback events occur in BugSmash, such as new comments, status changes, and replies.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

Or install directly:

```
n8n-nodes-bugsmash
```

## Included Nodes

### BugSmash Trigger

Starts a workflow when a BugSmash event occurs. Supports:

- **New Comment** — fires when a new comment is created on a project
- **Comment Replied** — fires when a reply is added to an existing comment
- **Comment Updated** — fires when a comment is edited
- **Status Changed** — fires when the status of a comment changes

You can optionally filter events by a specific project.

## Credentials

You will need a **BugSmash API** credential with:

| Field | Description |
|---|---|
| API Key | Your BugSmash API key (found in Settings → Integrations) |
| Base URL | Your BugSmash instance URL. Default: `https://api.bugsmash.io/` |

### How to get your API key

1. Log in to [BugSmash](https://app.bugsmash.io/)
2. Go to **Settings → Integrations → n8n**
3. Copy your API key

## Example Workflow

A typical use case: receive a BugSmash event and send a Slack notification.

1. Add **BugSmash Trigger** node, select event `New Comment`
2. (Optional) Select a specific project to filter by
3. Activate the workflow — BugSmash will register a webhook automatically
4. Connect a **Slack** node to send the comment data to your team channel

The trigger output includes the full event payload from BugSmash (comment content, author, project, URL, etc.).

## Compatibility

Tested with n8n version 1.x and above.

## Resources

- [BugSmash website](https://bugsmash.io/)
- [BugSmash API docs](https://api.bugsmash.io/)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
