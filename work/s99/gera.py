import base64
ap=base64.b64encode(open('mochi_aponta.png','rb').read()).decode()
svg=open('/home/claude/gz/mochi.svg').read()
def com(tras,frente,bg=''):
  i=svg.index('>',svg.index('<svg'))+1;j=svg.rfind('</svg>')
  return svg[:i]+bg+tras+svg[i:j]+frente+svg[j:]
NATAL=('','''<g transform="rotate(-12 60 34)"><path d="M30 38 C38 10 70 2 96 14 C104 18 108 26 104 32 C96 24 84 22 76 26 L90 38 Z" fill="#c8102e"/>
<rect x="24" y="33" width="72" height="10" rx="5" fill="#fff" stroke="#f0e6ec"/><circle cx="104" cy="34" r="6" fill="#fff" stroke="#f0e6ec"/></g>''',
'<g fill="#9fb8d6"><text x="-4" y="70" font-size="9">❄</text><text x="112" y="56" font-size="7">❄</text><text x="106" y="104" font-size="8">❄</text></g>')
HALL=('','''<g transform="rotate(-8 60 34)"><path d="M16 40 Q60 30 104 40 Q60 48 16 40 Z" fill="#2b1636"/><path d="M38 38 L56 2 Q60 -4 64 4 L80 38 Z" fill="#3a1f4a"/>
<rect x="38" y="31" width="42" height="7" fill="#f08a24"/><rect x="55" y="30" width="9" height="9" rx="1.5" fill="none" stroke="#ffd166" stroke-width="1.6"/></g>''',
'<g fill="#3a1f4a"><path d="M-4 52 q4 -6 8 0 q2 -3 4 0 q4 -6 8 0 q-4 2 -10 2 q-6 0 -10 -2z"/><path d="M106 70 q3 -5 6 0 q1.5 -2 3 0 q3 -5 6 0 q-3 1.5 -7.5 1.5 q-4.5 0 -7.5 -1.5z"/></g>')
BF=('','''<path d="M18 57 Q60 42 102 57" stroke="#111" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M84 40 L78 52 L83 52 L79 62 L90 47 L85 47 L89 40 Z" fill="#e6b84c"/>
<g transform="rotate(14 98 66)"><path d="M92 58 L106 58 L110 64 L106 70 L92 70 Z" fill="#111"/><text x="93.5" y="66.5" font-size="6" font-weight="800" fill="#e6b84c" font-family="Inter,Arial">%</text></g>''','')
NOVO=('','''<g transform="rotate(10 60 30)"><path d="M46 38 L62 4 L78 38 Z" fill="#e6b84c"/><path d="M50 30 L74 30 M54 22 L70 22 M58 14 L66 14" stroke="#fff6d8" stroke-width="2.2"/><circle cx="62" cy="4" r="4" fill="#fff6d8"/></g>''',
'<g fill="#e6b84c"><path d="M2 56 l2 -6 2 6 6 2 -6 2 -2 6 -2 -6 -6 -2z"/><path d="M112 46 l1.5 -4.5 1.5 4.5 4.5 1.5 -4.5 1.5 -1.5 4.5 -1.5 -4.5 -4.5 -1.5z"/><path d="M108 96 l1.2 -3.6 1.2 3.6 3.6 1.2 -3.6 1.2 -1.2 3.6 -1.2 -3.6 -3.6 -1.2z"/></g>')
temas=[('🎄 Natal',NATAL,'Gorro de Papai Noel (o espelhinho continua aparecendo), flocos de neve caindo devagar no fundo. Gesto livre extra: balança o pompom. Ponteiro com listras de bengala doce.','#eef4fb'),
('🎃 Halloween',HALL,'Chapéu de bruxinha com fivela; dois morceguinhos passam voando uma vez na entrada (e às vezes no tempo livre). Ponteiro com uma aboborinha na ponta.','#f6eefa'),
('⚡ Black Friday',BF,'Faixa da cabeça preta com raio dourado e uma etiqueta “%” pendurada que balança com a mola. Ponteiro preto e dourado.','#f3f1ee'),
('✨ Ano Novo',NOVO,'Chapeuzinho de festa dourado e brilhinhos piscando em volta (sem confete). À noite os brilhinhos ficam mais fortes, como o site. No resultado, uma serpentina dourada pequena.','#fbf6e9')]
cards=''.join(f'<div class="tm" style="background:{bg}"><div class="mz">{com(*t)}</div><h3>{n}</h3><p>{d}</p></div>' for n,t,d,bg in temas)
def quadro(linhas,hl,extra=''):
  ys=[22,92,162];ln=''.join(f'<div class="ql" style="top:{ys[i]}px;font-size:{fs}px{";background:#c46a9c24" if i==hl else ""}">{t}</div>' for i,(t,fs) in enumerate(linhas))
  return f'<div class="tel"><div class="qd">{ln}{extra}</div><img class="ma" src="data:image/png;base64,{ap}" style="top:{ys[hl]-12}px"></div>'
L1=[('Bom dia!',17),('A casa é azul.',14.3),('O café está pronto.',12.4)]
L2=[('Ligue para a farmácia.',10.9),('O ônibus passa às oito.',9.5),('Leia a receita com calma.',8.3)]
L3=[('O jornal fala do tempo.',7.2),('Tome 1 comprimido ao dia.',6.3),('Agite antes de usar.',5.5)]
seta='<div class="st">↑ ele puxa o quadro</div>'
F=[(quadro(L1,0),'1 · aponta a frase de <b>cima</b>'),(quadro(L1,1),'2 · desliza e aponta a do <b>meio</b>'),(quadro(L1,2),'3 · aponta a de <b>baixo</b>'),
 (quadro(L2,0,seta),'4 · puxa o quadro: entram as 3 seguintes e ele volta para cima'),(quadro(L3,2),'5 · as menores (bula) ficam <b>embaixo</b>: olhando para baixo, como numa leitura real')]
sb=''.join(f'<div class="fr">{a}<p>{b}</p></div>' for a,b in F)
h=open('molde.html').read().replace('@@SB@@',sb).replace('@@CARDS@@',cards)
open('s99.html','w').write(h)
