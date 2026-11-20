// S436 (20/11/2026) — estudo dos remendos do APP com o leitor de JavaScript de verdade (acorn), não por texto.
// Só leitura. Uso: NODE_PATH=/tmp/ac/node_modules node analisa.js  →  work/s436/remendos/analise.json
// Entende: função declarada 2+ vezes (a última declarada ganha; as outras NUNCA rodam), função trocada depois
// (nome = function), ação ACT.x escrita em 2+ lugares (inclusive na lista inicial), guarda da velha (var _x = x / A0[k] = ACT[k]),
// tabelas com a mesma chave escrita 2+ vezes, estilo criado pelo programa, conserto de tela depois de desenhar.
const fs = require('fs'), path = require('path');
const acorn = require('acorn'), walk = require('acorn-walk');
const RAIZ = path.join(__dirname, '..', '..', '..'), SRC = path.join(RAIZ, 'src');
const mods = fs.readdirSync(SRC).filter((f) => f.endsWith('.js')).sort();
let code = '(function () {\n', mapa = [], lin = 2;
for (const f of mods) {
  const t = fs.readFileSync(path.join(SRC, f), 'utf8');
  mapa.push([lin, f]);
  code += t;
  lin += t.split('\n').length - 1;
}
code += '})();\n';
const onde = (l) => { let r = mapa[0]; for (const m of mapa) { if (m[0] <= l) r = m; else break; } return { f: r[1], l: l - r[0] + 1 }; };
const ast = acorn.parse(code, { ecmaVersion: 2022, locations: true });
const topo = ast.body[0].expression.callee;

// ---- escopos: cada função conhece os nomes que declara
const esc = new Map();
function nomesDe(fn) {
  const s = new Set();
  (fn.params || []).forEach((p) => walk.simple(p, { Identifier(n) { s.add(n.name); } }));
  if (fn.id && fn.type === 'FunctionExpression') s.add(fn.id.name);
  walk.recursive(fn.body, null, {
    FunctionDeclaration(n) { if (n.id) s.add(n.id.name); },
    FunctionExpression() {}, ArrowFunctionExpression() {},
    VariableDeclaration(n, st, c) { n.declarations.forEach((d) => { walk.simple(d.id, { Identifier(i) { s.add(i.name); } }); if (d.init) c(d.init, st); }); },
    CatchClause(n, st, c) { if (n.param) walk.simple(n.param, { Identifier(i) { s.add(i.name); } }); c(n.body, st); },
  });
  return s;
}
const ehFn = (n) => n && /Function/.test(n.type);
walk.full(ast, (n) => { if (ehFn(n)) esc.set(n, nomesDe(n)); });
const doTopo = (nome, anc) => { // o nome usado aqui é o do escopo de cima (o do app inteiro)?
  for (let i = anc.length - 1; i >= 0; i--) { const a = anc[i]; if (ehFn(a)) { if (a === topo) return esc.get(topo).has(nome); if (esc.get(a).has(nome)) return false; } }
  return false;
};
const prof = (anc) => anc.filter((a) => ehFn(a)).length - 1; // 0 = roda ao abrir o app; >0 = dentro de outra função
const tam = (n) => n.loc.end.line - n.loc.start.line + 1;

const decl = {}, troca = {}, act = {}, guarda = [], tab = {}, estilo = [], obs = [], janela = {}, important = [];
// declarações no escopo do app
for (const st of topo.body.body) if (st.type === 'FunctionDeclaration') (decl[st.id.name] = decl[st.id.name] || []).push({ ...onde(st.loc.start.line), linhas: tam(st), no: st });
// funções nascidas como "var x = function" também podem ser trocadas depois
const varFn = {};
for (const st of topo.body.body) if (st.type === 'VariableDeclaration') st.declarations.forEach((d) => { if (d.id.type === 'Identifier' && ehFn(d.init)) varFn[d.id.name] = { ...onde(d.loc.start.line), linhas: tam(d) }; });

