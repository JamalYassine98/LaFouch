# S404 · PDF da vistoria final (2ª versão 17/11 12:31): todos os esboços APROVADOS e ainda não implementados (17/11/2026 11:07), um por página. Lista viva é a fonte.
import base64,os,html
from playwright.sync_api import sync_playwright
W='/home/claude/lafouch/work/'
A=[('Regras e e-mails',[
 ('s398/61h-email-cupom-do-evento.jpg','61h','E-mail do cupom do evento','Botão na cor da temática; sem código; sem "em toda a loja".'),
 ('s398/62-cartoes-de-evento.jpg','62','Cartões de evento','Cada evento com a sua cor.'),
 ('s406/73f-cartao-original-so-logo-branco.jpg','73f','Cartão padrão da loja','O de hoje (vinho escuro, número e fio dourados) com SÓ o logo branco.'),
 ('s406/73g-cartao-vip-logo.jpg','73g','Cartão VIP','Continua como hoje: preto, logo e número dourados.'),
 ('s403/68b-email-voce-agora-e-cliente-vip.jpg','68b','E-mail "Você agora é Cliente VIP"','20% + o que muda (reserva de 3 horas).'),
 ('s403/68e-email-escada-1a-indicacao-10.jpg','68e','E-mail · 1ª indicação (10%)','Próximos degraus em surpresa ("?"); números centrados.'),
 ('s403/68f-email-escada-3-indicacoes-15.jpg','68f','E-mail · mais 3 indicações (15%)','Cartão separado; último degrau em surpresa.'),
 ('s401/63a-email-presente-da-5a-indicacao.jpg','63a','E-mail · último degrau','"Na compra de um, leve outro de presente", só no site.'),
 ('s401/63b-email-pedido-cancelado.jpg','63b','E-mail · pedido cancelado','Só para pedido JÁ PAGO.'),
 ('s402/67a-cartao-aniversario-opcoes.jpg','67a','Cartão de aniversário do VIP','Opção A (preto com confete dourado).'),
 ('s402/67b-email-aniversario-vip.jpg','67b','E-mail de aniversário do VIP','10%, 30 dias, só VIP.')]),
 ('Cadastro, inscrição e carrinho',[
 ('s401/63d-site-complete-seus-dados-cedula.jpg','63d','Complete seus dados · Cédula | RUC',''),
 ('s401/63e-site-teclado-no-iphone.jpg','63e','Teclado no iPhone','A tela encolhe com o teclado.'),
 ('s403/68h-site-inscricao-sem-cupom-boas-vindas.jpg','68h','Inscrição nas novidades','Sem a janela do cupom de 5% (sai o cupom de boas-vindas).'),
 ('s401/65e-site-carrinho-usar-cartao.jpg','65e','Carrinho · "Você tem um cartão · Usar"','Sai o "Tem um código?".'),
 ('s405/71a-site-carrinho-presente-guardado.jpg','71a','Carrinho · presente especial guardado','Mesma linha de qualquer cartão; "Escolher" leva à aba Exclusivo.'),
 ('s405/71b-site-carrinho-presente-escolhido.jpg','71b','Carrinho · presente escolhido','"✦ De presente" + "Presente especial aplicado − R$ 95".'),
 ('s405/71c-site-carrinho-oferta-sem-cartao.jpg','71c','Carrinho · peça em OFERTA','A peça diz que o cartão não vale nela; desconto só na outra.'),
 ('s401/66e-site-carrinho-cupom-entrou-sozinho.jpg','66e','Carrinho · peça da Exclusivo já com o cartão','+ "Guardar para outra compra".'),
 ('s401/66f-site-carrinho-leve-2-e-cartao.jpg','66f','Carrinho · "Leve 2" e cartão juntos','Entra o maior; o carrinho explica.')]),
 ('Aba Exclusivo',[
 ('s401/66a-site-inicio-prateleira-exclusivo.jpg','66a','Início · prateleira "Exclusivo"','Palavra em dourado, sem "10%".'),
 ('s401/65b-site-aba-exclusivo.jpg','65b','Aba Exclusivo (sem evento)','O cartão do cliente no topo (com o logo branco do 73f).'),
 ('s401/66b-site-exclusivo-mais-de-um-cupom.jpg','66b','Aba Exclusivo com mais de um cupom','Sem botões; no evento vale o da temática; fora, o que vence primeiro.'),
 ('s401/65c-site-aba-exclusivo-natal.jpg','65c','Aba Exclusivo no evento (Natal)','O desenho mudou depois da aprovação — conferir.'),
 ('s405/71d-site-exclusivo-presente-de-natal.jpg','71d','Aba Exclusivo · presente na temática','"presente de Natal".'),
 ('s405/71e-cartao-presente-por-tematica.jpg','71e','Cartão do presente em cada temática',''),
 ('s401/66g-site-minha-conta-trocar-cartao.jpg','66g','Minha conta › Cartões · trocar o cartão em uso','')]),
 ('Cliente VIP, Minha conta e reservas',[
 ('s403/69a-site-minha-conta-vip-sutil.jpg','69a','Minha conta do VIP','Nome + "✦ Cliente VIP".'),
 ('s403/70a-site-minha-conta-nome-do-cliente.jpg','70a','Minha conta · nome do cliente (todos)','Quem não é VIP vê só o nome.'),
 ('s403/70b-site-menu-conta-vip.jpg','70b','Menu · conta do VIP','"Meus pedidos" continua.'),
 ('s403/68c-site-inicio-novidades-vip.jpg','68c','Início · novidades 48 h antes para o VIP','Quem não é VIP não vê essas peças nas 48 h.'),
 ('s403/70c-site-pagamento-reserva-vip.jpg','70c','Pagamento · reserva VIP de 3 horas','Uma por vez; você cancela no app enquanto não pago; sem e-mail.'),
 ('s403/70d-site-pedidos-reserva-cancelada.jpg','70d','Pedidos · reserva cancelada (fechada)','Setinha à direita do selo.'),
 ('s403/70e-site-pedidos-reserva-cancelada-abrindo.jpg','70e','Pedidos · reserva cancelada abrindo','Vídeo: 70e-...-animacao.mp4.'),
 ('s403/68g-site-minha-conta-escada-indicacoes.jpg','68g','Minha conta › Cartões · escada','Próximos degraus "?"; números centrados.')])]
