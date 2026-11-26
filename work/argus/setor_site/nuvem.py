# ARGUS · setor SITE · a NUVEM DE TESTE: responde pelas funções da nuvem do site (reserva, pedido, cupom, código da conta…) e pelo
# login, e anota tudo o que o site mandou — para conferir COMO o site fala com a nuvem. A segurança de verdade (a nuvem recusar o
# que é proibido) é da NUVEM e roda no emulador do Firebase (Parte 7d); aqui só se confere o lado do site.
import json
CORS = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'POST, GET, PATCH, OPTIONS'}
CONTA = {'nome': 'Maria González', 'email': 'maria@exemplo.com', 'tel': '+595 983 000 000', 'nac': 'py', 'doc': '1234567',
         'ends': [{'nome': 'Casa', 'cidade': 'Ciudad del Este', 'dep': 'Alto Paraná', 'end': 'Calle Los Lapachos 123', 'ref': 'portón verde'}]}
LOGIN = {'uid': 'argus', 'idToken': 'argus', 'refresh': 'argus', 'exp': 9e15, 'ev': True, 'email': CONTA['email']}
# a cliente logada: o que o site guarda no aparelho depois de entrar (entra antes da página)
LOGADA = "(()=>{if(!/^http/.test(location.protocol))return;localStorage.setItem('lf_conta',%s);localStorage.setItem('lf_auth',%s)})()" % (json.dumps(json.dumps(CONTA)), json.dumps(json.dumps(LOGIN)))
# o selo do App Check (o site pede ao reCAPTCHA e troca no Firebase): a nuvem de teste dá um selo fixo, como o Google daria
RECAPTCHA = "window.grecaptcha={enterprise:{ready:function(f){f()},execute:function(){return Promise.resolve('argus-recaptcha')}}};"
SELO = 'argus-selo'
PADRAO = {'reserva': (200, {'ok': True, 'exp': 9e15, 'agora': 0}), 'pedido': (200, {'ok': True}), 'cupom': (200, {'ok': False, 'motivo': 'nao'}),
          'codigo': (200, {'ok': True}), 'mensagem': (200, {'ok': True}), 'volta': (200, {'ok': True}), 'atacado': (200, {'ok': False}), 'analise': (200, {'ok': True})}
class Nuvem:
    """respostas = {função: (status, corpo) ou função(corpo_pedido, quantas_vezes) → (status, corpo)} por cima do PADRAO."""
    def __init__(self, respostas=None): self.R = []; self.resp = dict(PADRAO, **(respostas or {}))
    def liga(self, c):
        c.route('**cloudfunctions.net/**', self._funcao)
        c.route('**www.google.com/recaptcha/**', lambda r: r.fulfill(status=200, content_type='text/javascript', body=RECAPTCHA))
        c.route('**firebaseappcheck.googleapis.com/**', lambda r: self._ok(r, {'token': SELO, 'ttl': '3600s'}))
        c.route('**/documents/pedidos**', lambda r: (self.R.append(('BANCO:pedidos', '', {})), r.abort())[1])   # escrever pedido direto no banco = erro
        c.route('**identitytoolkit**', lambda r: self._ok(r, {'users': [{'emailVerified': True, 'email': CONTA['email'], 'localId': LOGIN['uid']}]}))
        c.route('**securetoken.googleapis.com/**', lambda r: self._ok(r, {'id_token': 'argus', 'refresh_token': 'argus', 'expires_in': '3600'}))
    def _ok(self, r, corpo, status=200):
        if r.request.method == 'OPTIONS': return r.fulfill(status=204, headers=CORS)
        r.fulfill(status=status, content_type='application/json', headers=CORS, body=json.dumps(corpo))
    def _funcao(self, r):
        if r.request.method == 'OPTIONS': return r.fulfill(status=204, headers=CORS)
        nome = r.request.url.split('cloudfunctions.net/')[1].split('?')[0]
        try: j = json.loads(r.request.post_data or '{}')
        except Exception: j = {}
        self.R.append((nome, r.request.headers.get('authorization', ''), j, r.request.headers.get('x-firebase-appcheck') == SELO))
        x = self.resp.get(nome, (200, {'ok': False}))
        if callable(x): x = x(j, sum(1 for k in self.R if k[0] == nome))
        if x is None: return r.abort()   # a nuvem fora do ar
        self._ok(r, x[1], x[0])
    def chamadas(self, nome): return [k for k in self.R if k[0] == nome]
