// content/ のMarkdown・HTMLから data/site-data.js を作る。
// 使い方: node tools/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { Marked } from 'marked';

const ROOT = path.resolve('.');
const C = (p) => path.join(ROOT, 'content', p);

// ---------- 分類（大題）と各ページ（中題） ----------
const GROUPS = [
  { id: 'start', label: 'はじめに', icon: 'home' },
  { id: 'ho', label: 'HO', icon: 'doc' },
  { id: 'read', label: '読み合わせ', icon: 'chat' },
  { id: 'card', label: 'カード', icon: 'cards' },
  { id: 'gm', label: '進行・終幕資料', icon: 'flag' },
  { id: 'canon', label: '正本（真相）', icon: 'key' },
  { id: 'check', label: 'チェック', icon: 'check' },
  { id: 'play', label: '仮想プレイ', icon: 'dice' },
  { id: 'ref', label: '参照・旧版', icon: 'books' },
];
const P = [];
const add = (group, sub, id, nav, file, kind = 'doc', audience = '') => P.push({ group, sub, id, nav, file, kind, audience });

add('start', '', 'about', 'このサイトの使い方', C('サイトの使い方.md'), 'doc', '');
add('start', '', 'readme', 'v5改稿の案内（README）', C('v5/00_README.md'), 'doc', '制作');
add('start', '', 'fixes', '修正一覧と再検証', C('v5/09_修正一覧と再検証.md'), 'doc', '制作');

const pcs = [['1', '剣持 一真'], ['2', '菱川 開二'], ['3', '三葉 美津'], ['4', '心原 四季']];
for (const [n, name] of pcs) {
  add('ho', `PC${n} ${name}`, `ho-pc${n}-a`, 'HO-A（17:30まで）', C(`HO/PC${n}_HO-A.md`), 'ho', 'PL配布');
  add('ho', `PC${n} ${name}`, `ho-pc${n}-b`, 'HO-B（神経衰弱の後）', C(`HO/PC${n}_HO-B.md`), 'ho', 'PL配布');
  if (n === '1') {
    add('ho', 'PC1 剣持 一真', 'ho-pc1-card', '別紙：PC1進行カード', C('v5/06_PC1進行カード.md'), 'doc', 'PL配布');
    add('ho', 'PC1 剣持 一真', 'ho-pc1-memory', '別紙：一真の記憶カード（封筒）', C('終幕/一真の記憶カード.md'), 'doc', 'PL配布');
  }
}

