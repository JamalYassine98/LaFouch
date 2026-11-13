# S217: o padrão dos 2 grupos (o mesmo CSS usado nos esboços e nos testes).
EASE = 'cubic-bezier(.2,.8,.2,1)'
TOQUE = """
#home{padding-inline:0!important}
@media (max-width:559px){html body #home .hg,html body #vscr #grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}}
@media (min-width:560px) and (max-width:899px){html body #home .hg,html body #vscr #grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:14px!important}html body #home .hg>*:nth-child(n+7){display:none!important}}
@media (min-width:900px){html body #home .hg,html body #vscr #grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:16px!important;width:100%!important}}
@media (min-width:1100px){#vscr>*,#home{max-width:min(1320px,92vw)!important;margin-inline:auto!important}}
#lfgen button,#lfgen .lfgf,.vback{min-height:44px!important;display:inline-flex!important;align-items:center!important;transition:min-height .32s EASE!important}
""".replace('EASE', EASE)
MOUSE = """
#vscr>*{max-width:min(1320px,92vw)!important;margin-inline:auto!important;transition:max-width .32s EASE}
html body #vscr #grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:18px!important;width:100%!important}
#lfgen button,#lfgen .lfgf,.vback{transition:min-height .32s EASE!important}
""".replace('EASE', EASE)