FORA=[]
REGRAS=['Escada: 1 indicação → 10% · mais 3 → 15% · mais 5 → "leve outro de presente" · recomeça; cada prêmio é um cartão separado; os próximos degraus ficam em surpresa.','Sai o cupom de boas-vindas (a inscrição continua).','Nenhum cartão mostra código ao cliente (inclui o e-mail do evento já publicado).','Temática: só o cupom do evento e o presente especial mudam; cartões pessoais sempre vinho; VIP preto e dourado; aniversário com confete.','VIP: novidades 48 h antes, reserva de 3 h, atendimento prioritário, presente de aniversário; sem frete. Status sutil, sem cartão de status.','Reserva vencida ou cancelada antes de pagar não gera e-mail; o e-mail de cancelado só para pedido pago.']
u=lambda f:'data:image/jpeg;base64,'+base64.b64encode(open(W+f,'rb').read()).decode()
CSS="@page{size:A4;margin:12mm}body{font-family:Inter,Arial,sans-serif;color:#1d1418}h1{font:500 26px Georgia,serif;margin:0 0 4px}h2{font:600 15px Arial;color:#8d3a69;margin:16px 0 6px}p,li{font-size:11.5px;line-height:1.5;color:#4a3f45}table{border-collapse:collapse;width:100%}td{font-size:11px;padding:4px 6px;border-bottom:1px solid #e6dde2;vertical-align:top}td.n{font-weight:700;width:34px;color:#8d3a69}.pg{page-break-before:always;text-align:center}.pg h3{font:600 14px Arial;text-align:left;margin:0 0 2px}.pg p{text-align:left;margin:0 0 6px}.pg img{max-width:100%;max-height:250mm;border:1px solid #ddd}"
h='<h1>Vistoria final · esboços aprovados</h1><p>17/11/2026 · retirado da lista viva (docs/FALTA-APROVAR-15-11.md). Tudo abaixo está APROVADO e esperando o seu "implementar". Nada foi implementado. Cada esboço vem numa página depois do índice.</p><h2>Regras aprovadas (sem esboço próprio)</h2><ul>'+''.join('<li>'+html.escape(r)+'</li>' for r in REGRAS)+'</ul>'
n=0
for g,its in A:
    h+='<h2>'+g+'</h2><table>'+''.join('<tr><td class="n">'+i[1]+'</td><td><b>'+html.escape(i[2])+'</b>'+(' — '+html.escape(i[3]) if i[3] else '')+'</td></tr>' for i in its)+'</table>';n+=len(its)
h+='<h2>Sem decisão</h2><p>Nenhum.</p><h2>Retirados ou trocados</h2><p>64a/64b → 71a/71b · 65f → 71c · 66d → 71d · 65d · 63c · 65a · 66c · 61c · 68a · 68d · 69b · 69c · 69d · 72a/72b · 73/73b/73c/73d/73e · cartão que cresce · 20% na escada · reserva de 24 h · BIMI · frete do VIP.</p>'
for g,its in A:
    for f,c,t,nt in its: h+='<div class="pg"><h3>'+c+' · '+html.escape(t)+'</h3><p>'+html.escape(nt)+'</p><img src="'+u(f)+'"></div>'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page();pg.set_content('<html><head><meta charset="utf-8"><style>'+CSS+'</style></head><body>'+h+'</body></html>');pg.wait_for_timeout(500)
    pg.pdf(path=W+'s404/vistoria-esbocos-aprovados-17-11-v2.pdf',format='A4',print_background=True);b.close()
print(n,'esboços',os.path.getsize(W+'s404/vistoria-esbocos-aprovados-17-11-v2.pdf')//1024,'KB')
