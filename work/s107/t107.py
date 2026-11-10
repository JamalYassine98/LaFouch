# S105: a cabeça embaixo do chapéu é cortada (some), então o chapéu tem o formato que fica mais bonito; óculos temáticos novos
import re
svg0=open('/home/claude/gz/mochi.svg').read()
CORPO='<path d="M60 30 C95 30 106 58 106 84 C106 108 88 122 60 122 C32 122 14 108 14 84 C14 58 25 30 60 30Z"'
BRILHO='<path d="M30 62 C32 50 41 42 54 39"'
def base(corte):
  s=svg0.replace('<g class="esp"','<g class="esp" display="none"',1)
  s=s.replace('<path d="M17 66 Q60 44 103 66" stroke="#8d3a69"','<path display="none" d="M17 66 Q60 44 103 66" stroke="#8d3a69"',1)
  cp=f'<clipPath id="cc"><path d="{corte}"/></clipPath>'
  s=s.replace(CORPO+' fill="url(#lfmb)"',CORPO+' clip-path="url(#cc)" fill="url(#lfmb)"',1).replace(BRILHO,BRILHO+' clip-path="url(#cc)"',1)
  i=s.index('>',s.index('<svg'))+1;return s[:i]+'<defs>'+cp+'</defs>'+s[i:]
def troca_oculos(s,novo):
  i=s.index('<g class="oclT"');i=s.index('>',i)+1;j=s.index('<g class="fog">',i)
  k=s.index('</g></g>',j);fim=s.index('</g>',j)+4  # fecha o fog
  return s[:i]+novo+'<g class="fog"></g>'+s[k:]
def monta(t,so=None):
  s=base(t['corte']);s=troca_oculos(s,t['ocl'])
  i=s.index('>',s.index('<svg'))+1;j=s.rfind('</svg>')
  if so=='cab':return s[:i]+'<defs><clipPath id="cc2"><path d="'+t['corte']+'"/></clipPath></defs><g clip-path="url(#cc2)">'+CORPO+' fill="#000" stroke="#000" stroke-width="1.4"/></g>'+s[j:]
  if so=='fr':return s[:i]+t['fr']+s[j:]
  if so=='oc':k=s.index('<g class="ocl">');m=s.index('<ellipse cx="31" cy="101"',k);return s[:i]+s[k:m]+s[j:]
  return s[:i]+t.get('fundo','')+t.get('tr','')+s[i:j]+t['fr']+s[j:]
def corte_reto(y):return f'M-40 {y} L160 {y} L160 200 L-40 200 Z'
def corte_curvo(y0,ym):return f'M-40 {y0} L10 {y0} Q60 {2*ym-y0} 110 {y0} L160 {y0} L160 200 L-40 200 Z'
GO='<linearGradient id="go" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c3922a"/><stop offset=".5" stop-color="#f6dc8c"/><stop offset="1" stop-color="#c3922a"/></linearGradient>'
TEMP=lambda c,w=2.6:f'<path d="M32 81 C26 79 21 78 16.5 79" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round"/><path d="M88 81 C94 79 99 78 103.5 79" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round"/>'
LENTE='<circle cx="45" cy="83" r="12" fill="url(#lfmlz)"/><circle cx="75" cy="83" r="12" fill="url(#lfmlz)"/>'
BRL='<path d="M36 76 l4 -2.5 M66 76 l4 -2.5" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'
# --- óculos de Natal: guirlandas (folhinhas em volta) com frutinhas e um lacinho na ponte
def guirlanda(cx):
  import math
  f=''.join(f'<ellipse cx="{cx+13*math.cos(a):.2f}" cy="{83+13*math.sin(a):.2f}" rx="3.1" ry="1.7" transform="rotate({math.degrees(a)+90:.0f} {cx+13*math.cos(a):.2f} {83+13*math.sin(a):.2f})" fill="{"#2e8b57" if k%2 else "#3aa76d"}"/>' for k,a in enumerate([i*math.pi/8 for i in range(16)]))
  b=''.join(f'<circle cx="{cx+13*math.cos(a):.2f}" cy="{83+13*math.sin(a):.2f}" r="1.6" fill="#e2203d"/>' for a in [-2.3,-0.9,0.6,2.1])
  return f'<circle cx="{cx}" cy="83" r="13" fill="none" stroke="#1f6e43" stroke-width="2.4"/>'+f+b
OCL_NATAL=LENTE+guirlanda(45)+guirlanda(75)+TEMP('#1f6e43')+'<g transform="translate(60 74)"><path d="M0 0 C-4 -4 -8 -2 -7 1 C-6 4 -3 2 0 0 C3 2 6 4 7 1 C8 -2 4 -4 0 0Z" fill="#e2203d"/><path d="M0 0 l-3 6 M0 0 l3 6" stroke="#e2203d" stroke-width="1.6" stroke-linecap="round"/><circle r="1.8" fill="#b30f2b"/></g>'+BRL
# --- Halloween: aros de abóbora (gomos + cabinho) e ponte de morceguinho
def abobora(cx):
  return (f'<path d="M{cx} 70.5 C{cx-6} 69 {cx-12} 71 {cx-13.5} 77 C{cx-15} 83 {cx-14} 90 {cx-9} 94.5 C{cx-5} 97.5 {cx+5} 97.5 {cx+9} 94.5 C{cx+14} 90 {cx+15} 83 {cx+13.5} 77 C{cx+12} 71 {cx+6} 69 {cx} 70.5Z" fill="none" stroke="#f08a24" stroke-width="3"/>'
          f'<path d="M{cx-5.5} 71 Q{cx-8} 83 {cx-5.5} 96.5 M{cx+5.5} 71 Q{cx+8} 83 {cx+5.5} 96.5" stroke="#d9711a" stroke-width="1.1" fill="none" opacity=".55"/>'
          f'<path d="M{cx} 70.5 q-.5 -1.8 1.6 -3" stroke="#3f7d3a" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M{cx+1.4} 68.2 q3.2 -1 4 1.2 q-2.4 .8 -4 -1.2z" fill="#4f9a48"/>')
