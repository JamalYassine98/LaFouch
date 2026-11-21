exec(open('/home/claude/lafouch/work/s435/compras/hoje.py').read().split("if __name__=='__main__':")[0].replace("O='/home/claude/lafouch/work/s435/compras/'","O='/home/claude/lafouch/work/s435/giroprecos/'"))
with sync_playwright() as pw:
  tira(pw,'h_res_indice',"()=>{__LF.S.nvP=['grp:g:res'];__LF.S.nvG='g:res';__LF.setView('grp')}",1)
  tira(pw,'h_res_dia',"()=>__LF.inicioGo('hoje')",3)
  tira(pw,'h_res_hist',"()=>__LF.inicioGo('hist')",3)
