"""IDEIAS 12f · enfeites de traço fino no lugar dos emojis + frase nova do Halloween (dono 23/11 16:57). Base: o 12e aprovado (/tmp/a12e) → /tmp/a12f (:8770).
Enfeite: um desenho de traço único (1,3 px), na cor da loja, no canto da peça (onde hoje fica o emoji). Um mapa só, por data:
Natal estrela · Ano Novo brilho · Mães tulipa · Halloween lua crescente · Pais e Black Friday sem enfeite.
Halloween: "Edição Noir" (o luxo trata o Halloween como a noite, não como fantasia: Saint Laurent "Nocturnal", Gentle Monster)."""
import shutil, urllib.parse
S, D = '/tmp/a12e', '/tmp/a12f'
shutil.rmtree(D, ignore_errors=True); shutil.copytree(S, D)
p = D + '/js/lf-site.js'; s = open(p).read()
o = "h:'Olhar <em>misterioso</em>'"; assert s.count(o) == 1; s = s.replace(o, "h:'Edição <em>Noir</em>'")
G = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#943d6f" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">%s</svg>'
ENF = {
 'natal': '<path d="M16 3 L17.6 14.4 L29 16 L17.6 17.6 L16 29 L14.4 17.6 L3 16 L14.4 14.4 Z"/><path d="M16 9.5v13M9.5 16h13" stroke-width=".6" opacity=".55"/>',
 'anonovo': '<path d="M13 5 L14.2 12.8 L22 14 L14.2 15.2 L13 23 L11.8 15.2 L4 14 L11.8 12.8 Z"/><path d="M24 19 L24.6 22.4 L28 23 L24.6 23.6 L24 27 L23.4 23.6 L20 23 L23.4 22.4 Z"/><circle cx="24.5" cy="7.5" r=".9"/>',
 'maes': '<path d="M16 29 V15"/><path d="M16 15 C11 15 9.5 10 10 5.5 L13 8.5 L16 4.5 L19 8.5 L22 5.5 C22.5 10 21 15 16 15 Z"/><path d="M16 24 C13.5 21.5 10.5 21 8.5 21.5 C10 24 13 25 16 24"/>',
 'halloween': '<path d="M20.5 5.2 A11 11 0 1 0 26.8 21.5 A9 9 0 1 1 20.5 5.2 Z"/><circle cx="25" cy="8" r=".8"/>',
}
css = ''.join("html[data-ev%s] #hdst .hdeco::before{background-image:url(\"data:image/svg+xml,%s\")}" % ('^=anonovo' if k == 'anonovo' else '=' + k, urllib.parse.quote(G % v)) for k, v in ENF.items())
s += """
/* PINTURA · IDEIAS 12f: o enfeite da data é um desenho de traço fino, um mapa só (sem emoji) */
(function(){var e=document.createElement('style');e.textContent=
 'html[data-ev] #hdst .hdeco{font-size:0!important;width:32px;height:32px;left:16px;top:14px}'+
 'html[data-ev] #hdst .hdeco::before{content:"";display:block;width:32px;height:32px;background:center/contain no-repeat}'+
 'html[data-ev=pais] #hdst .hdeco,html[data-ev=bf] #hdst .hdeco{display:none!important}'+
 %s;document.head.appendChild(e)})();
""" % repr(css)
open(p, 'w').write(s); print('ok')