OCL_HALL=LENTE+abobora(45)+abobora(75)+TEMP('#3a1f4a')+'<path transform="translate(60 80)" d="M-7 0 q2.5 -4 5 -1.2 q1 -2.4 2 -2.4 q1 0 2 2.4 q2.5 -2.8 5 1.2 q-3.5 0 -7 2 q-3.5 -2 -7 -2z" fill="#3a1f4a"/>'+BRL
# --- Black Friday: armação preta geométrica (octógono) com filete dourado + etiqueta "%" pendurada na ponte
def octo(cx,r):
  import math;pts=' '.join(f'{cx+r*math.cos(math.pi/8+i*math.pi/4):.2f},{83+r*math.sin(math.pi/8+i*math.pi/4):.2f}' for i in range(8));return pts
OCL_BF=LENTE+f'<polygon points="{octo(45,13.6)}" fill="none" stroke="#111" stroke-width="3.4" stroke-linejoin="round"/><polygon points="{octo(75,13.6)}" fill="none" stroke="#111" stroke-width="3.4" stroke-linejoin="round"/>'+\
 f'<polygon points="{octo(45,11.6)}" fill="none" stroke="#e6b84c" stroke-width=".9"/><polygon points="{octo(75,11.6)}" fill="none" stroke="#e6b84c" stroke-width=".9"/>'+\
 '<path d="M57.5 80.5 q2.5 -2.5 5 0" stroke="#111" stroke-width="3" fill="none"/>'+TEMP('#111',2.8)+'<circle cx="32" cy="80.5" r="1.6" fill="#e6b84c"/><circle cx="88" cy="80.5" r="1.6" fill="#e6b84c"/>'+\
 '<g transform="translate(60 81.5)"><path d="M0 0 L0 3.5" stroke="#e6b84c" stroke-width=".8"/><path d="M-3.2 3.5 L3.2 3.5 L3.2 10 L0 12 L-3.2 10Z" fill="#e6b84c"/><text x="0" y="9.6" text-anchor="middle" font-size="5.2" font-weight="900" font-family="Inter,Arial" fill="#111">%</text></g>'+BRL
# --- Ano Novo: óculos de estrela dourados (de festa), com brilhinho
def estrela(cx,R,r):
  import math;pts=' '.join(f'{cx+(R if i%2==0 else r)*math.cos(-math.pi/2+i*math.pi/5):.2f},{83+(R if i%2==0 else r)*math.sin(-math.pi/2+i*math.pi/5):.2f}' for i in range(10));return pts
OCL_NOVO=f'<polygon points="{estrela(45,15.6,11.2)}" fill="url(#lfmlz)" stroke="url(#go2)" stroke-width="2.6" stroke-linejoin="round"/><polygon points="{estrela(75,15.6,11.2)}" fill="url(#lfmlz)" stroke="url(#go2)" stroke-width="2.6" stroke-linejoin="round"/>'+\
 '<defs><linearGradient id="go2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6dc8c"/><stop offset=".5" stop-color="#d9a93a"/><stop offset="1" stop-color="#f3d27a"/></linearGradient></defs>'+\
 '<path d="M57.5 80.5 q2.5 -2.5 5 0" stroke="#d9a93a" stroke-width="2.6" fill="none"/>'+TEMP('#d9a93a')+'<path d="M37 74 l1 -3 1 3 3 1 -3 1 -1 3 -1 -3 -3 -1z M85 92 l.8 -2.4 .8 2.4 2.4 .8 -2.4 .8 -.8 2.4 -.8 -2.4 -2.4 -.8z" fill="#fff"/>'
NATAL=dict(nome='🎄 Natal',bg='#eef4fb',corte=corte_curvo(62,56),
 fr='''<defs><linearGradient id="nr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2203d"/><stop offset="1" stop-color="#a50d27"/></linearGradient></defs>
<path d="M18 60 C18 38 30 20 50 15 C66 11 82 14 92 22 C100 28 106 38 108 50 L101 52 C99 44 95 37 89 33 C93 40 96 48 97 58 Z" fill="url(#nr)"/>
<path d="M89 33 C95 37 99 44 101 52 L108 50 C106 40 101 31 94 25 Z" fill="#9e0c24" opacity=".55"/>
<path d="M32 26 C40 20 50 17 60 16" stroke="#fff" stroke-width="2.2" opacity=".35" fill="none" stroke-linecap="round"/>
<path d="M14 63 Q60 49 106 63" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M14 63 Q60 49 106 63" stroke="#e8dde4" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="1 5" opacity=".55"/>
<circle cx="106" cy="54" r="7" fill="#fff" stroke="#ece2e8"/>''',ocl=OCL_NATAL,
 fundo='<g fill="#9fb8d6"><text x="-6" y="72" font-size="9">❄</text><text x="114" y="36" font-size="7">❄</text><text x="112" y="104" font-size="8">❄</text></g>')
