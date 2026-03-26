# How to Start and Run the Local BugSmash Node in n8n

Follow these steps to run the standalone BugSmash package in a local n8n instance.

## 1. Build the package

From `E:\n8n-nodes-bugsmash`, run:

```powershell
npm run build
```

## 2. Start isolated local n8n

Run:

```powershell
.\start_n8n_test.bat
```

This script:

- creates a clean staged extension package under `custom_ext_bugsmash_clean`
- uses an isolated n8n user folder at `%USERPROFILE%\.n8n_bugsmash_test`
- starts n8n on port `5680`

## 3. Open n8n

Open:

[http://localhost:5680](http://localhost:5680)

## 4. Test the node

In the canvas:

1. Click the **+** button
2. Search for **BugSmash**
3. Select **BugSmash Trigger**
4. Create a **BugSmash API** credential
5. Save and activate the workflow before testing production webhooks

## 5. Optional: test with ngrok

If you want external webhook delivery while testing locally:

```powershell
ngrok http 5680
```

Then restart n8n with `WEBHOOK_URL` set to your ngrok HTTPS URL before running `.\start_n8n_test.bat`.
