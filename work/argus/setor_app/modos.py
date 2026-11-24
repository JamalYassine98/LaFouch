# ARGUS · setor App · os modos do app (dono 24/11): claro E escuro · as 3 letras do app (1×, 1,15×, 1,3×) · com e sem biometria.
# A letra grande do Android, no APK, aumenta o TEXTO do WebView (textZoom). No simulador isso é imitado aumentando o tamanho de
# cada texto na mesma proporção (e de novo a cada mudança da tela); a conferência de verdade da letra é no emulador Android.
LETRA = r"""(f)=>{if(window.__argusLetra)return;window.__argusLetra=f;const base=new WeakMap();
 const aplica=()=>{for(const e of document.querySelectorAll('body *')){if(e.closest('svg'))continue;const own=[...e.childNodes].some(n=>n.nodeType==3&&n.textContent.trim());if(!own&&!e.matches('input,textarea,select'))continue;
  if(!base.has(e)){base.set(e,parseFloat(getComputedStyle(e).fontSize))}const b=base.get(e);const alvo=(b*f).toFixed(2)+'px';if(e.style.fontSize!=alvo)e.style.setProperty('font-size',alvo,'important')}};
 aplica();new MutationObserver(()=>{clearTimeout(window.__argusLT);window.__argusLT=setTimeout(aplica,30)}).observe(document.body,{childList:true,subtree:true});return 1}"""
# biometria de mentira: o plugin nativo responde "tem digital" e "confirmado" (só no simulador; no APK é a digital de verdade)
BIO = r"""(()=>{const P={checkBiometry:()=>Promise.resolve({isAvailable:true,biometryType:3,strongBiometryIsAvailable:true}),internalAuthenticate:()=>Promise.resolve({}),authenticate:()=>Promise.resolve({})};
 window.Capacitor=Object.assign(window.Capacitor||{},{Plugins:Object.assign((window.Capacitor&&window.Capacitor.Plugins)||{},{BiometricAuthNative:P})})})()"""
LETRAS = [1.0, 1.15, 1.3]
TEMAS = ['claro', 'escuro']