HALL=dict(nome='🎃 Halloween',bg='#f6eefa',corte=corte_reto(58),
 tr='<ellipse cx="60" cy="57" rx="70" ry="9.5" fill="#2b1636"/><ellipse cx="60" cy="56.5" rx="62" ry="7" fill="#3a2149"/>',
 fr='''<path d="M-10 57 A70 9.5 0 0 0 130 57 Z" fill="#2b1636"/><path d="M-2 57.6 A62 7 0 0 0 122 57.6" stroke="#4a2a5e" stroke-width="1" fill="none" opacity=".7"/>
<path d="M30 58 C35 44 42 30 50 20 C55 13 62 7 71 5 C76 4 80 6 82 9 C75 7 70 10 69 15 C76 27 85 43 90 58 Q60 63 30 58 Z" fill="#3a1f4a"/>
<path d="M44 26 C47 21 50 18 54 15" stroke="#fff" stroke-width="1.6" opacity=".22" fill="none" stroke-linecap="round"/>
<path d="M30 58 Q60 63 90 58 L88 51.5 Q60 57 32 51.5 Z" fill="#f08a24"/><rect x="55" y="51.5" width="10.5" height="10" rx="1.8" fill="none" stroke="#ffd166" stroke-width="2"/>''',ocl=OCL_HALL,
 fundo='<g fill="#3a1f4a"><path d="M-8 74 q4 -6 8 0 q2 -3 4 0 q4 -6 8 0 q-4 2 -10 2 q-6 0 -10 -2z"/><path d="M110 86 q3 -5 6 0 q1.5 -2 3 0 q3 -5 6 0 q-3 1.5 -7.5 1.5 q-4.5 0 -7.5 -1.5z"/></g>')
BF=dict(nome='⚡ Black Friday',bg='#f3f1ee',corte=corte_reto(58),
 tr='<ellipse cx="60" cy="57" rx="66" ry="9.5" fill="#0b0b0b"/><ellipse cx="60" cy="56.5" rx="58" ry="7" fill="#1a1a1a"/>',
 fr='<defs><linearGradient id="bk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0d0d0d"/><stop offset=".32" stop-color="#2c2c2c"/><stop offset=".6" stop-color="#121212"/><stop offset="1" stop-color="#050505"/></linearGradient>'+GO+'''</defs>
<path d="M-6 57 A66 9.5 0 0 0 126 57 Z" fill="#0b0b0b"/><path d="M2 57.6 A58 7 0 0 0 118 57.6" stroke="#2a2a2a" stroke-width="1" fill="none"/>
<path d="M30 58 L32 12 Q60 7 88 12 L90 58 Q60 63 30 58 Z" fill="url(#bk)"/><ellipse cx="60" cy="11.6" rx="28" ry="4.4" fill="#1d1d1d" stroke="#3a3a3a" stroke-width=".8"/>
<text x="60" y="27" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="9.6" letter-spacing=".2" fill="url(#go)">BLACK</text>
<text x="60" y="38" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="9.6" letter-spacing=".2" fill="url(#go)">FRIDAY</text>
<path d="M30.8 45 Q60 50.5 89.2 45 L89.9 57.4 Q60 63 30.1 57.4 Z" fill="url(#go)"/>
<text x="60" y="56.5" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="7.6" fill="#141414">La Fouch</text>''',ocl=OCL_BF)
NOVO=dict(nome='✨ Ano Novo',bg='#fbf6e9',corte=corte_curvo(63,57),
 fr='<defs>'+GO+'''<radialGradient id="gg" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#fbe7a8"/><stop offset=".6" stop-color="#e6b84c"/><stop offset="1" stop-color="#b8892a"/></radialGradient>
<pattern id="lj" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1.05" fill="#fff6d8" opacity=".55"/></pattern></defs>
<path d="M17 61 C17 40 32 29 60 29 C88 29 103 40 103 61 Z" fill="url(#gg)"/><path d="M17 61 C17 40 32 29 60 29 C88 29 103 40 103 61 Z" fill="url(#lj)"/>
<path d="M15 63.5 Q60 51 105 63.5" stroke="url(#go)" stroke-width="10" fill="none" stroke-linecap="round"/>
<path d="M17 62.5 Q60 50 103 62.5" stroke="#fff6d8" stroke-width="1" fill="none" opacity=".7" stroke-dasharray="2 3"/>
<g fill="#f6dc8c" stroke="#c3922a" stroke-width=".7"><circle cx="60" cy="27" r="5"/><circle cx="55.5" cy="24.5" r="3.2"/><circle cx="64.5" cy="24.5" r="3.2"/><circle cx="60" cy="21.5" r="3.2"/></g>''',ocl=OCL_NOVO,
 fundo='<g fill="#e6b84c"><path d="M-2 66 l2 -6 2 6 6 2 -6 2 -2 6 -2 -6 -6 -2z"/><path d="M114 44 l1.5 -4.5 1.5 4.5 4.5 1.5 -4.5 1.5 -1.5 4.5 -1.5 -4.5 -4.5 -1.5z"/><path d="M110 100 l1.2 -3.6 1.2 3.6 3.6 1.2 -3.6 1.2 -1.2 3.6 -1.2 -3.6 -3.6 -1.2z"/></g>')
