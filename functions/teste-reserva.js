// Testes da regra de reserva, com um "Firestore de mentira" que se comporta como o real:
// transações otimistas (se alguém mexeu no documento lido, repete) e exigência de ler tudo antes de gravar.
'use strict';
const assert = require('assert');
const R = require('./reserva');

class FakeDb {
  constructor() { this.m = new Map(); this.atraso = 4; }
  seed(path, data) { this.m.set(path, { v: 1, data: JSON.parse(JSON.stringify(data)) }); }
  ler(path) { const d = this.m.get(path); return d && !d.apagado ? JSON.parse(JSON.stringify(d.data)) : null; }
  collection(c) { return { doc: (id) => this._doc(c + '/' + id) }; }
  _doc(path) {
    const db = this;
    return { path, async get() { const d = db.m.get(path); return { exists: !!d && !d.apagado, data: () => d && JSON.parse(JSON.stringify(d.data)) }; } };
  }
  async runTransaction(fn) {
    for (let t = 0; t < 40; t++) {
      const lidos = new Map(), grava = new Map(); let gravou = false;
      const tx = {
        get: async (ref) => {
          if (gravou) throw new Error('Firestore: todas as leituras devem vir antes das gravações');
          await new Promise((r) => setTimeout(r, Math.random() * this.atraso));
          const d = this.m.get(ref.path); lidos.set(ref.path, d ? d.v : 0);
          return { exists: !!d && !d.apagado, data: () => d && JSON.parse(JSON.stringify(d.data)) };
        },
        set: (ref, data) => { gravou = true; grava.set(ref.path, data); },
        delete: (ref) => { gravou = true; grava.set(ref.path, null); },
      };
      const r = await fn(tx);
      await new Promise((r2) => setTimeout(r2, Math.random() * this.atraso));
      let ok = true; for (const [p, v] of lidos) { const d = this.m.get(p); if ((d ? d.v : 0) !== v) ok = false; }
      if (ok) { for (const [p, data] of grava) { const d = this.m.get(p); if (data === null) this.m.set(p, { v: (d ? d.v : 0) + 1, data: null, apagado: true }); else this.m.set(p, { v: (d ? d.v : 0) + 1, data: JSON.parse(JSON.stringify(data)) }); } return r; }
    }
    throw new Error('contenção demais');
  }
}
const prod = (qs, cn) => ({ nome: 'X', cn: cn || ['Rosa', 'Preto'], qs, est: qs.reduce((a, b) => a + b, 0), lib: true });
const novo = (qs, cn) => { const db = new FakeDb(); db.seed('produtos/SL1', prod(qs, cn)); return db; };
const disp = (db, cor, agora) => R.disponivel(db.ler('produtos/SL1'), db.ler('estoque/SL1') || { res: {} }, cor, agora);

let total = 0; const falhas = [];
async function teste(nome, fn) { total++; try { await fn(); console.log('  ok   ' + nome); } catch (e) { falhas.push(nome); console.log(' FALHA ' + nome + '\n        ' + (e.stack || e.message).split('\n').slice(0, 3).join('\n        ')); } }
const rej = (p, motivo) => assert.rejects(p, (e) => e instanceof R.Falha && e.motivo === motivo, 'esperava falha ' + motivo);
const T0 = 1_000_000_000_000;

