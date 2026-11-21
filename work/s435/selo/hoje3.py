exec(open('/home/claude/lafouch/work/s435/compras/hoje.py').read().split("if __name__=='__main__':")[0].replace("O='/home/claude/lafouch/work/s435/compras/'","O='/home/claude/lafouch/work/s435/selo/'"))
with sync_playwright() as pw:
  tira(pw,'h_precos',"()=>{__LF.S.dTab='prec';__LF.setView('dash')}",4)
