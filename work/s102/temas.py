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
# ---- S102: Halloween, Ano Novo e Black Friday refeitos ----
HALL=dict(tras='<g transform="rotate(-6 60 41)"><ellipse cx="60" cy="41" rx="50" ry="11" fill="#2b1636"/><ellipse cx="60" cy="40" rx="44" ry="8" fill="#3d2350"/></g>',
 frente='''<g transform="rotate(-6 60 41)"><ellipse cx="60" cy="47" rx="30" ry="4" fill="#8d3a69" opacity=".12"/>
<path d="M10 41 A50 11 0 0 0 110 41 L104 41 A44 8 0 0 1 16 41 Z" fill="#2b1636"/>
<path d="M33 42 C36 30 41 18 48 10 C53 4 60 -1 70 -2 C74 -2 77 0 79 3 C73 1 68 3 67 8 C72 18 80 30 87 41 Q60 49 33 42 Z" fill="#3a1f4a"/>
<path d="M44 14 C47 10 51 7 55 5" stroke="#fff" stroke-width="1.6" opacity=".25" fill="none" stroke-linecap="round"/>
<path d="M33 42 Q60 49 87 41 L85 35.5 Q60 42.5 35.5 36.5 Z" fill="#f08a24"/><rect x="55" y="35.5" width="10" height="9.5" rx="1.8" fill="none" stroke="#ffd166" stroke-width="1.9"/></g>''',
 fundo=HALL['fundo'])
