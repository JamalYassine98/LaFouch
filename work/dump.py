import json,sys,collections
c=json.load(open(sys.argv[1]))[0]
print('SUMMARY:',c.get('summary','')[:3000])
m=c['chat_messages']
print(m[0].keys())
types=collections.Counter(); att=[]; files=[]
out=open(sys.argv[2],'w')
for i,x in enumerate(m):
    out.write(f"\n\n===== #{i} [{x.get('sender')}] {x.get('created_at','')[:19]} =====\n")
    for a in x.get('attachments',[]):
        att.append((i,a.get('file_name'),len(a.get('extracted_content','') or '')))
        out.write(f"[ATTACH {a.get('file_name')}]\n{(a.get('extracted_content') or '')}\n")
    for f in x.get('files',[]): files.append((i,f.get('file_name')))
    for b in x.get('content',[]):
        t=b.get('type'); types[t]+=1
        if t=='text': out.write(b.get('text','')+'\n')
        elif t=='tool_use': out.write(f"[TOOL_USE {b.get('name')}] {json.dumps(b.get('input'),ensure_ascii=False)[:4000]}\n")
        elif t=='tool_result':
            cc=b.get('content'); s=json.dumps(cc,ensure_ascii=False) if not isinstance(cc,str) else cc
            out.write(f"[TOOL_RESULT {b.get('name')}] {s[:2500]}\n")
        elif t=='thinking': pass
print(types); print('attachments',len(att)); print(att[:60]); print('files',len(files), files[:80])
print('first',m[0]['created_at'],'last',m[-1]['created_at'])
