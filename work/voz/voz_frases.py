# Frases faladas pelo Mochi (as chaves são exatamente o texto que o site fala, frase a frase)
import re
FIX=['Oi! Eu sou o Mochi.','Vou te ajudar a achar o grau do seu óculos de leitura.','Quando quiser, é só tocar em Começar.',
'Faz como eu: tire os óculos…','…e segure o celular a 40 centímetros, um palmo e meio.',
'Chegue o celular um pouquinho mais perto, a 40 centímetros.','Afaste um pouquinho o celular, para uns 40 centímetros.',
'Consegue ler a frase aqui na minha frente, sem esforço?',
'E esta?','Consegue esta?','Agora esta aqui.','Vamos descendo… e esta?','Esta é um pouquinho menor.','Sem pressa: e esta?',
'Isso!','Muito bem.','Ótimo.','Perfeito, próxima.','Você está indo bem.',
'Agora fica miudinha…','Esta é letra de bula.','Última, a mais pequena.',
'Tudo bem, é normal.','Sem problema — é para isso que servem as lentes.','Ótimo saber. Vou pegar uma lente.',
'Vou testar uma um pouco mais forte.','Mais um passinho de grau…',
'Agora uma mais fraca, como o médico faz.','Só para ter certeza: e com esta?',
'Sem pressa.','Se estiver difícil, pode dizer que não consegue — sem problema.',
'Leu! Agora vou tirando um pouquinho de grau, como o médico, até achar o mais leve que ainda funciona.',
'Consegue ler a última frase?','E agora?','Boa notícia: você lê bem de perto sem óculos!','Para não chutar um grau, vale consultar um oftalmologista.']
PRE={'lente':'Com a lente','esta':'Esta é','pronto':'Pronto! O grau que mais combina com você é'}
G=[x/100 for x in range(75,401,25)]
PT_N={0:'zero',1:'um',2:'dois',3:'três',4:'quatro'};ES_N={0:'cero',1:'uno',2:'dos',3:'tres',4:'cuatro'}
PT_D={25:'vinte e cinco',50:'cinquenta',75:'setenta e cinco'};ES_D={25:'veinticinco',50:'cincuenta',75:'setenta y cinco'}
def gfala(g,es):
  i=int(g);d=round((g-i)*100)
  if es:return 'más '+ES_N[i]+('' if d==0 else ' coma '+ES_D[d])+'.'
  return 'mais '+PT_N[i]+('' if d==0 else ' vírgula '+PT_D[d])+'.'
def gf(g):return '+%.2f'%g
def parte(t):return [x.strip() for x in re.split(r'(?<=[.!?…])\s+',t) if x.strip()]
