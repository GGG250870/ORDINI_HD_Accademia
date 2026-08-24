#!/usr/bin/env python3
import csv
import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE_JSON = ROOT / 'prodotti.json'
APP_CSV = ROOT / 'HDNails_Catalogo_Facebook_Commerce.csv'
PATCH = ROOT / 'catalog_patch.js'
INDEX = ROOT / 'index.html'
SW = ROOT / 'sw.js'
NOJEKYLL = ROOT / '.nojekyll'
STATE = ROOT / 'catalog_monitor_state.json'
MAX_NEWS = 6


def norm(s):
    return re.sub(r'\s+', ' ', str(s or '')).strip().casefold()


def slug(s):
    s = norm(s)
    s = re.sub(r'https?://(www\.)?hdnails\.it/?', '', s)
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')


def money(n):
    try:
        n = float(n or 0)
    except Exception:
        n = 0
    return (f'{n:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.') + ' EUR')


def cat(title, desc):
    t = norm(f'{title} {desc}')
    checks = [
        ('kit', 'Kit'),
        ('builder|costrutt|ricostruzione|monofas|monofase|cover', 'Gel da Ricostruzione'),
        ('base gel|rubber base|fiber base|\\bbase\\b', 'Base Gel'),
        ('semipermanent|gelac|smalto|color gel|colore|colors', 'Smalti Semipermanenti'),
        ('acrygel|polygel|poly gel', 'Acrygel'),
        ('top|gloss|lucid|sigillant', 'Lucidi Top Gloss'),
        ('primer|cleaner|remover|prep|liquid|liquido', 'Preparatori & Liquidi'),
        ('glitter|nail art|decor|strass|foil|pigment|cromo', 'Nail Art & Decorazioni'),
        ('dual form|\\btip\\b|cartin', 'Dual Form & Tip'),
        ('lima|lime|buffer', 'Lime & Buffer'),
        ('pennell', 'Pennelli'),
        ('lampada|fresa|attrezz', 'Attrezzature'),
        ('pedicure|mani|mano|piede|cuticol', 'Trattamento Mani'),
    ]
    for rx, value in checks:
        if re.search(rx, t):
            return value
    return 'Altri prodotti'


def load_site_products():
    data = json.loads(SITE_JSON.read_text(encoding='utf-8'))
    out = []
    for p in data:
        name = p.get('nome') or p.get('name') or ''
        url = p.get('url') or p.get('link') or ''
        if not name or not url:
            continue
        price = p.get('prezzo') or 0
        desc = p.get('descrizione') or name
        out.append({
            'id': p.get('id') or slug(url)[:16],
            'sku': p.get('sku') or p.get('id') or slug(url)[:16],
            'nome': name,
            'categoria': p.get('categoria') or cat(name, desc),
            'descrizione': desc,
            'specifiche': p.get('specifiche') or '',
            'disponibilita': p.get('disponibilita') or 'Disponibile',
            'prezzo': float(price or 0),
            'prezzo_str': p.get('prezzo_str') or money(price),
            'immagine': p.get('immagine') or '',
            'link': url,
            'brand': 'HDNails',
        })
    return out


def load_app_keys():
    keys = set()
    if APP_CSV.exists():
        with APP_CSV.open(encoding='utf-8-sig', newline='') as f:
            for r in csv.DictReader(f):
                keys.add(slug(r.get('link') or r.get('url') or ''))
                keys.add(slug(r.get('title') or r.get('nome') or ''))
    text = PATCH.read_text(encoding='utf-8') if PATCH.exists() else ''
    for m in re.finditer(r"link:'([^']+)'|nome:'([^']+)'", text):
        keys.add(slug(m.group(1) or m.group(2) or ''))
    return {k for k in keys if k}


def load_state():
    if STATE.exists():
        return json.loads(STATE.read_text(encoding='utf-8'))
    return {'known_keys': [], 'last_version': current_version(), 'last_news': []}


def current_version():
    text = INDEX.read_text(encoding='utf-8') if INDEX.exists() else ''
    m = re.search(r"APP_VERSION='(\d+)'", text)
    return int(m.group(1)) if m else 1


def product_key(p):
    return slug(p.get('link') or p.get('nome'))


def js_string(s):
    return json.dumps(str(s or ''), ensure_ascii=False)


def js_product(p):
    fields = [
        ('id', p['id']), ('sku', p['sku']), ('nome', p['nome']), ('categoria', p['categoria']),
        ('descrizione', p['descrizione']), ('specifiche', p['specifiche']), ('disponibilita', p['disponibilita']),
        ('prezzo', p['prezzo']), ('prezzo_str', p['prezzo_str']), ('immagine', p['immagine']),
        ('link', p['link']), ('brand', p['brand']),
    ]
    parts = []
    for k, v in fields:
        if k == 'prezzo':
            parts.append(f'{k}:{float(v or 0):g}')
        else:
            parts.append(f'{k}:{js_string(v)}')
    return '{' + ','.join(parts) + '}'