const readSubs = [['本編', ['01', '02', '03', '04', '05']], ['終幕', ['06']]];
for (const [sub, ids] of readSubs) for (const n of ids) {
  const f = C(`読み合わせ/R${n}.md`);
  const h1 = fs.readFileSync(f, 'utf8').split(/\r?\n/)[0].replace(/^# /, '');
  add('read', sub, 'r' + n, h1, f, 'read', 'PL配布');
}

add('card', '調査カード', 'card-c1', '第1調査（C01～C30）', C('カード/第1調査_C01-C30.md'), 'card', 'PL配布');
add('card', '調査カード', 'card-c2', '第2調査（C31～C35）', C('カード/第2調査_C31-C35.md'), 'card', 'PL配布');
add('card', '調査カード', 'card-c3', '第3調査（C36～C40）', C('カード/第3調査_C36-C40.md'), 'card', 'PL配布');
add('card', '別枠', 'card-j', 'ジョーのメモ（J01～J06）', C('カード/ジョーのメモ_J01-J06.md'), 'card', 'PL配布');
add('card', '別枠', 'card-fixed', 'PC3の固定回答（A・B）', C('カード/固定回答A_B.md'), 'card', 'PL配布');

add('gm', '進行', 'gm-flow', 'GMレス進行（進行表・数字札・調査履歴）', C('解説/GMレス進行.md'), 'doc', 'GM専用');
add('gm', '進行', 'gm-public', '公開基本情報', C('解説/公開基本情報.md'), 'doc', 'PL配布');
add('gm', '終幕', 'end-notebook', 'ジョー・カーの手帳', C('終幕/ジョー・カーの手帳.md'), 'doc', 'GM専用');
add('gm', '終幕', 'end-reveal', '最終証拠の公開時に読む文', C('終幕/最終証拠の公開時に読む文（第3調査の後）.md'), 'doc', 'GM専用');

add('canon', '', 'canon-about', '作品概要', C('解説/作品概要.md'), 'doc', 'GM専用');
add('canon', '', 'canon-truth', '事件真相とループの真相', C('解説/事件真相.md'), 'doc', 'GM専用');
add('canon', '', 'canon-tl', '全人物タイムライン', C('解説/全人物TL.md'), 'doc', 'GM専用');
add('canon', '', 'canon-chars', '登場人物', C('解説/登場人物.md'), 'doc', 'GM専用');
add('canon', '', 'canon-infer', '最終推理の導線', C('解説/最終推理.md'), 'doc', 'GM専用');

add('check', '', 'check-integrity', '整合性チェック', C('v5/01_整合性チェック.md'), 'doc', '制作');
add('play', '', 'play-v5', '仮想プレイ検証（3卓）', C('v5/08_仮想プレイ検証.md'), 'doc', '制作');

add('ref', '検討の経緯', 'ref-study', '再解釈フェイズ検証 v1', C('参照/再解釈フェイズ検証_v1.md'), 'doc', '参照');
add('ref', '検討の経緯', 'ref-design', '終幕設計書 v3（信頼RTA）', C('参照/終幕設計書_v3.md'), 'doc', '参照');
add('ref', '改稿前の正本', 'ref-spec', 'LOCKED SPEC（Ver.4.1.1）', C('参照/LOCKED_SPEC_Ver4.1.1.md'), 'doc', '参照');
add('ref', '旧版', 'ref-v2', '旧確認サイト Ver.4.1.1（別画面）', null, 'link', '参照');

// ---------- 道具 ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = (h) => String(h).replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const norm = (s) => strip(s).replace(/\s+/g, '').trim();
function fnv(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h >>> 0; }
const SPEAKERS = { '一真': 'sarah', '開二': 'luke', '美津': 'doc', '四季': 'marty', 'ジョー・カー': 'john', 'ナレーション': 'narr' };
const NOTE_COL = /^(情報の限界|注意点|注意|備考|この分岐で明かさないこと)$/;

function makeCtx(page) {
  const used = new Map();
  const toc = [];
  const aid = (text, kind = 'a') => {
    const base = kind + fnv(norm(text)).toString(36);
    const n = (used.get(base) || 0) + 1; used.set(base, n);
    return n === 1 ? base : base + '-' + n;
  };
  return { page, aid, toc, noteSeq: 0 };
}

// ---------- Markdownの描画 ----------
function makeMarked(ctx) {
  const m = new Marked({ gfm: true, breaks: true });
  m.use({ renderer: {
    heading({ tokens, depth, text }) {
      const inner = this.parser.parseInline(tokens);
      const id = ctx.aid(text, 'h');
      if (depth === 2 || depth === 3) ctx.toc.push({ id, text: strip(inner), level: depth });
      return `<h${depth} id="${id}" class="h${depth}" data-a="${id}">${inner}</h${depth}>\n`;
    },
    paragraph({ tokens, text }) {
      const inner = this.parser.parseInline(tokens);
      return `<p data-a="${ctx.aid(text)}">${inner}</p>\n`;
    },
    listitem(item) {
      const inner = this.parser.parse(item.tokens, !!item.loose);
      return `<li data-a="${ctx.aid(item.text)}">${inner}</li>\n`;
    },
    blockquote({ tokens, text }) {
      const inner = this.parser.parse(tokens).replace(/ data-a="[^"]*"/g, '');
      const tag = /^「/.test(text.trim()) ? ' class="tagline"' : '';
      return `<blockquote${tag} data-a="${ctx.aid(text)}">${inner}</blockquote>\n`;
    },
    table(token) { return renderTable.call(this, token, ctx); },
    hr() { return '<hr>\n'; },
    code({ text }) { return `<pre class="code" data-a="${ctx.aid(text)}"><code>${esc(text)}</code></pre>\n`; },
  } });
  return m;
}

function renderTable(token, ctx) {
  const P = this.parser;
  const head = token.header.map((c) => strip(P.parseInline(c.tokens)).trim());
  const noteIdx = head.map((h, i) => (NOTE_COL.test(h) ? i : -1)).filter((i) => i >= 0);
  const keep = head.map((_, i) => i).filter((i) => !noteIdx.includes(i));
  const notes = [];
  let html = '<div class="table-wrap"><table>\n<thead><tr>';
  for (const i of keep) html += `<th>${P.parseInline(token.header[i].tokens)}</th>`;
  html += '</tr></thead>\n<tbody>\n';
  for (const row of token.rows) {
    const cells = row.map((c) => P.parseInline(c.tokens));
    const rowText = cells.map(strip).join(' ');
    const id = ctx.aid(rowText, 'r');
    const rowNotes = [];
    for (const i of noteIdx) {
      if (!strip(cells[i]).trim() || /^[-—]$/.test(strip(cells[i]).trim())) continue;
      const nid = 'n' + id + '-' + i;
      const first = strip(cells[keep[0]]).trim();
      const second = keep[1] !== undefined ? strip(cells[keep[1]]).trim() : '';
      const label = (first.length <= 8 && second ? first + ' ' + second : first).slice(0, 60);
      rowNotes.push(nid);
      notes.push({ nid, label, kind: head[i], body: cells[i] });
    }
    html += `<tr data-a="${id}">`;
    keep.forEach((i, k) => {
      const nw = k === 0 && strip(cells[i]).trim().length <= 8 ? ' class="nw"' : '';
      const mark = k === 0 && rowNotes.length ? rowNotes.map((n) => `<button type="button" class="note-mark" data-note="${n}" title="注意点を開く">注</button>`).join('') : '';
      html += `<td${nw}>${cells[i]}${mark}</td>`;
    });
    html += '</tr>\n';
  }
  html += '</tbody></table></div>\n';
  if (notes.length) {
    html += '<div class="notes-group"><div class="notes-label">注意点</div>\n';
    for (const n of notes) {
      html += `<details class="note ${n.kind === '情報の限界' ? 'limit' : 'caution'}" id="${n.nid}" data-a="${ctx.aid(n.label + n.kind + strip(n.body))}"><summary><span class="note-chip">${esc(n.kind)}</span>${esc(n.label)}</summary><div class="note-body">${n.body}</div></details>\n`;
    }
    html += '</div>\n';
  }
  return html;
}

// :::note 見出し ... ::: を <details> にする（既定は閉じる）
function splitNotes(md) {
  const out = []; const lines = md.split('\n'); let buf = []; let note = null;
  for (const line of lines) {
    const open = line.match(/^:::note\s*(.*)$/);
    if (!note && open) { if (buf.length) out.push({ type: 'md', text: buf.join('\n') }); buf = []; note = { type: 'note', title: open[1].trim(), body: [] }; continue; }
    if (note && line.trim() === ':::') { out.push(note); note = null; continue; }
    if (note) note.body.push(line); else buf.push(line);
  }
  if (note) out.push(note);
  if (buf.length) out.push({ type: 'md', text: buf.join('\n') });
  return out;
}
function noteKind(title) {
  if (/^情報の限界/.test(title)) return 'limit';
  if (/^(注意点|注意)/.test(title)) return 'caution';
  if (/制作|出典|新規執筆/.test(title)) return 'meta';
  return 'info';
}
function noteChip(title) {
  const m = title.match(/^([^｜|]+)[｜|](.+)$/);
  if (m) return `<span class="note-chip">${esc(m[1])}</span>${esc(m[2])}`;
  return esc(title);
}

function renderMd(md, ctx, opts = {}) {
  const mk = makeMarked(ctx);
  let html = '';
  for (const seg of splitNotes(md)) {
    if (seg.type === 'note') {
      const inner = renderMd(seg.body.join('\n'), ctx, opts);
      html += `<details class="note ${noteKind(seg.title)}" data-a="${ctx.aid('note' + seg.title)}"${opts.openNotes ? ' open' : ''}><summary>${noteChip(seg.title)}</summary><div class="note-body">${inner}</div></details>\n`;
      continue;
    }
    html += renderTokens(mk.lexer(seg.text), mk, ctx, opts);
  }
  return html;
}

// 汎用：トークン列を描画（HO・カードの特別扱いを含む）
function renderTokens(tokens, mk, ctx, opts) {
  let html = '';
  let cardOpen = false;
  const closeCard = () => { if (cardOpen) { html += '</div></section>\n'; cardOpen = false; } };
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type === 'space') continue;
    // ページ見出し（h1）は上部のタイトルに使うので本文では省く
    if (t.type === 'heading' && t.depth === 1 && !ctx.h1Done) { ctx.h1Done = true; ctx.h1 = strip(mk.parseInline(t.text)); continue; }
    // HO：見出し直後の「PCn／…」はキッカー
    if (opts.kind === 'ho' && t.type === 'paragraph' && /^PC\d／|^（.*配布/.test(t.text) && !ctx.kicker) { ctx.kicker = strip(mk.parseInline(t.text)); continue; }
    // HO：「▼ …」は小見出し
    if (t.type === 'paragraph' && /^▼\s*/.test(t.text) && !t.text.includes('\n')) {
      const text = t.text.replace(/^▼\s*/, '');
      const id = ctx.aid(text, 'h');
      ctx.toc.push({ id, text, level: 3 });
      html += `<h3 id="${id}" class="ho-sec" data-a="${id}">${mk.parseInline(text)}</h3>\n`;
      continue;
    }
    // 「**大事なこと…**」「**★…**」＋直後のリスト → 強調ボックス
    if (t.type === 'paragraph' && /^\*\*(大事なこと|★|要点)/.test(t.text)) {
      let inner = mk.parser([t]);
      let j = i + 1; while (tokens[j] && tokens[j].type === 'space') j++;
      if (tokens[j] && tokens[j].type === 'list') { inner += mk.parser([tokens[j]]); i = j; }
      html += `<div class="callout">${inner}</div>\n`;
      continue;
    }
    // カード：カード名の見出しごとにカード枠を作る
    if (opts.kind === 'card' && t.type === 'heading' && t.depth === 2) {
      closeCard();
      const title = t.text;
      if (/^(C\d{2}|J\d{2}|固定回答)/.test(title)) {
        const ex = title.match(/《(EX：[^》]+)》/);
        const clean = title.replace(/\s*《[^》]+》/, '');
        const id = ctx.aid(clean, 'h');
        ctx.toc.push({ id, text: clean, level: 2 });
        const tone = /^J\d/.test(clean) ? ' ex' : /^固定回答/.test(clean) ? ' public' : /^C(3[6-9]|40)/.test(clean) ? ' extra' : '';
        html += `<section class="cardx${tone}" id="${id}"><header class="cardx-head" data-a="${id}"><span class="cardx-title">${esc(clean)}</span>${ex ? `<span class="badge ex">${esc(ex[1])}</span>` : ''}</header><div class="cardx-body">\n`;
        cardOpen = true;
        continue;
      }
      if (/進め方|ルール/.test(title)) {
        // 進め方は折りたたみ（注意点と同じ扱い）
        let j = i + 1; const body = [];
        while (j < tokens.length && !(tokens[j].type === 'heading' && tokens[j].depth <= 2) && tokens[j].type !== 'hr') { body.push(tokens[j]); j++; }
        html += `<details class="note info" data-a="${ctx.aid('note' + title)}"><summary><span class="note-chip">進め方</span>${esc(title)}</summary><div class="note-body">${mk.parser(body)}</div></details>\n`;
        i = j - 1;
        continue;
      }
    }
    if (t.type === 'hr' && cardOpen) { closeCard(); continue; }
    html += mk.parser([t]);
  }
  closeCard();
  return html;
}

