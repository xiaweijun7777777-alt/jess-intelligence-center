// 一次性脚本：从 digest.json 渲染 daily-brief.html（仅当日增量），复用现有内联样式
const fs = require('fs');
const DIR = 'C:/Users/MOVA/WorkBuddy/2026-07-30-16-24-33/regulation-workbench/';
const TODAY = '2026-10-11';

const db = JSON.parse(fs.readFileSync(DIR + 'assets/digest.json', 'utf8'));
const old = fs.readFileSync(DIR + 'daily-brief.html', 'utf8');

// 复用现有样式
const css = old.slice(old.indexOf('<style>') + 7, old.indexOf('</style>'));

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const BOARDS = [
  { key: 'regulations', id: 'b-regulations', icon: '§', name: '新法动态', bc: '#9b5de5' },
  { key: 'updates',     id: 'b-updates',     icon: '◈', name: '合规更新', bc: '#2dd4bf' },
  { key: 'industry',    id: 'b-industry',    icon: '◆', name: '行业动态', bc: '#f59e0b' },
  { key: 'geo',         id: 'b-geo',         icon: '◐', name: '地缘政治', bc: '#ef4444' },
  { key: 'cases',       id: 'b-cases',       icon: '⚖', name: '处罚案例', bc: '#ec4899' }
];

const todayItems = db.items.filter(e => e && e.item && e.item.date === TODAY);
const totalBy = {}, newBy = {};
BOARDS.forEach(b => { totalBy[b.key] = 0; newBy[b.key] = 0; });
db.items.forEach(e => { if (totalBy[e.key] != null) totalBy[e.key]++; });
todayItems.forEach(e => { if (newBy[e.key] != null) newBy[e.key]++; });

function card(e) {
  const it = e.item;
  const chips = [];
  if (it.country) chips.push(esc(it.country));
  if (it.region && it.region !== it.country) chips.push(esc(it.region));
  const t = it.type || it.category || it.topic || '';
  if (t) chips.push(esc(t));
  if (e.key === 'geo' && it.impact) chips.push('影响 ' + esc(it.impact));
  if (e.key === 'cases' && it.penaltyType) chips.push(esc(it.penaltyType));
  if (e.key === 'cases' && it.amount) chips.push(esc(it.amount));
  chips.push(esc(it.sourceType));
  return '<article class="card is-new" data-date="' + esc(it.date) + '">' +
    '<div class="card-top"><span class="badge-new">NEW</span><span class="date">' + esc(it.date) + '</span></div>' +
    '<h3 class="title">' + esc(it.title) + '</h3>' +
    '<div class="chips">' + chips.map(c => '<span class="chip">' + c + '</span>').join('') + '</div>' +
    '<p class="summary">' + esc(it.summary) + '</p>' +
    '<div class="card-foot"><a class="src" href="' + esc(it.url) + '" target="_blank" rel="noopener">' +
    esc(it.source) + ' ↗</a><span class="verify">' + esc(it.verified || '待确认') + '</span></div></article>';
}

let out = '<!doctype html>\n<html lang="zh-CN">\n<head>\n';
out += '<meta charset="utf-8" />\n';
out += '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />\n';
out += '<meta name="theme-color" content="#07060d" />\n';
out += '<title>每日情报简报 · ' + TODAY + '</title>\n';
out += '<style>' + css + '</style>\n</head>\n<body>\n';
out += '<header class="top"><div class="wrap">\n';
out += '  <div class="brand">\n    <h1>Jess\' Intelligence Center</h1>\n';
out += '    <span class="sub">智能机器人行业法规情报</span>\n  </div>\n';
out += '  <div class="stat">数据截至 <span class="hl">' + TODAY + '</span> · 共 <b>' + db.items.length +
       '</b> 条 · 今日新增 <b>' + todayItems.length + '</b> 条</div>\n';
out += '  <nav class="navbar">' + BOARDS.map(b =>
  '<a class="nav-chip" href="#' + b.id + '" style="--bc:' + b.bc + '">' + b.icon + ' ' + b.name +
  '<i>' + totalBy[b.key] + ' (+' + newBy[b.key] + ')</i></a>').join('') + '</nav>\n';
out += '</div></header>\n<main class="wrap">';

BOARDS.forEach(b => {
  const list = todayItems.filter(e => e.key === b.key);
  out += '<section class="board" id="' + b.id + '" style="--bc:' + b.bc + '">';
  out += '<header class="board-head"><span class="bi">' + b.icon + '</span><h2>' + b.name +
         '</h2><span class="count">' + totalBy[b.key] + '</span><span class="count new">+' +
         newBy[b.key] + '</span></header><div class="cards">';
  out += list.length ? list.map(card).join('') :
         '<div class="empty">今日暂无更新</div>';
  out += '</div></section>';
});

out += '</main>\n<footer class="wrap">\n  离线自包含页面 · 数据已内联，无需联网即可阅读<br/>\n  条目状态均为「待确认」，请以官方来源原文为准\n</footer>\n';
out += '<button class="totop" id="totop" aria-label="回到顶部">↑</button>\n';
out += '<script>\nvar t=document.getElementById(\'totop\');\naddEventListener(\'scroll\',function(){t.classList.toggle(\'show\',scrollY>600)},{passive:true});\nt.onclick=function(){scrollTo({top:0,behavior:\'smooth\'})};</script>\n';
out += '</body>\n</html>\n';

fs.writeFileSync(DIR + 'daily-brief.html', out, 'utf8');

// 校验
const arts = (out.match(/<article/g) || []).length;
console.log('渲染完成:', DIR + 'daily-brief.html');
console.log('长度:', out.length, '| article:', arts, '| 今日条目:', todayItems.length);
['color-mix', 'nav-chip', 'backdrop-filter', 'badge-new', 'totop'].forEach(k =>
  console.log('  含', k, ':', out.includes(k)));
console.log('标题:', (out.match(/<title>(.*?)<\/title>/) || [])[1]);
