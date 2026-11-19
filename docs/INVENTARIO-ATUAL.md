# INVENTÁRIO — APP ATUAL (o que está no ar)

Memória das telas (regra do dono 18/11 22:59). Gerado por work/verif/passada.py + inventario.py. Atualizar só a tela que mudou: `MODO=atual SO=<tela> python3 passada.py && python3 inventario.py atual`.

Telas: 66 · botões tocados (3x cada): 501 · fotos: work/verif/inv/atual/img

## Famílias de botões

| Família | Qtd | Cara mais comum | Fogem do padrão |
|---|---|---|---|
| texto/linha tocável | 146 | texto · 15px · abre/mexe no lugar | 117 |
| linha de lista | 125 | texto · 15px · abre/mexe no lugar | 59 |
| opção/pílula | 52 | pílula · 13px · abre/mexe no lugar | 34 |
| fechar/voltar | 44 | texto · 26px · leva a outra tela | 26 |
| ícone | 39 | ícone redondo · 15px · leva a outra tela | 19 |
| link › (sai daqui) | 32 | texto · 15px · abre janela | 21 |
| perigo/desfazer | 26 | texto · 15px · abre/mexe no lugar | 17 |
| adicionar | 21 | texto · 18px · abre/mexe no lugar | 16 |
| principal (salvar/confirmar) | 13 | barra grande · 16px · abre/mexe no lugar | 8 |
| link ⌄ (abre no lugar) | 2 | texto · 15px · abre/mexe no lugar | 0 |
| barra de baixo | 1 | pílula · 15px · leva a outra tela | 0 |

## Regras quebradas (por regra)

**campo em caixa redonda (P3: linha fina)** — 50
- atacado-novo-acesso · "Lojista fixo" · caixa redonda · 
- atacado-novo-acesso · "Lojista fixo" · caixa redonda · 
- atacado-novo-acesso · "Lojista fixo" · caixa redonda · 
- caixa-conferir · "Guaranis" · caixa redonda · 
- caixa-conferir · "Dólares" · caixa redonda · 
- caixa-conferir · "Reais" · caixa redonda · 
- caixa-conferir · "" · caixa redonda · 
- caixa-conferir · "" · caixa redonda · 
- caixa-conferir · "" · caixa redonda · 
- caixa-novo-objetivo · "O QUE QUER PARA A LOJA" · caixa redonda · 
- caixa-novo-objetivo · "QUANTO CUSTA" · caixa redonda · 
- caixa-novo-objetivo · "QUERO ATÉ" · caixa redonda · 
- caixa-retirar · "Retirada do dono" · caixa redonda · 
- caixa-retirar · "Retirada do dono" · caixa redonda · 
- cambio-troca · "Entreguei" · caixa redonda · 
- cambio-troca · "Recebi" · caixa redonda · 
- cambio-troca · "Você troca" · caixa redonda · 
- cambio-troca · "Você recebe" · caixa redonda · 
- catalogo-pagamento · "VALOR RECEBIDO" · caixa redonda · 
- catalogo-pagamento · "Nome, telefone ou documento" · caixa redonda · 
- clientes · "Clientes" · caixa redonda · 
- dash-mes-vendido · "Buscar produto ou conta" · caixa redonda · 
- despesas-conta · "Salvar" · caixa redonda · 
- despesas-conta · "Salvar" · caixa redonda · 
- despesas-imprevistos · "Registrar imprevisto" · caixa redonda · 
- despesas-imprevistos · "Registrar imprevisto" · caixa redonda · 
- despesas-nova · "Loja" · caixa redonda · 
- despesas-nova · "Loja" · caixa redonda · 
- despesas-nova · "Loja" · caixa redonda · 
- despesas-nova · "Loja" · caixa redonda · 
- despesas-nova · "Loja" · caixa redonda · 
- despesas-nova · "Loja" · caixa redonda · 
- giro-vitrine · "Salvar" · caixa redonda · 
- hist-busca · "Buscar produto ou conta" · caixa redonda · 
- hist-filtros · "Buscar produto ou conta" · caixa redonda · 
- hist-filtros · "De" · caixa redonda · 
- hist-filtros · "Até" · caixa redonda · 
- hist-lista · "Buscar produto ou conta" · caixa redonda · 
- hist-semana · "Buscar produto ou conta" · caixa redonda · 
- hist-semana · "De" · caixa redonda · 
- hist-semana · "Até" · caixa redonda · 
- inventario-editar · "PREÇO (US$)" · caixa redonda · 
- inventario-editar · "Ex.: polarizado, mola flexível" · caixa redonda · 
- inventario-ficha · "PREÇO (US$)" · caixa redonda · 
- marketing-post · "Por que estas peças" · caixa redonda · 
- precos-contas · "Dias de loja aberta por mês" · caixa redonda · 
- precos-contas · "Dinheiro" · caixa redonda · 
- precos-contas · "Pix" · caixa redonda · 
- precos-contas · "Maquininha débito" · caixa redonda · 
- precos-contas · "Maquininha crédito" · caixa redonda · 

