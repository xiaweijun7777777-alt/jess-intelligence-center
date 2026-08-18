/* ============================================================
   智能机器人法规情报工作台 — app.js (pixel UI, schema-driven)
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- BOARD SCHEMA ---------------- */
  // 顺序即导航顺序：新法动态(2nd) → 合规更新(3rd) → 行业动态 → 地缘政治 → 处罚案例
  const BOARDS = {
    updates: {
      label: "合规更新",
      icon: "✦",
      accent: "#a855f7",
      accent2: "#7c3aed",
      desc: "监管指引、机构解读、律所文章、新闻媒体等来源的合规动态，来源不限于官方。",
      requireOfficial: false,
      fields: {
        region:   { label: "地区/国家", type: "text" },
        category: { label: "更新类别", type: "select", options: ["监管指引","机构解读","律所文章","新闻动态","标准发布","其他"] },
        sourceType: { label: "来源类型", type: "select", options: ["官方发布","监管指引","机构解读","律所文章","新闻媒体","其他"] }
      }
    },
    regulations: {
      label: "新法动态",
      icon: "§",
      accent: "#22d3ee",
      accent2: "#0ea5b7",
      desc: "智能机器人行业相关法规（广告 / 产品 / 售后 / 消费者 / 数据 / 进出口等）。来源类型仅限官方发布。",
      requireOfficial: true,
      fields: {
        country:    { label: "国家/地区", type: "text" },
        type:       { label: "法规类型", type: "select", options: ["广告","产品","售后","消费者","数据","进出口","知识产权","其他"] },
        sourceType: { label: "来源类型", type: "select", options: ["官方发布"] }
      }
    },
    industry: {
      label: "行业动态",
      icon: "▦",
      accent: "#4ade80",
      accent2: "#16a34a",
      desc: "科技型企业的动态均可收录，不限于扫地机产品。",
      requireOfficial: false,
      fields: {
        region:   { label: "地区/国家", type: "text" },
        category: { label: "动态类别", type: "select", options: ["融资并购","产品发布","战略合作","财报业绩","人事变动","其他"] },
        sourceType: { label: "来源类型", type: "select", options: ["官方发布","新闻媒体","行业解读","其他"] }
      }
    },
    geo: {
      label: "地缘政治",
      icon: "⌖",
      accent: "#ff2bd6",
      accent2: "#ff7be0",
      desc: "影响智能机器人行业的地缘政治与国际贸易格局。",
      requireOfficial: false,
      fields: {
        region: { label: "涉及地区", type: "text" },
        topic:  { label: "议题", type: "select", options: ["出口管制","制裁","贸易战","供应链","数据主权","其他"] },
        impact: { label: "影响等级", type: "select", options: ["严重","中等","轻微"] },
        sourceType: { label: "来源类型", type: "select", options: ["官方发布","新闻媒体","智库报告","其他"] }
      }
    },
    cases: {
      label: "处罚案例",
      icon: "⚠",
      accent: "#ff5b4d",
      accent2: "#ff9a3c",
      desc: "科技型企业重要案件：反垄断、反倾销、出口管制、数据违规等。",
      requireOfficial: false,
      fields: {
        country: { label: "国家/地区", type: "text" },
        penaltyType: { label: "处罚类型", type: "select", options: ["反垄断","反倾销/反补贴","出口管制","数据违规","税务","消费者保护","其他"] },
        authority: { label: "执法机构", type: "text" },
        amount: { label: "处罚金额", type: "text" },
        sourceType: { label: "来源类型", type: "select", options: ["官方发布","新闻媒体","律所解读","其他"] }
      }
    }
  };

  const ORDER = ["regulations", "updates", "industry", "geo", "cases"];
  const STORE_KEY = "rw-data-v2";
  const SEEDVER_KEY = "rw-seedver-v1";
  const THEME_KEY = "rw-theme";
  const DATA_VERSION = (window.DATA_VERSION || 1);

  /* ---------------- STATE ---------------- */
  const state = {
    view: "home",
    board: null,
    search: "",
    filters: {},      // boardKey -> { fieldKey: Set(values) }
    data: {},
    editing: null     // item being edited (null = new)
  };

  /* ---------------- DATA LAYER ---------------- */
  function seedData() {
    const seed = (window.BOARD_DATA && window.BOARD_DATA) || {};
    const out = {};
    ORDER.forEach((k) => {
      out[k] = (seed[k] || []).map((it) => Object.assign({}, it)); // 浅拷贝，避免改动全局种子
      out[k].forEach((it, i) => { if (!it.id) it.id = k.slice(0, 3) + "-seed-" + i; });
    });
    return out;
  }
  // 从一份数据中提取「用户增量」：自新增条目 + 被改过核实状态的条目
  function extractUserDeltasFrom(srcData) {
    const seed = (window.BOARD_DATA && window.BOARD_DATA) || {};
    const added = {}, verified = {};
    ORDER.forEach((k) => {
      const seedIds = new Set((seed[k] || []).map((x) => x.id));
      (srcData[k] || []).forEach((it) => {
        if (!seedIds.has(it.id)) (added[k] = added[k] || []).push(it);
        else {
          const orig = (seed[k] || []).find((x) => x.id === it.id);
          if (orig && (it.verified || "待确认") !== (orig.verified || "待确认")) verified[k + "::" + it.id] = it.verified || "待确认";
        }
      });
    });
    return { added: added, verified: verified };
  }
  function reapplyDeltas(d, target) {
    ORDER.forEach((k) => {
      if (d.added[k]) d.added[k].forEach((it) => { if (!target[k].some((x) => x.id === it.id)) target[k].push(it); });
      Object.keys(d.verified || {}).forEach((key) => {
        const idx = key.indexOf("::");
        const bk = key.slice(0, idx), id = key.slice(idx + 2);
        const it = (target[bk] || []).find((x) => x.id === id);
        if (it) it.verified = d.verified[key];
      });
    });
  }
  function persistSeedVersion() {
    try { localStorage.setItem(SEEDVER_KEY, String(DATA_VERSION)); } catch (e) {}
  }
  function loadData() {
    const rawStored = localStorage.getItem(STORE_KEY);
    const storedVer = parseInt(localStorage.getItem(SEEDVER_KEY) || "0", 10);
    const out = seedData();
    let merged = out;
    if (rawStored) {
      try {
        const parsed = JSON.parse(rawStored);
        if (storedVer === DATA_VERSION) {
          // 版本一致：沿用本地数据（含你的编辑/新增）
          ORDER.forEach((k) => { merged[k] = Array.isArray(parsed[k]) ? parsed[k] : out[k]; });
        } else {
          // 版本变化：以旧数据提取用户增量，合并进最新种子（自动更新内容）
          const oldData = {};
          ORDER.forEach((k) => { oldData[k] = Array.isArray(parsed[k]) ? parsed[k] : []; });
          reapplyDeltas(extractUserDeltasFrom(oldData), out);
          merged = out;
        }
      } catch (e) { merged = out; }
    }
    persistSeedVersion();
    return merged;
  }
  // 强制重新合并最新种子（保留你的新增/已核实），供「恢复最新数据」按钮使用
  function forceReseed() {
    const deltas = extractUserDeltasFrom(state.data);
    state.data = seedData();
    reapplyDeltas(deltas, state.data);
    saveData();
    persistSeedVersion();
  }
  function saveData() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state.data)); } catch (e) {}
  }
  function items(key) { return state.data[key] || []; }
  function isOfficial(item, key) {
    return BOARDS[key].requireOfficial || item.sourceType === "官方发布";
  }

  /* ---------------- FAVORITES ---------------- */
  const FAV_KEY = "jic-favorites-v1";
  let favSet = new Set();
  function loadFavs() {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      favSet = new Set(raw ? JSON.parse(raw) : []);
    } catch (e) { favSet = new Set(); }
  }
  function saveFavs() {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(favSet))); } catch (e) {}
  }
  function favId(key, id) { return key + "::" + id; }
  function isFav(key, id) { return favSet.has(favId(key, id)); }
  function toggleFav(key, id) {
    const f = favId(key, id);
    if (favSet.has(f)) favSet.delete(f); else favSet.add(f);
    saveFavs();
    return favSet.has(f);
  }
  function updateFavCount() {
    const fc = document.getElementById("favCount");
    if (fc) fc.textContent = favSet.size;
  }

  /* ---------------- DOM HELPERS ---------------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function fmtDate(d) { return d ? String(d) : "—"; }

  /* ---------------- TOAST ---------------- */
  let toastTimer = null;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 1900);
  }

  /* ---------------- THEME ---------------- */
  function applyTheme(mode) {
    const root = document.documentElement;
    if (mode === "system") {
      const dark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-theme", dark ? "dark" : "light");
    } else {
      root.setAttribute("data-theme", mode);
    }
  }
  function cycleTheme() {
    const cur = localStorage.getItem(THEME_KEY) || "dark";
    const next = cur === "dark" ? "light" : cur === "light" ? "system" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
    const label = { dark: "暗色", light: "亮色", system: "跟随系统" }[next];
    toast("主题：" + label);
  }

  /* ---------------- NAV ---------------- */
  function renderNav() {
    const nav = $("#nav");
    // remove existing board items (keep home button)
    $$(".nav-item[data-board-key]", nav).forEach((n) => n.remove());
    const home = $('.nav-item[data-board="home"]', nav);
    ORDER.forEach((key) => {
      const b = BOARDS[key];
      const count = items(key).length;
      const btn = el("button", "nav-item");
      btn.setAttribute("data-board-key", key);
      btn.innerHTML =
        '<span class="nav-ico">' + b.icon + '</span>' +
        '<span class="nav-label">' + esc(b.label) + '</span>' +
        '<span class="nav-count">' + count + '</span>';
      btn.addEventListener("click", () => openBoard(key));
      const anchor = document.getElementById("navFav");
      nav.insertBefore(btn, anchor);
    });
    // highlight
    const navSearch = document.getElementById("navSearch");
    const navFav = document.getElementById("navFav");
    $$(".nav-item", nav).forEach((n) => n.classList.remove("active"));
    if (state.view === "home") home.classList.add("active");
    else if (state.view === "search") navSearch.classList.add("active");
    else if (state.view === "favorites") navFav.classList.add("active");
    else {
      const active = $('.nav-item[data-board-key="' + state.board + '"]', nav);
      if (active) active.classList.add("active");
    }
    updateFavCount();
  }

  /* ---------------- HOME ---------------- */
  function renderHome() {
    const stats = $("#heroStats");
    stats.innerHTML = "";
    let total = 0, pending = 0;
    ORDER.forEach((k) => {
      total += items(k).length;
      items(k).forEach((it) => { if (it.verified !== "已核实") pending++; });
    });
    const chips = [
      { n: total, l: "总条目" },
      { n: pending, l: "待确认" },
      { n: favSet.size, l: "收藏" },
      { n: ORDER.length, l: "情报板块" }
    ];
    chips.forEach((c) => {
      const d = el("div", "stat-chip",
        '<div class="stat-num">' + c.n + '</div><div class="stat-lbl">' + c.l + '</div>');
      stats.appendChild(d);
    });

    // board grid
    const grid = $("#boardGrid");
    grid.innerHTML = "";
    ORDER.forEach((key) => {
      const b = BOARDS[key];
      const list = items(key);
      const pend = list.filter((it) => it.verified !== "已核实").length;
      const card = el("button", "board-card");
      card.style.borderColor = b.accent;
      card.innerHTML =
        '<div class="bc-ico" style="color:' + b.accent + '">' + b.icon + '</div>' +
        '<div class="bc-title">' + esc(b.label) + '</div>' +
        '<div class="bc-desc">' + esc(b.desc) + '</div>' +
        '<div class="bc-count">条目 ' + list.length + ' ｜ 待确认 ' + pend + '</div>';
      card.addEventListener("click", () => openBoard(key));
      grid.appendChild(card);
    });

    // feed (latest 8, official first)
    const feed = $("#feed");
    feed.innerHTML = "";
    const all = [];
    ORDER.forEach((k) => items(k).forEach((it) => all.push(Object.assign({ _key: k }, it))));
    all.sort((a, b) => {
      const oa = isOfficial(a, a._key) ? 1 : 0, ob = isOfficial(b, b._key) ? 1 : 0;
      if (oa !== ob) return ob - oa;
      return String(b.date || "").localeCompare(String(a.date || ""));
    });
    all.slice(0, 8).forEach((it) => {
      const b = BOARDS[it._key];
      const row = el("div", "feed-row");
      row.innerHTML =
        '<span class="feed-tag" style="background:' + b.accent + '">' + esc(b.label) + '</span>' +
        '<div class="feed-main">' +
          '<div class="feed-title">' + esc(it.title) + '</div>' +
          '<div class="feed-meta">' + esc(it.source || "") + (isOfficial(it, it._key) ? ' · 官方' : '') + '</div>' +
        '</div>' +
        '<span class="feed-date">' + fmtDate(it.date) + '</span>';
      row.addEventListener("click", () => openDetail(it._key, it.id));
      feed.appendChild(row);
    });
    if (!all.length) feed.appendChild(el("div", "empty", "暂无数据，点击右上角「导入」或进入板块「新增条目」。"));
  }

  /* ---------------- BOARD VIEW ---------------- */
  function openBoard(key) {
    state.view = "board";
    state.board = key;
    const b = BOARDS[key];
    const root = document.documentElement;
    root.style.setProperty("--accent", b.accent);
    root.style.setProperty("--accent-2", b.accent2 || b.accent);
    state.search = "";
    $("#searchInput").value = "";
    if (!state.filters[key]) state.filters[key] = {};
    $("#homeView").hidden = true;
    $("#searchView").hidden = true;
    $("#favView").hidden = true;
    $("#boardView").hidden = false;
    $("#topbarTitle").textContent = BOARDS[key].label;
    renderBoard();
    renderNav();
  }
  function goHome() {
    state.view = "home";
    state.board = null;
    document.documentElement.style.removeProperty("--accent");
    document.documentElement.style.removeProperty("--accent-2");
    $("#homeView").hidden = false;
    $("#boardView").hidden = true;
    $("#searchView").hidden = true;
    $("#favView").hidden = true;
    $("#topbarTitle").textContent = "主控台";
    renderHome();
    renderNav();
  }

  function renderFilters() {
    const key = state.board;
    const b = BOARDS[key];
    const bar = $("#filterBar");
    bar.innerHTML = "";
    const fState = state.filters[key];

    // verified facet (always)
    bar.appendChild(buildFacet(key, "verified", "核实状态", ["待确认", "已核实"], fState));
    // official facet (when not all official)
    if (!b.requireOfficial) {
      bar.appendChild(buildFacet(key, "_official", "官方来源", ["官方", "非官方"], fState));
    }
    // per-board field facets
    Object.keys(b.fields).forEach((fk) => {
      const f = b.fields[fk];
      if (f.type === "select" && f.options) {
        bar.appendChild(buildFacet(key, fk, f.label, f.options, fState));
      }
    });
  }
  function buildFacet(key, fk, label, options, fState) {
    const group = el("div", "filter-group");
    group.appendChild(el("label", null, label));
    const chips = el("div", "chips");
    options.forEach((opt) => {
      const chip = el("button", "chip", esc(opt));
      if (fk === "verified") chip.classList.add(opt === "待确认" ? "chip-pending" : "chip-verified");
      if (fk === "_official" && opt === "官方") chip.classList.add("chip-official");
      const set = fState[fk] || (fState[fk] = new Set());
      if (set.has(opt)) chip.classList.add("active");
      chip.addEventListener("click", () => {
        if (set.has(opt)) { set.delete(opt); chip.classList.remove("active"); }
        else { set.add(opt); chip.classList.add("active"); }
        renderResults();
      });
      chips.appendChild(chip);
    });
    group.appendChild(chips);
    return group;
  }

  function passesFilter(key, it) {
    const fState = state.filters[key] || {};
    // verified
    if (fState.verified && fState.verified.size) {
      if (!fState.verified.has(it.verified || "待确认")) return false;
    }
    // official
    if (fState._official && fState._official.size) {
      const off = isOfficial(it, key) ? "官方" : "非官方";
      if (!fState._official.has(off)) return false;
    }
    // fields
    let ok = true;
    Object.keys(BOARDS[key].fields).forEach((fk) => {
      const set = fState[fk];
      if (set && set.size && !set.has(it[fk])) ok = false;
    });
    return ok;
  }
  function passesSearch(it) {
    if (!state.search) return true;
    const q = state.search.toLowerCase();
    const hay = [it.title, it.summary, it.source, it.url, it.region, it.country, it.type, it.category, it.topic, it.penaltyType, it.authority, it.impact]
      .map((x) => x || "").join(" ").toLowerCase();
    return hay.indexOf(q) !== -1;
  }

  function getFiltered(key) {
    let list = items(key).filter((it) => passesFilter(key, it) && passesSearch(it));
    list.sort((a, b) => {
      const oa = isOfficial(a, key) ? 1 : 0, ob = isOfficial(b, key) ? 1 : 0;
      if (oa !== ob) return ob - oa;
      return String(b.date || "").localeCompare(String(a.date || ""));
    });
    return list;
  }

  function renderBoard() {
    const key = state.board;
    const b = BOARDS[key];
    $("#boardTitle").textContent = b.label;
    $("#boardTitle").style.color = b.accent;
    $("#boardDesc").textContent = b.desc;
    renderFilters();
    renderResults();
  }

  function renderResults() {
    const key = state.board;
    const list = getFiltered(key);
    const meta = $("#resultsMeta");
    meta.textContent = "共 " + list.length + " 条" +
      (state.search ? "（搜索：“" + state.search + "”）" : "") +
      " ｜ 官方来源优先排序";
    const wrap = $("#results");
    wrap.innerHTML = "";
    if (!list.length) {
      wrap.appendChild(el("div", "empty", "没有匹配的条目。可调整筛选条件或点击「＋ 新增条目」。" + (state.search ? " 试试清空搜索。" : "")));
      return;
    }
    list.forEach((it) => wrap.appendChild(buildCard(key, it)));
  }

  function buildCard(key, it, opts) {
    opts = opts || {};
    const b = BOARDS[key];
    const card = el("div", "card");
    card.style.borderColor = b.accent;

    // badges
    const badges = el("div", "card-badges");
    if (opts.showBoard) badges.appendChild(el("span", "badge badge-region", "▣ " + BOARDS[key].label));
    if (isOfficial(it, key)) badges.appendChild(el("span", "badge badge-official", "官方"));
    const vBadge = el("span", "badge " + (it.verified === "已核实" ? "badge-verified" : "badge-pending"), esc(it.verified || "待确认"));
    badges.appendChild(vBadge);
    if (it.impact) {
      const lvl = it.impact === "严重" ? "sev-high" : it.impact === "中等" ? "sev-mid" : "sev-low";
      badges.appendChild(el("span", "badge badge-impact " + lvl, "影响：" + esc(it.impact)));
    }
    if (it.type) badges.appendChild(el("span", "badge badge-type", esc(it.type)));
    if (it.penaltyType) badges.appendChild(el("span", "badge badge-type", esc(it.penaltyType)));
    if (it.topic) badges.appendChild(el("span", "badge badge-type", esc(it.topic)));
    if (it.category) badges.appendChild(el("span", "badge badge-type", esc(it.category)));
    if (it.country) badges.appendChild(el("span", "badge badge-region", esc(it.country)));
    if (it.region && !it.country) badges.appendChild(el("span", "badge badge-region", esc(it.region)));
    card.appendChild(badges);

    // title + summary
    card.appendChild(el("div", "card-title", esc(it.title)));
    if (it.summary) card.appendChild(el("div", "card-summary", esc(it.summary)));

    // meta
    const meta = el("div", "card-meta");
    meta.innerHTML = '<span>' + esc(it.source || "—") + '</span><span>' + fmtDate(it.date) + '</span>';
    card.appendChild(meta);

    // actions
    const actions = el("div", "card-actions");
    const btnDetail = el("button", "mini-btn", "查看");
    btnDetail.addEventListener("click", () => openDetail(key, it.id));
    const faved = isFav(key, it.id);
    const btnFav = el("button", "mini-btn fav" + (faved ? " is-fav" : ""), faved ? "★ 已收藏" : "☆ 收藏");
    btnFav.addEventListener("click", (e) => {
      e.stopPropagation();
      const now = toggleFav(key, it.id);
      btnFav.classList.toggle("is-fav", now);
      btnFav.textContent = now ? "★ 已收藏" : "☆ 收藏";
      updateFavCount();
      if (state.view === "favorites") renderFavorites();
    });
    const verified = it.verified === "已核实";
    const btnVerify = el("button", "mini-btn verify" + (verified ? " is-verified" : ""),
      verified ? "↺ 已核实" : "✓ 待核实");
    btnVerify.addEventListener("click", (e) => { e.stopPropagation(); toggleVerified(key, it.id); });
    actions.appendChild(btnDetail);
    actions.appendChild(btnFav);
    actions.appendChild(btnVerify);
    card.appendChild(actions);

    card.addEventListener("click", () => openDetail(key, it.id));
    return card;
  }

  /* ---------------- DETAIL ---------------- */
  function openDetail(key, id) {
    const it = items(key).find((x) => x.id === id);
    if (!it) return;
    const b = BOARDS[key];
    $("#detailTitle").textContent = b.label;
    $("#detailTitle").style.color = b.accent;

    const body = $("#detailBody");
    body.innerHTML = "";

    const badgeRow = el("div", "badge-row");
    if (isOfficial(it, key)) badgeRow.appendChild(el("span", "badge badge-official", "官方来源"));
    badgeRow.appendChild(el("span", "badge " + (it.verified === "已核实" ? "badge-verified" : "badge-pending"),
      esc(it.verified || "待确认")));
    body.appendChild(badgeRow);

    const rows = [];
    if (it.country) rows.push(["国家/地区", it.country]);
    if (it.region) rows.push(["地区", it.region]);
    if (it.type) rows.push(["类型", it.type]);
    if (it.category) rows.push(["类别", it.category]);
    if (it.impact) rows.push(["影响等级", it.impact]);
    if (it.topic) rows.push(["议题", it.topic]);
    if (it.penaltyType) rows.push(["处罚类型", it.penaltyType]);
    if (it.authority) rows.push(["执法机构", it.authority]);
    if (it.amount) rows.push(["处罚金额", it.amount]);
    if (it.sourceType) rows.push(["来源类型", it.sourceType]);
    if (it.date) rows.push(["日期", it.date]);
    if (it.source) rows.push(["来源", it.source]);
    rows.forEach((r) => {
      const d = el("div", "detail-row");
      d.innerHTML = '<span class="k">' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span>';
      body.appendChild(d);
    });

    if (it.summary) {
      body.appendChild(el("div", "detail-summary", esc(it.summary)));
    }
    if (it.url) {
      const a = el("a", "source-link", "🔗 阅读原文：" + esc(it.source || it.url));
      a.href = it.url; a.target = "_blank"; a.rel = "noopener noreferrer";
      body.appendChild(a);
    }

    // foot: verify toggle + edit
    const foot = $("#detailFoot");
    foot.innerHTML = "";
    const verified = it.verified === "已核实";
    const btnVerify = el("button", "btn " + (verified ? "btn-ghost" : "btn-accent"),
      verified ? "↺ 标记为待确认" : "✓ 标记为已核实");
    btnVerify.addEventListener("click", () => {
      toggleVerified(key, it.id);
      openDetail(key, it.id); // refresh
    });
    const btnEdit = el("button", "btn btn-ghost", "✎ 编辑");
    btnEdit.addEventListener("click", () => openEdit(key, it.id));
    const faved = isFav(key, it.id);
    const btnFav = el("button", "btn " + (faved ? "btn-accent" : "btn-ghost"), faved ? "★ 已收藏" : "☆ 收藏");
    btnFav.addEventListener("click", () => {
      const now = toggleFav(key, it.id);
      btnFav.textContent = now ? "★ 已收藏" : "☆ 收藏";
      btnFav.className = "btn " + (now ? "btn-accent" : "btn-ghost");
      updateFavCount();
      if (state.view === "favorites") renderFavorites();
    });
    foot.appendChild(btnVerify);
    foot.appendChild(btnEdit);
    foot.appendChild(btnFav);
    foot.appendChild(el("span", "spacer"));
    const btnClose = el("button", "btn btn-ghost", "关闭");
    btnClose.addEventListener("click", closeModals);
    foot.appendChild(btnClose);

    $("#detailModal").hidden = false;
  }

  /* ---------------- VERIFY TOGGLE ---------------- */
  function toggleVerified(key, id) {
    const it = items(key).find((x) => x.id === id);
    if (!it) return;
    it.verified = (it.verified === "已核实") ? "待确认" : "已核实";
    saveData();
    if (state.view === "board") renderResults();
    renderNav();
    toast(it.verified === "已核实" ? "已标记为：已核实 ✓" : "已标记为：待确认");
  }

  /* ---------------- EDIT / ADD ---------------- */
  function openEdit(key, id) {
    state.editing = { key: key, id: id || null };
    const b = BOARDS[key];
    const it = id ? items(key).find((x) => x.id === id) : null;
    $("#editTitle").textContent = (id ? "编辑条目 · " : "新增条目 · ") + b.label;
    $("#editTitle").style.color = b.accent;
    $("#deleteBtn").hidden = !id;

    const form = $("#editForm");
    form.innerHTML = "";

    const common = [
      { k: "title", label: "标题", type: "text", req: true, full: true },
      { k: "summary", label: "摘要 / 要点", type: "textarea", full: true },
      { k: "source", label: "来源名称", type: "text" },
      { k: "url", label: "原文链接", type: "text" },
      { k: "date", label: "日期 (YYYY-MM-DD)", type: "text" }
    ];
    const allFields = Object.keys(b.fields).map((fk) => Object.assign({ k: fk }, b.fields[fk]))
      .concat(common);

    const grid = el("div", "form-grid");
    allFields.forEach((f) => {
      const wrap = el("div", "field" + (f.full ? " full" : ""));
      const lbl = el("label", null, esc(f.label) + (f.req ? ' <span class="req">*</span>' : ""));
      wrap.appendChild(lbl);
      let input;
      const val = it ? it[f.k] : (f.k === "verified" ? "待确认" : (f.k === "sourceType" && b.requireOfficial ? "官方发布" : ""));
      if (f.type === "select") {
        input = el("select", "select");
        (f.options || []).forEach((o) => {
          const opt = el("option", null, esc(o));
          opt.value = o;
          if (val === o) opt.selected = true;
          input.appendChild(opt);
        });
      } else if (f.type === "textarea") {
        input = el("textarea", "textarea");
        input.value = val || "";
      } else {
        input = el("input", "input");
        input.type = "text";
        input.value = val || "";
      }
      input.name = f.k;
      input.id = "f_" + f.k;
      wrap.appendChild(input);
      grid.appendChild(wrap);
    });

    // verified field (always)
    const vWrap = el("div", "field");
    vWrap.appendChild(el("label", null, "核实状态"));
    const vSel = el("select", "select");
    ["待确认", "已核实"].forEach((o) => {
      const opt = el("option", null, o);
      opt.value = o;
      if ((it ? it.verified : "待确认") === o) opt.selected = true;
      vSel.appendChild(opt);
    });
    vSel.name = "verified"; vSel.id = "f_verified";
    vWrap.appendChild(vSel);
    grid.appendChild(vWrap);

    form.appendChild(grid);
    $("#editModal").hidden = false;
    setTimeout(() => { const t = $("#f_title"); if (t) t.focus(); }, 30);
  }

  function submitEdit(e) {
    e.preventDefault();
    const { key, id } = state.editing;
    const b = BOARDS[key];
    const form = $("#editForm");
    const getData = (k) => { const n = form.querySelector("#f_" + k); return n ? n.value.trim() : ""; };

    const title = getData("title");
    if (!title) { toast("标题不能为空"); return; }

    const obj = { title: title };
    Object.keys(b.fields).forEach((fk) => { obj[fk] = getData(fk); });
    obj.summary = getData("summary");
    obj.source = getData("source");
    obj.url = getData("url");
    obj.date = getData("date");
    obj.verified = getData("verified") || "待确认";
    // enforce official-only for regulations
    if (b.requireOfficial) obj.sourceType = "官方发布";
    if (!obj.sourceType) obj.sourceType = "其他";

    if (id) {
      const it = items(key).find((x) => x.id === id);
      Object.assign(it, obj);
      toast("已保存修改");
    } else {
      obj.id = key.slice(0, 3) + "-" + Date.now().toString(36);
      obj.created = new Date().toISOString().slice(0, 10);
      items(key).unshift(obj);
      toast("已新增条目");
    }
    saveData();
    closeModals();
    if (state.view === "board" && state.board === key) renderResults();
    renderNav();
    if (state.view === "home") renderHome();
  }

  function deleteCurrent() {
    const { key, id } = state.editing;
    if (!id) return;
    const list = items(key);
    const idx = list.findIndex((x) => x.id === id);
    if (idx >= 0) list.splice(idx, 1);
    saveData();
    closeModals();
    if (state.view === "board" && state.board === key) renderResults();
    renderNav();
    if (state.view === "home") renderHome();
    toast("已删除条目");
  }

  /* ---------------- IMPORT / EXPORT ---------------- */
  function exportData() {
    const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robot-regulations-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast("已导出 JSON");
  }
  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const out = {};
        ORDER.forEach((k) => { out[k] = Array.isArray(parsed[k]) ? parsed[k] : (state.data[k] || []); });
        // ensure ids
        ORDER.forEach((k) => out[k].forEach((it, i) => { if (!it.id) it.id = k.slice(0,3) + "-" + Date.now().toString(36) + "-" + i; }));
        state.data = out;
        saveData();
        renderNav();
        if (state.view === "home") renderHome(); else if (state.board) renderResults();
        toast("导入成功");
      } catch (err) { toast("导入失败：文件格式错误"); }
    };
    reader.readAsText(file);
  }

  /* ---------------- MODALS UTIL ---------------- */
  function closeModals() {
    $("#detailModal").hidden = true;
    $("#editModal").hidden = true;
    $("#refreshModal").hidden = true;
  }

  /* ---------------- FAVORITES VIEW ---------------- */
  let favBoardFilter = "all";
  function openFavorites() {
    state.view = "favorites";
    state.board = null;
    document.documentElement.style.removeProperty("--accent");
    document.documentElement.style.removeProperty("--accent-2");
    $("#homeView").hidden = true;
    $("#boardView").hidden = true;
    $("#searchView").hidden = true;
    $("#favView").hidden = false;
    $("#topbarTitle").textContent = "收藏";
    renderFavorites();
    renderNav();
  }
  function renderFavorites() {
    const bar = $("#favFilterBar");
    bar.innerHTML = "";
    const group = el("div", "filter-group");
    group.appendChild(el("label", null, "板块范围"));
    const chips = el("div", "chips");
    const mk = (k, l) => {
      const c = el("button", "chip" + (favBoardFilter === k ? " active" : ""), l);
      c.addEventListener("click", () => { favBoardFilter = k; renderFavorites(); });
      chips.appendChild(c);
    };
    mk("all", "全部");
    ORDER.forEach((k) => mk(k, BOARDS[k].label));
    group.appendChild(chips);
    bar.appendChild(group);

    let list = [];
    ORDER.forEach((k) => items(k).forEach((it) => { if (isFav(k, it.id)) list.push(Object.assign({ _key: k }, it)); }));
    if (favBoardFilter !== "all") list = list.filter((x) => x._key === favBoardFilter);
    list.sort((a, b) => {
      const oa = isOfficial(a, a._key) ? 1 : 0, ob = isOfficial(b, b._key) ? 1 : 0;
      if (oa !== ob) return ob - oa;
      return String(b.date || "").localeCompare(String(a.date || ""));
    });

    const meta = $("#favMeta");
    meta.textContent = "共 " + list.length + " 条收藏 ｜ 官方来源优先排序";
    const wrap = $("#favResults");
    wrap.innerHTML = "";
    if (!list.length) {
      wrap.appendChild(el("div", "empty", "还没有收藏任何事项。在任意卡片或详情里点击「☆ 收藏」即可加入这里。"));
      return;
    }
    list.forEach((it) => wrap.appendChild(buildCard(it._key, it, { showBoard: true })));
  }

  /* ---------------- INFO UPDATE CLOCK (daily 09:00) ---------------- */
  function updateNextUpdate() {
    const elc = document.getElementById("updateNext");
    if (!elc) return;
    const now = new Date();
    const next = new Date(now);
    next.setHours(9, 0, 0, 0);
    if (now >= next) next.setDate(next.getDate() + 1);
    const diff = Math.max(0, Math.floor((next - now) / 1000));
    const pad = (x) => String(x).padStart(2, "0");
    elc.textContent = "下次更新 " + pad(Math.floor(diff / 3600)) + ":" + pad(Math.floor((diff % 3600) / 60)) + ":" + pad(diff % 60);
  }

  /* ---------------- LIVE SEARCH VIEW ---------------- */
  const searchState = { scope: "all", officialOnly: false };

  function openSearch() {
    state.view = "search";
    state.board = null;
    document.documentElement.style.removeProperty("--accent");
    document.documentElement.style.removeProperty("--accent-2");
    $("#homeView").hidden = true;
    $("#boardView").hidden = true;
    $("#searchView").hidden = false;
    $("#favView").hidden = true;
    $("#topbarTitle").textContent = "实时检索";
    buildScopeChips();
    $("#liveSearch").value = "";
    $("#liveLocal").innerHTML = '<div class="empty">输入关键词，即时检索本库全部情报。</div>';
    $("#liveWeb").innerHTML = '<div class="empty">输入关键词后，将自动联网检索维基百科等公开资料。</div>';
    $("#liveMeta").textContent = "";
    renderNav();
    setTimeout(() => { const i = $("#liveSearch"); if (i) i.focus(); }, 30);
  }

  function buildScopeChips() {
    const wrap = $("#scopeChips");
    wrap.innerHTML = "";
    const opts = [{ k: "all", l: "全部" }].concat(ORDER.map((k) => ({ k: k, l: BOARDS[k].label })));
    opts.forEach((o) => {
      const c = el("button", "chip" + (searchState.scope === o.k ? " active" : ""), o.l);
      c.addEventListener("click", () => {
        searchState.scope = o.k;
        buildScopeChips();
        runLive($("#liveSearch").value);
      });
      wrap.appendChild(c);
    });
  }

  function localMatches(q) {
    const query = q.trim().toLowerCase();
    const out = [];
    const keys = searchState.scope === "all" ? ORDER : [searchState.scope];
    keys.forEach((k) => {
      items(k).forEach((it) => {
        if (searchState.officialOnly && !isOfficial(it, k)) return;
        if (!query) { out.push(Object.assign({ _key: k }, it)); return; }
        const hay = [it.title, it.summary, it.source, it.url, it.region, it.country, it.type, it.category, it.topic, it.penaltyType, it.authority, it.impact]
          .map((x) => x || "").join(" ").toLowerCase();
        if (hay.indexOf(query) !== -1) out.push(Object.assign({ _key: k }, it));
      });
    });
    out.sort((a, b) => {
      const oa = isOfficial(a, a._key) ? 1 : 0, ob = isOfficial(b, b._key) ? 1 : 0;
      if (oa !== ob) return ob - oa;
      return String(b.date || "").localeCompare(String(a.date || ""));
    });
    return out;
  }

  function safeSnippet(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html || "";
    Array.prototype.slice.call(tmp.childNodes).forEach((c) => {
      if (c.nodeType === 1) {
        if (!(c.nodeName === "SPAN" && c.className === "searchmatch")) {
          tmp.replaceChild(document.createTextNode(c.textContent), c);
        }
      }
    });
    return tmp.innerHTML;
  }

  let liveTimer = null;
  function onLiveInput(v) { clearTimeout(liveTimer); liveTimer = setTimeout(() => runLive(v), 300); }

  function runLive(q) {
    const local = localMatches(q);
    const meta = $("#liveMeta");
    meta.textContent = "本库匹配 " + local.length + " 条" + (searchState.officialOnly ? "（仅官方）" : "") + (q ? " ｜ 关键词：“" + q + "”" : " ｜ 全部情报");
    const wrap = $("#liveLocal");
    wrap.innerHTML = "";
    if (!local.length) {
      wrap.appendChild(el("div", "empty", "本库无匹配。试试联网检索，或调整范围 / 取消「仅官方」。" + (q ? " 或换一个关键词。" : "")));
    } else {
      local.slice(0, 30).forEach((it) => wrap.appendChild(buildCard(it._key, it)));
    }
    fetchWeb(q);
  }

  function fetchWeb(q) {
    const box = $("#liveWeb");
    const hint = $("#liveHint");
    const query = q.trim();
    if (!query) {
      box.innerHTML = '<div class="empty">输入关键词后，将自动联网检索维基百科等公开资料。</div>';
      hint.textContent = "";
      return;
    }
    box.innerHTML = '<div class="web-loading">⌁ 正在联网检索 “' + esc(query) + '” …</div>';
    hint.textContent = "";
    const mk = (lang, limit) =>
      "https://" + lang + ".wikipedia.org/w/api.php?action=query&list=search&srsearch=" +
      encodeURIComponent(query) + "&format=json&origin=*&srlimit=" + limit;
    const p1 = fetch(mk("zh", 8)).then((r) => r.json()).then((d) =>
      (d.query.search || []).map((x) => ({ title: x.title, snippet: x.snippet, link: "https://zh.wikipedia.org/?curid=" + x.pageid, lang: "中文" })));
    const p2 = fetch(mk("en", 6)).then((r) => r.json()).then((d) =>
      (d.query.search || []).map((x) => ({ title: x.title, snippet: x.snippet, link: "https://en.wikipedia.org/?curid=" + x.pageid, lang: "EN" })));
    Promise.allSettled([p1, p2]).then((res) => {
      let all = [];
      res.forEach((r) => { if (r.status === "fulfilled") all = all.concat(r.value); });
      if (!all.length) {
        box.innerHTML = '<div class="web-err">联网检索未返回结果（可能受网络限制）。可点击「必应联网检索」直接检索。</div>';
        return;
      }
      box.innerHTML = "";
      all.slice(0, 14).forEach((w) => {
        const item = el("div", "web-item");
        const a = el("a", null, esc(w.title));
        a.href = w.link; a.target = "_blank"; a.rel = "noopener noreferrer";
        const titleWrap = el("div");
        titleWrap.appendChild(a);
        titleWrap.appendChild(el("span", "web-snippet", "  [" + w.lang + "]"));
        item.appendChild(titleWrap);
        const snip = el("div", "web-snippet", "");
        snip.innerHTML = safeSnippet(w.snippet);
        item.appendChild(snip);
        box.appendChild(item);
      });
      hint.textContent = "· 共 " + all.length + " 条来自维基百科";
    }).catch(() => {
      box.innerHTML = '<div class="web-err">联网检索失败（可能受网络限制）。可点击「必应联网检索」。</div>';
    });
  }

  function webSearchExternal() {
    const q = $("#liveSearch").value.trim();
    if (!q) { toast("请先输入关键词"); return; }
    window.open("https://www.bing.com/search?q=" + encodeURIComponent(q), "_blank", "noopener");
  }

  /* ---------------- REAL-TIME REFRESH MODAL ---------------- */
  const refreshState = { scope: "all", officialOnly: false };
  function openRefresh() {
    $("#refreshModal").hidden = false;
    $("#refreshInput").value = "";
    $("#refreshLocal").innerHTML = '<div class="empty">输入关键词并点击「执行刷新」，将同步检索本库与维基百科等公开资料。</div>';
    $("#refreshWeb").innerHTML = '<div class="empty">输入关键词并点击「执行刷新」，将同步检索本库与维基百科等公开资料。</div>';
    $("#refreshMeta").textContent = "";
    buildRefreshScopeChips();
    setTimeout(() => { const i = $("#refreshInput"); if (i) i.focus(); }, 30);
  }
  function buildRefreshScopeChips() {
    const wrap = $("#refreshScopeChips");
    wrap.innerHTML = "";
    const opts = [{ k: "all", l: "全部" }].concat(ORDER.map((k) => ({ k: k, l: BOARDS[k].label })));
    opts.forEach((o) => {
      const c = el("button", "chip" + (refreshState.scope === o.k ? " active" : ""), o.l);
      c.addEventListener("click", () => { refreshState.scope = o.k; buildRefreshScopeChips(); });
      wrap.appendChild(c);
    });
  }
  function refreshMatches(q) {
    const query = q.trim().toLowerCase();
    const out = [];
    const keys = refreshState.scope === "all" ? ORDER : [refreshState.scope];
    keys.forEach((k) => {
      items(k).forEach((it) => {
        if (refreshState.officialOnly && !isOfficial(it, k)) return;
        if (!query) { out.push(Object.assign({ _key: k }, it)); return; }
        const hay = [it.title, it.summary, it.source, it.url, it.region, it.country, it.type, it.category, it.topic, it.penaltyType, it.authority, it.impact]
          .map((x) => x || "").join(" ").toLowerCase();
        if (hay.indexOf(query) !== -1) out.push(Object.assign({ _key: k }, it));
      });
    });
    out.sort((a, b) => {
      const oa = isOfficial(a, a._key) ? 1 : 0, ob = isOfficial(b, b._key) ? 1 : 0;
      if (oa !== ob) return ob - oa;
      return String(b.date || "").localeCompare(String(a.date || ""));
    });
    return out;
  }
  function fetchRefreshWeb(q) {
    const box = $("#refreshWeb");
    const hint = $("#refreshHint");
    const query = q.trim();
    if (!query) {
      box.innerHTML = '<div class="empty">输入关键词并点击「执行刷新」，将同步检索本库与维基百科等公开资料。</div>';
      hint.textContent = "";
      return;
    }
    box.innerHTML = '<div class="web-loading">⌁ 正在联网检索 “' + esc(query) + '” …</div>';
    hint.textContent = "";
    const mk = (lang, limit) => "https://" + lang + ".wikipedia.org/w/api.php?action=query&list=search&srsearch=" + encodeURIComponent(query) + "&format=json&origin=*&srlimit=" + limit;
    const p1 = fetch(mk("zh", 8)).then((r) => r.json()).then((d) =>
      (d.query.search || []).map((x) => ({ title: x.title, snippet: x.snippet, link: "https://zh.wikipedia.org/?curid=" + x.pageid, lang: "中文" })));
    const p2 = fetch(mk("en", 6)).then((r) => r.json()).then((d) =>
      (d.query.search || []).map((x) => ({ title: x.title, snippet: x.snippet, link: "https://en.wikipedia.org/?curid=" + x.pageid, lang: "EN" })));
    Promise.allSettled([p1, p2]).then((res) => {
      let all = [];
      res.forEach((r) => { if (r.status === "fulfilled") all = all.concat(r.value); });
      if (!all.length) {
        box.innerHTML = '<div class="web-err">联网检索未返回结果（可能受网络限制）。可点击「必应联网检索」直接检索。</div>';
        return;
      }
      box.innerHTML = "";
      all.slice(0, 14).forEach((w) => {
        const item = el("div", "web-item");
        const a = el("a", null, esc(w.title));
        a.href = w.link; a.target = "_blank"; a.rel = "noopener noreferrer";
        const titleWrap = el("div");
        titleWrap.appendChild(a);
        titleWrap.appendChild(el("span", "web-snippet", "  [" + w.lang + "]"));
        item.appendChild(titleWrap);
        const snip = el("div", "web-snippet", "");
        snip.innerHTML = safeSnippet(w.snippet);
        item.appendChild(snip);
        box.appendChild(item);
      });
      hint.textContent = "· 共 " + all.length + " 条来自维基百科";
    }).catch(() => {
      box.innerHTML = '<div class="web-err">联网检索失败（可能受网络限制）。可点击「必应联网检索」。</div>';
    });
  }
  function runRefresh() {
    const q = $("#refreshInput").value;
    const local = refreshMatches(q);
    const meta = $("#refreshMeta");
    meta.textContent = "本库匹配 " + local.length + " 条" + (refreshState.officialOnly ? "（仅官方）" : "") + (q.trim() ? " ｜ 关键词：“" + q.trim() + "”" : " ｜ 全部情报");
    const wrap = $("#refreshLocal");
    wrap.innerHTML = "";
    if (!local.length) {
      wrap.appendChild(el("div", "empty", "本库无匹配。试试联网检索，或调整范围 / 取消「仅官方」。" + (q.trim() ? " 或换一个关键词。" : "")));
    } else {
      local.slice(0, 30).forEach((it) => wrap.appendChild(buildCard(it._key, it)));
    }
    fetchRefreshWeb(q);
  }
  function refreshBingExternal() {
    const q = $("#refreshInput").value.trim();
    if (!q) { toast("请先输入关键词"); return; }
    window.open("https://www.bing.com/search?q=" + encodeURIComponent(q), "_blank", "noopener");
  }

  /* ---------------- TOPBAR SEARCH (board scope) ---------------- */
  function onSearch(v) {
    state.search = v.trim();
    if (state.view === "board") renderResults();
  }

  /* ---------------- INIT ---------------- */
  /* ---------------- BACKGROUND ROTATION (multi EVA art) ---------------- */
  const BG_IMAGES = [
    "assets/bg/bg1.jpg", "assets/bg/bg2.jpg", "assets/bg/bg3.jpg", "assets/bg/bg4.jpg",
    "assets/bg/bg5.jpg", "assets/bg/bg6.jpg", "assets/bg/bg7.jpg"
  ];
  let bgTimer = null, bgIdx = 0;
  function initBackgroundRotation() {
    const stack = document.getElementById("bgStack");
    if (!stack || BG_IMAGES.length === 0) return;
    BG_IMAGES.forEach((src, i) => {
      const layer = document.createElement("div");
      layer.className = "bg-layer";
      if (i === 0) {
        layer.style.backgroundImage = 'url("' + src + '")';
        layer.classList.add("active");
      }
      stack.appendChild(layer);
    });
    bgIdx = 0;
    if (BG_IMAGES.length > 1) {
      bgTimer = setInterval(() => {
        const layers = stack.children;
        const next = (bgIdx + 1) % layers.length;
        if (!layers[next].style.backgroundImage) {
          layers[next].style.backgroundImage = 'url("' + BG_IMAGES[next] + '")';
        }
        layers[bgIdx].classList.remove("active");
        layers[next].classList.add("active");
        bgIdx = next;
      }, 9000);
    }
  }

  /* ---------------- DAILY DIGEST (auto-merge) ---------------- */
  // 启动时异步拉取 assets/digest.json（每日自动化产出的简报），合并新条目
  function fetchDigest() {
    try {
      fetch("assets/digest.json?v=" + Date.now(), { cache: "no-store" })
        .then((r) => { if (!r.ok) return null; return r.json(); })
        .then((data) => {
          if (!data || !Array.isArray(data.items)) return;
          let added = 0;
          data.items.forEach((entry) => {
            const key = entry.key, it = entry.item;
            if (!key || !it || !it.id) return;
            if (!state.data[key]) state.data[key] = [];
            if (state.data[key].some((x) => x.id === it.id)) return; // 去重
            state.data[key].push(Object.assign({ verified: "待确认" }, it));
            added++;
          });
          if (added) {
            saveData();
            if (state.view === "home") renderHome();
            else if (state.view === "board") renderResults();
            else if (state.view === "favorites") renderFavorites();
            toast("已合并 " + added + " 条每日简报新条目");
          }
        })
        .catch(() => { /* 离线/无简报时静默 */ });
    } catch (e) { /* ignore */ }
  }

  function init() {
    state.data = loadData();
    loadFavs();
    applyTheme(localStorage.getItem(THEME_KEY) || "dark");

    // nav
    $('.nav-item[data-board="home"]').addEventListener("click", goHome);
    $("#navSearch").addEventListener("click", openSearch);
    $("#navFav").addEventListener("click", openFavorites);

    // topbar
    $("#refreshBtn").addEventListener("click", openRefresh);
    $("#syncBtn").addEventListener("click", () => {
      forceReseed();
      if (state.view === "home") renderHome();
      else if (state.view === "board") renderBoard();
      else if (state.view === "favorites") renderFavorites();
      else if (state.view === "search") renderLiveResults();
      toast("已恢复至最新数据 · 你新增/已核实的内容已保留");
    });
    $("#themeBtn").addEventListener("click", cycleTheme);
    $("#exportBtn").addEventListener("click", exportData);
    $("#importBtn").addEventListener("click", () => $("#fileInput").click());
    $("#fileInput").addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) importData(e.target.files[0]);
      e.target.value = "";
    });
    $("#searchInput").addEventListener("input", (e) => onSearch(e.target.value));

    // live search view
    $("#liveSearch").addEventListener("input", (e) => onLiveInput(e.target.value));
    $("#officialOnly").addEventListener("change", (e) => {
      searchState.officialOnly = e.target.checked;
      runLive($("#liveSearch").value);
    });
    $("#webSearchBtn").addEventListener("click", webSearchExternal);

    // refresh modal
    $("#runRefreshBtn").addEventListener("click", runRefresh);
    $("#refreshBingBtn").addEventListener("click", refreshBingExternal);
    $("#refreshOfficialOnly").addEventListener("change", (e) => {
      refreshState.officialOnly = e.target.checked;
    });

    // board view add
    $("#addBtn").addEventListener("click", () => { if (state.board) openEdit(state.board, null); });

    // edit form
    $("#editForm").addEventListener("submit", submitEdit);
    $("#deleteBtn").addEventListener("click", deleteCurrent);

    // modal close (x + backdrop + cancel)
    $$("[data-close]").forEach((b) => b.addEventListener("click", closeModals));
    $$(".modal-overlay").forEach((ov) => {
      ov.addEventListener("click", (e) => { if (e.target === ov) closeModals(); });
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModals(); });

    initBackgroundRotation();
    renderNav();
    renderHome();
    updateNextUpdate();
    setInterval(updateNextUpdate, 1000);
    fetchDigest(); // 自动合并每日简报（若有更新）
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