(async () => {
  await teste('10 clientes ao mesmo tempo, 5 peças: exatamente 5 conseguem (30 rodadas)', async () => {
    for (let i = 0; i < 30; i++) {
      const db = novo([5, 0]);
      const r = await Promise.allSettled(Array.from({ length: 10 }, (_, k) => R.reservar(db, T0, 'P' + 1000 + k, [{ ref: 'SL1', cor: 'Rosa', q: 1 }])));
      assert.strictEqual(r.filter((x) => x.status === 'fulfilled').length, 5);
      assert.strictEqual(r.filter((x) => x.status === 'rejected' && x.reason.motivo === 'esgotado').length, 5);
      assert.strictEqual(disp(db, 'Rosa', T0), 0);
    }
  });
  await teste('cores diferentes não se atrapalham (Rosa esgotada, Preto livre)', async () => {
    const db = novo([1, 3]);
    await R.reservar(db, T0, 'PAAA1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]);
    await rej(R.reservar(db, T0, 'PBBB1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]), 'esgotado');
    await R.reservar(db, T0, 'PBBB1', [{ ref: 'SL1', cor: 'Preto', q: 2 }]);
    assert.strictEqual(disp(db, 'Preto', T0), 1);
  });
  await teste('cor sem diferença de maiúscula ("rosa")', async () => {
    const db = novo([2, 0]); await R.reservar(db, T0, 'PAAA1', [{ ref: 'SL1', cor: 'rosa', q: 1 }]); assert.strictEqual(disp(db, 'Rosa', T0), 1);
  });
  await teste('pedido com vários itens é tudo ou nada', async () => {
    const db = novo([3, 0]); db.seed('produtos/SL2', prod([0], ['Azul']));
    const f = await R.reservar(db, T0, 'PAAA1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }, { ref: 'SL2', cor: 'Azul', q: 1 }]).catch((e) => e);
    assert.ok(f instanceof R.Falha && f.extra.falta.length === 1 && f.extra.falta[0].ref === 'SL2');
    assert.strictEqual(disp(db, 'Rosa', T0), 3);
  });
  await teste('mesma peça em duas linhas do pedido soma (2+2 com 3 em estoque falha)', async () => {
    const db = novo([3, 0]);
    await rej(R.reservar(db, T0, 'PAAA1', [{ ref: 'SL1', cor: 'Rosa', q: 2 }, { ref: 'SL1', cor: 'Rosa', q: 2 }]), 'esgotado');
  });
  await teste('repetir o mesmo pedido (clique duplo) não reserva em dobro', async () => {
    const db = novo([2, 0]);
    await Promise.all([1, 2, 3].map(() => R.reservar(db, T0, 'PAAA1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }])));
    assert.strictEqual(disp(db, 'Rosa', T0), 1);
  });
  await teste('10 min sem pagar: a peça volta; antes disso continua presa', async () => {
    const db = novo([1, 0]);
    await R.reservar(db, T0, 'PAAA1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]);
    await rej(R.reservar(db, T0 + R.PRAZO_MS - 1, 'PBBB1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]), 'esgotado');
    await R.reservar(db, T0 + R.PRAZO_MS + 1, 'PBBB1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]);
  });
  await teste('o servidor limpa reservas vencidas ao gravar (o documento não incha)', async () => {
    const db = novo([5, 0]);
    for (let i = 0; i < 4; i++) await R.reservar(db, T0, 'PX' + i + '000', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]);
    await R.reservar(db, T0 + R.PRAZO_MS + 5, 'PNOVO1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]);
    assert.strictEqual(Object.keys(db.ler('estoque/SL1').res).length, 1);
  });
  await teste('dono confirma o pagamento: a peça não expira mais', async () => {
    const db = novo([1, 0]);
    await R.reservar(db, T0, 'PAAA1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]);
    await R.pagar(db, T0 + 60000, 'PAAA1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]);
    await rej(R.reservar(db, T0 + 5 * 3600 * 1000, 'PBBB1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]), 'esgotado');
  });
  await teste('comprovante enviado: a peça fica presa por 12 h para o dono conferir', async () => {
    const db = novo([1, 0]);
    await R.reservar(db, T0, 'PAAA1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]);
    await R.comprovante(db, T0 + 9 * 60000, 'PAAA1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]);
    await rej(R.reservar(db, T0 + 3 * 3600 * 1000, 'PBBB1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]), 'esgotado');
    await R.reservar(db, T0 + 13 * 3600 * 1000, 'PBBB1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]);
  });
  await teste('pagou depois dos 10 min e a peça ainda está livre: o pagamento reserva de novo', async () => {
    const db = novo([1, 0]);
    await R.reservar(db, T0, 'PAAA1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]);
    await R.pagar(db, T0 + 30 * 60000, 'PAAA1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]);
    assert.strictEqual(disp(db, 'Rosa', T0 + 30 * 60000), 0);
  });
  await teste('pagou depois dos 10 min e a peça já foi para outra pessoa: avisa o dono ("expirou")', async () => {
    const db = novo([1, 0]);
    await R.reservar(db, T0, 'PAAA1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]);
    await R.reservar(db, T0 + 11 * 60000, 'PBBB1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]);
    const f = await R.pagar(db, T0 + 12 * 60000, 'PAAA1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]).catch((e) => e);
    assert.ok(f instanceof R.Falha && f.motivo === 'expirou');
    assert.strictEqual(db.ler('estoque/SL1').res['PBBB1~rosa'].q, 1); // a outra reserva continua intacta
  });
  await teste('pagar duas vezes não duplica', async () => {
    const db = novo([2, 0]); const it = [{ ref: 'SL1', cor: 'Rosa', q: 1 }];
    await R.reservar(db, T0, 'PAAA1', it); await R.pagar(db, T0 + 1, 'PAAA1', it); await R.pagar(db, T0 + 2, 'PAAA1', it);
    assert.strictEqual(disp(db, 'Rosa', T0 + 3), 1);
  });
  await teste('cliente cancela / dono libera: a peça volta na hora', async () => {
    const db = novo([1, 0]); const it = [{ ref: 'SL1', cor: 'Rosa', q: 1 }];
    await R.reservar(db, T0, 'PAAA1', it); await R.liberar(db, T0 + 5, 'PAAA1', ['SL1']);
    await R.reservar(db, T0 + 6, 'PBBB1', it);
  });
  await teste('liberar um pedido não mexe nas reservas dos outros', async () => {
    const db = novo([3, 0]); const it = [{ ref: 'SL1', cor: 'Rosa', q: 1 }];
    await R.reservar(db, T0, 'PAAA1', it); await R.reservar(db, T0, 'PBBB1', it);
    await R.liberar(db, T0 + 5, 'PAAA1', ['SL1']);
    assert.strictEqual(disp(db, 'Rosa', T0 + 6), 2);
  });
  await teste('comprovante recusado: volta ao prazo normal de 10 min', async () => {
    const db = novo([1, 0]); const it = [{ ref: 'SL1', cor: 'Rosa', q: 1 }];
    await R.reservar(db, T0, 'PAAA1', it); await R.pagar(db, T0 + 1, 'PAAA1', it); await R.recusar(db, T0 + 2, 'PAAA1', ['SL1']);
    await rej(R.reservar(db, T0 + 5 * 60000, 'PBBB1', it), 'esgotado');
    await R.reservar(db, T0 + 11 * 60000, 'PBBB1', it);
  });
  await teste('o app vendeu no balcão (estoque físico caiu): o disponível acompanha', async () => {
    const db = novo([2, 0]); await R.reservar(db, T0, 'PAAA1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]);
    db.seed('produtos/SL1', prod([1, 0])); // app publicou 1 peça física
    assert.strictEqual(disp(db, 'Rosa', T0), 0);
    await rej(R.reservar(db, T0, 'PBBB1', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]), 'esgotado');
  });
  await teste('produto escondido, inexistente, cor errada ou quantidade absurda são recusados', async () => {
    const db = novo([5, 0]); db.seed('produtos/SL9', { ...prod([5], ['Azul']), oculto: true });
    await rej(R.reservar(db, T0, 'PAAA1', [{ ref: 'SL9', cor: 'Azul', q: 1 }]), 'esgotado');
    await rej(R.reservar(db, T0, 'PAAA1', [{ ref: 'NAO', cor: '', q: 1 }]), 'esgotado');
    await rej(R.reservar(db, T0, 'PAAA1', [{ ref: 'SL1', cor: 'Verde', q: 1 }]), 'esgotado');
    await rej(R.reservar(db, T0, 'PAAA1', [{ ref: 'SL1', cor: 'Rosa', q: 999 }]), 'itens');
    await rej(R.reservar(db, T0, 'x', [{ ref: 'SL1', cor: 'Rosa', q: 1 }]), 'pedido');
    await rej(R.reservar(db, T0, 'PAAA1', []), 'itens');
  });
  await teste('produto de uma cor só (sem lista de cores) aceita cor vazia e usa o total', async () => {
    const db = new FakeDb(); db.seed('produtos/UM', { nome: 'U', est: 2, lib: true });
    await R.reservar(db, T0, 'PAAA1', [{ ref: 'UM', cor: '', q: 2 }]);
    await rej(R.reservar(db, T0, 'PBBB1', [{ ref: 'UM', cor: '', q: 1 }]), 'esgotado');
  });
  await teste('várias reservas e liberações ao mesmo tempo nunca deixam o disponível negativo (50 rodadas)', async () => {
    for (let i = 0; i < 50; i++) {
      const db = novo([4, 0]); const it = [{ ref: 'SL1', cor: 'Rosa', q: 1 }];
      const ops = [];
      for (let k = 0; k < 8; k++) ops.push(R.reservar(db, T0, 'P' + k + '0000', it).catch(() => null));
      ops.push(Promise.resolve().then(() => R.liberar(db, T0, 'P00000', ['SL1'])));
      await Promise.all(ops);
      assert.ok(disp(db, 'Rosa', T0) >= 0, 'negativo na rodada ' + i);
    }
  });
  await teste('sem reservas o documento de estoque é apagado (a lista pública fica vazia)', async () => {
    const db = novo([2, 0]); const it = [{ ref: 'SL1', cor: 'Rosa', q: 1 }];
    await R.reservar(db, T0, 'PAAA1', it); assert.ok(db.ler('estoque/SL1'));
    await R.liberar(db, T0 + 1, 'PAAA1', ['SL1']); assert.strictEqual(db.ler('estoque/SL1'), null);
    await R.reservar(db, T0 + 2, 'PAAA1', it); await R.reservar(db, T0 + R.PRAZO_MS * 3, 'PBBB1', it);
    assert.deepStrictEqual(Object.keys(db.ler('estoque/SL1').res), ['PBBB1~rosa']);
  });
  console.log(total - falhas.length + '/' + total + ' testes passaram' + (falhas.length ? '  |  FALHARAM: ' + falhas.join(' ; ') : ''));
  process.exit(falhas.length ? 1 : 0);
})();