**toque sem efeito visível (conferir à mão)** — 46
- dash-contas-dia · "Marcar como paga neste mês" · ícone redondo · sem efeito visível
- dash-contas-dia · "Marcar como paga neste mês" · ícone redondo · sem efeito visível
- dash-mes-vendido · "Ir para uma data" · ícone redondo · sem efeito visível
- despesas-nova · "Marcar como paga neste mês" · ícone redondo · sem efeito visível
- despesas-nova · "Marcar como paga neste mês" · ícone redondo · sem efeito visível
- hist-lista · "Ir para uma data" · ícone redondo · sem efeito visível
- marketing-post · "" · ícone redondo · sem efeito visível
- atacado-lojistas · "Lojistas" · texto · sem efeito visível
- atacado-novo-acesso · "Lojista fixo não vence" · caixa · sem efeito visível
- caixa-reservado · "Reservas" · texto · sem efeito visível
- catalogo-pagamento · "Dinheiro" · texto · sem efeito visível
- catalogo-pagamento · "Pix" · texto · sem efeito visível
- catalogo-pagamento · "G$ Guarani" · texto · sem efeito visível
- dash-folha-ver · "Dashboard" · texto · sem efeito visível
- dash-semana · "Dashboard" · texto · sem efeito visível
- dash-semana · "G$ 1.289.500" · texto · sem efeito visível
- dash-semana · "G$ 445.400" · texto · sem efeito visível
- giro-lista-compras · "Giro" · texto · sem efeito visível
- giro-no-estoque · "Produtos" · texto · sem efeito visível
- giro-no-estoque · "EM ESTOQUE (FILTRO) › 470" · texto · sem efeito visível
- giro-retorno · "Giro" · texto · sem efeito visível
- hist-dia · "Dashboard" · texto · sem efeito visível
- inventario-editar · "Modelo" · texto · sem efeito visível
- inventario-ficha · "Estoque" · texto · sem efeito visível
- inventario-fornecedores · "Fornecedores 1" · texto · sem efeito visível
- marketing-post · "Versão A" · texto · sem efeito visível
- marketing-post · "PT+ES" · texto · sem efeito visível
- precos · "Preços" · texto · sem efeito visível
- reservas-para-onde · "Reservas" · texto · sem efeito visível
- despesas-imprevistos · "✕" · texto · sem efeito visível
- inicio · "‹" · texto · sem efeito visível
- inventario-fornecedores · "‹ INVENTÁRIO" · texto · sem efeito visível
- inventario-fornecedores · "‹" · texto · sem efeito visível
- clientes-novo · "Novo cliente" · ícone redondo · sem efeito visível
- caixa-movimentos · "Desfazer" · texto · sem efeito visível
- caixa-movimentos · "Desfazer" · texto · sem efeito visível
- caixa-reservado · "Próximos 30 dias Saldo G$ 6.456.174" · texto · sem efeito visível
- catalogo-peca · "· Sem detalhe 343 un." · barra grande · sem efeito visível
- hist-dia · "Contas do dia G$ 140.000 1/30 de G$" · texto · sem efeito visível
- inventario-ficha · "· Sem detalhesem foto 343 un." · barra grande · sem efeito visível
- reservas-para-onde · "Próximos 30 dias Saldo G$ 6.454.632" · texto · sem efeito visível
- caixa-reservado · "G$" · pílula · sem efeito visível
- caixa-retirar · "G$" · pílula · sem efeito visível
- clientes-novo · "Paraguaio" · pílula · sem efeito visível
- inventario-editar · "" · pílula · sem efeito visível
- reservas-para-onde · "G$" · pílula · sem efeito visível

**linha que sai sem "›"** — 15
- cambio-prot · "Trocar G$ 3.381.901 por dólar no Câ" · texto · abre janela
- cambio · "REAL G$ 1.196 ▼ 0,7% 7 dias" · barra grande · abre janela
- cambio · "DÓLAR EM REAIS R$ 5,43 ▲ 0,9% 7 dia" · barra grande · abre janela
- dash-folha-periodo · "Esta semana 16 a 19 de novembro" · texto · leva a outra tela
- dash-folha-periodo · "Este mês 1 a 19 de novembro" · texto · leva a outra tela
- dash-folha-periodo · "Últimos 30 dias 21 de outubro a 19 " · texto · leva a outra tela
- dash-folha-ver · "Contas do dia G$ 140.000 1/30 de G$" · texto · leva a outra tela
- marketing · "Óculos solar #13 26 vendidas em 30 " · barra grande · abre janela
- marketing · "Seg · Post · 20h Peça do objetivo —" · texto · abre janela
- marketing · "Ter · Status · 12h Status do dia — " · texto · abre janela
- marketing · "Qua · Carrossel · 20h Carrossel com" · texto · abre janela
- marketing · "Qui · Story · 20h Bastidores / cheg" · texto · abre janela
- marketing · "Sex · Vídeo · 20h Vídeo de 15 s — Ó" · texto · abre janela
- marketing · "Sáb · Post · 20h Oferta ou mais ven" · texto · abre janela
- precos · "Contas do mês cobertas 86% faltam 2" · caixa · leva a outra tela

**campo em sem nada (P3: linha fina)** — 7
- clientes-novo · "Nome" · sem nada · 
- clientes-novo · "Telefone" · sem nada · 
- clientes-novo · "E-mail" · sem nada · 
- clientes-novo · "RUC" · sem nada · 
- clientes-novo · "Tabela" · sem nada · 
- clientes-novo · "Observação" · sem nada · 
- dash-custom · "Até" · sem nada · 

**adicionar fora do padrão (P1 "+" redondo / grupo "+" em texto)** — 6
- atacado-lojistas · "+ Novo acesso" · pílula · abre janela
- caixa-acoes · "+ Novo objetivo" · pílula · abre janela
- catalogo-peca · "+" · ícone quadrado · sem efeito visível
- dash-contas-dia · "+ Nova" · pílula · abre/mexe no lugar
- despesas-nova · "+ Nova" · pílula · abre/mexe no lugar
- despesas-nova · "Adicionar" · pílula · abre/mexe no lugar

**"›" tem que sair (outra tela ou janela) — este abre no lugar** — 6
- caixa-acoes · "Ver todos os movimentos ›" · texto · abre/mexe no lugar
- dash-mes-vendido · "Carregar mais 30 dias ›" · texto · abre/mexe no lugar
- giro-lista-compras · "como calcula ›" · texto · abre/mexe no lugar
- giro-lista-compras · "ver os 18 ›" · texto · abre/mexe no lugar
- hist-lista · "Carregar mais 30 dias ›" · texto · abre/mexe no lugar
- inventario-ficha · "Fotografar no Estúdio ›" · texto · abre/mexe no lugar

**"Fechar"/"×" em janela (P6: fecha arrastando)** — 5
- caixa-conferir · "Fechar" · texto · abre/mexe no lugar
- clientes-novo · "×" · ícone redondo · abre/mexe no lugar
- despesas-imprevistos · "✕" · texto · sem efeito visível
- inventario-editar · "Fechar" · caixa · abre/mexe no lugar
- pendencias · "Fechar" · pílula · abre/mexe no lugar

