'use strict';
const essays=Array.isArray(window.MYEONGDO_ESSAYS)?window.MYEONGDO_ESSAYS:[];
const $=s=>document.querySelector(s);
const escapeHtml=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cards=$('#essay-grid'),reader=$('#reader');
let active=null,size=16,utterance=null,paused=false,readToken=0;
const userAgent=navigator.userAgent||'';
const android=/Android/i.test(userAgent);
const inApp=/(FBAN|FBAV|FB_IAB|Instagram|KAKAOTALK|NAVER\(|Line\/|; wv\)|\bwv\b|DaumApps|Everytime)/i.test(userAgent);
const chromeGuide=$('#chrome-guide');
function canonicalChromeUrl(){
 const url=new URL(window.location.href);
 url.searchParams.set('chrome','1');
 return url.toString();
}
function revealChromeGuide(){
 chromeGuide.hidden=false;
}
function openChrome(){
 const target=canonicalChromeUrl();
 if(android){
  // An explicit tap can open Chrome through Android intent; the browser may block it.
  const u=new URL(target);
  const path=u.pathname+u.search+u.hash;
  const intent='intent://'+u.host+path+'#Intent;scheme='+u.protocol.slice(0,-1)+';package=com.android.chrome;S.browser_fallback_url='+encodeURIComponent(target)+';end';
  window.location.href=intent;
 }else{
  window.open(target,'_blank','noopener,noreferrer');
 }
}
function showSpeechHelp(){
 revealChromeGuide();
 chromeGuide.scrollIntoView({behavior:'smooth',block:'start'});
}
$('#open-chrome').addEventListener('click',openChrome);
$('#copy-chrome-link').addEventListener('click',async()=>{
 const link=canonicalChromeUrl();
 try{await navigator.clipboard.writeText(link);$('#copy-chrome-link').textContent='주소 복사됨';}
 catch(e){window.prompt('아래 주소를 복사하여 크롬 주소창에 붙여 넣으세요.',link)}
});
$('#chrome-guide-close').addEventListener('click',()=>{chromeGuide.hidden=true});
$('#reading-help').addEventListener('click',showSpeechHelp);
if(inApp){
 revealChromeGuide();
 // A one-time automatic Chrome hand-off is attempted only for Android in-app browsers.
 // User gesture is generally required by most webviews; the visible button is fallback.
 if(android&&!new URL(location.href).searchParams.has('chrome')){
  const key='myeongdo-chrome-offer:'+location.pathname;
  try{
   if(!sessionStorage.getItem(key)){
    sessionStorage.setItem(key,'1');
    openChrome();
   }
  }catch(e){/* Embedded browsers may disable session storage. */}
 }
}
function shortNumber(n){return '제'+String(n).padStart(2,'0')+'편'}
function renderCards(query=''){
 const q=query.trim().toLocaleLowerCase('ko');
 const matches=essays.filter(e=>[e.title,e.subtitle,e.motif,e.text].some(v=>String(v).toLocaleLowerCase('ko').includes(q)));
 cards.innerHTML=matches.map(e=>'<article class="essay-card"><a href="#essay-'+e.number+'" data-essay="'+e.number+'" aria-label="'+escapeHtml(shortNumber(e.number)+' '+e.title)+' 전문 읽기"><img src="'+escapeHtml(e.illustrationUrl||("images/"+encodeURIComponent(e.illustration)+".svg"))+'" loading="lazy" alt="'+escapeHtml(e.motif+' 삽화')+'"><div class="card-copy"><span class="card-num">'+shortNumber(e.number)+'</span><h3 class="card-title">'+escapeHtml(e.title)+'</h3><p class="card-subtitle">'+escapeHtml(e.subtitle)+'</p><span class="card-hint">작품 읽기 →</span></div></a></article>').join('');
 $('#empty-state').hidden=cards.children.length!==0;
}
function renderParagraph(p,e){
 if(p==='〔삽입시 끝〕')return '';
 if(p.startsWith('〔삽입시〕'))return '<p class="poem-heading">'+escapeHtml(p.replace('〔삽입시〕','').trim())+'</p>';
 const head=e.text.indexOf('〔삽입시〕'),tail=e.text.indexOf('〔삽입시 끝〕'),start=e.text.indexOf(p);
 const inPoem=head>=0&&tail>head&&start>head&&start<tail;
 const s=escapeHtml(p).replace(/\n/g,'<br>'),key=e.highlight?escapeHtml(e.highlight):'',at=key?s.indexOf(key):-1;
 return '<p'+(inPoem?' class="poem-stanza"':'')+'>'+(at===-1?s:s.slice(0,at)+'<strong class="key-line">'+key+'</strong>'+s.slice(at+key.length))+'</p>';
}
function openEssay(n,push=true){
 const e=essays.find(x=>x.number===n);if(!e)return;
 stopReading();active=e;
 $('#article-number').textContent=shortNumber(e.number)+' · 명도재 생활수필';
 $('#article-title').textContent=e.title;$('#article-subtitle').textContent=e.subtitle;
 const img=$('#article-img');img.src=e.illustrationUrl||('images/'+encodeURIComponent(e.illustration)+'.svg');img.alt=e.motif+'을 소재로 한 삽화';
 $('#article-body').innerHTML=e.text.split(/\n\s*\n/).map(x=>renderParagraph(x,e)).join('');
 $('#previous-essay').disabled=!essays.some(x=>x.number===n-1);
 $('#next-essay').disabled=!essays.some(x=>x.number===n+1);
 reader.hidden=false;if(push)history.pushState({essay:n},'', '#essay-'+n);
 requestAnimationFrame(()=>reader.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'}));
}
function stopReading(){readToken++;if('speechSynthesis'in window)speechSynthesis.cancel();utterance=null;paused=false;$('#read-aloud').textContent='▶ 듣기'}
function readEssay(){
 if(!active)return;if(!('speechSynthesis'in window)){showSpeechHelp();return}
 if(utterance){if(paused){speechSynthesis.resume();paused=false;$('#read-aloud').textContent='⏸ 일시정지'}else{speechSynthesis.pause();paused=true;$('#read-aloud').textContent='▶ 이어 듣기'}return}
 stopReading();const token=readToken;const body=active.title+'. '+active.text.replace(/〔삽입시〕|〔삽입시 끝〕/g,'').replace(/\n+/g,' ');
 const chunks=body.match(/.{1,125}(?:[.!?。]|$)/g)||[body];const voice=speechSynthesis.getVoices().find(v=>/^ko/i.test(v.lang));let index=0;
 function next(){if(token!==readToken)return;if(index>=chunks.length){utterance=null;$('#read-aloud').textContent='▶ 듣기';return}const u=new SpeechSynthesisUtterance(chunks[index++]);u.lang='ko-KR';if(voice)u.voice=voice;u.rate=.86;u.onend=next;u.onerror=()=>{utterance=null;$('#read-aloud').textContent='▶ 듣기';showSpeechHelp()};utterance=u;speechSynthesis.speak(u)}
 $('#read-aloud').textContent='⏸ 일시정지';next();
}
function route(){const m=location.hash.match(/^#essay-(\d+)$/);if(m)openEssay(Number(m[1]),false);else{stopReading();reader.hidden=true;active=null}}
cards.addEventListener('click',ev=>{const link=ev.target.closest('[data-essay]');if(!link)return;ev.preventDefault();openEssay(Number(link.dataset.essay))});
$('#search').addEventListener('input',ev=>renderCards(ev.target.value));
$('#larger').onclick=()=>{size=Math.min(22,size+1);$('#article-body').style.fontSize=size+'px'};
$('#smaller').onclick=()=>{size=Math.max(13,size-1);$('#article-body').style.fontSize=size+'px'};
$('#read-aloud').onclick=readEssay;$('#stop-aloud').onclick=stopReading;
$('#previous-essay').onclick=()=>{if(active)openEssay(active.number-1)};
$('#next-essay').onclick=()=>{if(active)openEssay(active.number+1)};
$('#back-works').addEventListener('click',()=>{stopReading();reader.hidden=true;active=null});
window.addEventListener('hashchange',route);window.addEventListener('popstate',route);window.addEventListener('pagehide',stopReading);
renderCards();route();

const newspaperDialog=$('#newspaper-dialog');
function openNewspaper(){if(typeof newspaperDialog.showModal==='function')newspaperDialog.showModal();else newspaperDialog.setAttribute('open','')}
function closeNewspaper(){if(typeof newspaperDialog.close==='function')newspaperDialog.close();else newspaperDialog.removeAttribute('open')}
$('#newspaper-open').addEventListener('click',openNewspaper);
$('#newspaper-image-button').addEventListener('click',openNewspaper);
$('#newspaper-close').addEventListener('click',closeNewspaper);
$('#newspaper-read').addEventListener('click',closeNewspaper);
newspaperDialog.addEventListener('click',e=>{if(e.target===newspaperDialog)closeNewspaper()});

const bookPreviewDialog=$('#book-preview-dialog');
$('#book-preview-dialog-body').appendChild(document.querySelector('.book-preview-scene').cloneNode(true));
$('#book-preview-button').addEventListener('click',()=>{if(typeof bookPreviewDialog.showModal==='function')bookPreviewDialog.showModal();else bookPreviewDialog.setAttribute('open','')});
$('#book-preview-close').addEventListener('click',()=>{if(typeof bookPreviewDialog.close==='function')bookPreviewDialog.close();else bookPreviewDialog.removeAttribute('open')});
bookPreviewDialog.addEventListener('click',e=>{if(e.target===bookPreviewDialog)bookPreviewDialog.close()});