TEMAS=[NATAL,HALL,BF,NOVO]
# sobe um pouco os chapéus que ficaram perto demais dos óculos
def sobe(t,dy):
  g=f'<g transform="translate(0 {-dy})">';t=dict(t);t['fr']=g+t['fr']+'</g>'
  if t.get('tr'):t['tr']=g+t['tr']+'</g>'
  import re
  t['corte']=re.sub(r'(-?\d+(?:\.\d+)?)',lambda m:m.group(1),t['corte'])
  return t
def corte_sobe(c,dy):
  import re;nums=re.findall(r'-?\d+(?:\.\d+)?',c);out=[];k=0
  def r(m):
    nonlocal k;v=float(m.group(0));k+=1;return str(v-dy if k%2==0 and v<150 else v)
  return re.sub(r'-?\d+(?:\.\d+)?',r,c)
for T_,dy in ((HALL,2),(BF,1.5),(NOVO,2)):
  n=sobe(T_,dy);n['corte']=corte_sobe(T_['corte'],dy);T_.update(n)
TEMAS=[NATAL,HALL,BF,NOVO]
n=sobe(HALL,1.2);n['corte']=corte_sobe(HALL['corte'],1.2);HALL.update(n);TEMAS=[NATAL,HALL,BF,NOVO]
# ================= S106 =================
import math
EL,ER=43.5,76.5   # centros dos aros, mais afastados: a ponte aparece
def ponte(c,w=2.6):return f'<path d="M{EL+11.5} 81.5 Q60 77 {ER-11.5} 81.5" stroke="{c}" stroke-width="{w}" fill="none" stroke-linecap="round"/>'
def hastes(c,w=2.6):return f'<path d="M{EL-11.5} 81 C26 79 21 78 16.5 79" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round"/><path d="M{ER+11.5} 81 C94 79 99 78 103.5 79" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round"/>'
LEN2=f'<circle cx="{EL}" cy="83" r="10.6" fill="url(#lfmlz)"/><circle cx="{ER}" cy="83" r="10.6" fill="url(#lfmlz)"/>'
BRL2=f'<path d="M{EL-8} 77 l3.5 -2.2 M{ER-8} 77 l3.5 -2.2" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>'
def guirl(cx,r=11.5):
  f=''.join(f'<ellipse cx="{cx+r*math.cos(a):.2f}" cy="{83+r*math.sin(a):.2f}" rx="2.8" ry="1.6" transform="rotate({math.degrees(a)+90:.0f} {cx+r*math.cos(a):.2f} {83+r*math.sin(a):.2f})" fill="{"#2e8b57" if k%2 else "#3aa76d"}"/>' for k,a in enumerate([i*math.pi/7 for i in range(14)]))
  b=''.join(f'<circle cx="{cx+r*math.cos(a):.2f}" cy="{83+r*math.sin(a):.2f}" r="1.5" fill="#e2203d"/>' for a in [-2.4,-0.9,0.7,2.2])
  return f'<circle cx="{cx}" cy="83" r="{r}" fill="none" stroke="#1f6e43" stroke-width="2.2"/>'+f+b
LACO='<g transform="translate(60 77.5)"><path d="M0 0 C-4 -3.5 -7.5 -2 -6.5 1 C-5.5 3.5 -3 2 0 0 C3 2 5.5 3.5 6.5 1 C7.5 -2 4 -3.5 0 0Z" fill="#e2203d"/><path d="M0 0 l-2.5 5 M0 0 l2.5 5" stroke="#e2203d" stroke-width="1.5" stroke-linecap="round"/><circle r="1.6" fill="#b30f2b"/></g>'
OCL_NATAL=LEN2+guirl(EL)+guirl(ER)+ponte('#1f6e43',2.4)+hastes('#1f6e43')+LACO+BRL2
def abob(cx):
  s=0.88
  return (f'<g transform="translate({cx} 83) scale({s}) translate({-cx} -83)"><path d="M{cx} 70.5 C{cx-6} 69 {cx-12} 71 {cx-13.5} 77 C{cx-15} 83 {cx-14} 90 {cx-9} 94.5 C{cx-5} 97.5 {cx+5} 97.5 {cx+9} 94.5 C{cx+14} 90 {cx+15} 83 {cx+13.5} 77 C{cx+12} 71 {cx+6} 69 {cx} 70.5Z" fill="none" stroke="#f08a24" stroke-width="3.2"/>'
          f'<path d="M{cx-5.5} 71 Q{cx-8} 83 {cx-5.5} 96.5 M{cx+5.5} 71 Q{cx+8} 83 {cx+5.5} 96.5" stroke="#d9711a" stroke-width="1.2" fill="none" opacity=".55"/>'
          f'<path d="M{cx} 70.5 q-.5 -1.8 1.6 -3" stroke="#3f7d3a" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M{cx+1.4} 68.2 q3.2 -1 4 1.2 q-2.4 .8 -4 -1.2z" fill="#4f9a48"/></g>')