**ícone quadrado (aprovado: redondo, 137a)** — 2
- catalogo-peca · "−" · ícone quadrado · sem efeito visível
- catalogo-peca · "+" · ícone quadrado · sem efeito visível


## O que foge da família (tela · botão · cara · faz)

**ícone**
- caixa-acoes · "Ações do caixa" · ícone redondo 15px · abre/mexe no lugar
- catalogo-carrinho · "Modo cliente (iPad da loja)" · ícone redondo 15px · abre/mexe no lugar
- catalogo-peca · "Compartilhar esta peça" · ícone redondo 14px · abre janela
- catalogo-peca · "−" · ícone quadrado 22px · sem efeito visível
- dash-contas-dia · "Marcar como paga neste mês" · ícone redondo 15px · sem efeito visível
- dash-contas-dia · "Marcar como paga neste mês" · ícone redondo 15px · sem efeito visível
- dash-contas-dia · "Marcar como paga neste mês" · ícone redondo 15px · abre/mexe no lugar
- dash-mes-vendido · "Ir para uma data" · ícone redondo 15px · sem efeito visível
- dash-mes-vendido · "Filtros" · ícone redondo 15px · abre/mexe no lugar
- despesas-nova · "Marcar como paga neste mês" · ícone redondo 15px · sem efeito visível
- despesas-nova · "Marcar como paga neste mês" · ícone redondo 15px · sem efeito visível
- despesas-nova · "Marcar como paga neste mês" · ícone redondo 15px · abre/mexe no lugar
- giro-no-estoque · "Filtros e ordem" · ícone redondo 15px · abre janela
- hist-lista · "Ir para uma data" · ícone redondo 15px · sem efeito visível
- hist-lista · "Filtros" · ícone redondo 15px · abre/mexe no lugar
- hist-semana · "Pix" · ícone redondo 13px · abre/mexe no lugar
- hist-semana · "G$" · ícone redondo 13px · abre/mexe no lugar
- hist-semana · "R$" · ícone redondo 13px · abre/mexe no lugar
- marketing-post · "" · ícone redondo 15px · sem efeito visível

