exec(open('/home/claude/lafouch/work/s435/compras/hoje.py').read().split("if __name__=='__main__':")[0].replace("O='/home/claude/lafouch/work/s435/compras/'","O='/home/claude/lafouch/work/s435/giroprecos/'"))
with sync_playwright() as pw:
  tira(pw,'h_res_mes',"()=>{__LF.S.per='mes';__LF.S.dTab='hoje';__LF.setView('dash')}",5)
