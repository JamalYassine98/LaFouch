# Escolhe o aparelho REAL do Test Lab: forma (PHONE/TABLET), de preferência Samsung, com Android mais novo.
import json,sys
ms=json.load(open(sys.argv[1]));forma=sys.argv[2].upper();pref=sys.argv[3].lower() if len(sys.argv)>3 else 'samsung'
f=[m for m in ms if m.get('form')=='PHYSICAL' and m.get('formFactor')==forma and m.get('supportedVersionIds')]
for m in f: print('#',m['id'],m.get('manufacturer'),m.get('name'),m['supportedVersionIds'],file=sys.stderr)
v=lambda m:max(int(x) for x in m['supportedVersionIds'] if x.isdigit())
f.sort(key=lambda m:(pref in (m.get('manufacturer','')+m.get('name','')).lower(),v(m)),reverse=True)
m=f[0];print('model=%s,version=%d,locale=pt_BR,orientation=portrait'%(m['id'],v(m)))