**texto/linha tocável**
- ajustes · "Impressora Nenhuma" · texto 15px · liga/desliga ou escolhe
- ajustes · "Tema Auto" · texto 15px · liga/desliga ou escolhe
- ajustes · "Segurança Desligada" · texto 15px · liga/desliga ou escolhe
- ajustes · "Site frete, PIX, idioma" · texto 15px · leva a outra tela
- ajustes · "Pedidos do site Baixa manual" · texto 15px · liga/desliga ou escolhe
- ajustes · "Sons e avisos Ligados" · texto 15px · liga/desliga ou escolhe
- ajustes · "Atualização 5.45.0" · texto 15px · liga/desliga ou escolhe
- ajustes · "Cópias e nuvem Nenhuma cópia" · texto 15px · liga/desliga ou escolhe
- ajustes · "Pagamento automático Desligado" · texto 15px · liga/desliga ou escolhe
- atacado-lojistas · "Lojistas" · texto 15px · sem efeito visível
- atacado-novo-acesso · "Lojista fixo não vence" · caixa 15px · sem efeito visível
- atacado-novo-acesso · "Visitante vence em 3 dias" · caixa 15px · abre/mexe no lugar
- atacado-tabela · "Ver a tabela de atacado Os preços c" · texto 15px · abre janela
- atacado-tabela · "Editar tabelas Margem, mínimo e fre" · texto 15px · abre janela
- caixa-acoes · "Retirar" · texto 15px · abre janela
- caixa-reservado · "Reservas" · texto 28px · sem efeito visível
- caixa-reservado · "R$" · texto 14px · abre/mexe no lugar
- caixa-reservado · "US$" · texto 14px · abre/mexe no lugar
- cambio · "DÓLAR G$ 6.487 — estável" · texto 15px · abre janela
- catalogo-carrinho · "−" · texto 20px · sem efeito visível
- catalogo-carrinho · "−" · texto 20px · sem efeito visível
- catalogo-pagamento · "Dinheiro" · texto 15px · sem efeito visível
- catalogo-pagamento · "Pix" · texto 15px · sem efeito visível
- catalogo-pagamento · "G$ Guarani" · texto 15px · sem efeito visível
- clientes-novo · "Estrangeiro" · texto 14px · liga/desliga ou escolhe
- dash-folha-ver · "Dashboard" · texto 28px · sem efeito visível
- dash-semana · "Dashboard" · texto 28px · sem efeito visível
- dash-semana · "G$ 1.289.500" · texto 26px · sem efeito visível
- dash-semana · "G$ 445.400" · texto 26px · sem efeito visível
- giro-lista-compras · "Giro" · texto 28px · sem efeito visível
- giro-lista-compras · "−" · texto 18px · abre/mexe no lugar
- giro-lista-compras · "−" · texto 18px · abre/mexe no lugar
- giro-lista-compras · "−" · texto 18px · abre/mexe no lugar
- giro-lista-compras · "−" · texto 18px · abre/mexe no lugar
- giro-lista-compras · "−" · texto 18px · abre/mexe no lugar
- giro-no-estoque · "Produtos" · texto 15px · sem efeito visível
- giro-no-estoque · "EM ESTOQUE (FILTRO) › 470" · texto 15px · sem efeito visível
- giro-no-estoque · "Buscar com a câmera" · texto 15px · abre janela
- giro-no-estoque · "Óculos de leitura Kazwini de acetat" · caixa 15px · abre/mexe no lugar
- giro-no-estoque · "Óculos de leitura de plástico femin" · caixa 15px · abre/mexe no lugar
- giro-no-estoque · "Armação Gucci de metal feminino Cód" · caixa 15px · abre/mexe no lugar
- giro-no-estoque · "Armação Ray-Ban de metal masculino " · caixa 15px · abre/mexe no lugar
- giro-no-estoque · "Armação Armani de acetato feminino " · caixa 15px · abre/mexe no lugar
- giro-no-estoque · "Óculos solar Ray-Ban de metal mascu" · caixa 15px · abre/mexe no lugar
- giro-retorno · "Giro" · texto 28px · sem efeito visível
- guardiao · "silenciar" · texto 12px · abre/mexe no lugar
- guardiao · "silenciar" · texto 12px · abre/mexe no lugar
- guardiao · "silenciar" · texto 12px · abre/mexe no lugar
- guardiao · "silenciar" · texto 12px · abre/mexe no lugar
- guardiao · "silenciar" · texto 12px · abre/mexe no lugar
- hist-dia · "Dashboard" · texto 28px · sem efeito visível
- inicio · "Resultados Dia, mês e histórico" · caixa 15px · leva a outra tela
- inicio · "Giro e preços Giro, preços e reserv" · caixa 15px · leva a outra tela
- inicio · "Site Pedidos, mensagens, vitrine e " · caixa 15px · leva a outra tela
- inicio · "Marketing Posts, vídeos, temática, " · caixa 15px · leva a outra tela
- inicio · "Clientes 0 cadastrados" · caixa 15px · leva a outra tela
- inicio · "Atacado Orçamentos" · caixa 15px · leva a outra tela
- inventario-editar · "Modelo" · texto 15px · sem efeito visível
- inventario-ficha · "Estoque" · texto 14px · sem efeito visível
- inventario-ficha · "Histórico" · texto 14px · liga/desliga ou escolhe
- inventario-ficha · "Site" · texto 14px · liga/desliga ou escolhe
- inventario-ficha · "Preço" · texto 14px · liga/desliga ou escolhe
- inventario-ficha · "% Oferta" · caixa 15px · abre janela
- inventario-fornecedores · "Fornecedores 1" · texto 15px · sem efeito visível
- inventario-fornecedores · "EM ESTOQUE (FILTRO) › 400" · texto 15px · liga/desliga ou escolhe
- inventario-fornecedores · "Editar" · caixa 14px · abre janela
- inventario-novo · "Ler haste" · caixa 15px · abre janela
- inventario-novo · "Foto" · caixa 15px · abre janela
- inventario-novo · "BR44118 Preto" · caixa 15px · abre janela
- inventario-novo · "BR44133 Vinho" · caixa 15px · abre janela
- inventario-novo · "SP58110 Pré-graduado" · caixa 15px · abre/mexe no lugar
- inventario-novo · "Chegou mercadoria" · texto 15.5px · abre janela
- inventario-novo · "Preencher à mão" · texto 15.5px · abre janela
- marketing-post · "Versão A" · texto 15px · sem efeito visível
- marketing-post · "Versão B" · texto 15px · liga/desliga ou escolhe
- marketing-post · "PT" · texto 15px · liga/desliga ou escolhe
- marketing-post · "ES" · texto 15px · liga/desliga ou escolhe
- marketing-post · "PT+ES" · texto 15px · sem efeito visível
- marketing-post · "Me lembra às 20h" · caixa 15px · abre/mexe no lugar
- marketing · "Girar o parado" · caixa 13px · abre/mexe no lugar
- marketing · "Novos clientes BR" · caixa 13px · abre/mexe no lugar
- marketing · "Mais solar" · caixa 13px · abre/mexe no lugar
- marketing · "Lançamentos" · caixa 13px · abre/mexe no lugar
- marketing · "Feito" · texto 13px · abre/mexe no lugar
- pendencias · "SP57765" · None None · leva a outra tela
- pendencias · "SP58110" · None None · leva a outra tela
- pendencias · "SP60627" · None None · leva a outra tela
- precos-corrigir · "Usar G$ 52.500" · caixa 13px · abre/mexe no lugar
- precos-corrigir · "Usar G$ 52.500" · caixa 13px · abre/mexe no lugar
- precos-corrigir · "Usar G$ 37.500" · caixa 13px · abre/mexe no lugar
- precos-corrigir · "Usar G$ 52.500" · caixa 13px · abre/mexe no lugar
- precos-corrigir · "Usar G$ 37.500" · caixa 13px · abre/mexe no lugar
- precos-corrigir · "Usar G$ 77.000" · caixa 13px · abre/mexe no lugar
- precos-corrigir · "Usar G$ 77.000" · caixa 13px · abre/mexe no lugar
- precos-corrigir · "Usar G$ 77.000" · caixa 13px · abre/mexe no lugar
- precos-corrigir · "Usar G$ 93.000" · caixa 13px · abre/mexe no lugar
- precos-corrigir · "Usar G$ 93.000" · caixa 13px · abre/mexe no lugar
- precos-corrigir · "Informar" · caixa 13px · abre/mexe no lugar
- precos-corrigir · "Informar" · caixa 13px · abre/mexe no lugar
- precos-corrigir · "Informar" · caixa 13px · abre/mexe no lugar
- precos-corrigir · "Informar" · caixa 13px · abre/mexe no lugar
- precos-corrigir · "Informar" · caixa 13px · abre/mexe no lugar
- precos · "Preços" · texto 28px · sem efeito visível
- precos · "Preços para corrigir 15" · caixa 15px · abre/mexe no lugar
- precos · "por quê" · texto 14px · abre janela
- precos · "ajustar tabela" · texto 14px · abre janela
- precos · "ajustar" · texto 14px · abre janela
- precos · "Calculadora de preço" · texto 15px · abre janela
- precos · "E se…?" · texto 15px · abre janela
- reservas-30dias · "30 dias" · caixa 14px · abre/mexe no lugar
- reservas-30dias · "60 dias" · caixa 14px · abre/mexe no lugar
- reservas-30dias · "90 dias" · caixa 14px · abre/mexe no lugar
- reservas-30dias · "Editar despesas" · None None · leva a outra tela
- reservas-para-onde · "Reservas" · texto 28px · sem efeito visível
- reservas-para-onde · "R$" · texto 14px · abre/mexe no lugar
- reservas-para-onde · "US$" · texto 14px · abre/mexe no lugar
- reservas-para-onde · "Objetivos da loja › guardado no Cai" · texto 15px · leva a outra tela

