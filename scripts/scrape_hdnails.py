#!/usr/bin/env python3
# trigger workflow: 2026-08-07
import csv, hashlib, json, os, re, time, xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from decimal import Decimal, InvalidOperation
from urllib.parse import urljoin, urlparse
import requests
from bs4 import BeautifulSoup

BASE='https://www.hdnails.it/'
SITEMAP=urljoin(BASE,'sitemap.xml')
OUT_JSON=os.getenv('OUT_JSON','prodotti.json')
OUT_CSV=os.getenv('OUT_CSV','prodotti.csv')
MAX_WORKERS=int(os.getenv('MAX_WORKERS','10'))
TIMEOUT=int(os.getenv('TIMEOUT','30'))
S=requests.Session()
S.headers.update({'User-Agent':'Mozilla/5.0 (compatible; AccademiaSavonaCatalogBot/1.0; +https://github.com/GGG250870/ORDINI_HD_Accademia)','Accept-Language':'it-IT,it;q=0.9,en;q=0.6'})
SKIP=('/blog','/privacy','/termini','/spedizioni','/professionisti','/account','/academy','/formazione','/centro-estetico','/schede-tecniche','/contatti')

def get(url,retries=3):
    err=None
    for i in range(retries):
        try:
            r=S.get(url,timeout=TIMEOUT,allow_redirects=True); r.raise_for_status(); return r
        except Exception as e:
            err=e; time.sleep(1.2*(i+1))
    raise err

def sitemap_urls(url,seen=None):
    seen=seen or set()
    if url in seen:return []
    seen.add(url); root=ET.fromstring(get(url).content)
    tag=root.tag.rsplit('}',1)[-1]
    locs=[e.text.strip() for e in root.iter() if e.tag.rsplit('}',1)[-1]=='loc' and e.text]
    if tag=='sitemapindex':
        out=[]
        for loc in locs: out.extend(sitemap_urls(loc,seen))
        return out
    return locs

def clean(v): return re.sub(r'\s+',' ',str(v or '')).strip()
def txt(n): return n.get_text(' ',strip=True) if n else ''
def meta(soup,key,attr='property'):
    e=soup.find('meta',attrs={attr:key}); return clean(e.get('content')) if e and e.get('content') else ''

def price(v):
    if v is None:return None
    m=re.search(r'\d[\d\s.,]*',clean(v).replace('€','').replace('EUR',''))
    if not m:return None
    n=m.group(0).replace(' ','')
    if ',' in n and '.' in n:
        n=n.replace('.','').replace(',','.') if n.rfind(',')>n.rfind('.') else n.replace(',','')
    elif ',' in n:n=n.replace('.','').replace(',','.')
    try:return float(Decimal(n))
    except (InvalidOperation,ValueError):return None

def money(n):
    if n is None:return ''
    return f'{n:,.2f}'.replace(',','X').replace('.',',').replace('X','.')+' €'

def flatten(x):
    if isinstance(x,list):
        for y in x: yield from flatten(y)
    elif isinstance(x,dict):
        if '@graph' in x: yield from flatten(x['@graph'])
        yield x

def jsonld_product(soup):
    for sc in soup.find_all('script',attrs={'type':re.compile('ld\\+json',re.I)}):
        raw=sc.string or sc.get_text()
        if not raw.strip():continue
        try:data=json.loads(raw)
        except Exception:continue
        for o in flatten(data):
            typ=o.get('@type'); types=typ if isinstance(typ,list) else [typ]
            if any(str(t).lower()=='product' for t in types if t):return o
    return None

def category(soup,name):
    crumbs=[]
    for sel in ('.breadcrumbs li','.breadcrumb li','nav.breadcrumb a',"[aria-label='breadcrumb'] a"):
        crumbs=[clean(txt(e)) for e in soup.select(sel) if clean(txt(e))]
        if crumbs:break
    bad={'home','homepage','prodotti','shop',clean(name).lower()}
    vals=[c for c in crumbs if c.lower() not in bad]
    return vals[-1] if vals else 'Altri prodotti'

