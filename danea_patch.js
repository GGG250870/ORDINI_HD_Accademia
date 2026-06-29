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
setTimeout(()=>{
  if(document.querySelector('#mail'))document.querySelector('#mail').onclick=patchMail;
  if(document.querySelector('#wa'))document.querySelector('#wa').onclick=patchWa;
  if(document.querySelector('#print'))document.querySelector('#print').onclick=patchPrintOrder;
},300);