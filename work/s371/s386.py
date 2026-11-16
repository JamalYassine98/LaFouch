# S386 (dono 16/11 13:35 "Implementar"): as três melhorias viram o modo normal; ?camt=0 volta ao jeito antigo (para comparar/diagnosticar)
f='/home/claude/catalogo/js/lf-site.js';s=open(f,encoding='utf8').read()
def tr(a,b,n=1):
    global s;assert s.count(a)==n,(s.count(a),a[:60]);s=s.replace(a,b)
tr("var CAMT=false;try{CAMT=/[?&]camt=1/.test(location.search)||sessionStorage.getItem('lf_camt')==='1';if(CAMT)sessionStorage.setItem('lf_camt','1')}catch(_){}window.__lfCamt=CAMT;",
   "var CAMT=true;try{if(/[?&]camt=0/.test(location.search))sessionStorage.setItem('lf_camt','0');else if(/[?&]camt=1/.test(location.search))sessionStorage.removeItem('lf_camt');CAMT=sessionStorage.getItem('lf_camt')!=='0'}catch(_){}window.__lfCamt=CAMT;")
tr("' · AO LADO (teste)'","' · AO LADO'")
tr("' · teste falhou, voltou ao normal'","' · ao lado falhou, voltou ao leitor antigo'")
open(f,'w',encoding='utf8').write(s);print('ok')
