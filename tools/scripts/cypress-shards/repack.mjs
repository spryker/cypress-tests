#!/usr/bin/env node
// Repack the Cypress shard manifest from a pasted run summary.
//
// Usage (from any cwd):
//   pbpaste | npm --prefix tests/cypress-tests run cy:repack
//   pbpaste | npm --prefix tests/cypress-tests run cy:repack -- --shards=3
//   pbpaste | npm --prefix tests/cypress-tests run cy:repack -- --add-missing=60
//   pbpaste | npm --prefix tests/cypress-tests run cy:repack -- --dry-run
//
// The script reads a Cypress results table from stdin, parses spec paths +
// runtimes, runs LPT bin-packing into N shards, and writes the manifest to
// .github/workflows/cypress/shards.json at the repo root.
//
// It refuses to write if the paste does not exactly match the filesystem
// (cypress/e2e/**/*.cy.ts, excluding smoke/ and ssp* — same filter as CI).
// Pass --add-missing=<seconds> to estimate specs that are present in the
// filesystem but absent from the paste (used for bootstrap or when new specs
// were added since the last full run).

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '../../../../..');
const MANIFEST_PATH = join(REPO_ROOT, '.github/workflows/cypress/shards.json');
const CYPRESS_E2E_DIR = join(REPO_ROOT, 'tests/cypress-tests/cypress/e2e');

const argv = process.argv.slice(2);
const getArg = (name) => {
    const found = argv.find((a) => a.startsWith(`--${name}=`));
    return found ? found.slice(name.length + 3) : null;
};

const numShards = parseInt(getArg('shards') ?? '3', 10);
const addMissingRaw = getArg('add-missing');
const addMissingSec = addMissingRaw != null ? parseInt(addMissingRaw, 10) : null;
const dryRun = argv.includes('--dry-run');

function listFilesystemSpecs() {
    const out = [];
    const walk = (dir, prefix) => {
        for (const entry of readdirSync(dir)) {
            const full = join(dir, entry);
            const rel = prefix ? `${prefix}/${entry}` : entry;
            if (statSync(full).isDirectory()) {
                if (entry === 'smoke') continue;
                walk(full, rel);
            } else if (entry.endsWith('.cy.ts') && !entry.startsWith('ssp')) {
                out.push(`cypress/e2e/${rel}`);
            }
        }
    };
    walk(CYPRESS_E2E_DIR, '');
    return out.sort();
}

function parsePaste(text) {
    const lines = text.split('\n');
    const specs = [];
    let pending = null;

    const cleanLine = (l) =>
        l
            .replace(/^[─-╿\s]+/, '')
            .replace(/[─-╿\s]+$/, '');

    for (const raw of lines) {
        const clean = cleanLine(raw);
        if (!clean) continue;

        const m = clean.match(/^✔\s+(\S.*?)\s+(\d{1,2}:\d{2})\s+\d/);
        if (m) {
            if (pending) specs.push(pending);
            const [, path, time] = m;
            const [min, sec] = time.split(':').map(Number);
            pending = { path: path.trim(), seconds: min * 60 + sec };
            continue;
        }

        if (pending && !clean.includes('✔') && /^[a-z0-9_./-]+$/i.test(clean)) {
            pending.path = pending.path + clean;
        }
    }
    if (pending) specs.push(pending);

    return specs
        .filter((s) => s.path.endsWith('.cy.ts') && s.path.includes('/'))
        .map((s) => ({ path: `cypress/e2e/${s.path}`, seconds: s.seconds }));
}

function lptPack(specs, n) {
    const sorted = [...specs].sort((a, b) => b.seconds - a.seconds);
    const shards = Array.from({ length: n }, () => ({ specs: [], total: 0 }));

    for (const spec of sorted) {
        let minIdx = 0;
        for (let i = 1; i < n; i++) {
            if (shards[i].total < shards[minIdx].total) minIdx = i;
        }
        shards[minIdx].specs.push(spec.path);
        shards[minIdx].total += spec.seconds;
    }

    return shards;
}

function formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
}

function main() {
    const stdin = readFileSync(0, 'utf8');
    if (!stdin.trim()) {
        console.error('Error: no input on stdin. Paste the Cypress results table.');
        console.error('Example: pbpaste | npm run cy:repack');
        process.exit(1);
    }

    const parsed = parsePaste(stdin);
    console.error(`Parsed ${parsed.length} specs from paste.`);

    const filesystem = new Set(listFilesystemSpecs());
    console.error(`Filesystem has ${filesystem.size} core specs (excluding smoke/, ssp*).`);

    const parsedSet = new Set(parsed.map((s) => s.path));
    const missing = [...filesystem].filter((s) => !parsedSet.has(s));
    const extra = parsed.filter((s) => !filesystem.has(s.path));

    if (extra.length) {
        console.error('\nError: paste contains specs not in the filesystem:');
        for (const s of extra) console.error(`  - ${s.path}`);
        console.error('\nThe paste may be stale or from a different branch.');
        process.exit(1);
    }

    if (missing.length) {
        if (addMissingSec == null || Number.isNaN(addMissingSec)) {
            console.error(`\nError: filesystem has ${missing.length} specs not in the paste:`);
            for (const m of missing) console.error(`  + ${m}`);
            console.error('\nRe-run cypress with all specs and paste a fresh table,');
            console.error('or pass --add-missing=<seconds> to use a placeholder estimate.');
            process.exit(1);
        }
        console.error(
            `\nAdding ${missing.length} missing specs at ${addMissingSec}s each (placeholder).`,
        );
        for (const m of missing) parsed.push({ path: m, seconds: addMissingSec });
    }

    const packed = lptPack(parsed, numShards);
    const manifest = Object.fromEntries(
        packed.map((s, i) => [String(i + 1), s.specs.sort()]),
    );

    console.error('\nShard plan:');
    for (let i = 0; i < numShards; i++) {
        console.error(
            `  ${i + 1}: ${packed[i].specs.length} specs, ${formatDuration(packed[i].total)}`,
        );
    }

    if (dryRun) {
        console.error('\n(--dry-run set; not writing to disk.)');
        console.log(JSON.stringify(manifest, null, 4));
        return;
    }

    writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 4) + '\n');
    console.error(`\nWrote ${MANIFEST_PATH}`);
}

main();
