# Installing Wrangler

Walk the student through this step by step. After each step, verify it worked before moving on.

## 1. Check Node.js

Wrangler requires Node.js 18+.

```bash
node --version
```

If missing or below v18, tell the student to install Node.js from https://nodejs.org (LTS version).

## 2. Install Wrangler

Install globally:

```bash
npm install -g wrangler
```

Or if the student prefers not to install globally, they can use npx — but global is simpler for repeated use.

Verify installation:

```bash
wrangler --version
```

## 3. Authenticate

```bash
wrangler login
```

This opens a browser. The student:
1. Logs into their Cloudflare account (or creates one — free plan works)
2. Grants wrangler access
3. Returns to the terminal

Credentials are stored locally by wrangler — no API keys end up in the project.

Verify:

```bash
wrangler whoami
```

Should show their account name and ID.

## 4. Troubleshooting

**"command not found: wrangler"** — Node's global bin directory isn't in PATH. Try:
```bash
npx wrangler --version
```
If that works, suggest using `npx wrangler` as a prefix for all commands, or fix their PATH.

**Permission errors on npm install -g** — Common on macOS. Fix with:
```bash
sudo npm install -g wrangler
```
Or better, configure npm to use a local directory: `npm config set prefix ~/.npm-global` and add `~/.npm-global/bin` to PATH.

**Login fails or times out** — Check if a browser opened. If they're on a remote/headless machine, they can use an API token instead. See `references/cloudflare-token-permissions.md` for the full list of permissions to set.

**Want persistent auth?** — `wrangler login` can expire. For long-term use, create an API token (see `references/cloudflare-token-permissions.md`) and add it to your project's `.env` file:
```
CLOUDFLARE_API_TOKEN=your_token_here
```
Wrangler reads `.env` automatically — no shell restart needed.
