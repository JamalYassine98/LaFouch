exec(open('/home/claude/lafouch/work/s435/compras/hoje.py').read().split("if __name__=='__main__':")[0].replace("O='/home/claude/lafouch/work/s435/compras/'","O='/home/claude/lafouch/work/s435/destaque/'"))
with sync_playwright() as pw:
  tira(pw,'h_mkt_indice',"()=>{__LF.S.nvP=['grp:g:mkt'];__LF.S.nvG='g:mkt';__LF.setView('grp')}",1)
  tira(pw,'h_mkt',"()=>__LF.inicioGo('mkt')",4)