MORC='<path transform="translate(60 78.6) scale(.9)" d="M-7 0 q2.5 -4 5 -1.2 q1 -2.4 2 -2.4 q1 0 2 2.4 q2.5 -2.8 5 1.2 q-3.5 0 -7 2 q-3.5 -2 -7 -2z" fill="#3a1f4a"/>'
OCL_HALL=LEN2+abob(EL)+abob(ER)+ponte('#f08a24',2.6)+hastes('#3a1f4a')+MORC+BRL2
def octo2(cx,r):return ' '.join(f'{cx+r*math.cos(math.pi/8+i*math.pi/4):.2f},{83+r*math.sin(math.pi/8+i*math.pi/4):.2f}' for i in range(8))
TAG='<g transform="translate(60 79.5)"><path d="M0 0 L0 3.6" stroke="#e6b84c" stroke-width=".8"/><path d="M-3.2 3.6 L3.2 3.6 L3.2 10 L0 12 L-3.2 10Z" fill="#e6b84c"/><text x="0" y="9.7" text-anchor="middle" font-size="5.2" font-weight="900" font-family="Inter,Arial" fill="#111">%</text></g>'
OCL_BF=LEN2+''.join(f'<polygon points="{octo2(c,12.2)}" fill="none" stroke="#111" stroke-width="3.2" stroke-linejoin="round"/><polygon points="{octo2(c,10.3)}" fill="none" stroke="#e6b84c" stroke-width=".9"/>' for c in (EL,ER))+\
 ponte('#111',3)+hastes('#111',2.8)+f'<circle cx="{EL-12}" cy="80.5" r="1.5" fill="#e6b84c"/><circle cx="{ER+12}" cy="80.5" r="1.5" fill="#e6b84c"/>'+TAG+BRL2
def est2(cx,R,r):return ' '.join(f'{cx+(R if i%2==0 else r)*math.cos(-math.pi/2+i*math.pi/5):.2f},{83.5+(R if i%2==0 else r)*math.sin(-math.pi/2+i*math.pi/5):.2f}' for i in range(10))
OCL_NOVO='<defs><linearGradient id="go2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6dc8c"/><stop offset=".5" stop-color="#d9a93a"/><stop offset="1" stop-color="#f3d27a"/></linearGradient></defs>'+\
 ''.join(f'<polygon points="{est2(c,14.2,10.6)}" fill="url(#lfmlz)" stroke="url(#go2)" stroke-width="2.5" stroke-linejoin="round"/>' for c in (42.5,77.5))+\
 '<path d="M52.5 81 Q60 76.5 67.5 81" stroke="#d9a93a" stroke-width="2.5" fill="none" stroke-linecap="round"/>'+\
 '<path d="M29.5 81 C26 79 21 78 16.5 79" fill="none" stroke="#d9a93a" stroke-width="2.6" stroke-linecap="round"/><path d="M90.5 81 C94 79 99 78 103.5 79" fill="none" stroke="#d9a93a" stroke-width="2.6" stroke-linecap="round"/>'+\
 '<path d="M60 74.2 l.9 -2.7 .9 2.7 2.7 .9 -2.7 .9 -.9 2.7 -.9 -2.7 -2.7 -.9z" fill="#f6dc8c"/><path d="M35 76 l1 -3 1 3 3 1 -3 1 -1 3 -1 -3 -3 -1z" fill="#fff"/>'
