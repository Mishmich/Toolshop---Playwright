#!/usr/bin/env node
// Regenerates the dashboard index.html that lists every retained Playwright
// HTML report living under <siteDir>/runs/. Called by the CI publish job after
// a new run's report has been copied into place.
//
// Usage: node scripts/generate-report-index.mjs <siteDir>
import fs from 'node:fs';
import path from 'node:path';

const siteDir = process.argv[2];
if (!siteDir) {
  console.error('Usage: node scripts/generate-report-index.mjs <siteDir>');
  process.exit(1);
}

const runsDir = path.join(siteDir, 'runs');
if (!fs.existsSync(runsDir)) {
  console.error(`No runs directory found at ${runsDir}`);
  process.exit(1);
}

// Folder names are "<YYYY-MM-DD>_<zero-padded-run-number>_<short-sha>".
const runs = fs
  .readdirSync(runsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const [date, runNumber, sha] = entry.name.split('_');
    return {
      folder: entry.name,
      date: date ?? entry.name,
      runNumber: runNumber ? String(Number(runNumber)) : '?',
      sha: sha ?? '',
    };
  })
  // Newest first: the zero-padded run number sorts reliably as a string.
  .sort((a, b) => b.folder.localeCompare(a.folder));

const rows = runs
  .map(
    (run) => `        <li class="run">
          <a href="runs/${run.folder}/index.html">
            <span class="run-number">#${run.runNumber}</span>
            <span class="run-date">${run.date}</span>
            <span class="run-sha">${run.sha}</span>
          </a>
        </li>`,
  )
  .join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Playwright Report History</title>
    <style>
      :root { color-scheme: light dark; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        max-width: 760px;
        margin: 3rem auto;
        padding: 0 1rem;
        line-height: 1.5;
      }
      h1 { margin-bottom: 0.25rem; }
      p.subtitle { margin-top: 0; opacity: 0.7; }
      ul { list-style: none; padding: 0; }
      li.run { margin: 0.4rem 0; }
      li.run a {
        display: flex;
        gap: 1rem;
        align-items: baseline;
        padding: 0.75rem 1rem;
        border: 1px solid rgba(128, 128, 128, 0.3);
        border-radius: 8px;
        text-decoration: none;
        color: inherit;
      }
      li.run a:hover { border-color: rgba(128, 128, 128, 0.7); }
      .run-number { font-weight: 700; min-width: 4rem; }
      .run-date { opacity: 0.85; }
      .run-sha { margin-left: auto; font-family: ui-monospace, monospace; opacity: 0.6; }
    </style>
  </head>
  <body>
    <h1>Playwright Report History</h1>
    <p class="subtitle">${runs.length} report${runs.length === 1 ? '' : 's'} retained &middot; newest first</p>
    <ul>
${rows}
    </ul>
  </body>
</html>
`;

fs.writeFileSync(path.join(siteDir, 'index.html'), html);
console.log(`Wrote index.html listing ${runs.length} run(s).`);
