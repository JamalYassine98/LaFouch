# S104: chapéus e óculos temáticos, desenhados já na posição final (unidades do desenho do Mochi)
svg0=open('/home/claude/gz/mochi.svg').read()
CAB='<path d="M60 30 C95 30 106 58 106 84 C106 108 88 122 60 122 C32 122 14 108 14 84 C14 58 25 30 60 30Z"'
def base():
  s=svg0.replace('<g class="esp"','<g class="esp" display="none"',1)
  return s.replace('<path d="M17 66 Q60 44 103 66" stroke="#8d3a69"','<path display="none" d="M17 66 Q60 44 103 66" stroke="#8d3a69"',1)
def oculos(s,cor,deco='',cor2=None):
  i=s.index('<g class="ocl">');j=s.index('<ellipse cx="31" cy="101"',i)
  o=s[i:j].replace('stroke="#8d3a69"',f'stroke="{cor}"').replace('fill="#e7a6c7"',f'fill="{cor2 or cor}"')
  k=o.rfind('</g></g>');o=o[:k]+deco+o[k:]
  return s[:i]+o+s[j:]
def monta(t,so=None):
  s=base()
  if t.get('ocl'):s=oculos(s,*t['ocl'])
  i=s.index('>',s.index('<svg'))+1;j=s.rfind('</svg>')
  if so=='cab':return s[:i]+CAB+' fill="#000" stroke="#000" stroke-width="1.4"/>'+s[j:]
  if so=='fr':return s[:i]+t['fr']+s[j:]
  if so=='oc':k=s.index('<g class="ocl">');m=s.index('<ellipse cx="31" cy="101"',k);return s[:i]+s[k:m]+s[j:]
  return s[:i]+t.get('fundo','')+t.get('tr','')+s[i:j]+t['fr']+s[j:]
GO='<linearGradient id="go" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c3922a"/><stop offset=".5" stop-color="#f6dc8c"/><stop offset="1" stop-color="#c3922a"/></linearGradient>'
NATAL=dict(nome='🎄 Natal',bg='#eef4fb',
 fr='''<defs><linearGradient id="nr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2203d"/><stop offset="1" stop-color="#a50d27"/></linearGradient></defs>
<path d="M14 58 C14 30 34 12 60 12 C84 12 100 24 104 40 C106 46 107 52 108 58 Z" fill="url(#nr)"/><path d="M88 18 C102 22 111 34 113 58 L107.5 58 C106 45 100 33 90 25 Z" fill="#b30f2b"/>
<path d="M36 22 C44 17 54 15 64 15" stroke="#fff" stroke-width="2.2" opacity=".35" fill="none" stroke-linecap="round"/>
<path d="M12 62 Q60 46 108 62" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M12 62 Q60 46 108 62" stroke="#e8dde4" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="1 5" opacity=".55"/>
<circle cx="110" cy="64" r="7" fill="#fff" stroke="#ece2e8"/>''',
 ocl=('#c8102e','<g transform="translate(60 72)"><path d="M0 0 q-5 -4 -8 1 q4 0 8 -1z M0 0 q5 -4 8 1 q-4 0 -8 -1z" fill="#2e8b57"/><circle cx="-1.6" cy="-1" r="1.9" fill="#e2203d"/><circle cx="1.6" cy="-1" r="1.9" fill="#e2203d"/></g>','#f2c94c'),
 fundo='<g fill="#9fb8d6"><text x="-6" y="72" font-size="9">❄</text><text x="114" y="40" font-size="7">❄</text><text x="112" y="104" font-size="8">❄</text></g>')
HALL=dict(nome='🎃 Halloween',bg='#f6eefa',
 tr='<ellipse cx="60" cy="56" rx="64" ry="9" fill="#2b1636"/><ellipse cx="60" cy="55.5" rx="56" ry="6.5" fill="#3a2149"/>',
 fr='''<path d="M-4 56 A64 9 0 0 0 124 56 Z" fill="#2b1636"/><path d="M4 56.6 A56 6.5 0 0 0 116 56.6" stroke="#4a2a5e" stroke-width="1" fill="none" opacity=".7"/>
<path d="M14 57 C22 42 34 26 46 15 C53 8 62 2 72 0 C77 -1 81 1 83 4 C76 2 71 5 70 10 C79 22 96 40 106 57 Q60 64 14 57 Z" fill="#3a1f4a"/>
<path d="M40 20 C43 16 47 13 51 11" stroke="#fff" stroke-width="1.6" opacity=".22" fill="none" stroke-linecap="round"/>
<path d="M14 57 Q60 64 106 57 L102.5 50.5 Q60 58 17.5 50.5 Z" fill="#f08a24"/><rect x="54.5" y="50.5" width="11" height="10" rx="1.8" fill="none" stroke="#ffd166" stroke-width="2"/>''',
 ocl=('#f08a24','<path transform="translate(60 72)" d="M-6 0 q2 -3 4 -1 q1 -2 2 -2 q1 0 2 2 q2 -2 4 1 q-3 0 -6 1.5 q-3 -1.5 -6 -1.5z" fill="#3a1f4a"/>','#3a1f4a'),
 fundo='<g fill="#3a1f4a"><path d="M-8 74 q4 -6 8 0 q2 -3 4 0 q4 -6 8 0 q-4 2 -10 2 q-6 0 -10 -2z"/><path d="M110 86 q3 -5 6 0 q1.5 -2 3 0 q3 -5 6 0 q-3 1.5 -7.5 1.5 q-4.5 0 -7.5 -1.5z"/></g>')
