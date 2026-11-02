# Ambiente de teste (projeto Firebase separado)
Criado em 02/11/2026. Serve para testar sincronização/reserva SEM tocar na loja real.
- Projeto: lafouch-teste (nº 518966776962), Firestore Standard (default) em southamerica-east1, Blaze ativo.
- Dono do teste: jamalaliyassine@gmail.com, UID uvYpqxPJZjTsSE9SACouW0nZH4d2 (senha de teste só com o dono).
- Config pública do app Web: apiKey AIzaSyDifvgzljzelUrabP903Z0F1m9m6snC_kU · appId 1:518966776962:web:5e1158c47b9ac5db27d09b · authDomain lafouch-teste.firebaseapp.com
- Regras: as mesmas da loja, com o UID do teste.
- Função de reserva do teste: `npx firebase-tools deploy --only functions --project lafouch-teste` (index.js troca o UID do dono sozinho pelo GCLOUD_PROJECT).
- Nunca misturar: app/site de teste apontam para lafouch-teste; os de produção para lafouch-2f6bd.
