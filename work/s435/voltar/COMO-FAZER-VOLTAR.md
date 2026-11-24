# Voltar — achado da ESBOCO (24/11/2026, app real v640, simulador de celular)

Teste: `voltar.py` e `voltar2.py` (Início/abas → tela → voltar pelos 3 jeitos: seta "‹" da tela, voltar do navegador/PWA, voltar do Android).
Resultado em `voltar.json`, `voltar2.json`; fotos `voltar_regras_navegador.jpg`, `voltar_estudio_android.jpg`.

## O que está errado
1. **Voltar do navegador/PWA (gesto do celular no app instalado pelo site):** Preços › Regras (ou qualquer setor) → voltar vai direto ao **Início**, pulando Preços; o 2º voltar **sai do app**.
2. **Os 3 jeitos não dão o mesmo lugar:** Marketing (do Início) → seta e Android vão ao índice "Marketing", o navegador vai ao Início.
3. **Janela/tela por cima aberta** (Estúdio em Peças; Voltar no tempo em Ajustes): voltar do navegador troca a tela por baixo para o Início e a janela **continua aberta**; no Android o Estúdio fica aberto sobre o Início.

## Causa (regra 12a)
Há dois "voltar" separados:
- a **pilha** da navegação (src/99c-navegacao-s435.js: S.nvP, seta "‹", Android);
- o **histórico do endereço** (src/90-navegacao-dashboard.js setView faz pushState só quando muda S.view; src/94-acoes.js escuta popstate/hashchange e faz setView pelo #).
Setores (tiAbre), grupos e janelas não entram no histórico, então o voltar do navegador anda por outra trilha. Há ainda mais dois ouvintes de popstate (src/97u linha ~96 e src/99b), cada um consertando um caso.

## Como fazer (jeito natural, um lugar só)
- Um só dono do voltar: **99c**. Cada passo da pilha (abrir tela/setor/grupo) faz `history.pushState({nv: profundidade})`; cada janela de baixo e cada peça aberta também é um passo.
- **Um só** ouvinte de popstate (no 99c): janela aberta → fecha; peça aberta → fecha (o que hoje faz o 99b); senão → `nvVolta()`.
- A seta "‹" e o Android chamam `history.back()` (mesmo caminho); no Início, o Android pergunta "Sair do app?" como hoje.
- **Apaga** no mesmo passo: o popstate/hashchange do 94, o pushState do setView (fica só replaceState), o popstate do 97u e o do 99b (viram parte do ouvinte único).
- **Trava no Argus:** `voltar.py` vira prova — os 3 jeitos têm de dar a mesma tela em todos os caminhos, e nenhuma janela fica aberta depois do voltar.
- Nenhuma tela muda: é conserto "por dentro" (6b), mas o dono decide quando entra.
