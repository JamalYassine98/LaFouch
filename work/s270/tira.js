// tira do módulo as declarações de topo com os nomes dados (funções e ACT.x = ...), e a linha S.envFmt = ...
const acorn = require('/tmp/acorn/node_modules/acorn'), fs = require('fs');
const [arq, ...nomes] = process.argv.slice(2); let s = fs.readFileSync(arq, 'utf8'); const pre = '(function(){', N = new Set(nomes);
const ast = acorn.parse(pre + s + '\n})', { ecmaVersion: 2022, ranges: true }); const cortes = [];
for (const n of ast.body[0].expression.body.body) {
  let nome = null;
  if (n.type === 'FunctionDeclaration') nome = n.id.name;
  else if (n.type === 'ExpressionStatement' && n.expression.type === 'AssignmentExpression' && n.expression.left.type === 'MemberExpression') nome = (n.expression.left.object.name || '') + '.' + (n.expression.left.property.name || '');
  if (nome && N.has(nome)) cortes.push([n.range[0] - pre.length, n.range[1] - pre.length, nome]);
}
cortes.sort((a, b) => b[0] - a[0]).forEach(([a, b, nome]) => { while (a > 0 && (s[a - 1] === ' ' || s[a - 1] === '\t')) a--; for (;;) { const ant = s.lastIndexOf('\n', a - 2), lin = s.slice(ant + 1, a - 1); if (a > 1 && s[a - 1] === '\n' && /^\s*\/\//.test(lin)) a = ant + 1; else break; } if (s[b] === '\n') b++; s = s.slice(0, a) + s.slice(b); console.log('tirei', nome); });
acorn.parse(pre + s + '\n})', { ecmaVersion: 2022 }); fs.writeFileSync(arq, s);
