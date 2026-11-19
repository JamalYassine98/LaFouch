exec(open('/home/claude/lafouch/work/s437/esb.py').read())
J="""()=>{const e=[...document.querySelectorAll('[data-act=ccfechar]')].find(x=>x.getBoundingClientRect().height);if(e)e.style.setProperty('display','none','important')}"""
caso('fechar_conferir','Conferir o caixa',C['caixa-conferir'],'[data-act=ccgo]',J,'Novo objetivo',C['caixa-novo-objetivo'],'[data-act=obAdd]','janela com "Conferir" e "Fechar" embaixo','só "Conferir"; fecha arrastando a alça ou tocando fora (P6)','modelo: janela sem "Fechar"')
