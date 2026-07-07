# Argus Website

Public website for Argus, a student-built 1U CubeSat mission from Carnegie
Mellon University and Instituto Superior Técnico. The site explains the
mission, spacecraft design, visual orbit-determination payload, team, and
open-source subsystem repositories.

The production site is published at
[cmu-argus-2.github.io/website](https://cmu-argus-2.github.io/website/).

## Development

The site is a statically exported Next.js application. Node.js 22 is used in
CI.

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. Before submitting a change, run:

```bash
npm run lint
npm run build
```

To reproduce the GitHub Pages project-path build locally:

```bash
NEXT_PUBLIC_BASE_PATH=/website \
NEXT_PUBLIC_SITE_URL=https://cmu-argus-2.github.io/website \
npm run build
```

The static export is written to `out/`.

## Deployment

Pushing to `main` runs [the GitHub Pages workflow](.github/workflows/deploy.yml).
It derives the repository base path, builds the static export, and deploys it
through GitHub Actions. The repository's Pages source must be set to
**GitHub Actions**.

## License

The website source code is available under the [MIT License](LICENSE).

Institutional names and marks, the Argus mission patch, photographs, videos,
3D spacecraft models, and other media in `public/` are not granted under the
MIT License. They remain subject to the rights of their respective owners and
may not be reused without permission.
