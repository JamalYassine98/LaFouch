// Verificador dos padrões de luxo (v1, 18/11/2026). Roda numa tela já aberta; devolve fatos e suspeitos.
()=>{const W=innerWidth,H=innerHeight,cs=e=>getComputedStyle(e),vis=e=>{const r=e.getBoundingClientRect();const c=cs(e);return r.width>1&&r.height>1&&r.bottom>0&&r.top<H&&c.visibility!='hidden'&&+c.opacity>0.05};
 const out={caixas:[],adicionar:[],formDentro:[],camposCaixa:0,fontes:{},cores:{},botoes:[],moeda:[],anim:{},alturaBaixa:[],vazio:[]};
 const pagBg=cs(document.body).backgroundColor;
 const dentroJanela=e=>!!e.closest('.ljJn,.modal-box,[aria-modal=true]');
 const txt=e=>(e.innerText||e.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ').slice(0,40);
 document.querySelectorAll('body *').forEach(e=>{if(!vis(e))return;const c=cs(e),r=e.getBoundingClientRect();
  // design: caixa sobrando (fundo diferente da página ou borda, cantos arredondados, com texto dentro, não é botão/campo/barra/janela)
  if(!/^(BUTTON|INPUT|SELECT|TEXTAREA|NAV|IMG|svg|LABEL)$/i.test(e.tagName)&&!e.closest('nav,.bnav,#bnav,.tabbar,button')&&!/ljJn|modal-box|lfLinha|bar|seg|Seg|pill|chip|badge|tag|in\b/.test(e.className+'')){
   const bg=c.backgroundColor,bd=parseFloat(c.borderTopWidth)+parseFloat(c.borderLeftWidth);const rad=parseFloat(c.borderTopLeftRadius);
   if(r.height>40&&r.width>W*0.5&&rad>=8&&((bg!='rgba(0, 0, 0, 0)'&&bg!=pagBg)||bd>=2)&&e.innerText&&e.innerText.trim().length>3&&!dentroJanela(e))out.caixas.push(txt(e))}
  // botões
  if(e.tagName=='BUTTON'||e.getAttribute('role')=='button'){const t=txt(e);if(t)out.botoes.push(t);
   if(/^\+|^(Adicionar|Novo|Nova)\b/i.test(t)||/^(Adicionar|Novo|Nova)/i.test(e.getAttribute('aria-label')||'')){const red=Math.abs(r.width-r.height)<4&&parseFloat(c.borderTopLeftRadius)>=r.height/2-1;out.adicionar.push({t,forma:red?'redondo':'pílula/outro',w:Math.round(r.width)})}
   if(r.height<43.5&&!e.closest('nav,.bnav')&&r.width>60)out.alturaBaixa.push(t+' '+Math.round(r.height)+'px')}
  // campos
  if(/^(INPUT|SELECT|TEXTAREA)$/.test(e.tagName)&&e.type!='hidden'&&e.type!='checkbox'&&e.type!='radio'){const bd=parseFloat(c.borderTopWidth)>0&&parseFloat(c.borderLeftWidth)>0;if(bd)out.camposCaixa++}
  // animações
  const td=c.transitionDuration,ad=c.animationDuration;if(td&&td!='0s'){const k=(e.className+'').split(' ')[0]||e.tagName;out.anim[k]=td+' '+c.transitionTimingFunction}
  // letras e cores (só elementos com texto direto)
  if([...e.childNodes].some(n=>n.nodeType==3&&n.textContent.trim())){out.fontes[c.fontSize]=(out.fontes[c.fontSize]||0)+1;const col=c.color;out.cores[col]=(out.cores[col]||0)+1;
   const s=[...e.childNodes].filter(n=>n.nodeType==3).map(n=>n.textContent).join(' ');(s.match(/(G\$|Gs\.?|₲|US\$|USD|R\$|\$)\s?[\d.,]+/g)||[]).forEach(m=>out.moeda.push(m))}
 });
 // formulário dentro da página (P2): bloco com 2+ campos fora de janela
 document.querySelectorAll('form,section,div').forEach(e=>{if(!vis(e)||dentroJanela(e))return;const ins=[...e.querySelectorAll(':scope input:not([type=hidden]):not([type=checkbox]):not([type=radio]),:scope textarea,:scope select')].filter(vis);if(ins.length>=3&&!e.parentElement.closest('form,section')){out.formDentro.push(txt(e.querySelector('h2,h3,b,.lbl')||e))}});
 // tela vazia
 [...document.querySelectorAll('body *')].filter(e=>vis(e)&&/^(Nenhum|Nenhuma|Sem |Ainda não)/.test((e.innerText||'').trim())&&e.children.length<3).slice(0,3).forEach(e=>out.vazio.push({t:txt(e),alinh:cs(e).textAlign,icone:!!(e.parentElement&&e.parentElement.querySelector('svg'))}));
 out.botoes=[...new Set(out.botoes)];out.caixas=[...new Set(out.caixas)];out.formDentro=[...new Set(out.formDentro)];
 return out}
