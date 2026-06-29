const PATCH_ORDER_EMAIL='accademiasavona@gmail.com';
const PATCH_ORDER_WA='393924983127';
function patchCsvCell(v){return '"'+String(v??'').replace(/"/g,'""')+'"'}
function patchDaneaCsv(){
  try{
    if(typeof downloadDaneaCsv==='function'){downloadDaneaCsv();return;}
    let ids=Object.keys(S.cart||{}).filter(id=>prod(id));
    if(!ids.length)return;
    let now=new Date();
    let ordine='ORD-'+now.getFullYear()+String(now.getMonth()+1).padStart(2,'0')+String(now.getDate()).padStart(2,'0')+'-'+String(now.getHours()).padStart(2,'0')+String(now.getMinutes()).padStart(2,'0')+String(now.getSeconds()).padStart(2,'0');
    let c=S.client||{};
    let cust=(document.querySelector('#cust')?.value||'').trim();
    let note=(document.querySelector('#note')?.value||'').trim();
    let rows=[['NumeroOrdine','Data','Cliente','PartitaIVA_CF','Indirizzo','CAP','Citta','Provincia','Telefono','Email','CodiceArticolo','Descrizione','Quantita','PrezzoUnitario','TotaleRiga','Note']];
    ids.forEach(id=>{let x=prod(id),q=S.cart[id],line=q*x.prezzo;rows.push([ordine,now.toLocaleDateString('it-IT'),c.nome||cust,c.piva||'',c.indirizzo||'',c.cap||'',c.citta||'',c.prov||'',c.tel||'',c.email||'',x.sku||x.id,x.nome,q,String(x.prezzo).replace('.',','),String(line.toFixed(2)).replace('.',','),note])});
    let csv='\ufeff'+rows.map(r=>r.map(patchCsvCell).join(';')).join('\r\n');
    let blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
    let a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=ordine+'_Danea_Easyfatt.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);
  }catch(e){console.warn('CSV Danea non generato',e)}
}
function patchMail(){
  if(!req())return;
  saveOrder();
  patchDaneaCsv();
  let subj='Ordine ORDINI_HD_ACCADEMIA - '+(S.client?.nome||document.querySelector('#cust')?.value.trim()||'Cliente');
  setTimeout(()=>{location.href='mailto:'+PATCH_ORDER_EMAIL+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(text())},250);
}
function patchWa(){
  if(!req())return;
  saveOrder();
  patchDaneaCsv();
  setTimeout(()=>{location.href='https://wa.me/'+PATCH_ORDER_WA+'?text='+encodeURIComponent(text())},250);
}
function patchPrintOrder(){
  if(!req())return;
  saveOrder();
  patchDaneaCsv();
  document.querySelector('#printArea').innerHTML='<h1>ORDINI_HD_ACCADEMIA</h1><pre>'+esc(text())+'</pre>';
  setTimeout(()=>window.print(),250);
}
setTimeout(()=>{
  if(document.querySelector('#mail'))document.querySelector('#mail').onclick=patchMail;
  if(document.querySelector('#wa'))document.querySelector('#wa').onclick=patchWa;
  if(document.querySelector('#print'))document.querySelector('#print').onclick=patchPrintOrder;
},300);