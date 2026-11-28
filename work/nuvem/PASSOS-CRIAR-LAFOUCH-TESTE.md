# Passos para o dono preparar o projeto "lafouch-teste" (NUVEM · 28/11/2026)
**CORREÇÃO 17:11: o projeto lafouch-teste JÁ EXISTE e é nosso (criado em 02/11: Firebase Test Lab dos celulares reais e o modo
#projteste do app). NÃO EXCLUIR. O passo 1 sai; o dono só confere os passos 2 a 6 nele.**
Nome do projeto: **lafouch-teste** (o .firebaserc já espera esse ID no alias "teste"). Leva ~10 min, tudo pelo celular ou PC.
Não copie nenhum dado, não crie chaves, não cadastre apps — isso a NUVEM faz depois, sem chave guardada.

1. Criar o projeto
   https://console.firebase.google.com
   → "Adicionar projeto" → nome: lafouch-teste → CONFIRA o ID que aparece embaixo do nome: precisa ser `lafouch-teste`.
   Se o Google mostrar outro (ex.: lafouch-teste-1a2b3), anote e mande o ID exato. Google Analytics: DESLIGADO → Criar.
2. Plano Blaze (as funções exigem)
   No projeto novo: "Fazer upgrade" (embaixo, à esquerda) → Blaze → escolher a MESMA conta de faturamento da LaFouch.
3. Alerta de US$ 1
   https://console.cloud.google.com/billing/budgets
   → "Criar orçamento" → nome: lafouch-teste · Projetos: só lafouch-teste · Valor: US$ 1 · avisos em 50%, 90% e 100% por e-mail → Salvar.
   (O alerta só avisa, não corta. O uso de teste deve ficar em US$ 0.)
4. Banco de dados
   Firebase › Criação › Firestore Database → Criar → modo de PRODUÇÃO → local: southamerica-east1 (São Paulo, o mesmo das funções).
5. Login anônimo (para o app de teste mandar o relatório)
   Firebase › Criação › Authentication → Começar → Método de login → Anônimo → Ativar → Salvar.
6. Armazenamento (fotos da tela dos relatórios)
   Firebase › Criação › Storage → Começar → modo de PRODUÇÃO → southamerica-east1.
7. Mande o print da página inicial do projeto (com o ID visível). Pronto: a parte do dono acabou.

Depois (NUVEM, quando o dono liberar a Fase 3): um script `tools/configura-teste.sh`, igual ao da publicação de hoje, que o dono
roda uma vez no Cloud Shell. Ele cria SEM CHAVE (prova do GitHub, Workload Identity) as duas contas do projeto de teste:
`github-publica` (só publica funções/regras no teste) e `github-le` (só lê os relatórios). Nada de chave nos segredos.
