"""IDEIAS 05 v3 · vídeo na Black Friday (tema ativo do site). Proposta = /tmp/a5d (:8726, tema.py copia).
PC com o topo novo (logo à esquerda; lupa · sacola · ☰ à direita; Minha conta só dentro do menu) e fundo desfocado.
Nos dois: a camada cresce do botão tocado e volta para ele, e esse botão vira ✕ no mesmo lugar (o ✕ de dentro da
camada sai). Proposta pintada em /tmp/a5c (:8726). Hoje = /tmp/b5h (:8721).
Uso: python3 video2.py copia → (servidor em comando separado) → python3 video2.py"""
import os, sys, subprocess
sys.path.insert(0, '/home/claude/lafouch/work/ideias/05-animacoes')
import video as V

PINTA2 = r"""
/* PINTURA (só no esboço) · IDEIAS 05 v2 */
(function(){
 var ABRE=420,FECHA=280,CURVA='cubic-bezier(.16,1,.3,1)',ORIG=null,A=Element.prototype.animate,PC=matchMedia('(min-width:900px)');
 var X="url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M6 6l12 12M18 6L6 18' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\")";
 var st=document.createElement('style');st.textContent=
  ':root{--lfTopo:0px}'+
  /* uma camada, embaixo do topo */
  '#drw{top:var(--lfTopo)!important;transition:visibility 0s linear .3s!important}#drw.on{transition:visibility 0s!important}'+
  '#drw .dpn{transition:none!important;transform:none!important}#drw .dsc{opacity:0!important;transition:none!important}'+
  '#sov{top:var(--lfTopo)!important}#sov .sosc{opacity:0!important}#sov .sopn{animation:none!important;transform:none!important}'+
  /* o ✕ fica no botão que abriu: sai o de dentro */
  '#drw .dpn>:has(>button[data-dclose]),#drw button[data-dclose],#layer .cph .x{display:none!important}'+'.lfX{box-shadow:none!important;outline:0!important;border-color:transparent!important;background:transparent!important}'+
  '.lfX>svg,.lfX>*:not(.lfXi){visibility:hidden!important}.lfXi{position:absolute;inset:0;margin:auto;width:22px;height:22px;background:currentColor;-webkit-mask:'+X+' center/contain no-repeat;mask:'+X+' center/contain no-repeat}'+
  /* celular: tela cheia, sem desfoque */
  '@media (max-width:899px){#drw .dpn{width:100%!important;border:0!important}'+
   '#sov .sopn{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;max-height:none!important;border-radius:0!important;border:0!important;box-shadow:none!important;overflow:auto!important}'+
   '#__fundo{display:none!important}}'+
  /* PC: topo novo e desfoque */
  '@media (min-width:900px){html.v5 body .top .bar>.logo{position:relative!important;left:auto!important;top:auto!important;transform:none!important;order:0!important;margin:0 auto 0 0!important;flex:0 0 auto!important;width:120px!important}'+
   'html.v5 body .top .bar>#sbtn{order:1!important;margin:0!important}html.v5 body .top .bar>#bagbtn{order:2!important;margin:0 0 0 24px!important}html.v5 body .top .bar>#mnb{order:3!important;margin:0 0 0 24px!important}html.v5 body .top .bar>#contabtn{display:none!important}'+
   '#drw .dpn{left:auto!important;right:0!important}'+
   '#sov .sopn{left:0!important;right:0!important;margin:0 auto!important;top:16px!important}}'+
  '#__fundo{position:fixed;left:0;right:0;bottom:0;top:var(--lfTopo);background:rgba(18,8,14,.22);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);opacity:0;pointer-events:none}'+
  'html.lock>body:not(#__x){overflow:visible!important}';
 document.head.appendChild(st);
 var fundo=document.createElement('div');fundo.id='__fundo';document.body.appendChild(fundo);
 function marca(b){document.querySelectorAll('.lfX').forEach(function(x){x.classList.remove('lfX');var i=x.querySelector('.lfXi');i&&i.remove()});
  if(b){b.classList.add('lfX');var i=document.createElement('i');i.className='lfXi';b.appendChild(i)}}
 document.addEventListener('pointerdown',function(e){var b=e.target.closest&&e.target.closest('#mnb,#sbtn,#bagbtn');if(b&&!b.classList.contains('lfX'))ORIG=b},true);
 document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.lfX');if(!b)return;e.preventDefault();e.stopImmediatePropagation();
  if(b.id==='bagbtn')history.back();else if(b.id==='mnb'){var x=document.querySelector('#drw button[data-dclose]');x&&x.click()}
  else document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))},true);
 function topo(){var t=document.querySelector('.top').getBoundingClientRect();document.documentElement.style.setProperty('--lfTopo',Math.max(0,t.bottom)+'px')}
 function camada(el,abre,z){
  var b=(ORIG||document.getElementById('mnb')).getBoundingClientRect(),p=el.getBoundingClientRect();
  el.style.transformOrigin=(b.left+b.width/2-p.left)+'px '+(b.top+b.height/2-p.top)+'px';
  el.getAnimations().forEach(function(a){a.cancel()});fundo.getAnimations().forEach(function(a){a.cancel()});
  marca(abre?ORIG:null);
  var k=[{scale:'.4',opacity:0,borderRadius:'28px'},{scale:'1',opacity:1,borderRadius:getComputedStyle(el).borderRadius}];if(!abre)k.reverse();
  var o={duration:abre?ABRE:FECHA,easing:CURVA,fill:abre?'none':'forwards'};
  if(PC.matches){fundo.style.zIndex=z;A.call(fundo,[{opacity:abre?0:1},{opacity:abre?1:0}],{duration:o.duration,easing:CURVA,fill:'forwards'});
   var h=document.getElementById('home');if(h)A.call(h,[{scale:abre?'1':'.97'},{scale:abre?'.97':'1'}],{duration:o.duration,easing:CURVA,fill:'forwards'})}
  return A.call(el,k,o)}
 Element.prototype.animate=function(k,o){
  var el=this,f=Array.isArray(k)?k[k.length-1]:{};
  if(el.matches&&el.matches('#sov .sopn,#layer>.scrim.pg')){
   var abre=!(/100%/.test(f.transform||'')||String(f.opacity)==='0');if(abre)topo();
   return camada(el,abre,el.matches('.sopn')?79:31)}
  if(el.id==='home'||el.matches&&el.matches('.sosc'))return A.call(el,[{},{}],{duration:1});
  if(el.closest&&el.closest('#drw .dpn,#sov .sopn')){o=Object.assign({},typeof o==='number'?{duration:o}:o||{},{duration:1,delay:0})}
  return A.call(el,k,o)};
 var d=document.getElementById('drw'),era=false;
 function solta(){var b=document.querySelector('.lfX');if(!b)return;var aberto=b.id==='mnb'?d.classList.contains('on'):b.id==='sbtn'?!!document.querySelector('#sov .sopn'):!!document.querySelector('#layer>.scrim.pg');if(!aberto)marca(null)}
 ['layer','sov'].forEach(function(i){var e=document.getElementById(i);e&&new MutationObserver(solta).observe(e,{childList:true,subtree:false})});

 new MutationObserver(function(){var on=d.classList.contains('on');if(on===era)return;era=on;if(on)topo();camada(d.querySelector('.dpn'),on,59)}).observe(d,{attributes:true,attributeFilter:['class']});
})();
"""

