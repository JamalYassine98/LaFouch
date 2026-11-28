#!/usr/bin/env bash
# Deixa o GitHub falar com o Google SEM guardar chave nenhuma (item 22, aprovado 20/11/2026; projeto de teste: Fase 3, liberada 28/11).
# Rodar UMA vez por projeto, pelo dono, no Cloud Shell (conta dona do projeto):
#   bash tools/configura-publicar-nuvem.sh          → loja real (lafouch-2f6bd) — já feito em 20/11
#   bash tools/configura-publicar-nuvem.sh teste    → projeto de teste (lafouch-teste)
# Pode rodar de novo sem estragar nada (o que já existe é pulado). Nunca apaga dados.
# O que faz:
#  1) cria a conta "github-publica" (só publica funções e regras) e dá a ela só os papéis da publicação
#  2) cria a "ponte" GitHub → Google que só aceita ESTE repositório no ramo main
#  só no teste: 3) conta "github-le" (só LÊ Firestore e Storage, para tools/relatorios.py)
#               4) segredos de mentira (RESEND_KEY, GH_APP_ID, GH_APP_KEY, PIX_ROBO) — no teste nada sai para fora (functions/ambiente.js)
#               5) liga os serviços que as funções usam e o que o primeiro build precisa
set -u
ONDE=${1:-loja}
case "$ONDE" in
  loja)  P=lafouch-2f6bd ;;
  teste) P=lafouch-teste ;;
  *) echo "uso: bash tools/configura-publicar-nuvem.sh [loja|teste]"; exit 1 ;;
esac
REPO=JamalYassine98/LaFouch
SA=github-publica@$P.iam.gserviceaccount.com
gcloud config set project "$P" >/dev/null
N=$(gcloud projects describe "$P" --format='value(projectNumber)') || { echo "ERRO: não achei o projeto $P"; exit 1; }
echo "Projeto $P (número $N)"
FALHOU=0
# conta recém-criada leva 1–2 min para existir em todo o Google: todo passo que usa uma conta tenta de novo (um lugar só)
tenta() { for T in 1 2 3 4 5 6; do "$@" >/dev/null 2>&1 && return 0; [ "$T" = 6 ] || { echo "…  esperando o Google ficar pronto (tentativa $T de 6)"; sleep 20; }; done; return 1; }
papel() { tenta gcloud projects add-iam-policy-binding "$P" --member="serviceAccount:$1" --role="$2" --condition=None -q && echo "ok  papel $2 → ${1%%@*}" || { echo "ERRO no papel $2"; FALHOU=1; }; }
conta() { gcloud iam service-accounts describe "$1@$P.iam.gserviceaccount.com" >/dev/null 2>&1 \
  || gcloud iam service-accounts create "$1" --display-name="$2" >/dev/null; echo "ok  conta $1"; }

APIS="iamcredentials.googleapis.com sts.googleapis.com"
[ "$ONDE" = teste ] && APIS="$APIS cloudfunctions.googleapis.com run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com \
  eventarc.googleapis.com pubsub.googleapis.com cloudscheduler.googleapis.com secretmanager.googleapis.com firebaserules.googleapis.com \
  firestore.googleapis.com firebasestorage.googleapis.com"
gcloud services enable $APIS >/dev/null && echo "ok  serviços ligados" || { echo "ERRO ao ligar os serviços"; exit 1; }

conta github-publica "GitHub publica a nuvem (LaFouch)"
for R in roles/cloudfunctions.admin roles/run.admin roles/iam.serviceAccountUser roles/artifactregistry.admin \
         roles/cloudbuild.builds.editor roles/secretmanager.viewer roles/secretmanager.secretAccessor \
         roles/cloudscheduler.admin roles/eventarc.admin roles/firebaserules.admin roles/firebase.developAdmin \
         roles/serviceusage.serviceUsageConsumer; do papel "$SA" "$R"; done
[ "$ONDE" = teste ] && papel "$SA" roles/firebasestorage.admin   # no teste o GitHub publica também as regras do Storage

