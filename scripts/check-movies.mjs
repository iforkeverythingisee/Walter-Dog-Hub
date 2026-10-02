import fs from 'node:fs';
import path from 'node:path';

const HUB = path.join(process.cwd(), 'Hub.html');
const html = fs.readFileSync(HUB, 'utf8');

const start = html.indexOf('const moviesList = [');
const end = html.indexOf('\n    ];', start);

if (start === -1 || end === -1) {
  console.error('check-movies: could not locate moviesList in Hub.html');
  process.exit(2);
}

const block = html.slice(start, end);
const entries = [...block.matchAll(/\{\s*title:\s*"([^"]*)",\s*url:\s*"([^"]*)"\s*\}/g)].map(
  ([, title, url]) => ({ title, url }),
);

const problems = [];

if (entries.length === 0) {
  problems.push('parsed 0 entries from moviesList');
}

const driveId = (url) => {
  const file = url.match(/\/file\/d\/([^/?#]+)/);
  if (file) return 'file:' + file[1];
  const folder = url.match(/\/folders\/([^/?#]+)/);
  if (folder) return 'folder:' + folder[1];
  return null;
};

const byId = new Map();
for (const entry of entries) {
  const id = driveId(entry.url);
  if (!id) continue;
  if (!byId.has(id)) byId.set(id, []);
  byId.get(id).push(entry.title);
}
for (const [id, titles] of byId) {
  if (titles.length > 1) {
    problems.push(
      `duplicate Drive id ${id.slice(5, 20)}... is used by ${titles.length} entries: ${titles
        .map((t) => `"${t}"`)
        .join(', ')}`,
    );
  }
}

const byTitle = new Map();
for (const entry of entries) {
  const key = entry.title.trim().toLowerCase();
  byTitle.set(key, (byTitle.get(key) || 0) + 1);
}
for (const [title, n] of byTitle) {
  if (n > 1) problems.push(`duplicate title "${title}" appears ${n} times`);
}

for (const entry of entries) {
  if (entry.title !== entry.title.trim()) {
    problems.push(`title has leading/trailing whitespace: ${JSON.stringify(entry.title)}`);
  }
  if (!/^https:\/\/drive\.google\.com\//.test(entry.url)) {
    problems.push(`unexpected url for "${entry.title}": ${entry.url}`);
  }
  if (!entry.url.trim()) {
    problems.push(`empty url for "${entry.title}"`);
  }
}

if (problems.length) {
  console.error(`check-movies: FAILED (${problems.length} problem${problems.length === 1 ? '' : 's'})\n`);
  problems.forEach((p) => console.error('  - ' + p));
  process.exit(1);
}

console.log(`check-movies: OK - ${entries.length} movies, no duplicate ids, no duplicate titles, no stray whitespace.`);