const chama = (fn, nomes) => { let ok = false; walk.simple(fn, { CallExpression(c) { let k = c.callee; if (k.type === 'MemberExpression' && !k.computed && /^(apply|call)$/.test(k.property.name)) k = k.object; if (k.type === 'Identifier' && nomes.includes(k.name)) ok = true; if (k.type === 'MemberExpression' && k.object.type === 'Identifier' && nomes.includes(k.object.name)) ok = true; } }); return ok; };
const textoDe = (n) => code.slice(n.start, n.end);

walk.fullAncestor(ast, (n, anc) => {
  if (n.type === 'AssignmentExpression' && n.operator === '=') {
    const L = n.left, R = n.right;
    if (L.type === 'Identifier' && ehFn(R) && doTopo(L.name, anc) && (decl[L.name] || varFn[L.name])) (troca[L.name] = troca[L.name] || []).push({ ...onde(n.loc.start.line), linhas: tam(R), prof: prof(anc), no: R });
    if (L.type === 'MemberExpression' && L.object.type === 'Identifier' && L.object.name === 'ACT' && doTopo('ACT', anc)) {
      const k = L.computed ? (L.property.type === 'Literal' ? String(L.property.value) : '[' + textoDe(L.property) + ']') : L.property.name;
      (act[k] = act[k] || []).push({ ...onde(n.loc.start.line), linhas: tam(R), prof: prof(anc), fn: ehFn(R), no: R });
    }
    // tabelas: NOME.chave = valor (NOME em maiúsculas, do escopo do app)
    if (L.type === 'MemberExpression' && L.object.type === 'Identifier' && /^[A-Z][A-Z0-9_]{2,}$/.test(L.object.name) && L.object.name !== 'ACT' && doTopo(L.object.name, anc) && !L.computed)
      ((tab[L.object.name] = tab[L.object.name] || {})[L.property.name] = (tab[L.object.name][L.property.name] || [])).push({ ...onde(n.loc.start.line), v: textoDe(R).slice(0, 60), prof: prof(anc) });
    // window.__x = …  (ponte entre arquivos que já dividem o mesmo escopo)
    if (L.type === 'MemberExpression' && L.object.type === 'Identifier' && L.object.name === 'window' && !L.computed && /^__/.test(L.property.name)) (janela[L.property.name] = janela[L.property.name] || { poe: [], usa: [] }).poe.push(onde(n.loc.start.line));
  }
  if (n.type === 'MemberExpression' && n.object.type === 'Identifier' && n.object.name === 'window' && !n.computed && /^__/.test(n.property.name)) {
    const p = anc[anc.length - 2];
    if (!(p && p.type === 'AssignmentExpression' && p.left === n)) (janela[n.property.name] = janela[n.property.name] || { poe: [], usa: [] }).usa.push(onde(n.loc.start.line));
  }
  if (n.type === 'VariableDeclarator' && n.init) {
    const I = n.init;
    if (I.type === 'Identifier' && (decl[I.name] || varFn[I.name]) && doTopo(I.name, anc) && n.id.type === 'Identifier') guarda.push({ de: I.name, em: n.id.name, ...onde(n.loc.start.line), prof: prof(anc) });
    if (I.type === 'MemberExpression' && I.object.type === 'Identifier' && I.object.name === 'ACT' && !I.computed && n.id.type === 'Identifier') guarda.push({ de: 'ACT.' + I.property.name, em: n.id.name, ...onde(n.loc.start.line), prof: prof(anc) });
  }
  if (n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && !n.callee.computed && n.callee.property.name === 'createElement' && n.arguments[0] && n.arguments[0].type === 'Literal' && n.arguments[0].value === 'style') estilo.push(onde(n.loc.start.line));
  if (n.type === 'NewExpression' && n.callee.type === 'Identifier' && /^(MutationObserver|ResizeObserver)$/.test(n.callee.name)) obs.push({ ...onde(n.loc.start.line), q: n.callee.name });
  if ((n.type === 'Literal' && typeof n.value === 'string' && /!important|'important'/.test(n.value)) || (n.type === 'TemplateElement' && /!important/.test(n.value.raw))) important.push({ ...onde(n.loc.start.line), n: ((n.value.raw || n.value).match(/!important/g) || [1]).length });
});
// ações na lista inicial (var ACT = { a: function…, … })
for (const st of topo.body.body) if (st.type === 'VariableDeclaration') st.declarations.forEach((d) => {
  if (d.id.name === 'ACT' && d.init && d.init.type === 'ObjectExpression') d.init.properties.forEach((p) => { const k = p.key.name || p.key.value; (act[k] = act[k] || []).unshift({ ...onde(p.loc.start.line), linhas: tam(p.value), prof: 0, fn: ehFn(p.value), lista: true, no: p.value }); });
  if (d.id.type === 'Identifier' && /^[A-Z][A-Z0-9_]{2,}$/.test(d.id.name) && d.init && d.init.type === 'ObjectExpression') d.init.properties.forEach((p) => { if (!p.key) return; const k = p.key.name || p.key.value; ((tab[d.id.name] = tab[d.id.name] || {})[k] = (tab[d.id.name][k] || [])).unshift({ ...onde(p.loc.start.line), v: textoDe(p.value).slice(0, 60), lista: true }); });
});

