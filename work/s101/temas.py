svg=open('/home/claude/gz/mochi.svg').read()
def com(tras,frente,sem_espelho=True,fundo=''):
  s=svg
  if sem_espelho:s=s.replace('<g class="esp"','<g class="esp" display="none"',1)
  i=s.index('>',s.index('<svg'))+1;j=s.rfind('</svg>')
  return s[:i]+fundo+tras+s[i:j]+frente+s[j:]
# sombra suave na cabeça logo abaixo da aba (o chapéu "assenta")
def sombra(y=40,rx=34): return f'<ellipse cx="60" cy="{y+5}" rx="{rx}" ry="5" fill="#8d3a69" opacity=".10"/>'
NATAL=dict(tras='',frente=sombra(41,33)+'''<defs><linearGradient id="nr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2203d"/><stop offset="1" stop-color="#a50d27"/></linearGradient></defs>
<path d="M27 44 C26 22 40 8 60 6 C78 5 92 12 98 26 C101 33 103 40 104 48 L97 47 C95 38 92 31 86 26 C88 32 90 38 92 44 Z" fill="url(#nr)"/>
<path d="M40 14 C48 9 58 8 66 9" stroke="#fff" stroke-width="2" opacity=".35" fill="none" stroke-linecap="round"/>
<path d="M22 47 Q60 30 98 47" stroke="#fff" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M22 47 Q60 30 98 47" stroke="#efe3ea" stroke-width="11" fill="none" stroke-linecap="round" stroke-dasharray="1 5" opacity=".7"/>
<circle cx="101" cy="51" r="6.5" fill="#fff" stroke="#efe3ea"/>''',fundo='<g fill="#9fb8d6"><text x="-4" y="70" font-size="9">❄</text><text x="112" y="40" font-size="7">❄</text><text x="110" y="100" font-size="8">❄</text></g>')
HALL=dict(tras='<ellipse cx="60" cy="42" rx="52" ry="10" fill="#2b1636" transform="rotate(-5 60 42)"/>',
 frente=sombra(42,36)+'''<path d="M8 44.5 A52 10 -5 0 0 112 35.5 L104 39 Q60 50 16 46 Z" fill="#2b1636" transform="rotate(0)"/>
<path d="M36 41 C40 26 44 14 52 6 C56 2 62 -2 70 0 C64 2 62 6 63 10 C70 20 78 30 84 39 Q60 46 36 41 Z" fill="#3a1f4a"/>
<path d="M36 41 Q60 46 84 39 L82.5 33.5 Q60 40 38 35.5 Z" fill="#f08a24"/><rect x="54.5" y="33.5" width="10" height="9" rx="1.6" fill="none" stroke="#ffd166" stroke-width="1.8"/>''',
 fundo='<g fill="#3a1f4a"><path d="M-4 58 q4 -6 8 0 q2 -3 4 0 q4 -6 8 0 q-4 2 -10 2 q-6 0 -10 -2z"/><path d="M106 70 q3 -5 6 0 q1.5 -2 3 0 q3 -5 6 0 q-3 1.5 -7.5 1.5 q-4.5 0 -7.5 -1.5z"/></g>')
BF=dict(tras='',frente=sombra(42,34)+'''<defs><path id="bft" d="M30 41 Q60 25 90 41"/></defs>
<path d="M24 47 C24 22 40 10 60 10 C80 10 96 22 96 47 Q60 34 24 47 Z" fill="#141414"/>
<path d="M60 10 L60 40 M42 15 Q52 26 50 40 M78 15 Q68 26 70 40" stroke="#2c2c2c" stroke-width="1.2" fill="none"/><circle cx="60" cy="11" r="2.6" fill="#e6b84c"/>
<path d="M24 47 Q60 34 96 47 Q100 52 92 54 Q60 44 28 54 Q20 52 24 47 Z" fill="#0a0a0a"/>
<text font-family="Inter,Arial" font-weight="800" font-size="8" fill="#e6b84c" letter-spacing=".3"><textPath href="#bft" startOffset="50%" text-anchor="middle">LaFouch</textPath></text>''')
NOVO=dict(tras='',frente=sombra(33,18)+'''<defs><linearGradient id="ng" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f3d27a"/><stop offset=".5" stop-color="#e6b84c"/><stop offset="1" stop-color="#c99a2e"/></linearGradient></defs>
<g transform="rotate(12 62 34)"><path d="M46 36 L62 0 L78 36 Q62 41 46 36 Z" fill="url(#ng)"/><path d="M52 23 L72 23 M56 14 L68 14 M49 30 L75 30" stroke="#fff6d8" stroke-width="2" opacity=".9"/>
<path d="M46 36 Q62 41 78 36" stroke="#c99a2e" stroke-width="1.6" fill="none"/><circle cx="62" cy="0" r="4" fill="#fff6d8" stroke="#e6b84c"/></g>''',
 fundo='<g fill="#e6b84c"><path d="M2 56 l2 -6 2 6 6 2 -6 2 -2 6 -2 -6 -6 -2z"/><path d="M112 46 l1.5 -4.5 1.5 4.5 4.5 1.5 -4.5 1.5 -1.5 4.5 -1.5 -4.5 -4.5 -1.5z"/><path d="M108 96 l1.2 -3.6 1.2 3.6 3.6 1.2 -3.6 1.2 -1.2 3.6 -1.2 -3.6 -3.6 -1.2z"/></g>')
T=[('🎄 Natal',NATAL,'#eef4fb'),('🎃 Halloween',HALL,'#f6eefa'),('⚡ Black Friday',BF,'#f3f1ee'),('✨ Ano Novo',NOVO,'#fbf6e9')]
