/**
 * Appends a Robot-style job summary to GITHUB_STEP_SUMMARY from Playwright's JSON report.
 * @see https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions#adding-a-job-summary
 */
import fs from 'node:fs';
import path from 'node:path';

const reportPath = process.argv[2] ?? path.join('test-results', 'report.json');
const summaryPath = process.env.GITHUB_STEP_SUMMARY;
const title =
  process.env.PLAYWRIGHT_SUMMARY_TITLE?.trim() || 'Playwright test summary';

function escapeBackticks(s) {
  return String(s).replace(/`/g, "'");
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

function main() {
  if (!summaryPath) {
    console.warn(
      'GITHUB_STEP_SUMMARY is not set; skipping job summary (expected in GitHub Actions only).',
    );
    return;
  }

  let report;
  try {
    const raw = fs.readFileSync(reportPath, 'utf8');
    report = JSON.parse(raw);
  } catch {
    fs.appendFileSync(
      summaryPath,
      `### ${title}\n\n_Report not found or invalid at \`${reportPath}\`._\n\n`,
    );
    return;
  }

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

  lines.push('\n_Job summary generated from Playwright JSON report._\n');

  fs.appendFileSync(summaryPath, lines.join('\n'));
}

main();