**fechar/voltar**
- caixa-acoes · "‹ DINHEIRO" · texto 12px · leva a outra tela
- caixa-conferir · "Fechar" · texto 15px · abre/mexe no lugar
- caixa-reservado · "‹ CAIXA" · texto 12px · leva a outra tela
- cambio · "‹ DINHEIRO" · texto 12px · leva a outra tela
- catalogo-pagamento · "‹ Carrinho" · texto 15px · abre/mexe no lugar
- catalogo-peca · "‹ CATÁLOGO" · texto 12px · abre/mexe no lugar
- clientes-novo · "×" · ícone redondo 20px · abre/mexe no lugar
- dash-contas-dia · "‹ DIA" · texto 12px · leva a outra tela
- dash-mes-vendido · "‹ DASHBOARD" · texto 12px · leva a outra tela
- dash-semana · "‹ RESULTADOS" · texto 12px · leva a outra tela
- despesas-imprevistos · "✕" · texto 14px · sem efeito visível
- despesas-nova · "‹ DINHEIRO" · texto 12px · leva a outra tela
- giro-lista-compras · "‹ GIRO E PREÇOS" · texto 12px · leva a outra tela
- giro-no-estoque · "‹ GIRO" · texto 12px · leva a outra tela
- giro-retorno · "‹ GIRO E PREÇOS" · texto 12px · leva a outra tela
- hist-dia · "‹ HISTÓRICO" · texto 12px · leva a outra tela
- hist-lista · "‹ RESULTADOS" · texto 12px · leva a outra tela
- inicio · "‹" · texto 26px · sem efeito visível
- inventario-editar · "Fechar" · caixa 14px · abre/mexe no lugar
- inventario-ficha · "‹ PEÇAS" · texto 12px · leva a outra tela
- inventario-ficha · "‹ INVENTÁRIO" · texto 12px · abre/mexe no lugar
- inventario-fornecedores · "‹ INVENTÁRIO" · texto 12px · sem efeito visível
- inventario-fornecedores · "‹" · texto 26px · sem efeito visível
- marketing · "‹ MARKETING" · texto 12px · leva a outra tela
- pendencias · "Fechar" · pílula 15px · abre/mexe no lugar
- reservas-para-onde · "‹ GIRO E PREÇOS" · texto 12px · leva a outra tela

**adicionar**
- atacado-lojistas · "+ Novo acesso" · pílula 15px · abre janela
- atacado-lotes · "+ Criar lote" · texto 15px · abre janela
- caixa-acoes · "Novo objetivo" · texto 15px · abre janela
- caixa-acoes · "+ Novo objetivo" · pílula 15px · abre janela
- catalogo-carrinho · "+" · texto 20px · sem efeito visível
- catalogo-carrinho · "+" · texto 20px · sem efeito visível
- catalogo-carrinho · "+ Adicionar outra peça" · texto 15px · abre/mexe no lugar
- catalogo-pagamento · "+ Receber parte em outra moeda" · texto 15px · abre/mexe no lugar
- catalogo-peca · "+" · ícone quadrado 22px · sem efeito visível
- clientes-novo · "Novo cliente" · ícone redondo 15px · sem efeito visível
- dash-contas-dia · "+ Nova" · pílula 15px · abre/mexe no lugar
- despesas-nova · "+ Nova" · pílula 15px · abre/mexe no lugar
- despesas-nova · "Nova despesa Água, luz, aluguel… fi" · texto 15px · abre/mexe no lugar
- despesas-nova · "Adicionar" · pílula 15px · abre/mexe no lugar
- giro-no-estoque · "Adicionar" · ícone redondo 15px · abre janela
- inventario-fornecedores · "Adicionar" · ícone redondo 15px · abre janela

**principal (salvar/confirmar)**
- atacado-tabela · "Enviar catálogo a um lojista Abre o" · texto 15px · abre janela
- caixa-acoes · "Conferir" · texto 15px · abre janela
- cambio · "Registrar troca" · barra grande 16px · abre janela
- catalogo-pagamento · "Finalizar venda" · barra grande 16px · abre janela
- despesas-conta · "Salvar" · pílula 15px · abre/mexe no lugar
- despesas-imprevistos · "Registrar imprevisto" · pílula 15px · abre/mexe no lugar
- giro-vitrine · "Salvar" · caixa 16px · abre/mexe no lugar
- pendencias · "Conferir" · pílula 15px · leva a outra tela

**link › (sai daqui)**
- caixa-acoes · "Reservas ›" · texto 15px · leva a outra tela
- caixa-acoes · "Ver o que falta repor ›" · texto 14px · leva a outra tela
- caixa-acoes · "Ver todos os movimentos ›" · texto 13px · abre/mexe no lugar
- catalogo-peca · "Ficha no Inventário ›" · texto 15px · leva a outra tela
- dash-folha-periodo · "Escolher datas de um dia até outro " · texto 15px · leva a outra tela
- dash-folha-ver · "Dias anteriores no Histórico ›" · texto 13px · leva a outra tela
- dash-mes-vendido · "Carregar mais 30 dias ›" · texto 15px · abre/mexe no lugar
- giro-lista-compras · "como calcula ›" · texto 15px · abre/mexe no lugar
- giro-lista-compras · "ver os 18 ›" · texto 15px · abre/mexe no lugar
- giro-lista-compras · "Oferta ›" · texto 15px · leva a outra tela
- giro-no-estoque · "15 preços para corrigir ›" · texto 13px · leva a outra tela
- grp-dinheiro · "Caixa O dinheiro da loja, por moeda" · texto 15px · leva a outra tela
- grp-dinheiro · "Despesas Contas do mês e imprevisto" · texto 15px · leva a outra tela
- grp-dinheiro · "Câmbio Cotações e trocas ›" · texto 15px · leva a outra tela
- hist-dia · "Dias anteriores no Histórico ›" · texto 15px · leva a outra tela
- hist-lista · "Carregar mais 30 dias ›" · texto 15px · abre/mexe no lugar
- inicio · "Guardião · 7 coisas para olhar ›" · barra grande 15px · leva a outra tela
- inicio · "Vendido hoje · 5 venda(s) G$ 182.00" · barra grande 15px · leva a outra tela
- inventario-ficha · "Vender no Catálogo ›" · texto 15px · leva a outra tela
- inventario-ficha · "Fotografar no Estúdio ›" · texto 15px · abre/mexe no lugar
- inventario-fornecedores · "Lista de compras · 18 acabando ›" · texto 15px · leva a outra tela

