# Roteiro em CENAS (ordem real em que o Mochi fala). Cada item: chave exata em PT (o que o site fala) e, se preciso, como falar.
# A chave em ES vem da tradução do próprio site (LFI.tr), para casar 100% com o que o site fala.
GR=[x/100 for x in range(75,401,25)]
PT_N={0:'zero',1:'um',2:'dois',3:'três',4:'quatro'};ES_N={0:'cero',1:'uno',2:'dos',3:'tres',4:'cuatro'}
PT_D={0:'',25:' e vinte e cinco',50:' e meio',75:' e setenta e cinco'};ES_D={0:'',25:' veinticinco',50:' y medio',75:' setenta y cinco'}
def gfala(g,es):
  i=int(g);d=round((g-i)*100)
  if es:return ES_N[i]+ES_D[d]
  if i==0:return 'zero setenta e cinco'  # pedido do dono: 0.75 = "zero setenta e cinco"
  return PT_N[i]+PT_D[d]
def gf(g):return '+%.2f'%g
CENAS=[
 ['Oi!','Eu sou o Mochi.','Vou te ajudar a achar o grau do seu óculos de leitura.','Quando quiser, é só tocar em Começar.'],
 ['Faz como eu: tire os óculos…',('…e segure o celular a 30 centímetros, um palmo.','30','trinta'),'Consegue ler a frase aqui na minha frente, sem esforço?'],
 ['Chegue o celular um pouquinho mais perto.','Afaste um pouquinho o celular.'],
 ['Isso!','E esta?','Muito bem.','Consegue esta?','Ótimo.','Agora esta aqui.'],
 ['Perfeito, próxima.','Vamos descendo…','e esta?','Você está indo bem.','Esta é um pouquinho menor.','Sem pressa: e esta?'],
 ['Agora vem uma letra menor.','Esta é bem pequena.','Consegue ler?','Esta é letra de bula.','Última, a mais pequena.'],
 ['Tudo bem, é normal.','Sem problema — é para isso que servem as lentes.','Ótimo saber.','Vou pegar uma lente.'],
 ['Vou testar uma um pouco mais forte.','Mais um passinho de grau…','Consegue ler a última frase?','E agora?'],
 ['Leu!','Agora vou tirando um pouquinho de grau, até achar o mais leve que ainda funciona.','Agora uma mais fraca.','Só para ter certeza: e com esta?'],
 ['Sem pressa.','Se estiver difícil, pode dizer que não consegue — sem problema.'],
 ['Pronto!','Boa notícia: você lê bem de perto sem óculos!','Para não chutar um grau, vale consultar um oftalmologista.'],
]
# cenas do grau: só as frases com grau são guardadas; as outras dão a entonação (e já existem nas cenas acima)
def cena_grau(g):
  return [('Com a lente '+gf(g)+'.','G',g),('Consegue ler?',None,None),('Esta é '+gf(g)+'.','G',g),('E agora?',None,None),('Pronto!',None,None),('O grau que mais combina com você é '+gf(g)+'.','G',g)]
