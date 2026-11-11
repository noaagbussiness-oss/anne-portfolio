# Anne Portfolio — GitHub-Only CMS Edition

A database-free personal portfolio + private GitHub-powered admin system built for GitHub Pages.

## What is included

- Premium dark / neon / glassmorphism public UI.
- Anne's profile, education, skills, projects, achievements, goals and contact information.
- Dynamic project gallery driven by `data/projects.json`.
- Dynamic category filters driven by `data/categories.json`.
- GitHub-only private admin console at `/admin/`.
- Multi-media project support: upload multiple images/videos per project.
- Project create, edit, delete, publish, feature and category management.
- Site settings editable from the admin console.
- No database, PHP, Supabase or paid server required.

## GitHub Pages setup

1. Create a public repository, for example `anne-portfolio`.
2. Upload the contents of this ZIP to the repository root.
3. Open **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Select branch `main` and folder `/(root)`.
6. Save and wait for GitHub Pages to deploy.

Your public URL will look like:

`https://YOUR-USERNAME.github.io/anne-portfolio/`

Admin URL:

`https://YOUR-USERNAME.github.io/anne-portfolio/admin/`

## Admin connection

Create a GitHub fine-grained personal access token restricted to the portfolio repository.

Required repository permission:

- **Contents → Read and write**

Open `/admin/` and enter:

- GitHub owner
- Repository name
- Branch (`main`)
- Fine-grained token

The token is stored only in browser session storage and is not written to the repository.

## Main content files

- `index.html` — public portfolio structure
- `style.css` — existing premium visual system
- `script.js` — public interactions and dynamic gallery
- `data/projects.json` — project entries
- `data/categories.json` — project categories
- `data/site.json` — contact and public site settings
- `admin/` — GitHub-only CMS
- `images/` — profile and starter project media

## Starter projects

The included project data is based on Anne's current portfolio:

- Ravana Hela Katha
- Anne's Gaming World
- Advertisement & Client Work

Use the admin console to replace the starter project media with higher-resolution original work whenever available.