**perigo/desfazer**
- caixa-acoes · "Desfazer" · texto 12px · abre/mexe no lugar
- caixa-acoes · "Desfazer" · texto 12px · abre/mexe no lugar
- caixa-acoes · "Desfazer" · texto 12px · abre/mexe no lugar
- caixa-acoes · "Desfazer" · texto 12px · abre/mexe no lugar
- caixa-acoes · "Desfazer" · texto 12px · abre/mexe no lugar
- caixa-acoes · "Desfazer" · texto 12px · abre/mexe no lugar
- caixa-movimentos · "Desfazer" · texto 12px · sem efeito visível
- caixa-movimentos · "Desfazer" · texto 12px · sem efeito visível
- dash-contas-dia · "Pago neste mês. Toque para desfazer" · ícone redondo 15px · abre/mexe no lugar
- dash-contas-dia · "Pago neste mês. Toque para desfazer" · ícone redondo 15px · abre/mexe no lugar
- dash-contas-dia · "Pago neste mês. Toque para desfazer" · ícone redondo 15px · abre/mexe no lugar
- dash-contas-dia · "Pago neste mês. Toque para desfazer" · ícone redondo 15px · abre/mexe no lugar
- despesas-conta · "Remover Aluguel da loja" · ícone redondo 15px · abre/mexe no lugar
- despesas-nova · "Pago neste mês. Toque para desfazer" · ícone redondo 15px · abre/mexe no lugar
- despesas-nova · "Pago neste mês. Toque para desfazer" · ícone redondo 15px · abre/mexe no lugar
- despesas-nova · "Pago neste mês. Toque para desfazer" · ícone redondo 15px · abre/mexe no lugar
- despesas-nova · "Pago neste mês. Toque para desfazer" · ícone redondo 15px · abre/mexe no lugar

**linha de lista**
- caixa-novo-objetivo · "Guardar objetivo" · barra grande 16px · abre/mexe no lugar
- caixa-reservado · "Próximos 30 dias Saldo G$ 6.456.174" · texto 15px · sem efeito visível
- caixa-retirar · "Retirar" · barra grande 16px · abre/mexe no lugar
- cambio-prot · "Trocar G$ 3.381.901 por dólar no Câ" · texto 15px · abre janela
- cambio · "REAL G$ 1.196 ▼ 0,7% 7 dias" · barra grande 15px · abre janela
- cambio · "DÓLAR EM REAIS R$ 5,43 ▲ 0,9% 7 dia" · barra grande 15px · abre janela
- catalogo-carrinho · "Ir para o pagamento" · barra grande 16px · abre/mexe no lugar
- catalogo-peca · "· Sem detalhe 343 un." · barra grande 14px · sem efeito visível
- catalogo-peca · "Vender · G$ 25.000" · barra grande 16px · abre/mexe no lugar
- dash-folha-periodo · "Esta semana 16 a 19 de novembro" · texto 15px · leva a outra tela
- dash-folha-periodo · "Este mês 1 a 19 de novembro" · texto 15px · leva a outra tela
- dash-folha-periodo · "Últimos 30 dias 21 de outubro a 19 " · texto 15px · leva a outra tela
- dash-folha-ver · "Contas do dia G$ 140.000 1/30 de G$" · texto 15px · leva a outra tela
- dash-mes-vendido · "19/11 · hojequi G$ 182.000 › 5 vend" · texto 15px · leva a outra tela
- dash-mes-vendido · "18/11qua G$ 500.000 › 10 vendas · l" · texto 15px · leva a outra tela
- dash-mes-vendido · "17/11ter G$ 459.000 › 7 vendas · 1 " · texto 15px · leva a outra tela
- dash-mes-vendido · "16/11seg G$ 148.500 › 4 vendas · 1 " · texto 15px · leva a outra tela
- dash-mes-vendido · "15/11dom G$ 23.000 › 1 venda · lucr" · texto 15px · leva a outra tela
- dash-mes-vendido · "14/11sáb G$ 502.000 › 11 vendas · 1" · texto 15px · leva a outra tela
- dash-mes-vendido · "13/11sex G$ 257.500 › 6 vendas · ga" · texto 15px · leva a outra tela
- dash-mes-vendido · "12/11qui G$ 256.500 › 7 vendas · lu" · texto 15px · leva a outra tela
- dash-mes-vendido · "11/11qua G$ 194.000 › 3 vendas · ga" · texto 15px · leva a outra tela
- dash-mes-vendido · "10/11ter G$ 463.500 › 6 vendas · 1 " · texto 15px · leva a outra tela
- dash-mes-vendido · "09/11seg G$ 188.000 › 5 vendas · 1 " · texto 15px · leva a outra tela
- giro-lista-compras · "Marcar como pedido" · barra grande 16px · abre/mexe no lugar
- giro-no-estoque · "Lote Kazwini Pré-graduados G$ 25.00" · caixa 15px · abre/mexe no lugar
- giro-no-estoque · "Óculos de leitura de acetato unisse" · caixa 15px · abre/mexe no lugar
- giro-no-estoque · "Óculos de leitura #15 Pré-graduados" · caixa 15px · abre/mexe no lugar
- giro-no-estoque · "Armação #10 Armações G$ 45.000! 7 e" · caixa 15px · abre/mexe no lugar
- giro-no-estoque · "Óculos solar Kazwini de tr90 femini" · caixa 15px · abre/mexe no lugar
- giro-no-estoque · "Óculos solar #13 Solares G$ 60.000!" · caixa 15px · abre/mexe no lugar
- hist-dia · "Contas do dia G$ 140.000 1/30 de G$" · texto 15px · sem efeito visível
- hist-lista · "19/11 · hojequi G$ 182.000 › 5 vend" · barra grande 15px · leva a outra tela
- hist-lista · "18/11qua G$ 500.000 › 10 vendas · l" · barra grande 15px · leva a outra tela
- hist-lista · "17/11ter G$ 459.000 › 7 vendas · 1 " · barra grande 15px · leva a outra tela
- hist-lista · "16/11seg G$ 148.500 › 4 vendas · 1 " · barra grande 15px · leva a outra tela
- hist-lista · "15/11dom G$ 23.000 › 1 venda · lucr" · barra grande 15px · leva a outra tela
- hist-lista · "14/11sáb G$ 502.000 › 11 vendas · 1" · barra grande 15px · leva a outra tela
- hist-lista · "13/11sex G$ 257.500 › 6 vendas · ga" · barra grande 15px · leva a outra tela
- hist-lista · "12/11qui G$ 256.500 › 7 vendas · lu" · barra grande 15px · leva a outra tela
- hist-lista · "11/11qua G$ 194.000 › 3 vendas · ga" · barra grande 15px · leva a outra tela
- hist-lista · "10/11ter G$ 463.500 › 6 vendas · 1 " · barra grande 15px · leva a outra tela
- hist-lista · "09/11seg G$ 188.000 › 5 vendas · 1 " · barra grande 15px · leva a outra tela
- hist-lista · "Semana 02/11 a 08/11 G$ 2.595.500 ·" · barra grande 15px · abre/mexe no lugar
- hist-lista · "Semana 01/11 G$ 120.000 · 2 vendas " · barra grande 15px · abre/mexe no lugar
- hist-lista · "Semana 26/10 a 31/10 G$ 1.230.500 ·" · barra grande 15px · abre/mexe no lugar
- hist-lista · "Semana 19/10 a 25/10 G$ 1.452.500 ·" · barra grande 15px · abre/mexe no lugar
- inventario-ficha · "· Sem detalhesem foto 343 un." · barra grande 14px · sem efeito visível
- marketing-post · "Postar agora" · barra grande 16px · abre/mexe no lugar
- marketing · "Óculos solar #13 26 vendidas em 30 " · barra grande 15px · abre janela
- marketing · "Seg · Post · 20h Peça do objetivo —" · texto 14px · abre janela
- marketing · "Ter · Status · 12h Status do dia — " · texto 14px · abre janela
- marketing · "Qua · Carrossel · 20h Carrossel com" · texto 14px · abre janela
- marketing · "Qui · Story · 20h Bastidores / cheg" · texto 14px · abre janela
- marketing · "Sex · Vídeo · 20h Vídeo de 15 s — Ó" · texto 14px · abre janela
- marketing · "Sáb · Post · 20h Oferta ou mais ven" · texto 14px · abre janela
- precos-corrigir · "Corrigir os 10 de uma vez" · barra grande 16px · abre/mexe no lugar
- precos · "Contas do mês cobertas 86% faltam 2" · caixa 15px · leva a outra tela
- reservas-para-onde · "Próximos 30 dias Saldo G$ 6.454.632" · texto 15px · sem efeito visível