# ---- chapéus: Halloween e BF com a copa larga (simetria com a cabeça) + aba grande do S105; Ano Novo mais alto
HALL6=dict(nome='🎃 Halloween',bg='#f6eefa',corte=corte_reto(54.6),
 tr='<g transform="translate(0 -3.2)"><ellipse cx="60" cy="57" rx="70" ry="9.5" fill="#2b1636"/><ellipse cx="60" cy="56.5" rx="62" ry="7" fill="#3a2149"/></g>',
 fr='''<g transform="translate(0 -3.2)"><path d="M-10 57 A70 9.5 0 0 0 130 57 Z" fill="#2b1636"/><path d="M-2 57.6 A62 7 0 0 0 122 57.6" stroke="#4a2a5e" stroke-width="1" fill="none" opacity=".7"/>
<path d="M17 58 C24 43 35 28 46 17 C53 10 62 4 72 2 C77 1 81 3 83 6 C76 4 71 7 70 12 C79 24 94 42 103 58 Q60 65 17 58 Z" fill="#3a1f4a"/>
<path d="M40 22 C43 18 47 15 51 13" stroke="#fff" stroke-width="1.6" opacity=".22" fill="none" stroke-linecap="round"/>
<path d="M17 58 Q60 65 103 58 L99.8 51.5 Q60 58.5 20.2 51.5 Z" fill="#f08a24"/><rect x="54.5" y="52" width="11" height="10" rx="1.8" fill="none" stroke="#ffd166" stroke-width="2"/></g>''',ocl=OCL_HALL,fundo=HALL['fundo'])
BF6=dict(nome='⚡ Black Friday',bg='#f3f1ee',corte=corte_reto(56.5),
 tr='<g transform="translate(0 -1.5)"><ellipse cx="60" cy="57" rx="66" ry="9.5" fill="#0b0b0b"/><ellipse cx="60" cy="56.5" rx="58" ry="7" fill="#1a1a1a"/></g>',
 fr='<defs><linearGradient id="bk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0d0d0d"/><stop offset=".32" stop-color="#2c2c2c"/><stop offset=".6" stop-color="#121212"/><stop offset="1" stop-color="#050505"/></linearGradient>'+GO+'''</defs><g transform="translate(0 -1.5)">
<path d="M-6 57 A66 9.5 0 0 0 126 57 Z" fill="#0b0b0b"/><path d="M2 57.6 A58 7 0 0 0 118 57.6" stroke="#2a2a2a" stroke-width="1" fill="none"/>
<path d="M18 58 L21 9 Q60 3 99 9 L102 58 Q60 65 18 58 Z" fill="url(#bk)"/><ellipse cx="60" cy="8.6" rx="39" ry="5" fill="#1d1d1d" stroke="#3a3a3a" stroke-width=".8"/>
<text x="60" y="26" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="11.5" letter-spacing=".4" fill="url(#go)">BLACK</text>
<text x="60" y="39" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="11.5" letter-spacing=".4" fill="url(#go)">FRIDAY</text>
<path d="M19 45 Q60 52 101 45 L102 57.4 Q60 64.4 18 57.4 Z" fill="url(#go)"/>
<text x="60" y="57" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="9" fill="#141414">La Fouch</text></g>''',ocl=OCL_BF)
NOVO6=dict(nome='✨ Ano Novo',bg='#fbf6e9',corte=corte_curvo(58.5,52.5),
 fr='<defs>'+GO+'''<radialGradient id="gg" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#fbe7a8"/><stop offset=".6" stop-color="#e6b84c"/><stop offset="1" stop-color="#b8892a"/></radialGradient>
<pattern id="lj" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1.05" fill="#fff6d8" opacity=".55"/></pattern></defs>
<path d="M17 57 C17 33 33 20 60 20 C87 20 103 33 103 57 Z" fill="url(#gg)"/><path d="M17 57 C17 33 33 20 60 20 C87 20 103 33 103 57 Z" fill="url(#lj)"/>
<path d="M15 59.5 Q60 46 105 59.5" stroke="url(#go)" stroke-width="10" fill="none" stroke-linecap="round"/>
<path d="M17 58.5 Q60 45 103 58.5" stroke="#fff6d8" stroke-width="1" fill="none" opacity=".7" stroke-dasharray="2 3"/>
<g fill="#f6dc8c" stroke="#c3922a" stroke-width=".7"><circle cx="60" cy="18" r="5.4"/><circle cx="55" cy="15.2" r="3.5"/><circle cx="65" cy="15.2" r="3.5"/><circle cx="60" cy="11.8" r="3.5"/></g>''',ocl=OCL_NOVO,fundo=NOVO['fundo'])
NATAL6=dict(NATAL);NATAL6['ocl']=OCL_NATAL
TEMAS=[NATAL6,HALL6,BF6,NOVO6]
# ================= S107 =================
# óculos centrados exatamente nos olhos (45 e 75), aros menores → ponte de verdade sem sair dos olhos
OL,OR,OY,RR=45,75,83,10.4
def ponte7(c,w=2.6):return f'<path d="M{OL+RR} {OY-1.5} Q60 {OY-6} {OR-RR} {OY-1.5}" stroke="{c}" stroke-width="{w}" fill="none" stroke-linecap="round"/>'
def hastes7(c,w=2.6,r=RR):return f'<path d="M{OL-r} {OY-2} C26 79 21 78 16.5 79" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round"/><path d="M{OR+r} {OY-2} C94 79 99 78 103.5 79" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round"/>'
LEN7=f'<circle cx="{OL}" cy="{OY}" r="{RR-1}" fill="url(#lfmlz)"/><circle cx="{OR}" cy="{OY}" r="{RR-1}" fill="url(#lfmlz)"/>'
BRL7=f'<path d="M{OL-7} {OY-6} l3.2 -2 M{OR-7} {OY-6} l3.2 -2" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>'
def guirl7(cx):
  r=RR;f=''.join(f'<ellipse cx="{cx+r*math.cos(a):.2f}" cy="{OY+r*math.sin(a):.2f}" rx="2.6" ry="1.5" transform="rotate({math.degrees(a)+90:.0f} {cx+r*math.cos(a):.2f} {OY+r*math.sin(a):.2f})" fill="{"#2e8b57" if k%2 else "#3aa76d"}"/>' for k,a in enumerate([i*math.pi/7 for i in range(14)]))
  b=''.join(f'<circle cx="{cx+r*math.cos(a):.2f}" cy="{OY+r*math.sin(a):.2f}" r="1.4" fill="#e2203d"/>' for a in [-2.4,-0.9,0.7,2.2])
  return f'<circle cx="{cx}" cy="{OY}" r="{r}" fill="none" stroke="#1f6e43" stroke-width="2.1"/>'+f+b
LACO7=f'<g transform="translate(60 {OY-6.2})"><path d="M0 0 C-4 -3.5 -7.5 -2 -6.5 1 C-5.5 3.5 -3 2 0 0 C3 2 5.5 3.5 6.5 1 C7.5 -2 4 -3.5 0 0Z" fill="#e2203d"/><path d="M0 0 l-2.5 5 M0 0 l2.5 5" stroke="#e2203d" stroke-width="1.5" stroke-linecap="round"/><circle r="1.6" fill="#b30f2b"/></g>'
OCL_NATAL7=LEN7+guirl7(OL)+guirl7(OR)+ponte7('#1f6e43',2.3)+hastes7('#1f6e43')+LACO7+BRL7
def abob7(cx):
  s=0.78
  return (f'<g transform="translate({cx} {OY}) scale({s}) translate({-cx} {-OY})"><path d="M{cx} 70.5 C{cx-6} 69 {cx-12} 71 {cx-13.5} 77 C{cx-15} 83 {cx-14} 90 {cx-9} 94.5 C{cx-5} 97.5 {cx+5} 97.5 {cx+9} 94.5 C{cx+14} 90 {cx+15} 83 {cx+13.5} 77 C{cx+12} 71 {cx+6} 69 {cx} 70.5Z" fill="none" stroke="#f08a24" stroke-width="3.6"/>'
          f'<path d="M{cx-5.5} 71 Q{cx-8} 83 {cx-5.5} 96.5 M{cx+5.5} 71 Q{cx+8} 83 {cx+5.5} 96.5" stroke="#d9711a" stroke-width="1.4" fill="none" opacity=".55"/>'
          f'<path d="M{cx} 70.5 q-.5 -1.8 1.6 -3" stroke="#3f7d3a" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M{cx+1.4} 68.2 q3.2 -1 4 1.2 q-2.4 .8 -4 -1.2z" fill="#4f9a48"/></g>')
