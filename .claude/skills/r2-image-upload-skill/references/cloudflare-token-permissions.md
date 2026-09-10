# Cloudflare API Token Permissions

Students can use either `wrangler login` (OAuth, easiest) or a custom API token (persistent, recommended for long-term use). This doc covers the API token approach since it gives explicit control over permissions.

## Creating the Token

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click **Create Token**
3. Start from the **Custom token** template (not one of the presets — they're too narrow)

## Required Permissions

Only grant what this skill actually needs:

### Account Permissions

| Permission | Access | What it covers |
|------------|--------|----------------|
| Workers R2 Storage | Edit | Create/list buckets, upload/delete objects, manage public access |
| Account Settings | Read | Let wrangler read account info (`wrangler whoami`) |

### Account Resources

Set to **Include → your account**.

That's it. No zone permissions needed for image uploads.

## Setting the Token

After creating the token, Cloudflare shows it once. Save it in a `.env` file in your project root:

```
# .env (project root — wrangler reads this automatically)
CLOUDFLARE_API_TOKEN=your_token_here
```

Make sure `.env` is in your `.gitignore` (the skill creates both automatically on first run).

Verify it works:

```bash
wrangler whoami
```

## `wrangler login` vs API Token

| | `wrangler login` | API Token |
|---|---|---|
| Setup | One command | Dashboard + .env file |
| Scope | Full account access | Only what you grant |
| Persistence | Can expire / need re-auth | Permanent until revoked |
| Best for | Quick start, solo dev | Long-term use, multiple projects |

**For the course:** Start with `wrangler login` for simplicity. If auth expires or you want persistent credentials, create an API token and drop it in `.env`.

## Troubleshooting

**"Authentication error [code: 10000]"** — The token is missing a required permission. Make sure you have "Workers R2 Storage: Edit" at the Account level.

**"Unable to retrieve email"** — This is normal with API tokens. It doesn't affect functionality.

**R2 uploads return 403** — The token needs "Workers R2 Storage: Edit" at the Account level (not zone level). If using "Object Read & Write" alone, it may not be enough — use the broader "Workers R2 Storage: Edit".