**opção/pílula**
- caixa-reservado · "G$" · pílula 14px · sem efeito visível
- caixa-retirar · "G$" · pílula 15px · sem efeito visível
- caixa-retirar · "US$" · pílula 15px · liga/desliga ou escolhe
- caixa-retirar · "R$" · pílula 15px · liga/desliga ou escolhe
- cambio-site · "Atualizar preços do site agora" · pílula 15px · abre/mexe no lugar
- cambio-troca · "G$" · pílula 15px · abre/mexe no lugar
- cambio-troca · "US$" · pílula 15px · abre/mexe no lugar
- cambio-troca · "R$" · pílula 15px · abre/mexe no lugar
- cambio-troca · "G$" · pílula 15px · abre/mexe no lugar
- cambio-troca · "US$" · pílula 15px · abre/mexe no lugar
- cambio-troca · "R$" · pílula 15px · abre/mexe no lugar
- cambio · "Venda" · pílula 15px · abre/mexe no lugar
- clientes-novo · "Paraguaio" · pílula 14px · sem efeito visível
- giro-lista-compras · "Mandar ao fornecedor" · pílula 15px · abre janela
- guardiao · "Ver" · pílula 13px · leva a outra tela
- hist-busca · "Mostrar mais (598)" · pílula 15px · abre/mexe no lugar
- inventario-editar · "" · pílula 15px · sem efeito visível
- inventario-ficha · "Ficha 4/6" · pílula 12.5px · abre janela
- inventario-ficha · "No site" · pílula 15px · abre/mexe no lugar
- inventario-fornecedores · "Ver peças (57)" · pílula 15px · abre/mexe no lugar
- marketing · "Post" · pílula 15px · abre janela
- marketing · "Story" · pílula 15px · abre janela
- marketing · "Status" · pílula 15px · abre janela
- marketing · "Carrossel" · pílula 15px · abre janela
- marketing · "Vídeo" · pílula 15px · abre janela
- marketing · "Roteiro" · pílula 15px · abre janela
- pendencias · "Ver margem" · pílula 15px · leva a outra tela
- pendencias · "Ver conta" · pílula 15px · leva a outra tela
- pendencias · "Ver preços" · pílula 15px · abre/mexe no lugar
- pendencias · "Ver" · pílula 15px · leva a outra tela
- pendencias · "Completar" · pílula 15px · leva a outra tela
- pendencias · "Ver reposição" · pílula 15px · abre/mexe no lugar
- pendencias · "Ver" · pílula 15px · abre janela
- reservas-para-onde · "G$" · pílula 14px · sem efeito visível

## Campos de escrever

- **caixa redonda**: 50 — atacado-novo-acesso, caixa-conferir, caixa-novo-objetivo, caixa-retirar, cambio-troca, catalogo-pagamento, clientes, dash-mes-vendido, despesas-conta, despesas-imprevistos, despesas-nova, giro-vitrine, hist-busca, hist-filtros, hist-lista, hist-semana, inventario-editar, inventario-ficha, marketing-post, precos-contas
- **sem nada**: 7 — clientes-novo, dash-custom
- **linha**: 5 — dash-custom, giro-no-estoque, giro-vitrine2, inicio, inventario-novo

