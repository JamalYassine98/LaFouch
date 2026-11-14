// Limpeza por programa: apaga funções de módulo e ações ACT.x que NADA no app chama (provado por contagem de citações), em rodadas, até não sobrar nenhuma.
const acorn = require('/tmp/acorn/node_modules/acorn'), fs = require('fs'), path = require('path');
const R = '/home/claude/lafouch/', SRC = R + 'src/'; const POUPA = new Set(['estAbre', 'exemplo']);   // usados pelos testes ou por outro caminho
const out = []; let rodada = 0;
for (;;) {
  rodada++; const files = fs.readdirSync(SRC).filter(f => f.endsWith('.js')).sort(); const cod = {}; files.forEach(f => cod[f] = fs.readFileSync(SRC + f, 'utf8'));
  const tudo = Object.values(cod).join('\n') + fs.readFileSync(R + 'www/index.html', 'utf8'), testes = fs.readFileSync(R + 'tests/run.py', 'utf8'); const tirar = [];
  for (const f of files) {
    let ast; try { ast = acorn.parse('(function(){' + cod[f] + '\n})', { ecmaVersion: 2022, ranges: true }); } catch (e) { console.log('não li', f, e.message); continue; }
    const corpo = ast.body[0].expression.body.body, off = '(function(){'.length;
    for (const n of corpo) {
      let nome = null, tipo = null;
      if (n.type === 'FunctionDeclaration') { nome = n.id.name; tipo = 'função'; }
      else if (n.type === 'ExpressionStatement' && n.expression.type === 'AssignmentExpression' && n.expression.left.type === 'MemberExpression' && n.expression.left.object.name === 'ACT' && !n.expression.left.computed && n.expression.right.type === 'FunctionExpression') { nome = n.expression.left.property.name; tipo = 'ação'; }
      if (!nome || POUPA.has(nome) || testes.includes(nome)) continue;
      const cit = (tudo.match(new RegExp('(^|[^A-Za-z0-9_$])' + nome + '(?![A-Za-z0-9_$])', 'g')) || []).length;
      if (cit === 1) tirar.push({ f, nome, tipo, a: n.range[0] - off, b: n.range[1] - off });
    }
  }
  if (!tirar.length) break;
  const porArq = {}; tirar.forEach(t => (porArq[t.f] = porArq[t.f] || []).push(t));
  for (const f in porArq) {
    let s = cod[f];
    porArq[f].sort((x, y) => y.a - x.a).forEach(t => {
      let a = t.a, b = t.b; while (a > 0 && (s[a - 1] === ' ' || s[a - 1] === '\t')) a--;   // tira a indentação
      // comentário de linha colado logo acima pertence à função
      for (;;) { const ant = s.lastIndexOf('\n', a - 2); const lin = s.slice(ant + 1, a - 1); if (a > 1 && s[a - 1] === '\n' && /^\s*\/\//.test(lin)) a = ant + 1; else break; }
      if (s[b] === '\n') b++;
      out.push(rodada + ' · ' + t.tipo + ' ' + t.nome + ' · ' + f + ' · ' + s.slice(a, b).split('\n').length + ' linhas'); s = s.slice(0, a) + s.slice(b);
    });
    acorn.parse('(function(){' + s + '\n})', { ecmaVersion: 2022 }); fs.writeFileSync(SRC + f, s);
  }
  if (rodada > 8) break;
}
fs.writeFileSync('/tmp/acorn/limpeza.txt', out.join('\n') + '\n'); console.log('removidos:', out.length, 'em', rodada - 1, 'rodada(s)');
