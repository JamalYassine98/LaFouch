// ARGUS · a versão do app que está aberta (version.json): é dado, não desenho (motor/compara.py: mesma_versao)
async()=>{try{return (await (await fetch('version.json',{cache:'no-store'})).json()).nome||''}catch(e){return ''}}
