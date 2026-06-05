# CSP Configuration — Decision Record

---

## Environment Split (`isDev`)

### Decision

Use two separate CSP profiles:

- Loose CSP in development
- Strict CSP in production

### Why

The Next.js development server requires capabilities that are legitimate security risks in production:

- `unsafe-eval` for React error overlays
- Hot Module Reloading (HMR)
- WebSocket connections for live updates

A single CSP that supports both environments would be insecure in production.

### Tradeoff

Development CSP may provide false confidence.

Code can work locally but fail in production if it depends on capabilities only permitted in development, such as:

```js
eval(...)
```

introduced by a dependency.

### Possible Issue

Ensure `NODE_ENV` is set correctly during build and runtime.

Some deployment pipelines default to development mode.

Verify production deployments explicitly use:

```bash
NODE_ENV=production
```

---

## `default-src 'self'`

### Decision

Use same-origin resources as the fallback for all unspecified directives.

```text
default-src 'self'
```

### Why

Acts as a catch-all.

Any resource not covered by a more specific directive falls back here, including:

- Fetch requests
- Frames
- Fonts
- Media
- Workers

This prevents forgotten directives from silently allowing external resource loading.

### Tradeoff

Third-party resources will fail until explicitly allowlisted.

Examples:

- CDN-hosted fonts
- Analytics services
- Error tracking platforms

### Possible Issue

Web Workers created via:

```js
new Worker(new URL(...))
```

are governed by `worker-src`, which inherits from `default-src`.

If Turbopack emits workers from:

- A different origin
- A `blob:` URL

worker loading may fail in production.

If that occurs, add:

```text
worker-src 'self' blob:
```

---

## `script-src 'self' 'unsafe-inline'` (Production)

### Decision

Allow inline scripts in all environments.

Allow `unsafe-eval` only in development.

Production:

```text
script-src 'self' 'unsafe-inline'
```

Development:

```text
script-src 'self' 'unsafe-inline' 'unsafe-eval'
```

### Why

Next.js injects inline scripts for:

- Hydration data
- Route prefetching

Removing `unsafe-inline` would require a nonce-based CSP implementation, which introduces additional Next.js configuration complexity.

### Tradeoff

This is the weakest part of the policy.

`unsafe-inline` permits execution of injected script tags:

```html
<script>
  ...
</script>
```

which is a primary XSS vector.

This CSP primarily protects against:

- External script loading

It does **not** provide strong protection against XSS.

### Possible Issue

If stronger XSS protection becomes necessary, migrate to a nonce-based CSP.

Example:

```text
script-src 'self' 'nonce-xyz'
```

Modern Next.js versions (15+) support this through middleware and nonce generation.

This is recommended if the dashboard is ever exposed to multiple users.

---

## `style-src 'self' 'unsafe-inline'`

### Decision

Allow inline styles in all environments.

```text
style-src 'self' 'unsafe-inline'
```

### Why

Required by common frontend patterns:

- CSS-in-JS
- Inline `style=""` attributes
- Next.js style injection

Removing it would require auditing and eliminating all inline styling.

### Tradeoff

Allows CSS injection attacks.

Potential abuse includes:

```css
background: url(...);
```

for limited data exfiltration.

Risk is lower than script injection but still exists.

### Possible Issue

If the application eventually uses only:

- CSS Modules
- Static stylesheets

and eliminates inline styles entirely, the policy can be tightened to:

```text
style-src 'self'
```

---

## `img-src 'self' data:`

### Decision

Allow:

- Same-origin images
- Base64/data URI images

```text
img-src 'self' data:
```

### Why

Some libraries rely on:

- Data URI icons
- Inline SVG assets

Removing `data:` can break these patterns unexpectedly.

### Tradeoff

Data URIs can be abused in XSS scenarios to exfiltrate small payloads through image requests.

This risk is reduced because production also uses:

```text
connect-src 'none'
```

which blocks outbound network requests.

### Possible Issue

If external image resources are introduced later, allowlist only the required origin.

Example:

```text
img-src 'self' https://cdn.example.com
```

Avoid broad rules such as:

```text
img-src *
```

---

## `connect-src 'none'` (Production)

### Decision

Block all network connections in production.

Production:

```text
connect-src 'none'
```

Development:

```text
connect-src 'self' ws: wss:
```

### Why

The dashboard is intentionally offline.

Its privacy guarantee:

> No data leaves your machine.

is enforced by the browser through CSP rather than relying solely on application logic.

### Tradeoff

Future network-dependent features will fail in production unless explicitly allowed.

Examples:

- Remote catalog downloads
- Telemetry
- Update checks
- External APIs

These failures may appear silent to users unless CSP violations are surfaced.

### Possible Issue

Development currently permits:

```text
ws:
wss:
```

which allows WebSocket connections to any host.

Acceptable for local development, but stricter hygiene could use:

```text
connect-src 'self' ws://localhost:* wss://localhost:*
```

---

## `object-src 'none'`

### Decision

Block all plugin-style embedded content.

```text
object-src 'none'
```

### Why

Prevents use of legacy technologies such as:

- Flash
- Java Applets
- Browser plugins
- Embedded executable content

There is no legitimate requirement for these in a modern Next.js application.

### Tradeoff

None.

This is a straightforward security improvement.

### Possible Issue

Current configuration includes an unnecessary trailing semicolon:

```js
"object-src 'none';";
```

Because directives are later joined with:

```js
csp.join("; ");
```

the final header contains:

```text
object-src 'none';;
```

Browsers ignore this, so functionality is unaffected.

For correctness and consistency, use:

```js
"object-src 'none'";
```

instead.
