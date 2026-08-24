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


def norm(value):
    return re.sub(r'\s+', ' ', str(value or '')).strip().casefold()


def key(value):
    value = norm(value)
    value = re.sub(r'https?://(www\.)?hdnails\.it/?', '', value)
    value = re.sub(r'[^a-z0-9]+', '-', value)
    return value.strip('-')


def product_key(product):
    return key(product.get('link') or product.get('url') or product.get('nome'))


def money(value):
    try:
        number = float(value or 0)
    except Exception:
        number = 0
    return new_money(number)


def new_money(number):
    return f'{number:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.') + ' EUR'


def category(title, description):
    text = norm(f'{title} {description}')
    rules = [
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
    for pattern, label in rules:
        if re.search(pattern, text):
            return label
    return 'Altri prodotti'


def load_site_products():
    data = json.loads(SITE_JSON.read_text(encoding='utf-8'))
    products = []
    for item in data:
        name = item.get('nome') or item.get('name') or ''
        url = item.get('url') or item.get('link') or ''
        if not name or not url:
            continue
        price = float(item.get('prezzo') or 0)
        description = item.get('descrizione') or name
        stable = item.get('sku') or item.get('id') or key(url)[:16]
        products.append({
            'id': str(item.get('id') or stable),
            'sku': str(stable),
            'nome': name,
            'categoria': item.get('categoria') or category(name, description),
            'descrizione': description,
            'specifiche': item.get('specifiche') or '',
            'disponibilita': item.get('disponibilita') or 'Disponibile',
            'prezzo': price,
            'prezzo_str': item.get('prezzo_str') or new_money(price),
            'immagine': item.get('immagine') or '',
            'link': url,
            'brand': 'HDNails',
        })
    return products


def load_csv_keys():
    keys = set()
    if not APP_CSV.exists():
        return keys
    with APP_CSV.open(encoding='utf-8-sig', newline='') as handle:
        for row in csv.DictReader(handle):
            keys.add(key(row.get('link') or row.get('url') or ''))
            keys.add(key(row.get('title') or row.get('nome') or ''))
    return {item for item in keys if item}


def load_patch_keys():
    if not PATCH.exists():
        return set()
    text = PATCH.read_text(encoding='utf-8')
    links = re.findall(r"link:(?:'|\")([^'\"]+)(?:'|\")", text)
    names = re.findall(r"nome:(?:'|\")([^'\"]+)(?:'|\")", text)
    return {key(item) for item in [*links, *names] if key(item)}


def load_state():
    if STATE.exists():
        return json.loads(STATE.read_text(encoding='utf-8'))
    return {'known_keys': [], 'extra_keys': [], 'removed_keys': [], 'last_news': []}


def current_version():
    text = INDEX.read_text(encoding='utf-8') if INDEX.exists() else ''
    match = re.search(r"APP_VERSION='(\d+)'", text)
    return int(match.group(1)) if match else 1


def js_string(value):
    return json.dumps(str(value or ''), ensure_ascii=False)


def js_product(product):
    fields = ['id', 'sku', 'nome', 'categoria', 'descrizione', 'specifiche', 'disponibilita', 'prezzo', 'prezzo_str', 'immagine', 'link', 'brand']
    parts = []
    for field in fields:
        value = product.get(field, '')
        if field == 'prezzo':
            parts.append(f'{field}:{float(value or 0):g}')
        else:
            parts.append(f'{field}:{js_string(value)}')
    return '{' + ','.join(parts) + '}'


def render_patch(version, extras, news, removed):
    extras_js = '[' + ','.join(js_product(product) for product in extras) + ']'
    news_js = '[' + ','.join(js_product(product) for product in news) + ']'
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
function cpMergeExtras(prodotti){{let removed=new Set(cpRemovedProducts()),ids=new Set(prodotti.map(x=>String(x.id).toLowerCase())),names=new Set(prodotti.map(x=>String(x.nome).toLowerCase()));prodotti=prodotti.filter(x=>!removed.has(cpKey(x)));cpExtraProducts().forEach(x=>{{if(!removed.has(cpKey(x))&&!ids.has(String(x.id).toLowerCase())&&!names.has(String(x.nome).toLowerCase()))prodotti.push(x)}});window.HD_CATALOG_NEWS=cpNewsProducts();try{{localStorage.hd_catalog_news_v{version}=JSON.stringify(window.HD_CATALOG_NEWS)}}catch(e){{}}return prodotti}}
async function cpLoadCatalogFromCsv(){{try{{let r=await fetch('HDNails_Catalogo_Facebook_Commerce.csv?v='+CATALOG_PATCH_VERSION,{{cache:'no-store'}});let txt=await r.text();let prodotti=cpMergeExtras(cpCsvObjects(txt).map(cpMapProduct).filter(x=>x.nome));if(!prodotti.length)throw Error('catalogo vuoto');S.p=prodotti.map(x=>({{...x,categoria:typeof normCat==='function'?normCat(x.categoria):x.categoria}})).sort(typeof sortProducts==='function'?sortProducts:(a,b)=>String(a.nome).localeCompare(String(b.nome),'it'));localStorage.hd_products_v{version}=JSON.stringify(S.p);cpRenderNews(window.HD_CATALOG_NEWS);if(typeof chips==='function')chips();if(typeof filter==='function')filter();if(typeof cartUI==='function')cartUI();let st=document.querySelector('#status');if(st&&S.p.length)st.textContent='Tutti i prodotti ('+S.p.length+')'}}catch(e){{console.warn('Catalogo CSV non caricato',e);cpRenderNews(cpNewsProducts())}}}}
setTimeout(cpLoadCatalogFromCsv,500);
"""


def bump_files(version):
    index = INDEX.read_text(encoding='utf-8')
    index = re.sub(r"APP_VERSION='\d+'", f"APP_VERSION='{version}'", index)
    index = re.sub(r'v=\d+', f'v={version}', index)
    INDEX.write_text(index, encoding='utf-8')

    worker = SW.read_text(encoding='utf-8')
    worker = re.sub(r'ordini-hd-accademia-v\d+', f'ordini-hd-accademia-v{version}', worker)
    worker = re.sub(r'v=\d+', f'v={version}', worker)
    SW.write_text(worker, encoding='utf-8')

    NOJEKYLL.write_text(f'# Rebuild Pages {datetime.now(timezone.utc).date()} v{version}\n', encoding='utf-8')


def main():
    site_products = load_site_products()
    if len(site_products) < 50:
        raise SystemExit('Catalogo sito troppo piccolo, blocco aggiornamento')

    site_by_key = {product_key(product): product for product in site_products if product_key(product)}
    csv_keys = load_csv_keys()
    patch_keys = load_patch_keys()
    app_keys = csv_keys | patch_keys
    state = load_state()
    known = set(state.get('known_keys') or [])

    if not known:
        extra_keys = sorted(key for key in patch_keys if key in site_by_key and key not in csv_keys)
        state.update({
            'known_keys': sorted(site_by_key),
            'extra_keys': extra_keys,
            'removed_keys': [],
            'last_news': [site_by_key[key] for key in extra_keys[:MAX_NEWS]],
            'last_checked': datetime.now(timezone.utc).isoformat(),
        })
        STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print('Stato inizializzato, nessuna pubblicazione app.')
        return

    new_keys = sorted(key for key in site_by_key if key not in known and key not in app_keys)
    removed_keys = sorted(key for key in known if key not in site_by_key)
    if not new_keys and not removed_keys:
        print('Nessuna novita catalogo.')
        return

    extra_keys = set(state.get('extra_keys') or []) | {key for key in patch_keys if key in site_by_key and key not in csv_keys} | set(new_keys)
    removed_state = (set(state.get('removed_keys') or []) | {key for key in removed_keys if key in app_keys})
    extra_keys = {key for key in extra_keys if key in site_by_key and key not in removed_state and key not in csv_keys}

    extras = [site_by_key[key] for key in sorted(extra_keys)]
    news = [site_by_key[key] for key in new_keys[:MAX_NEWS]]
    if not news:
        news = [item for item in state.get('last_news', []) if product_key(item) in site_by_key][:MAX_NEWS]
    version = current_version() + 1

    PATCH.write_text(render_patch(version, extras, news, removed_state), encoding='utf-8')
    bump_files(version)
    state.update({
        'known_keys': sorted(site_by_key),
        'extra_keys': sorted(extra_keys),
        'removed_keys': sorted(removed_state),
        'last_news': news,
        'last_added': new_keys,
        'last_removed': removed_keys,
        'last_checked': datetime.now(timezone.utc).isoformat(),
        'last_version': version,
    })
    STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('Novita aggiunte:', len(new_keys))
    print('Prodotti rimossi/non trovati:', len(removed_keys))
    print('Versione app:', version)


if __name__ == '__main__':
    main()