if [ "$ONDE" = teste ]; then
  conta github-le "GitHub lê o projeto de teste (relatórios)"
  papel "github-le@$P.iam.gserviceaccount.com" roles/datastore.viewer
  papel "github-le@$P.iam.gserviceaccount.com" roles/storage.objectViewer
  # o primeiro build das funções num projeto novo usa a conta padrão do Compute
  for R in roles/cloudbuild.builds.builder roles/artifactregistry.writer roles/logging.logWriter roles/storage.objectViewer; do
    papel "$N-compute@developer.gserviceaccount.com" "$R"; done
  for S in RESEND_KEY GH_APP_ID GH_APP_KEY PIX_ROBO; do
    gcloud secrets describe "$S" >/dev/null 2>&1 || printf 'teste-sem-envio' | gcloud secrets create "$S" --data-file=- --replication-policy=automatic >/dev/null
    echo "ok  segredo de mentira $S"
    # as funções rodam com a conta padrão do Compute: ela lê o segredo (sem isto o deploy tenta dar o acesso e é barrado)
    tenta gcloud secrets add-iam-policy-binding "$S" --member="serviceAccount:$N-compute@developer.gserviceaccount.com" \
      --role=roles/secretmanager.secretAccessor --condition=None -q && echo "ok  funções leem $S" || { echo "ERRO no acesso a $S"; FALHOU=1; }
  done
  # o que o 1º deploy faria sozinho com poder de dono (no projeto real foi o dono quem publicou a 1ª vez): gatilhos e agenda
  tenta gcloud beta services identity create --service=pubsub.googleapis.com -q
  tenta gcloud beta services identity create --service=eventarc.googleapis.com -q
  papel "service-$N@gcp-sa-pubsub.iam.gserviceaccount.com" roles/iam.serviceAccountTokenCreator
  papel "service-$N@gcp-sa-eventarc.iam.gserviceaccount.com" roles/eventarc.serviceAgent
  for R in roles/run.invoker roles/eventarc.eventReceiver; do papel "$N-compute@developer.gserviceaccount.com" "$R"; done
  # provas na nuvem do teste (tools/teste-cupom): a conta de publicação assina o login de mentira do dono DO TESTE — só neste projeto
  tenta gcloud iam service-accounts add-iam-policy-binding "$SA" --member="serviceAccount:$SA" --role=roles/iam.serviceAccountTokenCreator -q \
    && echo "ok  github-publica assina logins de prova (só no teste)" || { echo "ERRO na assinatura de prova"; FALHOU=1; }
fi
[ "$FALHOU" = 1 ] && { echo "ERRO: algum papel não foi dado. Mande a foto desta tela para a sessão NUVEM."; exit 1; }

gcloud iam workload-identity-pools describe github --location=global >/dev/null 2>&1 \
  || gcloud iam workload-identity-pools create github --location=global --display-name="GitHub" >/dev/null
echo "ok  ponte (pool) github"
gcloud iam workload-identity-pools providers describe lafouch --location=global --workload-identity-pool=github >/dev/null 2>&1 \
  || gcloud iam workload-identity-pools providers create-oidc lafouch --location=global --workload-identity-pool=github \
       --issuer-uri="https://token.actions.githubusercontent.com" \
       --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
       --attribute-condition="assertion.repository=='$REPO' && assertion.ref=='refs/heads/main'" >/dev/null
echo "ok  ponte só para $REPO no ramo main"

liga() {
  tenta gcloud iam service-accounts add-iam-policy-binding "$1@$P.iam.gserviceaccount.com" --role=roles/iam.workloadIdentityUser \
    --member="principalSet://iam.googleapis.com/projects/$N/locations/global/workloadIdentityPools/github/attribute.repository/$REPO" -q \
    && echo "ok  o GitHub (só esse repositório) pode usar a conta $1" \
    || { echo "ERRO: não deu para ligar o GitHub à conta $1. Mande a foto desta tela para a sessão NUVEM."; exit 1; }
}
liga github-publica
[ "$ONDE" = teste ] && liga github-le
echo
echo "PRONTO. Avise a sessão NUVEM: 'configurei $ONDE, número $N'."
