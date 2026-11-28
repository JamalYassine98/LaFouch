# Área de testes separada dos dados reais — proposta da NUVEM · 28/11/2026 (Fase 3; NADA implementado, pausa)

## Escolha: um PROJETO Firebase só de teste ("lafouch-teste"), não coleções de teste no projeto real
- Separação de verdade: outro banco, outro login, outras regras, outras funções. O "LaFouch Teste" nem conhece o endereço do
  projeto real, então nenhum erro de código ou de regra consegue ler ou apagar dado da loja.
- Coleções "teste_" no projeto real foram descartadas: um caminho errado ou uma regra frouxa e o app de teste escreve no real.
- Custo: o dono cria o projeto no console (5 min) e liga o plano Blaze (as funções exigem); uso de teste cabe no grátis (G$ 0
  esperado). Alerta de orçamento em US$ 1 para avisar se algo fugir.

## O que roda no projeto de teste
- As MESMAS funções do main (mesmo código), com `MODO=teste` nos segredos desse projeto:
  - nenhum e-mail, WhatsApp ou aviso sai para fora: o envio vira registro numa coleção `saidas/` (a sessão confere o que teria saído);
  - sem robô do banco, sem Bancard real (só o ambiente de teste deles, quando houver); sem chave paga de IA (teto 0).
- Dados: só catálogo (produtos/estoque copiados do real por um script de leitura, SEM clientes, pedidos, cupons, compradores);
  clientes e pedidos de teste são inventados pelo próprio teste e marcados `teste: true`.
- Publicação: o mesmo workflow de publicar, com o alvo "teste" (outro segredo de conta de serviço). Toda versão da nuvem vai
  PRIMEIRO ao teste; o real só recebe o que passou nele (igual ao app).

## Relatório de erro + tela (só as sessões leem)
- O app de teste, quando algo falha, grava `relatorios/{id}`: versão, tela, ação, mensagem e pilha do erro, aparelho, hora
  (lista fechada de campos; texto cortado; nada de dado pessoal) e a foto da tela em Storage `relatorios/{id}.jpg` (≤ 400 KB, só imagem).
- Regras (projeto de teste): tudo fechado por padrão; `relatorios` e a foto: só CRIAR (nunca ler, mudar ou apagar), só pelo app de
  teste (login anônimo + App Check do app de teste), campos e tamanhos conferidos, no máximo N por aparelho por hora.
- Quem lê: só as sessões, por `python3 tools/relatorios.py` (ou um workflow do GitHub) com uma conta de serviço SÓ DE LEITURA desse
  projeto (segredo do GitHub). Nenhum celular, site ou app consegue ler.
- Limpeza: relatórios e fotos de teste somem sozinhos em 30 dias (regra de validade do Firestore/Storage) — só dados de teste.

## Provas (Argus/testes da nuvem)
- emulador do Firebase com as regras de teste: app de teste cria relatório ✓; lê/muda/apaga ✗; campo a mais ✗; foto grande ✗;
  sem App Check ✗; qualquer leitura de fora ✗.
- `MODO=teste`: nenhuma chamada de envio real (trava no código: o envio passa por um lugar só que respeita o modo).
- O app de teste não contém o identificador do projeto real (conferido no build).

## O que o dono faz (uma vez)
1. Criar o projeto "lafouch-teste" no console do Firebase e ligar o Blaze (com alerta de US$ 1).
2. Gerar duas contas de serviço (publicar e só-leitura) e guardar nos segredos do GitHub — a NUVEM passa o passo a passo.
