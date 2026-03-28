/**
 * Appends a Robot-style job summary to GITHUB_STEP_SUMMARY from Playwright JSON report(s).
 * Single file: node scripts/write-playwright-job-summary.mjs [path/to/report.json]
 * Merged (CI): node scripts/write-playwright-job-summary.mjs --dir path/to/root
 *   (finds every report.json under that tree — e.g. one subfolder per downloaded artifact)
 * @see https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions#adding-a-job-summary
 */
import fs from 'node:fs';
import path from 'node:path';

const summaryPath = process.env.GITHUB_STEP_SUMMARY;
const title =
  process.env.PLAYWRIGHT_SUMMARY_TITLE?.trim() || 'Playwright test summary';

function escapeBackticks(s) {
  return String(s).replace(/`/g, "'");
}

/** @returns {{ mode: 'dir', dir: string } | { mode: 'files', files: string[] }} */
function parseArgs() {
  const argv = process.argv.slice(2);
  if (argv[0] === '--dir' && argv[1]) {
    return { mode: 'dir', dir: argv[1] };
  }
  if (argv.length > 0) {
    return { mode: 'files', files: argv };
  }
  return { mode: 'files', files: [path.join('test-results', 'report.json')] };
}

/** @param {string} rootDir @returns {string[]} */
function findReportJsonFiles(rootDir) {
  const results = [];
  function walk(d) {
    let entries;
    try {
      entries = fs.readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (ent.name === 'report.json') results.push(p);
    }
  }
  walk(rootDir);
  return results.sort();
}

/** @param {object[]} reports */
function mergeReports(reports) {
  const merged = {
    stats: {
      duration: 0,
      expected: 0,
      skipped: 0,
      unexpected: 0,
      flaky: 0,
    },
    suites: [],
    errors: [],
  };
  for (const r of reports) {
    const s = r.stats ?? {};
    merged.stats.duration += s.duration ?? 0;
    merged.stats.expected += s.expected ?? 0;
    merged.stats.skipped += s.skipped ?? 0;
    merged.stats.unexpected += s.unexpected ?? 0;
    merged.stats.flaky += s.flaky ?? 0;
    merged.suites.push(...(r.suites ?? []));
    merged.errors.push(...(r.errors ?? []));
  }
  merged._sourceReportCount = reports.length;
  return merged;
}

/** @param {unknown} suite @param {string[]} prefixParts @param {Array<{ title: string; project: string; status: string }>} out */
function collectFromSuite(suite, prefixParts, out) {
  if (!suite || typeof suite !== 'object') return;
  const s = /** @type {{ title?: string; specs?: unknown[]; suites?: unknown[] }} */ (
    suite
  );
  const parts = s.title ? [...prefixParts, s.title] : [...prefixParts];
  for (const spec of s.specs ?? []) {
    if (!spec || typeof spec !== 'object') continue;
    const sp = /** @type {{ title?: string; tests?: unknown[] }} */ (spec);
    const titleParts = [...parts, sp.title].filter(Boolean);
    const fullTitle = titleParts.join(' › ');
    for (const t of sp.tests ?? []) {
      if (!t || typeof t !== 'object') continue;
      const test = /** @type {{ projectName?: string; status?: string }} */ (t);
      out.push({
        title: fullTitle,
        project: test.projectName ?? '',
        status: test.status ?? 'unexpected',
      });
    }
  }
  for (const child of s.suites ?? []) collectFromSuite(child, parts, out);
}

/** @param {object} report */
function appendSummary(report) {
  const stats = report.stats ?? {};
  const expected = stats.expected ?? 0;
  const flaky = stats.flaky ?? 0;
  const unexpected = stats.unexpected ?? 0;
  const skipped = stats.skipped ?? 0;
  const passed = expected + flaky;
  const failed = unexpected;
  const total = passed + failed + skipped;
  const passrate = total > 0 ? ((100 * passed) / total).toFixed(1) : '100.0';
  const durationSec = ((stats.duration ?? 0) / 1000).toFixed(1);

  /** @type {Array<{ title: string; project: string; status: string }>} */
  const tests = [];
  for (const root of report.suites ?? []) collectFromSuite(root, [], tests);

  const passing = tests.filter((t) => t.status === 'expected' || t.status === 'flaky');
  const failing = tests.filter((t) => t.status === 'unexpected');
  const skippedList = tests.filter((t) => t.status === 'skipped');

  const lines = [];
  lines.push(`### ${title}\n`);
  lines.push('| Metric | Value |');
  lines.push('|--------|-------|');
  lines.push(`| ✅ Passed | ${passed} |`);
  lines.push(`| ❌ Failed | ${failed} |`);
  lines.push(`| ⏩ Skipped | ${skipped} |`);
  lines.push(`| **Total** | **${total}** |`);
  lines.push(`| **Pass rate %** | **${passrate}** |`);
  lines.push(`| **Duration (sec)** | **${durationSec}** |`);
  lines.push('');

  if (report.errors?.length) {
    lines.push('> ⚠️ Run-level errors were reported; see logs and the HTML report.\n');
  }

  function detailsSection(emojiLabel, items, flakyNote = false) {
    const label = emojiLabel;
    const count = items.length;
    lines.push(`<details>`);
    lines.push(`<summary><strong>${label}</strong> (${count})</summary>\n`);
    if (count === 0) {
      lines.push('_None._\n');
    } else {
      for (const t of items) {
        const suffix =
          flakyNote && t.status === 'flaky' ? ' _(flaky)_' : '';
        const proj = t.project ? ` _[${escapeBackticks(t.project)}]_` : '';
        lines.push(`- \`${escapeBackticks(t.title)}\`${proj}${suffix}`);
      }
      lines.push('');
    }
    lines.push(`</details>\n`);
  }

  detailsSection('✅ Passing tests', passing, true);
  detailsSection('❌ Failing tests', failing, false);
  detailsSection('⏩ Skipped tests', skippedList, false);

  const sourceCount = report._sourceReportCount ?? 1;
  lines.push(
    sourceCount > 1
      ? `\n_Summary merged from ${sourceCount} suite reports._\n`
      : '\n_Job summary generated from Playwright JSON report._\n',
  );

  fs.appendFileSync(summaryPath, lines.join('\n'));
}

function main() {
  if (!summaryPath) {
    console.warn(
      'GITHUB_STEP_SUMMARY is not set; skipping job summary (expected in GitHub Actions only).',
    );
    return;
  }

  const parsed = parseArgs();
  /** @type {string[]} */
  let reportPaths = [];
  if (parsed.mode === 'dir') {
    reportPaths = findReportJsonFiles(parsed.dir);
    if (reportPaths.length === 0) {
      fs.appendFileSync(
        summaryPath,
        `### ${title}\n\n_No Playwright JSON reports found under \`${parsed.dir}\` (missing or failed artifact download)._\n\n`,
      );
      return;
    }
  } else {
    reportPaths = parsed.files.filter((f) => {
      try {
        return fs.statSync(f).isFile();
      } catch {
        return false;
      }
    });
    if (reportPaths.length === 0) {
      const hint = parsed.files.join(', ');
      fs.appendFileSync(
        summaryPath,
        `### ${title}\n\n_Report not found or invalid: ${hint}_\n\n`,
      );
      return;
    }
  }

  const reports = [];
  for (const fp of reportPaths) {
    try {
      reports.push(JSON.parse(fs.readFileSync(fp, 'utf8')));
    } catch {
      fs.appendFileSync(
        summaryPath,
        `### ${title}\n\n_Invalid JSON in \`${fp}\`._\n\n`,
      );
      return;
    }
  }

  const report = mergeReports(reports);
  appendSummary(report);
}

main();
