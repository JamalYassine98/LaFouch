// Em que projeto as funções estão rodando (28/11/2026, Fase 3) — UM lugar só para tudo que muda entre a loja e o teste.
// lafouch-2f6bd = a loja real · lafouch-teste = o projeto de testes (o app "LaFouch Teste").
// No TESTE nada sai para fora: e-mail, GitHub (mídia) e qualquer envio externo viram um registro em saidas/
// (só o servidor grava; as sessões leem com a conta só-leitura). Os avisos ao celular (FCM) ficam: só chegam aos
// aparelhos de teste, que são os únicos cadastrados nesse projeto.
const PROJETO = process.env.GCLOUD_PROJECT || '';
const TESTE = PROJETO === 'lafouch-teste';

const PROJETOS = {
  'lafouch-2f6bd': { donoUid: 'jJzNDoMHtuRNOAF1GhJfNYDMlE63', chavePublica: 'AIzaSyAW-54tS1A_VL2EC9OJWFsw1EtboptpEvc' },
  'lafouch-teste': { donoUid: 'uvYpqxPJZjTsSE9SACouW0nZH4d2', chavePublica: 'AIzaSyDifvgzljzelUrabP903Z0F1m9m6snC_kU' },
};
// projeto desconhecido (emulador, testes locais): se comporta como TESTE para nada sair para fora, com o dono da loja
const P = PROJETOS[PROJETO] || PROJETOS['lafouch-2f6bd'];
const SAIDA_FORA = !!PROJETOS[PROJETO] && !TESTE; // só a loja real fala com o mundo

// registra no lugar de enviar: grava saidas/{auto} { tipo, resumo, ts } — nunca o conteúdo inteiro (sem dados pessoais à toa)
function registraSaida(db, tipo, resumo) {
  const r = { tipo: String(tipo).slice(0, 30), resumo: JSON.parse(JSON.stringify(resumo || {})), ts: Date.now(), projeto: PROJETO || 'local' };
  return db ? db.collection('saidas').add(r).then(() => r, () => r) : Promise.resolve(r);
}

module.exports = { PROJETO, TESTE, SAIDA_FORA, DONO_UID: P.donoUid, CHAVE_PUBLICA: P.chavePublica, registraSaida };
