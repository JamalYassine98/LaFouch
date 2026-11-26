# Proposta: regras 20 e 21 do CLAUDE.md com o Argus novo (para o dono aprovar — ESBOCO, 26/11/2026)

Hoje (a trocar no lugar, sem emenda):

> 20. **Site:** atualizar SITE-COMO-FUNCIONA → Argus com 0 falhas (`python3 work/fiscal/argus.py`: provas + comparador publicado × o que vai subir) → versão (`date +%s` no version.json e no index.html) → commit/push do catalogo → `node build.js` aqui e subir www/loja/.
>
> 21. **App:** testes (`python3 tests/run.py`) → fotos comparadas e "OK ESBOCO" (1b) → subir lafouch-vNNN no www/sw.js JUNTO com docs/novidades.json → commit/push em main. APK e Windows só quando o dono pedir: …

Proposta:

> 20. **Site:** atualizar SITE-COMO-FUNCIONA → versão (`date +%s` no version.json e no index.html) → commit do catalogo (sem push) → Argus: `python3 work/argus/setor_site/porta.py completa` até **SELO DADO** (~30 min: conferências do site, plantas aprovadas em todas as temáticas/letras/línguas, toques, medidor, mapa, nuvem no emulador do Firebase) → `python3 work/argus/motor/selo.py site` ok → push do catalogo → `node build.js` aqui e subir www/loja/. A cada passo da implementação: `porta.py rapida`.
>
> 21. **App:** subir lafouch-vNNN no www/sw.js JUNTO com docs/novidades.json → commit (sem push) → Argus: `python3 work/argus/setor_app/porta.py completa` até **SELO DADO** (inclui tests/run.py, as plantas aprovadas, o Android emulado e a nuvem) → `python3 work/argus/motor/selo.py app` ok → fotos comparadas e "OK ESBOCO" (1b) → push em main. A cada passo da implementação: `porta.py rapida`. APK e Windows só quando o dono pedir: …

Por que a ordem muda: o selo vale só para UM commit. Antes, a versão era trocada depois da conferência, e o que subia não era o que tinha sido conferido. Agora a versão entra no commit, o Argus confere esse commit, e só ele sobe.

O que sai junto, se aprovado: work/fiscal/argus.py, fiscal.py, provas.py, selos.py (o JS foi para work/argus/setor_site/js/selos.js), csp.py, conhecidos.json, base_visual.json, diferencas-aprovadas.txt; os medidores do kit que só o Argus antigo usa (mede.js, mede.py, mede_prova.py, alin.js, centro.js, olho.js, sobre.js, revisa) — conferindo antes, rodando, quem ainda usa cada um (regra 12d).

Enquanto o site não tiver plantas aprovadas, a porta do site não dá selo (falha "nenhuma planta do site aprovada"): as plantas do site vão ao dono em lote.
