import json, urllib.request, concurrent.futures as cf, sys
H={'Accept':'application/json'}
def get(u):
    for i in range(3):
        try:
            return json.load(urllib.request.urlopen(urllib.request.Request(u,headers=H),timeout=60))
        except Exception as e:
            err=e
    raise err
def txt(t, langs=('nob','default')):
    if isinstance(t,str): return t
    if isinstance(t,dict): t=t.get('tekst',t)
    if isinstance(t,list):
        for l in langs:
            for v in t:
                if v.get('spraak')==l: return v.get('verdi')
        return t[0].get('verdi') if t else ''
    return ''
CODES=['MAT01-06','NOR01-08','ENG01-06','NAT01-05','SAF01-05','RLE01-04','FSP01-04','KHV01-03','MUS01-03','MHE01-03','KRO01-06','UTV01-03','PRG01-02']
BASE='https://data.udir.no/kl06/v201906/'
out={}
def aim(u):
    d=get(u)
    return {'kode':d['kode'],'nob':txt(d['tittel']),'eng':next((v['verdi'] for v in d['tittel']['tekst'] if v['spraak']=='eng'),''),
            'kjerne':[txt(k.get('tittel')) if isinstance(k.get('tittel'),(list,dict,str)) else k.get('kode') for k in d.get('tilknyttede-kjerneelementer',[])]}
for code in CODES:
    try: p=get(BASE+'laereplaner-lk20/'+code)
    except Exception as e: print('feil',code,e); continue
    kj=[]
    for k in (p.get('om-faget-kapittel',{}).get('kjerneelementer-i-faget') or {}).get('kjerneelementer',[]) if isinstance(p['om-faget-kapittel'].get('kjerneelementer-i-faget'),dict) else []:
        kj.append({'tittel':txt(k.get('tittel')),'tekst':txt(k.get('beskrivelse') or k.get('tekst'))[:600]})
    ent={'kode':code,'tittel':txt(p['tittel']),'gyldig_fra':p['gyldighetsperiode']['gyldig-fra']['dato'],'fastsatt':p['fastsettelsesinformasjon']['fastsatt-dato'],'kjerneelementer':kj,'sets':[]}
    for s in p['kompetansemaal-kapittel']['kompetansemaalsett']:
        sd=get(s['url-data'])
        urls=[a['url-data'] for a in sd.get('kompetansemaal',[])]
        with cf.ThreadPoolExecutor(8) as ex: aims=list(ex.map(aim,urls))
        ent['sets'].append({'kode':sd['kode'],'tittel':txt(sd['tittel']),'etter':[a['kode'] for a in sd.get('etter-aarstrinn',[])],'trinn':[a['kode'] for a in sd.get('benyttes-paa-aarstrinn',[])],'aims':aims})
    out[code]=ent
    print(code,ent['tittel'],'| sett:',len(ent['sets']),'| mål:',sum(len(s['aims']) for s in ent['sets']),'| kjerneelementer:',len(kj),flush=True)
json.dump(out,open('lk_data.json','w'),ensure_ascii=False,indent=1)