// ---------- 読み合わせ ----------
function renderReading(md, ctx) {
  const lines = md.split('\n');
  let i = 0; let headerLines = [];
  // 見出し
  if (lines[0].startsWith('# ')) { ctx.h1 = lines[0].slice(2).trim(); ctx.h1Done = true; i = 1; }
  // 最初の --- までがヘッダー
  while (i < lines.length && lines[i].trim() !== '---') { headerLines.push(lines[i]); i++; }
  i++; // skip ---
  let html = '<div class="read-head">';
  const metaBuf = []; const ruleBuf = []; const other = [];
  for (const l of headerLines) {
    const s = l.trim(); if (!s) continue;
    if (/^読み手：/.test(s)) html += `<div class="readers" data-a="${ctx.aid(s)}"><span class="readers-label">読み手</span>${formatReaders(s.replace(/^読み手：/, ''))}</div>`;
    else if (/^出典：/.test(s)) metaBuf.push(s.replace(/^出典：/, ''));
    else if (/^【新規執筆】/.test(s)) { ctx.badges.push('新規執筆'); metaBuf.push(s.replace(/^【新規執筆】/, '新規執筆：')); }
    else if (/^- /.test(s)) ruleBuf.push(s);
    else if (/^\*\*(重要|読み手へ|注意|表記ルール)/.test(s)) other.push(s);
    else other.push(s);
  }
  html += '</div>\n';
  if (ruleBuf.length || other.length) html += `<div class="callout">${renderMd([...other, '', ...ruleBuf].join('\n'), ctx)}</div>\n`;
  if (metaBuf.length) html += `<details class="note meta" data-a="${ctx.aid('meta' + metaBuf.join())}"><summary><span class="note-chip">制作メモ</span>出典・改稿の記録</summary><div class="note-body">${renderMd(metaBuf.join('\n\n'), ctx)}</div></details>\n`;

  html += '<div class="script">\n';
  let aside = [];
  const flushAside = () => {
    if (!aside.length) return;
    const text = aside.join('\n').trim(); aside = [];
    if (!text) return;
    html += `<div class="aside">${renderMd(text, ctx)}</div>\n`;
  };
  for (; i < lines.length; i++) {
    const raw = lines[i]; const s = raw.trim();
    if (!s) { if (aside.length) aside.push(''); continue; }
    if (s === '---') { flushAside(); html += '<hr class="sep">\n'; continue; }
    let m;
    if ((m = s.match(/^(#{2,3})\s+(.*)$/))) {
      flushAside();
      const level = m[1].length; const text = m[2];
      const id = ctx.aid(text, 'h'); ctx.toc.push({ id, text, level });
      html += `<h${level} id="${id}" class="h${level} read-sec" data-a="${id}">${esc(text)}</h${level}>\n`;
      continue;
    }
    if (/^■/.test(s)) { flushAside(); html += `<div class="scene" data-a="${ctx.aid(s)}">${esc(s.replace(/^■\s*/, ''))}</div>\n`; continue; }
    if (/^ト書き：/.test(s)) { flushAside(); html += `<div class="reader-tag" data-a="${ctx.aid(s)}">${esc(s)}</div>\n`; continue; }
    if (/^（.*）$/.test(s) && !/「/.test(s.slice(0, 2))) { flushAside(); html += `<div class="stage" data-a="${ctx.aid(s)}">${inlineMd(s)}</div>\n`; continue; }
    if ((m = s.match(/^([^「」\s]{1,14}?)(（[^）「」]{1,12}）)?「([\s\S]*)」$/))) {
      flushAside();
      const who = m[1]; const mod = m[2] ? m[2].slice(1, -1) : '';
      const key = SPEAKERS[who] || (who === '地の文' ? 'narr' : 'npc');
      html += `<div class="line sp-${key}" data-a="${ctx.aid(s)}"><span class="who">${esc(who)}${mod ? `<small>${esc(mod)}</small>` : ''}</span><span class="say">「${inlineMd(m[3])}」</span></div>\n`;
      continue;
    }
    aside.push(raw);
  }
  flushAside();
  html += '</div>\n';
  return html;
}
function formatReaders(s) {
  return s.split('／').map((part) => {
    const t = part.trim();
    const pc = t.match(/PC(\d)/);
    const who = pc ? ['', 'sarah', 'luke', 'doc', 'marty'][+pc[1]] : '';
    return `<span class="reader${who ? ' rd-' + who : ''}">${inlineMd(t)}</span>`;
  }).join('');
}
const inlineMk = new Marked({ gfm: true, breaks: true });
const inlineMd = (s) => inlineMk.parseInline(s);

// ---------- 旧HTML（レビューv3） ----------
function renderLegacyHtml(src, ctx) {
  let h = src.replace(/<!--[\s\S]*?-->/g, '').replace(/\sstyle="[^"]*"/g, '');
  h = h.replace(/<div class="maker">([\s\S]*?)<\/div>/g, (_, inner) => `<details class="note meta"><summary><span class="note-chip">制作者向け</span>${esc(strip(inner).slice(0, 40))}…</summary><div class="note-body"><p>${inner}</p></div></details>`);
  h = h.replace(/<span class="tag ok">/g, '<span class="badge ok">').replace(/<span class="tag warn">/g, '<span class="badge warn">').replace(/<span class="tag unknown">/g, '<span class="badge unknown">').replace(/<span class="tag bad">/g, '<span class="badge bad">');
  h = h.replace(/<article class="card"/g, '<article class="cardx v3card"').replace(/<div class="card">/g, '<div class="cardx v3card">');
  h = h.replace(/<div class="player">/g, '<div class="player-box">').replace(/<div class="important">/g, '<div class="callout">');
  // 見出し・段落・行にアンカーを付ける
  h = h.replace(/<(h2|h3|h4)>([\s\S]*?)<\/\1>/g, (_, tag, inner) => {
    const id = ctx.aid(inner, 'h');
    if (tag !== 'h4') ctx.toc.push({ id, text: strip(inner), level: tag === 'h2' ? 2 : 3 });
    return `<${tag} id="${id}" class="${tag}" data-a="${id}">${inner}</${tag}>`;
  });
  h = h.replace(/<(p|li|tr)(\s[^>]*)?>([\s\S]*?)<\/\1>/g, (all, tag, attrs = '', inner) => `<${tag}${attrs} data-a="${ctx.aid(inner, tag === 'tr' ? 'r' : 'a')}">${inner}</${tag}>`);
  h = h.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>').replace(/<div class="scroll">/g, '<div>');
  return h;
}

// ---------- 組み立て ----------
const pages = [];
for (const p of P) {
  const ctx = makeCtx(p); ctx.badges = [];
  let html = '';
  if (p.kind === 'link') {
    html = '<div class="callout"><p>前の確認サイト（Ver.4.1.1、2026-09-28）は別画面で開きます。旧サイトのメモもそのまま見られます。</p><p><a class="btn primary" href="https://noraelf-creator.github.io/mta-review/" target="_blank" rel="noopener">旧確認サイトを開く</a></p></div>';
    ctx.h1 = '旧確認サイト（Ver.4.1.1）';
  } else {
    const src = fs.readFileSync(p.file, 'utf8').replace(/\r\n/g, '\n');
    if (p.kind === 'read') html = renderReading(src, ctx);
    else if (p.kind === 'html') { html = renderLegacyHtml(src, ctx); ctx.h1 = '別荘事件レビューv3（改訂元の正本）'; }
    else html = renderMd(src, ctx, { kind: p.kind });
  }
  if (p.kind === 'ho' && ctx.h1) {
    const hm = ctx.h1.match(/【あなたは\s*(.+?)】/);
    const pcKey = (p.id.match(/^ho-pc(\d)/) || [])[1];
    const tone = pcKey ? ['', 'sarah', 'luke', 'doc', 'marty'][+pcKey] : 'common';
    html = `<div class="ho-hero tone-${tone}"><div class="ho-kicker">${esc(ctx.kicker || '')}</div><div class="ho-name">${esc(hm ? hm[1] : ctx.h1)}</div></div>\n` + html;
  }
  const text = strip(html).replace(/\s+/g, ' ').trim();
  const rel = p.file ? path.relative(path.join(ROOT, 'content'), p.file).replace(/\\/g, '/') : '';
  const hoName = p.kind === 'ho' && ctx.h1 ? (ctx.h1.match(/【あなたは\s*(.+?)】/) || [])[1] : null;
  pages.push({ id: p.id, group: p.group, sub: p.sub, nav: p.nav, kind: p.kind, audience: p.audience, title: hoName ? hoName + '　' + p.nav : (ctx.h1 || p.nav), badges: ctx.badges, source: rel, toc: ctx.toc, html, text });
}

const data = { version: 'v5', built: new Date().toISOString(), groups: GROUPS, pages };
fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'data', 'site-data.js'), 'window.SITE_DATA=' + JSON.stringify(data) + ';\n');
const size = fs.statSync(path.join(ROOT, 'data', 'site-data.js')).size;
console.log('pages:', pages.length, 'size:', (size / 1024).toFixed(0) + 'KB');
for (const g of GROUPS) console.log(' ', g.label, pages.filter((x) => x.group === g.id).length);
