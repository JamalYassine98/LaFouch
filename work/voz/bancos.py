PT=[
['Bom dia!','Boa tarde!','Boa noite!','Tudo bem?','Bem-vindo!','Que calor!','Até logo!','Que bom!','Volto já!','Que frio!','Parabéns!','Boa sorte!'],
['A casa é azul.','A porta é verde.','O gato dorme.','A sopa é boa.','O mar é calmo.','A rua é longa.','O bolo é doce.','A flor é rosa.','O sol já saiu.','A água é fria.','O chá esfriou.','A mesa é nova.'],
['O café está pronto.','O pão está quentinho.','A chave está na mesa.','Compre leite e pão.','A janela está aberta.','Feche bem a porta.','O bolo saiu do forno.','A loja está fechada.','Hoje vai fazer sol.','A roupa já secou.','O almoço está bom.','Traga o guarda-chuva.'],
['Ligue para a farmácia.','Feche a janela da sala.','A loja abre às nove.','O gato dorme no sofá.','Regue as plantas cedo.','Leve a sacola de feira.','Lave bem a fruta antes.','Guarde em lugar seco.','Apague a luz do quarto.','Passe na padaria hoje.','O pão chega bem cedo.','Tire o lixo à noite.'],
['O ônibus passa às oito.','A feira começa cedinho.','O vizinho trouxe bolo.','A chuva molhou a roupa.','O mercado fecha tarde.','Esquente a sopa no fogo.','O carteiro já passou.','As flores abriram hoje.','O filme começa às dez.','A praça está cheia hoje.','Deixe a chave com ela.','O trem chegou na hora.'],
['Leia a receita com calma.','Guarde o troco na bolsa.','Coloque o casaco na cama.','A farmácia fica na esquina.','Ponha mais água no feijão.','O jantar fica pronto já.','Leve o guarda-chuva hoje.','Compre frutas na quitanda.','A reunião vai começar logo.','Separe as roupas brancas.','Lembre de tomar mais água.','O bolo de milho esfriou.'],
['O jornal fala do tempo.','A novela começa tarde.','O rádio toca uma música.','A sala ficou bem limpa.','O vento fechou a porta.','A torta de limão acabou.','O livro está na estante.','A chuva parou à tarde.','O café ficou bem forte.','A janela dá para o mar.','O banco abre mais cedo.','Hoje o almoço é peixe.'],
['Tome 1 comprimido ao dia.','Use duas gotas à noite.','Tome com um copo de água.','Conservar em local fresco.','Manter longe do sol forte.','Tomar depois das refeições.','Validade impressa na caixa.','Aplicar duas vezes ao dia.','Lavar as mãos antes do uso.','Agite bem o frasco antes.','Guardar fora do alcance.','Uso adulto e pediátrico.'],
['Agite antes de usar.','Manter em local seco.','Uso somente externo.','Proteger da luz forte.','Não congelar o frasco.','Contém cinco cápsulas.','Tampe após cada uso.','Guarde na geladeira.','Não use se violado.','Diluir em pouca água.','Tomar com alimentos.','Leia a bula antes.']]
ES=[
['¡Buen día!','¿Todo bien?','¡Bienvenido!','¡Qué calor!','¡Nos vemos!','¡Qué bueno!','¡Ya vuelvo!','¡Qué frío!','¡Suerte!','¡Buenas!','¡Qué lindo!','¡Adelante!'],
['La casa es azul.','La puerta es roja.','El gato duerme.','La sopa está rica.','El mar está calmo.','La calle es larga.','La torta es dulce.','La flor es rosa.','Ya salió el sol.','El agua está fría.','El té se enfrió.','La mesa es nueva.'],
['El café está listo.','El pan está caliente.','La llave está acá.','Comprá leche y pan.','Cerrá bien la puerta.','La torta salió rica.','El local ya cerró.','Hoy va a hacer sol.','La ropa ya se secó.','La comida está rica.','Traé el paraguas.','El mate está listo.'],
['Llamá a la farmacia.','Cerrá la ventana ya.','Abren a las nueve.','El gato duerme acá.','Regá las plantas hoy.','Llevá la bolsa grande.','Lavá bien la fruta.','Guardar en lugar seco.','Apagá la luz del baño.','Pasá por la panadería.','El pan llega temprano.','Sacá la basura hoy.'],
['El colectivo pasa a las ocho.','La feria empieza muy temprano.','El vecino trajo una torta rica.','La lluvia mojó toda la ropa.','El súper cierra muy tarde hoy.','Calentá la sopa en el fuego.','El cartero ya pasó por acá.','Las flores se abrieron hoy.','La película empieza a las diez.','La plaza está llena de gente.','Dejale la llave a tu vecina.','El tren llegó justo a horario.'],
['Leé la receta con calma.','Poné el abrigo en la cama.','La farmacia queda cerca.','Poné más agua en la olla.','La cena está casi lista.','Llevá el paraguas hoy.','Comprá fruta en la feria.','La reunión empieza pronto.','Separá la ropa blanca.','Acordate de tomar agua.','La chipa ya se enfrió.','Cerrá la llave del gas.'],
['El diario habla del clima.','La novela empieza tarde.','La radio pasa buena música.','La sala quedó muy limpia.','El viento cerró la puerta.','Ya no hay torta de limón.','El libro está en el estante.','La lluvia paró a la tarde.','El café quedó muy fuerte.','La ventana da a la calle.','El banco abre más temprano.','Hoy almorzamos con pescado.'],
['Tomar 1 comprimido al día.','Usar dos gotas a la noche.','Tomar con un vaso de agua.','Conservar en lugar fresco.','Mantener lejos del calor.','Tomar luego de cada comida.','Ver vencimiento en la caja.','Aplicar dos veces al día.','Lavarse las manos antes.','Agitar bien antes del uso.','Mantener fuera del alcance.','Uso adulto y pediátrico.'],
['Agitar antes de usar.','Mantener en lugar seco.','Solo para uso externo.','Proteger de la luz.','No congelar el frasco.','Contiene diez cápsulas.','Tapar después de usar.','Guardar en la heladera.','No usar si está roto.','Diluir en poca agua.','Tomar con alimentos.','Leer antes de usar.']]
import json,sys
ok=True
for nome,B in (('PT',PT),('ES',ES)):
  for i,b in enumerate(B):
    base=len(b[0]);bad=[(x,len(x)) for x in b if abs(len(x)-base)>2]
    if len(b)!=12 or len(set(b))!=12 or bad: ok=False;print(nome,i,len(b),base,bad)
print('ok' if ok else 'ERRO')
if ok and len(sys.argv)>1:
  print('var BQ_PT='+json.dumps(PT,ensure_ascii=False)+',BQ_ES='+json.dumps(ES,ensure_ascii=False)+';')