NOVO=dict(tras='',frente='''<defs><linearGradient id="ng" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f6dc8c"/><stop offset=".55" stop-color="#e6b84c"/><stop offset="1" stop-color="#c3922a"/></linearGradient></defs>
<g transform="rotate(14 60 36)"><ellipse cx="60" cy="38" rx="21" ry="4" fill="#8d3a69" opacity=".12"/>
<path d="M40 36 L60 -6 L80 36 Q60 29 40 36 Z" fill="url(#ng)"/>
<path d="M45.5 25 Q60 20.5 74.5 25 M50.5 15 Q60 12 69.5 15 M42.5 31 Q60 26 77.5 31" stroke="#fff6d8" stroke-width="2.1" fill="none" opacity=".95"/>
<path d="M40 36 Q60 29 80 36" stroke="#b5861f" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<g fill="#fff6d8"><circle cx="60" cy="-7" r="3.6"/><circle cx="56.5" cy="-9.5" r="2.4"/><circle cx="63.5" cy="-9.5" r="2.4"/><circle cx="60" cy="-11.5" r="2.4"/></g></g>''',fundo=NOVO['fundo'])
BF=dict(tras='<g transform="rotate(-4 60 40)"><ellipse cx="60" cy="40" rx="42" ry="9" fill="#0b0b0b"/></g>',
 frente='''<defs><linearGradient id="bk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0d0d0d"/><stop offset=".35" stop-color="#2a2a2a"/><stop offset=".6" stop-color="#111"/><stop offset="1" stop-color="#050505"/></linearGradient>
<linearGradient id="go" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c99a2e"/><stop offset=".5" stop-color="#f3d27a"/><stop offset="1" stop-color="#c3922a"/></linearGradient></defs>
<g transform="rotate(-4 60 40)"><ellipse cx="60" cy="46" rx="30" ry="4" fill="#8d3a69" opacity=".12"/>
<path d="M18 40 A42 9 0 0 0 102 40 L96 40 A36 6 0 0 1 24 40 Z" fill="#0b0b0b"/>
<path d="M32 41 L30 2 Q60 -3 90 2 L88 41 Q60 46 32 41 Z" fill="url(#bk)"/><ellipse cx="60" cy="1.8" rx="30" ry="4.2" fill="#1c1c1c" stroke="#333" stroke-width=".8"/>
<text x="60" y="20" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="7.4" letter-spacing=".2" fill="url(#go)">BLACK</text>
<text x="60" y="28" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="7.4" letter-spacing=".2" fill="url(#go)">FRIDAY</text>
<path d="M31.5 31 Q60 35.5 88.5 31 L88.2 39.5 Q60 44.5 31.8 39.5 Z" fill="url(#go)"/>
<text x="60" y="39.2" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="6" fill="#141414">La Fouch</text></g>''')
T=[('🎄 Natal (aprovado)',NATAL,'#eef4fb'),('🎃 Halloween',HALL,'#f6eefa'),('⚡ Black Friday',BF,'#f3f1ee'),('✨ Ano Novo',NOVO,'#fbf6e9')]
# ---- S102 v2: a copa cobre a cabeça inteira na altura da aba (a cabeça não aparece por dentro) ----
HALL=dict(tras='<g transform="rotate(-6 60 42)"><ellipse cx="60" cy="42" rx="53" ry="10.5" fill="#2b1636"/><ellipse cx="60" cy="41.5" rx="46" ry="7.5" fill="#3a2149"/></g>',
 frente='''<g transform="rotate(-6 60 42)">
<path d="M7 42 A53 10.5 0 0 0 113 42 Z" fill="#2b1636"/><path d="M14 42.6 A46 7.5 0 0 0 106 42.6" stroke="#4a2a5e" stroke-width="1" fill="none" opacity=".7"/>
<path d="M27 43 C32 30 40 17 49 9 C55 3 62 -2 71 -3 C75 -3 78 -1 80 2 C74 0 69 2 68 7 C75 17 86 30 93 43 Q60 51 27 43 Z" fill="#3a1f4a"/>
<path d="M44 14 C47 10 51 7 55 5" stroke="#fff" stroke-width="1.6" opacity=".22" fill="none" stroke-linecap="round"/>
<path d="M27 43 Q60 51 93 43 L90.5 37 Q60 44.5 29.5 37 Z" fill="#f08a24"/><rect x="55" y="37.5" width="10" height="9.5" rx="1.8" fill="none" stroke="#ffd166" stroke-width="1.9"/></g>''',fundo=HALL['fundo'])
BF=dict(tras='<g transform="rotate(-4 60 42)"><ellipse cx="60" cy="42" rx="47" ry="9" fill="#0b0b0b"/></g>',
 frente='''<defs><linearGradient id="bk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0d0d0d"/><stop offset=".32" stop-color="#2c2c2c"/><stop offset=".6" stop-color="#121212"/><stop offset="1" stop-color="#050505"/></linearGradient>
<linearGradient id="go" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c3922a"/><stop offset=".5" stop-color="#f6dc8c"/><stop offset="1" stop-color="#c3922a"/></linearGradient></defs>
<g transform="rotate(-4 60 42)">
<path d="M13 42 A47 9 0 0 0 107 42 Z" fill="#0b0b0b"/><path d="M20 42.5 A40 6 0 0 0 100 42.5" stroke="#2a2a2a" stroke-width="1" fill="none"/>
<path d="M27 43 L29 3 Q60 -2 91 3 L93 43 Q60 49 27 43 Z" fill="url(#bk)"/><ellipse cx="60" cy="2.6" rx="31" ry="4.4" fill="#1d1d1d" stroke="#3a3a3a" stroke-width=".8"/>
<text x="60" y="17" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="9" letter-spacing=".3" fill="url(#go)">BLACK</text>
<text x="60" y="27" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="9" letter-spacing=".3" fill="url(#go)">FRIDAY</text>
<path d="M27.6 32 Q60 37.5 92.4 32 L92.9 42.2 Q60 48.2 27.1 42.2 Z" fill="url(#go)"/>
<text x="60" y="42" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="7" fill="#141414">La Fouch</text></g>''')
NOVO=dict(tras='',frente='''<defs><linearGradient id="ng" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f6dc8c"/><stop offset=".55" stop-color="#e6b84c"/><stop offset="1" stop-color="#c3922a"/></linearGradient></defs>
<g transform="rotate(9 60 33)">
<path d="M38 37 L60 -8 L82 37 Q60 27 38 37 Z" fill="url(#ng)"/>
<path d="M44.5 24 Q60 18 75.5 24 M50 13 Q60 9 70 13 M41.5 31 Q60 24 78.5 31" stroke="#fff6d8" stroke-width="2.1" fill="none" opacity=".95"/>
<path d="M38 37 Q60 27 82 37" stroke="#b5861f" stroke-width="2.6" fill="none" stroke-linecap="round"/>
<g fill="#fff6d8" stroke="#e6b84c" stroke-width=".6"><circle cx="56.3" cy="-10" r="2.6"/><circle cx="63.7" cy="-10" r="2.6"/><circle cx="60" cy="-13.5" r="2.6"/><circle cx="60" cy="-8.5" r="3.4"/></g></g>''',fundo=NOVO['fundo'])
T=[('🎄 Natal (aprovado)',NATAL,'#eef4fb'),('🎃 Halloween',HALL,'#f6eefa'),('⚡ Black Friday',BF,'#f3f1ee'),('✨ Ano Novo',NOVO,'#fbf6e9')]