def render_patch(version, extras, news, removed):
    extras_js = '[' + ','.join(js_product(p) for p in extras) + ']'
    news_js = '[' + ','.join(js_product(p) for p in news) + ']'
    removed_js = json.dumps(sorted(removed), ensure_ascii=False)
    return f"""const CATALOG_PATCH_VERSION='{version}';
function cpCsvRows(txt){{let rows=[],row=[],cell='',q=false;for(let i=0;i<txt.length;i++){{let ch=txt[i],nx=txt[i+1];if(ch==='\"'&&q&&nx==='\"'){{cell+='\"';i++;continue}}if(ch==='\"'){{q=!q;continue}}if(ch===','&&!q){{row.push(cell);cell='';continue}}if((ch==='\\n'||ch==='\\r')&&!q){{if(ch==='\\r'&&nx==='\\n')i++;row.push(cell);if(row.some(v=>v!==''))rows.push(row);row=[];cell='';continue}}cell+=ch}}row.push(cell);if(row.some(v=>v!==''))rows.push(row);return rows}}
function cpCsvObjects(txt){{let rows=cpCsvRows(txt),head=rows.shift()||[];return rows.map(r=>Object.fromEntries(head.map((h,i)=>[h,r[i]||''])))}}
function cpPriceNum(s){{let m=String(s||'').replace(',','.').match(/[-+]?\\d*\\.?\\d+/);return m?Number(m[0]):0}}
function cpPriceLabel(n){{return new Intl.NumberFormat('it-IT',{{style:'currency',currency:'EUR'}}).format(n||0)}}
function cpCat(title,desc){{let t=((title||'')+' '+(desc||'')).toLowerCase();if(t.includes('kit'))return'Kit';if(/builder|costrutt|ricostruzione|monofas|monofase|cover/.test(t))return'Gel da Ricostruzione';if(/base gel|rubber base|fiber base|\\bbase\\b/.test(t))return'Base Gel';if(/semipermanent|gelac|smalto|color gel|colore|colors/.test(t))return'Smalti Semipermanenti';if(/acrygel|polygel|poly gel/.test(t))return'Acrygel';if(/top|gloss|lucid|sigillant/.test(t))return'Lucidi Top Gloss';if(/primer|cleaner|remover|prep|liquid|liquido/.test(t))return'Preparatori & Liquidi';if(/glitter|nail art|decor|strass|foil|pigment|cromo/.test(t))return'Nail Art & Decorazioni';if(/dual form|\\btip\\b|cartin/.test(t))return'Dual Form & Tip';if(/lima|lime|buffer/.test(t))return'Lime & Buffer';if(/pennell/.test(t))return'Pennelli';if(/lampada|fresa|attrezz/.test(t))return'Attrezzature';if(/pedicure|mani|mano|piede|cuticol/.test(t))return'Trattamento Mani';return'Altri prodotti'}}
function cpKey(x){{return String((x&&x.link)||'').toLowerCase().replace(/^https?:\\/\\/(www\\.)?hdnails\\.it\\/?/,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||String((x&&x.nome)||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}}
function cpMapProduct(r,i){{let nome=(r.title||'').trim(),descr=(r.description||nome).trim(),prezzo=cpPriceNum(r.price),id=(r.id||('HDN-'+String(i+1).padStart(4,'0'))).trim();return{{id,sku:id,nome,categoria:cpCat(nome,descr),descrizione:descr,specifiche:'',disponibilita:(r.availability||'').trim(),prezzo,prezzo_str:cpPriceLabel(prezzo),immagine:(r.image_link||'').trim(),link:(r.link||'').trim(),brand:(r.brand||'HDNails').trim()}}}}
function cpExtraProducts(){{return {extras_js}}}
function cpNewsProducts(){{return {news_js}}}
function cpRemovedProducts(){{return {removed_js}}}
function cpEsc(s){{return String(s||'').replace(/[&<>\"]/g,m=>({{'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}}[m]))}}
function cpRenderNews(list){{let box=document.getElementById('newsList');if(!box)return;let news=(list&&list.length?list:cpNewsProducts()).slice(0,6);box.innerHTML=news.map(x=>'<article class=\"newsItem\">'+(x.immagine?'<img src=\"'+cpEsc(x.immagine)+'\" alt=\"\">':'')+'<div><b>'+cpEsc(x.nome)+'</b><span>'+cpEsc(x.categoria||'Novita')+'</span><strong>'+cpEsc(x.prezzo_str||cpPriceLabel(x.prezzo))+'</strong></div></article>').join('')}}
function cpMergeExtras(prodotti){{let removed=new Set(cpRemovedProducts()),ids=new Set(prodotti.map(x=>String(x.id).toLowerCase())),names=new Set(prodotti.map(x=>String(x.nome).toLowerCase())) ;prodotti=prodotti.filter(x=>!removed.has(cpKey(x)));cpExtraProducts().forEach(x=>{{if(!removed.has(cpKey(x))&&!ids.has(String(x.id).toLowerCase())&&!names.has(String(x.nome).toLowerCase()))prodotti.push(x)}});window.HD_CATALOG_NEWS=cpNewsProducts();try{{localStorage.hd_catalog_news_v{version}=JSON.stringify(window.HD_CATALOG_NEWS)}}catch(e){{}}return prodotti}}
async function cpLoadCatalogFromCsv(){{try{{let r=await fetch('HDNails_Catalogo_Facebook_Commerce.csv?v='+CATALOG_PATCH_VERSION,{{cache:'no-store'}});let txt=await r.text();let prodotti=cpMergeExtras(cpCsvObjects(txt).map(cpMapProduct).filter(x=>x.nome));if(!prodotti.length)throw Error('catalogo vuoto');S.p=prodotti.map(x=>({{...x,categoria:typeof normCat==='function'?normCat(x.categoria):x.categoria}})).sort(typeof sortProducts==='function'?sortProducts:(a,b)=>String(a.nome).localeCompare(String(b.nome),'it'));localStorage.hd_products_v{version}=JSON.stringify(S.p);cpRenderNews(window.HD_CATALOG_NEWS);if(typeof chips==='function')chips();if(typeof filter==='function')filter();if(typeof cartUI==='function')cartUI();let st=document.querySelector('#status');if(st&&S.p.length)st.textContent='Tutti i prodotti ('+S.p.length+')'}}catch(e){{console.warn('Catalogo CSV non caricato',e);cpRenderNews(cpNewsProducts())}}}}
setTimeout(cpLoadCatalogFromCsv,500);
"""