BF=dict(nome='⚡ Black Friday',bg='#f3f1ee',
 tr='<ellipse cx="60" cy="56" rx="62" ry="9" fill="#0b0b0b"/><ellipse cx="60" cy="55.5" rx="54" ry="6.5" fill="#1a1a1a"/>',
 fr='<defs><linearGradient id="bk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0d0d0d"/><stop offset=".32" stop-color="#2c2c2c"/><stop offset=".6" stop-color="#121212"/><stop offset="1" stop-color="#050505"/></linearGradient>'+GO+'''</defs>
<path d="M-2 56 A62 9 0 0 0 122 56 Z" fill="#0b0b0b"/><path d="M6 56.6 A54 6.5 0 0 0 114 56.6" stroke="#2a2a2a" stroke-width="1" fill="none"/>
<path d="M14 57 L18 8 Q60 2 102 8 L106 57 Q60 64 14 57 Z" fill="url(#bk)"/><ellipse cx="60" cy="7.6" rx="42" ry="5.2" fill="#1d1d1d" stroke="#3a3a3a" stroke-width=".8"/>
<text x="60" y="25" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="11.5" letter-spacing=".4" fill="url(#go)">BLACK</text>
<text x="60" y="38" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="11.5" letter-spacing=".4" fill="url(#go)">FRIDAY</text>
<path d="M15.3 44 Q60 51 104.7 44 L105.7 56.2 Q60 63.4 14.3 56.2 Z" fill="url(#go)"/>
<text x="60" y="56" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="9" fill="#141414">La Fouch</text>''',
 ocl=('#141414','<g fill="#e6b84c"><circle cx="32.5" cy="77" r="1.4"/><circle cx="87.5" cy="77" r="1.4"/></g>','#e6b84c'))
NOVO=dict(nome='✨ Ano Novo',bg='#fbf6e9',
 fr='<defs>'+GO+'''<radialGradient id="gg" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#fbe7a8"/><stop offset=".6" stop-color="#e6b84c"/><stop offset="1" stop-color="#b8892a"/></radialGradient>
<pattern id="lj" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1.05" fill="#fff6d8" opacity=".55"/></pattern></defs>
<path d="M14 58 C14 30 34 14 60 14 C86 14 106 30 106 58 Z" fill="url(#gg)"/><path d="M14 58 C14 30 34 14 60 14 C86 14 106 30 106 58 Z" fill="url(#lj)"/>
<path d="M12 63 Q60 48 108 63" stroke="url(#go)" stroke-width="12" fill="none" stroke-linecap="round"/>
<path d="M14 62 Q60 47 106 62" stroke="#fff6d8" stroke-width="1" fill="none" opacity=".7" stroke-dasharray="2 3"/>
<g fill="#f6dc8c" stroke="#c3922a" stroke-width=".7"><circle cx="60" cy="11" r="6"/><circle cx="54" cy="8" r="4"/><circle cx="66" cy="8" r="4"/><circle cx="60" cy="5" r="4"/></g>''',
 ocl=('#c3922a','','#f6dc8c'),
 fundo='<g fill="#e6b84c"><path d="M-2 66 l2 -6 2 6 6 2 -6 2 -2 6 -2 -6 -6 -2z"/><path d="M114 44 l1.5 -4.5 1.5 4.5 4.5 1.5 -4.5 1.5 -1.5 4.5 -1.5 -4.5 -4.5 -1.5z"/><path d="M110 100 l1.2 -3.6 1.2 3.6 3.6 1.2 -3.6 1.2 -1.2 3.6 -1.2 -3.6 -3.6 -1.2z"/></g>')
TEMAS=[NATAL,HALL,BF,NOVO]
