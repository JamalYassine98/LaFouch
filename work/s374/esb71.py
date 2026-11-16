# S374 · esboço 71 (dono 16/11 16:58 "Histórico") — aba 4 da padronização dos botões (padrão de controles 15/11).
# Proposta: busca sem caixa em volta, com 📅 e "Filtros" virando ícones de linha (44 px, contorno neutro, como no Inventário) ·
# dia em 2 linhas (data · dia da semana ... valor › / "8 vendas · 1 despesa · lucro livre G$ …"), sem pílulas (eram informação,
# não filtro) · mês com o total numa linha · semana partida entre 2 meses com a data certa (hoje aparece 2× "26/10 a 01/11") ·
# "(s)" vira plural certo · "Carregar mais 30 dias ›" texto rosa.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
CSS71="""
#v-hist section.card:has(#hq){background:none!important;border:0!important;box-shadow:none!important;padding:0!important}
#v-hist .ic71{width:44px;min-width:44px;height:44px;padding:0!important;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--line)!important;background:none!important;border-radius:999px;color:var(--fg)}
#v-hist .ic71 svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
#v-hist .pcard{padding:12px 14px!important;gap:4px!important}
#v-hist .d71{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:4px 10px;width:100%;text-align:left}
#v-hist .d71 .dt{font-size:16px;font-weight:600}#v-hist .d71 .dt small{font-weight:400;color:var(--mute);font-size:13px;margin-left:6px;text-transform:capitalize}
#v-hist .d71 .vl{font-size:17px;font-weight:700;font-variant-numeric:tabular-nums}
#v-hist .d71 .ch{color:var(--mute);font-size:18px;grid-row:1/3;grid-column:3}
#v-hist .d71 .mt{grid-column:1/3;font-size:12.5px;color:var(--mute)}#v-hist .d71 .mt .w{color:var(--warn)}
#v-hist .m71{display:flex;justify-content:space-between;gap:10px;font-size:13px;color:var(--mute);margin:0 0 8px}#v-hist .m71 b{color:var(--fg);font-weight:600}
#v-hist .mais71{display:flex;flex-direction:column;align-items:flex-start;margin-top:10px}
#v-hist .mais71 button{background:none;border:0;padding:10px 0;min-height:44px;font:inherit;font-weight:600;color:var(--accent-fg)}
#v-hist .mais71 small{color:var(--mute);font-size:12.5px;margin-top:-6px}
"""
JS71=r"""()=>{const v=document.getElementById('v-hist');const pl=t=>t.replace(/(\d+) (venda|despesa|dia|outro)\(s\)/g,(m,n,w)=>n+' '+w+(+n===1?'':'s'));
 const cal='<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',fil='<svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>';
 const c=v.querySelector('[data-act=hcal]');c.className='ic71';c.innerHTML=cal;const f=v.querySelector('[data-act=hfopen]');f.className='ic71';f.innerHTML=fil;f.setAttribute('aria-label','Filtros');
 v.querySelectorAll('.pcard[data-act=opendia]').forEach(p=>{const s=p.children;const dt=s[0].children[0].textContent,ds=s[0].children[1].textContent,vl=s[1].textContent;
   const pills=[...p.querySelectorAll('.pills .cell')].map(x=>{const t=pl(x.textContent.trim());return /gastos|despesa/.test(t)?'<span class="w">'+t+'</span>':t});
   const lu=(s[3]&&s[3].textContent.match(/lucro livre G\$ [\d.]+/)||[''])[0];
   p.innerHTML='<span class="d71"><span class="dt">'+dt+'<small>'+ds+'</small></span><span class="vl">'+vl+'</span><span class="ch">›</span><span class="mt">'+pills.concat(lu?[lu]:[]).join(' · ')+'</span></span>'});
 v.querySelectorAll('.hint').forEach(h=>{const m=h.textContent.match(/^Mês todo: (G\$ [\d.]+) em (\d+) venda\(s\) · (lucro livre G\$ [\d.]+)/);if(m){h.className='m71';h.innerHTML='<span>'+pl(m[2]+' venda(s)')+' · '+m[3]+'</span><b>'+m[1]+'</b>'}});
 v.querySelectorAll('.hSem').forEach(s=>{const [ini,mes]=s.dataset.id.split('|');const d0=new Date(ini+'T12:00');const d1=new Date(d0);d1.setDate(d1.getDate()+6);
   const [y,m]=mes.split('-').map(Number);const a=new Date(Math.max(d0,new Date(y,m-1,1,12))),b=new Date(Math.min(d1,new Date(y,m,0,12)));const f2=d=>String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0');
   s.querySelector('b').textContent='Semana '+(f2(a)===f2(b)?f2(a):f2(a)+' a '+f2(b));const sm=s.querySelector('small');sm.textContent=pl(sm.textContent)});
 const mm=v.querySelector('[data-act=hmais]');if(mm){const n=(mm.textContent.match(/\((\d+) dia/)||[])[1];const d=document.createElement('div');d.className='mais71';d.innerHTML='<button type="button">Carregar mais 30 dias ›</button>'+(n?'<small>'+n+' dias com movimento</small>':'');mm.replaceWith(d)}
 return 1}"""
def tela(pg,w): pg.evaluate("()=>window.__LF.setView('hist')");w(1500)
PARTES=[('a-dias','#hq',"Busca e dias",-200),('b-semanas','.hSem','Semanas e meses',-500)]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome,sel,tit,off in PARTES:
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(900);tela(pg,w)
                if prop: pg.add_style_tag(content=CSS71);pg.evaluate(JS71);w(300)
                pg.evaluate("([s,o])=>{const e=document.querySelector('#v-hist '+s);scrollTo({top:e.getBoundingClientRect().top+scrollY+o,behavior:'instant'})}",[sel,off]);w(350)
                oo.append(olho(pg));p=T+'h71_%s_%d_%d.png'%(nome,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(nome,tema,'novos:',novos(oo[0],oo[1]))
            prancha('71%s-app-historico-botoes-%s.jpg'%(nome,tema),'App · Histórico › botões (aba 4) · %s · tema %s'%(tit,tema),
              ['Hoje: busca dentro de uma caixa, 📅 em emoji e "Filtros" em pílula; cada dia ocupa 160 px com pílulas que parecem filtro; "(s)" nos plurais; semana 26/10 a 01/11 aparece 2×; "Carregar mais" em botão de 2 linhas.',
               'Proposta: busca solta com ícones de linha (calendário e filtros, 44 px) · dia em 2 linhas com o valor e › · sem pílulas · mês com o total numa linha · semana com as datas do mês · plural certo · "Carregar mais 30 dias ›" em texto rosa.'],*fs)
