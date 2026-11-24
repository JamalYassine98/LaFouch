# Estado "sem internet" do app — esboço ESBOCO (24/11/2026, pedido do dono 10:44) · esperando o dono
Esboços (celular, claro e escuro): esboco_sem_internet_inicio_*.jpg (Hoje · Proposta · internet voltou), _ped_*.jpg (Pedidos online), _ata_*.jpg (Atacado).
Base: app real + gabarito aprovado (149n Início, 46c Pedidos, 135c Atacado) — aprovados incluídos.

## Proposta (regra 17: um estado igual em todo lugar)
1. **Faixa única** logo abaixo do logo, em todas as telas, só enquanto não houver internet: bolinha amarela (atenção) · "Sem internet" (13/600) · "· tudo fica salvo" (13/400 cinza), linha fina embaixo, 40 px, margens de 24, numa linha só.
2. **Internet de volta:** a mesma faixa com bolinha verde · "Internet de volta · tudo salvo", e some sozinha em 3 s.
3. **Telas que dependem da internet** (Pedidos online, Mensagens, Atacado › Mensagens): em vez de "Nenhum pedido ainda" (que mente sem internet), a tela vazia da família — ícone da nuvem riscada (conjunto 84, traço 1,6, 56 px) + "Sem internet agora" + "Os pedidos do site aparecem aqui quando a internet voltar."

## Diferenças Hoje × Proposta (comparador)
- Todas as telas: a faixa de 40 px empurra o conteúdo para baixo enquanto está sem internet (só nesse estado).
- Pedidos online e Atacado › Mensagens: ícone, frase e explicação da tela vazia trocados.
- Achado à parte (não é desta proposta): hoje o Atacado › Mensagens vazio mostra DOIS ícones (pessoa + balão); a tela vazia tem um ícone só (regra 15).

## Como fazer (jeito natural, um lugar só — regra 12)
- Um só dono do estado da internet: um módulo `rede` (src) que escuta online/offline e a falha de chamada à nuvem, e guarda `S.rede = 'on'|'off'`.
- A faixa é desenhada por UMA função, logo depois do topo comum (a mesma ordem de camadas do topo/faixa de evento), para todas as telas.
- A tela vazia "Sem internet agora" é a função única de tela vazia, chamada com o texto da tela; Pedidos, Mensagens e Atacado só escolhem o texto.
- O que já existia para isso sai no mesmo passo (ex.: o texto solto "Sem conexão com a nuvem agora…" do Atacado).
- Trava no Titan: o cenário sem_internet do explorador exige a faixa em toda tela e nenhuma tela vazia mentindo.
