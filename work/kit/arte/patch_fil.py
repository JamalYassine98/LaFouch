import sys
R=sys.argv[1] if len(sys.argv)>1 else '2.6'
s=open('/tmp/k/mochi_mod_orig.js').read()
body='<path d="M60 30 C95 30 106 58 106 84 C106 108 88 122 60 122 C32 122 14 108 14 84 C14 58 25 30 60 30Z" fill="url(#lfmb)" stroke="#ecc9da" stroke-width="1.4"/>'
assert s.count(body)==1
s=s.replace(body,body.replace('<path d=','<path class="corpoF" d=')+'<g class="filE"></g><g class="filD"></g>')
anchor="F.setAttribute('opacity',op.toFixed(3))}"
assert s.count(anchor)==1
fil="""F.setAttribute('opacity',op.toFixed(3));filSet(lado,ang,L,op<.5)}
function filSet(lado,ang,L,vis){const G=q(lado<0?'.filE':'.filD'),body=q('.corpoF');if(!G||!body)return;if(!vis){G.innerHTML='';return}
 const NS='http://www.w3.org/2000/svg';let A=filSet.a;if(!A){const sv=document.createElementNS(NS,'svg');sv.setAttribute('style','position:fixed;left:-20px;top:0;width:0;height:0;overflow:hidden');A=document.createElementNS(NS,'path');sv.appendChild(A);document.body.appendChild(sv);filSet.a=A}
 A.setAttribute('d',ARMP(L).replace('M0 -10','M-8 -10 L0 -10').replace(/ Z$/,' L-8 10 Z'));const sx=lado<0?22:98,rt=(lado<0?180-ang:ang)*Math.PI/180,c=Math.cos(rt),s=Math.sin(rt),f=lado<0?-1:1;
 const toS=p=>{const y=p.y*f;return {x:sx+p.x*c-y*s,y:92+p.x*s+y*c}},toL=p=>{const dx=p.x-sx,dy=p.y-92;return {x:dx*c+dy*s,y:(-dx*s+dy*c)*f}};
 const inB=p=>body.isPointInFill(new DOMPoint(p.x,p.y)),inA=p=>A.isPointInFill(new DOMPoint(...Object.values(toL(p))));
 const La=A.getTotalLength(),Lb=body.getTotalLength(),n=300,r=%s;const aP=t=>toS(A.getPointAtLength(((t%%La)+La)%%La)),bP=t=>body.getPointAtLength(((t%%Lb)+Lb)%%Lb);
 let h='',prev=inB(aP(0));for(let i=1;i<=n;i++){const t=La*i/n,cur=inB(aP(t));if(cur!==prev){let lo=La*(i-1)/n,hi=t;for(let k=0;k<14;k++){const m=(lo+hi)/2;(inB(aP(m))===prev)?lo=m:hi=m}
   const tj=(lo+hi)/2,J=aP(tj),sa=prev?1:-1;let tb=0,bd=1e9;for(let k=0;k<400;k++){const u=Lb*k/400,p=bP(u),d=(p.x-J.x)**2+(p.y-J.y)**2;if(d<bd){bd=d;tb=u}}
   let sb=1;if(inA(bP(tb+1.5)))sb=-1;const a1=aP(tj+sa*1.5),b1=bP(tb+sb*1.5),ux=a1.x-J.x,uy=a1.y-J.y,vx=b1.x-J.x,vy=b1.y-J.y,
   th=Math.acos(Math.max(-1,Math.min(1,(ux*vx+uy*vy)/Math.hypot(ux,uy)/Math.hypot(vx,vy)))),rr=Math.min(9,Math.max(r,1.7/Math.tan(th/2)));
   const Ap=aP(tj+sa*rr),Bp=bP(tb+sb*rr);const F2=v=>v.toFixed(2),Q=`M${F2(Ap.x)} ${F2(Ap.y)} Q${F2(J.x)} ${F2(J.y)} ${F2(Bp.x)} ${F2(Bp.y)}`;
   const gid=`lfmfg${lado<0?"e":"d"}${i}`;h+=`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${F2(Ap.x)}" y1="${F2(Ap.y)}" x2="${F2(Bp.x)}" y2="${F2(Bp.y)}"><stop offset="0" stop-color="#e8c3d6"/><stop offset="1" stop-color="#ecc9da"/></linearGradient><path d="${Q} L${F2(J.x)} ${F2(J.y)}Z" fill="url(#${gid})" stroke="url(#${gid})" stroke-width=".3" stroke-linejoin="round"/><path d="${Q}" fill="none" stroke="url(#${gid})" stroke-width="1.5" stroke-linecap="butt"/>`}prev=cur}
 G.innerHTML=h}"""%R
s=s.replace(anchor,fil)
open('/tmp/k/mochi_mod_fil.js','w').write(s)
