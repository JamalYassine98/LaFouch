# S404 · PDF da vistoria final: todos os esboços APROVADOS e ainda não implementados (17/11/2026 11:07), um por página. Lista viva é a fonte.
import base64,os,html
from playwright.sync_api import sync_playwright
W='/home/claude/lafouch/work/'
A=[('Regras e e-mails',[
 ('s398/61h-email-cupom-do-evento.jpg','61h','E-mail do cupom do evento','Botão na cor da temática; sem código; sem "em toda a loja".'),
 ('s398/62-cartoes-de-evento.jpg','62','Cartões de evento','Cada evento com a sua cor (Ano-Novo diferente do Dia dos Pais).'),
 ('s401/63a-email-presente-da-5a-indicacao.jpg','63a','E-mail · último degrau da escada','"Na compra de um, leve outro de presente", só no site. Escada: 1 → 10% · +3 → 15% · +5 → presente · recomeça.'),
 ('s401/63b-email-pedido-cancelado.jpg','63b','E-mail · pedido cancelado','Regra nova (70d): só sai para pedido JÁ PAGO; reserva vencida ou cancelada antes de pagar não gera e-mail.'),
 ('s402/67a-cartao-aniversario-opcoes.jpg','67a','Cartão de aniversário do VIP','Opção A (preto com confete dourado).'),
 ('s402/67b-email-aniversario-vip.jpg','67b','E-mail de aniversário do VIP','10%, 30 dias, só VIP.')]),
 ('Cadastro e carrinho',[
 ('s401/63d-site-complete-seus-dados-cedula.jpg','63d','Complete seus dados · Cédula | RUC',''),
 ('s401/63e-site-teclado-no-iphone.jpg','63e','Teclado no iPhone','A tela encolhe com o teclado (Android já feito).'),
 ('s401/64a-site-carrinho-escolher-presente.jpg','64a','Carrinho · escolher o 2º óculos de presente','Só peças que o piso cobre; 120 dias; só no site.'),
 ('s401/64b-site-carrinho-presente-escolhido.jpg','64b','Carrinho · presente escolhido','')]),
 ('Aba Exclusivo',[
 ('s401/66a-site-inicio-prateleira-exclusivo.jpg','66a','Início · prateleira "Exclusivo"','Palavra em dourado, sem "10%". Sai a entrada do menu (65a retirado).'),
 ('s401/65b-site-aba-exclusivo.jpg','65b','Aba Exclusivo (sem evento)','O cartão do cliente no topo, só as peças em que vale.'),
 ('s401/66b-site-exclusivo-mais-de-um-cupom.jpg','66b','Aba Exclusivo com mais de um cupom','Sem botões de cartão. Padrão: o da temática no evento; fora do evento, o que vence primeiro.'),
 ('s401/65c-site-aba-exclusivo-natal.jpg','65c','Aba Exclusivo no evento (Natal)','ATENÇÃO: o desenho mudou depois da aprovação — conferir nesta vistoria.'),
 ('s401/65d-site-faixa-cartao-ativo.jpg','65d','Cartão fino "seu cartão está ativo"',''),
 ('s401/66d-site-exclusivo-oculos-de-presente.jpg','66d','Aba com o 2º óculos de presente escolhido',''),
 ('s401/65e-site-carrinho-usar-cartao.jpg','65e','Carrinho · "Você tem um cartão · Usar"','Sai o "Tem um código?". No catálogo comum o carrinho só SUGERE.'),
 ('s401/65f-site-carrinho-cartao-aplicado.jpg','65f','Carrinho · cartão aplicado e peça que não aceita',''),
 ('s401/66e-site-carrinho-cupom-entrou-sozinho.jpg','66e','Carrinho · peça da Exclusivo já com o cartão','+ "Guardar para outra compra".'),
 ('s401/66f-site-carrinho-leve-2-e-cartao.jpg','66f','Carrinho · "Leve 2" e cartão juntos','Entra o maior; o carrinho explica.'),
 ('s401/66g-site-minha-conta-trocar-cartao.jpg','66g','Minha conta › Cartões · trocar o cartão em uso','')]),
 ('Cliente VIP e reservas',[
 ('s403/70a-site-minha-conta-nome-do-cliente.jpg','70a','Minha conta · nome do cliente (todos)','Para o VIP, o nome + "✦ Cliente VIP" (como no 69a).'),
 ('s403/70b-site-menu-conta-vip.jpg','70b','Menu · conta do Cliente VIP','"Meus pedidos" continua.'),
 ('s403/70c-site-pagamento-reserva-vip.jpg','70c','Pagamento · reserva VIP de 3 horas','Uma reserva por vez; você cancela no app enquanto não pago; nenhum e-mail.'),
 ('s403/70d-site-pedidos-reserva-cancelada.jpg','70d','Pedidos · reserva cancelada (fechada)','Setinha à direita do selo.'),
 ('s403/70e-site-pedidos-reserva-cancelada-abrindo.jpg','70e','Pedidos · reserva cancelada abrindo','Vídeo: 70e-...-animacao.mp4.')])]
