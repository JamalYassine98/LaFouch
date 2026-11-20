#!/usr/bin/env bash
# Item 22 (aprovado pelo dono 20/11/2026 08:21): deixa o GitHub publicar a nuvem SEM guardar chave nenhuma.
# Rodar UMA vez, pelo dono, no Cloud Shell (conta dona do projeto):  bash tools/configura-publicar-nuvem.sh
# Pode rodar de novo sem estragar nada (o que já existe é pulado).
# O que faz:
#  1) cria a conta "github-publica" (só para publicar funções e regras)
#  2) dá a ela só os papéis que a publicação precisa
#  3) cria a "ponte" GitHub → Google que só aceita ESTE repositório no ramo main
set -u
P=lafouch-2f6bd
REPO=JamalYassine98/LaFouch
SA=github-publica@$P.iam.gserviceaccount.com
gcloud config set project "$P" >/dev/null
N=$(gcloud projects describe "$P" --format='value(projectNumber)')
echo "Projeto $P (número $N)"

gcloud services enable iamcredentials.googleapis.com sts.googleapis.com >/dev/null && echo "ok  APIs da ponte ligadas"

gcloud iam service-accounts describe "$SA" >/dev/null 2>&1 \
  || gcloud iam service-accounts create github-publica --display-name="GitHub publica a nuvem (LaFouch)" >/dev/null
echo "ok  conta github-publica"

for R in roles/cloudfunctions.admin roles/run.admin roles/iam.serviceAccountUser roles/artifactregistry.admin \
         roles/cloudbuild.builds.editor roles/secretmanager.viewer roles/secretmanager.secretAccessor \
         roles/cloudscheduler.admin roles/eventarc.admin roles/firebaserules.admin roles/firebase.developAdmin \
         roles/serviceusage.serviceUsageConsumer; do
  gcloud projects add-iam-policy-binding "$P" --member="serviceAccount:$SA" --role="$R" --condition=None -q >/dev/null && echo "ok  papel $R"
done

gcloud iam workload-identity-pools describe github --location=global >/dev/null 2>&1 \
  || gcloud iam workload-identity-pools create github --location=global --display-name="GitHub" >/dev/null
echo "ok  ponte (pool) github"

gcloud iam workload-identity-pools providers describe lafouch --location=global --workload-identity-pool=github >/dev/null 2>&1 \
  || gcloud iam workload-identity-pools providers create-oidc lafouch --location=global --workload-identity-pool=github \
       --issuer-uri="https://token.actions.githubusercontent.com" \
       --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
       --attribute-condition="assertion.repository=='$REPO' && assertion.ref=='refs/heads/main'" >/dev/null
echo "ok  ponte só para $REPO no ramo main"

gcloud iam service-accounts add-iam-policy-binding "$SA" --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/$N/locations/global/workloadIdentityPools/github/attribute.repository/$REPO" -q >/dev/null
echo "ok  o GitHub (só esse repositório) pode usar a conta github-publica"
echo
echo "PRONTO. Avise a sessão NUVEM: 'configurei a publicação'."
