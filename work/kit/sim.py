"""UM simulador só (plano das ferramentas, parte 1 — aprovado pelo dono em 21/11/2026).
Todo teste, prova, comparação e esboço abre o navegador e o aparelho por aqui: o mesmo programa de navegador, as mesmas opções e os
mesmos nomes. Quem precisa de algo diferente diz no pedido (ex.: dpr=2, camera=True) — não escreve outro jeito de abrir.

    import sim
    b = sim.navegador(pw)
    c = sim.contexto(b, 390, 844, toque=True, lingua='es-PY', camera=True)
"""
EXE = '/opt/pw-browsers/chromium'
# câmera e microfone de mentira e som sem toque: não atrapalham quem não usa e evitam um segundo jeito de abrir para a consulta/rosto
ARGS = ['--no-sandbox', '--autoplay-policy=no-user-gesture-required', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream']

def navegador(pw):
    return pw.chromium.launch(executable_path=EXE, args=ARGS)

def contexto(b, W=390, H=844, *, toque=False, celular=None, dpr=1, lingua=None, escuro=None, movimento=None, camera=False, lugar=None,
             csp_livre=True, sem_trabalhador=False):
    """W×H = tela; toque = dedo; celular = página de celular (padrão: igual a toque); dpr = pontos por pixel; lingua = 'pt-BR'/'es-PY';
    escuro = True/False/None (None = não diz); movimento = True (com animação) / False (reduzido) / None (não diz);
    camera = dá a permissão; lugar = (lat, lng) dá a permissão de localização; csp_livre = o teste pode rodar código na página;
    sem_trabalhador = bloqueia o service worker (app)."""
    k = dict(viewport={'width': W, 'height': H}, device_scale_factor=dpr, has_touch=bool(toque), is_mobile=bool(toque if celular is None else celular))
    if csp_livre: k['bypass_csp'] = True
    if lingua: k['locale'] = lingua
    if escuro is not None: k['color_scheme'] = 'dark' if escuro else 'light'
    if movimento is not None: k['reduced_motion'] = 'no-preference' if movimento else 'reduce'
    perm = (['camera'] if camera else []) + (['geolocation'] if lugar else [])
    if perm: k['permissions'] = perm
    if lugar: k['geolocation'] = {'latitude': lugar[0], 'longitude': lugar[1]}
    if sem_trabalhador: k['service_workers'] = 'block'
    return b.new_context(**k)
