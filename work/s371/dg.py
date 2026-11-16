# S374 (16/11/2026 08:25, dono: "colocar diagnóstico também, assim te mando print"): linha de diagnóstico do catálogo na prévia do painel e na faixa do administrador (site desligado).
p='/home/claude/catalogo/js/lf-site.js';s=open(p,encoding='utf8').read()
def tr(a,b):
    global s;assert s.count(a)==1,(s.count(a),a[:80]);s=s.replace(a,b)
tr("  var PV=null,PVT=0,PVN=0;\n",
"""  var PV=null,PVT=0,PVN=0;
  /* S374: diagnóstico pedido pelo dono — com o site desligado, a faixa da prévia (painel) e a do administrador dizem quando o catálogo foi lido da nuvem, quantas peças vieram,
     quando foi a última conferência e quando o app mandou a última mudança (config/site.pv). Só texto; não muda nada do funcionamento. */
  var DG={};
  function dgH(t){if(!t)return '—';var d=new Date(t),z=function(n){return (n<10?'0':'')+n};return z(d.getHours())+':'+z(d.getMinutes())+':'+z(d.getSeconds())}
  function dgD(t){if(!t)return 'nunca';var d=new Date(t),z=function(n){return (n<10?'0':'')+n};return z(d.getDate())+'/'+z(d.getMonth()+1)+' '+dgH(t)}
  function dgTxt(){return 'Diagnóstico · catálogo lido '+dgH(DG.lido)+' · '+(DG.n==null?'?':DG.n)+' peças na nuvem · '+P.length+' no site · conferido '+dgH(DG.conf)+' · último envio do app '+dgD(DG.pv)+(DG.err?' · falhou: '+DG.err:'')}
  function dgPoe(){try{[['prvb','prvd'],['admb','admd']].forEach(function(x){var b=document.getElementById(x[0]);if(!b)return;var e=document.getElementById(x[1]);if(!e){e=document.createElement('small');e.id=x[1];e.className='lfdg';b.appendChild(e)}e.textContent=dgTxt()})}catch(_){}}
""")
tr("fbg('config/site').then(function(d){var c=fbd(d)||{},pv=c.pv||0;PVN++;","fbg('config/site').then(function(d){var c=fbd(d)||{},pv=c.pv||0;PVN++;DG.conf=Date.now();DG.pv=pv;DG.err='';dgPoe();")
tr("return fbg('produtos?pageSize=300').then(function(j){if(!j||!j.documents)return;var sj=JSON.stringify(j.documents);if(sj===prodVivo.ult)return;prodVivo.ult=sj;try{localStorage.setItem('lf_pdocs',sj)}catch(_){}syncProds(j.documents)})}).catch(function(){})}",
   "return fbg('produtos?pageSize=300').then(function(j){if(!j||!j.documents)return;DG.lido=Date.now();DG.n=j.documents.length;var sj=JSON.stringify(j.documents);if(sj===prodVivo.ult){dgPoe();return}prodVivo.ult=sj;try{localStorage.setItem('lf_pdocs',sj)}catch(_){}syncProds(j.documents);dgPoe()})}).catch(function(){DG.err='a nuvem não respondeu às '+dgH(Date.now());dgPoe()})}")
tr("return pp}).then(function(j){if(j&&j.documents){try{prodVivo.ult=JSON.stringify(j.documents);","return pp}).then(function(j){DG.pv=+(CFG&&CFG.pv)||0;if(j&&j.documents){DG.lido=Date.now();DG.n=j.documents.length;try{prodVivo.ult=JSON.stringify(j.documents);")
tr("syncProds(j.documents)}}).catch(function(){}).then(function(){var l=document.getElementById('prevld');if(l)l.remove();","syncProds(j.documents)}}).catch(function(){DG.err='os produtos não vieram às '+dgH(Date.now())}).then(function(){dgPoe();var l=document.getElementById('prevld');if(l)l.remove();")
tr("document.body.appendChild(pv)}return}","document.body.appendChild(pv)}dgPoe();return}")
tr("(window.parent!==window?'':'<a href=\"admin.html\">Abrir painel</a>');return}","(window.parent!==window?'':'<a href=\"admin.html\">Abrir painel</a>');dgPoe();return}")
open(p,'w',encoding='utf8').write(s)
h='/home/claude/catalogo/index.html';t=open(h,encoding='utf8').read();a="#prvb button{border:0;background:transparent;color:#8a5a00;font:700 13px Inter,system-ui,sans-serif;text-decoration:underline;cursor:pointer}";assert t.count(a)==1
t=t.replace(a,a+"#prvb{flex-wrap:wrap}.lfdg{flex-basis:100%;display:block;font:500 11.5px/1.35 Inter,system-ui,sans-serif;opacity:.92;overflow-wrap:anywhere}");open(h,'w',encoding='utf8').write(t);print('ok')
