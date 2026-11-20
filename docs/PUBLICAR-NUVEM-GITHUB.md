# Publicar a nuvem pelo GitHub (item 22, aprovado pelo dono 20/11/2026 08:21)

**Para quê:** a sessão NUVEM publica as funções e as regras sem o dono rodar o Cloud Shell a cada vez.

## Como é seguro (sem chave guardada)
- Não existe senha nem chave salva em lugar nenhum: o GitHub prova ao Google "sou o repositório JamalYassine98/LaFouch, ramo main" (OIDC / Workload Identity), e o Google só aceita essa prova para a conta `github-publica`.
- A conta `github-publica` só tem os papéis de publicar funções e regras (não lê os dados das clientes, não mexe em cobrança).
- O workflow `.github/workflows/publicar-nuvem.yml` só roda quando chamado, só no `main`, e **só depois de TODOS os testes da nuvem passarem**. Sem `--force`: se a publicação fosse apagar alguma função, ela para.
- Quem pode chamar: quem tem permissão de escrita no repositório (o dono e as sessões dele).

## Configuração (uma vez, pelo dono, no Cloud Shell)
```
cd ~/LaFouch && git pull && bash tools/configura-publicar-nuvem.sh
```
O script é seguro para rodar de novo; no fim ele escreve "PRONTO".

## Como a NUVEM publica depois
```
gh api -X POST repos/JamalYassine98/LaFouch/actions/workflows/publicar-nuvem.yml/dispatches -f ref=main -f inputs[o_que]=functions
```
(`o_que`: `functions`, `regras` ou `tudo`). A NUVEM acompanha a rodada e confere a nuvem depois, como antes.

## Desligar (se um dia quiser)
```
gcloud iam workload-identity-pools delete github --location=global --project lafouch-2f6bd
```
