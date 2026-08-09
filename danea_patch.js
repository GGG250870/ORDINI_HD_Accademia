const PATCH_ORDER_EMAIL='ordiniaccademiasavona@gmail.com';
const PATCH_ORDER_WA='393924983127';
function patchCsvCell(v){return '"'+String(v??'').replace(/"/g,'""')+'"'}
function patchOrderStamp(){
  let now=new Date();
  return {
    now,
    code:'ORD-'+now.getFullYear()+String(now.getMonth()+1).padStart(2,'0')+String(now.getDate()).padStart(2,'0')+'-'+String(now.getHours()).padStart(2,'0')+String(now.getMinutes()).padStart(2,'0')+String(now.getSeconds()).padStart(2,'0')
  };
}
function patchBuildDaneaCsv(){
  let ids=Object.keys(S.cart||{}).filter(id=>prod(id));
  if(!ids.length)return null;
  let {now,code}=patchOrderStamp();
  let c=S.client||{};
  let cust=(document.querySelector('#cust')?.value||'').trim();
  let note=(document.querySelector('#note')?.value||'').trim();
  let rows=[['NumeroOrdine','Data','Cliente','PartitaIVA_CF','Indirizzo','CAP','Citta','Provincia','Telefono','Email','CodiceArticolo','Descrizione','Quantita','PrezzoUnitario','TotaleRiga','Note']];
  ids.forEach(id=>{let x=prod(id),q=S.cart[id],line=q*x.prezzo;rows.push([code,now.toLocaleDateString('it-IT'),c.nome||cust,c.piva||'',c.indirizzo||'',c.cap||'',c.citta||'',c.prov||'',c.tel||'',c.email||'',x.sku||x.id,x.nome,q,String(x.prezzo).replace('.',','),String(line.toFixed(2)).replace('.',','),note])});
  return {code, csv:'\ufeff'+rows.map(r=>r.map(patchCsvCell).join(';')).join('\r\n'), filename:code+'_Danea_Easyfatt.csv'};
}
function patchDownloadBlob(blob,filename){
  let a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800);
}
function patchBase64Utf8(text){
  let bytes=new TextEncoder().encode(text);
  let bin='';
  for(let i=0;i<bytes.length;i+=0x8000){
    bin+=String.fromCharCode(...bytes.subarray(i,i+0x8000));
  }
  return btoa(bin).replace(/.{1,76}/g,'$&\r\n').trim();
}
function patchMimeHeader(text){return '=?UTF-8?B?'+patchBase64Utf8(text).replace(/\r?\n/g,'')+'?='}
function patchBuildEmailWithCsv(){
  let data=patchBuildDaneaCsv();
  if(!data)return null;
  let subj='Ordine ORDINI_HD_ACCADEMIA - '+(S.client?.nome||document.querySelector('#cust')?.value.trim()||'Cliente');
  let boundary='----ORDINI_HD_ACCADEMIA_'+Date.now();
  let body=text();
  let eml=[
    'To: '+PATCH_ORDER_EMAIL,
    'Subject: '+patchMimeHeader(subj),
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="'+boundary+'"',
    '',
    '--'+boundary,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    patchBase64Utf8(body),
    '',
    '--'+boundary,
    'Content-Type: text/csv; charset="UTF-8"; name="'+data.filename+'"',
    'Content-Transfer-Encoding: base64',
    'Content-Disposition: attachment; filename="'+data.filename+'"',
    '',
    patchBase64Utf8(data.csv),
    '',
    '--'+boundary+'--',
    ''
  ].join('\r\n');
  return {eml, filename:data.code+'_email_con_allegato_danea.eml'};
}
function patchDaneaCsv(){
  try{
    let data=patchBuildDaneaCsv();
    if(!data)return;
    patchDownloadBlob(new Blob([data.csv],{type:'text/csv;charset=utf-8'}),data.filename);
  }catch(e){console.warn('CSV Danea non generato',e)}
}
function patchMail(){
  if(!req())return;
  saveOrder();
  try{
    let mail=patchBuildEmailWithCsv();
    if(!mail)return;
    patchDownloadBlob(new Blob([mail.eml],{type:'message/rfc822;charset=utf-8'}),mail.filename);
    setTimeout(()=>alert('Ho scaricato una email pronta (.eml) gia indirizzata a '+PATCH_ORDER_EMAIL+' con il CSV Danea allegato. Apri il file scaricato e premi Invia.'),400);
  }catch(e){
    console.warn('Email con allegato non generata',e);
    patchDaneaCsv();
    alert('Non riesco a creare automaticamente la mail con allegato su questo dispositivo. Ho scaricato il CSV Danea: allegalo manualmente a una mail per '+PATCH_ORDER_EMAIL+'.');
  }
}
function patchWa(){
  if(!req())return;
  saveOrder();
  patchDaneaCsv();
  setTimeout(()=>{location.href='https://wa.me/'+PATCH_ORDER_WA+'?text='+encodeURIComponent(text())},300);
}
function patchPrintOrder(){
  if(!req())return;
  saveOrder();
  patchDaneaCsv();
  document.querySelector('#printArea').innerHTML='<h1>ORDINI_HD_ACCADEMIA</h1><pre>'+esc(text())+'</pre>';
  setTimeout(()=>window.print(),300);
}

/* Macro-categorie catalogo, allineate alla logica del sito HD Nails */
const HD_GROUP_ORDER=[
  'Costruttori',
  'Gel in bottiglia',
  'Basi',
  'Top / Lucidi',
  'Colori',
  'Acrygel / Polygel',
  'Preparatori e Liquidi',
  'Nail Art / Decorazioni',
  'Dual Form / Tip',
  'Lime / Buffer',
  'Pennelli',
  'Strumenti',
  'Attrezzature',
  'Mani / Pedicure',
  'Kit',
  'Altri prodotti'
];

function hdGroup(x){
  const c=String(x?.categoria||'').toLowerCase();
  const n=String(x?.nome||'').toLowerCase();
  const t=(c+' '+n).replace(/[_-]+/g,' ');

  /* esclusione definitiva epilazione laser */
  if(/laser|epilaz/.test(t)) return '__EXCLUDE__';

  if(/kit/.test(c)||/^kit\b/.test(n)) return 'Kit';
  if(/top|gloss|lucid|sigillant|finish/.test(t)) return 'Top / Lucidi';
  if(/base gel|base rubber|flexy base|fiber base|base extra|gelac base|\bbase\b/.test(t)) return 'Basi';
  if(/gel in bottiglia/.test(c)) return 'Gel in bottiglia';
  if(/acrygel|polygel|poly gel/.test(t)) return 'Acrygel / Polygel';
  if(/costrutt|builder|monofas|monofase|jelly cover|creamy cover|easy cover|gel da ricostruzione/.test(t)) return 'Costruttori';
  if(/semipermanent|gelac color|color gel|colore|smalt/.test(t)) return 'Colori';
  if(/primer|prep|deidrat|cleaner|remover|liquid|liquidi/.test(t)) return 'Preparatori e Liquidi';
  if(/nail art|decoraz|glitter|cromat|pigment|foil|sticker|strass|paint/.test(t)) return 'Nail Art / Decorazioni';
  if(/dual form|\btip\b|nail form|cartin/.test(t)) return 'Dual Form / Tip';
  if(/lime|lima|buffer/.test(t)) return 'Lime / Buffer';
  if(/pennell/.test(t)) return 'Pennelli';
  if(/strument|spingicuticole|tronches|forbic|pinz/.test(t)) return 'Strumenti';
  if(/attrezz|lampad|fresa|aspirator/.test(t)) return 'Attrezzature';
  if(/trattamento mani|pedicure|mano|mani|piede|piedi|cuticol/.test(t)) return 'Mani / Pedicure';
  return 'Altri prodotti';
}

function hdVisibleProducts(){return (S.p||[]).filter(x=>hdGroup(x)!=='__EXCLUDE__')}

chips=function(){
  const counts={};
  hdVisibleProducts().forEach(x=>{const g=hdGroup(x);counts[g]=(counts[g]||0)+1});
  const total=Object.values(counts).reduce((a,b)=>a+b,0);
  let h='<button class="chip on" data-c="ALL">Tutti '+total+'</button>';
  HD_GROUP_ORDER.forEach(g=>{if(counts[g])h+=`<button class="chip" data-c="${esc(g)}">${esc(g)} ${counts[g]}</button>`});
  $('#chips').innerHTML=h;
  $$('.chip').forEach(b=>b.onclick=()=>{S.mode='ALL';S.cat=b.dataset.c;S.q='';$('#search').value='';setChip();filter()});
};

filter=function(){
  let arr=hdVisibleProducts();
  if(S.mode==='FAV')arr=arr.filter(x=>S.fav.includes(x.id));
  if(S.mode==='NEWS')arr=arr.slice(-60).reverse();
  S.f=arr.filter(x=>
    (S.cat==='ALL'||hdGroup(x)===S.cat) &&
    (!S.q||(x.nome+' '+x.categoria+' '+hdGroup(x)+' '+x.descrizione+' '+x.sku).toLowerCase().includes(S.q))
  ).sort(sortProducts);
  S.v=0;
  $('#grid').innerHTML='';
  let label=S.mode==='FAV'?'Preferiti':S.mode==='NEWS'?'Novità':(S.cat==='ALL'?'Tutti i prodotti':S.cat);
  $('#status').textContent=label+' ('+S.f.length+')';
  more();
};

setTimeout(()=>{
  if(document.querySelector('#mail'))document.querySelector('#mail').onclick=patchMail;
  if(document.querySelector('#wa'))document.querySelector('#wa').onclick=patchWa;
  if(document.querySelector('#print'))document.querySelector('#print').onclick=patchPrintOrder;

  let tries=0;
  const refreshGroups=()=>{
    tries++;
    if(typeof S!=='undefined'&&Array.isArray(S.p)&&S.p.length){
      chips();
      filter();
      return;
    }
    if(tries<40)setTimeout(refreshGroups,250);
  };
  refreshGroups();
},300);