if __name__ == '__main__':
    if 'copia' in sys.argv:
        pass; raise SystemExit
    FT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
    AQ = V.AQUI
    lab = lambda t, c, fs, ph: "pad=iw:ih+%d:0:%d:color=white,drawtext=fontfile=%s:text='%s':x=20:y=%d:fontsize=%d:fontcolor=%s" % (ph, ph, FT, t, ph // 4, fs, c)
    if 'pc' not in sys.argv:
        v = [V.grava('hoje', 8721), V.grava('v3', 8726, x=True)]
        fc = '[0:v]%s,tpad=stop_mode=clone:stop_duration=4[a];[1:v]%s,tpad=stop_mode=clone:stop_duration=4[b];[a][b]hstack=inputs=2[v]' % (lab('HOJE', '#b3261e', 40, 80), lab('PROPOSTA', '#8d3a69', 40, 80))
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', v[0], '-i', v[1], '-filter_complex', fc, '-map', '[v]', '-r', '30', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', os.path.join(AQ, 'esboco-05c-bf-celular.mp4')], check=True)
    if 'cel' not in sys.argv:
        v = [V.grava('hoje', 8721, 1128, 720), V.grava('v3', 8726, 1128, 720, x=True)]
        fc = '[0:v]%s,tpad=stop_mode=clone:stop_duration=4[a];[1:v]%s,tpad=stop_mode=clone:stop_duration=4[b];[a][b]vstack=inputs=2[v]' % (lab('HOJE', '#b3261e', 32, 60), lab('PROPOSTA', '#8d3a69', 32, 60))
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', v[0], '-i', v[1], '-filter_complex', fc, '-map', '[v]', '-r', '30', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', os.path.join(AQ, 'esboco-05c-bf-pc.mp4')], check=True)
    print('ok')