def parse_product(url):
    if any(x in url.lower() for x in SKIP):return None
    try:r=get(url)
    except Exception:return None
    if 'text/html' not in r.headers.get('content-type',''):return None
    soup=BeautifulSoup(r.text,'lxml'); p=jsonld_product(soup)
    name=clean((p or {}).get('name')) or clean(txt(soup.select_one('h1'))) or meta(soup,'og:title')
    if not name:return None
    offers=(p or {}).get('offers') or {}
    if isinstance(offers,list):offers=offers[0] if offers else {}
    if not isinstance(offers,dict):offers={}
    pr=price(offers.get('price') or offers.get('lowPrice'))
    if pr is None:
        for sel in ("[itemprop='price']",'.special-price .price','.product-info-price .price','.price-wrapper .price','.price-box .price','.price'):
            e=soup.select_one(sel)
            if e:
                pr=price(e.get('content') or txt(e))
                if pr is not None:break
    sku=clean((p or {}).get('sku'))
    if not sku:
        for sel in ("[itemprop='sku']",'.product.attribute.sku .value','.sku .value','.product-sku'):
            e=soup.select_one(sel)
            if e:
                sku=clean(e.get('content') or txt(e))
                if sku:break
    signal=bool(p or sku or soup.select_one(".product-info-main,[itemtype*='Product'],form[data-product-sku]"))
    if not signal or pr is None:return None
    desc=clean((p or {}).get('description'))
    if not desc:
        for sel in ('.product.attribute.description .value','#description','.product-description','.product-info-main .description','.woocommerce-product-details__short-description'):
            e=soup.select_one(sel)
            if e:
                desc=clean(txt(e))
                if desc:break
    img=(p or {}).get('image') or ''
    if isinstance(img,list):img=img[0] if img else ''
    if isinstance(img,dict):img=img.get('url','')
    img=clean(img) or meta(soup,'og:image')
    if img:img=urljoin(r.url,img)
    av=clean(offers.get('availability','')).rsplit('/',1)[-1]
    av={'InStock':'Disponibile','OutOfStock':'Esaurito','PreOrder':'Preordine','BackOrder':'Ordinabile'}.get(av,av)
    if not av:
        st=soup.select_one('.stock,.availability,[class*=stock]'); av=clean(txt(st)) if st else 'Disponibile'
    canon=soup.find('link',rel='canonical'); cu=canon.get('href') if canon and canon.get('href') else r.url
    old=soup.select_one('.old-price .price,.price-box .old-price .price'); listino=price(txt(old)) if old else None
    stable=sku or cu; pid=hashlib.sha1(stable.encode()).hexdigest()[:16]
    return {'id':pid,'sku':sku or pid,'nome':name,'categoria':category(soup,name),'prezzo':round(pr,2),'prezzo_str':money(pr),'prezzo_listino':round(listino,2) if listino is not None else None,'disponibilita':av,'immagine':img,'descrizione':desc,'specifiche':'','url':cu}

def main():
    urls=sorted({u for u in sitemap_urls(SITEMAP) if urlparse(u).netloc.endswith('hdnails.it')})
    print('URL sitemap:',len(urls)); products=[]
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
        futs={ex.submit(parse_product,u):u for u in urls}
        for i,f in enumerate(as_completed(futs),1):
            try:
                p=f.result()
                if p:products.append(p)
            except Exception as e:print('WARN',futs[f],e)
            if i%100==0:print('Analizzati',i,'prodotti',len(products))
    dedup={}
    for p in products:
        k=(p.get('sku') or '').lower().strip() or p['url'].lower().strip()
        if k not in dedup or (not dedup[k].get('descrizione') and p.get('descrizione')):dedup[k]=p
    products=list(dedup.values()); products.sort(key=lambda x:(x.get('categoria','').casefold(),x.get('nome','').casefold()))
    with open(OUT_JSON,'w',encoding='utf-8') as f:json.dump(products,f,ensure_ascii=False,indent=2); f.write('\n')
    fields=['id','sku','nome','categoria','prezzo','prezzo_str','prezzo_listino','disponibilita','immagine','descrizione','specifiche','url']
    with open(OUT_CSV,'w',encoding='utf-8-sig',newline='') as f:
        w=csv.DictWriter(f,fieldnames=fields,delimiter=';'); w.writeheader(); w.writerows(products)
    print('Scritti',len(products),'prodotti')
    if len(products)<50:raise SystemExit('Catalogo troppo piccolo: scraping probabilmente incompleto')

if __name__=='__main__':main()
