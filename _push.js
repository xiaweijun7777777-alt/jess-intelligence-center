// 一次性脚本：提交 + 令牌化 URL 推送到 GitHub Pages（令牌绝不写入 .git/config）
const fs = require('fs');
const { execSync } = require('child_process');

const REPO = 'C:/Users/MOVA/WorkBuddy/2026-07-30-16-24-33/regulation-workbench';
const GIT = 'C:/Users/MOVA/.workbuddy/binaries/PortableGit/versions/1.2.0/cmd/git.exe';
const PAT_FILE = 'C:/Users/MOVA/WorkBuddy/2026-07-30-16-24-33/.workbuddy/secrets/gh_pages_pat.txt';
const TODAY = '2026-10-11';

function run(cmd, opts) {
  try {
    const out = execSync(cmd, Object.assign({ encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }, opts || {}));
    return { code: 0, out: (out || '').trim() };
  } catch (e) {
    return { code: e.status == null ? -1 : e.status, out: ((e.stdout || '') + (e.stderr || '')).trim() };
  }
}

console.log('--- status ---');
console.log(run(`"${GIT}" -C "${REPO}" status --porcelain`).out || '(clean)');

console.log('--- add ---');
console.log('rc=' + run(`"${GIT}" -C "${REPO}" add -A`).code);

const c = run(`"${GIT}" -C "${REPO}" commit -q -m "daily intel auto-update ${TODAY}"`);
console.log('--- commit --- rc=' + c.code + (c.out ? ' :: ' + c.out.slice(0, 300) : ''));

let pat = '';
try { pat = fs.readFileSync(PAT_FILE, 'utf8').trim(); } catch (e) { pat = ''; }
if (!pat) { console.log('!! PAT 缺失或为空，跳过推送'); process.exit(2); }
console.log('--- PAT --- len=' + pat.length + ' (内容不输出)');

const remote = `https://x-access-token:${pat}@github.com/xiaweijun7777777-alt/jess-intelligence-center.git`;
const p = run(`"${GIT}" -c credential.helper= -C "${REPO}" push "${remote}" master`);
// 输出中抹掉令牌
const safe = p.out.replace(/x-access-token:[^@]+@/g, 'x-access-token:***@');
console.log('--- push --- rc=' + p.code);
console.log(safe.slice(0, 800));

console.log('--- HEAD ---');
console.log(run(`"${GIT}" -C "${REPO}" --no-pager log --oneline -1`).out);
process.exit(p.code);