## Possíveis bugs ao tocar várias vezes

- cambio-site · "Atualizar preços do site agora" · 3º toque diferente do 1º · 1º ['muda a tela'] · de novo ['nada visível']
- giro-no-estoque · "EM ESTOQUE (FILTRO) › 470" · 3º toque diferente do 1º · 1º ['sumiu'] · de novo ['—']

## Alinhamento (alin2) por tela

- atacado-lojistas (claro): 1 — 7 linha de base
- atacado-lojistas (escuro): 1 — 7 linha de base
- atacado-tabela (claro): 1 — 7 linha de base
- atacado-tabela (escuro): 1 — 7 linha de base
- caixa-acoes (claro): 3 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base
- caixa-acoes (escuro): 3 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base
- caixa-conferir (claro): 6 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda
- caixa-conferir (escuro): 6 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda
- caixa-movimentos (claro): 3 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda
- caixa-movimentos (escuro): 3 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda
- caixa-novo-objetivo (claro): 3 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda
- caixa-novo-objetivo (escuro): 3 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda
- caixa-reservado (claro): 7 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base
- caixa-reservado (escuro): 7 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base
- caixa-retirar (claro): 5 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda; 7 linha de base
- caixa-retirar (escuro): 5 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda; 7 linha de base
- cambio (claro): 9 — 1 coluna da direita; 7 linha de base
- cambio (escuro): 9 — 1 coluna da direita; 7 linha de base
- cambio-dolar (claro): 9 — 1 coluna da direita; 7 linha de base
- cambio-dolar (escuro): 9 — 1 coluna da direita; 7 linha de base
- cambio-prot (claro): 9 — 1 coluna da direita; 7 linha de base
- cambio-prot (escuro): 9 — 1 coluna da direita; 7 linha de base
- cambio-repo (claro): 9 — 1 coluna da direita; 7 linha de base
- cambio-repo (escuro): 9 — 1 coluna da direita; 7 linha de base
- cambio-site (claro): 9 — 1 coluna da direita; 7 linha de base
- cambio-site (escuro): 9 — 1 coluna da direita; 7 linha de base
- cambio-troca (claro): 13 — 1 coluna da direita; 2 centro vertical; 7 linha de base
- cambio-troca (escuro): 13 — 1 coluna da direita; 2 centro vertical; 7 linha de base
- cambio-trocas (claro): 9 — 1 coluna da direita; 7 linha de base
- cambio-trocas (escuro): 9 — 1 coluna da direita; 7 linha de base
- catalogo-carrinho (claro): 9 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda; 7 linha de base
- catalogo-carrinho (escuro): 9 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda; 7 linha de base
- catalogo-pagamento (claro): 3 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda
- catalogo-pagamento (escuro): 3 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda
- catalogo-peca (claro): 4 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda
- catalogo-peca (escuro): 4 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda
- clientes (claro): 1 — 2 centro vertical
- clientes (escuro): 1 — 2 centro vertical
- clientes-novo (claro): 11 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda
- clientes-novo (escuro): 11 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda
- dash-contas-dia (claro): 1 — 7 linha de base
- dash-contas-dia (escuro): 1 — 7 linha de base
- dash-custom (claro): 1 — 7 linha de base
- dash-custom (escuro): 1 — 7 linha de base
- dash-folha-periodo (claro): 2 — 7 linha de base
- dash-folha-periodo (escuro): 2 — 7 linha de base
- dash-mes (claro): 3 — 7 linha de base
- dash-mes (escuro): 3 — 7 linha de base
- dash-semana (claro): 3 — 7 linha de base
- dash-semana (escuro): 3 — 7 linha de base
- despesas-conta (claro): 1 — 7 linha de base
- despesas-conta (escuro): 1 — 7 linha de base
- despesas-imprevistos (claro): 1 — 7 linha de base
- despesas-imprevistos (escuro): 1 — 7 linha de base
- despesas-nova (claro): 4 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base
- despesas-nova (escuro): 4 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base
- giro-abc (claro): 12 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base
- giro-abc (escuro): 12 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base
- giro-lista-compras (claro): 3 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base
- giro-lista-compras (escuro): 3 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base
- giro-no-estoque (claro): 1 — 2 centro vertical
- giro-no-estoque (escuro): 1 — 2 centro vertical
- giro-parado (claro): 12 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base
- giro-parado (escuro): 12 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base
- giro-retorno (claro): 12 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base
- giro-retorno (escuro): 12 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base
- giro-vitrine (claro): 12 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base
- giro-vitrine (escuro): 12 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base
- inventario-editar (claro): 1 — 7 linha de base
- inventario-editar (escuro): 1 — 7 linha de base
- inventario-ficha (claro): 4 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda
- inventario-ficha (escuro): 4 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda
- inventario-ficha-historico (claro): 1 — 2 centro vertical
- inventario-ficha-historico (escuro): 1 — 2 centro vertical
- inventario-ficha-preco (claro): 1 — 2 centro vertical
- inventario-ficha-preco (escuro): 1 — 2 centro vertical
- inventario-fornecedores (claro): 6 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda; 7 linha de base
- inventario-fornecedores (escuro): 6 — 1 coluna da direita; 2 centro vertical; 3 coluna da esquerda; 7 linha de base
- inventario-novo (claro): 1 — 7 linha de base
- inventario-novo (escuro): 1 — 7 linha de base
- pendencias (claro): 12 — 1 coluna da direita; 3 coluna da esquerda
- pendencias (escuro): 12 — 1 coluna da direita; 3 coluna da esquerda
- reservas-30dias (claro): 7 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base
- reservas-30dias (escuro): 7 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base
- reservas-para-onde (claro): 7 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base
- reservas-para-onde (escuro): 7 — 1 coluna da direita; 3 coluna da esquerda; 7 linha de base

## Rola sem ter o que rolar

- catalogo-peca: 35 px