FORA=['68b e-mail "Você agora é Cliente VIP" (20% + o que muda)','68c novidades 48 h antes, marcadas "Só para VIP" (quem não é VIP não vê as peças nas 48 h?)','68e e-mail da 1ª indicação (10%) com os 3 degraus','68f e-mail de mais 3 indicações (15%, cartão separado)','68g escada em Minha conta › Cartões','68h inscrição nas novidades sem a janela do cupom (a saída do cupom já está aprovada)']
REGRAS=['Escada nova: 1 indicação → 10% · mais 3 → 15% · mais 5 → "leve outro de presente" · recomeça; cada recompensa é um cartão separado.','Sai o cupom de boas-vindas (a inscrição continua).','Nenhum cartão mostra código ao cliente (inclui o e-mail do evento já publicado).','Vantagens do VIP: novidades 48 h antes, reserva de 3 h, atendimento prioritário, presente de aniversário. Sem frete.']
u=lambda f:'data:image/jpeg;base64,'+base64.b64encode(open(W+f,'rb').read()).decode()
CSS="@page{size:A4;margin:12mm}body{font-family:Inter,Arial,sans-serif;color:#1d1418}h1{font:500 26px Georgia,serif;margin:0 0 4px}h2{font:600 15px Arial;color:#8d3a69;margin:16px 0 6px}p,li{font-size:11.5px;line-height:1.5;color:#4a3f45}table{border-collapse:collapse;width:100%}td{font-size:11px;padding:4px 6px;border-bottom:1px solid #e6dde2;vertical-align:top}td.n{font-weight:700;width:34px;color:#8d3a69}.pg{page-break-before:always;text-align:center}.pg h3{font:600 14px Arial;text-align:left;margin:0 0 2px}.pg p{text-align:left;margin:0 0 6px}.pg img{max-width:100%;max-height:250mm;border:1px solid #ddd}"
h='<h1>Vistoria final · esboços aprovados</h1><p>17/11/2026 · retirado da lista viva (docs/FALTA-APROVAR-15-11.md). Tudo abaixo está APROVADO e esperando o seu "implementar". Nada foi implementado. Cada esboço vem numa página depois do índice.</p><h2>Regras aprovadas (sem esboço próprio)</h2><ul>'+''.join('<li>'+html.escape(r)+'</li>' for r in REGRAS)+'</ul>'
n=0
for g,its in A:
    h+='<h2>'+g+'</h2><table>'+''.join('<tr><td class="n">'+i[1]+'</td><td><b>'+html.escape(i[2])+'</b>'+(' — '+html.escape(i[3]) if i[3] else '')+'</td></tr>' for i in its)+'</table>';n+=len(its)
h+='<h2>Enviados e ainda SEM decisão (não entram no "implementar tudo")</h2><ul>'+''.join('<li>'+html.escape(x)+'</li>' for x in FORA)+'</ul><h2>Retirados</h2><p>63c · 65a · 66c · 61c · 68a · 68d · 69b · 69c · 69d · cartão que cresce · 20% na escada · reserva de 24 h · BIMI · frete do VIP.</p>'
for g,its in A:
    for f,c,t,nt in its: h+='<div class="pg"><h3>'+c+' · '+html.escape(t)+'</h3><p>'+html.escape(nt)+'</p><img src="'+u(f)+'"></div>'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page();pg.set_content('<html><head><meta charset="utf-8"><style>'+CSS+'</style></head><body>'+h+'</body></html>');pg.wait_for_timeout(500)
    pg.pdf(path=W+'s404/vistoria-esbocos-aprovados-17-11.pdf',format='A4',print_background=True);b.close()
print(n,'esboços',os.path.getsize(W+'s404/vistoria-esbocos-aprovados-17-11.pdf')//1024,'KB')