// ---- cadeias: quem vale de verdade e o que cada elo faz
const ord = (a, b) => mods.indexOf(a.f) - mods.indexOf(b.f) || a.l - b.l;
function tipo(fn, nomesVelha) {
  if (!ehFn(fn)) return 'aponta para outra';
  if (!chama(fn, nomesVelha)) return 'troca tudo';
  // onde a velha é chamada dentro da nova
  const corpo = fn.body.body || []; let i0 = -1, i1 = -1;
  corpo.forEach((s, i) => { if (chama({ type: 'Program', body: [s] }, nomesVelha) || (() => { let ok = false; walk.simple(s, { CallExpression(c) { let k = c.callee; if (k.type === 'MemberExpression' && !k.computed && /^(apply|call)$/.test(k.property.name)) k = k.object; if ((k.type === 'Identifier' && nomesVelha.includes(k.name)) || (k.type === 'MemberExpression' && k.object.type === 'Identifier' && nomesVelha.includes(k.object.name))) ok = true; } }); return ok; })()) { if (i0 < 0) i0 = i; i1 = i; } });
  const antes = i0 > 0, depois = i1 < corpo.length - 1 && !(i1 === corpo.length - 2 && corpo[corpo.length - 1].type === 'ReturnStatement' && corpo[corpo.length - 1].argument && corpo[corpo.length - 1].argument.type === 'Identifier');
  return antes && depois ? 'antes e depois' : antes ? 'desvio antes' : depois ? 'acréscimo depois' : 'só repassa';
}
const cadeias = [];
const nomes = new Set([...Object.keys(decl).filter((k) => decl[k].length > 1), ...Object.keys(troca)]);
for (const nome of nomes) {
  const ds = (decl[nome] || []).slice().sort(ord), ts = (troca[nome] || []).slice().sort(ord);
  const base = ds.length ? ds[ds.length - 1] : varFn[nome];
  const elos = [];
  ds.slice(0, -1).forEach((d) => elos.push({ f: d.f, l: d.l, linhas: d.linhas, tipo: 'MORTA (declarada de novo depois; nunca roda)' }));
  elos.push({ f: base.f, l: base.l, linhas: base.linhas, tipo: 'base' });
  ts.forEach((t) => {
    const g = guarda.filter((x) => x.de === nome && x.f === t.f && x.l <= t.l).map((x) => x.em);
    elos.push({ f: t.f, l: t.l, linhas: t.linhas, tipo: tipo(t.no, g), prof: t.prof, guarda: g[g.length - 1] || '' });
  });
  cadeias.push({ nome, forma: 'função', elos });
}
for (const k of Object.keys(act)) {
  const v = act[k].slice().sort((a, b) => (b.lista ? 1 : 0) - (a.lista ? 1 : 0) || ord(a, b));
  if (v.length < 2) continue;
  const elos = v.map((t, i) => {
    if (i === 0) return { f: t.f, l: t.l, linhas: t.linhas, tipo: 'base', prof: t.prof };
    const g = guarda.filter((x) => x.de === 'ACT.' + k && x.f === t.f && x.l <= t.l).map((x) => x.em);
    // 98z-s418: A0[k] = ACT[k] num laço — a velha é chamada por A0.k
    const viaA0 = /A0\./.test(textoDe(t.no));
    return { f: t.f, l: t.l, linhas: t.linhas, tipo: viaA0 ? 'pergunta nova + chama a velha calando a pergunta dela (A0)' : tipo(t.no, g), prof: t.prof, guarda: g[g.length - 1] || (viaA0 ? 'A0' : '') };
  });
  cadeias.push({ nome: 'ACT.' + k, forma: 'ação', elos });
}
// a última troca "troca tudo" mata tudo o que veio antes dela
cadeias.forEach((c) => { let ult = -1; c.elos.forEach((e, i) => { if (i > 0 && e.tipo === 'troca tudo' && !e.prof) ult = i; }); c.mortasPorTroca = ult > 0 ? c.elos.slice(0, ult).filter((e) => !/MORTA/.test(e.tipo)).map((e) => e.f + ':' + e.l) : []; });