MORC7=f'<path transform="translate(60 {OY-4.6}) scale(.85)" d="M-7 0 q2.5 -4 5 -1.2 q1 -2.4 2 -2.4 q1 0 2 2.4 q2.5 -2.8 5 1.2 q-3.5 0 -7 2 q-3.5 -2 -7 -2z" fill="#3a1f4a"/>'
OCL_HALL7=LEN7+abob7(OL)+abob7(OR)+f'<path d="M{OL+11.4} {OY-1.5} Q60 {OY-6} {OR-11.4} {OY-1.5}" stroke="#f08a24" stroke-width="2.6" fill="none" stroke-linecap="round"/>'+hastes7('#3a1f4a',2.6,11.2)+MORC7+BRL7
def octo7(cx,r):return ' '.join(f'{cx+r*math.cos(math.pi/8+i*math.pi/4):.2f},{OY+r*math.sin(math.pi/8+i*math.pi/4):.2f}' for i in range(8))
TAG7=f'<g transform="translate(60 {OY-3.4})"><path d="M0 0 L0 3.4" stroke="#e6b84c" stroke-width=".8"/><path d="M-3 3.4 L3 3.4 L3 9.6 L0 11.5 L-3 9.6Z" fill="#e6b84c"/><text x="0" y="9.3" text-anchor="middle" font-size="5" font-weight="900" font-family="Inter,Arial" fill="#111">%</text></g>'
OCL_BF7=LEN7+''.join(f'<polygon points="{octo7(c,11)}" fill="none" stroke="#111" stroke-width="3" stroke-linejoin="round"/><polygon points="{octo7(c,9.3)}" fill="none" stroke="#e6b84c" stroke-width=".85"/>' for c in (OL,OR))+\
 f'<path d="M{OL+10.2} {OY-1.5} Q60 {OY-6} {OR-10.2} {OY-1.5}" stroke="#111" stroke-width="2.8" fill="none" stroke-linecap="round"/>'+hastes7('#111',2.8,10.6)+f'<circle cx="{OL-10.8}" cy="{OY-2.4}" r="1.4" fill="#e6b84c"/><circle cx="{OR+10.8}" cy="{OY-2.4}" r="1.4" fill="#e6b84c"/>'+TAG7+BRL7
def est7(cx,R,r):return ' '.join(f'{cx+(R if i%2==0 else r)*math.cos(-math.pi/2+i*math.pi/5):.2f},{OY+.6+(R if i%2==0 else r)*math.sin(-math.pi/2+i*math.pi/5):.2f}' for i in range(10))
OCL_NOVO7='<defs><linearGradient id="go2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6dc8c"/><stop offset=".5" stop-color="#d9a93a"/><stop offset="1" stop-color="#f3d27a"/></linearGradient></defs>'+\
 ''.join(f'<polygon points="{est7(c,13,9.8)}" fill="url(#lfmlz)" stroke="url(#go2)" stroke-width="2.3" stroke-linejoin="round"/>' for c in (OL,OR))+\
 f'<path d="M55.6 {OY-2.4} Q60 {OY-5.6} 64.4 {OY-2.4}" stroke="#d9a93a" stroke-width="2.3" fill="none" stroke-linecap="round"/>'+\
 f'<path d="M32.6 {OY-2} C26 79 21 78 16.5 79" fill="none" stroke="#d9a93a" stroke-width="2.5" stroke-linecap="round"/><path d="M87.4 {OY-2} C94 79 99 78 103.5 79" fill="none" stroke="#d9a93a" stroke-width="2.5" stroke-linecap="round"/>'+\
 f'<path d="M60 {OY-8.6} l.8 -2.4 .8 2.4 2.4 .8 -2.4 .8 -.8 2.4 -.8 -2.4 -2.4 -.8z" fill="#f6dc8c"/><path d="M36 {OY-7} l.9 -2.7 .9 2.7 2.7 .9 -2.7 .9 -.9 2.7 -.9 -2.7 -2.7 -.9z" fill="#fff"/>'
