// mta6（作業の正本）から content/ へサイト用のMarkdownを作る。content/ がサイトの元データ。
// 使い方: node tools/sync-content.mjs
import fs from 'node:fs';
import path from 'node:path';

const M = 'C:/02_claude.projects/mta6/';
const V5 = M + 'v5/';
const WB = M + 'src/MTA_PRODUCTION/PROJECT/00_WORKBENCH/';
const DST = path.resolve('content');
const rd = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const wr = (rel, s) => { const p = path.join(DST, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'); };

const keep = rd(path.join(DST, 'サイトの使い方.md'));
fs.rmSync(DST, { recursive: true, force: true });
wr('サイトの使い方.md', keep);

// ---------- 読み合わせ（正本WORKBENCHのrawScriptから） ----------
const reads = JSON.parse(rd(WB + '04_READ_ALOUD_WORKBENCH/source.json')).readings;
const mins = { READ_01: 10, READ_02: 10, READ_03: 8, READ_04: 8, READ_05: 8, READ_06: '5～15' };
for (const r of reads) {
  const n = r.readingId.slice(-2);
  const out = [`# R${n} ${r.title}`, '', `読み手：台詞＝PC本人／NPCとナレーション＝その場面で台詞の少ないPL${r.readingId === 'READ_06' ? '／一真の台詞は必ずPC1' : ''}`, `目安：${mins[r.readingId]}分`];
  if (r.readingId === 'READ_06') out.push('**読み手へ：** 最終投票の最多票で【J】【K】【X】のどれか一つだけを読む。【真相】はJ・Xの指示の位置で読む。');
  out.push('', '---', '');
  for (const line of r.rawScript.split('\n')) {
    const s = line.trim();
    if (!s) { out.push(''); continue; }
    const note = s.match(/^進行注記「(.*)」$/);
    if (note) {
      const t = note[1];
      if (/^【/.test(t)) out.push('', '## ' + t, '');
      else out.push(`（進行：${t}）`);
      continue;
    }
    out.push(s.replace(/^記録者「/, 'ジョー・カー「'));
  }
  wr(`読み合わせ/R${n}.md`, out.join('\n'));
}

// ---------- HO（hoDraftをHO-A／HO-Bに分ける） ----------
const chars = JSON.parse(rd(WB + '05_CHARACTER_HO/source.json')).characters;
for (const c of chars) {
  const [a, b] = c.hoDraft.replace(/^【HO-A】\n/, '').split('\n\n【HO-B】\n');
  const n = c.pcId.slice(-1);
  for (const [tag, body] of [['HO-A', a], ['HO-B', b]]) {
    const lines = body.split('\n').map((l) => {
      const h = l.match(/^【(.+)】$/);
      if (h) return '\n▼ ' + h[1] + '\n';
      if (/^\d{1,2}:\d{2}/.test(l)) return '**' + l + '**';
      return l;
    });
    wr(`HO/PC${n}_${tag}.md`, [`# 【あなたは ${c.name}】`, '', `PC${n}／${tag}（PL配布）`, '', ...lines].join('\n'));
  }
}

// ---------- カード ----------
const cards = JSON.parse(rd(WB + '03_CARD_WORKBENCH/source.json')).cards;
const groups = [
  ['カード/第1調査_C01-C30.md', '第1調査（C01～C30）', (id) => /^C(0\d|[12]\d|30)$/.test(id)],
  ['カード/第2調査_C31-C35.md', '第2調査（C31～C35）', (id) => /^C3[1-5]$/.test(id)],
  ['カード/第3調査_C36-C40.md', '第3調査（C36～C40）', (id) => /^C(3[6-9]|40)$/.test(id)],
  ['カード/ジョーのメモ_J01-J06.md', 'ジョーのメモ（J01～J06）', (id) => /^J\d\d$/.test(id)],
  ['カード/固定回答A_B.md', 'PC3の固定回答（A・B）', (id) => /^PC3_RESPONSE/.test(id)],
];
for (const [file, title, test] of groups) {
  const out = [`# ${title}`, ''];
  if (/J01/.test(title)) out.push('最終証拠の公開時に、置き時計の裏の宛名のない封筒から全員へ公開する。調査回数は使わない。', '');
  for (const c of cards.filter((x) => test(x.cardId))) {
    const label = /^PC3_RESPONSE_(.)$/.exec(c.cardId);
    out.push(`## ${label ? c.title : c.cardId + '　' + c.title.replace(/^J\d\d\s*/, '')}`, '');
    out.push(`*公開：${c.revealCondition}*`, '');
    out.push(c.frontText.replace(/\n/g, '\n\n'), '');
    if (c.backText && c.backText !== c.revealCondition) out.push(`（裏面）${c.backText}`, '');
    out.push('---', '');
  }
  wr(file, out.join('\n'));
}

// ---------- v5の資料 ----------
const copyMd = (from, to, title) => {
  let s = rd(from);
  if (title && !/^# /.test(s)) s = '# ' + title + '\n\n' + s;
  wr(to, s);
};
copyMd(V5 + '00_README.md', 'v5/00_README.md');
copyMd(V5 + '01_整合性チェック.md', 'v5/01_整合性チェック.md');
copyMd(V5 + '06_PC1進行カード.md', 'v5/06_PC1進行カード.md');
copyMd(V5 + '08_仮想プレイ検証.md', 'v5/08_仮想プレイ検証.md');
copyMd(V5 + '09_修正一覧と再検証.md', 'v5/09_修正一覧と再検証.md');
// 終幕資料は「記憶カード」と「ジョーの手帳」に分ける
{
  const s = rd(V5 + '05_終幕資料_v5.md').replace(/^# .*\n/, '');
  const parts = s.split(/\n(?=## \d\. )/);
  for (const p of parts) {
    const m = p.match(/^## \d\. (.+)/); if (!m) continue;
    const body = p.replace(/^## \d\. .+\n/, '').replace(/^> (.*)$/gm, ':::note 使い方\n$1\n:::').replace(/~~(.+?)~~/g, '<del>$1</del>');
    wr(`終幕/${m[1]}.md`, `# ${m[1]}\n\n${body}`);
  }
}

// ---------- 解説（07_解説_v5 のテキスト） ----------
const EX = V5 + '07_解説_v5/';
const txt2md = (s) => {
  const lines = s.split('\n'); const out = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const h = l.match(/^【(.+)】$/);
    if (h) { out.push('', '## ' + h[1], ''); continue; }
    const next = lines[i + 1] || '';
    if (l.trim() && !l.includes('|') && next.includes('|') && (lines[i + 2] || '').startsWith('---')) { out.push('', '## ' + l.trim(), ''); continue; }
    if (l.includes(' | ') && !(lines[i - 1] || '').includes(' | ') && out.length && out[out.length - 1] !== '') out.push('');
    out.push(l);
  }
  return out.join('\n');
};
wr('解説/作品概要.md', '# 作品概要\n\n' + rd(EX + '作品概要.txt').split('\n').join('\n\n'));
wr('解説/公開基本情報.md', '# 公開基本情報（PL配布）\n\n' + rd(EX + '公開基本情報.txt').split('\n').join('\n\n'));
wr('解説/事件真相.md', '# 事件真相\n\n' + txt2md(rd(EX + '事件真相.txt')).replace(/^関連カード：\n\[[\s\S]*?\n\]$/gm, (blk) => {
  try { const arr = JSON.parse(blk.replace(/^関連カード：\n/, '')); return '| カード | 内容 | 推理での役割 |\n|---|---|---|\n' + arr.map((r) => '| ' + r.join(' | ') + ' |').join('\n'); } catch { return blk; }
}));
wr('解説/全人物TL.md', '# 全人物タイムライン\n\n## 18時～22時（人物別）\n\n' + txt2md(rd(EX + '全人物TL.txt')));
wr('解説/最終推理.md', '# 最終推理の導線\n\n' + rd(EX + '最終推理.txt'));
wr('解説/GMレス進行.md', '# GMレス進行\n\n' + txt2md(rd(EX + 'GMレス進行.txt')));
{
  const raw = rd(EX + '登場人物.txt');
  const objs = raw.split(/\n\s*\n/).map((b) => { try { return JSON.parse(b); } catch { return null; } }).filter(Boolean);
  const out = ['# 登場人物', ''];
  for (const o of objs) {
    out.push(`## ${o.no}　${o.name}（${o.kind}・${o.card}）`, '', `| 項目 | 内容 |`, `|---|---|`);
    for (const [k, v] of [['性別・年齢', `${o.sex}・${o.age}`], ['役割', o.role], ['話し方', o.voice], ['秘密', o.secret], ['目的', o.goal], ['関係', o.relations]]) out.push(`| ${k} | ${String(v).replace(/\|/g, '｜')} |`);
    out.push('');
  }
  wr('解説/登場人物.md', out.join('\n'));
}

// ---------- 参照 ----------
copyMd(M + 'src/MTA_PRODUCTION/PROJECT/99_PROJECT_STATUS/01_HTML/00_LOCKED_SPEC_疑似テスト前正本.md', '参照/LOCKED_SPEC_Ver4.1.1.md');
copyMd(M + '再解釈フェイズ検証_v1.md', '参照/再解釈フェイズ検証_v1.md');
copyMd(M + '再解釈パート_JOKER/00_設計書_v3.md', '参照/終幕設計書_v3.md');

let n = 0; (function count(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? count(p) : n++; } })(DST);
console.log('wrote', n, 'files into', DST);