const tabDup = {};
for (const T of Object.keys(tab)) for (const k of Object.keys(tab[T])) { const v = tab[T][k].filter((x) => !x.prof); if (v.length > 1) (tabDup[T] = tabDup[T] || {})[k] = v; }
const pontes = Object.keys(janela).filter((k) => janela[k].poe.length).map((k) => ({ nome: k, poe: janela[k].poe, usa: janela[k].usa.length, usaEm: [...new Set(janela[k].usa.map((u) => u.f))] }));
const limpa = (o) => JSON.parse(JSON.stringify(o, (k, v) => (k === 'no' ? undefined : v)));
const R = limpa({ modulos: mods.length, cadeias, guarda, tabDup, estilo, obs, pontes, important });
fs.writeFileSync(path.join(__dirname, 'analise.json'), JSON.stringify(R, null, 1));
const elosRem = cadeias.reduce((a, c) => a + c.elos.length - 1, 0), cont = {};
cadeias.forEach((c) => c.elos.filter((e) => e.tipo !== 'base').forEach((e) => { const t = /MORTA/.test(e.tipo) ? 'MORTA' : e.tipo.slice(0, 22); cont[t] = (cont[t] || 0) + 1; }));
console.log('módulos', mods.length, '| nomes com cadeia', cadeias.length, '| elos além do primeiro', elosRem, cont);
console.log('guardas da velha', guarda.length, '| tabelas com chave repetida', Object.keys(tabDup).map((t) => t + ':' + Object.keys(tabDup[t]).length).join(' '), '| estilo criado pelo programa', estilo.length, '| observadores', obs.length, '| pontes window.__', pontes.length, '| !important em texto do programa', important.reduce((a, x) => a + x.n, 0));

if (process.argv.includes('--lista')) cadeias.sort((a, b) => b.elos.length - a.elos.length).forEach((c) => console.log(c.nome.padEnd(20), c.elos.map((e) => e.f.replace('.js', '') + ':' + e.l + ' [' + e.tipo.slice(0, 18) + (e.prof ? ', dentro de função' : '') + ', ' + e.linhas + 'l]').join('  →  ')));
if (process.argv.includes('--tab')) console.log(JSON.stringify(tabDup, null, 0).slice(0, 6000));