def bump_files(version):
    idx = INDEX.read_text(encoding='utf-8')
    idx = re.sub(r"APP_VERSION='\d+'", f"APP_VERSION='{version}'", idx)
    idx = re.sub(r'v=\d+', f'v={version}', idx)
    INDEX.write_text(idx, encoding='utf-8')

    sw = SW.read_text(encoding='utf-8')
    sw = re.sub(r'ordini-hd-accademia-v\d+', f'ordini-hd-accademia-v{version}', sw)
    sw = re.sub(r'v=\d+', f'v={version}', sw)
    SW.write_text(sw, encoding='utf-8')

    NOJEKYLL.write_text(f'# Rebuild Pages {datetime.now(timezone.utc).date()} v{version}\n', encoding='utf-8')


def main():
    site = load_site_products()
    if len(site) < 50:
        raise SystemExit('Catalogo sito troppo piccolo, blocco aggiornamento')
    site_by_key = {product_key(p): p for p in site if product_key(p)}
    app_keys = load_app_keys()
    state = load_state()
    known = set(state.get('known_keys') or [])
    if not known:
        state['known_keys'] = sorted(site_by_key)
        state['last_checked'] = datetime.now(timezone.utc).isoformat()
        STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print('Stato inizializzato, nessuna pubblicazione app.')
        return

    new_keys = sorted(k for k in site_by_key if k not in known and k not in app_keys)
    removed_keys = sorted(k for k in known if k not in site_by_key)
    if not new_keys and not removed_keys:
        state['last_checked'] = datetime.now(timezone.utc).isoformat()
        STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print('Nessuna novita catalogo.')
        return

    current_extras = [site_by_key[k] for k in sorted(site_by_key) if k in app_keys and k not in load_app_keys()]
    current_extras = []
    # Keep products already declared in catalog_patch.js if they still exist on the site.
    patch_text = PATCH.read_text(encoding='utf-8')
    for m in re.finditer(r"link:([^,}]+).*?nome:([^,}]+)", patch_text):
        pass

    extras = []
    for k in sorted(site_by_key):
        if k in app_keys or k in new_keys:
            p = site_by_key[k]
            if k not in app_keys or k in new_keys:
                extras.append(p)
    # Preserve manually added HEXA if present and still not in app CSV.
    for p in site:
        if 'hexa-lampada' in product_key(p) and product_key(p) not in {product_key(x) for x in extras}:
            extras.append(p)

    news = [site_by_key[k] for k in new_keys[:MAX_NEWS]] or state.get('last_news') or extras[:MAX_NEWS]
    removed_from_app = [k for k in removed_keys if k in app_keys]
    version = current_version() + 1
    PATCH.write_text(render_patch(version, extras, news, removed_from_app), encoding='utf-8')
    bump_files(version)
    state.update({
        'known_keys': sorted(site_by_key),
        'last_checked': datetime.now(timezone.utc).isoformat(),
        'last_version': version,
        'last_news': news,
        'last_added': new_keys,
        'last_removed': removed_keys,
    })
    STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('Novita aggiunte:', len(new_keys))
    print('Prodotti rimossi/non trovati:', len(removed_keys))
    print('Versione app:', version)


if __name__ == '__main__':
    main()