# ---- Natal: a ponta sai por cima e cai para fora, longe da lateral; o pompom não encosta na barra
NATAL7=dict(nome='🎄 Natal',bg='#eef4fb',corte=corte_curvo(62,56),
 fr='''<defs><linearGradient id="nr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2203d"/><stop offset="1" stop-color="#a50d27"/></linearGradient></defs>
<path d="M17 60 C17 38 28 20 48 14 C64 9 82 11 94 18 C104 24 112 32 116 42 L109 44 C106 38 101 33 95 30 C99 38 102 48 103 60 Z" fill="url(#nr)"/>
<path d="M95 30 C101 33 106 38 109 44 L116 42 C113 35 108 29 101 24 Z" fill="#9e0c24" opacity=".5"/>
<path d="M30 25 C38 19 48 16 58 15" stroke="#fff" stroke-width="2.2" opacity=".35" fill="none" stroke-linecap="round"/>
<path d="M14 63 Q60 49 106 63" stroke="#f2ecf0" stroke-width="12" fill="none" stroke-linecap="round"/>
<path d="M14 58.5 Q60 44.5 106 58.5" stroke="#fff" stroke-width="2" fill="none" opacity=".9" stroke-linecap="round"/>
<circle cx="116" cy="46" r="6.8" fill="#fff" stroke="#e6dbe2" stroke-width="1"/>''',ocl=OCL_NATAL7,fundo=NATAL['fundo'])
# ---- Halloween: copa alta (não achatada) + aba bem maior
HALL7=dict(nome='🎃 Halloween',bg='#f6eefa',corte=corte_reto(54.6),
 tr='<ellipse cx="60" cy="54" rx="80" ry="11.5" fill="#2b1636"/><ellipse cx="60" cy="53.5" rx="71" ry="8.5" fill="#3a2149"/>',
 fr='''<path d="M-20 54 A80 11.5 0 0 0 140 54 Z" fill="#2b1636"/><path d="M-11 54.6 A71 8.5 0 0 0 131 54.6" stroke="#4a2a5e" stroke-width="1" fill="none" opacity=".7"/>
<path d="M19 55 C25 38 34 18 44 4 C50 -5 58 -13 68 -17 C74 -19 80 -18 83 -14 C76 -15 71 -11 70 -5 C78 10 93 36 101 55 Q60 62 19 55 Z" fill="#3a1f4a"/>
<path d="M38 18 C41 12 45 7 50 2" stroke="#fff" stroke-width="1.8" opacity=".2" fill="none" stroke-linecap="round"/>
<path d="M19 55 Q60 62 101 55 L98 48 Q60 55 22 48 Z" fill="#f08a24"/><rect x="54.5" y="48.5" width="11" height="10" rx="1.8" fill="none" stroke="#ffd166" stroke-width="2"/>''',ocl=OCL_HALL7,fundo=HALL['fundo'])
# ---- Black Friday: aba bem maior
BF7=dict(BF6);BF7.update(tr='<ellipse cx="60" cy="55.5" rx="78" ry="11" fill="#0b0b0b"/><ellipse cx="60" cy="55" rx="69" ry="8" fill="#1a1a1a"/>',ocl=OCL_BF7)
BF7['fr']=BF6['fr'].replace('<path d="M-6 57 A66 9.5 0 0 0 126 57 Z" fill="#0b0b0b"/><path d="M2 57.6 A58 7 0 0 0 118 57.6" stroke="#2a2a2a" stroke-width="1" fill="none"/>',
 '</g><path d="M-18 55.5 A78 11 0 0 0 138 55.5 Z" fill="#0b0b0b"/><path d="M-9 56.1 A69 8 0 0 0 129 56.1" stroke="#2a2a2a" stroke-width="1" fill="none"/><g transform="translate(0 -1.5)">')
NOVO7=dict(NOVO6);NOVO7['ocl']=OCL_NOVO7
TEMAS=[NATAL7,HALL7,BF7,NOVO7]
# S107b: Ano Novo — estrelas centradas no olho (o olho fechado fica em y≈81) e ponte/hastes presas nas pontas das estrelas
EY=81.6;ER_=13
def est8(cx):return ' '.join(f'{cx+(ER_ if i%2==0 else 9.8)*math.cos(-math.pi/2+i*math.pi/5):.2f},{EY+(ER_ if i%2==0 else 9.8)*math.sin(-math.pi/2+i*math.pi/5):.2f}' for i in range(10))
_a=math.radians(-18);PX=ER_*math.cos(_a);PY=EY+ER_*math.sin(_a)
OCL_NOVO8='<defs><linearGradient id="go2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6dc8c"/><stop offset=".5" stop-color="#d9a93a"/><stop offset="1" stop-color="#f3d27a"/></linearGradient></defs>'+\
 ''.join(f'<polygon points="{est8(c)}" fill="url(#lfmlz)" stroke="url(#go2)" stroke-width="2.3" stroke-linejoin="round"/>' for c in (OL,OR))+\
 f'<path d="M{OL+PX:.2f} {PY:.2f} Q60 {PY-3.2:.2f} {OR-PX:.2f} {PY:.2f}" stroke="#d9a93a" stroke-width="2.3" fill="none" stroke-linecap="round"/>'+\
 f'<path d="M{OL-PX:.2f} {PY:.2f} C26 {PY-1.5:.2f} 21 78 16.5 79" fill="none" stroke="#d9a93a" stroke-width="2.4" stroke-linecap="round"/><path d="M{OR+PX:.2f} {PY:.2f} C94 {PY-1.5:.2f} 99 78 103.5 79" fill="none" stroke="#d9a93a" stroke-width="2.4" stroke-linecap="round"/>'+\
 f'<path d="M60 {PY-6.4:.2f} l.8 -2.4 .8 2.4 2.4 .8 -2.4 .8 -.8 2.4 -.8 -2.4 -2.4 -.8z" fill="#f6dc8c"/><path d="M38 {EY-5.5} l.9 -2.7 .9 2.7 2.7 .9 -2.7 .9 -.9 2.7 -.9 -2.7 -2.7 -.9z" fill="#fff"/>'
NOVO7['ocl']=OCL_NOVO8;TEMAS=[NATAL7,HALL7,BF7,NOVO7]
